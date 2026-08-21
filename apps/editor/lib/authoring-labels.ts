import type * as THREE from 'three';
import type { VisualBinding, VisualDocument } from './visual/types';
import {
  sceneNodeKind,
  type SceneNodeKind,
} from './scene-tree';

export type SceneObjectKind = SceneNodeKind;

export function sceneObjectKind(object: THREE.Object3D): SceneObjectKind {
  return sceneNodeKind(object);
}

export function sceneObjectKindLabel(kind: SceneObjectKind): string {
  if (kind === 'mesh') return 'Mesh';
  if (kind === 'group') return 'Group';
  return 'Object';
}

export function hierarchyBreadcrumb(nodePath: string): string {
  return nodePath
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' › ');
}

export function baselineMaterialLabel(object: THREE.Object3D): string {
  const mesh = object as THREE.Mesh;
  if (!mesh.isMesh || !mesh.material) return 'No material';
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];
  const named = materials
    .map((material) => material.name?.trim())
    .filter((name): name is string => Boolean(name));
  if (named.length === 0) return 'Baseline material';
  return named.join(', ');
}

export function materialSlotLabel(slot?: string | null): string {
  const trimmed = slot?.trim();
  if (!trimmed) return 'Slot 0';
  if (/^\d+$/.test(trimmed)) return `Slot ${trimmed}`;
  return trimmed;
}

export function bindingSummary(
  binding: VisualBinding,
  options?: {
    choiceName?: string;
    valueName?: string;
    materialName?: string;
  }
): { title: string; detail: string } {
  const choice = options?.choiceName ?? binding.choiceKey;
  const value = options?.valueName ?? binding.valueKey;
  const title = `${choice} → ${value}`;
  if (binding.operation === 'SET_MATERIAL') {
    return {
      title,
      detail: `SET_MATERIAL · ${options?.materialName ?? binding.materialAssetRevisionId}`,
    };
  }
  if (binding.operation === 'REPLACE_COMPONENT') {
    return {
      title,
      detail: `REPLACE_COMPONENT · ${binding.linkedAssetKey}`,
    };
  }
  return {
    title,
    detail: `SET_VISIBILITY · ${binding.visible ? 'Show' : 'Hide'}`,
  };
}

export function usedByLabel(input: {
  document: VisualDocument | null;
  objectAssetRevisionId: string | null;
  compositionSlotKey: string | null;
}): string {
  const { document, objectAssetRevisionId, compositionSlotKey } = input;
  if (compositionSlotKey) {
    return `Component · ${compositionSlotKey}`;
  }
  if (
    document?.rootObjectAssetRevisionId &&
    objectAssetRevisionId &&
    objectAssetRevisionId === document.rootObjectAssetRevisionId
  ) {
    return 'Root object';
  }
  if (objectAssetRevisionId) {
    return 'Object revision';
  }
  return 'Scene object';
}
