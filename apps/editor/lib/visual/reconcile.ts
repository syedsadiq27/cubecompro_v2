import type * as THREE from 'three';
import {
  baselineMaterialForTarget,
  mountObjectAtStructuralSlot,
  restoreStructuralSlot,
} from './baseline';
import type {
  ObjectRuntimeInstance,
  ObjectRuntimeRegistry,
  StructuralSlotBaseline,
} from './object-runtime';
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

export type ReconcileSceneInput = {
  root: THREE.Object3D;
  document: VisualDocument;
  state: VisualState;
  surfaceBaseline: VisualBaseline;
  structuralBaselines: Map<string, StructuralSlotBaseline>;
  materials?: ReconcileMaterials;
  objectRegistry: ObjectRuntimeRegistry;
  /** Slot → currently mounted replacement instance (mutated in place). */
  mountedInstances: Map<string, ObjectRuntimeInstance>;
};

/**
 * Structure first, then root surfaces. VisualEffect / binding array order
 * has no rendering semantics — only VisualState maps do.
 */
export function reconcileScene(input: ReconcileSceneInput): void {
  const {
    root,
    document,
    state,
    surfaceBaseline,
    structuralBaselines,
    materials = {},
    objectRegistry,
    mountedInstances,
  } = input;

  reconcileStructure({
    state,
    structuralBaselines,
    objectRegistry,
    mountedInstances,
  });

  for (const target of document.targets) {
    if (structuralBaselines.has(target.key)) {
      continue;
    }

    const object = resolveTargetObject(root, target);
    const desired = state.targets[target.key];

    if (desired?.visible !== undefined) {
      object.visible = desired.visible;
    } else {
      const visibilityKey = `${target.key}/visibility`;
      const baselineVisible = surfaceBaseline[visibilityKey]?.visible;
      if (baselineVisible !== undefined) {
        object.visible = baselineVisible;
      }
    }

    const surface = state.rootSurfaces[target.key];
    if (surface?.materialAssetRevisionId) {
      const material = materials[surface.materialAssetRevisionId];
      if (!material) {
        throw new Error(
          `Missing resolved material for asset ${surface.materialAssetRevisionId}`
        );
      }
      assignMaterial(object, material);
    } else if (desired?.materialAssetRevisionId) {
      const material = materials[desired.materialAssetRevisionId];
      if (!material) {
        throw new Error(
          `Missing resolved material for asset ${desired.materialAssetRevisionId}`
        );
      }
      assignMaterial(object, material);
    } else {
      const baselineMaterial = baselineMaterialForTarget(
        surfaceBaseline,
        target
      );
      if (baselineMaterial) {
        assignMaterial(object, baselineMaterial);
      }
    }
  }
}

function reconcileStructure(input: {
  state: VisualState;
  structuralBaselines: Map<string, StructuralSlotBaseline>;
  objectRegistry: ObjectRuntimeRegistry;
  mountedInstances: Map<string, ObjectRuntimeInstance>;
}): void {
  const {
    state,
    structuralBaselines,
    objectRegistry,
    mountedInstances,
  } = input;

  for (const [slotKey, baseline] of structuralBaselines) {
    const desiredRevisionId = state.structure[slotKey];

    if (!desiredRevisionId) {
      if (mountedInstances.has(slotKey)) {
        restoreStructuralSlot(baseline);
        mountedInstances.delete(slotKey);
      }
      continue;
    }

    const existing = mountedInstances.get(slotKey);
    if (existing && existing.objectAssetRevisionId === desiredRevisionId) {
      continue;
    }

    const instance = objectRegistry.instantiate(desiredRevisionId, slotKey);
    mountObjectAtStructuralSlot(baseline, instance.object3D);
    mountedInstances.set(slotKey, instance);
  }
}
