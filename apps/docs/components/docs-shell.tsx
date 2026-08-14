'use client';

import Link from 'next/link';
import { CubeWordmark } from './brand';
import { DocsNav } from './docs-nav';
import { PageToc } from './page-toc';

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--canvas)]">
      <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-pure)]">
        <div className="flex h-[72px] shrink-0 flex-col justify-center gap-1 px-5">
          <Link href="/" className="block">
            <CubeWordmark size="nav" showPro />
          </Link>
          <a
            href="https://cubecompro.com"
            className="type-meta hover:text-[var(--ink)]"
          >
            ← CubeCom Pro
          </a>
        </div>
        <DocsNav />
      </aside>

      <article
        data-docs-article
        data-docs-scroll
        className="min-w-0 flex-1 overflow-y-auto px-10 py-12 lg:px-14"
      >
        <div className="mx-auto max-w-3xl">{children}</div>
      </article>
      <PageToc />
    </div>
  );
}
