import type { GraphDetail } from '@repo/product-graph';
import {
  assertNoStructuralSurfaceConflicts,
  findStructuralSurfaceConflicts,
} from '@repo/product-graph';
import type { VisualBinding, VisualDocument } from './visual/types';

function bindingSemanticKey(binding: {
  choiceKey: string;
  valueKey: string;
  targetKey: string;
  operation: string;
}): string {
  return `${binding.choiceKey}:${binding.valueKey}:${binding.targetKey}:${binding.operation}`;
}

export type AuthoringFocus = {
  choiceKey: string;
  valueKey: string;
};

export type EffectRef = {
  choiceKey: string;
  valueKey: string;
  targetKey: string;
  operation: VisualBinding['operation'];
};

export type EffectComposer = {
  choiceKey: string;
  valueKey: string;
  operation: VisualBinding['operation'] | null;
  targetKey: string | null;
  pendingNodePath: string | null;
  materialAssetRevisionId: string | null;
  linkedAssetKey: string | null;
  visible: boolean;
  materialSlot: string | null;
};

export type PickMode = {
  kind: 'effect-target';
  operation: VisualBinding['operation'];
} | null;

export function isRevisionEditable(status: string | null | undefined): boolean {
  return (status ?? '').toUpperCase() === 'DRAFT';
}

export function revisionStatusLabel(status: string | null | undefined): string {
  const normalized = (status ?? 'UNKNOWN').toUpperCase();
  if (normalized === 'DRAFT') return 'DRAFT';
  if (normalized === 'PUBLISHED') return 'PUBLISHED';
  if (normalized === 'ARCHIVED') return 'ARCHIVED';
  return normalized;
}

export function effectsForChoiceValue(
  document: VisualDocument | null,
  choiceKey: string,
  valueKey: string
): VisualBinding[] {
  if (!document) return [];
  return document.bindings.filter(
    (binding) =>
      binding.choiceKey === choiceKey && binding.valueKey === valueKey
  );
}

export function effectCountForChoiceValue(
  document: VisualDocument | null,
  choiceKey: string,
  valueKey: string
): number {
  return effectsForChoiceValue(document, choiceKey, valueKey).length;
}

export function buildCoverageRows(
  detail: GraphDetail | null,
  document: VisualDocument | null
): Array<{
  choiceKey: string;
  choiceName: string;
  values: Array<{
    valueKey: string;
    valueName: string;
    effectCount: number;
    unbound: boolean;
  }>;
}> {
  if (!detail) return [];
  return [...detail.choices]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((choice) => ({
      choiceKey: choice.key,
      choiceName: choice.name?.trim() || choice.key,
      values: [...choice.values]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((value) => {
          const effectCount = effectCountForChoiceValue(
            document,
            choice.key,
            value.key
          );
          return {
            valueKey: value.key,
            valueName: value.name?.trim() || value.key,
            effectCount,
            unbound: effectCount === 0,
          };
        }),
    }));
}

export function emptyEffectComposer(
  focus: AuthoringFocus
): EffectComposer {
  return {
    choiceKey: focus.choiceKey,
    valueKey: focus.valueKey,
    operation: null,
    targetKey: null,
    pendingNodePath: null,
    materialAssetRevisionId: null,
    linkedAssetKey: null,
    visible: true,
    materialSlot: null,
  };
}

export function effectRefKey(ref: EffectRef): string {
  return bindingSemanticKey(ref);
}

export function validateEffectTarget(input: {
  document: VisualDocument;
  operation: VisualBinding['operation'];
  targetKey: string;
}): { ok: true } | { ok: false; message: string } {
  if (input.operation === 'SET_MATERIAL') {
    try {
      assertNoStructuralSurfaceConflicts({
        targets: input.document.targets.map((target) => ({
          key: target.key,
          nodePath: target.nodePath,
        })),
        effects: [
          ...input.document.bindings.map((binding) => ({
            operation: binding.operation,
            targetKey: binding.targetKey,
          })),
          { operation: 'SET_MATERIAL', targetKey: input.targetKey },
        ],
      });
    } catch {
      const conflicts = findStructuralSurfaceConflicts({
        targets: input.document.targets.map((target) => ({
          key: target.key,
          nodePath: target.nodePath,
        })),
        effects: [
          ...input.document.bindings.map((binding) => ({
            operation: binding.operation,
            targetKey: binding.targetKey,
          })),
          { operation: 'SET_MATERIAL', targetKey: input.targetKey },
        ],
      });
      const conflict = conflicts[0];
      return {
        ok: false,
        message: conflict
          ? `This surface belongs to a replaceable component (${conflict.structuralTargetKey}). Material overrides on replacement-local surfaces are supported in 4F.`
          : 'SET_MATERIAL cannot target a surface inside a replaceable component subtree (4F).',
      };
    }
  }

  const target = input.document.targets.find((entry) => entry.key === input.targetKey);
  if (!target) {
    return { ok: false, message: `Unknown target "${input.targetKey}".` };
  }

  return { ok: true };
}

export function composerToBinding(
  composer: EffectComposer
): VisualBinding | null {
  if (!composer.operation || !composer.targetKey) return null;
  if (composer.operation === 'SET_MATERIAL') {
    if (!composer.materialAssetRevisionId) return null;
    return {
      choiceKey: composer.choiceKey,
      valueKey: composer.valueKey,
      targetKey: composer.targetKey,
      operation: 'SET_MATERIAL',
      materialAssetRevisionId: composer.materialAssetRevisionId,
      ...(composer.materialSlot
        ? { materialSlot: composer.materialSlot }
        : {}),
    };
  }
  if (composer.operation === 'REPLACE_COMPONENT') {
    if (!composer.linkedAssetKey) return null;
    return {
      choiceKey: composer.choiceKey,
      valueKey: composer.valueKey,
      targetKey: composer.targetKey,
      operation: 'REPLACE_COMPONENT',
      linkedAssetKey: composer.linkedAssetKey,
      expectedRole: 'OBJECT',
    };
  }
  return {
    choiceKey: composer.choiceKey,
    valueKey: composer.valueKey,
    targetKey: composer.targetKey,
    operation: 'SET_VISIBILITY',
    visible: composer.visible,
  };
}
