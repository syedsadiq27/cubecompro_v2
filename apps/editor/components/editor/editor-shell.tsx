'use client';

import { useEffect, useState } from 'react';
import { Stage } from '@repo/ui';
import { useEditorProductLoad } from '@/hooks/use-editor-product-load';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useEditorStore } from '@/lib/editor-store';
import { TopChrome } from './top-chrome';
import { WorkspaceRail } from './rail/workspace-rail';
import { PanelHost } from './panels/panel-host';
import { InspectorHost } from './inspectors/inspector-host';
import { ActionWindowHost } from './action-window/action-window-host';
import { EditorViewport } from './editor-viewport';
import { TransformGizmoBar } from './stage/transform-gizmo-bar';
import { ViewportNavControls } from './stage/viewport-nav-controls';
import { OrientationWidget } from './stage/orientation-widget';
import { CameraPresetsBar } from './stage/camera-presets-bar';
import { RenderModePill } from './stage/render-mode-pill';
import { PreviewSelectionBar } from './stage/preview-selection-bar';
import { DrawerHost } from './drawer-host';
import { ModalHost } from './modal-host';
import {
  EditorHorizontalSplit,
  EditorVerticalSplit,
} from './layout/editor-split';
import { MobileTopBar } from './mobile/mobile-top-bar';
import { MobileBottomNav } from './mobile/mobile-bottom-nav';
import {
  MobileBottomSheet,
  type SheetHeight,
} from './mobile/mobile-bottom-sheet';

const PANEL_COLLAPSE_KEY = 'cubecom:editor:panel-collapsed';

function ViewportCanvas({
  compactChrome = false,
}: {
  compactChrome?: boolean;
}) {
  const loading = useEditorStore((state) => state.loading);
  const loadError = useEditorStore((state) => state.loadError);
  const statusMessage = useEditorStore((state) => state.statusMessage);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#181920]">
      <Stage
        size="full"
        plane
        className="absolute inset-0 h-full"
        style={{ minHeight: '100%' }}
      />
      <EditorViewport />

      {!compactChrome ? (
        <>
          <TransformGizmoBar />
          <ViewportNavControls />
          <OrientationWidget />
          <CameraPresetsBar />
          <RenderModePill />
          <PreviewSelectionBar />
        </>
      ) : null}

      {loading ? (
        <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-black/40">
          <p className="rounded-full border border-white/10 bg-[#121318] px-4 py-2 text-[13px] font-medium text-white shadow-xl">
            Loading 3D model…
          </p>
        </div>
      ) : null}

      {(loadError || statusMessage) && !loading ? (
        <div className="absolute inset-x-4 top-14 z-[6] mx-auto max-w-md rounded-xl border border-white/10 bg-[#121318] px-4 py-2 text-center text-[12px] font-medium text-white shadow-xl">
          {loadError || statusMessage}
        </div>
      ) : null}
    </div>
  );
}

export function EditorShell() {
  useEditorProductLoad();
  const isDesktop = useIsDesktop();

  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const setSelectedTargetKey = useEditorStore(
    (state) => state.setSelectedTargetKey
  );
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);

  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>('peek');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PANEL_COLLAPSE_KEY);
      if (stored !== null) {
        setPanelCollapsed(stored === '1');
      }
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

  const mobileTab: 'scene' | 'product' | 'cameras' | 'assets' =
    activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera'
      ? 'cameras'
      : activeWorkspace === 'assets' || activeWorkspace === 'materials'
        ? 'assets'
        : activeWorkspace === 'product' ||
            activeWorkspace === 'mappings' ||
            activeWorkspace === 'preview' ||
            activeWorkspace === 'model'
          ? 'product'
          : 'scene';

  const actionPane = (
    <div className="h-full min-h-0 overflow-hidden border-t border-white/10 bg-[#121318]">
      <ActionWindowHost />
    </div>
  );

  if (isDesktop === true) {
    return (
      <div className="relative flex h-dvh flex-col overflow-hidden bg-[#0E0F12] select-none text-white font-sans">
        <TopChrome />

        <div className="flex min-h-0 flex-1">
          <WorkspaceRail
            collapsed={panelCollapsed}
            onToggleCollapse={togglePanel}
          />

          <EditorHorizontalSplit
            id={
              panelCollapsed
                ? 'cubecom:editor:split:main-collapsed'
                : 'cubecom:editor:split:main'
            }
            collapsedLeft={panelCollapsed}
            left={<PanelHost collapsed={false} />}
            center={
              <EditorVerticalSplit
                id="cubecom:editor:split:center"
                top={
                  <div className="relative h-full min-h-0 min-w-0">
                    <ViewportCanvas />
                  </div>
                }
                bottom={actionPane}
              />
            }
            right={<InspectorHost />}
          />
        </div>

        <DrawerHost />
        <ModalHost />
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#0E0F12] select-none text-white font-sans">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        {isDesktop === false ? (
          <MobileTopBar
            hasBack={Boolean(selectedTargetKey || authoringFocus)}
            onBack={() => {
              setSelectedTargetKey(null);
              setAuthoringFocus(null);
              setSheetHeight('half');
            }}
          />
        ) : null}
        <ViewportCanvas compactChrome={isDesktop === false} />
      </div>

      {isDesktop === false ? (
        <>
          <MobileBottomSheet
            activeTab={mobileTab}
            sheetHeight={sheetHeight}
            onSheetHeightChange={setSheetHeight}
          />
          <MobileBottomNav
            activeTab={mobileTab}
            onSelectTab={(tab) => {
              setSelectedTargetKey(null);
              setAuthoringFocus(null);
              setActiveWorkspace(
                tab === 'assets'
                  ? 'materials'
                  : tab === 'cameras'
                    ? 'cameras'
                    : tab
              );
              setSheetHeight((prev) => (prev === 'peek' ? 'half' : prev));
            }}
          />
        </>
      ) : null}

      <DrawerHost />
      <ModalHost />
    </div>
  );
}
