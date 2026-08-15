'use client';

import { useEditorStore } from '@/lib/editor-store';
import { SceneOutlinerPanel } from './scene-outliner-panel';
import { MaterialsPanel } from './materials-panel';
import { MappingsPanel } from './mappings-panel';
import { CamerasPanel } from './cameras-panel';
import { LightsPanel } from './lights-panel';
import { EnvironmentPanel } from './environment-panel';
import { BehaviorsPanel } from './behaviors-panel';
import { PreviewPanel } from './preview-panel';

export function PanelHost({ collapsed }: { collapsed: boolean }) {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  if (collapsed) return null;

  const renderActivePanel = () => {
    switch (activeWorkspace) {
      case 'scene':
        return <SceneOutlinerPanel showSearch={false} />;
      case 'objects':
        return <SceneOutlinerPanel showSearch={true} />;
      case 'materials':
        return <MaterialsPanel />;
      case 'mappings':
        return <MappingsPanel />;
      case 'cameras':
        return <CamerasPanel />;
      case 'lights':
        return <LightsPanel />;
      case 'environment':
        return <EnvironmentPanel />;
      case 'behaviors':
        return <BehaviorsPanel />;
      case 'preview':
        return <PreviewPanel />;
      default:
        return <SceneOutlinerPanel />;
    }
  };

  return (
    <div className="flex w-[240px] shrink-0 flex-col justify-between overflow-hidden border-r border-[var(--line)] bg-[var(--surface-pure)] select-none z-10">
      {/* Panel Header */}
      <div className="flex h-10 items-center justify-between border-b border-[var(--line)] px-3">
        <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase">
          {activeWorkspace}
        </span>
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-[var(--canvas)] hover:text-[var(--ink)] text-[13px]"
            onClick={() => setStatusMessage(`Add new item to ${activeWorkspace}`)}
            title="Add item"
          >
            +
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-[var(--canvas)] hover:text-[var(--ink)] text-[12px]"
            onClick={() => setStatusMessage('Workspace options')}
            title="Options"
          >
            •••
          </button>
        </div>
      </div>

      {/* Dynamic Panel Content */}
      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        {renderActivePanel()}
      </div>
    </div>
  );
}
