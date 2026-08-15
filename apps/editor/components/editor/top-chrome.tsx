'use client';

import { Wordmark } from '@repo/ui';
import { useEffect, useRef, useState } from 'react';

import { EDITOR_EMBED } from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';

export function TopChrome() {
  const editorDocument = useEditorStore((state) => state.document);
  const dirty = useEditorStore((state) => state.dirty);
  const projectId = useEditorStore((state) => state.projectId);
  const productId = useEditorStore((state) => state.productId);
  const modelId = useEditorStore((state) => state.modelId);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const setSelected = useEditorStore((state) => state.setSelected);
  const openModal = useEditorStore((state) => state.openModal);
  const embedded = useEditorStore((state) => state.embedded);
  const returnTo = useEditorStore((state) => state.returnTo);
  const [infoOpen, setInfoOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (infoRef.current && !infoRef.current.contains(target)) {
        setInfoOpen(false);
      }
      if (saveRef.current && !saveRef.current.contains(target)) {
        setSaveOpen(false);
      }
    };
    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, []);

  const primary =
    editorDocument != null
      ? `${editorDocument.productCode || editorDocument.productId} · ${editorDocument.productName}`
      : 'Untitled product';
  const secondary =
    editorDocument != null
      ? editorDocument.modelSku
        ? `${editorDocument.modelName} · ${editorDocument.modelSku}`
        : editorDocument.modelName
      : 'No model loaded';

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
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setStatusMessage('No previous page to return to.');
  };

  const onPreview = () => {
    setStatusMessage('Preview mode is not wired yet.');
  };

  const onUndo = () => {
    setStatusMessage('Undo history is not wired yet.');
  };

  const onRedo = () => {
    setStatusMessage('Redo history is not wired yet.');
  };

  const exportConfig = async () => {
    const { outlineNodes, document: doc } = useEditorStore.getState();
    const editableObjects: string[] = [];
    const rules: Record<string, unknown> = {};

    outlineNodes.forEach((node) => {
      if (node.visible) editableObjects.push(node.name);
      rules[node.name] = {
        ...(node.userData ?? {}),
        editableTransform: {
          elements: Array.from(node.matrix.elements),
        },
      };
    });

    const payload = {
      sku: doc?.modelSku ?? '',
      name: doc?.modelName ?? '',
      editableObjects,
      includedObjects: outlineNodes.map((node) => node.name),
      rules,
      exportedAt: new Date().toISOString(),
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setStatusMessage('Config copied to clipboard.');
    } catch {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = `${payload.sku || 'model'}-config.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Config downloaded.');
    }
  };

  const onQuickSave = async () => {
    setSaveOpen(false);
    await exportConfig();
  };

  return (
    <header className="flex h-[50px] shrink-0 items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-pure)] px-3">
      <div className="flex min-w-0 items-center gap-3">
        <Wordmark size="sm" showPro />
        <div className="hidden h-4 w-px bg-[var(--line)] sm:block" />
        <button
          type="button"
          onClick={() => setInfoOpen((open) => !open)}
          className="relative min-w-0 rounded-[8px] px-1.5 py-1 text-left hover:bg-black/[0.03]"
        >
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-[13px] font-medium text-[var(--ink)]">
              {primary}
            </p>
            {dirty ? (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--stage-violet)]" />
            ) : null}
          </div>
          <p className="type-meta truncate">{secondary}</p>
        </button>
        <div ref={infoRef} className="relative">
          {infoOpen ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-[240px] rounded-[10px] border border-[var(--line)] bg-[var(--surface-pure)] p-3 shadow-md">
              <p className="type-nav-label mb-2">Debug IDs</p>
              <dl className="space-y-1.5 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Project</dt>
                  <dd className="text-[var(--ink)]">{projectId || '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Product</dt>
                  <dd className="text-[var(--ink)]">{productId || '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Model</dt>
                  <dd className="text-[var(--ink)]">{modelId || '—'}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={onUndo}
          className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Redo
        </button>
        <div className="mx-1 hidden h-4 w-px bg-[var(--line)] sm:block" />
        <button
          type="button"
          onClick={onClose}
          className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          {returnTo?.includes('/studio') || returnTo?.includes('tab=3d')
            ? '← Product'
            : returnTo?.includes('/products/')
              ? '← Product'
              : 'Close'}
        </button>
        <div ref={saveRef} className="relative flex items-center">
          <button
            type="button"
            onClick={onQuickSave}
            className="rounded-l-[7px] bg-[var(--ink)] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-black"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setSaveOpen((open) => !open)}
            className="rounded-r-[7px] border-l border-white/20 bg-[var(--ink)] px-2 py-1.5 text-[12px] font-medium text-white hover:bg-black"
            aria-label="Save options"
          >
            ▾
          </button>
          {saveOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-[180px] rounded-[10px] border border-[var(--line)] bg-[var(--surface-pure)] py-1 shadow-md">
              <button
                type="button"
                onClick={onQuickSave}
                className="block w-full px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.04]"
              >
                Quick save
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveOpen(false);
                  openModal('save');
                }}
                className="block w-full px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.04]"
              >
                Save as…
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveOpen(false);
                  setStatusMessage('Publish is not wired yet.');
                }}
                className="block w-full px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.04]"
              >
                Publish…
              </button>
              <button
                type="button"
                onClick={async () => {
                  setSaveOpen(false);
                  await exportConfig();
                }}
                className="block w-full px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.04]"
              >
                Export config
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
