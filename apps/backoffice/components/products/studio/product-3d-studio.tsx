'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createModelTargetAction,
  createProductModelAction,
  createVisualEffectAction,
} from '@/actions/graph';
import {
  ModelMappingViewer,
  ModelPartsTree,
} from '@/components/products/workspace/model-mapping-viewer';
import { Panel } from '@/components/ui';
import { getEditorStudioPath } from '@/lib/editor-embed';
import {
  humanizeEffectValue,
  objectProxyUrl,
  semanticKeyFromNodeName,
  targetLabel,
  type GraphDetail,
  type ObjectAssetOption,
  type SceneNodeInfo,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function Product3DStudio({
  projectId,
  productId,
  productName,
  detail,
  objectAssets,
  editable,
}: {
  projectId: string;
  productId: string;
  productName: string;
  detail: GraphDetail | null;
  objectAssets: ObjectAssetOption[];
  editable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<SceneNodeInfo | null>(null);
  const [targetKey, setTargetKey] = useState('');
  const [targetType, setTargetType] = useState<'VISIBILITY' | 'MATERIAL'>(
    'VISIBILITY'
  );
  const [mapValueId, setMapValueId] = useState('');
  const [mapTargetId, setMapTargetId] = useState('');
  const [mapAction, setMapAction] = useState<'show' | 'hide' | 'material'>(
    'hide'
  );
  const [materialValue, setMaterialValue] = useState('');

  const primaryModel = detail?.models[0] ?? null;
  const modelUrl = primaryModel ? objectProxyUrl(primaryModel.assetId) : null;
  const assetName =
    objectAssets.find((asset) => asset.id === primaryModel?.assetId)?.name ??
    primaryModel?.name ??
    'Primary model';

  const targets = primaryModel?.targets ?? [];
  const values =
    detail?.attributes.flatMap((attribute) =>
      (attribute.values ?? []).map((value) => ({
        id: value.id,
        label: `${attribute.name}: ${value.name}`,
      }))
    ) ?? [];

  const mappings = useMemo(() => {
    if (!detail) return [];
    const valueById = new Map(
      detail.attributes.flatMap((attribute) =>
        (attribute.values ?? []).map(
          (value) => [value.id, { attribute, value }] as const
        )
      )
    );
    const targetById = new Map(
      detail.models.flatMap((model) =>
        (model.targets ?? []).map((target) => [target.id, target] as const)
      )
    );

    const byAttribute = new Map<
      string,
      Array<{ choice: string; target: string; result: string }>
    >();

    for (const effect of detail.visualEffects) {
      const valueMeta = valueById.get(effect.attributeValueId);
      const target = targetById.get(effect.modelTargetId);
      if (!valueMeta || !target) continue;
      const list = byAttribute.get(valueMeta.attribute.name) ?? [];
      list.push({
        choice: valueMeta.value.name,
        target: targetLabel(target),
        result: humanizeEffectValue(effect.valueJson),
      });
      byAttribute.set(valueMeta.attribute.name, list);
    }

    return Array.from(byAttribute.entries()).map(([name, rows]) => ({
      name,
      rows,
    }));
  }, [detail]);

  const selectedLeafName = selectedPath?.split('/').pop() ?? '';
  const productHref = `/${projectId}/products/${productId}?tab=3d`;
  const stageHref = primaryModel
    ? getEditorStudioPath(projectId, productId, primaryModel.id)
    : null;

  return (
    <div className="flex h-dvh flex-col bg-[var(--bo-canvas,#f4f2ee)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bo-line)] bg-white px-4 py-3">
        <div className="min-w-0">
          <Link
            href={productHref}
            className="text-[12px] font-medium text-[var(--bo-muted)] hover:text-[var(--bo-ink)]"
          >
            ← {productName}
          </Link>
          <h1 className="mt-0.5 text-[16px] font-semibold tracking-tight">
            3D Studio
          </h1>
          <p className="text-[12px] text-[var(--bo-muted)]">
            Prepare the model and map how options change what shoppers see.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {stageHref ? (
            <Link
              href={stageHref}
              className="rounded-xl border border-[var(--bo-line)] bg-white px-4 py-2 text-sm font-medium"
            >
              Open Stage editor
            </Link>
          ) : null}
          <Link
            href={productHref}
            className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium"
          >
            Done
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          {!detail ? (
            <Panel>
              <p className="text-sm text-[var(--bo-muted)]">
                Start a product configuration before opening 3D Studio.
              </p>
            </Panel>
          ) : (
            <>
              <Panel className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                      Model
                    </h2>
                    <p className="mt-1 text-[15px] font-semibold">
                      {primaryModel ? assetName : 'No model attached'}
                    </p>
                    <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
                      {primaryModel
                        ? `${targets.length} targets · ${detail.visualEffects.length} mappings · Stage prep for materials and defaults`
                        : 'Attach a library object to begin.'}
                    </p>
                  </div>
                  {primaryModel ? (
                    <span className="rounded-full bg-[var(--bo-live-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--bo-live)]">
                      Ready
                    </span>
                  ) : null}
                </div>

                {!primaryModel && editable ? (
                  <form
                    className="grid gap-2 md:grid-cols-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = event.currentTarget;
                      const formData = new FormData(form);
                      startTransition(async () => {
                        const result = await createProductModelAction(
                          projectId,
                          productId,
                          formData
                        );
                        setMessage(
                          result.ok
                            ? 'Model attached.'
                            : result.error || 'Failed.'
                        );
                        if (result.ok) {
                          form.reset();
                          router.refresh();
                        }
                      });
                    }}
                  >
                    <input
                      type="hidden"
                      name="graphVersionId"
                      value={detail.id}
                    />
                    <input type="hidden" name="key" value="primary" />
                    <input
                      name="name"
                      required
                      placeholder="Model name"
                      defaultValue="Primary model"
                      className={inputClass}
                    />
                    <select name="assetId" required className={inputClass}>
                      {objectAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={pending || objectAssets.length === 0}
                      className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
                    >
                      Attach model
                    </button>
                  </form>
                ) : null}
              </Panel>

              {primaryModel ? (
                <>
                  <Panel className="space-y-4">
                    <div>
                      <h2 className="text-[15px] font-semibold tracking-tight">
                        Configuration
                      </h2>
                      <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
                        Product options stay on the product page. Here you map
                        how each choice affects the model.
                      </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                      <ModelMappingViewer
                        modelUrl={modelUrl}
                        selectedPath={selectedPath}
                        onSelectPath={(path) => {
                          setSelectedPath(path);
                          const leaf = path.split('/').pop() ?? path;
                          setTargetKey(semanticKeyFromNodeName(leaf));
                        }}
                        onHierarchy={setHierarchy}
                      />
                      <div className="space-y-3 rounded-[12px] border border-[var(--bo-line)] p-3">
                        <h3 className="text-[13px] font-semibold">
                          Model parts
                        </h3>
                        <div className="max-h-[320px] overflow-auto">
                          <ModelPartsTree
                            tree={hierarchy}
                            selectedPath={selectedPath}
                            onSelectPath={(path) => {
                              setSelectedPath(path);
                              const leaf = path.split('/').pop() ?? path;
                              setTargetKey(semanticKeyFromNodeName(leaf));
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedPath ? (
                      <p className="text-[13px] text-[var(--bo-muted)]">
                        Selected:{' '}
                        <span className="font-medium text-[var(--bo-ink)]">
                          {selectedLeafName}
                        </span>
                        <span>
                          {' '}
                          · create target{' '}
                          <span className="font-medium text-[var(--bo-ink)]">
                            {targetKey || '…'}
                          </span>
                        </span>
                      </p>
                    ) : null}

                    <div className="space-y-3">
                      <h3 className="text-[13px] font-semibold">
                        Current mappings
                      </h3>
                      {mappings.length === 0 ? (
                        <p className="text-sm text-[var(--bo-muted)]">
                          No visual mappings yet.
                        </p>
                      ) : (
                        mappings.map((group) => (
                          <div key={group.name} className="space-y-2">
                            <p className="text-[13px] font-medium">
                              {group.name}
                            </p>
                            <ul className="space-y-1.5 text-[13px] text-[var(--bo-muted)]">
                              {group.rows.map((row) => (
                                <li
                                  key={`${group.name}-${row.choice}-${row.target}-${row.result}`}
                                  className="flex flex-wrap gap-x-2"
                                >
                                  <span className="font-medium text-[var(--bo-ink)]">
                                    {row.choice}
                                  </span>
                                  <span>→</span>
                                  <span>
                                    {row.result} → {row.target}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  </Panel>

                  {editable ? (
                    <Panel className="space-y-5">
                      <div className="space-y-3">
                        <h3 className="text-[13px] font-semibold">
                          Semantic targets
                        </h3>
                        <p className="text-[12px] text-[var(--bo-muted)]">
                          Stable CubeCom identities. Mesh paths can change when
                          the GLB is replaced.
                        </p>
                        <div className="grid gap-2 md:grid-cols-4">
                          <input
                            value={targetKey}
                            onChange={(event) =>
                              setTargetKey(event.target.value)
                            }
                            placeholder="backrest"
                            className={inputClass}
                          />
                          <select
                            value={targetType}
                            onChange={(event) =>
                              setTargetType(
                                event.target.value as 'VISIBILITY' | 'MATERIAL'
                              )
                            }
                            className={inputClass}
                          >
                            <option value="VISIBILITY">Visibility</option>
                            <option value="MATERIAL">Material</option>
                          </select>
                          <input
                            value={selectedPath ?? ''}
                            readOnly
                            placeholder="Pick a mesh"
                            className={`${inputClass} text-[var(--bo-muted)]`}
                          />
                          <button
                            type="button"
                            disabled={pending || !targetKey || !selectedPath}
                            className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
                            onClick={() => {
                              const formData = new FormData();
                              formData.set('productModelId', primaryModel.id);
                              formData.set('key', targetKey);
                              formData.set('targetType', targetType);
                              formData.set('nodePath', selectedPath ?? '');
                              if (targetType === 'MATERIAL') {
                                formData.set(
                                  'materialSlot',
                                  selectedLeafName || targetKey
                                );
                              }
                              startTransition(async () => {
                                const result = await createModelTargetAction(
                                  projectId,
                                  productId,
                                  formData
                                );
                                setMessage(
                                  result.ok
                                    ? 'Target created.'
                                    : result.error || 'Failed.'
                                );
                                if (result.ok) router.refresh();
                              });
                            }}
                          >
                            Create target
                          </button>
                        </div>
                        {targets.length > 0 ? (
                          <ul className="space-y-1 text-[12px] text-[var(--bo-muted)]">
                            {targets.map((target) => (
                              <li key={target.id}>
                                <span className="font-medium text-[var(--bo-ink)]">
                                  {target.key}
                                </span>
                                {' · '}
                                {target.targetType}
                                {target.nodePath ? ` · ${target.nodePath}` : ''}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="space-y-3 border-t border-[var(--bo-line)] pt-4">
                        <h3 className="text-[13px] font-semibold">
                          Map option → behavior
                        </h3>
                        <div className="grid gap-2 md:grid-cols-5">
                          <select
                            value={mapValueId}
                            onChange={(event) =>
                              setMapValueId(event.target.value)
                            }
                            className={inputClass}
                          >
                            <option value="">Option value</option>
                            {values.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={mapAction}
                            onChange={(event) =>
                              setMapAction(
                                event.target.value as
                                  | 'show'
                                  | 'hide'
                                  | 'material'
                              )
                            }
                            className={inputClass}
                          >
                            <option value="show">Show</option>
                            <option value="hide">Hide</option>
                            <option value="material">Set material</option>
                          </select>
                          <select
                            value={mapTargetId}
                            onChange={(event) =>
                              setMapTargetId(event.target.value)
                            }
                            className={inputClass}
                          >
                            <option value="">Target</option>
                            {targets.map((target) => (
                              <option key={target.id} value={target.id}>
                                {targetLabel(target)}
                              </option>
                            ))}
                          </select>
                          {mapAction === 'material' ? (
                            <input
                              value={materialValue}
                              onChange={(event) =>
                                setMaterialValue(event.target.value)
                              }
                              placeholder="Walnut Wood"
                              className={inputClass}
                            />
                          ) : (
                            <div className="flex items-center text-[12px] text-[var(--bo-muted)]">
                              {mapAction === 'show' ? 'Visible' : 'Hidden'}
                            </div>
                          )}
                          <button
                            type="button"
                            disabled={
                              pending ||
                              !mapValueId ||
                              !mapTargetId ||
                              (mapAction === 'material' && !materialValue)
                            }
                            className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
                            onClick={() => {
                              const formData = new FormData();
                              formData.set('attributeValueId', mapValueId);
                              formData.set('modelTargetId', mapTargetId);
                              if (mapAction === 'material') {
                                formData.set('operation', 'SET_MATERIAL');
                                formData.set('value', materialValue);
                              } else {
                                formData.set('operation', 'SET_VISIBILITY');
                                formData.set(
                                  'value',
                                  mapAction === 'show' ? 'true' : 'false'
                                );
                              }
                              startTransition(async () => {
                                const result = await createVisualEffectAction(
                                  projectId,
                                  productId,
                                  formData
                                );
                                setMessage(
                                  result.ok
                                    ? 'Mapping added.'
                                    : result.error || 'Failed.'
                                );
                                if (result.ok) {
                                  setMaterialValue('');
                                  router.refresh();
                                }
                              });
                            }}
                          >
                            Add mapping
                          </button>
                        </div>
                      </div>
                      {message ? (
                        <p className="text-[12px] text-[var(--bo-muted)]">
                          {message}
                        </p>
                      ) : null}
                    </Panel>
                  ) : (
                    <Panel>
                      <p className="text-sm text-[var(--bo-muted)]">
                        Published configurations are read-only. Edit
                        configuration on the product to change mappings.
                      </p>
                    </Panel>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
