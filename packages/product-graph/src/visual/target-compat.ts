export type VisualTargetPath = {
  key: string;
  nodePath: string;
};

export type VisualEffectTargetRef = {
  operation: string;
  targetKey: string;
};

function normalizeNodePath(nodePath: string): string {
  return nodePath
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

/**
 * True when `candidate` is the same path as `ancestor` or a descendant under it.
 */
export function isNodePathUnder(
  ancestorNodePath: string,
  candidateNodePath: string
): boolean {
  const ancestor = normalizeNodePath(ancestorNodePath);
  const candidate = normalizeNodePath(candidateNodePath);
  if (!ancestor || !candidate) return false;
  if (candidate === ancestor) return true;
  return candidate.startsWith(`${ancestor}/`);
}

export type StructuralSurfaceConflict = {
  surfaceTargetKey: string;
  surfaceNodePath: string;
  structuralTargetKey: string;
  structuralNodePath: string;
};

/**
 * 4E rule: SET_MATERIAL targets must not live inside a replaceable structural subtree.
 */
export function findStructuralSurfaceConflicts(input: {
  targets: VisualTargetPath[];
  effects: VisualEffectTargetRef[];
}): StructuralSurfaceConflict[] {
  const byKey = new Map(
    input.targets.map((target) => [target.key, normalizeNodePath(target.nodePath)])
  );

  const structuralKeys = new Set<string>();
  const surfaceKeys = new Set<string>();

  for (const effect of input.effects) {
    const op = effect.operation.toUpperCase();
    if (op === 'REPLACE_COMPONENT') {
      structuralKeys.add(effect.targetKey);
    }
    if (op === 'SET_MATERIAL') {
      surfaceKeys.add(effect.targetKey);
    }
  }

  const conflicts: StructuralSurfaceConflict[] = [];

  for (const surfaceKey of surfaceKeys) {
    const surfacePath = byKey.get(surfaceKey);
    if (!surfacePath) continue;

    for (const structuralKey of structuralKeys) {
      if (surfaceKey === structuralKey) {
        const structuralPath = byKey.get(structuralKey) ?? surfacePath;
        conflicts.push({
          surfaceTargetKey: surfaceKey,
          surfaceNodePath: surfacePath,
          structuralTargetKey: structuralKey,
          structuralNodePath: structuralPath,
        });
        continue;
      }
      const structuralPath = byKey.get(structuralKey);
      if (!structuralPath) continue;
      if (isNodePathUnder(structuralPath, surfacePath)) {
        conflicts.push({
          surfaceTargetKey: surfaceKey,
          surfaceNodePath: surfacePath,
          structuralTargetKey: structuralKey,
          structuralNodePath: structuralPath,
        });
      }
    }
  }

  return conflicts;
}

export function assertNoStructuralSurfaceConflicts(input: {
  targets: VisualTargetPath[];
  effects: VisualEffectTargetRef[];
}): void {
  const conflicts = findStructuralSurfaceConflicts(input);
  if (conflicts.length === 0) return;
  const first = conflicts[0]!;
  throw new Error(
    `SET_MATERIAL target "${first.surfaceTargetKey}" (${first.surfaceNodePath}) lives inside replaceable structural target "${first.structuralTargetKey}" (${first.structuralNodePath})`
  );
}
