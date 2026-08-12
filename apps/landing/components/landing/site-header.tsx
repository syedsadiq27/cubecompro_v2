'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wordmark } from '@repo/ui/wordmark';
import { nav } from '@/lib/content';

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)]/80 bg-[var(--canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" aria-label="CubeCom Pro home">
          <Wordmark size="nav" showPro />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="type-nav text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="rounded-lg bg-[var(--ink)] px-3.5 py-2 text-xs font-medium tracking-[0.04em] text-white transition hover:bg-[var(--ink)]/90"
          >
            Live demo
          </Link>
        </nav>

        <button
          type="button"
          className="type-nav text-[var(--text-secondary)] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--line)] px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-[var(--text-secondary)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-2 py-2 text-sm font-medium text-[var(--ink)]"
            >
              Live demo
            </Link>
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-[var(--ink)]"
            >
              Book a session
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
