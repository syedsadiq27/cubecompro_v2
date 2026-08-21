'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, StatusBadge } from '@repo/ui';
import {
  MATERIAL_ASSETS_QUERY,
  assertNoStructuralSurfaceConflicts,
  graphRequest,
  replaceComponentValueJson,
} from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';
import {
  bindingSemanticKey,
  type VisualBinding,
} from '@/lib/visual';

type MaterialOption = { id: string; name: string; code: string };

type MaterialAssetRow = {
  id: string;
  name: string;
  code?: string | null;
  currentRevisionId?: string | null;
};

function targetNodePath(
  targetKey: string,
  targets: { key: string; nodePath: string }[]
): string {
  return targets.find((t) => t.key === targetKey)?.nodePath ?? targetKey;
}

export function MappingsPanel() {
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const visualSelection = useEditorStore((state) => state.selection);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const dirty = useEditorStore((state) => state.dirty);
  const loading = useEditorStore((state) => state.loading);
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const updateVisualBinding = useEditorStore(
    (state) => state.updateVisualBinding
  );
  const addDraftVisualBinding = useEditorStore(
    (state) => state.addDraftVisualBinding
  );
  const removeDraftVisualBinding = useEditorStore(
    (state) => state.removeDraftVisualBinding
  );
  const saveVisualDocument = useEditorStore(
    (state) => state.saveVisualDocument
  );
  const reloadVisualDocument = useEditorStore(
    (state) => state.reloadVisualDocument
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const selectionIdentity = useEditorStore((state) => state.selectionIdentity);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [choiceKey, setChoiceKey] = useState('');
  const [valueKey, setValueKey] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [operation, setOperation] = useState<
    'SET_MATERIAL' | 'SET_VISIBILITY' | 'REPLACE_COMPONENT'
  >('SET_MATERIAL');
  const [materialRevisionId, setMaterialRevisionId] = useState('');
  const [linkedAssetKey, setLinkedAssetKey] = useState('');
  const [visible, setVisible] = useState(true);

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
        if (!cancelled) {
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
        }
      })
      .catch(() => {
        if (!cancelled) setMaterials([]);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth]);

  useEffect(() => {
    if (selectionIdentity?.target?.key) {
      setTargetKey(selectionIdentity.target.key);
    }
  }, [selectionIdentity?.target?.key]);

  const bindings = visualDocument?.bindings ?? [];
  const targets = visualDocument?.targets ?? [];
  const unsupported = visualDocument?.unsupported ?? [];

  const choices = graphDetail?.choices ?? [];
  const selectedChoice = choices.find((choice) => choice.key === choiceKey);
  const objectLinks = useMemo(
    () =>
      (visualDocument?.linkedAssets ?? []).filter(
        (asset) => asset.role === 'OBJECT' && asset.key !== 'root'
      ),
    [visualDocument]
  );

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

  const onAddBinding = () => {
    if (!choiceKey || !valueKey || !targetKey) {
      setStatusMessage('Choice, value, and target are required.');
      return;
    }

    try {
      assertNoStructuralSurfaceConflicts({
        targets: visualDocument.targets.map((target) => ({
          key: target.key,
          nodePath: target.nodePath,
        })),
        effects: [
          ...visualDocument.bindings.map((binding) => ({
            operation: binding.operation,
            targetKey: binding.targetKey,
          })),
          { operation, targetKey },
        ],
      });
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Invalid target layout'
      );
      return;
    }

    let binding: VisualBinding;
    if (operation === 'SET_MATERIAL') {
      if (!materialRevisionId) {
        setStatusMessage('Pick a material revision.');
        return;
      }
      binding = {
        choiceKey,
        valueKey,
        targetKey,
        operation: 'SET_MATERIAL',
        materialAssetRevisionId: materialRevisionId,
      };
    } else if (operation === 'REPLACE_COMPONENT') {
      if (!linkedAssetKey) {
        setStatusMessage('Pick a linked OBJECT asset key.');
        return;
      }
      binding = {
        choiceKey,
        valueKey,
        targetKey,
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey,
        expectedRole: 'OBJECT',
      };
    } else {
      binding = {
        choiceKey,
        valueKey,
        targetKey,
        operation: 'SET_VISIBILITY',
        visible,
      };
    }

    addDraftVisualBinding(binding);
    setStatusMessage('Draft binding added — Save to persist.');
  };

  return (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-3 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Make configurable ({bindings.length})
          </p>
          <StatusBadge
            role={dirty ? 'warning' : 'published'}
            label={dirty ? 'UNSAVED' : 'HYDRATED'}
          />
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          Bind choices to scene targets. Drafts replay immediately; Save
          persists, then reloads.
        </p>

        {selectionIdentity?.target ? (
          <p className="rounded-md bg-violet-50/50 px-2 py-1.5 text-[11px] text-[var(--ink)]">
            Selected target:{' '}
            <span className="font-medium text-[var(--brand)]">
              {selectionIdentity.target.key}
            </span>
          </p>
        ) : selectionIdentity ? (
          <p className="rounded-md border border-amber-200/80 bg-amber-50/40 px-2 py-1.5 text-[11px] text-[var(--ink)]">
            Selection is unbound — create a target from the Objects inspector
            first.
          </p>
        ) : null}

        <div className="space-y-1.5 rounded-lg border border-[var(--line)] p-2">
          <p className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
            Add binding
          </p>
          <select
            className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
            value={choiceKey}
            onChange={(event) => {
              setChoiceKey(event.target.value);
              setValueKey('');
            }}
          >
            <option value="">Choice</option>
            {choices.map((choice) => (
              <option key={choice.id} value={choice.key}>
                {choice.name || choice.key}
              </option>
            ))}
          </select>
          <select
            className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
            value={valueKey}
            onChange={(event) => setValueKey(event.target.value)}
            disabled={!selectedChoice}
          >
            <option value="">Value</option>
            {(selectedChoice?.values ?? []).map((value) => (
              <option key={value.id} value={value.key}>
                {value.name || value.key}
              </option>
            ))}
          </select>
          <select
            className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
            value={targetKey}
            onChange={(event) => setTargetKey(event.target.value)}
          >
            <option value="">Target</option>
            {targets.map((target) => (
              <option key={target.key} value={target.key}>
                {target.key} ({target.nodePath})
              </option>
            ))}
          </select>
          <select
            className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
            value={operation}
            onChange={(event) =>
              setOperation(
                event.target.value as
                  | 'SET_MATERIAL'
                  | 'SET_VISIBILITY'
                  | 'REPLACE_COMPONENT'
              )
            }
          >
            <option value="SET_MATERIAL">SET_MATERIAL</option>
            <option value="SET_VISIBILITY">SET_VISIBILITY</option>
            <option value="REPLACE_COMPONENT">REPLACE_COMPONENT</option>
          </select>
          {operation === 'SET_MATERIAL' ? (
            <select
              className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
              value={materialRevisionId}
              onChange={(event) => setMaterialRevisionId(event.target.value)}
            >
              <option value="">Material revision</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name || material.code || material.id}
                </option>
              ))}
            </select>
          ) : null}
          {operation === 'REPLACE_COMPONENT' ? (
            <select
              className="h-7 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px]"
              value={linkedAssetKey}
              onChange={(event) => setLinkedAssetKey(event.target.value)}
            >
              <option value="">Linked OBJECT key</option>
              {objectLinks.map((link) => (
                <option key={link.key} value={link.key}>
                  {link.key}
                </option>
              ))}
            </select>
          ) : null}
          {operation === 'SET_VISIBILITY' ? (
            <label className="flex items-center gap-2 text-[11px]">
              <input
                type="checkbox"
                checked={visible}
                onChange={(event) => setVisible(event.target.checked)}
              />
              Visible when selected
            </label>
          ) : null}
          <Button type="button" size="sm" className="w-full" onClick={onAddBinding}>
            Add draft binding
          </Button>
        </div>

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
              No visual bindings on this model yet.
            </p>
          ) : (
            [...bindings]
              .sort((a, b) => {
                const selectedKey = selectionIdentity?.target?.key;
                if (!selectedKey) return 0;
                const aHit = a.targetKey === selectedKey ? 0 : 1;
                const bHit = b.targetKey === selectedKey ? 0 : 1;
                return aHit - bHit;
              })
              .map((binding) => (
              <BindingRow
                key={bindingSemanticKey(binding)}
                binding={binding}
                active={
                  visualSelection[binding.choiceKey] === binding.valueKey
                }
                focused={
                  selectionIdentity?.target?.key === binding.targetKey
                }
                targetPath={targetNodePath(binding.targetKey, targets)}
                materials={materials}
                objectLinks={objectLinks.map((link) => link.key)}
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
                onRemove={() =>
                  removeDraftVisualBinding({
                    choiceKey: binding.choiceKey,
                    valueKey: binding.valueKey,
                    targetKey: binding.targetKey,
                    operation: binding.operation,
                  })
                }
              />
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 space-y-1.5 border-t border-[var(--line)] p-2.5">
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
        <button
          type="button"
          className="w-full text-[10px] text-[var(--text-muted)] hover:text-[var(--ink)]"
          onClick={() => {
            void reloadVisualDocument().catch(() => undefined);
          }}
        >
          Reload from API (discard draft)
        </button>
      </div>
    </div>
  );
}

function BindingRow(props: {
  binding: VisualBinding;
  active: boolean;
  focused?: boolean;
  targetPath: string;
  materials: MaterialOption[];
  objectLinks: string[];
  onChange: (patch: {
    materialAssetRevisionId?: string;
    visible?: boolean;
    linkedAssetKey?: string;
  }) => void;
  onRemove: () => void;
}) {
  const {
    binding,
    active,
    focused = false,
    targetPath,
    materials,
    objectLinks,
    onChange,
    onRemove,
  } = props;
  const materialOptions =
    binding.operation === 'SET_MATERIAL' &&
    binding.materialAssetRevisionId &&
    !materials.some((m) => m.id === binding.materialAssetRevisionId)
      ? [
          ...materials,
          {
            id: binding.materialAssetRevisionId,
            name: binding.materialAssetRevisionId,
            code: '',
          },
        ]
      : materials;

  return (
    <div
      className={`rounded-lg border p-2.5 space-y-1.5 ${
        active
          ? 'border-[var(--brand)] bg-violet-50/20'
          : focused
            ? 'border-[var(--brand)]/40 bg-violet-50/10'
            : 'border-[var(--line)] bg-[var(--surface-pure)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-[var(--ink)]">
          {binding.choiceKey} → {binding.valueKey}
        </span>
        <div className="flex items-center gap-1">
          <StatusBadge role="published" label={binding.operation} />
          <button
            type="button"
            className="text-[10px] text-[var(--text-muted)] hover:text-red-600"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-muted)] font-mono">
        Target: {binding.targetKey} ({targetPath})
      </p>
      {binding.operation === 'SET_MATERIAL' ? (
        <label className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
          Material revision
          <select
            className="h-7 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px] text-[var(--ink)]"
            value={binding.materialAssetRevisionId}
            onChange={(e) => onChange({ materialAssetRevisionId: e.target.value })}
          >
            {materialOptions.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name || material.code || material.id}
              </option>
            ))}
          </select>
        </label>
      ) : binding.operation === 'SET_VISIBILITY' ? (
        <label className="flex items-center gap-2 text-[11px] text-[var(--ink)]">
          <input
            type="checkbox"
            className="accent-[var(--brand)]"
            checked={binding.visible}
            onChange={(e) => onChange({ visible: e.target.checked })}
          />
          Visible
        </label>
      ) : (
        <label className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
          Linked OBJECT key
          <select
            className="h-7 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-1.5 text-[11px] text-[var(--ink)]"
            value={binding.linkedAssetKey}
            onChange={(e) => onChange({ linkedAssetKey: e.target.value })}
          >
            {[binding.linkedAssetKey, ...objectLinks]
              .filter((key, index, all) => all.indexOf(key) === index)
              .map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>
          <span className="font-mono text-[9px] opacity-70">
            {replaceComponentValueJson(binding.linkedAssetKey)}
          </span>
        </label>
      )}
    </div>
  );
}
