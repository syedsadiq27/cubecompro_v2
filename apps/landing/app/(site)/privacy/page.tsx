import { Heading, Typography } from '@repo/ui';
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
      <Typography variant="meta" tone="muted" className="mt-4">
        Last updated: August 14, 2026
      </Typography>
      <div className="mt-8 space-y-4">
        <Typography variant="body">
          CubeCom Pro collects contact details you submit through demo and
          session request forms — typically name, email, company, and message —
          so we can respond to your inquiry.
        </Typography>
        <Typography variant="body">
          We do not sell personal information. Form submissions may be stored in
          our CRM or spreadsheet tools used to operate sales follow-up.
        </Typography>
        <Typography variant="body">
          Product usage data in customer deployments is governed by the
          customer’s agreement and their own storefront policies.
        </Typography>
        <Typography variant="body">
          Questions:{' '}
          <Typography
            as="a"
            href={`mailto:${SITE_EMAIL}`}
            variant="bodyStrong"
            className="underline"
          >
            {SITE_EMAIL}
          </Typography>
        </Typography>
      </div>
    </article>
  );
}
