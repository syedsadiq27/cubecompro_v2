import type { Metadata } from 'next';
import { SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Terms | ${SITE_NAME}`,
  description: `Terms of use for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <h1 className="type-page text-[clamp(1.85rem,3.5vw,2.5rem)]">Terms</h1>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        Last updated: August 14, 2026
      </p>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          The CubeCom Pro website and demo materials are provided for evaluation
          and information. Product features described as preview or early access
          may change before general availability.
        </p>
        <p>
          Paid use of CubeCom Pro is governed by the order form or subscription
          agreement between your organization and CubeCom Pro. Nothing on this
          marketing site creates a warranty beyond that agreement.
        </p>
        <p>
          Do not misuse the site, attempt unauthorized access to systems, or
          scrape content for competing products.
        </p>
        <p>
          Questions:{' '}
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="text-[var(--ink)] underline"
          >
            {SITE_EMAIL}
          </a>
        </p>
      </div>
    </article>
  );
}
