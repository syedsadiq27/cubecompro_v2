/**
 * Commerce mapping set domain contract (Phase 3A).
 *
 * Persistence is relational (set + identity choices + mappings + terms).
 * This module only normalizes persisted/authored facts into the frozen
 * CommerceMappingSet shape. Resolution (3B) is out of scope.
 */

import type { ChoiceKey, ChoiceValueKey } from './kernel.js';

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
  identityChoiceKeys: ChoiceKey[];
  mappings: CommerceMapping[];
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

export function normalizeCommerceMappingSet(
  input: NormalizeCommerceMappingSetInput
): CommerceMappingSet {
  const provider = input.provider.trim();
  if (!provider) {
    throw new CommerceNormalizeError('provider is required');
  }

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
    identityChoiceKeys,
    mappings,
  };
}
