'use client';

import Link from 'next/link';
import { Wordmark } from '@repo/ui/wordmark';
import {
  footerCompany,
  footerDevelopers,
  footerLegal,
  footerProduct,
  type NavLink,
} from '@/lib/navigation';

function FooterLink({ item }: { item: NavLink }) {
  if (item.external) {
    return (
      <a href={item.href} className="hover:text-white" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className="hover:text-white">
      {item.label}
    </Link>
  );
}

function FooterGroup({
  title,
  items,
}: {
  title: string;
  items: NavLink[];
}) {
  return (
    <details className="footer-nav-group group border-b border-white/10 md:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[11px] font-medium tracking-[0.12em] text-white/40 uppercase md:pointer-events-none md:cursor-default md:py-0 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="font-mono text-white/35 transition group-open:rotate-45 md:hidden" aria-hidden>
          +
        </span>
      </summary>
      <ul className="space-y-2 pb-4 text-[15px] text-white/65 md:mt-3 md:pb-0 md:text-sm">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2.4fr)] lg:gap-12">
          <div>
            <Wordmark size="lg" showPro />
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/55 md:text-sm">
              Product configuration infrastructure for visual commerce.
            </p>
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-8">
            <FooterGroup title="Product" items={footerProduct} />
            <FooterGroup title="Developers" items={footerDevelopers} />
            <FooterGroup title="Company" items={footerCompany} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between md:mt-10 md:pt-6">
          <p>© {new Date().getFullYear()} CubeCom Pro</p>
          <ul className="flex gap-5">
            {footerLegal.map((item) => (
              <li key={item.href}>
                <FooterLink item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
