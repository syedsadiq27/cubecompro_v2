import type * as THREE from 'three';
import type { EditorDocument } from '../editor-store';
import type {
  InspectorContextKind,
  InspectorRuntimeContext,
} from './types';

export function resolveInspectorKind(
  selected: THREE.Object3D | null
): InspectorContextKind {
  if (!selected) return 'model';
  if (
    selected.userData?.decoration === true ||
    selected.userData?.isDecoration === true ||
    selected.userData?.kind === 'decoration'
  ) {
    return 'decoration';
  }
  return 'object';
}

export function createInspectorContext({
  selected,
  document,
  selectionRevision,
}: {
  selected: THREE.Object3D | null;
  document: EditorDocument | null;
  selectionRevision: number;
}): InspectorRuntimeContext {
  return {
    kind: resolveInspectorKind(selected),
    selected,
    document,
    selectionRevision,
  };
}

export function objectLabel(object: THREE.Object3D | null): string {
  if (!object) return 'Model';
  if (typeof object.userData.name === 'string' && object.userData.name) {
    return object.userData.name;
  }
  return object.name || 'Object';
}

export function readMaterialName(object: THREE.Object3D | null): string | null {
  if (!object) return null;
  if (typeof object.userData.material === 'string') {
    return object.userData.material;
  }
  if (Array.isArray(object.userData.material) && object.userData.material[0]) {
    return String(object.userData.material[0]);
  }
  let found: string | null = null;
  object.traverse((node) => {
    if (found) return;
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const material = Array.isArray(mesh.material)
      ? mesh.material[0]
      : mesh.material;
    if (material?.name) found = material.name;
  });
  return found;
}

export function countGeometry(object: THREE.Object3D | null): {
  meshes: number;
  triangles: number;
} {
  let meshes = 0;
  let triangles = 0;
  if (!object) return { meshes, triangles };
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    meshes += 1;
    const index = mesh.geometry.index;
    if (index) {
      triangles += Math.floor(index.count / 3);
    } else {
      const position = mesh.geometry.getAttribute('position');
      if (position) triangles += Math.floor(position.count / 3);
    }
  });
  return { meshes, triangles };
}
