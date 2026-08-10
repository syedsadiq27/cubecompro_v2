'use client';

import { Stage } from '@repo/ui/stage';
import { useEditorProductLoad } from '../../hooks/use-editor-product-load';
import { useEditorStore } from '../../lib/editor-store';
import { ConfigurePanel } from './configure-panel';
import { DrawerHost } from './drawer-host';
import { EditorViewport } from './editor-viewport';
import { InspectorPanel } from './inspector/inspector-panel';
import { ModalHost } from './modal-host';
import { TopChrome } from './top-chrome';
import { ViewportToolbar } from './viewport-toolbar';

export function EditorShell() {
  useEditorProductLoad();

  const loading = useEditorStore((state) => state.loading);
  const loadError = useEditorStore((state) => state.loadError);
  const statusMessage = useEditorStore((state) => state.statusMessage);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[var(--canvas)]">
      <TopChrome />

      <div className="flex min-h-0 flex-1">
        <ConfigurePanel />

        <div className="relative min-w-0 flex-1">
          <Stage
            size="full"
            plane
            className="absolute inset-0 h-full"
            style={{ minHeight: '100%' }}
          />
          <EditorViewport />
          <ViewportToolbar />

          {loading ? (
            <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center bg-[var(--canvas)]/40">
              <p className="rounded-full bg-[var(--surface-pure)] px-4 py-2 text-[13px] text-[var(--ink)] shadow-sm">
                Loading model…
              </p>
            </div>
          ) : null}

          {(loadError || statusMessage) && !loading ? (
            <div className="absolute inset-x-4 top-4 z-[3] mx-auto max-w-lg rounded-[10px] border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-3 text-[13px] text-[var(--ink)] shadow-sm">
              {loadError || statusMessage}
            </div>
          ) : null}
        </div>

        <InspectorPanel />
      </div>

      <DrawerHost />
      <ModalHost />
    </div>
  );
}
