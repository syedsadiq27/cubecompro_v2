import {
  formatVisualAddress,
  visualAddressForBinding,
} from './address';
import type {
  MaterialBinding,
  NormalizeVisualDocumentInput,
  UnsupportedVisualEffect,
  VisibilityBinding,
  VisualBinding,
  VisualDocument,
  VisualTarget,
} from './types';

export class VisualNormalizeError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues.join('; '));
    this.name = 'VisualNormalizeError';
    this.issues = issues;
  }
}

function parseValueJson(valueJson: string): unknown {
  try {
    return JSON.parse(valueJson) as unknown;
  } catch {
    throw new VisualNormalizeError([`Invalid valueJson: ${valueJson}`]);
  }
}

function parseVisibility(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  throw new VisualNormalizeError([
    'SET_VISIBILITY value must be a boolean JSON value',
  ]);
}

function parseMaterialAssetId(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetId' in value &&
    typeof (value as { materialAssetId: unknown }).materialAssetId ===
      'string' &&
    (value as { materialAssetId: string }).materialAssetId.length > 0
  ) {
    return (value as { materialAssetId: string }).materialAssetId;
  }
  throw new VisualNormalizeError([
    'SET_MATERIAL value must be { materialAssetId: string }',
  ]);
}

export function normalizeVisualDocument(
  input: NormalizeVisualDocumentInput
): VisualDocument {
  const issues: string[] = [];
  const unsupported: UnsupportedVisualEffect[] = [];

  const targets: VisualTarget[] = [];
  const targetsById = new Map<string, VisualTarget>();
  const targetsByKey = new Map<string, VisualTarget>();

  for (const raw of input.model.targets) {
    if (!raw.key.trim()) {
      issues.push(`ModelTarget ${raw.id} is missing key`);
      continue;
    }
    if (!raw.nodePath || !raw.nodePath.trim()) {
      issues.push(`ModelTarget ${raw.key} is missing nodePath`);
      continue;
    }
    if (targetsByKey.has(raw.key)) {
      issues.push(`Duplicate targetKey "${raw.key}"`);
      continue;
    }
    const target: VisualTarget = {
      id: raw.id,
      key: raw.key,
      nodePath: raw.nodePath,
      ...(raw.materialSlot ? { materialSlot: raw.materialSlot } : {}),
    };
    targets.push(target);
    targetsById.set(raw.id, target);
    targetsByKey.set(raw.key, target);
  }

  const choiceValueIndex = new Map<
    string,
    { choiceKey: string; valueKey: string }
  >();
  for (const choice of input.choices) {
    for (const value of choice.values) {
      choiceValueIndex.set(value.id, {
        choiceKey: choice.key,
        valueKey: value.key,
      });
    }
  }

  const bindings: VisualBinding[] = [];
  type Claim = {
    choiceKey: string;
    valueKey: string;
    addressKey: string;
    effectId: string;
  };
  const claims: Claim[] = [];

  for (const effect of input.visualEffects) {
    const target = targetsById.get(effect.modelTargetId);
    if (!target) {
      const knownBroken = input.model.targets.some(
        (t) => t.id === effect.modelTargetId
      );
      if (knownBroken) {
        continue;
      }
      issues.push(
        `VisualEffect ${effect.id} references unknown modelTargetId ${effect.modelTargetId}`
      );
      continue;
    }

    const choiceValue = choiceValueIndex.get(effect.choiceValueId);
    if (!choiceValue) {
      issues.push(
        `VisualEffect ${effect.id} references unknown choiceValueId ${effect.choiceValueId}`
      );
      continue;
    }

    if (effect.operation === 'SET_MODEL') {
      unsupported.push({
        effectId: effect.id,
        operation: effect.operation,
        reason: 'SET_MODEL is unsupported in v1',
      });
      continue;
    }

    if (
      effect.operation !== 'SET_MATERIAL' &&
      effect.operation !== 'SET_VISIBILITY'
    ) {
      unsupported.push({
        effectId: effect.id,
        operation: effect.operation,
        reason: `Unsupported operation "${effect.operation}"`,
      });
      continue;
    }

    let binding: VisualBinding;
    try {
      const parsed = parseValueJson(effect.valueJson);
      if (effect.operation === 'SET_MATERIAL') {
        const materialAssetId = parseMaterialAssetId(parsed);
        const materialBinding: MaterialBinding = {
          choiceKey: choiceValue.choiceKey,
          valueKey: choiceValue.valueKey,
          targetKey: target.key,
          operation: 'SET_MATERIAL',
          materialAssetId,
          effectId: effect.id,
          ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
        };
        binding = materialBinding;
      } else {
        const visibilityBinding: VisibilityBinding = {
          choiceKey: choiceValue.choiceKey,
          valueKey: choiceValue.valueKey,
          targetKey: target.key,
          operation: 'SET_VISIBILITY',
          visible: parseVisibility(parsed),
          effectId: effect.id,
        };
        binding = visibilityBinding;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid effect value';
      issues.push(`VisualEffect ${effect.id}: ${message}`);
      continue;
    }

    const addressKey = formatVisualAddress(
      visualAddressForBinding(binding, targetsByKey)
    );

    for (const claim of claims) {
      if (claim.addressKey !== addressKey) continue;
      if (
        claim.choiceKey === binding.choiceKey &&
        claim.valueKey === binding.valueKey
      ) {
        issues.push(
          `same VisualAddress + same ChoiceValue duplicated (${addressKey})`
        );
      } else if (claim.choiceKey !== binding.choiceKey) {
        issues.push(
          `same VisualAddress + different Choices rejected (${addressKey}: ${claim.choiceKey} vs ${binding.choiceKey})`
        );
      }
    }

    claims.push({
      choiceKey: binding.choiceKey,
      valueKey: binding.valueKey,
      addressKey,
      effectId: effect.id,
    });
    bindings.push(binding);
  }

  if (issues.length > 0) {
    throw new VisualNormalizeError(issues);
  }

  return {
    productRevisionId: input.productRevisionId,
    productModelId: input.model.id,
    assetId: input.model.assetId,
    targets,
    bindings,
    unsupported,
  };
}
