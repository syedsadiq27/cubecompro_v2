import type { VisualAddress, VisualBinding, VisualTarget } from './types';

export function formatVisualAddress(address: VisualAddress): string {
  if (address.property === 'visibility') {
    return `${address.targetKey}/visibility`;
  }
  if (address.materialSlot !== undefined && address.materialSlot !== '') {
    return `${address.targetKey}/material/${address.materialSlot}`;
  }
  return `${address.targetKey}/material`;
}

export function visualAddressForBinding(
  binding: VisualBinding,
  targetsByKey: Map<string, VisualTarget>
): VisualAddress {
  if (binding.operation === 'SET_VISIBILITY') {
    return {
      targetKey: binding.targetKey,
      property: 'visibility',
    };
  }
  const target = targetsByKey.get(binding.targetKey);
  const materialSlot = binding.materialSlot ?? target?.materialSlot;
  return {
    targetKey: binding.targetKey,
    property: 'material',
    ...(materialSlot ? { materialSlot } : {}),
  };
}

export function managedAddressesForDocument(input: {
  targets: VisualTarget[];
  bindings: VisualBinding[];
}): string[] {
  const targetsByKey = new Map(input.targets.map((t) => [t.key, t]));
  const keys = new Set<string>();
  for (const binding of input.bindings) {
    keys.add(
      formatVisualAddress(visualAddressForBinding(binding, targetsByKey))
    );
  }
  for (const target of input.targets) {
    keys.add(
      formatVisualAddress({
        targetKey: target.key,
        property: 'visibility',
      })
    );
    keys.add(
      formatVisualAddress({
        targetKey: target.key,
        property: 'material',
        ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
      })
    );
  }
  return [...keys];
}
