import type * as THREE from 'three';
import {
  formatVisualAddress,
  managedAddressesForDocument,
} from './address';
import type {
  VisualBaseline,
  VisualDocument,
  VisualTarget,
} from './types';
import {
  instantiateStructuralBaseline,
  type StructuralSlotBaseline,
} from './object-runtime';
import { resolveTargetObject } from './resolve-target';

function readMeshMaterial(
  object: THREE.Object3D
): THREE.Material | THREE.Material[] | undefined {
  const mesh = object as THREE.Mesh;
  if (!mesh.isMesh || !mesh.material) return undefined;
  if (Array.isArray(mesh.material)) {
    return mesh.material.map((entry) => entry);
  }
  return mesh.material;
}

/**
 * Capture CubeCom-managed surface properties from the loaded ObjectAsset
 * before any visual bindings are applied.
 */
export function captureVisualBaseline(
  root: THREE.Object3D,
  document: VisualDocument
): VisualBaseline {
  const baseline: VisualBaseline = {};
  const targetsByKey = new Map(document.targets.map((t) => [t.key, t]));

  for (const addressKey of managedAddressesForDocument(document)) {
    const [targetKey, property, slot] = addressKey.split('/');
    if (property === 'structure') continue;
    const target = targetsByKey.get(targetKey!);
    if (!target) continue;
    const object = resolveTargetObject(root, target);
    if (property === 'visibility') {
      baseline[addressKey] = {
        ...baseline[addressKey],
        visible: object.visible,
      };
      continue;
    }
    if (property === 'material') {
      void slot;
      baseline[
        formatVisualAddress({
          targetKey: target.key,
          property: 'material',
          ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
        })
      ] = {
        ...baseline[addressKey],
        materialReference: readMeshMaterial(object),
      };
    }
  }

  return baseline;
}

export function baselineMaterialForTarget(
  baseline: VisualBaseline,
  target: VisualTarget
): THREE.Material | THREE.Material[] | undefined {
  const key = formatVisualAddress({
    targetKey: target.key,
    property: 'material',
    ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
  });
  const ref = baseline[key]?.materialReference;
  if (!ref) return undefined;
  return ref as THREE.Material | THREE.Material[];
}

/**
 * Capture original root GLB subtrees for every REPLACE_COMPONENT composition slot.
 * Templates are never mounted; restores instantiate from them.
 */
export function captureStructuralBaselines(
  root: THREE.Object3D,
  document: VisualDocument
): Map<string, StructuralSlotBaseline> {
  const out = new Map<string, StructuralSlotBaseline>();
  const targetsByKey = new Map(document.targets.map((t) => [t.key, t]));
  const slotKeys = new Set<string>();

  for (const binding of document.bindings) {
    if (binding.operation === 'REPLACE_COMPONENT') {
      slotKeys.add(binding.targetKey);
    }
  }

  for (const slotKey of slotKeys) {
    const target = targetsByKey.get(slotKey);
    if (!target) continue;
    const object = resolveTargetObject(root, target);
    const parent = object.parent;
    if (!parent) {
      throw new Error(
        `Structural target "${slotKey}" has no parent for baseline capture`
      );
    }
    const childIndex = parent.children.indexOf(object);
    out.set(slotKey, {
      compositionSlotKey: slotKey,
      parent,
      childIndex,
      template: object.clone(true),
    });
  }

  return out;
}

export function mountObjectAtStructuralSlot(
  baseline: StructuralSlotBaseline,
  object3D: THREE.Object3D
): void {
  const { parent, childIndex } = baseline;
  const current = parent.children[childIndex];
  if (current) {
    parent.remove(current);
  }
  parent.add(object3D);
  if (childIndex < parent.children.length - 1) {
    parent.children.splice(
      parent.children.indexOf(object3D),
      1
    );
    parent.children.splice(childIndex, 0, object3D);
    object3D.parent = parent;
  }
  object3D.position.copy(baseline.template.position);
  object3D.quaternion.copy(baseline.template.quaternion);
  object3D.scale.copy(baseline.template.scale);
}

export function restoreStructuralSlot(
  baseline: StructuralSlotBaseline
): THREE.Object3D {
  const restored = instantiateStructuralBaseline(baseline);
  mountObjectAtStructuralSlot(baseline, restored);
  return restored;
}
