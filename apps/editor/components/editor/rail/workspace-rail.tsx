'use client';

import Link from 'next/link';
import { AccountFooter, SidebarProductBadge } from '@repo/ui';
import { useEditorStore, type EditorWorkspace } from '@/lib/editor-store';
import { RailItem } from './rail-item';

const NAV_GROUPS: Array<{
  group: string;
  items: Array<{ id: EditorWorkspace; label: string; icon: React.ReactNode }>;
}> = [
  {
    group: 'AUTHOR',
    items: [
      {
        id: 'scene',
        label: 'Scene',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        ),
      },
      {
        id: 'objects',
        label: 'Objects',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        id: 'materials',
        label: 'Materials',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'CONFIGURE',
    items: [
      {
        id: 'mappings',
        label: 'Mappings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="12" r="3" />
            <line x1="8.5" y1="7.5" x2="15.5" y2="10.5" />
            <line x1="8.5" y1="16.5" x2="15.5" y2="13.5" />
          </svg>
        ),
      },
      {
        id: 'behaviors',
        label: 'Behaviors',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'PRESENT',
    items: [
      {
        id: 'cameras',
        label: 'Cameras',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        ),
      },
      {
        id: 'lights',
        label: 'Lights',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
          </svg>
        ),
      },
      {
        id: 'environment',
        label: 'Environment',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'TEST',
    items: [
      {
        id: 'preview',
        label: 'Preview',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ),
      },
    ],
  },
];

export function WorkspaceRail({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);
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
          <span className="flex w-3.5 flex-col gap-1">
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
          </span>
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto px-1.5 py-3">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group}>
            {collapsed ? (
              <div className="mx-auto mb-1 h-px w-6 bg-white/10" aria-hidden />
            ) : (
              <p className="mb-1 px-1 text-center font-mono text-[8px] font-bold tracking-wider text-white/40">
                {grp.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {grp.items.map((item) => (
                <li key={item.id}>
                  <RailItem
                    active={activeWorkspace === item.id}
                    label={item.label}
                    icon={item.icon}
                    compact={collapsed}
                    onClick={() => setActiveWorkspace(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <AccountFooter
        userName={userName}
        subtitle={graphAuth ? 'Signed in' : 'Local session'}
        compact
      />
    </aside>
  );
}
