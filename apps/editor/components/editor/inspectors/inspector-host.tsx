'use client';

import { useEditorStore } from '@/lib/editor-store';
import { SettingsIcon } from '@/components/editor/icons';
import { SceneInspector } from './scene-inspector';
import { ObjectInspector } from './object-inspector';
import { MaterialInspector } from './material-inspector';
import { MappingInspector } from './mapping-inspector';
import { CameraInspector } from './camera-inspector';
import { LightInspector } from './light-inspector';
import { EnvironmentInspector } from './environment-inspector';
import { BehaviorInspector } from './behavior-inspector';
import { PreviewInspector } from './preview-inspector';

export function InspectorHost() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const renderActiveInspector = () => {
    switch (activeWorkspace) {
      case 'scene':
        return <SceneInspector />;
      case 'objects':
        return <ObjectInspector />;
      case 'materials':
        return <MaterialInspector />;
      case 'mappings':
        return <MappingInspector />;
      case 'cameras':
        return <CameraInspector />;
      case 'lights':
        return <LightInspector />;
      case 'environment':
        return <EnvironmentInspector />;
      case 'behaviors':
        return <BehaviorInspector />;
      case 'preview':
        return <PreviewInspector />;
      default:
        return <SceneInspector />;
    }
  };

  return (
    <aside className="flex h-full w-[var(--suite-inspector-width,330px)] shrink-0 flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] select-none z-10">
      {/* Inspector Header */}
      <div className="flex h-10 items-center justify-between border-b border-[var(--line)] px-4">
        <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase">
          {activeWorkspace} Inspector
        </span>
        <button
          type="button"
          aria-label="Inspector settings"
          className="text-[var(--text-muted)] hover:text-[var(--ink)]"
          onClick={() => setStatusMessage('Inspector preferences')}
        >
          <SettingsIcon size={14} />
        </button>
      </div>

      {/* Dynamic Contextual Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {renderActiveInspector()}
      </div>
    </aside>
  );
}
