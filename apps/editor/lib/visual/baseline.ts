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
 * Capture CubeCom-managed properties from the loaded ObjectAsset
 * before any visual bindings are applied. Does not deep-clone the scene.
 */
export function captureVisualBaseline(
  root: THREE.Object3D,
  document: VisualDocument
): VisualBaseline {
  const baseline: VisualBaseline = {};
  const targetsByKey = new Map(document.targets.map((t) => [t.key, t]));

  for (const addressKey of managedAddressesForDocument(document)) {
    const [targetKey, property, slot] = addressKey.split('/');
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
      baseline[formatVisualAddress({
        targetKey: target.key,
        property: 'material',
        ...(target.materialSlot ? { materialSlot: target.materialSlot } : {}),
      })] = {
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
