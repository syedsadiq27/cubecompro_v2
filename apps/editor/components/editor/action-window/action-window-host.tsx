'use client';

import { useEditorStore } from '@/lib/editor-store';
import { SceneTargetsActionWindow } from './scene-targets-action-window';
import { ConfigCoverageActionWindow } from './config-coverage-action-window';
import { CameraActionWindow } from './camera-action-window';
import { AssetsActionWindow } from './assets-action-window';

export function ActionWindowHost() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);

  if (activeWorkspace === 'scene') {
    return <SceneTargetsActionWindow />;
  }

  if (
    activeWorkspace === 'product' ||
    activeWorkspace === 'mappings' ||
    activeWorkspace === 'preview' ||
    activeWorkspace === 'model'
  ) {
    return <ConfigCoverageActionWindow />;
  }

  if (activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera') {
    return <CameraActionWindow />;
  }

  if (activeWorkspace === 'assets' || (activeWorkspace as string) === 'materials') {
    return <AssetsActionWindow />;
  }

  return <SceneTargetsActionWindow />;
}
