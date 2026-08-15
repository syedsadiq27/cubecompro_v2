import { Button, Eyebrow, Heading, Lede, PageHero, Typography } from '@repo/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

import type { SeoPageDef } from '@/lib/seo-pages';

export function SeoPageShell({
  page,
  children,
  visual,
}: {
  page: SeoPageDef;
  children: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <>
      <PageHero layout={visual ? 'split' : 'solo'} density="roomy">
        <PageHero.Copy>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <Heading as="h1" variant="pageSeo" spacing="eyebrow">
            {page.h1}
          </Heading>
          <Lede variant="hero">{page.lead}</Lede>
          <Typography
            variant="bodyStrong"
            className="mt-4 max-w-lg italic md:text-base"
          >
            {page.reframe}
          </Typography>
          <PageHero.Actions>
            <Button
              as={Link}
              href={page.primaryCta.href}
              variant="primary"
              size="lg"
            >
              {page.primaryCta.label}
            </Button>
            <Button
              as={Link}
              href={page.secondaryCta.href}
              variant="secondary"
              size="lg"
            >
              {page.secondaryCta.label}
            </Button>
          </PageHero.Actions>
        </PageHero.Copy>
        {visual ? <PageHero.Visual>{visual}</PageHero.Visual> : null}
      </PageHero>
      {children}
    </>
  );
}
