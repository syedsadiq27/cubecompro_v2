'use client';

import Link from 'next/link';
import { AccountFooter, SidebarProductBadge } from '@repo/ui';
import {
  AssetsIcon,
  CameraIcon,
  ConfigIcon,
  MenuIcon,
  SceneIcon,
} from '@/components/editor/icons';
import { useEditorStore, type EditorWorkspace } from '@/lib/editor-store';
import { RailItem } from './rail-item';

const NAV_ITEMS: Array<{
  id: EditorWorkspace;
  label: string;
  title: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'scene',
    label: 'Scene',
    title: 'Scene Outliner & 3D Objects',
    icon: <SceneIcon size="md" />,
  },
  {
    id: 'product',
    label: 'Config',
    title: 'Product Choices & Visual Rules',
    icon: <ConfigIcon size="md" />,
  },
  {
    id: 'cameras',
    label: 'Camera',
    title: 'Camera Presets & View Controls',
    icon: <CameraIcon size="md" />,
  },
  {
    id: 'materials',
    label: 'Assets',
    title: '3D Models, Materials & Textures',
    icon: <AssetsIcon size="md" />,
  },
];

function isRailActive(
  activeWorkspace: EditorWorkspace,
  id: EditorWorkspace
): boolean {
  if (activeWorkspace === id) return true;
  if (
    id === 'product' &&
    (activeWorkspace === 'mappings' ||
      activeWorkspace === 'model' ||
      activeWorkspace === 'preview')
  ) {
    return true;
  }
  if (id === 'cameras' && (activeWorkspace as string) === 'camera') {
    return true;
  }
  if (id === 'materials' && activeWorkspace === 'assets') {
    return true;
  }
  return false;
}

export function WorkspaceRail({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useEditorStore(
    (state) => state.setActiveWorkspace
  );
  const userName = useEditorStore((state) => state.userName) || 'Studio User';
  const graphAuth = useEditorStore((state) => state.graphAuth);

  return (
    <aside
      data-suite-sidebar=""
      data-collapsed={collapsed ? 'true' : 'false'}
      className="flex w-[64px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0E0F12] text-white select-none"
    >
      <div className="flex shrink-0 flex-col items-center gap-2 border-b border-white/10 px-2 py-3">
        <div className="flex flex-col items-center gap-1.5">
          <Link
            href="/"
            title="cubecom editor"
            className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-[11px] font-bold tracking-tight text-white"
          >
            C
          </Link>
          <SidebarProductBadge product="editor" />
        </div>
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={collapsed}
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <MenuIcon size="sm" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-1.5 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <RailItem
                active={isRailActive(activeWorkspace, item.id)}
                label={item.label}
                title={item.title}
                icon={item.icon}
                compact={collapsed}
                onClick={() => setActiveWorkspace(item.id)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <AccountFooter
        userName={userName}
        subtitle={graphAuth ? 'Signed in' : 'Local session'}
        compact
      />
    </aside>
  );
}
