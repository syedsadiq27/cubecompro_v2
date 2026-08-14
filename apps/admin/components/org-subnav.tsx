'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { slug: '', label: 'Overview' },
  { slug: 'members', label: 'Members' },
  { slug: 'plan', label: 'Plan' },
  { slug: 'entitlements', label: 'Entitlements' },
  { slug: 'usage', label: 'Usage' },
  { slug: 'overrides', label: 'Overrides' },
];

export function OrgSubnav({ organizationId }: { organizationId: string }) {
  const pathname = usePathname();
  const base = `/organizations/${organizationId}`;

  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-[var(--line)] px-4 md:mx-0 md:flex-wrap md:px-0">
      {TABS.map((tab) => {
        const href = tab.slug ? `${base}/${tab.slug}` : base;
        const active = tab.slug
          ? pathname === href || pathname.startsWith(`${href}/`)
          : pathname === base;
        return (
          <Link
            key={tab.label}
            href={href}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2 text-[13px] ${
              active
                ? 'border-[var(--ink)] font-medium text-[var(--ink)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
