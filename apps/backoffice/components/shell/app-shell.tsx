'use client';

import { logoutAction } from '@/actions/auth';
import {
  AccountFooter,
  BackofficeShell,
  Sidebar,
  SidebarItem,
  SidebarNav,
  SidebarSection,
  WorkspaceSwitcher,
} from '@/components/bo';
import {
  BarChartIcon,
  BoxIcon,
  BranchIcon,
  FolderIcon,
  LayersIcon,
  LinkIcon,
  MediaIcon,
  PuzzleIcon,
  SettingsIcon,
  StoreIcon,
  TagIcon,
} from '@/components/bo/icons';
import type { ReactNode } from 'react';

type NavItem = { href: string; label: string; icon: ReactNode };

function ProjectSidebar({
  projectId,
  projectName,
  userName,
}: {
  projectId?: string;
  projectName?: string;
  userName: string;
}) {
  const catalog: NavItem[] = projectId
    ? [
        {
          href: `/${projectId}/products`,
          label: 'Products',
          icon: <BoxIcon size={16} />,
        },
        {
          href: `/${projectId}/categories`,
          label: 'Categories',
          icon: <FolderIcon size={16} />,
        },
        {
          href: `/${projectId}/library`,
          label: 'Assets',
          icon: <MediaIcon size={16} />,
        },
      ]
    : [];

  const commerce: NavItem[] = projectId
    ? [
        {
          href: `/${projectId}/commerce/mappings`,
          label: 'Mappings',
          icon: <LinkIcon size={16} />,
        },
        {
          href: `/${projectId}/settings/commerce`,
          label: 'Channels',
          icon: <StoreIcon size={16} />,
        },
        {
          href: `/${projectId}/commerce/pricing`,
          label: 'Pricing',
          icon: <TagIcon size={16} />,
        },
      ]
    : [];

  const experience: NavItem[] = projectId
    ? [
        {
          href: `/${projectId}/experience/rules`,
          label: 'Configurations',
          icon: <LayersIcon size={16} />,
        },
      ]
    : [];

  const operations: NavItem[] = projectId
    ? [
        {
          href: `/${projectId}/workflow`,
          label: 'Workflow',
          icon: <BranchIcon size={16} />,
        },
        {
          href: `/${projectId}/dashboard`,
          label: 'Analytics',
          icon: <BarChartIcon size={16} />,
        },
      ]
    : [];

  const platform: NavItem[] = projectId
    ? [
        {
          href: `/${projectId}/settings/cms`,
          label: 'Integrations',
          icon: <PuzzleIcon size={16} />,
        },
        {
          href: `/${projectId}/components`,
          label: 'Components',
          icon: <LayersIcon size={16} />,
        },
        {
          href: `/${projectId}/settings`,
          label: 'Settings',
          icon: <SettingsIcon size={16} />,
        },
      ]
    : [];

  return (
    <Sidebar product="backoffice">
      <WorkspaceSwitcher name={projectName || 'Showroom'} />
      <SidebarNav>
        {catalog.length > 0 ? (
          <SidebarSection title="Catalog">
            {catalog.map((item) => (
              <SidebarItem
                key={`${item.label}:${item.href}`}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </SidebarSection>
        ) : null}
        {commerce.length > 0 ? (
          <SidebarSection title="Commerce">
            {commerce.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </SidebarSection>
        ) : null}
        {experience.length > 0 ? (
          <SidebarSection title="Experience">
            {experience.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </SidebarSection>
        ) : null}
        {operations.length > 0 ? (
          <SidebarSection title="Operations">
            {operations.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </SidebarSection>
        ) : null}
        {platform.length > 0 ? (
          <SidebarSection title="Platform">
            {platform.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </SidebarSection>
        ) : null}
      </SidebarNav>
      <AccountFooter
        userName={userName}
        orgName="Default Org"
        signOutAction={logoutAction}
      />
    </Sidebar>
  );
}

export function AppShell({
  children,
  projectId,
  projectName,
  userName,
  supportSession,
}: {
  children: React.ReactNode;
  projectId?: string;
  projectName?: string;
  userName: string;
  supportSession?: {
    actingAdmin: string;
    sessionId: string;
    expiresAt: string;
  } | null;
}) {
  return (
    <BackofficeShell
      projectName={projectName}
      sidebar={
        <ProjectSidebar
          projectId={projectId}
          projectName={projectName}
          userName={userName}
        />
      }
    >
      {supportSession && (
        <div className="bg-[#665CFF] text-white px-6 py-2 flex items-center justify-between text-[12px] font-medium shadow-xs select-none sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>
              ELEVATED SUPPORT SESSION: Acting as Admin (<strong>{supportSession.actingAdmin}</strong>) &middot; Session: {supportSession.sessionId}
            </span>
          </div>
          <a
            href="http://admin.cubecompro.com:3002/organizations"
            className="rounded bg-white/20 hover:bg-white/30 px-2.5 py-0.5 text-[11px] font-bold text-white transition-colors cursor-pointer"
          >
            Exit Support Mode ✕
          </a>
        </div>
      )}
      {children}
    </BackofficeShell>
  );
}

/** @deprecated Use Sidebar primitives from `@/components/bo`. */
export { ProjectSidebar as AppSidebar };
