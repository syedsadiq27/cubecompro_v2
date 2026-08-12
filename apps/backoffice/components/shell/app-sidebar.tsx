'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from '@repo/ui/wordmark';
import { logoutAction } from '@/actions/auth';

type NavItem = { href: string; label: string };

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="type-nav-label px-2">{title}</p>
      <ul className="mt-1.5 space-y-0.5">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`relative block rounded-md px-2.5 py-1.5 text-[13px] font-normal ${
                  active
                    ? 'bo-nav-active'
                    : 'text-[var(--bo-ink)]/70 hover:bg-black/[0.03] hover:text-[var(--bo-ink)]'
                }`}
              >
                <span className="relative z-[1]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function projectInitials(name?: string) {
  if (!name) return 'P';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}

export function AppSidebar({
  projectId,
  projectName,
  userName,
  onNavigate,
}: {
  projectId?: string;
  projectName?: string;
  userName: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const catalog: NavItem[] = projectId
    ? [
        { href: `/${projectId}/products`, label: 'Products' },
        { href: `/${projectId}/categories`, label: 'Categories' },
        { href: `/${projectId}/library`, label: 'Assets' },
      ]
    : [];

  const commerce: NavItem[] = projectId
    ? [
        { href: `/${projectId}/commerce/mappings`, label: 'Mappings' },
        { href: `/${projectId}/settings/commerce`, label: 'Channels' },
        { href: `/${projectId}/commerce/pricing`, label: 'Pricing' },
      ]
    : [];

  const experience: NavItem[] = projectId
    ? [
        { href: `/${projectId}/products`, label: 'Configurations' },
        { href: `/${projectId}/library/objects`, label: '3D Studio' },
      ]
    : [];

  const operations: NavItem[] = projectId
    ? [
        { href: `/${projectId}/workflow`, label: 'Workflow' },
        { href: `/${projectId}/dashboard`, label: 'Analytics' },
      ]
    : [];

  const platform: NavItem[] = projectId
    ? [
        { href: `/${projectId}/settings/cms`, label: 'Integrations' },
        { href: `/${projectId}/settings`, label: 'Settings' },
      ]
    : [];

  return (
    <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden border-r border-[var(--bo-line)] bg-[var(--bo-panel)] lg:w-[220px]">
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--bo-line)] px-3 py-4">
        <div className="min-w-0 flex-1">
          <Link href="/projects" onClick={onNavigate} className="block px-1">
            <Wordmark size="nav" showPro />
          </Link>
          <Link
            href="/projects"
            onClick={onNavigate}
            className="mt-3 flex items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-black/[0.03]"
            title="Switch project"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[11px] font-semibold tracking-wide text-[var(--bo-ink)]">
              {projectInitials(projectName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-[var(--bo-ink)]">
                {projectName || 'Select project'}
              </span>
              <span className="type-meta block">Switch project</span>
            </span>
            <span className="text-[10px] text-[var(--bo-muted)]">▾</span>
          </Link>
        </div>
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onNavigate}
          className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--bo-muted)] hover:bg-black/[0.04] hover:text-[var(--bo-ink)] lg:hidden"
        >
          ✕
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2.5 py-4">
        {catalog.length > 0 ? (
          <NavSection
            title="Catalog"
            items={catalog}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
        {commerce.length > 0 ? (
          <NavSection
            title="Commerce"
            items={commerce}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
        {experience.length > 0 ? (
          <NavSection
            title="Experience"
            items={experience}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
        {operations.length > 0 ? (
          <NavSection
            title="Operations"
            items={operations}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
        {platform.length > 0 ? (
          <NavSection
            title="Platform"
            items={platform}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
      </nav>

      <div className="shrink-0 border-t border-[var(--bo-line)] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[var(--bo-ink)]">
              {userName}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--bo-muted)]">
              <Link
                href="/accounts/profile"
                onClick={onNavigate}
                className="hover:text-[var(--bo-ink)]"
              >
                Account
              </Link>
              <span>·</span>
              <Link
                href="/accounts/members"
                onClick={onNavigate}
                className="hover:text-[var(--bo-ink)]"
              >
                Org
              </Link>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md px-1.5 py-0.5 text-[12px] text-[var(--bo-muted)] hover:bg-black/[0.04] hover:text-[var(--bo-ink)]"
              title="Sign out"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
