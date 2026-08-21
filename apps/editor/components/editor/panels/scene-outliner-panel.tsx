'use client';

import { useMemo, useState } from 'react';
import type * as THREE from 'three';
import { useEditorStore } from '@/lib/editor-store';
import {
  pathsReferToSameNode,
} from '@/lib/selection-identity';
import {
  buildSceneTree,
  type SceneTreeNode,
} from '@/lib/scene-tree';
import {
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TargetIcon,
} from '@/components/editor/icons';

function ChevronIcon({ open }: { open: boolean }) {
  return open ? (
    <ChevronDownIcon size="xs" className="text-white/50" />
  ) : (
    <ChevronRightIcon size="xs" className="text-white/50" />
  );
}

function CubeIcon({ selected }: { selected?: boolean; color?: string }) {
  return (
    <BoxIcon
      size="sm"
      className={`shrink-0 ${selected ? 'text-[#9D95FF]' : 'text-white/70'}`}
    />
  );
}

function nodeMatches(node: SceneTreeNode, filter: string): boolean {
  if (!filter) return true;
  if (node.label.toLowerCase().includes(filter)) return true;
  if (node.object.name.toLowerCase().includes(filter)) return true;
  return node.children.some((child) => nodeMatches(child, filter));
}

function TreeRows({
  nodes,
  selected,
  boundPaths,
  onSelect,
  filter,
  expandedMap,
  onToggleExpand,
  editingUuid,
  editDraft,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onChangeDraft,
}: {
  nodes: SceneTreeNode[];
  selected: THREE.Object3D | null;
  boundPaths: string[];
  onSelect: (obj: THREE.Object3D) => void;
  filter: string;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (uuid: string) => void;
  editingUuid: string | null;
  editDraft: string;
  onStartRename: (obj: THREE.Object3D) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onChangeDraft: (val: string) => void;
}) {
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);

  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        if (!nodeMatches(node, filter)) return null;
        const isSelected = selected?.uuid === node.object.uuid;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedMap[node.object.uuid] ?? false;
        const isEditing = editingUuid === node.object.uuid;
        const isTarget = boundPaths.some((p) =>
          pathsReferToSameNode(p, node.object.name)
        );

        return (
          <li key={node.object.uuid}>
            <div
              className={`group flex h-7 items-center justify-between gap-1.5 rounded-lg px-2 text-[12px] transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#232549] text-white shadow-xs font-semibold'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => {
                if (!isEditing) onSelect(node.object);
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(node.object.uuid);
                    }}
                    className="flex h-4 w-4 shrink-0 items-center justify-center text-white/40 hover:text-white"
                  >
                    <ChevronIcon open={isExpanded} />
                  </button>
                ) : (
                  <span className="w-4 shrink-0" />
                )}

                <CubeIcon selected={isSelected} />

                {isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={editDraft}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onChangeDraft(e.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onCommitRename();
                      if (e.key === 'Escape') onCancelRename();
                    }}
                    className="h-5 flex-1 rounded bg-[#101116] px-1.5 text-[11px] text-white border border-[#665CFF] outline-none"
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onStartRename(node.object);
                    }}
                    className="truncate text-[12px]"
                  >
                    {node.label}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {node.label.toLowerCase() === 'root' ? (
                  <span className="rounded bg-white/10 px-1 font-mono text-[9px] text-white/50">
                    GLB
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(node.object);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-opacity p-0.5"
                  title="Toggle visibility"
                >
                  {node.object.visible ? (
                    <EyeIcon size="xs" />
                  ) : (
                    <EyeOffIcon size="xs" />
                  )}
                </button>
              </div>
            </div>

            {hasChildren && isExpanded ? (
              <div className="ml-3.5 border-l border-white/10 pl-1 mt-0.5">
                <TreeRows
                  nodes={node.children}
                  selected={selected}
                  boundPaths={boundPaths}
                  onSelect={onSelect}
                  filter={filter}
                  expandedMap={expandedMap}
                  onToggleExpand={onToggleExpand}
                  editingUuid={editingUuid}
                  editDraft={editDraft}
                  onStartRename={onStartRename}
                  onCommitRename={onCommitRename}
                  onCancelRename={onCancelRename}
                  onChangeDraft={onChangeDraft}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function SceneOutlinerPanel() {
  const runtime = useEditorStore((state) => state.runtime);
  const selected = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const setSelectedTargetKey = useEditorStore((state) => state.setSelectedTargetKey);
  const renameObject = useEditorStore((state) => state.renameObject);
  const outlineRevision = useEditorStore((state) => state.outlineRevision);

  const [hierarchySearch, setHierarchySearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const tree = useMemo(() => {
    if (!runtime) return [];
    return buildSceneTree(runtime.productRoot);
  }, [runtime, outlineRevision]);

  const boundPaths = useMemo(() => {
    return visualDocument?.targets.map((t) => t.nodePath) ?? [];
  }, [visualDocument]);

  const targets = useMemo(() => {
    return (visualDocument?.targets ?? []).map((t) => ({
      key: t.key,
      nodePath: t.nodePath,
      type: t.targetType?.toUpperCase() === 'STRUCTURAL' ? 'STRUCTURAL' : 'SURFACE',
      unused: !(visualDocument?.bindings ?? []).some((b) => b.targetKey === t.key),
    }));
  }, [visualDocument]);

  const filteredTargets = useMemo(() => {
    if (!targetSearch.trim()) return targets;
    const q = targetSearch.toLowerCase();
    return targets.filter((t) => t.key.toLowerCase().includes(q));
  }, [targets, targetSearch]);

  const handleToggleExpand = (uuid: string) => {
    setExpandedMap((prev) => ({ ...prev, [uuid]: !prev[uuid] }));
  };

  const handleStartRename = (obj: THREE.Object3D) => {
    setEditingUuid(obj.uuid);
    setEditDraft(obj.name);
  };

  const handleCommitRename = () => {
    if (!editingUuid || !runtime) return;
    const trimmed = editDraft.trim();
    if (trimmed) {
      const obj = runtime.scene.getObjectByProperty('uuid', editingUuid);
      if (obj) renameObject(obj, trimmed);
    }
    setEditingUuid(null);
  };

  return (
    <div className="flex h-full flex-col divide-y divide-white/10 text-white select-none">
      {/* Top Half: Scene Hierarchy */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white/60">
              Scene Hierarchy
            </h4>
            <span className="text-[10px] text-white/30 cursor-help">ⓘ</span>
          </div>
          <span className="flex items-center gap-1 text-white/30">
            <PlusIcon size="xs" />
            <MoreHorizontalIcon size="xs" />
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search nodes"
            value={hierarchySearch}
            onChange={(e) => setHierarchySearch(e.target.value)}
            className="h-7 w-full rounded-xl border border-white/10 bg-[#16171E] pl-7 pr-2 text-[11px] text-white placeholder-white/40 outline-none focus:border-[#665CFF]/60"
          />
          <span className="absolute left-2 top-1.5 text-white/40">
            <SearchIcon size="xs" />
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pt-1">
          {tree.length > 0 ? (
            <TreeRows
              nodes={tree}
              selected={selected}
              boundPaths={boundPaths}
              onSelect={setSelected}
              filter={hierarchySearch.trim().toLowerCase()}
              expandedMap={expandedMap}
              onToggleExpand={handleToggleExpand}
              editingUuid={editingUuid}
              editDraft={editDraft}
              onStartRename={handleStartRename}
              onCommitRename={handleCommitRename}
              onCancelRename={() => setEditingUuid(null)}
              onChangeDraft={setEditDraft}
            />
          ) : (
            <p className="text-[11px] text-white/40 py-2 text-center">No scene loaded</p>
          )}
        </div>
      </div>

      {/* Bottom Half: Targets List */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">
              Targets
            </h4>
            <span className="flex h-4 items-center justify-center rounded-full bg-white/10 px-1 font-mono text-[9px] text-white/60">
              {targets.length}
            </span>
          </div>
          <span className="cursor-pointer text-white/30 hover:text-white">
            <PlusIcon size="sm" />
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search targets"
            value={targetSearch}
            onChange={(e) => setTargetSearch(e.target.value)}
            className="h-7 w-full rounded-xl border border-white/10 bg-[#16171E] pl-7 pr-2 text-[11px] text-white placeholder-white/40 outline-none focus:border-[#665CFF]/60"
          />
          <span className="absolute left-2 top-1.5 text-white/40">
            <SearchIcon size="xs" />
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto space-y-1 pt-1">
          {filteredTargets.length === 0 ? (
            <p className="py-2 text-center text-[11px] text-white/40">
              {visualDocument
                ? 'No ModelTargets on this product model yet.'
                : 'Load a product model to see targets.'}
            </p>
          ) : null}
          {filteredTargets.map((target) => {
            const isSelected = selectedTargetKey === target.key;
            const displayName = target.key
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());

            const isSurface = target.type === 'SURFACE';
            const iconColor = isSurface ? '#665CFF' : '#10B981';

            return (
              <div
                key={target.key}
                onClick={() => setSelectedTargetKey(target.key)}
                className={`group flex h-8 items-center justify-between gap-2 rounded-xl px-2.5 text-[12px] cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#232549] text-white font-medium border border-[#665CFF]'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <TargetIcon
                    size="xs"
                    style={{ color: iconColor }}
                    className="shrink-0"
                  />
                  <span className="truncate">{displayName}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wide ${
                      isSurface
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    }`}
                  >
                    {target.type}
                  </span>

                  {target.unused ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-red-400"
                      title="Unused target"
                    />
                  ) : (
                    <span className="text-white/40 group-hover:text-white text-[11px]">
                    <EyeIcon size="xs" className="text-white/40 group-hover:text-white" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-white/40 pt-1 border-t border-white/5">
          {targets.length === 0
            ? 'No targets'
            : `Showing ${filteredTargets.length} of ${targets.length}`}
        </div>
      </div>
    </div>
  );
}
