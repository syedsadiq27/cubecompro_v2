import { Heading } from '@repo/ui';
import type { Metadata } from 'next';

import { SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Privacy | ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <Heading as="h1" variant="doc">
        Privacy
      </Heading>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        Last updated: August 14, 2026
      </p>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          CubeCom Pro collects contact details you submit through demo and
          session request forms — typically name, email, company, and message —
          so we can respond to your inquiry.
        </p>
        <p>
          We do not sell personal information. Form submissions may be stored in
          our CRM or spreadsheet tools used to operate sales follow-up.
        </p>
        <p>
          Product usage data in customer deployments is governed by the
          customer’s agreement and their own storefront policies.
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
