'use client';

import { useEditorStore } from '@/lib/editor-store';
import { ChevronDownIcon } from '@/components/editor/icons';
import { ProductCoveragePanel } from './product-coverage-panel';
import { SceneOutlinerPanel } from './scene-outliner-panel';
import { MaterialsPanel } from './materials-panel';
import { CameraPanel } from './camera-panel';

export function PanelHost({ collapsed }: { collapsed: boolean }) {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);

  if (collapsed) return null;

  const isCamera =
    activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera';

  const title =
    activeWorkspace === 'product' ||
    activeWorkspace === 'mappings' ||
    activeWorkspace === 'model' ||
    activeWorkspace === 'preview'
      ? 'Config'
      : isCamera
        ? 'Camera'
        : activeWorkspace === 'materials'
          ? 'Assets'
          : 'Scene';

  const renderActivePanel = () => {
    switch (activeWorkspace) {
      case 'product':
      case 'mappings':
      case 'model':
      case 'preview':
        return <ProductCoveragePanel />;
      case 'cameras':
      case 'camera' as any:
        return <CameraPanel />;
      case 'materials':
        return <MaterialsPanel />;
      case 'scene':
      case 'objects':
      default:
        return <SceneOutlinerPanel />;
    }
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border-r border-white/10 bg-[#121318] text-white select-none z-10">
      <div className="flex h-11 items-center justify-between border-b border-white/10 px-3.5">
        <span className="text-[11px] font-mono font-bold tracking-wider text-white/60 uppercase">
          {title}
        </span>
        <button
          type="button"
          className="text-white/40 hover:text-white transition-colors"
          title="Toggle panel"
        >
          <ChevronDownIcon size="sm" className="rotate-180" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        {renderActivePanel()}
      </div>
    </div>
  );
}
