import type * as THREE from 'three';
import type { VisualTarget } from './types';

export class VisualTargetResolveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VisualTargetResolveError';
  }
}

function matchPathFrom(
  start: THREE.Object3D,
  parts: string[]
): THREE.Object3D | null {
  if (start.name !== parts[0]) return null;
  let current = start;
  for (let i = 1; i < parts.length; i++) {
    const expected = parts[i]!;
    const next = current.children.filter((child) => child.name === expected);
    if (next.length === 0) return null;
    if (next.length > 1) return null;
    current = next[0]!;
  }
  return current;
}

/**
 * Resolve nodePath to exactly one Object3D under the ObjectAsset tree.
 * 0 matches → error; >1 matches → error.
 * Path may start below wrapper groups (productRoot / glTF scene).
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
  const direct = matchPathFrom(root, parts);
  if (direct) matches.push(direct);

  root.traverse((node) => {
    if (node === root) return;
    const match = matchPathFrom(node, parts);
    if (match) matches.push(match);
  });

  const unique = [...new Set(matches)];

  if (unique.length === 0) {
    throw new VisualTargetResolveError(
      `targetKey "${target.key}" nodePath "${target.nodePath}" matched 0 objects`
    );
  }
  if (unique.length > 1) {
    throw new VisualTargetResolveError(
      `targetKey "${target.key}" nodePath "${target.nodePath}" matched ${unique.length} objects`
    );
  }
  return unique[0]!;
}
