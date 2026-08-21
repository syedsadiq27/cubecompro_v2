import { replaceComponentValueJson } from '@repo/product-graph';
import type { VisualBinding } from './types';

export function bindingSemanticKey(binding: {
  choiceKey: string;
  valueKey: string;
  targetKey: string;
  operation: string;
}): string {
  return `${binding.choiceKey}\0${binding.valueKey}\0${binding.targetKey}\0${binding.operation}`;
}

export function serializeBindingValueJson(binding: VisualBinding): string {
  if (binding.operation === 'SET_MATERIAL') {
    return JSON.stringify({
      materialAssetRevisionId: binding.materialAssetRevisionId,
    });
  }
  if (binding.operation === 'REPLACE_COMPONENT') {
    return replaceComponentValueJson(binding.linkedAssetKey);
  }
  return JSON.stringify(binding.visible);
}

export function bindingsEqualForPersist(
  a: VisualBinding,
  b: VisualBinding
): boolean {
  if (a.operation !== b.operation) return false;
  if (a.operation === 'SET_MATERIAL' && b.operation === 'SET_MATERIAL') {
    return a.materialAssetRevisionId === b.materialAssetRevisionId;
  }
  if (a.operation === 'SET_VISIBILITY' && b.operation === 'SET_VISIBILITY') {
    return a.visible === b.visible;
  }
  if (
    a.operation === 'REPLACE_COMPONENT' &&
    b.operation === 'REPLACE_COMPONENT'
  ) {
    return a.linkedAssetKey === b.linkedAssetKey;
  }
  return false;
}

export type VisualPersistOp =
  | {
      type: 'create';
      binding: VisualBinding;
    }
  | {
      type: 'update';
      effectId: string;
      binding: VisualBinding;
    }
  | {
      type: 'delete';
      effectId: string;
    };

export function diffVisualBindings(input: {
  desired: VisualBinding[];
  current: VisualBinding[];
}): VisualPersistOp[] {
  const desiredByKey = new Map(
    input.desired.map((binding) => [bindingSemanticKey(binding), binding])
  );
  const currentByKey = new Map(
    input.current.map((binding) => [bindingSemanticKey(binding), binding])
  );
  const ops: VisualPersistOp[] = [];

  for (const [key, desired] of desiredByKey) {
    const current = currentByKey.get(key);
    if (!current) {
      ops.push({ type: 'create', binding: desired });
      continue;
    }
    if (!bindingsEqualForPersist(desired, current)) {
      const effectId = current.effectId ?? desired.effectId;
      if (!effectId) {
        ops.push({ type: 'create', binding: desired });
        continue;
      }
      ops.push({ type: 'update', effectId, binding: desired });
    }
  }

  for (const [key, current] of currentByKey) {
    if (desiredByKey.has(key)) continue;
    if (!current.effectId) continue;
    ops.push({ type: 'delete', effectId: current.effectId });
  }

  return ops;
}
