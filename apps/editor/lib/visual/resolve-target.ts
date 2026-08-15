import type * as THREE from 'three';
import type { VisualTarget } from './types';

export class VisualTargetResolveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VisualTargetResolveError';
  }
}

/**
 * Resolve nodePath to exactly one Object3D.
 * 0 matches → error; >1 matches → error.
 * Never uses children[index] order.
 */
export function resolveTargetObject(
  root: THREE.Object3D,
  target: VisualTarget
): THREE.Object3D {
  const parts = target.nodePath.split('/').filter(Boolean);
  if (parts.length === 0) {
    throw new VisualTargetResolveError(
      `targetKey "${target.key}" has empty nodePath`
    );
  }

  const matches: THREE.Object3D[] = [];

  const walk = (
    node: THREE.Object3D,
    index: number,
    pathFromRoot: string[]
  ) => {
    if (index >= parts.length) return;
    const expected = parts[index]!;
    for (const child of node.children) {
      if (child.name !== expected) continue;
      const nextPath = [...pathFromRoot, child.name];
      if (index === parts.length - 1) {
        matches.push(child);
      } else {
        walk(child, index + 1, nextPath);
      }
    }
  };

  if (root.name === parts[0] && parts.length === 1) {
    matches.push(root);
  } else if (root.name === parts[0]) {
    walk(root, 1, [root.name]);
  } else {
    walk(root, 0, []);
  }

  if (matches.length === 0) {
    throw new VisualTargetResolveError(
      `targetKey "${target.key}" nodePath "${target.nodePath}" matched 0 objects`
    );
  }
  if (matches.length > 1) {
    throw new VisualTargetResolveError(
      `targetKey "${target.key}" nodePath "${target.nodePath}" matched ${matches.length} objects`
    );
  }
  return matches[0]!;
}
