'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, StatusBadge } from '@repo/ui';
import {
  CREATE_VISUAL_SETUP_MUTATION,
  DELETE_VISUAL_SETUP_MUTATION,
  MATERIAL_ASSETS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import { isRevisionEditable } from '@/lib/authoring-focus';
import { useEditorStore } from '@/lib/editor-store';

type MaterialOption = { id: string; name: string };

type MaterialAssetRow = {
  id: string;
  name: string;
  currentRevisionId?: string | null;
};

export function ModelSetupPanel() {
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const projectId = useEditorStore((state) => state.projectId);
  const loading = useEditorStore((state) => state.loading);
  const reloadVisualDocument = useEditorStore(
    (state) => state.reloadVisualDocument
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const createDraftRevisionForEdit = useEditorStore(
    (state) => state.createDraftRevisionForEdit
  );

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [targetKey, setTargetKey] = useState('');
  const [materialRevisionId, setMaterialRevisionId] = useState('');
  const [busy, setBusy] = useState(false);

  const editable = isRevisionEditable(graphDetail?.status);
  const setups = visualDocument?.setups ?? [];
  const targets = visualDocument?.targets ?? [];

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
                ? { id: asset.currentRevisionId, name: asset.name }
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

  const targetIdByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const target of targets) {
      if (target.id) map.set(target.key, target.id);
    }
    return map;
  }, [targets]);

  if (!visualDocument) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-[12px] text-[var(--text-muted)]">
        Load a product revision to author model setup.
      </div>
    );
  }

  const onAddMaterialSetup = async () => {
    if (!editable) {
      setStatusMessage('Revision is read-only. Create a draft to edit.');
      return;
    }
    const modelTargetId = targetIdByKey.get(targetKey);
    if (!modelTargetId || !materialRevisionId || !graphAuth) {
      setStatusMessage('Pick a target and material revision.');
      return;
    }
    setBusy(true);
    try {
      await graphRequest(
        CREATE_VISUAL_SETUP_MUTATION,
        {
          input: {
            productModelId: visualDocument.productModelId,
            modelTargetId,
            operation: 'SET_MATERIAL',
            valueJson: JSON.stringify({
              materialAssetRevisionId: materialRevisionId,
            }),
          },
        },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await reloadVisualDocument();
      setStatusMessage('Model setup added — empty preview shows this default.');
      setTargetKey('');
      setMaterialRevisionId('');
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to add setup'
      );
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (setupId: string) => {
    if (!editable || !graphAuth) return;
    setBusy(true);
    try {
      await graphRequest(
        DELETE_VISUAL_SETUP_MUTATION,
        { id: setupId },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await reloadVisualDocument();
      setStatusMessage('Model setup removed.');
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to delete setup'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col select-none">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-2.5 text-[12px]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Model
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
              Always-on look for this ProductModel. Empty selection uses this
              default.
            </p>
          </div>
          <StatusBadge
            role={editable ? 'draft' : 'published'}
            label={editable ? 'EDITABLE' : 'READ ONLY'}
          />
        </div>

        {!editable ? (
          <button
            type="button"
            className="text-[11px] font-medium text-[var(--brand)] hover:underline"
            onClick={() => {
              void createDraftRevisionForEdit().catch(() => undefined);
            }}
          >
            Create new revision to edit
          </button>
        ) : null}

        <section className="space-y-1.5">
          <h3 className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
            Static setups ({setups.length})
          </h3>
          {setups.length === 0 ? (
            <p className="text-[11px] text-[var(--text-muted)]">
              No VisualSetup yet — product default is raw ObjectAsset baseline.
            </p>
          ) : (
            <ul className="space-y-1">
              {setups.map((setup, index) => (
                <li
                  key={setup.id ?? `${setup.operation}-${setup.targetKey}-${index}`}
                  className="rounded-md border border-[var(--line)] px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[var(--ink)]">
                      {setup.operation}
                    </span>
                    {editable && setup.id ? (
                      <button
                        type="button"
                        className="text-[10px] text-red-600 hover:underline"
                        disabled={busy || loading}
                        onClick={() => {
                          void onDelete(setup.id!);
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] text-[var(--text-muted)]">
                    → {setup.targetKey}
                    {setup.operation === 'SET_MATERIAL'
                      ? ` · ${setup.materialAssetRevisionId.slice(0, 10)}…`
                      : ''}
                    {setup.operation === 'REPLACE_COMPONENT'
                      ? ` · ${setup.linkedAssetKey}`
                      : ''}
                    {setup.operation === 'SET_VISIBILITY'
                      ? ` · ${setup.visible ? 'show' : 'hide'}`
                      : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {editable ? (
          <section className="space-y-1.5 rounded-lg border border-[var(--line)] p-2.5">
            <p className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
              Add SET_MATERIAL setup
            </p>
            <select
              className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 text-[12px]"
              value={targetKey}
              onChange={(event) => setTargetKey(event.target.value)}
            >
              <option value="">Target</option>
              {targets.map((target) => (
                <option key={target.key} value={target.key}>
                  {target.key}
                </option>
              ))}
            </select>
            <select
              className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 text-[12px]"
              value={materialRevisionId}
              onChange={(event) => setMaterialRevisionId(event.target.value)}
            >
              <option value="">Material revision</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              className="w-full"
              disabled={busy || loading}
              onClick={() => {
                void onAddMaterialSetup();
              }}
            >
              {busy ? 'Saving…' : 'Add to model setup'}
            </Button>
          </section>
        ) : null}
      </div>
    </div>
  );
}
