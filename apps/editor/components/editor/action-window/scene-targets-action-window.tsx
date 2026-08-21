'use client';

import { useMemo, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { findNodeByPath } from '@/lib/scene-tree';
import type { VisualTarget } from '@/lib/visual/types';

type TargetCategory = 'all' | 'surface' | 'structural' | 'unused' | 'broken';

export function SceneTargetsActionWindow() {
  const runtime = useEditorStore((state) => state.runtime);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const setSelectedTargetKey = useEditorStore(
    (state) => state.setSelectedTargetKey
  );
  const setSelected = useEditorStore((state) => state.setSelected);
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const removeTarget = useEditorStore((state) => state.removeTarget);
  const createModelTargetFromSelection = useEditorStore(
    (state) => state.createModelTargetFromSelection
  );

  const [filterCategory, setFilterCategory] = useState<TargetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Actual targets from the persisted visual document only
  const targets = useMemo(() => {
    return visualDocument?.targets ?? [];
  }, [visualDocument]);

  const bindings = visualDocument?.bindings ?? [];

  const counts = useMemo(() => {
    let surface = 0;
    let structural = 0;
    let unused = 0;
    let broken = 0;

    targets.forEach((t) => {
      const isStruct = t.targetType?.toUpperCase() === 'STRUCTURAL';

      if (isStruct) structural++;
      else surface++;

      const usedCount = bindings.filter((b) => b.targetKey === t.key).length;
      if (usedCount === 0) unused++;
    });

    return { all: targets.length, surface, structural, unused, broken };
  }, [targets, bindings]);

  const filteredTargets = useMemo(() => {
    return targets.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !t.key.toLowerCase().includes(q) &&
          !t.nodePath.toLowerCase().includes(q) &&
          !(t.name || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      const isStruct = t.targetType?.toUpperCase() === 'STRUCTURAL';
      const usedCount = bindings.filter((b) => b.targetKey === t.key).length;

      if (filterCategory === 'surface') return !isStruct;
      if (filterCategory === 'structural') return isStruct;
      if (filterCategory === 'unused') return usedCount === 0;
      if (filterCategory === 'broken') return false;
      return true;
    });
  }, [targets, bindings, filterCategory, searchQuery]);

  const handleSelectTarget = (target: VisualTarget) => {
    setSelectedTargetKey(target.key);
    if (!runtime) return;
    const mesh =
      findNodeByPath(runtime.productRoot, target.nodePath) ||
      runtime.scene.getObjectByName(target.key) ||
      runtime.scene.getObjectByName(target.nodePath.replace(/^\//, ''));

    if (mesh) {
      setSelected(mesh);
      runtime.frameSelection();
      setStatusMessage(`Selected target: ${target.key}`);
    }
  };

  const handleToggleTargetVisibility = (target: VisualTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!runtime) return;
    const mesh =
      findNodeByPath(runtime.productRoot, target.nodePath) ||
      runtime.scene.getObjectByName(target.key) ||
      runtime.scene.getObjectByName(target.nodePath.replace(/^\//, ''));

    if (mesh) {
      toggleVisibility(mesh);
      setStatusMessage(`Toggled visibility for ${mesh.name}`);
    }
  };

  const handleExportTargets = () => {
    const json = JSON.stringify(targets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-targets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Exported ModelTargets JSON');
  };

  return (
    <div className="flex h-full flex-col bg-[#101116] border-t border-white/10 text-white select-none">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 shrink-0 bg-[#0E0F12]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-[13px] text-white">
            <span>Targets</span>
            <span className="flex h-5 items-center justify-center rounded-full bg-white/10 px-1.5 font-mono text-[10px] text-white/70">
              {targets.length}
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 ml-3 bg-black/30 p-0.5 rounded-xl border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('surface')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filterCategory === 'surface'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Surface</span>
              <span className="text-[10px] opacity-70">{counts.surface}</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('structural')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filterCategory === 'structural'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Structural</span>
              <span className="text-[10px] opacity-70">{counts.structural}</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('unused')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filterCategory === 'unused'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Unused</span>
              <span className="text-[10px] opacity-70">{counts.unused}</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('broken')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filterCategory === 'broken'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Broken</span>
              <span className="text-[10px] opacity-70">{counts.broken}</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportTargets}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10 hover:border-white/25"
          >
            <span>⤓</span>
            <span>Export Targets</span>
          </button>
        </div>
      </div>

      {/* Targets Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead className="sticky top-0 bg-[#14151B] border-b border-white/10 text-[10px] font-mono font-medium uppercase tracking-wider text-white/50 z-10">
            <tr>
              <th className="w-10 px-3 py-2 text-center">👁</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Node Path</th>
              <th className="px-3 py-2">Material Slot</th>
              <th className="px-3 py-2">Used By</th>
              <th className="w-10 px-3 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTargets.map((target) => {
              const isSelected = selectedTargetKey === target.key;
              const usedBindings = bindings.filter((b) => b.targetKey === target.key);
              const usedCount = usedBindings.length;
              const type =
                target.targetType?.toUpperCase() === 'STRUCTURAL'
                  ? 'STRUCTURAL'
                  : 'SURFACE';
              const displayName =
                target.name ||
                target.key
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

              // Check actual mesh visibility in Three.js
              const mesh = runtime
                ? findNodeByPath(runtime.productRoot, target.nodePath) ||
                  runtime.scene.getObjectByName(target.key)
                : null;
              const isVisible = mesh ? mesh.visible : true;

              return (
                <tr
                  key={target.key}
                  onClick={() => handleSelectTarget(target)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-[#232549] text-white border-l-2 border-[#665CFF]'
                      : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  {/* Eye visibility */}
                  <td
                    onClick={(e) => handleToggleTargetVisibility(target, e)}
                    className="px-3 py-2 text-center text-white/40 group-hover:text-white transition-colors cursor-pointer"
                    title="Toggle mesh visibility"
                  >
                    <span>{isVisible ? '👁' : '⊘'}</span>
                  </td>

                  {/* Name with colored icon */}
                  <td className="px-3 py-2 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-md text-[11px] shadow-xs"
                        style={{
                          backgroundColor:
                            type === 'STRUCTURAL' ? '#10B98125' : '#665CFF25',
                          color: type === 'STRUCTURAL' ? '#10B981' : '#9D95FF',
                        }}
                      >
                        {type === 'STRUCTURAL' ? '◈' : '⬡'}
                      </span>
                      <span>{displayName}</span>
                    </div>
                  </td>

                  {/* Key */}
                  <td className="px-3 py-2 font-mono text-[11px] text-white/60">
                    {target.key}
                  </td>

                  {/* Type Badge */}
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider ${
                        type === 'SURFACE'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      }`}
                    >
                      {type}
                    </span>
                  </td>

                  {/* Node Path */}
                  <td className="px-3 py-2 font-mono text-[11px] text-white/50 truncate max-w-[200px]">
                    {target.nodePath || `/${target.key}`}
                  </td>

                  {/* Material Slot */}
                  <td className="px-3 py-2 font-mono text-[11px] text-white/60">
                    {target.materialSlot ?? '—'}
                  </td>

                  {/* Used By */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          usedCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          usedCount > 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {usedCount > 0
                          ? `${usedCount} effect${usedCount === 1 ? '' : 's'}`
                          : 'Unused'}
                      </span>
                    </div>
                  </td>

                  {/* Row Actions Menu */}
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      void removeTarget(target.key).catch(() => {
                        /* statusMessage set in store */
                      });
                    }}
                    className="px-3 py-2 text-center text-white/30 hover:text-red-400 cursor-pointer"
                    title="Delete target"
                  >
                    🗑
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
