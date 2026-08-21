'use client';

import { useMemo, useState } from 'react';
import type * as THREE from 'three';
import { useEditorStore } from '@/lib/editor-store';
import {
  buildNodePath,
  buildSceneTree,
  findNodeByPath,
  nodeLabel,
  type SceneTreeNode,
} from '@/lib/scene-tree';
import { pathsReferToSameNode } from '@/lib/selection-identity';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from '@/components/editor/icons';
import {
  MobileAccordion,
  MobileDrillHeader,
  MobileField,
  MobileSheetAction,
  useExclusiveAccordion,
} from './mobile-accordion';

function nodeMatches(node: SceneTreeNode, filter: string): boolean {
  if (!filter) return true;
  if (node.label.toLowerCase().includes(filter)) return true;
  if (node.object.name.toLowerCase().includes(filter)) return true;
  return node.children.some((child) => nodeMatches(child, filter));
}

function HierarchyRows({
  nodes,
  selected,
  boundPaths,
  filter,
  expandedMap,
  onToggleExpand,
  onSelect,
  depth = 0,
}: {
  nodes: SceneTreeNode[];
  selected: THREE.Object3D | null;
  boundPaths: string[];
  filter: string;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (uuid: string) => void;
  onSelect: (object: THREE.Object3D) => void;
  depth?: number;
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        if (!nodeMatches(node, filter)) return null;
        const isSelected = selected?.uuid === node.object.uuid;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedMap[node.object.uuid] ?? depth < 1;
        const isTarget = boundPaths.some((path) =>
          pathsReferToSameNode(path, node.object.name)
        );

        return (
          <li key={node.object.uuid}>
            <button
              type="button"
              onClick={() => onSelect(node.object)}
              className={`flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-[12px] transition-colors ${
                isSelected
                  ? 'border border-[#665CFF] bg-[#232549] font-medium text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
              style={{ paddingLeft: 8 + depth * 12 }}
            >
              {hasChildren ? (
                <span
                  className="flex w-3.5 shrink-0 justify-center text-white/40"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleExpand(node.object.uuid);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDownIcon size="xs" />
                  ) : (
                    <ChevronRightIcon size="xs" />
                  )}
                </span>
              ) : (
                <span className="w-3.5 shrink-0" />
              )}
              <span
                className="truncate"
                style={{ color: isTarget ? '#9D95FF' : undefined }}
              >
                {node.label}
              </span>
              <MoreHorizontalIcon
                size="xs"
                className="ml-auto shrink-0 text-white/30"
              />
            </button>
            {hasChildren && isExpanded ? (
              <HierarchyRows
                nodes={node.children}
                selected={selected}
                boundPaths={boundPaths}
                filter={filter}
                expandedMap={expandedMap}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

type TargetFilter = 'all' | 'surface' | 'structural' | 'broken';

export function MobileSceneWorkspace({
  onRequestExpand,
}: {
  onRequestExpand?: () => void;
}) {
  const runtime = useEditorStore((state) => state.runtime);
  const selected = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const document = useEditorStore((state) => state.document);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const setSelectedTargetKey = useEditorStore(
    (state) => state.setSelectedTargetKey
  );
  const createModelTargetFromSelection = useEditorStore(
    (state) => state.createModelTargetFromSelection
  );
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
  const removeTarget = useEditorStore((state) => state.removeTarget);
  const updateTarget = useEditorStore((state) => state.updateTarget);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const outlineRevision = useEditorStore((state) => state.outlineRevision);

  const [hierarchySearch, setHierarchySearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [targetFilter, setTargetFilter] = useState<TargetFilter>('all');
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [menuTargetKey, setMenuTargetKey] = useState<string | null>(null);
  const { isOpen, toggle } = useExclusiveAccordion();

  const tree = useMemo(() => {
    if (!runtime) return [];
    return buildSceneTree(runtime.productRoot);
  }, [runtime, outlineRevision]);

  const boundPaths = useMemo(
    () => visualDocument?.targets.map((target) => target.nodePath) ?? [],
    [visualDocument]
  );

  const targets = useMemo(() => {
    const bindings = visualDocument?.bindings ?? [];
    return (visualDocument?.targets ?? []).map((target) => {
      const type =
        target.targetType?.toUpperCase() === 'STRUCTURAL'
          ? 'STRUCTURAL'
          : 'SURFACE';
      const used = bindings.some((binding) => binding.targetKey === target.key);
      const node =
        runtime && target.nodePath
          ? findNodeByPath(runtime.productRoot, target.nodePath)
          : null;
      const broken = Boolean(runtime && target.nodePath && !node);
      return {
        ...target,
        type,
        used,
        broken,
        displayName:
          target.name ||
          target.key
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
      };
    });
  }, [visualDocument, runtime]);

  const filteredTargets = useMemo(() => {
    return targets.filter((target) => {
      if (targetFilter === 'surface' && target.type !== 'SURFACE') return false;
      if (targetFilter === 'structural' && target.type !== 'STRUCTURAL')
        return false;
      if (targetFilter === 'broken' && !target.broken) return false;
      if (!targetSearch.trim()) return true;
      const query = targetSearch.toLowerCase();
      return (
        target.key.toLowerCase().includes(query) ||
        target.displayName.toLowerCase().includes(query) ||
        target.nodePath.toLowerCase().includes(query)
      );
    });
  }, [targets, targetFilter, targetSearch]);

  const currentTarget = useMemo(() => {
    if (!selectedTargetKey) return null;
    return targets.find((target) => target.key === selectedTargetKey) ?? null;
  }, [selectedTargetKey, targets]);

  const usedByBindings = useMemo(() => {
    if (!currentTarget || !visualDocument) return [];
    return visualDocument.bindings.filter(
      (binding) => binding.targetKey === currentTarget.key
    );
  }, [currentTarget, visualDocument]);

  const selectNode = (object: THREE.Object3D) => {
    setSelectedTargetKey(null);
    setSelected(object);
    runtime?.frameSelection();
    onRequestExpand?.();
  };

  const handleCreateTarget = async () => {
    if (!selected) {
      setStatusMessage('Select a scene node first');
      return;
    }
    await createModelTargetFromSelection();
    onRequestExpand?.();
  };

  if (currentTarget) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <MobileDrillHeader
          title={currentTarget.displayName}
          onBack={() => setSelectedTargetKey(null)}
        />
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <MobileField label="Key">
            <div className="flex h-8 items-center rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white">
              {currentTarget.key}
            </div>
          </MobileField>

          <MobileField label="Type">
            <select
              value={currentTarget.targetType ?? 'SURFACE'}
              onChange={(event) =>
                updateTarget(currentTarget.key, {
                  targetType: event.target.value,
                })
              }
              className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[12px] text-white outline-none"
            >
              <option value="SURFACE">Surface</option>
              <option value="STRUCTURAL">Structural</option>
            </select>
          </MobileField>

          <MobileField label="Node">
            <div className="flex h-8 items-center rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white/80">
              <span className="truncate">
                {currentTarget.nodePath || `/${currentTarget.key}`}
              </span>
            </div>
          </MobileField>

          <MobileField label="Material Slot">
            <input
              type="text"
              value={currentTarget.materialSlot ?? '0'}
              onChange={(event) =>
                updateTarget(currentTarget.key, {
                  materialSlot: event.target.value,
                })
              }
              className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white outline-none"
            />
          </MobileField>

          <div className="space-y-2 border-t border-white/10 pt-3">
            <span className="text-[11px] font-medium text-white/80">
              Used By ({usedByBindings.length})
            </span>
            {usedByBindings.length === 0 ? (
              <p className="text-[11px] text-white/40">
                Not bound to any choice value.
              </p>
            ) : (
              usedByBindings.map((binding) => (
                <button
                  key={`${binding.choiceKey}:${binding.valueKey}:${binding.operation}`}
                  type="button"
                  onClick={() => {
                    setAuthoringFocus({
                      choiceKey: binding.choiceKey,
                      valueKey: binding.valueKey,
                    });
                    setActiveWorkspace('product');
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2 text-left text-[11px]"
                >
                  <span className="truncate text-white">
                    {binding.choiceKey} / {binding.valueKey}
                  </span>
                  <span className="font-mono text-[9px] text-white/40">
                    {binding.operation}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!runtime) return;
                const object =
                  findNodeByPath(runtime.productRoot, currentTarget.nodePath) ||
                  runtime.scene.getObjectByName(currentTarget.key);
                if (object) {
                  setSelected(object);
                  runtime.frameSelection();
                }
              }}
              className="flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[12px] font-medium text-white"
            >
              Locate in Scene
            </button>
            <button
              type="button"
              onClick={() =>
                setStatusMessage(`Editing target ${currentTarget.key}`)
              }
              className="flex h-9 items-center justify-center rounded-xl bg-[#665CFF] text-[12px] font-medium text-white"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                void removeTarget(currentTarget.key).catch(() => {
                  /* statusMessage set in store */
                });
              }}
              className="flex h-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/20 text-[12px] font-medium text-red-300"
            >
              Delete Target
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <MobileAccordion
        title="Scene Hierarchy"
        open={isOpen('hierarchy')}
        onToggle={() => toggle('hierarchy')}
        actions={
          <>
            <MobileSheetAction
              onClick={() => {
                setToolMode('select');
                setStatusMessage('Pick a node in the viewport');
              }}
            >
              Pick
            </MobileSheetAction>
            <MobileSheetAction tone="accent" onClick={handleCreateTarget}>
              <PlusIcon size="xs" />
            </MobileSheetAction>
          </>
        }
      >
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search"
            value={hierarchySearch}
            onChange={(event) => setHierarchySearch(event.target.value)}
            className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[11px] text-white outline-none placeholder:text-white/40"
          />

          {tree.length === 0 ? (
            <p className="py-2 text-center text-[11px] text-white/40">
              No scene loaded
            </p>
          ) : (
            <HierarchyRows
              nodes={tree}
              selected={selected}
              boundPaths={boundPaths}
              filter={hierarchySearch.trim().toLowerCase()}
              expandedMap={expandedMap}
              onToggleExpand={(uuid) =>
                setExpandedMap((prev) => ({ ...prev, [uuid]: !prev[uuid] }))
              }
              onSelect={selectNode}
            />
          )}

          {selected ? (
            <div className="space-y-2 rounded-xl border border-white/10 bg-[#16171E] p-2.5">
              <p className="truncate text-[12px] font-semibold text-white">
                {nodeLabel(selected)}
              </p>
              <p className="truncate font-mono text-[9px] text-white/40">
                {runtime
                  ? buildNodePath(selected, runtime.productRoot)
                  : selected.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <MobileSheetAction tone="accent" onClick={handleCreateTarget}>
                  Create Target
                </MobileSheetAction>
                <MobileSheetAction
                  onClick={() => {
                    setActiveWorkspace('materials');
                    setStatusMessage('Open Assets to assign a material');
                  }}
                >
                  Material
                </MobileSheetAction>
                <MobileSheetAction onClick={() => toggleVisibility(selected)}>
                  {selected.visible ? 'Hide' : 'Show'}
                </MobileSheetAction>
              </div>
            </div>
          ) : null}
        </div>
      </MobileAccordion>

      <MobileAccordion
        title="Targets"
        open={isOpen('targets')}
        onToggle={() => toggle('targets')}
        count={targets.length}
        actions={
          <MobileSheetAction tone="accent" onClick={handleCreateTarget}>
            <span className="inline-flex items-center gap-1">
              <PlusIcon size="xs" />
              Target
            </span>
          </MobileSheetAction>
        }
      >
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search"
            value={targetSearch}
            onChange={(event) => setTargetSearch(event.target.value)}
            className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[11px] text-white outline-none placeholder:text-white/40"
          />

          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {(
              [
                ['all', 'All'],
                ['surface', 'Surface'],
                ['structural', 'Structural'],
                ['broken', 'Broken'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTargetFilter(key)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                  targetFilter === key
                    ? 'bg-[#665CFF] text-white'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredTargets.length === 0 ? (
            <p className="py-2 text-center text-[11px] text-white/40">
              {visualDocument
                ? 'No targets match this filter.'
                : 'Load a product model to see targets.'}
            </p>
          ) : (
            <div className="space-y-1">
              {filteredTargets.map((target) => (
                <div
                  key={target.key}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTargetKey(target.key);
                      onRequestExpand?.();
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="truncate text-[12px] font-medium text-white">
                      {target.displayName}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] font-bold ${
                        target.type === 'SURFACE'
                          ? 'border border-blue-800/40 bg-blue-950/60 text-blue-400'
                          : 'border border-emerald-800/40 bg-emerald-950/60 text-emerald-400'
                      }`}
                    >
                      {target.type}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] ${
                        target.broken
                          ? 'text-red-400'
                          : target.used
                            ? 'text-emerald-400'
                            : 'text-white/40'
                      }`}
                    >
                      {target.broken
                        ? 'Broken'
                        : target.used
                          ? 'Used'
                          : 'Unused'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMenuTargetKey((prev) =>
                        prev === target.key ? null : target.key
                      )
                    }
                    className="flex shrink-0 items-center px-1 text-white/40 hover:text-white"
                  >
                    <MoreHorizontalIcon size="sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {menuTargetKey ? (
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#16171E] p-2">
              <MobileSheetAction
                onClick={() => {
                  setSelectedTargetKey(menuTargetKey);
                  setMenuTargetKey(null);
                }}
              >
                Open
              </MobileSheetAction>
              <MobileSheetAction
                onClick={() => {
                  const target = targets.find((item) => item.key === menuTargetKey);
                  if (!runtime || !target) return;
                  const object = findNodeByPath(
                    runtime.productRoot,
                    target.nodePath
                  );
                  if (object) {
                    setSelected(object);
                    runtime.frameSelection();
                  }
                  setMenuTargetKey(null);
                }}
              >
                Locate
              </MobileSheetAction>
              <MobileSheetAction
                tone="danger"
                onClick={() => {
                  void removeTarget(menuTargetKey)
                    .then(() => setMenuTargetKey(null))
                    .catch(() => {
                      /* statusMessage set in store */
                    });
                }}
              >
                Delete
              </MobileSheetAction>
            </div>
          ) : null}
        </div>
      </MobileAccordion>

      <MobileAccordion
        title="Scene Info"
        open={isOpen('info')}
        onToggle={() => toggle('info')}
      >
        <div className="space-y-2 text-[11px] text-white/70">
          <div className="flex justify-between gap-3">
            <span className="text-white/40">Model</span>
            <span className="truncate text-right text-white">
              {document?.modelName || document?.productName || '—'}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/40">Meshes</span>
            <span className="font-mono text-white">
              {document?.meshCount ?? 0}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/40">Targets</span>
            <span className="font-mono text-white">{targets.length}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/40">Bindings</span>
            <span className="font-mono text-white">
              {visualDocument?.bindings.length ?? 0}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/40">Linked assets</span>
            <span className="font-mono text-white">
              {visualDocument?.linkedAssets.length ?? 0}
            </span>
          </div>
        </div>
      </MobileAccordion>
    </div>
  );
}
