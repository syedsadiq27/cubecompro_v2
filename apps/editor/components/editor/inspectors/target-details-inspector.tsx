'use client';

import { useMemo, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { findNodeByPath } from '@/lib/scene-tree';
import type { VisualTarget } from '@/lib/visual/types';

export function TargetDetailsInspector() {
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const setSelectedTargetKey = useEditorStore(
    (state) => state.setSelectedTargetKey
  );
  const updateTarget = useEditorStore((state) => state.updateTarget);
  const removeTarget = useEditorStore((state) => state.removeTarget);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
  const previewChoiceValue = useEditorStore(
    (state) => state.previewChoiceValue
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const setSelected = useEditorStore((state) => state.setSelected);
  const runtime = useEditorStore((state) => state.runtime);

  const [copied, setCopied] = useState(false);

  const currentTarget = useMemo(() => {
    if (!visualDocument || !selectedTargetKey) return null;
    return (
      visualDocument.targets.find((t) => t.key === selectedTargetKey) ?? null
    );
  }, [visualDocument, selectedTargetKey]);

  const usedByBindings = useMemo(() => {
    if (!visualDocument || !selectedTargetKey) return [];
    return visualDocument.bindings.filter(
      (b) => b.targetKey === selectedTargetKey
    );
  }, [visualDocument, selectedTargetKey]);

  if (!currentTarget) {
    return (
      <div className="p-4 text-[12px] text-white/50 space-y-2">
        <p>No target selected.</p>
        <p className="text-[11px] text-white/30">
          Select a target in the Targets list below or click an object in the 3D scene.
        </p>
      </div>
    );
  }

  const handleCopyNodePath = () => {
    if (typeof navigator !== 'undefined' && currentTarget.nodePath) {
      void navigator.clipboard.writeText(currentTarget.nodePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setStatusMessage('Node path copied to clipboard');
    }
  };

  const handleLocateInScene = () => {
    if (!runtime) return;
    const obj =
      findNodeByPath(runtime.productRoot, currentTarget.nodePath) ||
      runtime.scene.getObjectByName(currentTarget.key) ||
      runtime.scene.getObjectByName(currentTarget.nodePath.replace(/^\//, ''));

    if (obj) {
      setSelected(obj);
      runtime.frameSelection();
      setStatusMessage(`Focused ${currentTarget.key} in 3D scene`);
    } else {
      runtime.frameSelection();
    }
  };

  const handleJumpToConfig = (choiceKey: string, valueKey: string) => {
    previewChoiceValue(choiceKey, valueKey);
    setStatusMessage(`Previewing ${choiceKey} / ${valueKey}`);
  };

  return (
    <div className="space-y-4 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">
          Target Details
        </h3>
        <button
          type="button"
          onClick={() => setSelectedTargetKey(null)}
          className="text-white/40 hover:text-white transition-colors text-[13px]"
          title="Close inspector"
        >
          ✕
        </button>
      </div>

      {/* Field: Name */}
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-white/50">Name</label>
        <input
          type="text"
          value={
            currentTarget.name ??
            currentTarget.key
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase())
          }
          onChange={(e) =>
            updateTarget(currentTarget.key, { name: e.target.value })
          }
          className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[12px] font-medium text-white outline-none focus:border-[#665CFF]/60"
        />
      </div>

      {/* Field: Key */}
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-white/50">Key</label>
        <input
          type="text"
          value={currentTarget.key}
          readOnly
          className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white/90 outline-none"
        />
        <span className="text-[9px] text-white/40 block">
          Unique key used in configuration
        </span>
      </div>

      {/* Field: Type */}
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-white/50">Type</label>
        <select
          value={currentTarget.targetType ?? 'SURFACE'}
          onChange={(e) =>
            updateTarget(currentTarget.key, { targetType: e.target.value })
          }
          className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[12px] text-white outline-none cursor-pointer"
        >
          <option value="SURFACE" className="bg-[#16171E] text-white">
            Surface
          </option>
          <option value="STRUCTURAL" className="bg-[#16171E] text-white">
            Structural
          </option>
        </select>
      </div>

      {/* Field: Node Path */}
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-white/50">Node Path</label>
        <div className="flex h-8 items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white/80">
          <span className="truncate">{currentTarget.nodePath || `/${currentTarget.key}`}</span>
          <button
            type="button"
            onClick={handleCopyNodePath}
            className="text-white/40 hover:text-white transition-colors shrink-0"
            title="Copy node path"
          >
            {copied ? '✓' : '⧉'}
          </button>
        </div>
      </div>

      {/* Field: Material Slot */}
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-white/50">Material Slot</label>
        <input
          type="text"
          value={currentTarget.materialSlot ?? '0'}
          onChange={(e) =>
            updateTarget(currentTarget.key, { materialSlot: e.target.value })
          }
          className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[11px] text-white outline-none"
        />
      </div>

      {/* Field: Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-white/50">
          <span>Description</span>
          <span className="font-mono text-[9px] text-white/40">
            {(currentTarget.description || '').length} / 200
          </span>
        </div>
        <textarea
          rows={2}
          value={currentTarget.description ?? ''}
          placeholder="Add description for this target…"
          onChange={(e) =>
            updateTarget(currentTarget.key, { description: e.target.value })
          }
          className="w-full rounded-xl border border-white/10 bg-[#16171E] p-2.5 text-[11px] text-white outline-none resize-none placeholder-white/30"
        />
      </div>

      {/* Used By Section */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/80">
            Used By ({usedByBindings.length})
          </span>
        </div>

        {usedByBindings.length > 0 ? (
          <div className="space-y-1.5">
            {usedByBindings.map((binding, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleJumpToConfig(binding.choiceKey, binding.valueKey)
                }
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-1.5 text-[11px] cursor-pointer hover:border-[#665CFF]/60 hover:bg-[#1B1D28] transition-colors"
                title="Click to inspect this effect in Config"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate text-white/90">
                    {binding.choiceKey} / {binding.valueKey}
                  </span>
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/60 shrink-0">
                  {binding.operation}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40">
            Not currently bound to any choice value.
          </p>
        )}

        <button
          type="button"
          onClick={() => setActiveWorkspace('product')}
          className="text-[11px] font-medium text-[#9D95FF] hover:underline pt-0.5 block"
        >
          View in Config
        </button>
      </div>

      {/* Actions */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
          Actions
        </span>

        <button
          type="button"
          onClick={handleLocateInScene}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#16171E] px-3 text-[11px] font-medium text-white hover:bg-white/10 transition-colors"
        >
          <span>⌖</span>
          <span>Locate in Scene</span>
        </button>

        <button
          type="button"
          onClick={() => {
            void removeTarget(currentTarget.key).catch(() => {
              /* statusMessage set in store */
            });
          }}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-3 text-[11px] font-medium text-red-400 hover:bg-red-900/30 transition-colors"
        >
          <span>🗑</span>
          <span>Delete Target</span>
        </button>
      </div>
    </div>
  );
}
