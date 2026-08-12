'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  CREATE_MODEL_TARGET_MUTATION,
  CREATE_VISUAL_EFFECT_MUTATION,
  PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
  graphRequest,
  type GraphDetail,
  type GraphTarget,
} from '@repo/product-graph';
import {
  buildNodePath,
  semanticKeyFromName,
} from '@/lib/scene-tree';
import { useEditorStore } from '@/lib/editor-store';
import { FieldLabel } from './fields';

function effectLabel(valueJson: string, operation: string): string {
  if (operation === 'SET_VISIBILITY') {
    try {
      return JSON.parse(valueJson) ? 'Show' : 'Hide';
    } catch {
      return valueJson === 'false' ? 'Hide' : 'Show';
    }
  }
  try {
    const parsed = JSON.parse(valueJson);
    return typeof parsed === 'string' ? parsed : valueJson;
  } catch {
    return valueJson;
  }
}

export function ObjectConfigurationSection({
  selectedPath,
  selectedName,
}: {
  selectedPath: string;
  selectedName: string;
}) {
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const modelId = useEditorStore((state) => state.modelId);
  const setGraphDetail = useEditorStore((state) => state.setGraphDetail);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [targetKey, setTargetKey] = useState('');
  const [targetType, setTargetType] = useState<'VISIBILITY' | 'MATERIAL'>(
    'VISIBILITY'
  );
  const [valueId, setValueId] = useState('');
  const [action, setAction] = useState<'show' | 'hide' | 'material'>('show');
  const [materialValue, setMaterialValue] = useState('');

  const productModel =
    graphDetail?.models.find((model) => model.id === modelId) ??
    graphDetail?.models[0];

  const matchedTargets = useMemo(() => {
    if (!productModel) return [] as GraphTarget[];
    return productModel.targets.filter(
      (target) =>
        target.nodePath === selectedPath ||
        target.nodePath?.endsWith(`/${selectedName}`) ||
        target.key === semanticKeyFromName(selectedName)
    );
  }, [productModel, selectedPath, selectedName]);

  const primaryTarget = matchedTargets[0] ?? null;

  useEffect(() => {
    setTargetKey(semanticKeyFromName(selectedName) || 'part');
    setAdding(false);
  }, [selectedName, selectedPath]);

  const controlledBy = useMemo(() => {
    if (!graphDetail || !productModel) return [];
    const targetIds = new Set(
      (matchedTargets.length > 0
        ? matchedTargets
        : productModel.targets.filter((t) => t.nodePath === selectedPath)
      ).map((t) => t.id)
    );
    return graphDetail.visualEffects
      .filter((effect) => targetIds.has(effect.modelTargetId))
      .map((effect) => {
        const attribute = graphDetail.attributes.find((entry) =>
          entry.values.some((value) => value.id === effect.attributeValueId)
        );
        const value = attribute?.values.find(
          (entry) => entry.id === effect.attributeValueId
        );
        return {
          id: effect.id,
          attributeName: attribute?.name ?? 'Option',
          valueName: value?.name ?? 'Value',
          label: effectLabel(effect.valueJson, effect.operation),
        };
      });
  }, [graphDetail, productModel, matchedTargets, selectedPath]);

  const editable = graphDetail?.status === 'DRAFT';

  async function refreshGraph() {
    if (!graphAuth || !graphDetail) return;
    const data = await graphRequest<{
      productGraphVersionDetail: GraphDetail;
    }>(
      PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
      { id: graphDetail.id },
      graphAuth.token,
      graphAuth.apiUrl
    );
    setGraphDetail(data.productGraphVersionDetail);
  }

  if (!graphDetail || !productModel) {
    return (
      <p className="text-[12px] text-[var(--text-muted)]">
        Load a product graph to map configuration.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Configuration</FieldLabel>
        <p className="mt-1 text-[12px] text-[var(--ink)]">
          Target{' '}
          <span className="font-medium">
            {primaryTarget?.key ?? '— not mapped'}
          </span>
        </p>
        {primaryTarget?.nodePath ? (
          <p className="type-meta mt-0.5 truncate">{primaryTarget.nodePath}</p>
        ) : (
          <p className="type-meta mt-0.5 truncate">{selectedPath}</p>
        )}
      </div>

      <div>
        <FieldLabel>Controlled by</FieldLabel>
        {controlledBy.length === 0 ? (
          <p className="mt-1 text-[12px] text-[var(--text-muted)]">
            No behaviors yet
          </p>
        ) : (
          <ul className="mt-1 space-y-2">
            {controlledBy.map((entry) => (
              <li key={entry.id} className="text-[12px] text-[var(--ink)]">
                <span className="font-medium">{entry.attributeName}</span>
                <span className="text-[var(--text-muted)]">
                  {' '}
                  · {entry.valueName} → {entry.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editable ? (
        adding ? (
          <div className="space-y-2 border-t border-[var(--line)] pt-3">
            <FieldLabel>Add behavior</FieldLabel>
            {!primaryTarget ? (
              <>
                <input
                  value={targetKey}
                  onChange={(event) => setTargetKey(event.target.value)}
                  placeholder="backrest"
                  className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
                />
                <select
                  value={targetType}
                  onChange={(event) =>
                    setTargetType(
                      event.target.value as 'VISIBILITY' | 'MATERIAL'
                    )
                  }
                  className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
                >
                  <option value="VISIBILITY">Visibility target</option>
                  <option value="MATERIAL">Material target</option>
                </select>
              </>
            ) : null}
            <select
              value={valueId}
              onChange={(event) => setValueId(event.target.value)}
              className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
            >
              <option value="">Option value</option>
              {graphDetail.attributes.flatMap((attribute) =>
                attribute.values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {attribute.name}: {value.name}
                  </option>
                ))
              )}
            </select>
            <select
              value={action}
              onChange={(event) =>
                setAction(event.target.value as 'show' | 'hide' | 'material')
              }
              className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
            >
              <option value="show">Show</option>
              <option value="hide">Hide</option>
              <option value="material">Set material</option>
            </select>
            {action === 'material' ? (
              <input
                value={materialValue}
                onChange={(event) => setMaterialValue(event.target.value)}
                placeholder="Walnut Wood"
                className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
              />
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  pending ||
                  !valueId ||
                  (!primaryTarget && !targetKey) ||
                  (action === 'material' && !materialValue)
                }
                className="flex-1 rounded-md bg-[var(--ink)] px-2 py-1.5 text-[12px] font-medium text-white disabled:opacity-50"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      let modelTargetId = primaryTarget?.id;
                      if (!modelTargetId) {
                        await graphRequest(
                          CREATE_MODEL_TARGET_MUTATION,
                          {
                            input: {
                              productModelId: productModel.id,
                              key: targetKey,
                              targetType:
                                action === 'material'
                                  ? 'MATERIAL'
                                  : targetType,
                              nodePath: selectedPath,
                              ...(action === 'material' ||
                              targetType === 'MATERIAL'
                                ? {
                                    materialSlot:
                                      selectedName || targetKey,
                                  }
                                : {}),
                            },
                          },
                          graphAuth!.token,
                          graphAuth!.apiUrl
                        );
                        await refreshGraph();
                        const refreshed = useEditorStore.getState().graphDetail;
                        const model =
                          refreshed?.models.find((m) => m.id === modelId) ??
                          refreshed?.models[0];
                        modelTargetId = model?.targets.find(
                          (t) => t.nodePath === selectedPath || t.key === targetKey
                        )?.id;
                      }
                      if (!modelTargetId) {
                        throw new Error('Target was not created');
                      }
                      const valueJson =
                        action === 'material'
                          ? JSON.stringify(materialValue)
                          : JSON.stringify(action === 'show');
                      await graphRequest(
                        CREATE_VISUAL_EFFECT_MUTATION,
                        {
                          input: {
                            attributeValueId: valueId,
                            modelTargetId,
                            operation:
                              action === 'material'
                                ? 'SET_MATERIAL'
                                : 'SET_VISIBILITY',
                            valueJson,
                          },
                        },
                        graphAuth!.token,
                        graphAuth!.apiUrl
                      );
                      await refreshGraph();
                      setAdding(false);
                      setMaterialValue('');
                      setStatusMessage('Behavior added.');
                    } catch (error) {
                      setStatusMessage(
                        error instanceof Error
                          ? error.message
                          : 'Failed to add behavior.'
                      );
                    }
                  });
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-md px-2 py-1.5 text-[12px] text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-left text-[12px] font-medium text-[var(--ink)] hover:bg-black/[0.03]"
          >
            + Add behavior
          </button>
        )
      ) : (
        <p className="text-[12px] text-[var(--text-muted)]">
          Draft required to edit mappings.
        </p>
      )}
    </div>
  );
}
