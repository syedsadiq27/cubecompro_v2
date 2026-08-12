'use client';

import { useMemo, useState } from 'react';
import type * as THREE from 'three';
import {
  buildSceneTree,
  collectSceneMaterials,
  nodeLabel,
  type SceneTreeNode,
} from '@/lib/scene-tree';
import { useEditorStore } from '@/lib/editor-store';

function TreeRows({
  nodes,
  selected,
  onSelect,
}: {
  nodes: SceneTreeNode[];
  selected: THREE.Object3D | null;
  onSelect: (node: THREE.Object3D) => void;
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const active = selected === node.object;
        return (
          <li key={node.object.uuid}>
            <button
              type="button"
              onClick={() => onSelect(node.object)}
              style={{ paddingLeft: `${8 + node.depth * 12}px` }}
              className={`flex w-full items-center gap-1 truncate rounded-md py-1.5 pr-2 text-left text-[12px] ${
                active
                  ? 'bg-black/[0.05] font-medium text-[var(--ink)]'
                  : 'text-[var(--ink)]/80 hover:bg-black/[0.03]'
              }`}
            >
              {node.children.length > 0 ? (
                <span className="w-3 shrink-0 text-[10px] text-[var(--text-muted)]">
                  ▾
                </span>
              ) : (
                <span className="w-3 shrink-0" />
              )}
              <span className="truncate">{node.label}</span>
            </button>
            {node.children.length > 0 ? (
              <TreeRows
                nodes={node.children}
                selected={selected}
                onSelect={onSelect}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function ScenePanel() {
  const document = useEditorStore((state) => state.document);
  const loading = useEditorStore((state) => state.loading);
  const runtime = useEditorStore((state) => state.runtime);
  const selected = useEditorStore((state) => state.selected);
  const outlineRevision = useEditorStore((state) => state.outlineRevision);
  const setSelected = useEditorStore((state) => state.setSelected);
  const [materialsOpen, setMaterialsOpen] = useState(true);
  const [sceneOpen, setSceneOpen] = useState(true);

  void outlineRevision;

  const tree = useMemo(() => {
    if (!runtime) return [];
    return buildSceneTree(runtime.productRoot);
  }, [runtime, outlineRevision]);

  const materials = useMemo(() => {
    if (!runtime) return [];
    return collectSceneMaterials(runtime.productRoot);
  }, [runtime, outlineRevision]);

  const rootLabel =
    document?.modelName ||
    (tree[0] ? nodeLabel(tree[0].object) : null) ||
    'Model';

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="border-b border-[var(--line)] px-3 py-3">
        <p className="type-nav-label">Scene</p>
        <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
          {loading ? 'Loading…' : rootLabel}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <button
          type="button"
          onClick={() => setSceneOpen((open) => !open)}
          className="mb-1 flex w-full items-center justify-between px-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--text-muted)] uppercase"
        >
          Scene
          <span>{sceneOpen ? '−' : '+'}</span>
        </button>
        {sceneOpen ? (
          tree.length === 0 ? (
            <p className="type-meta px-2">No scene objects</p>
          ) : (
            <TreeRows
              nodes={tree}
              selected={selected}
              onSelect={setSelected}
            />
          )
        ) : null}

        <button
          type="button"
          onClick={() => setMaterialsOpen((open) => !open)}
          className="mt-4 mb-1 flex w-full items-center justify-between px-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--text-muted)] uppercase"
        >
          Materials
          <span>{materialsOpen ? '−' : '+'}</span>
        </button>
        {materialsOpen ? (
          materials.length === 0 ? (
            <p className="type-meta px-2">No named materials</p>
          ) : (
            <ul className="space-y-0.5">
              {materials.map((name) => (
                <li
                  key={name}
                  className="truncate rounded-md px-2 py-1.5 text-[12px] text-[var(--ink)]/80"
                >
                  {name}
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
    </aside>
  );
}
