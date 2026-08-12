'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CubeWordmark } from './brand';
import { NAV } from '@/lib/nav';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-[var(--canvas)]">
      <aside className="sticky top-0 flex h-dvh w-[260px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-pure)]">
                <div className="flex h-[88px] shrink-0 items-center px-6">
          <Link href="/" className="block">
            <CubeWordmark size="nav" showPro />
          </Link>
        </div>

        <nav className="min-h-0 flex-1 space-y-7 overflow-y-auto px-3 pb-6">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="type-nav-label px-3">{section.title}</p>
              <ul className="mt-1.5 space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`type-nav relative block px-3 py-2 transition-colors duration-150 ${
                          active
                            ? 'cube-nav-active text-[var(--ink)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <span className="relative z-[1]">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--surface-pure)]">
        <div className="mx-auto max-w-3xl px-10 py-12">{children}</div>
      </main>
    </div>
  );
}
