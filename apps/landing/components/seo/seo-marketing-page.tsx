import Link from 'next/link';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SeoCta } from './seo-cta';
import { SeoFaq } from './seo-faq';
import { SeoJsonLd } from './seo-json-ld';
import { SeoPageShell } from './seo-page-shell';
import { SeoRelated } from './seo-related';
import { SeoSection } from './seo-section';

export function SeoMarketingPage({ path }: { path: string }) {
  const page = getSeoPage(path);
  const body = getSeoBody(path);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <SeoPageShell page={page}>
        {body.sections.map((section) => (
          <SeoSection
            key={section.title}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            tone={section.tone}
          >
            {section.kind === 'bullets' ? (
              <ul className="grid max-w-4xl gap-6 md:grid-cols-2">
                {section.bullets.map((item) => (
                  <li
                    key={item}
                    className="border-t border-[var(--line)] pt-4 text-base leading-relaxed text-[var(--text-secondary)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.kind === 'columns' ? (
              <div className="grid max-w-4xl gap-10 md:grid-cols-2">
                {section.columns.map((column) => (
                  <div key={column.title}>
                    <h3 className="type-section text-[18px]">{column.title}</h3>
                    <ul className="mt-4 space-y-3 text-[var(--text-secondary)]">
                      {column.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
            {section.kind === 'links' ? (
              <ul className="flex flex-wrap gap-3">
                {section.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block rounded-lg border border-[var(--border-strong)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </SeoSection>
        ))}
        <SeoFaq
          items={body.faqs}
          title={body.faqTitle}
          description={body.faqDescription}
        />
        <SeoRelated page={page} />
        <SeoCta {...body.cta} />
      </SeoPageShell>
    </>
  );
}
