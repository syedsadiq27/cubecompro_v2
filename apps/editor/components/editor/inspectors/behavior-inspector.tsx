'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MATERIAL_ASSETS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import {
  effectsForChoiceValue,
  isRevisionEditable,
} from '@/lib/authoring-focus';
import { useEditorStore } from '@/lib/editor-store';
import { bindingSemanticKey, type VisualBinding } from '@/lib/visual';

type MaterialOption = { id: string; name: string; code: string };

type MaterialAssetRow = {
  id: string;
  name: string;
  code?: string | null;
  currentRevisionId?: string | null;
};

export function BehaviorInspector() {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const updateVisualBinding = useEditorStore(
    (state) => state.updateVisualBinding
  );
  const addDraftVisualBinding = useEditorStore(
    (state) => state.addDraftVisualBinding
  );
  const removeDraftVisualBinding = useEditorStore(
    (state) => state.removeDraftVisualBinding
  );
  const startTargetPick = useEditorStore((state) => state.startTargetPick);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);

  const editable = isRevisionEditable(graphDetail?.status);

  useEffect(() => {
    if (!projectId || !graphAuth) {
      setMaterials([]);
      return;
    }
    let cancelled = false;
    void graphRequest<{ materialAssets: MaterialAssetRow[] }>(
      MATERIAL_ASSETS_QUERY,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    )
      .then((data) => {
        if (cancelled) return;
        setMaterials(
          data.materialAssets
            .map((asset) =>
              asset.currentRevisionId
                ? {
                    id: asset.currentRevisionId,
                    name: asset.name,
                    code: asset.code ?? '',
                  }
                : null
            )
            .filter((row): row is MaterialOption => row !== null)
        );
      })
      .catch(() => {
        if (!cancelled) setMaterials([]);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth]);

  const focusMeta = useMemo(() => {
    if (!authoringFocus || !graphDetail) return null;
    const choice = graphDetail.choices.find(
      (entry) => entry.key === authoringFocus.choiceKey
    );
    const value = choice?.values.find(
      (entry) => entry.key === authoringFocus.valueKey
    );
    if (!choice || !value) return null;
    return {
      choiceKey: choice.key,
      valueKey: value.key,
      choiceName: choice.name?.trim() || choice.key,
      valueName: value.name?.trim() || value.key,
    };
  }, [authoringFocus, graphDetail]);

  const effects = useMemo(() => {
    if (!authoringFocus) return [];
    return effectsForChoiceValue(
      visualDocument,
      authoringFocus.choiceKey,
      authoringFocus.valueKey
    );
  }, [authoringFocus, visualDocument]);

  const availableTargets = useMemo(() => {
    return visualDocument?.targets ?? [];
  }, [visualDocument]);

  const handleAddEffect = (operation: VisualBinding['operation']) => {
    if (!authoringFocus) return;
    setIsAddMenuOpen(false);

    const firstTarget = availableTargets[0]?.key || 'target_0';
    const firstMat = materials[0]?.id || 'mat_default';

    if (operation === 'SET_MATERIAL') {
      addDraftVisualBinding({
        choiceKey: authoringFocus.choiceKey,
        valueKey: authoringFocus.valueKey,
        targetKey: firstTarget,
        operation: 'SET_MATERIAL',
        materialAssetRevisionId: firstMat,
      });
    } else if (operation === 'SET_VISIBILITY') {
      addDraftVisualBinding({
        choiceKey: authoringFocus.choiceKey,
        valueKey: authoringFocus.valueKey,
        targetKey: firstTarget,
        operation: 'SET_VISIBILITY',
        visible: true,
      });
    } else {
      addDraftVisualBinding({
        choiceKey: authoringFocus.choiceKey,
        valueKey: authoringFocus.valueKey,
        targetKey: firstTarget,
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey: 'asset_0',
        expectedRole: 'OBJECT',
      });
    }
    setStatusMessage(`Added ${operation} effect`);
  };

  if (!authoringFocus || !focusMeta) {
    return (
      <div className="space-y-3 p-4 text-[12px] text-white/50 select-none">
        <p>Select a choice value on the left to edit its visual effects.</p>
        <p className="text-[11px] text-white/30">
          When shoppers select a product value, visual effects apply material, visibility, or component overrides.
        </p>
      </div>
    );
  }

  const isBound = effects.length > 0;

  return (
    <div className="space-y-4 text-white select-none">
      {/* Choice Value Header Card */}
      <div className="rounded-2xl border border-white/10 bg-[#181920] p-3 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#8A6040] via-[#5C3D24] to-[#2B1B10] border border-white/15 shadow-md flex items-center justify-center text-[16px]">
          ✦
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">
            {focusMeta.choiceName} / {focusMeta.valueName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBound ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-[10px] text-white/50">
              {isBound ? 'Bound' : 'Unbound'}
            </span>
          </div>
        </div>
      </div>

      {/* Effects Header & Add Button */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-white/60 font-medium">
            {effects.length} effect{effects.length === 1 ? '' : 's'}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAddMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-[#665CFF]/60 bg-[#232549] px-3 py-1.5 text-[11px] font-medium text-[#9D95FF] hover:bg-[#2E2A59] transition-colors shadow-xs"
            >
              <span>+ Add effect</span>
              <span className="text-[9px] text-white/40">▾</span>
            </button>

            {isAddMenuOpen ? (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[11px] text-white shadow-2xl backdrop-blur z-30 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleAddEffect('SET_MATERIAL')}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="text-[#9D95FF]">🎨</span>
                  <div>
                    <p className="font-medium text-white">SET_MATERIAL</p>
                    <p className="text-[9px] text-white/40">Assign PBR material</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddEffect('SET_VISIBILITY')}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="text-[#9D95FF]">👁</span>
                  <div>
                    <p className="font-medium text-white">SET_VISIBILITY</p>
                    <p className="text-[9px] text-white/40">Toggle mesh visibility</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddEffect('REPLACE_COMPONENT')}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="text-[#9D95FF]">📦</span>
                  <div>
                    <p className="font-medium text-white">REPLACE_COMPONENT</p>
                    <p className="text-[9px] text-white/40">Swap 3D sub-assembly</p>
                  </div>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Effects List */}
        {effects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-[11px] text-white/40">
            No visual effects configured for {focusMeta.valueName}. Click "+ Add effect" above to bind a material or visibility rule.
          </div>
        ) : (
          <div className="space-y-2.5">
            {effects.map((binding, index) => {
              const targetName = binding.targetKey;
              const isMaterial = binding.operation === 'SET_MATERIAL';
              const isVisibility = binding.operation === 'SET_VISIBILITY';

              const assignedMaterial =
                binding.operation === 'SET_MATERIAL'
                  ? materials.find((m) => m.id === binding.materialAssetRevisionId)
                  : null;

              return (
                <div
                  key={`${binding.targetKey}-${binding.operation}-${index}`}
                  className="rounded-2xl border border-white/10 bg-[#181920] p-3.5 space-y-3 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 font-mono text-[10px] text-white/60">
                        {index + 1}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-white tracking-wide">
                        {binding.operation}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Delete effect button */}
                      <button
                        type="button"
                        onClick={() =>
                          removeDraftVisualBinding({
                            choiceKey: binding.choiceKey,
                            valueKey: binding.valueKey,
                            targetKey: binding.targetKey,
                            operation: binding.operation,
                          })
                        }
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete effect"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="p-1 text-white/30 hover:text-white transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Target Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-white/50">Target</span>
                    <select
                      value={binding.targetKey}
                      onChange={(e) => {
                        updateVisualBinding(
                          {
                            choiceKey: binding.choiceKey,
                            valueKey: binding.valueKey,
                            targetKey: binding.targetKey,
                            operation: binding.operation,
                          },
                          { linkedAssetKey: e.target.value }
                        );
                      }}
                      className="h-8 w-full rounded-xl border border-white/10 bg-[#121318] px-2.5 text-[12px] text-white outline-none cursor-pointer"
                    >
                      {availableTargets.length > 0 ? (
                        availableTargets.map((t) => (
                          <option key={t.key} value={t.key} className="bg-[#16171E] text-white">
                            {t.key}
                          </option>
                        ))
                      ) : (
                        <option value={binding.targetKey} className="bg-[#16171E] text-white">
                          {binding.targetKey}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Material Payload */}
                  {binding.operation === 'SET_MATERIAL' ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-white/50">Material</span>
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121318] p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-[#8A6040] via-[#5C3D24] to-[#2B1B10] border border-white/15 shadow-xs" />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium text-white">
                              {assignedMaterial?.name || 'American Walnut v4'}
                            </p>
                            <p className="text-[9px] text-white/40">Material Revision</p>
                          </div>
                        </div>

                        <select
                          value={binding.materialAssetRevisionId ?? ''}
                          onChange={(e) => {
                            updateVisualBinding(
                              {
                                choiceKey: binding.choiceKey,
                                valueKey: binding.valueKey,
                                targetKey: binding.targetKey,
                                operation: binding.operation,
                              },
                              { materialAssetRevisionId: e.target.value }
                            );
                          }}
                          className="bg-transparent text-[11px] font-medium text-[#9D95FF] outline-none cursor-pointer pr-1"
                        >
                          {materials.map((m) => (
                            <option key={m.id} value={m.id} className="bg-[#16171E] text-white">
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}

                  {/* Visibility Payload */}
                  {binding.operation === 'SET_VISIBILITY' ? (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-medium text-white/70">Visible</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={binding.visible !== false}
                          onChange={(e) => {
                            updateVisualBinding(
                              {
                                choiceKey: binding.choiceKey,
                                valueKey: binding.valueKey,
                                targetKey: binding.targetKey,
                                operation: binding.operation,
                              },
                              { visible: e.target.checked }
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#665CFF]" />
                      </label>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {/* Reorder indicator */}
            {effects.length > 1 ? (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 py-2 text-[10px] text-white/40">
                <span>⤨</span>
                <span>Drop to reorder</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Details Collapsible Section */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <div
          onClick={() => setDetailsCollapsed((prev) => !prev)}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Details
          </span>
          <span className="text-[10px] text-white/30">
            {detailsCollapsed ? '▸' : '▾'}
          </span>
        </div>

        {!detailsCollapsed ? (
          <div className="rounded-xl border border-white/10 bg-[#181920] p-2.5 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-white/40">Choice</span>
              <span className="font-medium text-white/80">{focusMeta.choiceName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Value</span>
              <span className="font-medium text-white/80">{focusMeta.valueName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Value Key</span>
              <span className="font-mono text-[10px] text-white/60">{focusMeta.valueKey}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Choice Key</span>
              <span className="font-mono text-[10px] text-white/60">{focusMeta.choiceKey}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
