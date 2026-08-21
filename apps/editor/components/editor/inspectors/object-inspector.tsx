'use client';

import { useMemo, useState } from 'react';
import { Button, DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import {
  baselineMaterialLabel,
  bindingSummary,
  hierarchyBreadcrumb,
  materialSlotLabel,
  sceneObjectKind,
  sceneObjectKindLabel,
  usedByLabel,
} from '@/lib/authoring-labels';
import { useEditorStore } from '@/lib/editor-store';
import { semanticKeyFromName } from '@/lib/scene-tree';

export function ObjectInspector() {
  const selected = useEditorStore((state) => state.selected);
  const identity = useEditorStore((state) => state.selectionIdentity);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const documentMeta = useEditorStore((state) => state.document);
  const loading = useEditorStore((state) => state.loading);
  const runtime = useEditorStore((state) => state.runtime);
  const pickMode = useEditorStore((state) => state.pickMode);
  const effectComposer = useEditorStore((state) => state.effectComposer);
  const createModelTargetFromSelection = useEditorStore(
    (state) => state.createModelTargetFromSelection
  );
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [targetKey, setTargetKey] = useState('');
  const [targetType, setTargetType] = useState('MATERIAL');
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const kind = selected ? sceneObjectKind(selected) : null;
  const breadcrumb = identity
    ? hierarchyBreadcrumb(identity.nodePath)
    : '';
  const rootLabel =
    documentMeta?.modelName?.trim() ||
    documentMeta?.productName?.trim() ||
    'Primary model';

  const choiceLabels = useMemo(() => {
    const map = new Map<string, { name: string; values: Map<string, string> }>();
    for (const choice of graphDetail?.choices ?? []) {
      map.set(choice.key, {
        name: choice.name?.trim() || choice.key,
        values: new Map(
          (choice.values ?? []).map((value) => [
            value.key,
            value.name?.trim() || value.key,
          ])
        ),
      });
    }
    return map;
  }, [graphDetail?.choices]);

  if (!selected || !identity) {
    return (
      <div className="space-y-2 text-[12px] text-[var(--text-muted)]">
        <p>Select an object in the viewport or scene tree.</p>
        <p className="text-[11px]">
          Selection drives the inspector, outline, and configurable target
          authoring.
        </p>
      </div>
    );
  }

  const defaultKey =
    targetKey || semanticKeyFromName(identity.objectName) || 'target';
  const usedBy = usedByLabel({
    document: visualDocument,
    objectAssetRevisionId: identity.objectAssetRevisionId,
    compositionSlotKey: identity.compositionSlotKey,
  });
  const revisionHint = identity.objectAssetRevisionId
    ? ` · ${identity.objectAssetRevisionId.slice(0, 8)}`
    : '';

  const onCreateTarget = async () => {
    setBusy(true);
    try {
      await createModelTargetFromSelection({
        key: defaultKey,
        targetType,
      });
      setTargetKey('');
      setShowCreate(false);
      setActiveWorkspace('mappings');
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to create target'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 pb-1">
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold text-[var(--ink)]">
              {identity.objectName}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {kind ? sceneObjectKindLabel(kind) : 'Object'}
            </p>
          </div>
          <StatusBadge
            role={identity.target ? 'published' : 'warning'}
            label={identity.target ? 'TARGET' : 'UNBOUND'}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => runtime?.frameSelection()}
          >
            Frame
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              selected.visible = !selected.visible;
              useEditorStore.getState().bumpSelection();
            }}
          >
            {selected.visible ? 'Hide' : 'Show'}
          </Button>
          {pickMode || effectComposer ? (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                void useEditorStore
                  .getState()
                  .applyPickedTargetFromSelection()
                  .catch((error) => {
                    setStatusMessage(
                      error instanceof Error
                        ? error.message
                        : 'Could not use selection as target'
                    );
                  });
              }}
            >
              Use as target
            </Button>
          ) : null}
        </div>
      </div>

      <InspectorSection title="Object">
        <p className="text-[12px] leading-relaxed text-[var(--ink)]">
          <span className="text-[var(--text-muted)]">{rootLabel}</span>
          {breadcrumb ? (
            <>
              <span className="text-[var(--text-muted)]"> › </span>
              {breadcrumb}
            </>
          ) : null}
        </p>
      </InspectorSection>

      <InspectorSection title="Target">
        {identity.target ? (
          <div className="space-y-1">
            <p className="text-[12px] font-medium text-[var(--ink)]">
              {identity.target.key}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Configurable · {materialSlotLabel(identity.target.materialSlot)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] text-[var(--text-muted)]">Unbound</p>
              <Button
                type="button"
                size="sm"
                disabled={busy || loading}
                onClick={() => setShowCreate((open) => !open)}
              >
                Create target
              </Button>
            </div>
            {showCreate ? (
              <div className="space-y-2 rounded-lg border border-[var(--line)] bg-[var(--canvas)]/50 p-2.5">
                <label className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
                  Key
                  <input
                    className="h-8 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 text-[12px] text-[var(--ink)]"
                    value={targetKey || defaultKey}
                    onChange={(event) => setTargetKey(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] text-[var(--text-muted)]">
                  Type
                  <select
                    className="h-8 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 text-[12px] text-[var(--ink)]"
                    value={targetType}
                    onChange={(event) => setTargetType(event.target.value)}
                  >
                    <option value="MATERIAL">Material</option>
                    <option value="VISIBILITY">Visibility</option>
                    <option value="MESH">Mesh</option>
                  </select>
                </label>
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  disabled={busy || loading}
                  onClick={() => {
                    void onCreateTarget();
                  }}
                >
                  {busy ? 'Creating…' : 'Create target'}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </InspectorSection>

      <InspectorSection title="Material">
        <p className="text-[12px] text-[var(--ink)]">
          {materialSlotLabel(identity.target?.materialSlot)}
          <span className="text-[var(--text-muted)]"> · </span>
          {baselineMaterialLabel(selected)}
        </p>
      </InspectorSection>

      <InspectorSection
        title="Configuration"
        action={
          identity.target ? (
            <button
              type="button"
              className="text-[11px] font-medium text-[var(--brand)] hover:underline"
              onClick={() => setActiveWorkspace('mappings')}
            >
              Add binding
            </button>
          ) : undefined
        }
      >
        {identity.bindings.length === 0 ? (
          <p className="text-[12px] text-[var(--text-muted)]">
            {identity.target
              ? 'No bindings yet. Add a binding to make this configurable.'
              : 'Create a target before adding bindings.'}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {identity.bindings.map((binding) => {
              const choice = choiceLabels.get(binding.choiceKey);
              const summary = bindingSummary(binding, {
                choiceName: choice?.name,
                valueName: choice?.values.get(binding.valueKey),
              });
              return (
                <li
                  key={`${binding.choiceKey}-${binding.valueKey}-${binding.operation}`}
                  className="rounded-md border border-[var(--line)] px-2.5 py-2"
                >
                  <div className="text-[12px] font-medium text-[var(--ink)]">
                    {summary.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {summary.detail}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </InspectorSection>

      <InspectorSection title="Used by">
        <p className="text-[12px] text-[var(--ink)]">
          {usedBy}
          {revisionHint}
        </p>
      </InspectorSection>

      <details className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 px-2.5 py-2">
        <summary className="cursor-pointer select-none text-[11px] font-medium text-[var(--text-muted)]">
          Details
        </summary>
        <div className="mt-2 space-y-1 text-[11px]">
          <DetailRow label="nodePath" value={identity.nodePath} isCode />
          <DetailRow
            label="ObjectRevision"
            value={identity.objectAssetRevisionId ?? '—'}
            isCode
          />
          <DetailRow
            label="Runtime instance"
            value={identity.runtimeInstanceId ?? '—'}
            isCode
          />
          <DetailRow
            label="Composition slot"
            value={identity.compositionSlotKey ?? '—'}
            isCode
          />
          <DetailRow
            label="Target id"
            value={identity.target?.id ?? '—'}
            isCode
          />
        </div>
      </details>
    </div>
  );
}
