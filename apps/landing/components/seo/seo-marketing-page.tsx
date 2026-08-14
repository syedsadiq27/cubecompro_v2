import Link from 'next/link';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SeoCta } from './seo-cta';
import { SeoDemoEmbed } from './seo-demo-embed';
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
              <div
                className={`grid max-w-5xl gap-10 ${
                  section.columns.length > 2
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-2'
                }`}
              >
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
                {section.links.map((item) => {
                  const external = item.href.startsWith('http');
                  const className =
                    'inline-block rounded-lg border border-[var(--border-strong)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]';
                  return (
                    <li key={item.href}>
                      {external ? (
                        <a
                          href={item.href}
                          className={className}
                          rel="noopener noreferrer"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className={className}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {section.kind === 'prose' ? (
              <div className="max-w-3xl space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {section.kind === 'steps' ? (
              <ol className="grid max-w-4xl gap-8 md:grid-cols-3">
                {section.steps.map((step) => (
                  <li key={step.title} className="border-t border-[var(--line)] pt-4">
                    <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}

            {section.kind === 'proof' ? (
              <div className="grid max-w-4xl gap-8 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-5">
                  <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
                    Configuration
                  </p>
                  <dl className="mt-4 space-y-2 text-sm">
                    {section.configuration.map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-3 border-b border-[var(--line)] py-2"
                      >
                        <dt className="text-[var(--text-muted)]">{row.label}</dt>
                        <dd className="font-medium text-[var(--ink)]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-5">
                  <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
                    Resolved output
                  </p>
                  <dl className="mt-4 space-y-2 font-mono text-sm">
                    {section.resolved.map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-3 border-b border-[var(--line)] py-2"
                      >
                        <dt className="font-sans text-[var(--text-muted)]">
                          {row.label}
                        </dt>
                        <dd className="text-right text-[var(--ink)]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {section.note ? (
                  <p className="type-meta md:col-span-2">{section.note}</p>
                ) : null}
              </div>
            ) : null}

            {section.kind === 'math' ? (
              <div className="max-w-4xl">
                <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] px-5 py-4 font-mono text-sm text-[var(--ink)] md:text-base">
                  {section.equation}
                </p>
                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  {[section.left, section.right].map((column) => (
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
              </div>
            ) : null}

            {section.kind === 'code' ? (
              <div className="max-w-4xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--ink)]">
                {section.caption ? (
                  <p className="border-b border-white/10 px-4 py-2 text-[11px] tracking-[0.06em] text-white/50 uppercase">
                    {section.caption}
                  </p>
                ) : null}
                <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-[#f2f1ed] md:text-[13px]">
                  <code>{section.code}</code>
                </pre>
              </div>
            ) : null}

            {section.kind === 'demo' ? (
              <SeoDemoEmbed product={section.product} />
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
