import type * as THREE from 'three';
import type {
  VisualBinding,
  VisualDocument,
  VisualTarget,
} from './visual/types';

export type SelectionIdentity = {
  objectName: string;
  nodePath: string;
  objectAssetRevisionId: string | null;
  runtimeInstanceId: string | null;
  compositionSlotKey: string | null;
  target: VisualTarget | null;
  bindings: VisualBinding[];
};

function normalizePath(path: string): string {
  return path
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');
}

/**
 * Prefer CubeCom authoring paths (skip loader wrappers under productRoot).
 */
export function buildAuthoringNodePath(
  object: THREE.Object3D,
  productRoot: THREE.Object3D
): string {
  const skip = new Set(['', 'productroot', 'loaded-model']);
  const parts: string[] = [];
  let current: THREE.Object3D | null = object;
  while (current && current !== productRoot.parent) {
    const name = current.name.trim();
    if (name && !skip.has(name.toLowerCase())) {
      parts.unshift(name);
    }
    if (current === productRoot) break;
    current = current.parent;
  }
  return parts.join('/') || object.name || 'root';
}

export function pathsReferToSameNode(
  authoredPath: string,
  selectedPath: string
): boolean {
  const a = normalizePath(authoredPath);
  const b = normalizePath(selectedPath);
  if (!a || !b) return false;
  if (a === b) return true;
  return a.endsWith(`/${b}`) || b.endsWith(`/${a}`);
}

function readRuntimeIdentity(object: THREE.Object3D): {
  objectAssetRevisionId: string | null;
  runtimeInstanceId: string | null;
  compositionSlotKey: string | null;
} {
  let current: THREE.Object3D | null = object;
  while (current) {
    const revisionId =
      typeof current.userData.objectAssetRevisionId === 'string'
        ? current.userData.objectAssetRevisionId
        : null;
    const runtimeInstanceId =
      typeof current.userData.runtimeInstanceId === 'string'
        ? current.userData.runtimeInstanceId
        : null;
    const compositionSlotKey =
      typeof current.userData.compositionSlotKey === 'string'
        ? current.userData.compositionSlotKey
        : null;
    if (revisionId || runtimeInstanceId || compositionSlotKey) {
      return {
        objectAssetRevisionId: revisionId,
        runtimeInstanceId,
        compositionSlotKey,
      };
    }
    current = current.parent;
  }
  return {
    objectAssetRevisionId: null,
    runtimeInstanceId: null,
    compositionSlotKey: null,
  };
}

export function resolveSelectionIdentity(input: {
  object: THREE.Object3D | null;
  productRoot: THREE.Object3D | null;
  document: VisualDocument | null;
}): SelectionIdentity | null {
  const { object, productRoot, document } = input;
  if (!object || !productRoot) return null;

  const nodePath = buildAuthoringNodePath(object, productRoot);
  const runtime = readRuntimeIdentity(object);
  const target =
    document?.targets.find((entry) =>
      pathsReferToSameNode(entry.nodePath, nodePath)
    ) ?? null;
  const bindings =
    target && document
      ? document.bindings.filter((binding) => binding.targetKey === target.key)
      : [];

  return {
    objectName: object.name || 'Object',
    nodePath,
    objectAssetRevisionId: runtime.objectAssetRevisionId,
    runtimeInstanceId: runtime.runtimeInstanceId,
    compositionSlotKey: runtime.compositionSlotKey,
    target,
    bindings,
  };
}
