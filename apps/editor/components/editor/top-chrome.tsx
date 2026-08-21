'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { EDITOR_EMBED } from '@repo/product-graph';
import {
  isRevisionEditable,
  revisionStatusLabel,
} from '@/lib/authoring-focus';
import { AssetsIcon } from '@/components/editor/icons';

export function TopChrome() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
  const editorDocument = useEditorStore((state) => state.document);
  const dirty = useEditorStore((state) => state.dirty);
  const loading = useEditorStore((state) => state.loading);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const setSelected = useEditorStore((state) => state.setSelected);
  const embedded = useEditorStore((state) => state.embedded);
  const returnTo = useEditorStore((state) => state.returnTo);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const saveVisualDocument = useEditorStore(
    (state) => state.saveVisualDocument
  );
  const createDraftRevisionForEdit = useEditorStore(
    (state) => state.createDraftRevisionForEdit
  );

  const editable = isRevisionEditable(graphDetail?.status);
  const revisionLabel = revisionStatusLabel(graphDetail?.status);

  const loadedName = editorDocument?.productName?.trim() || 'Alder Dining Table';
  const [productName, setProductName] = useState(loadedName);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditingTitle && loadedName) {
      setProductName(loadedName);
    }
  }, [loadedName, isEditingTitle]);

  const displayName = productName || (loading ? 'Loading…' : 'Alder Dining Table');

  const onSave = async () => {
    if (!visualDocument) {
      setStatusMessage('Load a product with visual bindings before saving.');
      return;
    }
    if (!editable) {
      setStatusMessage('Revision is read-only. Create a new draft to edit.');
      return;
    }
    setSaving(true);
    try {
      await saveVisualDocument();
    } catch {
      /* statusMessage set in store */
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: 'scene' | 'product' | 'cameras' | 'assets'; label: string }[] = [
    { key: 'scene', label: 'Scene' },
    { key: 'product', label: 'Config' },
    { key: 'cameras', label: 'Camera' },
    { key: 'assets', label: 'Assets' },
  ];

  return (
    <header className="z-20 flex h-13 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0E0F12] px-4 select-none text-white">
      {/* Left: Model title & version */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#665CFF]/20 text-[#9D95FF]">
          <AssetsIcon size="md" />
        </div>

        <div className="flex items-center gap-2 text-[13px]">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  setIsEditingTitle(false);
                }
              }}
              className="h-7 rounded-md border border-[#665CFF] bg-[#1A1B22] px-2 text-[13px] font-semibold text-white outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 font-semibold text-white hover:text-white/80 transition-colors"
            >
              <span>{displayName}</span>
            </button>
          )}

          <span className="text-white/30">/</span>
          <span className="text-white/60 font-medium">Model v7</span>
        </div>

        <span className="rounded-full bg-[#665CFF]/20 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[#9D95FF] border border-[#665CFF]/40">
          {editable ? 'DRAFT' : revisionLabel}
        </span>
      </div>

      {/* Center: Invariant Workspace Tabs */}
      <div className="flex items-center gap-1 bg-[#14151B] p-1 rounded-xl border border-white/10">
        {tabs.map((tab) => {
          const isActive =
            activeWorkspace === tab.key ||
            (tab.key === 'product' && (activeWorkspace === 'mappings' || activeWorkspace === 'preview' || activeWorkspace === 'model'));

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveWorkspace(tab.key)}
              className={`relative px-4 py-1.5 text-[12px] font-medium transition-all rounded-lg ${
                isActive
                  ? 'bg-[#232549] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {isActive ? (
                <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-[#665CFF] shadow-[0_0_8px_#665CFF]" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusMessage('Undo')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title="Undo (⌘Z)"
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => setStatusMessage('Redo')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title="Redo (⌘⇧Z)"
        >
          ↷
        </button>

        <button
          type="button"
          onClick={() => setStatusMessage('Opening interactive customizer preview…')}
          className="flex h-8 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 text-[12px] font-medium text-white transition-colors hover:bg-white/10 hover:border-white/25"
        >
          <span>▷</span>
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex h-8 items-center gap-1.5 rounded-xl bg-[#665CFF] px-4 text-[12px] font-semibold text-white shadow-md transition-all hover:bg-[#574CEE] active:scale-98 disabled:opacity-50"
        >
          <span>{saving ? 'Saving…' : 'Save'}</span>
        </button>
      </div>
    </header>
  );
}
