'use client';

import type { SeoFaqItem } from '@/lib/seo-pages';

export function SeoFaq({
  items,
  title = 'Frequently asked questions',
  description,
  compact = false,
}: {
  items: SeoFaqItem[];
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div
        className={`mx-auto max-w-[90rem] px-5 md:px-8 ${
          compact ? 'py-12 md:py-14' : 'py-16 md:py-24'
        }`}
      >
        <p className="text-sm text-[var(--text-muted)]">FAQ</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.65rem,3vw,2.35rem)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
        <div className={`max-w-3xl ${compact ? 'mt-8' : 'mt-12'} space-y-0`}>
          {items.map((item) => (
            <details
              key={item.question}
              className="group border-t border-[var(--line)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left type-section text-[17px] md:text-[18px] [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  className="shrink-0 font-mono text-sm text-[var(--text-muted)] transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
