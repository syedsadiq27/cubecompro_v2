'use client';

import { useState } from 'react';
import { Button, StatusBadge, TopBar } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';
import { EDITOR_EMBED } from '@repo/product-graph';

export function TopChrome() {
  const editorDocument = useEditorStore((state) => state.document);
  const dirty = useEditorStore((state) => state.dirty);
  const loading = useEditorStore((state) => state.loading);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const setSelected = useEditorStore((state) => state.setSelected);
  const embedded = useEditorStore((state) => state.embedded);
  const returnTo = useEditorStore((state) => state.returnTo);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const saveVisualDocument = useEditorStore(
    (state) => state.saveVisualDocument
  );

  const [productName, setProductName] = useState(
    editorDocument?.productName || 'Studio Chair'
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const onClose = () => {
    setSelected(null);
    if (embedded && window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: EDITOR_EMBED.CLOSE,
          returnTo: returnTo || undefined,
        },
        '*'
      );
      return;
    }
    if (returnTo) {
      window.location.assign(returnTo);
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    setStatusMessage('No previous page to return to.');
  };

  const onSave = async () => {
    if (!visualDocument) {
      setStatusMessage('Load a product with visual bindings before saving.');
      return;
    }
    if (!dirty) {
      setStatusMessage('No unsaved visual binding edits.');
      return;
    }
    setSaving(true);
    try {
      await saveVisualDocument();
    } catch {
      /* statusMessage set in store */
    } finally {
      setSaving(false);
      setSaveDropdownOpen(false);
    }
  };

  return (
    <TopBar
      className="z-20"
      start={
        <>
          <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
            <span className="cursor-pointer hover:text-[var(--ink)]">Catalog</span>
            <span>/</span>
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
                className="h-7 rounded-md border border-[var(--brand)] bg-[var(--surface-pure)] px-1.5 text-[12px] font-semibold text-[var(--ink)] outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="group flex h-7 items-center gap-1 rounded-md px-1.5 text-[12px] font-semibold text-[var(--ink)] hover:bg-[var(--canvas)]"
              >
                <span className="truncate">{productName}</span>
                <span className="text-[10px] text-[var(--text-muted)] opacity-60 group-hover:opacity-100">
                  ✎
                </span>
              </button>
            )}
            <span>/</span>
            <span className="font-medium text-[var(--ink)]">3D Studio</span>
          </div>
          <StatusBadge
            role={dirty ? 'warning' : 'published'}
            label={dirty ? 'UNSAVED' : 'SAVED'}
          />
        </>
      }
      end={
        <>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              setStatusMessage('Opening interactive customizer preview…')
            }
          >
            Preview
          </Button>
          <button
            type="button"
            onClick={() => setStatusMessage('Undo')}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            onClick={() => setStatusMessage('Redo')}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <div className="mx-1 h-4 w-px bg-[var(--line)]" />
          <Button type="button" size="sm" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <div className="relative">
            <div className="inline-flex rounded-[7px]">
              <Button
                type="button"
                size="sm"
                disabled={saving || loading || !visualDocument}
                onClick={() => {
                  void onSave();
                }}
                className="ui:rounded-r-none"
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setSaveDropdownOpen((o) => !o)}
                className="ui:rounded-l-none ui:border-l ui:border-white/20 ui:px-2"
              >
                ▾
              </Button>
            </div>
            {saveDropdownOpen ? (
              <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-1 text-[12px] shadow-lg">
                <button
                  type="button"
                  className="w-full rounded px-3 py-1.5 text-left hover:bg-[var(--canvas)]"
                  onClick={() => {
                    void onSave();
                  }}
                >
                  Save visual bindings
                </button>
                <button
                  type="button"
                  className="w-full rounded px-3 py-1.5 text-left hover:bg-[var(--canvas)]"
                  onClick={() => {
                    setSaveDropdownOpen(false);
                    setStatusMessage('Publishing is out of scope for 2C.');
                  }}
                >
                  Save &amp; publish
                </button>
                <button
                  type="button"
                  className="mt-1 w-full rounded border-t border-[var(--line)] px-3 py-1.5 text-left hover:bg-[var(--canvas)]"
                  onClick={() => {
                    setSaveDropdownOpen(false);
                    setStatusMessage('Exporting GLB buffer…');
                  }}
                >
                  Export configuration JSON
                </button>
              </div>
            ) : null}
          </div>
        </>
      }
    />
  );
}
