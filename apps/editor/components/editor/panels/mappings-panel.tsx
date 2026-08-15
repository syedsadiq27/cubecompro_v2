'use client';

import { useEffect, useState } from 'react';
import { Button, StatusBadge } from '@repo/ui';
import {
  MATERIAL_ASSETS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';
import { bindingSemanticKey, type VisualBinding } from '@/lib/visual';

type MaterialOption = { id: string; name: string; code: string };

function targetNodePath(
  targetKey: string,
  targets: { key: string; nodePath: string }[]
): string {
  return targets.find((t) => t.key === targetKey)?.nodePath ?? targetKey;
}

export function MappingsPanel() {
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const visualSelection = useEditorStore((state) => state.visualSelection);
  const dirty = useEditorStore((state) => state.dirty);
  const loading = useEditorStore((state) => state.loading);
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const updateVisualBinding = useEditorStore(
    (state) => state.updateVisualBinding
  );
  const saveVisualDocument = useEditorStore(
    (state) => state.saveVisualDocument
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!projectId || !graphAuth) {
      setMaterials([]);
      return;
    }
    let cancelled = false;
    void graphRequest<{ materialAssets: MaterialOption[] }>(
      MATERIAL_ASSETS_QUERY,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    )
      .then((data) => {
        if (!cancelled) setMaterials(data.materialAssets);
      })
      .catch(() => {
        if (!cancelled) setMaterials([]);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth]);

  const bindings = visualDocument?.bindings ?? [];
  const targets = visualDocument?.targets ?? [];
  const unsupported = visualDocument?.unsupported ?? [];

  if (!visualDocument) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-[12px] text-[var(--text-muted)]">
        Load a product revision to hydrate visual bindings.
      </div>
    );
  }

  const onSave = async () => {
    setSaving(true);
    try {
      await saveVisualDocument();
    } catch {
      /* statusMessage set in store */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-3 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Option &rarr; Scene Bindings ({bindings.length})
          </p>
          <StatusBadge
            role={dirty ? 'warning' : 'published'}
            label={dirty ? 'UNSAVED' : 'HYDRATED'}
          />
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          Edit SET_MATERIAL / SET_VISIBILITY, then Save. Preview selection drives
          replay.
        </p>

        {unsupported.length > 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-50/30 p-2 text-[10px] text-amber-900">
            {unsupported.map((entry) => (
              <div key={entry.effectId}>
                {entry.operation}: {entry.reason}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-1.5 text-[11px]">
          {bindings.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              No SET_MATERIAL / SET_VISIBILITY bindings on this model.
            </p>
          ) : (
            bindings.map((binding) => (
              <BindingRow
                key={bindingSemanticKey(binding)}
                binding={binding}
                active={
                  visualSelection[binding.choiceKey] === binding.valueKey
                }
                targetPath={targetNodePath(binding.targetKey, targets)}
                materials={materials}
                onChange={(patch) =>
                  updateVisualBinding(
                    {
                      choiceKey: binding.choiceKey,
                      valueKey: binding.valueKey,
                      targetKey: binding.targetKey,
                      operation: binding.operation,
                    },
                    patch
                  )
                }
              />
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-[var(--line)] p-2.5">
        <Button
          type="button"
          size="sm"
          className="w-full"
          disabled={!dirty || loading || saving}
          onClick={() => {
            void onSave();
          }}
        >
          {saving ? 'Saving…' : 'Save visual bindings'}
        </Button>
        {!dirty ? (
          <button
            type="button"
            className="mt-1.5 w-full text-[10px] text-[var(--text-muted)] hover:text-[var(--ink)]"
            onClick={() =>
              setStatusMessage('No unsaved binding edits.')
            }
          >
            Nothing to save
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BindingRow(props: {
  binding: VisualBinding;
  active: boolean;
  targetPath: string;
  materials: MaterialOption[];
  onChange: (patch: { materialAssetId?: string; visible?: boolean }) => void;
}) {
  const { binding, active, targetPath, materials, onChange } = props;
  const materialOptions =
    binding.operation === 'SET_MATERIAL' &&
    binding.materialAssetId &&
    !materials.some((m) => m.id === binding.materialAssetId)
      ? [
          ...materials,
          {
            id: binding.materialAssetId,
            name: binding.materialAssetId,
            code: '',
          },
        ]
      : materials;

  return (
    <div
      className={`rounded-lg border p-2.5 space-y-1.5 ${
        active
          ? 'border-[var(--brand)] bg-violet-50/20'
          : 'border-[var(--line)] bg-[var(--surface-pure)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-[var(--ink)]">
          {binding.choiceKey} &rarr; {binding.valueKey}
        </span>
        <StatusBadge role="published" label={binding.operation} />
      </div>
      <p className="text-[10px] text-[var(--text-muted)] font-mono">
        Target: {binding.targetKey} ({targetPath})
      </p>
      {binding.operation === 'SET_MATERIAL' ? (
        <label className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
          Material asset
          <select
            className="h-7 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px] text-[var(--ink)]"
            value={binding.materialAssetId}
            onChange={(e) => onChange({ materialAssetId: e.target.value })}
          >
            {materialOptions.length === 0 ? (
              <option value={binding.materialAssetId}>
                {binding.materialAssetId}
              </option>
            ) : (
              materialOptions.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name || material.code || material.id}
                </option>
              ))
            )}
          </select>
        </label>
      ) : (
        <label className="flex items-center gap-2 text-[11px] text-[var(--ink)]">
          <input
            type="checkbox"
            className="accent-[var(--brand)]"
            checked={binding.visible}
            onChange={(e) => onChange({ visible: e.target.checked })}
          />
          Visible
        </label>
      )}
    </div>
  );
}
