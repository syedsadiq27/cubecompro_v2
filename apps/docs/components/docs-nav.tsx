'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNavGroup, NAV, type NavLink } from '@/lib/nav';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 text-[var(--text-muted)] transition-transform duration-150 ${
        open ? 'rotate-90' : ''
      }`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 2.5 8 6 4 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hrefsInSection(
  items: (typeof NAV)[number]['items']
): string[] {
  return items.flatMap((item) =>
    isNavGroup(item) ? item.children.map((child) => child.href) : [item.href]
  );
}

function keysForPath(pathname: string) {
  const keys: string[] = [];
  for (const section of NAV) {
    const hrefs = hrefsInSection(section.items);
    if (hrefs.includes(pathname)) {
      keys.push(section.title);
      for (const item of section.items) {
        if (isNavGroup(item) && item.children.some((c) => c.href === pathname)) {
          keys.push(`${section.title}:${item.label}`);
        }
      }
    }
  }
  return keys;
}

function NavLinkItem({
  item,
  pathname,
  nested,
}: {
  item: NavLink;
  pathname: string;
  nested?: boolean;
}) {
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`type-nav block rounded-lg px-3 py-1.5 transition-colors duration-150 ${
        nested ? 'pl-3' : ''
      } ${
        active
          ? 'bg-[var(--brand-soft)] font-medium text-[var(--ink)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
      }`}
    >
      {item.label}
    </Link>
  );
}

export function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Set<string>>(() => new Set(keysForPath(pathname)));

  useEffect(() => {
    setOpen((prev) => {
      const next = new Set(prev);
      keysForPath(pathname).forEach((key) => next.add(key));
      return next;
    });
  }, [pathname]);

  function toggle(key: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-8">
      {NAV.map((section) => {
        const only = section.items[0];
        if (
          section.items.length === 1 &&
          only &&
          !isNavGroup(only)
        ) {
          return (
            <NavLinkItem
              key={section.title}
              item={{ href: only.href, label: section.title }}
              pathname={pathname}
            />
          );
        }

        const sectionOpen = open.has(section.title);
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => toggle(section.title)}
              aria-expanded={sectionOpen}
              className="type-nav flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[var(--ink)] hover:bg-[var(--surface)]"
            >
              <Chevron open={sectionOpen} />
              <span className="font-medium">{section.title}</span>
            </button>
            {sectionOpen ? (
              <ul className="mt-0.5 ml-5 space-y-0.5 border-l border-[var(--line)] pl-2">
                {section.items.map((item) => {
                  if (isNavGroup(item)) {
                    const groupKey = `${section.title}:${item.label}`;
                    const groupOpen = open.has(groupKey);
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => toggle(groupKey)}
                          aria-expanded={groupOpen}
                          className="type-nav flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                        >
                          <Chevron open={groupOpen} />
                          <span>{item.label}</span>
                        </button>
                        {groupOpen ? (
                          <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-[var(--line)] pl-2">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <NavLinkItem
                                  item={child}
                                  pathname={pathname}
                                  nested
                                />
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <NavLinkItem item={item} pathname={pathname} />
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
