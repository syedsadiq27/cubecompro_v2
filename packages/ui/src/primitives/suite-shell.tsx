'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Button } from './button';
import { ToastProvider } from './toast';
import { cn } from '../lib/cn';

const SIDEBAR_COLLAPSE_KEY = 'cubecom.suite.sidebar.collapsed';

const SidebarNavContext = createContext<{ onNavigate?: () => void }>({});

const SidebarCollapseContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
}>({
  collapsed: false,
  toggle: () => undefined,
});

export function useSidebarNavigate() {
  return useContext(SidebarNavContext).onNavigate;
}

export function useSidebarCollapsed() {
  return useContext(SidebarCollapseContext);
}

export function TopBar({
  start,
  end,
  className,
}: {
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'flex h-12 shrink-0 items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-pure)] px-6 select-none',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">{start}</div>
      <div className="flex shrink-0 items-center gap-2">{end}</div>
    </header>
  );
}

export function SuiteShell({
  children,
  sidebar,
  topBar,
  mobileTitle = 'CubeCom',
  mobileTrailing,
  className,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  topBar?: ReactNode;
  mobileTitle?: ReactNode;
  mobileTrailing?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <ToastProvider>
      <div
        className={cn(
          'flex h-dvh overflow-hidden bg-[var(--surface-pure)] select-none',
          className
        )}
      >
        <header className="fixed inset-x-0 top-0 z-30 flex h-11 items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-pure)] px-3 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
            className="ui:h-8 ui:w-8 ui:px-0"
          >
            <span className="flex w-4 flex-col gap-1">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[var(--ink)]">
              {mobileTitle}
            </p>
          </div>
          {mobileTrailing}
        </header>

        {navOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/25 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[min(16.5rem,88vw)] transform transition-[width,transform] duration-150 ease-out lg:static lg:z-auto lg:w-auto lg:translate-x-0',
            navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <SidebarNavContext.Provider
            value={{ onNavigate: () => setNavOpen(false) }}
          >
            {sidebar}
          </SidebarNavContext.Provider>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pt-11 lg:pt-0">
          {topBar}
          <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="absolute inset-0 flex min-h-0 flex-col overflow-y-auto has-[[data-fill-page]]:overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export function SidebarProductBadge({
  product,
  className,
}: {
  product: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wide text-white/85 uppercase',
        className
      )}
    >
      {product}
    </span>
  );
}

export function Sidebar({
  children,
  brandHref = '/',
  brandLabel = 'cubecom',
  brandMeta,
  product,
  widthClassName = 'lg:w-[220px]',
  collapsedWidthClassName = 'lg:w-[64px]',
  defaultCollapsed = false,
}: {
  children: ReactNode;
  brandHref?: string;
  brandLabel?: ReactNode;
  brandMeta?: ReactNode;
  product?: string;
  widthClassName?: string;
  collapsedWidthClassName?: string;
  defaultCollapsed?: boolean;
}) {
  const onNavigate = useSidebarNavigate();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const productBadge = product ? (
    <SidebarProductBadge product={product} />
  ) : (
    brandMeta
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
      if (stored === '1') setCollapsed(true);
      if (stored === '0') setCollapsed(false);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle }}>
      <aside
        data-suite-sidebar=""
        data-collapsed={collapsed ? 'true' : 'false'}
        data-suite-product={product || undefined}
        className={cn(
          'flex h-full w-full shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0E0F12] text-white transition-[width] duration-150 ease-out',
          collapsed ? collapsedWidthClassName : widthClassName
        )}
      >
        <div
          className={cn(
            'flex shrink-0 border-b border-white/10',
            collapsed
              ? 'flex-col items-center gap-2 px-2 py-3'
              : 'items-center justify-between gap-2 px-4 py-3.5'
          )}
        >
          {collapsed ? (
            <div className="flex flex-col items-center gap-1.5">
              <Link
                href={brandHref}
                onClick={onNavigate}
                title={product ? `cubecom ${product}` : 'cubecom'}
                className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-[11px] font-bold tracking-tight text-white"
              >
                C
              </Link>
              {productBadge}
            </div>
          ) : (
            <Link
              href={brandHref}
              onClick={onNavigate}
              className="flex min-w-0 items-center gap-2"
            >
              <span className="text-[17px] font-semibold tracking-tight text-white">
                {brandLabel}
              </span>
              {productBadge}
            </Link>
          )}
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
            onClick={toggle}
            className="flex h-7 w-7 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="flex w-3.5 flex-col gap-1">
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
            </span>
          </button>
        </div>
        {children}
      </aside>
    </SidebarCollapseContext.Provider>
  );
}

export function SidebarNav({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebarCollapsed();
  return (
    <nav
      className={cn(
        'min-h-0 flex-1 space-y-4 overflow-y-auto py-3',
        collapsed ? 'px-1.5' : 'px-3'
      )}
    >
      {children}
    </nav>
  );
}

function initials(name?: string, fallback = 'CC') {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}

export function WorkspaceSwitcher({
  name = 'Workspace',
  href,
  label = 'Switch',
  status,
}: {
  name?: string;
  href?: string;
  label?: string;
  status?: ReactNode;
}) {
  const onNavigate = useSidebarNavigate();
  const { collapsed } = useSidebarCollapsed();
  const mark = (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 text-[11px] font-semibold tracking-wide text-white/90">
      {initials(name)}
    </span>
  );

  if (collapsed) {
    const body = href ? (
      <Link
        href={href}
        onClick={onNavigate}
        title={name}
        className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-white/[0.08]"
      >
        {mark}
      </Link>
    ) : (
      <div className="flex items-center justify-center rounded-lg bg-white/[0.04] p-1.5" title={name}>
        {mark}
      </div>
    );
    return <div className="border-b border-white/10 px-1.5 py-2.5">{body}</div>;
  }

  const content = (
    <>
      {mark}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white">
          {name}
        </span>
        <span className="block text-[11px] text-white/45">{label}</span>
      </span>
      {status ?? <span className="text-[11px] text-white/40">▾</span>}
    </>
  );

  return (
    <div className="border-b border-white/10 px-3 py-2.5">
      {href ? (
        <Link
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.08]"
          title="Switch workspace"
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-2 py-1.5 text-white/90">
          {content}
        </div>
      )}
    </div>
  );
}

export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { collapsed } = useSidebarCollapsed();
  return (
    <div>
      {collapsed ? (
        <div className="mx-auto mb-1 h-px w-6 bg-white/10" aria-hidden />
      ) : (
        <p className="px-2.5 text-[11px] font-semibold tracking-[0.06em] text-white/40 uppercase">
          {title}
        </p>
      )}
      <ul className={cn(collapsed ? 'mt-0 space-y-0.5' : 'mt-1 space-y-0.5')}>
        {children}
      </ul>
    </div>
  );
}

export function SidebarItem({
  href,
  label,
  icon,
  badge,
  active: activeProp,
  match = 'prefix',
}: {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  match?: 'prefix' | 'exact';
}) {
  const onNavigate = useSidebarNavigate();
  const { collapsed } = useSidebarCollapsed();
  const pathname = usePathname();
  const active =
    activeProp ??
    (match === 'exact'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        title={label}
        className={cn(
          'flex items-center rounded-lg text-[13px] font-medium transition-all duration-150',
          collapsed
            ? 'justify-center px-0 py-2'
            : 'justify-between gap-2 px-2.5 py-1.5',
          active
            ? 'bg-white/[0.12] text-white shadow-xs'
            : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
        )}
      >
        <span
          className={cn(
            'flex min-w-0 items-center',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
        >
          {icon ? (
            <span
              className={cn(
                'shrink-0',
                active ? 'text-white' : 'text-white/50'
              )}
            >
              {icon}
            </span>
          ) : collapsed ? (
            <span className="text-[11px] font-semibold uppercase">
              {label.slice(0, 1)}
            </span>
          ) : null}
          {!collapsed ? <span className="truncate">{label}</span> : null}
        </span>
        {!collapsed && badge != null ? (
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/70">
            {badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export function AccountFooter({
  userName,
  subtitle = 'Account',
  accountHref,
  signOutAction,
  signOutLabel = 'Sign out',
  compact,
}: {
  userName: string;
  subtitle?: ReactNode;
  accountHref?: string;
  signOutAction?: (formData: FormData) => void | Promise<void>;
  signOutLabel?: string;
  compact?: boolean;
}) {
  const onNavigate = useSidebarNavigate();
  const { collapsed } = useSidebarCollapsed();
  const isCompact = compact ?? collapsed;
  const avatar = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
      {initials(userName, 'U')}
    </span>
  );

  if (isCompact) {
    return (
      <div className="shrink-0 border-t border-white/10 px-1.5 py-3">
        {accountHref ? (
          <Link
            href={accountHref}
            onClick={onNavigate}
            title={`${userName} · ${typeof subtitle === 'string' ? subtitle : 'Account'}`}
            className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-white/[0.08]"
          >
            {avatar}
          </Link>
        ) : (
          <div
            className="flex items-center justify-center p-1.5"
            title={`${userName} · Signed in`}
          >
            {avatar}
          </div>
        )}
      </div>
    );
  }

  const identity = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-white">{userName}</p>
        <p className="truncate text-[11px] text-white/50">{subtitle}</p>
      </div>
      <span className="text-[12px] text-white/40">▾</span>
    </>
  );

  return (
    <div className="shrink-0 space-y-2 border-t border-white/10 px-3 py-3">
      {accountHref ? (
        <Link
          href={accountHref}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.08]"
        >
          {identity}
        </Link>
      ) : (
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          {identity}
        </div>
      )}

      {signOutAction ? (
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <span aria-hidden>↳</span>
            <span>{signOutLabel}</span>
          </button>
        </form>
      ) : null}
    </div>
  );
}
