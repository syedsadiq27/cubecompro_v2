/**
 * Commerce mapping set domain contract (Phase 3A) and exact resolution (Phase 3B).
 *
 * Persistence is relational (set + identity choices + mappings + terms).
 * normalizeCommerceMappingSet reads authored facts into the frozen domain shape.
 * resolveCommerce projects Selection → identity → exact lookup (no provider I/O).
 */

import type { ChoiceKey, ChoiceValueKey, Selection } from './kernel.js';

export type CommerceIdentity = Record<ChoiceKey, ChoiceValueKey | null>;

export type CommerceExternalReference = {
  type: 'VARIANT';
  id: string;
  sku?: string;
};

export type CommerceMapping = {
  identity: CommerceIdentity;
  externalReference: CommerceExternalReference;
};

export type CommerceMappingSet = {
  productRevisionId: string;
  provider: string;
  /** Required for ResolvedCommerce handoff / provider I/O. */
  integrationConnectionId?: string;
  identityChoiceKeys: ChoiceKey[];
  mappings: CommerceMapping[];
};

export type CommerceResolution =
  | {
      status: 'RESOLVED';
      provider: string;
      /** Present when the mapping set carries a connection; required for live I/O. */
      integrationConnectionId?: string;
      externalReference: CommerceExternalReference;
    }
  | {
      status: 'UNMAPPED';
    };

export type CommerceRevisionChoice = {
  key: ChoiceKey;
  required: boolean;
  values: Array<{ key: ChoiceValueKey }>;
};

export type NormalizeCommerceMappingTermInput = {
  choiceKey: ChoiceKey;
  valueKey: ChoiceValueKey;
};

export type NormalizeCommerceMappingInput = {
  externalId: string;
  sku?: string | null;
  terms: NormalizeCommerceMappingTermInput[];
};

export type NormalizeCommerceMappingSetInput = {
  productRevisionId: string;
  provider: string;
  integrationConnectionId?: string | null;
  identityChoiceKeys: ChoiceKey[];
  revisionChoices: CommerceRevisionChoice[];
  mappings: NormalizeCommerceMappingInput[];
};

export class CommerceNormalizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommerceNormalizeError';
  }
}

/**
 * Deterministic canonical identitySignature for exact uniqueness/lookup.
 * Stored as JSON text (not a hash): [["frame","walnut"],["warranty",null]]
 */
export function canonicalizeCommerceIdentity(
  identityChoiceKeys: readonly ChoiceKey[],
  identity: CommerceIdentity
): string {
  const pairs = identityChoiceKeys.map((key) => {
    const value = Object.prototype.hasOwnProperty.call(identity, key)
      ? identity[key]!
      : null;
    return [key, value] as [ChoiceKey, ChoiceValueKey | null];
  });
  return JSON.stringify(pairs);
}

/**
 * Project a kernel Selection onto commerce identity dimensions.
 * Keys outside identityChoiceKeys are ignored.
 * Absent identity keys become null (optional / not selected).
 * Does not validate completeness or constraints — caller owns that.
 */
export function projectCommerceIdentity(
  selection: Selection,
  identityChoiceKeys: readonly ChoiceKey[]
): CommerceIdentity {
  const identity: CommerceIdentity = {};
  for (const key of identityChoiceKeys) {
    if (Object.prototype.hasOwnProperty.call(selection, key)) {
      identity[key] = selection[key]!;
    } else {
      identity[key] = null;
    }
  }
  return identity;
}

/**
 * Exact commerce resolution against a normalized CommerceMappingSet.
 * Does not validate Selection, query providers, or apply fallback/partial match.
 */
export function resolveCommerce(input: {
  selection: Selection;
  mappingSet: CommerceMappingSet;
}): CommerceResolution {
  const identity = projectCommerceIdentity(
    input.selection,
    input.mappingSet.identityChoiceKeys
  );
  const signature = canonicalizeCommerceIdentity(
    input.mappingSet.identityChoiceKeys,
    identity
  );

  const bySignature = new Map<string, CommerceMapping>();
  for (const mapping of input.mappingSet.mappings) {
    const key = canonicalizeCommerceIdentity(
      input.mappingSet.identityChoiceKeys,
      mapping.identity
    );
    bySignature.set(key, mapping);
  }

  const match = bySignature.get(signature);
  if (!match) {
    return { status: 'UNMAPPED' };
  }

  const integrationConnectionId =
    typeof input.mappingSet.integrationConnectionId === 'string' &&
    input.mappingSet.integrationConnectionId.trim().length > 0
      ? input.mappingSet.integrationConnectionId.trim()
      : undefined;

  return {
    status: 'RESOLVED',
    provider: input.mappingSet.provider,
    ...(integrationConnectionId ? { integrationConnectionId } : {}),
    externalReference: match.externalReference,
  };
}

export function normalizeCommerceMappingSet(
  input: NormalizeCommerceMappingSetInput
): CommerceMappingSet {
  const provider = input.provider.trim();
  if (!provider) {
    throw new CommerceNormalizeError('provider is required');
  }

  const integrationConnectionId =
    typeof input.integrationConnectionId === 'string' &&
    input.integrationConnectionId.trim().length > 0
      ? input.integrationConnectionId.trim()
      : undefined;

  const revisionByKey = new Map(
    input.revisionChoices.map((choice) => [choice.key, choice])
  );

  const identityChoiceKeys = [...input.identityChoiceKeys];
  const identityKeySet = new Set<ChoiceKey>();
  for (const key of identityChoiceKeys) {
    if (identityKeySet.has(key)) {
      throw new CommerceNormalizeError(
        `Duplicate identityChoiceKey: ${key}`
      );
    }
    identityKeySet.add(key);
    const choice = revisionByKey.get(key);
    if (!choice) {
      throw new CommerceNormalizeError(
        `identityChoiceKey ${key} is not on product revision ${input.productRevisionId}`
      );
    }
  }

  const mappings: CommerceMapping[] = [];
  const seenSignatures = new Set<string>();

  for (const mapping of input.mappings) {
    const externalId = mapping.externalId.trim();
    if (!externalId) {
      throw new CommerceNormalizeError('mapping externalId is required');
    }

    const termChoiceKeys = new Set<ChoiceKey>();
    const termByChoice = new Map<ChoiceKey, ChoiceValueKey>();

    for (const term of mapping.terms) {
      if (!identityKeySet.has(term.choiceKey)) {
        throw new CommerceNormalizeError(
          `mapping term choice ${term.choiceKey} is outside identityChoiceKeys`
        );
      }
      if (termChoiceKeys.has(term.choiceKey)) {
        throw new CommerceNormalizeError(
          `mapping may include at most one value per Choice (${term.choiceKey})`
        );
      }
      termChoiceKeys.add(term.choiceKey);

      const choice = revisionByKey.get(term.choiceKey);
      if (!choice) {
        throw new CommerceNormalizeError(
          `mapping term choice ${term.choiceKey} is not on product revision ${input.productRevisionId}`
        );
      }
      const valueOk = choice.values.some((value) => value.key === term.valueKey);
      if (!valueOk) {
        throw new CommerceNormalizeError(
          `ChoiceValue ${term.choiceKey}=${term.valueKey} is not on product revision ${input.productRevisionId}`
        );
      }
      termByChoice.set(term.choiceKey, term.valueKey);
    }

    const identity: CommerceIdentity = {};
    for (const key of identityChoiceKeys) {
      const choice = revisionByKey.get(key)!;
      const selected = termByChoice.get(key);
      if (selected !== undefined) {
        identity[key] = selected;
        continue;
      }
      if (choice.required) {
        throw new CommerceNormalizeError(
          `required identity Choice ${key} is missing a mapping term`
        );
      }
      identity[key] = null;
    }

    const signature = canonicalizeCommerceIdentity(
      identityChoiceKeys,
      identity
    );
    if (seenSignatures.has(signature)) {
      throw new CommerceNormalizeError(
        `Duplicate semantic CommerceIdentity: ${signature}`
      );
    }
    seenSignatures.add(signature);

    const sku =
      typeof mapping.sku === 'string' && mapping.sku.trim().length > 0
        ? mapping.sku.trim()
        : undefined;

    mappings.push({
      identity,
      externalReference: {
        type: 'VARIANT',
        id: externalId,
        ...(sku ? { sku } : {}),
      },
    });
  }

  return {
    productRevisionId: input.productRevisionId,
    provider,
    ...(integrationConnectionId ? { integrationConnectionId } : {}),
    identityChoiceKeys,
    mappings,
  };
}
