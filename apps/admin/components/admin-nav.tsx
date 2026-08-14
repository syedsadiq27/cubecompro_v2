'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from '@repo/ui/wordmark';
import { logoutAction } from '@/actions/auth';

const PRIMARY = [
  { href: '/organizations', label: 'Organizations' },
  { href: '/users', label: 'Users' },
];

const GROUPS = [
  {
    label: 'Commercial',
    links: [
      { href: '/plans', label: 'Plans' },
      { href: '/entitlements', label: 'Entitlements' },
    ],
  },
  {
    label: 'Operations',
    links: [
      { href: '/leads', label: 'Leads' },
      { href: '/usage', label: 'Usage' },
      { href: '/audit', label: 'Audit' },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      className={`type-nav block rounded-md px-2.5 py-1.5 ${
        active
          ? 'bg-[var(--brand-soft)] font-medium text-[var(--ink)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminNav({ userName }: { userName: string }) {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--line)] px-4">
        <Wordmark size="sm" />
        <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">
          Admin
        </span>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {PRIMARY.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>
        {GROUPS.map((group) => (
          <div key={group.label} className="mt-5">
            <p className="type-nav-label px-2.5 pb-1.5">{group.label}</p>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-[var(--line)] px-3 py-3">
        <p className="truncate text-[12px] font-medium text-[var(--ink)]">
          {userName}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="type-meta mt-0.5 text-left hover:text-[var(--ink)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
