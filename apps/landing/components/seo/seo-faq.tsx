import type { SeoFaqItem } from '@/lib/seo-pages';

export function SeoFaq({
  items,
  title = 'Frequently asked questions',
  description,
}: {
  items: SeoFaqItem[];
  title?: string;
  description?: string;
}) {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm text-[var(--text-muted)]">FAQ</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.65rem,3vw,2.35rem)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
        <dl className="mt-12 max-w-3xl space-y-8">
          {items.map((item) => (
            <div key={item.question} className="border-t border-[var(--line)] pt-6">
              <dt className="type-section text-[20px] md:text-[22px]">
                {item.question}
              </dt>
              <dd className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
