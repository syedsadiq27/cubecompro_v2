'use client';

import { useEditorStore } from '@/lib/editor-store';
import { TargetDetailsInspector } from './target-details-inspector';
import { BehaviorInspector } from './behavior-inspector';
import { PreviewInspector } from './preview-inspector';
import { SceneMaterialInspector } from './scene-material-inspector';
import { CameraInspector } from './camera-inspector';

export function InspectorHost() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const selectedTargetKey = useEditorStore((state) => state.selectedTargetKey);
  const selected = useEditorStore((state) => state.selected);

  const isCamera =
    activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera';

  const isScene = activeWorkspace === 'scene';
  const isAssets = activeWorkspace === 'assets' || activeWorkspace === 'materials';

  const renderActiveInspector = () => {
    if (isCamera) {
      return <CameraInspector />;
    }
    if (isScene) {
      if (selectedTargetKey || !selected) {
        return <TargetDetailsInspector />;
      }
      return <SceneMaterialInspector />;
    }
    if (isAssets) {
      return <SceneMaterialInspector />;
    }
    if (activeWorkspace === 'preview') {
      return <PreviewInspector />;
    }
    return <BehaviorInspector />;
  };

  return (
    <aside className="flex h-full w-full min-w-0 flex-col border-l border-white/10 bg-[#121318] text-white select-none z-10">
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {renderActiveInspector()}
      </div>
    </aside>
  );
}
