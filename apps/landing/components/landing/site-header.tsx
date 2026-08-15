'use client';

import { Button, Typography, Wordmark } from '@repo/ui';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import {
  bookSessionCta,
  developersNav,
  docsNav,
  industriesNav,
  integrationsNav,
  pricingNav,
  solutionsNav,
  type NavLink,
} from '@/lib/navigation';

function NavItemLink({
  item,
  className,
  onNavigate,
}: {
  item: NavLink;
  className: string;
  onNavigate?: () => void;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="type-nav inline-flex items-center gap-1 text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span className="text-[10px] opacity-70" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full left-0 z-50 min-w-[15.5rem] pt-2"
        >
          <ul className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] py-2 shadow-md">
            {items.map((item) => (
              <li key={item.href} role="none">
                <NavItemLink
                  item={item}
                  onNavigate={() => setOpen(false)}
                  className="block px-3.5 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)]/80 bg-[var(--canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link href="/" aria-label="CubeCom Pro home" onClick={close}>
          <Wordmark size="nav" showPro />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          <NavDropdown label="Solutions" items={solutionsNav} />
          <NavDropdown label="Industries" items={industriesNav} />
          <NavDropdown label="Integrations" items={integrationsNav} />
          <NavDropdown label="Developers" items={developersNav} />
          <Link
            href={pricingNav.href}
            className="type-nav text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
          >
            {pricingNav.label}
          </Link>
          <Link
            href={docsNav.href}
            className="type-nav text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
          >
            {docsNav.label}
          </Link>
          <Button as={Link} href={bookSessionCta.href} variant="primary" size="nav">
            {bookSessionCta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="type-nav text-[var(--text-secondary)] xl:hidden"
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
          className="max-h-[min(70vh,32rem)] overflow-y-auto border-t border-[var(--line)] px-5 py-4 xl:hidden"
        >
          <div className="flex flex-col gap-5">
            <MobileGroup title="Solutions">
              {solutionsNav.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  onNavigate={close}
                  className="py-1.5 text-sm text-[var(--text-secondary)]"
                />
              ))}
            </MobileGroup>
            <MobileGroup title="Industries">
              {industriesNav.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  onNavigate={close}
                  className="py-1.5 text-sm text-[var(--text-secondary)]"
                />
              ))}
            </MobileGroup>
            <MobileGroup title="Integrations">
              {integrationsNav.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  onNavigate={close}
                  className="py-1.5 text-sm text-[var(--text-secondary)]"
                />
              ))}
            </MobileGroup>
            <MobileGroup title="Developers">
              {developersNav.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  onNavigate={close}
                  className="py-1.5 text-sm text-[var(--text-secondary)]"
                />
              ))}
            </MobileGroup>
            <div className="flex flex-col gap-1 border-t border-[var(--line)] pt-3">
              <NavItemLink
                item={pricingNav}
                onNavigate={close}
                className="py-1.5 text-sm text-[var(--text-secondary)]"
              />
              <NavItemLink
                item={docsNav}
                onNavigate={close}
                className="py-1.5 text-sm text-[var(--text-secondary)]"
              />
              <NavItemLink
                item={bookSessionCta}
                onNavigate={close}
                className="py-1.5 text-sm font-medium text-[var(--ink)]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Typography variant="label">{title}</Typography>
      <div className="mt-1.5 flex flex-col">{children}</div>
    </div>
  );
}
