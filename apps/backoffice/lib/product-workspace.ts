import type {
  GraphAttribute,
  GraphDetail,
  GraphRule,
  GraphTarget,
  GraphVariant,
} from '@repo/product-graph';

export type {
  GraphAttribute,
  GraphAttributeValue,
  GraphDetail,
  GraphModel,
  GraphRule,
  GraphTarget,
  GraphVariant,
  GraphVariantSelection,
  GraphVisualEffect,
} from '@repo/product-graph';

export type ObjectAssetOption = {
  id: string;
  name: string;
  code?: string | null;
  fileUrl?: string | null;
  status?: string | null;
  currentRevisionId?: string | null;
  meshCount?: number | null;
  format?: string | null;
};

export type MaterialAssetOption = {
  id: string;
  name: string;
  code?: string | null;
};

export type WorkspaceTab =
  | 'product'
  | 'options'
  | 'variants'
  | '3d'
  | 'commerce'
  | 'rules'
  | 'activity';

export type SceneNodeInfo = {
  name: string;
  nodePath: string;
  nodeType: 'mesh' | 'group';
  children: SceneNodeInfo[];
};

export function parseWorkspaceTab(value?: string | null): WorkspaceTab {
  if (
    value === 'options' ||
    value === 'variants' ||
    value === '3d' ||
    value === 'commerce' ||
    value === 'rules' ||
    value === 'activity' ||
    value === 'product'
  ) {
    return value;
  }
  return 'product';
}

export function countValues(detail: GraphDetail | null): number {
  if (!detail) return 0;
  return detail.choices.reduce(
    (sum, attribute) => sum + attribute.values.length,
    0
  );
}

/** Prefer live revision/commerce data over demo mockups when present. */
export function useLiveProductData(
  detail: GraphDetail | null,
  shopifyCommerce?: unknown
): boolean {
  if (shopifyCommerce) return true;
  if (!detail) return false;
  return (
    detail.choices.length > 0 ||
    detail.models.length > 0 ||
    detail.constraints.length > 0 ||
    detail.variants.length > 0
  );
}

export function humanizeEffectValue(
  valueJson: string,
  materialNames?: Map<string, string>
): string {
  try {
    const parsed = JSON.parse(valueJson) as unknown;
    if (typeof parsed === 'boolean') {
      return parsed ? 'Show' : 'Hide';
    }
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'materialAssetId' in parsed &&
      typeof (parsed as { materialAssetId: unknown }).materialAssetId ===
        'string'
    ) {
      const id = (parsed as { materialAssetId: string }).materialAssetId;
      return materialNames?.get(id) ?? 'Library material';
    }
    if (typeof parsed === 'string' || typeof parsed === 'number') {
      return String(parsed);
    }
    return valueJson;
  } catch {
    return valueJson;
  }
}

export function humanizeEffectOperation(operation: string): string {
  const key = operation.toUpperCase();
  if (key === 'SET_MATERIAL') return 'Set material';
  if (key === 'SET_VISIBILITY' || key === 'VISIBILITY') return 'Set visibility';
  if (key === 'SET_COLOR') return 'Set color';
  return operation
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase());
}

export function describeRule(
  rule: GraphRule,
  attributes: GraphAttribute[] = []
): {
  when: string;
  then: string;
} {
  const attrName = (key: string) =>
    attributes.find((attribute) => attribute.key === key)?.name ??
    titleCase(key);
  const valueName = (attrKey: string, eq: unknown) => {
    const attribute = attributes.find((entry) => entry.key === attrKey);
    const match = attribute?.values?.find(
      (value) => value.key === String(eq) || value.name === String(eq)
    );
    return match?.name ?? String(eq);
  };

  try {
    const condition = JSON.parse(rule.conditionJson) as {
      all?: Array<{ attr: string; eq: unknown }>;
      any?: Array<{ attr: string; eq: unknown }>;
      attr?: string;
      eq?: unknown;
    };
    const effect = JSON.parse(rule.effectJson) as {
      forbid?: { attr: string; eq: unknown };
      require?: { attr: string; eq: unknown };
    };

    let when = 'Configuration matches';
    const clauses =
      condition.all ??
      condition.any ??
      (condition.attr !== undefined
        ? [{ attr: condition.attr, eq: condition.eq }]
        : []);
    if (clauses.length > 0) {
      when = clauses
        .map(
          (clause) =>
            `${attrName(clause.attr)} is ${valueName(clause.attr, clause.eq)}`
        )
        .join(condition.any ? ' or ' : ' and ');
    }

    let then = 'Apply effect';
    if (effect.forbid) {
      then = `${attrName(effect.forbid.attr)} cannot be ${valueName(effect.forbid.attr, effect.forbid.eq)}`;
    } else if (effect.require) {
      then = `${attrName(effect.require.attr)} must be ${valueName(effect.require.attr, effect.require.eq)}`;
    }

    return { when, then };
  } catch {
    return { when: 'Custom condition', then: 'Custom effect' };
  }
}

export function variantConfigurationLabel(
  variant: GraphVariant,
  attributes: GraphAttribute[]
): string {
  const attrById = new Map(
    attributes.map((attribute) => [attribute.id, attribute])
  );
  const parts = (variant.selections ?? []).map((selection) => {
    const attribute = attrById.get(selection.choiceId);
    const value = attribute?.values?.find(
      (entry) => entry.id === selection.choiceValueId
    );
    return value?.name ?? value?.key ?? '—';
  });
  return parts.length > 0 ? parts.join(' / ') : variant.externalId;
}

function titleCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function partLabel(target: GraphTarget): string {
  const slot = target.materialSlot || target.key.split('.')[0] || 'Part';
  return titleCase(String(slot));
}

export function targetLabel(target: GraphTarget): string {
  const pretty = partLabel(target);
  if (
    target.targetType.toUpperCase() === 'VISIBILITY' ||
    target.key.includes('visibility')
  ) {
    return pretty;
  }
  if (
    target.targetType.toUpperCase() === 'MATERIAL' ||
    target.key.includes('material')
  ) {
    return pretty;
  }
  return pretty;
}

export function semanticKeyFromNodeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function objectProxyUrl(assetId: string): string {
  return `/api/documents/objects/${assetId}`;
}

export function objectRevisionProxyUrl(objectAssetRevisionId: string): string {
  return `/api/documents/object-revisions/${objectAssetRevisionId}`;
}
