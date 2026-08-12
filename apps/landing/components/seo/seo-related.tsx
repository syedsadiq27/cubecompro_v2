import Link from 'next/link';
import type { SeoPageDef } from '@/lib/seo-pages';

export function SeoRelated({ page }: { page: SeoPageDef }) {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm text-[var(--text-muted)]">Keep reading</p>
        <h2 className="type-page mt-3 text-[clamp(1.65rem,3vw,2.35rem)]">
          Related CubeCom pages
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {page.related.map((item) => (
            <li key={item.href} className="border-t border-[var(--border-strong)] pt-5">
              <Link
                href={item.href}
                className="type-section text-[18px] transition hover:text-[var(--text-secondary)]"
              >
                {item.label}
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.blurb}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
