'use client';

import { useEffect, useState } from 'react';
import { Stage } from '@repo/ui';
import { useEditorProductLoad } from '@/hooks/use-editor-product-load';
import { useEditorStore } from '@/lib/editor-store';
import { TopChrome } from './top-chrome';
import { WorkspaceRail } from './rail/workspace-rail';
import { PanelHost } from './panels/panel-host';
import { InspectorHost } from './inspectors/inspector-host';
import { TransformGizmoBar } from './stage/transform-gizmo-bar';
import { ViewportNavControls } from './stage/viewport-nav-controls';
import { CameraPresetsBar } from './stage/camera-presets-bar';
import { RenderModePill } from './stage/render-mode-pill';
import { OrientationWidget } from './stage/orientation-widget';
import { StatusFooter } from './stage/status-footer';
import { EditorViewport } from './editor-viewport';
import { DrawerHost } from './drawer-host';
import { ModalHost } from './modal-host';

const PANEL_COLLAPSE_KEY = 'cubecom.suite.editor.sidebar.collapsed';

export function EditorShell() {
  useEditorProductLoad();

  const loading = useEditorStore((state) => state.loading);
  const loadError = useEditorStore((state) => state.loadError);
  const statusMessage = useEditorStore((state) => state.statusMessage);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PANEL_COLLAPSE_KEY);
      if (stored === '1') setPanelCollapsed(true);
      if (stored === '0') setPanelCollapsed(false);
    } catch {
      /* ignore */
    }
  }, []);

  const togglePanel = () => {
    setPanelCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(PANEL_COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[var(--canvas)] select-none">
      <TopChrome />

      <div className="flex min-h-0 flex-1">
        <WorkspaceRail
          collapsed={panelCollapsed}
          onToggleCollapse={togglePanel}
        />

        <PanelHost collapsed={panelCollapsed} />

        <div className="relative min-w-0 flex-1 overflow-hidden bg-[var(--canvas)]">
          <Stage
            size="full"
            plane
            className="absolute inset-0 h-full"
            style={{ minHeight: '100%' }}
          />
          <EditorViewport />

          <TransformGizmoBar />
          <ViewportNavControls />
          <OrientationWidget />
          <CameraPresetsBar />
          <RenderModePill />
          <StatusFooter />

          {loading ? (
            <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-[var(--canvas)]/40">
              <p className="rounded-full border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-2 text-[13px] font-medium text-[var(--ink)] shadow-sm">
                Loading 3D model…
              </p>
            </div>
          ) : null}

          {(loadError || statusMessage) && !loading ? (
            <div className="absolute inset-x-4 top-16 z-[6] mx-auto max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-2.5 text-center text-[12px] font-medium text-[var(--ink)] shadow-sm">
              {loadError || statusMessage}
            </div>
          ) : null}
        </div>

        <InspectorHost />
      </div>

      <DrawerHost />
      <ModalHost />
    </div>
  );
}
