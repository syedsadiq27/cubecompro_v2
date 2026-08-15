/**
 * Pure Shopify product → CubeCom import plan (Phase 3C).
 * No network I/O. Persistence and Admin API live outside this module.
 */

import {
  CommerceNormalizeError,
  normalizeCommerceMappingSet,
  type NormalizeCommerceMappingSetInput,
} from './commerce.js';

export type ShopifyProductOptionDto = {
  name: string;
  values: string[];
};

export type ShopifyProductVariantDto = {
  id: string | number;
  sku?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
};

export type ShopifyProductDto = {
  id: string | number;
  title: string;
  handle?: string | null;
  options: ShopifyProductOptionDto[];
  variants: ShopifyProductVariantDto[];
};

export type ShopifyImportChoicePlan = {
  key: string;
  name: string;
  values: Array<{ key: string; name: string }>;
};

export type ShopifyImportMappingPlan = {
  terms: Array<{ choiceKey: string; valueKey: string }>;
  externalId: string;
  sku?: string;
};

export type ShopifyImportPlan = {
  externalProductId: string;
  productKey: string;
  productName: string;
  choices: ShopifyImportChoicePlan[];
  identityChoiceKeys: string[];
  mappings: ShopifyImportMappingPlan[];
};

export class ShopifyImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyImportError';
  }
}

/** Deterministic CubeCom semantic key from a Shopify option/value label. */
export function shopifyLabelToSemanticKey(label: string): string {
  const key = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!key) {
    throw new ShopifyImportError(`Cannot derive semantic key from "${label}"`);
  }
  return key;
}

/** Stable short key from a Shopify GID or legacy numeric id (for product.key only). */
export function shopifyResourceKey(id: string | number): string {
  const trimmed = String(id).trim();
  const match = /\/(\d+)$/.exec(trimmed);
  return match?.[1] ?? trimmed.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function sameShopifyResourceId(
  left: string | number,
  right: string | number
): boolean {
  const a = String(left).trim();
  const b = String(right).trim();
  if (a === b) return true;
  return shopifyResourceKey(a) === shopifyResourceKey(b);
}

/** Prefer numeric legacy id for UI display; keep full GID in persistence. */
export function shopifyDisplayId(id: string | number | null | undefined): string {
  if (id == null) return '';
  const trimmed = String(id).trim();
  if (!trimmed) return '';
  const match = /\/(\d+)$/.exec(trimmed);
  return match?.[1] ?? trimmed;
}

function isDefaultTitleOnly(options: ShopifyProductOptionDto[]): boolean {
  if (options.length !== 1) return false;
  const option = options[0]!;
  if (option.name.trim().toLowerCase() !== 'title') return false;
  if (option.values.length !== 1) return false;
  return option.values[0]!.trim().toLowerCase() === 'default title';
}

function variantOptionLabels(
  variant: ShopifyProductVariantDto
): Array<string | null | undefined> {
  return [variant.option1, variant.option2, variant.option3];
}

/**
 * Map one Shopify Admin product payload into a CubeCom import plan.
 * Does not create Constraints from missing variant combinations.
 */
export function planShopifyProductImport(
  product: ShopifyProductDto
): ShopifyImportPlan {
  const externalProductId = String(product.id).trim();
  if (!externalProductId) {
    throw new ShopifyImportError('Shopify product id is required');
  }
  const productName = product.title?.trim();
  if (!productName) {
    throw new ShopifyImportError('Shopify product title is required');
  }
  if (!Array.isArray(product.variants) || product.variants.length === 0) {
    throw new ShopifyImportError('Shopify product must include at least one variant');
  }

  const handleKey = product.handle?.trim()
    ? shopifyLabelToSemanticKey(product.handle)
    : shopifyLabelToSemanticKey(productName);
  const productKey = `shopify-${shopifyResourceKey(externalProductId)}-${handleKey}`.slice(
    0,
    64
  );

  const options = Array.isArray(product.options) ? product.options : [];
  const emptyIdentity = options.length === 0 || isDefaultTitleOnly(options);

  if (emptyIdentity) {
    if (product.variants.length !== 1) {
      throw new ShopifyImportError(
        'Zero-option Shopify products must have exactly one variant'
      );
    }
    const variant = product.variants[0]!;
    const externalId = String(variant.id).trim();
    if (!externalId) {
      throw new ShopifyImportError('Shopify variant id is required');
    }
    const sku =
      typeof variant.sku === 'string' && variant.sku.trim().length > 0
        ? variant.sku.trim()
        : undefined;
    return {
      externalProductId,
      productKey,
      productName,
      choices: [],
      identityChoiceKeys: [],
      mappings: [{ terms: [], externalId, ...(sku ? { sku } : {}) }],
    };
  }

  const choices: ShopifyImportChoicePlan[] = [];
  const choiceKeys = new Set<string>();
  for (const option of options) {
    const name = option.name?.trim();
    if (!name) {
      throw new ShopifyImportError('Shopify option name is required');
    }
    const key = shopifyLabelToSemanticKey(name);
    if (choiceKeys.has(key)) {
      throw new ShopifyImportError(`Duplicate option semantic key: ${key}`);
    }
    choiceKeys.add(key);
    if (!Array.isArray(option.values) || option.values.length === 0) {
      throw new ShopifyImportError(`Shopify option ${name} has no values`);
    }
    const valueKeys = new Set<string>();
    const values = option.values.map((valueLabel) => {
      const valueName = valueLabel?.trim();
      if (!valueName) {
        throw new ShopifyImportError(`Empty value on option ${name}`);
      }
      const valueKey = shopifyLabelToSemanticKey(valueName);
      if (valueKeys.has(valueKey)) {
        throw new ShopifyImportError(
          `Duplicate value key ${valueKey} on option ${name}`
        );
      }
      valueKeys.add(valueKey);
      return { key: valueKey, name: valueName };
    });
    choices.push({ key, name, values });
  }

  const identityChoiceKeys = choices.map((choice) => choice.key);
  const valueByChoiceLabel = new Map<string, Map<string, string>>();
  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;
    const choice = choices[i]!;
    const byLabel = new Map<string, string>();
    for (let j = 0; j < option.values.length; j++) {
      byLabel.set(option.values[j]!.trim(), choice.values[j]!.key);
    }
    valueByChoiceLabel.set(choice.key, byLabel);
  }

  const mappings: ShopifyImportMappingPlan[] = [];
  const seenVariantIds = new Set<string>();

  for (const variant of product.variants) {
    const externalId = String(variant.id).trim();
    if (!externalId) {
      throw new ShopifyImportError('Shopify variant id is required');
    }
    if (seenVariantIds.has(externalId)) {
      throw new ShopifyImportError(`Duplicate Shopify variant id ${externalId}`);
    }
    seenVariantIds.add(externalId);

    const labels = variantOptionLabels(variant);
    const terms: Array<{ choiceKey: string; valueKey: string }> = [];
    const usedChoices = new Set<string>();

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i]!;
      const label = labels[i]?.trim();
      if (!label) {
        throw new ShopifyImportError(
          `Variant ${externalId} missing value for option ${choice.name}`
        );
      }
      const valueKey = valueByChoiceLabel.get(choice.key)?.get(label);
      if (!valueKey) {
        throw new ShopifyImportError(
          `Variant ${externalId} value "${label}" is not on option ${choice.name}`
        );
      }
      if (usedChoices.has(choice.key)) {
        throw new ShopifyImportError(
          `Variant ${externalId} has two values for choice ${choice.key}`
        );
      }
      usedChoices.add(choice.key);
      terms.push({ choiceKey: choice.key, valueKey });
    }

    const sku =
      typeof variant.sku === 'string' && variant.sku.trim().length > 0
        ? variant.sku.trim()
        : undefined;

    mappings.push({
      terms,
      externalId,
      ...(sku ? { sku } : {}),
    });
  }

  const normalizeInput: NormalizeCommerceMappingSetInput = {
    productRevisionId: 'import-plan',
    provider: 'shopify',
    identityChoiceKeys,
    revisionChoices: choices.map((choice) => ({
      key: choice.key,
      required: true,
      values: choice.values.map((value) => ({ key: value.key })),
    })),
    mappings: mappings.map((mapping) => ({
      externalId: mapping.externalId,
      sku: mapping.sku,
      terms: mapping.terms,
    })),
  };

  try {
    normalizeCommerceMappingSet(normalizeInput);
  } catch (error) {
    if (error instanceof CommerceNormalizeError) {
      throw new ShopifyImportError(error.message);
    }
    throw error;
  }

  return {
    externalProductId,
    productKey,
    productName,
    choices,
    identityChoiceKeys,
    mappings,
  };
}

export type ShopifyImportReviewRow = {
  label: string;
  terms: Array<{ choiceKey: string; valueKey: string; valueName: string }>;
  status: 'mapped' | 'unmapped';
  externalId?: string;
  sku?: string;
};

export type ShopifyImportReview = {
  plan: ShopifyImportPlan;
  rows: ShopifyImportReviewRow[];
  mappedCount: number;
  unmappedCount: number;
};

function cartesianProduct<T>(lists: T[][]): T[][] {
  if (lists.length === 0) return [[]];
  return lists.reduce<T[][]>(
    (acc, list) => acc.flatMap((prefix) => list.map((item) => [...prefix, item])),
    [[]]
  );
}

/**
 * Build review rows: observed Shopify variants + missing combinations as UNMAPPED.
 * Missing combinations are catalog gaps, not CubeCom INVALID.
 */
export function buildShopifyImportReview(
  plan: ShopifyImportPlan
): ShopifyImportReview {
  if (plan.identityChoiceKeys.length === 0) {
    const mapping = plan.mappings[0];
    const rows: ShopifyImportReviewRow[] = mapping
      ? [
          {
            label: 'Default',
            terms: [],
            status: 'mapped',
            externalId: mapping.externalId,
            sku: mapping.sku,
          },
        ]
      : [];
    return {
      plan,
      rows,
      mappedCount: rows.length,
      unmappedCount: 0,
    };
  }

  const valueNameByKey = new Map<string, string>();
  for (const choice of plan.choices) {
    for (const value of choice.values) {
      valueNameByKey.set(`${choice.key}\0${value.key}`, value.name);
    }
  }

  const mappedBySignature = new Map<string, ShopifyImportMappingPlan>();
  for (const mapping of plan.mappings) {
    const signature = mapping.terms
      .map((term) => `${term.choiceKey}=${term.valueKey}`)
      .join('&');
    mappedBySignature.set(signature, mapping);
  }

  const valueLists = plan.choices.map((choice) =>
    choice.values.map((value) => ({
      choiceKey: choice.key,
      valueKey: value.key,
      valueName: value.name,
    }))
  );
  const combinations = cartesianProduct(valueLists);

  const rows: ShopifyImportReviewRow[] = combinations.map((combo) => {
    const signature = combo
      .map((term) => `${term.choiceKey}=${term.valueKey}`)
      .join('&');
    const mapped = mappedBySignature.get(signature);
    const label = combo.map((term) => term.valueName).join(' + ');
    if (mapped) {
      return {
        label,
        terms: combo,
        status: 'mapped' as const,
        externalId: mapped.externalId,
        sku: mapped.sku,
      };
    }
    return {
      label,
      terms: combo,
      status: 'unmapped' as const,
    };
  });

  const mappedCount = rows.filter((row) => row.status === 'mapped').length;
  return {
    plan,
    rows,
    mappedCount,
    unmappedCount: rows.length - mappedCount,
  };
}
