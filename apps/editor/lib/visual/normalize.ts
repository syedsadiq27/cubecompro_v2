import {
  formatVisualAddress,
  visualAddressForBinding,
} from './address';
import { parseReplaceComponentValue } from '@repo/product-graph';
import type {
  MaterialBinding,
  NormalizeVisualDocumentInput,
  ReplaceComponentBinding,
  UnsupportedVisualEffect,
  VisibilityBinding,
  VisualBinding,
  VisualDocument,
  VisualLinkedAsset,
  VisualSetupOp,
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

function parseMaterialAssetRevisionId(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetRevisionId' in value &&
    typeof (value as { materialAssetRevisionId: unknown })
      .materialAssetRevisionId === 'string' &&
    (value as { materialAssetRevisionId: string }).materialAssetRevisionId
      .length > 0
  ) {
    return (value as { materialAssetRevisionId: string })
      .materialAssetRevisionId;
  }
  throw new VisualNormalizeError([
    'SET_MATERIAL value must be { materialAssetRevisionId: string }',
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
      ...(raw.targetType ? { targetType: raw.targetType } : {}),
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
      effect.operation !== 'SET_VISIBILITY' &&
      effect.operation !== 'REPLACE_COMPONENT'
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
        const materialAssetRevisionId = parseMaterialAssetRevisionId(parsed);
        const materialBinding: MaterialBinding = {
          choiceKey: choiceValue.choiceKey,
          valueKey: choiceValue.valueKey,
          targetKey: target.key,
          operation: 'SET_MATERIAL',
          materialAssetRevisionId,
          effectId: effect.id,
          ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
        };
        binding = materialBinding;
      } else if (effect.operation === 'REPLACE_COMPONENT') {
        const replaceValue = parseReplaceComponentValue(parsed);
        const replaceBinding: ReplaceComponentBinding = {
          choiceKey: choiceValue.choiceKey,
          valueKey: choiceValue.valueKey,
          targetKey: target.key,
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: replaceValue.linkedAssetKey,
          expectedRole: 'OBJECT',
          effectId: effect.id,
        };
        binding = replaceBinding;
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

    let isDuplicate = false;
    for (const claim of claims) {
      if (claim.addressKey !== addressKey) continue;
      if (
        claim.choiceKey === binding.choiceKey &&
        claim.valueKey === binding.valueKey
      ) {
        issues.push(
          `Duplicate VisualEffect for ${addressKey} under ${binding.choiceKey}=${binding.valueKey}`
        );
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      continue;
    }

    claims.push({
      choiceKey: binding.choiceKey,
      valueKey: binding.valueKey,
      addressKey,
      effectId: effect.id,
    });
    bindings.push(binding);
  }

  const setups: VisualSetupOp[] = [];
  for (const setup of input.visualSetups ?? []) {
    const target = targetsById.get(setup.modelTargetId);
    if (!target) {
      issues.push(`VisualSetup ${setup.id}: unknown modelTargetId`);
      continue;
    }
    const op = setup.operation.toUpperCase();
    try {
      const value = parseValueJson(setup.valueJson);
      if (op === 'SET_MATERIAL') {
        setups.push({
          id: setup.id,
          targetKey: target.key,
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: parseMaterialAssetRevisionId(value),
          ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
        });
      } else if (op === 'SET_VISIBILITY') {
        setups.push({
          id: setup.id,
          targetKey: target.key,
          operation: 'SET_VISIBILITY',
          visible: parseVisibility(value),
        });
      } else if (op === 'REPLACE_COMPONENT') {
        const parsed = parseReplaceComponentValue(value);
        setups.push({
          id: setup.id,
          targetKey: target.key,
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: parsed.linkedAssetKey,
          expectedRole: 'OBJECT',
        });
      } else {
        unsupported.push({
          effectId: setup.id,
          operation: setup.operation,
          reason: 'Unsupported VisualSetup operation',
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid setup value';
      issues.push(`VisualSetup ${setup.id}: ${message}`);
    }
  }

  if (issues.length > 0) {
    throw new VisualNormalizeError(issues);
  }

  const linkedAssets: VisualLinkedAsset[] = (input.model.linkedAssets ?? []).map(
    (asset) => ({
      ...(asset.id ? { id: asset.id } : {}),
      role: asset.role,
      key: asset.key,
      assetRevisionId: asset.assetRevisionId,
    })
  );

  return {
    productRevisionId: input.productRevisionId,
    productModelId: input.model.id,
    assetId: input.model.assetId,
    rootObjectAssetRevisionId: input.model.objectAssetRevisionId ?? '',
    linkedAssets,
    targets,
    setups,
    bindings,
    unsupported,
  };
}
