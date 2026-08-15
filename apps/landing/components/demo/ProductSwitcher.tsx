'use client';

import Link from 'next/link';

type ProductSwitcherProps = {
  active: 'sofa' | 'tshirt';
};

export function ProductSwitcher({ active }: ProductSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--border-strong)] bg-[var(--surface-pure)] p-0.5 text-xs font-medium shadow-sm">
      <Link
        href="/demo"
        className={`rounded-md px-3 py-1.5 transition ${
          active === 'sofa'
            ? 'bg-[var(--ink)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--ink)]'
        }`}
      >
        Sofa
      </Link>
      <Link
        href="/demo/tshirt"
        className={`rounded-md px-3 py-1.5 transition ${
          active === 'tshirt'
            ? 'bg-[var(--ink)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--ink)]'
        }`}
      >
        Tee
      </Link>
    </div>
  );
}
