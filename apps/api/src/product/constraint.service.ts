import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  assertConstraintValueSet,
  assertNoDuplicateConstraint,
  type ConstraintValueRef,
} from './constraint-invariants';

@Injectable()
export class ConstraintService {
  constructor(private readonly prisma: PrismaService) {}

  async listConstraints(productRevisionId: string) {
    return this.prisma.constraint.findMany({
      where: { productRevisionId },
      include: {
        terms: {
          include: {
            choiceValue: {
              include: { attribute: true },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async createConstraint(input: {
    productRevisionId: string;
    choiceValueIds: string[];
  }) {
    const revision = await this.prisma.productGraphVersion.findUnique({
      where: { id: input.productRevisionId },
    });
    if (!revision) {
      throw new NotFoundException('Product revision not found');
    }
    if (revision.status !== 'DRAFT') {
      throw new BadRequestException(
        'Constraints can only be authored on DRAFT revisions'
      );
    }

    const values = await this.prisma.attributeValue.findMany({
      where: { id: { in: input.choiceValueIds } },
      include: { attribute: true },
    });
    if (values.length !== input.choiceValueIds.length) {
      throw new NotFoundException('One or more ChoiceValues were not found');
    }

    const refs: ConstraintValueRef[] = values.map((value) => ({
      id: value.id,
      key: value.key,
      attributeId: value.attributeId,
      attributeKey: value.attribute.key,
      graphVersionId: value.attribute.graphVersionId,
    }));

    try {
      assertConstraintValueSet(input.productRevisionId, refs);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid constraint'
      );
    }

    const existing = await this.prisma.constraint.findMany({
      where: { productRevisionId: input.productRevisionId },
      include: {
        terms: {
          include: {
            choiceValue: { include: { attribute: true } },
          },
        },
      },
    });

    const existingRefs = existing.map((constraint) =>
      constraint.terms.map((term) => ({
        id: term.choiceValue.id,
        key: term.choiceValue.key,
        attributeId: term.choiceValue.attributeId,
        attributeKey: term.choiceValue.attribute.key,
        graphVersionId: term.choiceValue.attribute.graphVersionId,
      }))
    );

    try {
      assertNoDuplicateConstraint(refs, existingRefs);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Duplicate constraint'
      );
    }

    return this.prisma.constraint.create({
      data: {
        productRevisionId: input.productRevisionId,
        terms: {
          create: refs.map((ref) => ({
            choiceValueId: ref.id,
          })),
        },
      },
      include: {
        terms: {
          include: {
            choiceValue: { include: { attribute: true } },
          },
        },
      },
    });
  }

  async deleteConstraint(id: string) {
    const constraint = await this.prisma.constraint.findUnique({
      where: { id },
      include: { productRevision: true },
    });
    if (!constraint) {
      throw new NotFoundException('Constraint not found');
    }
    if (constraint.productRevision.status !== 'DRAFT') {
      throw new BadRequestException(
        'Constraints can only be deleted on DRAFT revisions'
      );
    }
    await this.prisma.constraint.delete({ where: { id } });
    return true;
  }

  async assertChoiceValueNotReferenced(choiceValueId: string) {
    const refs = await this.prisma.constraintTerm.findMany({
      where: { choiceValueId },
      select: { constraintId: true },
    });
    if (refs.length === 0) return;
    const ids = [...new Set(refs.map((ref) => ref.constraintId))];
    throw new BadRequestException(
      `ChoiceValue is referenced by Constraint(s): ${ids.join(', ')}. Resolve constraints before deleting.`
    );
  }
}
