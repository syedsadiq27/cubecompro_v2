'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import {
  CREATE_MATERIAL_ASSET_MUTATION,
  CREATE_VISUAL_SETUP_MUTATION,
  MATERIAL_ASSETS_QUERY,
  MATERIAL_FACTORS,
  ME_QUERY,
  TEXTURE_ASSETS_QUERY,
  UPDATE_VISUAL_SETUP_MUTATION,
  coerceMaterialDocument,
  graphRequest,
  materialAssetRevisionDocumentUrl,
  materialDefinitionFromValues,
  materialFactorValuesFromDocument,
  type MaterialFactorKey,
} from '@repo/product-graph';
import {
  applyMaterialDocumentToObject,
  createStandardMaterialFromDocument,
} from '@/lib/apply-library-material';
import {
  baselineMaterialLabel,
  hierarchyBreadcrumb,
  materialSlotLabel,
  sceneObjectKind,
  sceneObjectKindLabel,
} from '@/lib/authoring-labels';
import { isRevisionEditable } from '@/lib/authoring-focus';
import { semanticKeyFromName } from '@/lib/scene-tree';
import { useEditorStore } from '@/lib/editor-store';

type MaterialOption = {
  assetId: string;
  name: string;
  revisionId: string;
};

type TextureOption = {
  name: string;
  revisionId: string;
};

type FactorValues = Record<MaterialFactorKey, string | number | boolean>;

function meshMaterialSlots(object: THREE.Object3D | null): Array<{
  index: number;
  name: string;
  color: string;
}> {
  if (!object) return [];
  const mesh = object as THREE.Mesh;
  if (!mesh.isMesh || !mesh.material) return [];
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];
  return materials.map((material, index) => {
    const std = material as THREE.MeshStandardMaterial;
    const color =
      std.color && typeof std.color.getHexString === 'function'
        ? `#${std.color.getHexString()}`
        : '#8A6040';
    return {
      index,
      name: material.name?.trim() || `Material ${index}`,
      color,
    };
  });
}

function defaultFactorValues(): FactorValues {
  return materialFactorValuesFromDocument(null);
}

function formatAxis(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

export function SceneMaterialInspector() {
  const selected = useEditorStore((state) => state.selected);
  const identity = useEditorStore((state) => state.selectionIdentity);
  const selectionRevision = useEditorStore((state) => state.selectionRevision);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const projectId = useEditorStore((state) => state.projectId);
  const runtime = useEditorStore((state) => state.runtime);
  const loading = useEditorStore((state) => state.loading);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const setActiveWorkspace = useEditorStore(
    (state) => state.setActiveWorkspace
  );
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const createModelTargetFromSelection = useEditorStore(
    (state) => state.createModelTargetFromSelection
  );
  const createDraftRevisionForEdit = useEditorStore(
    (state) => state.createDraftRevisionForEdit
  );
  const reloadVisualDocument = useEditorStore(
    (state) => state.reloadVisualDocument
  );
  const bumpSelection = useEditorStore((state) => state.bumpSelection);
  const updateSelectedTransform = useEditorStore(
    (state) => state.updateSelectedTransform
  );

  const renameObject = useEditorStore((state) => state.renameObject);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [textures, setTextures] = useState<TextureOption[]>([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState('');
  const [slotIndex, setSlotIndex] = useState(0);
  const [mode, setMode] = useState<'browse' | 'pick' | 'create'>('browse');
  const [materialName, setMaterialName] = useState('');
  const [factors, setFactors] = useState<FactorValues>(defaultFactorValues);
  const [baseTextureId, setBaseTextureId] = useState('');
  const [normalTextureId, setNormalTextureId] = useState('');
  const [busy, setBusy] = useState(false);
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [targetKeyDraft, setTargetKeyDraft] = useState('');

  const editable = isRevisionEditable(graphDetail?.status);
  const slots = useMemo(
    () => meshMaterialSlots(selected),
    [selected, selectionRevision]
  );
  const kind = selected ? sceneObjectKind(selected) : null;
  const activeSlot = slots[slotIndex] ?? null;
  const selectedMaterial = materials.find(
    (row) => row.revisionId === selectedRevisionId
  );

  const refreshMaterials = useCallback(async () => {
    if (!projectId || !graphAuth) {
      setMaterials([]);
      return;
    }
    const data = await graphRequest<{
      materialAssets: Array<{
        id: string;
        name: string;
        currentRevisionId?: string | null;
      }>;
    }>(
      MATERIAL_ASSETS_QUERY,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    );
    setMaterials(
      data.materialAssets
        .map((asset) =>
          asset.currentRevisionId
            ? {
                assetId: asset.id,
                name: asset.name,
                revisionId: asset.currentRevisionId,
              }
            : null
        )
        .filter((row): row is MaterialOption => row !== null)
    );
  }, [projectId, graphAuth]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await refreshMaterials();
        if (cancelled || !projectId || !graphAuth) return;
        const textureData = await graphRequest<{
          textureAssets: Array<{
            name: string;
            currentRevisionId?: string | null;
          }>;
        }>(
          TEXTURE_ASSETS_QUERY,
          { projectId },
          graphAuth.token,
          graphAuth.apiUrl
        );
        if (cancelled) return;
        setTextures(
          textureData.textureAssets
            .map((asset) =>
              asset.currentRevisionId
                ? { name: asset.name, revisionId: asset.currentRevisionId }
                : null
            )
            .filter((row): row is TextureOption => row !== null)
        );
      } catch {
        if (!cancelled) {
          setMaterials([]);
          setTextures([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth, refreshMaterials]);

  useEffect(() => {
    setSlotIndex(0);
    setMode('browse');
    setShowTargetEdit(false);
    setTargetKeyDraft(identity?.target?.key ?? '');
  }, [selected?.uuid, identity?.target?.key]);

  const ensureEditable = async () => {
    if (editable) return true;
    setStatusMessage('Revision is read-only. Creating a draft…');
    await createDraftRevisionForEdit();
    return true;
  };

  const applyDocumentPreview = (name: string) => {
    if (!selected) return;
    const document = {
      ...materialDefinitionFromValues(factors),
      ...(baseTextureId ? { baseColorTextureId: baseTextureId } : {}),
      ...(normalTextureId ? { normalTextureId: normalTextureId } : {}),
    };
    applyMaterialDocumentToObject(selected, document, name || 'Preview');
    runtime?.render();
    bumpSelection();
  };

  const applyRevisionToSelection = async (revisionId: string) => {
    if (!selected || !graphAuth || !revisionId) return;
    const option = materials.find((row) => row.revisionId === revisionId);
    const response = await fetch(
      materialAssetRevisionDocumentUrl(graphAuth.apiUrl, revisionId),
      {
        headers: { Authorization: `Bearer ${graphAuth.token}` },
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to load material ${revisionId}`);
    }
    const document = coerceMaterialDocument(await response.json());
    const mesh = selected as THREE.Mesh;
    if (mesh.isMesh) {
      const nextMaterial = createStandardMaterialFromDocument(
        document,
        option?.name ?? 'Library material'
      );
      nextMaterial.userData.materialAssetRevisionId = revisionId;
      const previous = mesh.material;
      if (Array.isArray(previous)) {
        const next = [...previous];
        const old = next[slotIndex];
        next[slotIndex] = nextMaterial;
        mesh.material = next;
        old?.dispose();
      } else {
        mesh.material = nextMaterial;
        previous?.dispose();
      }
    } else {
      applyMaterialDocumentToObject(
        selected,
        document,
        option?.name ?? 'Library material'
      );
    }
    runtime?.render();
    bumpSelection();
  };

  const onSaveMaterial = async () => {
    if (!graphAuth || !projectId) {
      setStatusMessage('Sign in from backoffice to save materials.');
      return;
    }
    const name = materialName.trim();
    if (!name) {
      setStatusMessage('Material name is required.');
      return;
    }
    setBusy(true);
    try {
      await ensureEditable();
      const me = await graphRequest<{
        me: { organizationId?: string | null };
      }>(ME_QUERY, {}, graphAuth.token, graphAuth.apiUrl);
      const organizationId = me.me.organizationId;
      if (!organizationId) {
        throw new Error('Organization missing from session');
      }
      const documentJson = JSON.stringify({
        ...materialDefinitionFromValues(factors),
        ...(baseTextureId ? { baseColorTextureId: baseTextureId } : {}),
        ...(normalTextureId ? { normalTextureId: normalTextureId } : {}),
      });
      const created = await graphRequest<{
        createMaterialAsset: {
          id: string;
          name: string;
          currentRevisionId?: string | null;
        };
      }>(
        CREATE_MATERIAL_ASSET_MUTATION,
        {
          input: {
            organizationId,
            projectId,
            name,
            documentJson,
          },
        },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await refreshMaterials();
      const revisionId = created.createMaterialAsset.currentRevisionId;
      if (revisionId) {
        setSelectedRevisionId(revisionId);
        await onAssign(revisionId);
      }
      setMode('browse');
      setStatusMessage(`Saved & assigned “${name}”.`);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to save material'
      );
    } finally {
      setBusy(false);
    }
  };

  const onAssign = async (revisionId = selectedRevisionId) => {
    if (!selected || !identity || !visualDocument || !graphAuth) {
      setStatusMessage('Select a scene object and material first.');
      return;
    }
    if (!revisionId) {
      setStatusMessage('Choose a material revision to assign.');
      return;
    }
    setBusy(true);
    try {
      await ensureEditable();
      let target = useEditorStore.getState().selectionIdentity?.target;
      if (!target) {
        await createModelTargetFromSelection({
          key: semanticKeyFromName(identity.objectName) || 'target',
          targetType: 'MATERIAL',
          materialSlot: String(slotIndex),
        });
        target = useEditorStore.getState().selectionIdentity?.target;
      }
      if (!target?.id) {
        throw new Error('Could not resolve a ModelTarget for this node');
      }

      const latestDocument = useEditorStore.getState().visualDocument;
      if (!latestDocument) {
        throw new Error('Visual document missing after target create');
      }

      const existingSetup = (latestDocument.setups ?? []).find(
        (setup) =>
          setup.targetKey === target.key && setup.operation === 'SET_MATERIAL'
      );

      if (existingSetup?.id) {
        await graphRequest(
          UPDATE_VISUAL_SETUP_MUTATION,
          {
            input: {
              id: existingSetup.id,
              valueJson: JSON.stringify({
                materialAssetRevisionId: revisionId,
              }),
            },
          },
          graphAuth.token,
          graphAuth.apiUrl
        );
      } else {
        await graphRequest(
          CREATE_VISUAL_SETUP_MUTATION,
          {
            input: {
              productModelId: latestDocument.productModelId,
              modelTargetId: target.id,
              operation: 'SET_MATERIAL',
              valueJson: JSON.stringify({
                materialAssetRevisionId: revisionId,
              }),
            },
          },
          graphAuth.token,
          graphAuth.apiUrl
        );
      }

      await applyRevisionToSelection(revisionId);
      await reloadVisualDocument();
      setMode('browse');
      setStatusMessage(
        `Assigned ${selectedMaterial?.name ?? 'material'} to ${identity.objectName}.`
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to assign material'
      );
    } finally {
      setBusy(false);
    }
  };

  const onMakeConfigurable = async () => {
    if (!identity) return;
    setBusy(true);
    try {
      await ensureEditable();
      if (!useEditorStore.getState().selectionIdentity?.target) {
        await createModelTargetFromSelection({
          key: semanticKeyFromName(identity.objectName) || 'target',
          targetType: 'MATERIAL',
          materialSlot: String(slotIndex),
        });
      }
      const firstChoice = graphDetail?.choices?.[0];
      const firstValue = firstChoice?.values?.[0];
      if (firstChoice && firstValue) {
        setAuthoringFocus({
          choiceKey: firstChoice.key,
          valueKey: firstValue.key,
        });
      }
      setActiveWorkspace('product');
      setStatusMessage(
        'Config mode — bind this target to a choice value.'
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Could not open configuration'
      );
    } finally {
      setBusy(false);
    }
  };

  if (!selected || !identity) {
    return (
      <div className="space-y-2 text-[12px] text-white/50">
        <p>Select an object in the viewport or scene tree.</p>
        <p className="text-[11px] text-white/40">
          Material, target, and transform controls appear for the selection.
        </p>
      </div>
    );
  }

  const displayMaterialName =
    selectedMaterial?.name ||
    activeSlot?.name ||
    baselineMaterialLabel(selected);
  const displayColor = activeSlot?.color ?? '#8A6040';

  return (
    <div className="space-y-5 text-white select-none">
      {/* Object Header */}
      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#22232B] border border-white/10 text-white/70">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            {editingName ? (
              <input
                autoFocus
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (selected && nameDraft.trim()) {
                      renameObject(selected, nameDraft.trim());
                    }
                    setEditingName(false);
                  } else if (e.key === 'Escape') {
                    setEditingName(false);
                  }
                }}
                onBlur={() => {
                  if (selected && nameDraft.trim()) {
                    renameObject(selected, nameDraft.trim());
                  }
                  setEditingName(false);
                }}
                className="h-7 min-w-0 flex-1 rounded-lg border border-[#665CFF] bg-[#121318] px-2 text-[13px] font-semibold text-white outline-none"
              />
            ) : (
              <div className="group flex min-w-0 items-center gap-1.5">
                <h3
                  className="truncate text-[14px] font-semibold text-white cursor-pointer hover:text-[#9D95FF] transition-colors"
                  onClick={() => {
                    setNameDraft(identity.objectName);
                    setEditingName(true);
                  }}
                  title="Click to rename"
                >
                  {identity.objectName}
                </h3>
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-white/40 hover:text-white transition-opacity"
                  onClick={() => {
                    setNameDraft(identity.objectName);
                    setEditingName(true);
                  }}
                  title="Rename"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="mt-1 pl-8 text-[11px] text-white/50">
            {kind ? sceneObjectKindLabel(kind) : 'Mesh'}
            {hierarchyBreadcrumb(identity.nodePath)
              ? ` · ${hierarchyBreadcrumb(identity.nodePath)}`
              : ''}
          </p>
        </div>
        <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-[9px] font-medium text-white/70 shrink-0">
          {identity.target ? 'TARGET' : 'MESH'}
        </span>
      </div>

      {/* TARGET Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              Target
            </h4>
            <span className="text-[10px] text-white/40 cursor-help" title="Model target binding identity">
              ?
            </span>
          </div>
        </div>

        {identity.target && !showTargetEdit ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#181920] px-3 py-2">
            <div className="min-w-0">
              <p className="font-mono text-[12px] font-medium text-white">
                {identity.target.key}
              </p>
              <p className="text-[10px] text-white/40">
                {materialSlotLabel(identity.target.materialSlot)}
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
              onClick={() => {
                setTargetKeyDraft(identity.target?.key ?? '');
                setShowTargetEdit(true);
              }}
            >
              Edit target
            </button>
          </div>
        ) : (
          <div className="space-y-2 rounded-xl border border-white/10 bg-[#181920] p-2.5">
            <label className="flex flex-col gap-1 text-[10px] text-white/50">
              Target key
              <input
                className="h-8 rounded-lg border border-white/10 bg-[#121318] px-2.5 font-mono text-[12px] text-white outline-none focus:border-[#665CFF]"
                value={
                  targetKeyDraft ||
                  semanticKeyFromName(identity.objectName) ||
                  'target'
                }
                onChange={(event) => setTargetKeyDraft(event.target.value)}
              />
            </label>
            <div className="flex gap-2">
              {showTargetEdit ? (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-white/15 bg-white/5 py-1 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() => setShowTargetEdit(false)}
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#665CFF] py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#574CEE] disabled:opacity-50"
                disabled={busy || loading}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      await ensureEditable();
                      await createModelTargetFromSelection({
                        key:
                          targetKeyDraft.trim() ||
                          semanticKeyFromName(identity.objectName) ||
                          'target',
                        targetType: 'MATERIAL',
                        materialSlot: String(slotIndex),
                      });
                      setShowTargetEdit(false);
                    } catch (error) {
                      setStatusMessage(
                        error instanceof Error
                          ? error.message
                          : 'Failed to create target'
                      );
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                {identity.target ? 'Update target' : 'Create target'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MATERIAL Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Material
          </h4>
        </div>

        {slots.length === 0 ? (
          <p className="text-[12px] text-white/40">
            Select a mesh to assign materials.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/60">
                Slot {slotIndex}
              </span>
              {slots.length > 1 ? (
                <div className="flex flex-wrap gap-1">
                  {slots.map((slot) => (
                    <button
                      key={slot.index}
                      type="button"
                      onClick={() => setSlotIndex(slot.index)}
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        slotIndex === slot.index
                          ? 'bg-[#665CFF] text-white'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {slot.index}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Selected Material Card with gradient sphere */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#181920] px-3 py-2.5">
              <div
                className="relative h-9 w-9 shrink-0 rounded-full border border-white/15 shadow-md"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${displayColor} 50%, #151518 100%)`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-white">
                  {displayMaterialName}
                </p>
                <p className="text-[10px] text-white/40">
                  Material Asset
                </p>
              </div>
              <span className="text-[10px] text-white/40">▾</span>
            </div>

            {mode === 'browse' ? (
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white/10"
                  onClick={() => setMode('pick')}
                >
                  Change material
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white/10"
                  onClick={() => {
                    setMode('create');
                    setMaterialName(identity.objectName || 'New material');
                    setFactors(defaultFactorValues());
                    setBaseTextureId('');
                    setNormalTextureId('');
                  }}
                >
                  + Create new
                </button>
              </div>
            ) : null}

            {/* Visual Library Material Picker */}
            {mode === 'pick' ? (
              <div className="space-y-3 rounded-xl border border-white/10 bg-[#181920] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-white">
                    Select Material
                  </span>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#9D95FF] hover:underline"
                    onClick={() => {
                      setMode('create');
                      setMaterialName(identity.objectName || 'New material');
                      setFactors(defaultFactorValues());
                    }}
                  >
                    + Create New
                  </button>
                </div>

                {materials.length === 0 ? (
                  <div className="space-y-2 py-2 text-center text-[11px] text-white/50">
                    <p>No materials in library yet.</p>
                    <button
                      type="button"
                      className="rounded-lg bg-[#665CFF] px-3 py-1 text-[11px] font-medium text-white hover:bg-[#574CEE]"
                      onClick={() => setMode('create')}
                    >
                      Create First Material
                    </button>
                  </div>
                ) : (
                  <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                    {materials.map((material) => {
                      const isChosen = material.revisionId === selectedRevisionId;
                      return (
                        <div
                          key={material.revisionId}
                          onClick={() => {
                            setSelectedRevisionId(material.revisionId);
                            void applyRevisionToSelection(material.revisionId).catch(() => undefined);
                          }}
                          className={`flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-colors ${
                            isChosen
                              ? 'bg-[#242646] border border-[#665CFF]/70 text-white'
                              : 'bg-[#121318] border border-white/10 text-white/80 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="h-6 w-6 shrink-0 rounded-full border border-white/15 shadow-sm"
                              style={{
                                background: `radial-gradient(circle at 35% 35%, #ffffff 0%, #8A6040 60%, #151518 100%)`,
                              }}
                            />
                            <span className="truncate text-[12px] font-medium">
                              {material.name}
                            </span>
                          </div>
                          {isChosen ? (
                            <span className="shrink-0 font-mono text-[9px] font-bold text-[#9D95FF]">
                              SELECTED
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2 pt-1 border-t border-white/10">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={() => setMode('browse')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-[#665CFF] py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#574CEE] disabled:opacity-50"
                    disabled={!selectedRevisionId || busy || loading}
                    onClick={() => {
                      void onAssign();
                    }}
                  >
                    Assign to target
                  </button>
                </div>
              </div>
            ) : null}

            {/* PBR Material Creator with Live Sliders & Presets */}
            {mode === 'create' ? (
              <div className="space-y-3 rounded-xl border border-white/10 bg-[#181920] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-white">
                    Create PBR Material
                  </p>
                  <span className="text-[10px] font-mono text-white/40">
                    Live Previewing
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-white/50">
                    Presets
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { name: 'Walnut Wood', color: '#6A4B35', roughness: 0.65, metallic: 0.0 },
                      { name: 'Matte Black', color: '#1E1F24', roughness: 0.7, metallic: 0.1 },
                      { name: 'Brushed Brass', color: '#D4AF37', roughness: 0.35, metallic: 0.9 },
                      { name: 'Chrome Steel', color: '#E8EAED', roughness: 0.15, metallic: 0.95 },
                      { name: 'White Oak', color: '#D2B48C', roughness: 0.6, metallic: 0.0 },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setMaterialName(preset.name);
                          setFactors((prev) => {
                            const next = {
                              ...prev,
                              baseColor: preset.color,
                              roughness: preset.roughness,
                              metallic: preset.metallic,
                            };
                            applyDocumentPreview(preset.name);
                            return next;
                          });
                        }}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Name */}
                <label className="flex flex-col gap-1 text-[10px] text-white/50">
                  Material name
                  <input
                    className="h-8 rounded-lg border border-white/10 bg-[#121318] px-2.5 text-[12px] text-white outline-none focus:border-[#665CFF]"
                    value={materialName}
                    onChange={(event) => setMaterialName(event.target.value)}
                    placeholder="American Walnut PBR"
                  />
                </label>

                {/* Base Color Picker */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/50">Base Color</span>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#121318] p-1.5">
                    <input
                      type="color"
                      className="h-6 w-8 rounded border-0 bg-transparent cursor-pointer"
                      value={String(factors.baseColor ?? '#8A6040')}
                      onChange={(event) => {
                        const val = event.target.value;
                        setFactors((prev) => ({ ...prev, baseColor: val }));
                        applyDocumentPreview(materialName || 'Preview');
                      }}
                    />
                    <input
                      type="text"
                      className="min-w-0 flex-1 font-mono text-[11px] text-white bg-transparent outline-none uppercase"
                      value={String(factors.baseColor ?? '#8A6040')}
                      onChange={(event) => {
                        const val = event.target.value;
                        setFactors((prev) => ({ ...prev, baseColor: val }));
                        applyDocumentPreview(materialName || 'Preview');
                      }}
                    />
                  </div>
                </div>

                {/* Roughness Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>Roughness</span>
                    <span className="font-mono text-white/80">
                      {Number(factors.roughness ?? 0.5).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={Number(factors.roughness ?? 0.5)}
                    onChange={(event) => {
                      const val = Number(event.target.value);
                      setFactors((prev) => ({ ...prev, roughness: val }));
                      applyDocumentPreview(materialName || 'Preview');
                    }}
                    className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Metallic Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>Metalness</span>
                    <span className="font-mono text-white/80">
                      {Number(factors.metallic ?? 0.0).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={Number(factors.metallic ?? 0.0)}
                    onChange={(event) => {
                      const val = Number(event.target.value);
                      setFactors((prev) => ({ ...prev, metallic: val }));
                      applyDocumentPreview(materialName || 'Preview');
                    }}
                    className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Texture Maps */}
                <div className="space-y-2 pt-1">
                  <label className="flex flex-col gap-1 text-[10px] text-white/50">
                    Base texture map
                    <select
                      className="h-8 rounded-lg border border-white/10 bg-[#121318] px-2 text-[12px] text-white outline-none"
                      value={baseTextureId}
                      onChange={(event) => {
                        setBaseTextureId(event.target.value);
                        applyDocumentPreview(materialName || 'Preview');
                      }}
                    >
                      <option value="">None (Solid color)</option>
                      {textures.map((texture) => (
                        <option
                          key={texture.revisionId}
                          value={texture.revisionId}
                        >
                          {texture.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-white/50">
                    Normal texture map
                    <select
                      className="h-8 rounded-lg border border-white/10 bg-[#121318] px-2 text-[12px] text-white outline-none"
                      value={normalTextureId}
                      onChange={(event) => {
                        setNormalTextureId(event.target.value);
                        applyDocumentPreview(materialName || 'Preview');
                      }}
                    >
                      <option value="">None</option>
                      {textures.map((texture) => (
                        <option
                          key={texture.revisionId}
                          value={texture.revisionId}
                        >
                          {texture.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={() => setMode('browse')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-[#665CFF] py-1.5 text-[11px] font-medium text-white hover:bg-[#574CEE] disabled:opacity-50 shadow-xs"
                    disabled={busy || loading}
                    onClick={() => {
                      void onSaveMaterial();
                    }}
                  >
                    {busy ? 'Saving…' : 'Save & Assign Material'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* CONFIGURATION Section */}
      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Configuration
        </h4>

        {identity.bindings.length === 0 ? (
          <div className="space-y-2.5">
            <p className="text-[12px] text-white/50">
              No configuration overrides
            </p>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#665CFF]/40 bg-[#242145] py-2 text-[12px] font-medium text-[#9D95FF] transition-colors hover:bg-[#2E2A59] disabled:opacity-50 shadow-xs"
              disabled={busy || loading}
              onClick={() => {
                void onMakeConfigurable();
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
              <span>Make configurable</span>
            </button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {identity.bindings.map((binding) => (
              <li
                key={`${binding.choiceKey}-${binding.valueKey}-${binding.operation}`}
                className="rounded-xl border border-white/10 bg-[#181920] px-3 py-2 text-[12px]"
              >
                <span className="font-medium text-white">
                  {binding.choiceKey} → {binding.valueKey}
                </span>
                <span className="mt-0.5 block text-[10px] text-white/40">
                  {binding.operation}
                </span>
              </li>
            ))}
            <button
              type="button"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/10"
              onClick={() => {
                void onMakeConfigurable();
              }}
            >
              Edit in Config
            </button>
          </ul>
        )}
      </div>

      {/* TRANSFORM Section */}
      <div className="space-y-2.5">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Transform
        </h4>
        <div className="space-y-2">
          {(
            [
              ['Position', 'position'],
              ['Rotation', 'rotation'],
              ['Scale', 'scale'],
            ] as const
          ).map(([label, key]) => {
            const vector =
              key === 'position'
                ? selected.position
                : key === 'rotation'
                  ? selected.rotation
                  : selected.scale;
            return (
              <div key={key} className="space-y-1">
                <p className="text-[11px] font-medium text-white/50">
                  {label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['x', 'y', 'z'] as const).map((axis, index) => (
                    <div
                      key={axis}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#181920] px-2 py-1"
                    >
                      <span className="font-mono text-[10px] font-bold text-indigo-400/80">
                        {axis}
                      </span>
                      <input
                        type="number"
                        step={0.01}
                        className="min-w-0 flex-1 bg-transparent text-[11px] font-mono text-white outline-none"
                        value={formatAxis(
                          key === 'rotation'
                            ? THREE.MathUtils.radToDeg(vector[axis])
                            : vector[axis]
                        )}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          if (!Number.isFinite(next)) return;
                          const values: [number, number, number] = [
                            key === 'rotation'
                              ? THREE.MathUtils.radToDeg(selected.rotation.x)
                              : selected[key].x,
                            key === 'rotation'
                              ? THREE.MathUtils.radToDeg(selected.rotation.y)
                              : selected[key].y,
                            key === 'rotation'
                              ? THREE.MathUtils.radToDeg(selected.rotation.z)
                              : selected[key].z,
                          ];
                          values[index] = next;
                          if (key === 'rotation') {
                            updateSelectedTransform({
                              rotation: [
                                THREE.MathUtils.degToRad(values[0]),
                                THREE.MathUtils.degToRad(values[1]),
                                THREE.MathUtils.degToRad(values[2]),
                              ],
                            });
                          } else if (key === 'position') {
                            updateSelectedTransform({ position: values });
                          } else {
                            updateSelectedTransform({ scale: values });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILS Section */}
      <details className="rounded-xl border border-white/10 bg-[#181920] px-3 py-2">
        <summary className="cursor-pointer select-none text-[11px] font-mono font-bold uppercase tracking-wider text-white/50">
          Details
        </summary>
        <div className="mt-2.5 space-y-1 font-mono text-[10px] text-white/50">
          <p>nodePath · {identity.nodePath}</p>
          <p>
            ObjectRevision · {identity.objectAssetRevisionId?.slice(0, 12) ?? '—'}
          </p>
          <p>Target · {identity.target?.id?.slice(0, 12) ?? '—'}</p>
        </div>
      </details>
    </div>
  );
}
