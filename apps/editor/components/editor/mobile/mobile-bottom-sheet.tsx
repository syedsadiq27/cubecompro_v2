'use client';

import { useEditorStore } from '@/lib/editor-store';
import { MobileSceneWorkspace } from './mobile-scene-workspace';
import { MobileConfigWorkspace } from './mobile-config-workspace';
import { MobileCameraWorkspace } from './mobile-camera-workspace';
import { MobileAssetsWorkspace } from './mobile-assets-workspace';

export type SheetHeight = 'peek' | 'half' | 'full';

const SHEET_HEIGHT_CLASS: Record<SheetHeight, string> = {
  peek: 'h-11 shrink-0',
  half: 'h-[40dvh] shrink-0',
  full: 'h-[64dvh] shrink-0',
};

export function MobileBottomSheet({
  activeTab,
  sheetHeight,
  onSheetHeightChange,
}: {
  activeTab: 'scene' | 'product' | 'cameras' | 'assets';
  sheetHeight: SheetHeight;
  onSheetHeightChange: (height: SheetHeight) => void;
  onOpenDetail?: (name: string) => void;
  onCloseDetail?: () => void;
}) {
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const setSelectedTargetKey = useEditorStore(
    (state) => state.setSelectedTargetKey
  );
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);

  const cycleHeight = () => {
    onSheetHeightChange(
      sheetHeight === 'peek' ? 'half' : sheetHeight === 'half' ? 'full' : 'peek'
    );
  };

  const requestExpand = () => {
    if (sheetHeight === 'peek') onSheetHeightChange('half');
  };

  const tabLabel =
    activeTab === 'product'
      ? 'Config'
      : activeTab === 'cameras'
        ? 'Camera'
        : activeTab === 'assets'
          ? 'Assets'
          : 'Scene';

  const isDrilling =
    (activeTab === 'scene' && Boolean(selectedTargetKey)) ||
    (activeTab === 'product' && Boolean(authoringFocus));

  return (
    <div
      className={`flex flex-col overflow-hidden border-t border-white/10 bg-[#121318] text-white transition-[height] duration-300 ease-out ${SHEET_HEIGHT_CLASS[sheetHeight]}`}
    >
      <div
        className="flex h-11 shrink-0 cursor-grab items-center justify-between px-4 active:cursor-grabbing"
        onClick={cycleHeight}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-1.5 w-10 shrink-0 rounded-full bg-white/20" />
          {sheetHeight === 'peek' || !isDrilling ? (
            <span className="truncate font-mono text-[11px] font-bold uppercase tracking-wider text-white/60">
              {tabLabel}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (sheetHeight === 'peek') {
              onSheetHeightChange('half');
              return;
            }
            if (isDrilling) {
              if (activeTab === 'scene') setSelectedTargetKey(null);
              if (activeTab === 'product') setAuthoringFocus(null);
            }
            onSheetHeightChange('peek');
          }}
          className="shrink-0 text-[11px] font-medium text-white/50 hover:text-white"
        >
          {sheetHeight === 'peek' ? 'Open' : 'Collapse'}
        </button>
      </div>

      {sheetHeight !== 'peek' ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === 'scene' ? (
            <MobileSceneWorkspace onRequestExpand={requestExpand} />
          ) : activeTab === 'product' ? (
            <MobileConfigWorkspace onRequestExpand={requestExpand} />
          ) : activeTab === 'cameras' ? (
            <MobileCameraWorkspace onRequestExpand={requestExpand} />
          ) : (
            <MobileAssetsWorkspace />
          )}
        </div>
      ) : null}
    </div>
  );
}
