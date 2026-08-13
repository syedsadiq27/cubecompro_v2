'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  getDocsScroller,
  readActiveDocsId,
  scrollDocsToId,
} from '@/lib/docs-scroll';

type TocItem = { id: string; label: string };

export function PageToc() {
  const pathname = usePathname();
  const [title, setTitle] = useState('');
  const [titleId, setTitleId] = useState('');
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const lockRef = useRef<string | null>(null);

  useEffect(() => {
    const root = document.querySelector('[data-docs-article]');
    const scroller = getDocsScroller();
    if (!root || !scroller) {
      setItems([]);
      setTitle('');
      setTitleId('');
      setActiveId('');
      return;
    }

    const h1 = root.querySelector<HTMLElement>('[data-docs-title]');
    const nextTitle = h1?.textContent?.trim() ?? '';
    const nextTitleId = h1?.id ?? '';
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-docs-section]')
    ).map((el) => ({
      id: el.id,
      label: el.dataset.docsSection ?? el.id,
    }));

    setTitle(nextTitle);
    setTitleId(nextTitleId);
    setItems(sections);

    const ids = [
      ...(nextTitleId ? [nextTitleId] : []),
      ...sections.map((item) => item.id),
    ];

    const hash = window.location.hash.slice(1);
    if (!hash) {
      scroller.scrollTop = 0;
    }

    const sync = () => {
      if (lockRef.current) {
        setActiveId(lockRef.current);
        return;
      }
      setActiveId(readActiveDocsId(ids));
    };

    sync();

    if (hash && ids.includes(hash)) {
      lockRef.current = hash;
      setActiveId(hash);
      scrollDocsToId(hash);
      window.setTimeout(() => {
        lockRef.current = null;
        sync();
      }, 400);
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  function jump(id: string) {
    lockRef.current = id;
    setActiveId(id);
    scrollDocsToId(id);
    window.setTimeout(() => {
      if (lockRef.current === id) lockRef.current = null;
    }, 450);
  }

  if (items.length === 0) {
    return <aside className="hidden w-[220px] shrink-0 xl:block" />;
  }

  return (
    <aside className="hidden h-full w-[220px] shrink-0 overflow-y-auto border-l border-[var(--line)] bg-[var(--surface-pure)] py-12 pr-6 pl-1 xl:block">
      <nav>
        {titleId ? (
          <button
            type="button"
            onClick={() => jump(titleId)}
            className={`type-nav mb-3 block text-left ${
              activeId === titleId
                ? 'font-medium text-[var(--ink)]'
                : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            ↑ {title}
          </button>
        ) : null}
        <ul className="relative space-y-0.5 border-l border-[var(--line)]">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => jump(item.id)}
                  className={`type-nav relative -ml-px block w-full border-l-2 py-1.5 pl-3 text-left transition-colors ${
                    active
                      ? 'border-[var(--stage-violet)] font-medium text-[var(--ink)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--ink)]'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
