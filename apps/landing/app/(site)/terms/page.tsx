import { Heading, Typography } from '@repo/ui';
import type { Metadata } from 'next';

import { SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Terms | ${SITE_NAME}`,
  description: `Terms of use for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <Heading as="h1" variant="doc">
        Terms
      </Heading>
      <Typography variant="meta" tone="muted" className="mt-4">
        Last updated: August 14, 2026
      </Typography>
      <div className="mt-8 space-y-4">
        <Typography variant="body">
          The CubeCom Pro website and demo materials are provided for evaluation
          and information. Product features described as preview or early access
          may change before general availability.
        </Typography>
        <Typography variant="body">
          Paid use of CubeCom Pro is governed by the order form or subscription
          agreement between your organization and CubeCom Pro. Nothing on this
          marketing site creates a warranty beyond that agreement.
        </Typography>
        <Typography variant="body">
          Do not misuse the site, attempt unauthorized access to systems, or
          scrape content for competing products.
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
