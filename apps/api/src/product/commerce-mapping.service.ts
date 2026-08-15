import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommerceNormalizeError,
  canonicalizeCommerceIdentity,
  normalizeCommerceMappingSet,
  type CommerceMappingSet as DomainCommerceMappingSet,
  type CommerceRevisionChoice,
} from '@repo/product-graph';
import { PrismaService } from '../prisma/prisma.service';

const mappingSetInclude = {
  identityChoices: {
    include: { choice: true },
    orderBy: { sortOrder: 'asc' as const },
  },
  mappings: {
    include: {
      terms: {
        include: {
          choiceValue: { include: { choice: true } },
        },
      },
    },
    orderBy: { id: 'asc' as const },
  },
} as const;

@Injectable()
export class CommerceMappingService {
  constructor(private readonly prisma: PrismaService) {}

  async listByRevision(productRevisionId: string) {
    return this.prisma.commerceMappingSet.findMany({
      where: { productRevisionId },
      include: mappingSetInclude,
      orderBy: { provider: 'asc' },
    });
  }

  async getById(id: string) {
    const set = await this.prisma.commerceMappingSet.findUnique({
      where: { id },
      include: mappingSetInclude,
    });
    if (!set) {
      throw new NotFoundException('Commerce mapping set not found');
    }
    return set;
  }

  async getByRevisionProvider(productRevisionId: string, provider: string) {
    const set = await this.prisma.commerceMappingSet.findUnique({
      where: {
        productRevisionId_provider: {
          productRevisionId,
          provider,
        },
      },
      include: mappingSetInclude,
    });
    if (!set) {
      throw new NotFoundException(
        `Commerce mapping set not found for provider ${provider}`
      );
    }
    return set;
  }

  async normalizePersisted(
    set: Awaited<ReturnType<CommerceMappingService['listByRevision']>>[number]
  ): Promise<DomainCommerceMappingSet> {
    const revision = await this.prisma.productRevision.findUnique({
      where: { id: set.productRevisionId },
      include: {
        choices: { include: { values: true } },
      },
    });
    if (!revision) {
      throw new NotFoundException('Product revision not found');
    }

    const revisionChoices: CommerceRevisionChoice[] = revision.choices.map(
      (choice) => ({
        key: choice.key,
        required: choice.required,
        values: choice.values.map((value) => ({ key: value.key })),
      })
    );

    try {
      return normalizeCommerceMappingSet({
        productRevisionId: set.productRevisionId,
        provider: set.provider,
        identityChoiceKeys: set.identityChoices.map(
          (entry) => entry.choice.key
        ),
        revisionChoices,
        mappings: set.mappings.map((mapping) => ({
          externalId: mapping.externalId,
          sku: mapping.sku,
          terms: mapping.terms.map((term) => ({
            choiceKey: term.choiceValue.choice.key,
            valueKey: term.choiceValue.key,
          })),
        })),
      });
    } catch (error) {
      if (error instanceof CommerceNormalizeError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async replaceMappingSet(input: {
    productRevisionId: string;
    provider: string;
    identityChoiceIds: string[];
    mappings: Array<{
      choiceValueIds: string[];
      externalId: string;
      sku?: string | null;
    }>;
  }) {
    const revision = await this.prisma.productRevision.findUnique({
      where: { id: input.productRevisionId },
      include: {
        choices: { include: { values: true } },
      },
    });
    if (!revision) {
      throw new NotFoundException('Product revision not found');
    }
    if (revision.status !== 'DRAFT') {
      throw new BadRequestException(
        'Commerce mapping sets can only be authored on DRAFT revisions'
      );
    }

    const provider = input.provider.trim();
    if (!provider) {
      throw new BadRequestException('provider is required');
    }

    const choiceById = new Map(
      revision.choices.map((choice) => [choice.id, choice])
    );
    const valueById = new Map(
      revision.choices.flatMap((choice) =>
        choice.values.map((value) => [value.id, { value, choice }] as const)
      )
    );

    if (
      input.identityChoiceIds.length !== new Set(input.identityChoiceIds).size
    ) {
      throw new BadRequestException('identityChoiceIds must be unique');
    }

    const identityChoices = input.identityChoiceIds.map((choiceId, index) => {
      const choice = choiceById.get(choiceId);
      if (!choice) {
        throw new BadRequestException(
          `Choice ${choiceId} is not on product revision ${input.productRevisionId}`
        );
      }
      return { choice, sortOrder: index };
    });

    const revisionChoices: CommerceRevisionChoice[] = revision.choices.map(
      (choice) => ({
        key: choice.key,
        required: choice.required,
        values: choice.values.map((value) => ({ key: value.key })),
      })
    );

    const authoredMappings = input.mappings.map((mapping) => {
      const terms = mapping.choiceValueIds.map((choiceValueId) => {
        const found = valueById.get(choiceValueId);
        if (!found) {
          throw new BadRequestException(
            `ChoiceValue ${choiceValueId} is not on product revision ${input.productRevisionId}`
          );
        }
        return {
          choiceKey: found.choice.key,
          valueKey: found.value.key,
          choiceValueId: found.value.id,
        };
      });
      return {
        externalId: mapping.externalId,
        sku: mapping.sku,
        terms,
      };
    });

    let domain: DomainCommerceMappingSet;
    try {
      domain = normalizeCommerceMappingSet({
        productRevisionId: input.productRevisionId,
        provider,
        identityChoiceKeys: identityChoices.map((entry) => entry.choice.key),
        revisionChoices,
        mappings: authoredMappings.map((mapping) => ({
          externalId: mapping.externalId,
          sku: mapping.sku,
          terms: mapping.terms.map((term) => ({
            choiceKey: term.choiceKey,
            valueKey: term.valueKey,
          })),
        })),
      });
    } catch (error) {
      if (error instanceof CommerceNormalizeError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.commerceMappingSet.deleteMany({
        where: {
          productRevisionId: input.productRevisionId,
          provider,
        },
      });

      return tx.commerceMappingSet.create({
        data: {
          productRevisionId: input.productRevisionId,
          provider,
          identityChoices: {
            create: identityChoices.map((entry) => ({
              choiceId: entry.choice.id,
              sortOrder: entry.sortOrder,
            })),
          },
          mappings: {
            create: domain.mappings.map((mapping, index) => {
              const source = authoredMappings[index]!;
              return {
                identitySignature: canonicalizeCommerceIdentity(
                  domain.identityChoiceKeys,
                  mapping.identity
                ),
                externalType: 'VARIANT',
                externalId: mapping.externalReference.id,
                sku: mapping.externalReference.sku ?? null,
                terms: {
                  create: source.terms.map((term) => ({
                    choiceValueId: term.choiceValueId,
                  })),
                },
              };
            }),
          },
        },
        include: mappingSetInclude,
      });
    });
  }

  async deleteMappingSet(id: string) {
    const existing = await this.prisma.commerceMappingSet.findUnique({
      where: { id },
      include: { productRevision: true },
    });
    if (!existing) {
      throw new NotFoundException('Commerce mapping set not found');
    }
    if (existing.productRevision.status !== 'DRAFT') {
      throw new BadRequestException(
        'Commerce mapping sets can only be deleted on DRAFT revisions'
      );
    }
    await this.prisma.commerceMappingSet.delete({ where: { id } });
    return true;
  }

  async assertChoiceValueNotReferenced(choiceValueId: string) {
    const refs = await this.prisma.commerceMappingTerm.findMany({
      where: { choiceValueId },
      select: { mappingId: true },
    });
    if (refs.length === 0) return;
    const ids = [...new Set(refs.map((ref) => ref.mappingId))];
    throw new BadRequestException(
      `ChoiceValue is referenced by CommerceMapping(s): ${ids.join(', ')}. Resolve commerce mappings before deleting.`
    );
  }
}
