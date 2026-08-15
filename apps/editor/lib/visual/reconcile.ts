import type * as THREE from 'three';
import { baselineMaterialForTarget } from './baseline';
import { resolveTargetObject } from './resolve-target';
import type {
  VisualBaseline,
  VisualDocument,
  VisualState,
} from './types';

export type ReconcileMaterials = Record<string, THREE.Material>;

function assignMaterial(
  object: THREE.Object3D,
  material: THREE.Material | THREE.Material[]
): void {
  const apply = (mesh: THREE.Mesh) => {
    mesh.material = Array.isArray(material)
      ? material.map((entry) => {
          const cloned = entry.clone();
          cloned.needsUpdate = true;
          return cloned;
        })
      : (() => {
          const cloned = material.clone();
          cloned.needsUpdate = true;
          return cloned;
        })();
  };

  const mesh = object as THREE.Mesh;
  if (mesh.isMesh) {
    apply(mesh);
  }
  object.traverse((child) => {
    if (child === object) return;
    const childMesh = child as THREE.Mesh;
    if (!childMesh.isMesh) return;
    apply(childMesh);
  });
}

export function reconcileScene(
  root: THREE.Object3D,
  document: VisualDocument,
  state: VisualState,
  baseline: VisualBaseline,
  materials: ReconcileMaterials = {}
): void {
  for (const target of document.targets) {
    const object = resolveTargetObject(root, target);
    const desired = state.targets[target.key];

    if (desired?.visible !== undefined) {
      object.visible = desired.visible;
    } else {
      const visibilityKey = `${target.key}/visibility`;
      const baselineVisible = baseline[visibilityKey]?.visible;
      if (baselineVisible !== undefined) {
        object.visible = baselineVisible;
      }
    }

    if (desired?.materialAssetId) {
      const material = materials[desired.materialAssetId];
      if (!material) {
        throw new Error(
          `Missing resolved material for asset ${desired.materialAssetId}`
        );
      }
      assignMaterial(object, material);
    } else {
      const baselineMaterial = baselineMaterialForTarget(baseline, target);
      if (baselineMaterial) {
        assignMaterial(object, baselineMaterial);
      }
    }
  }
}
