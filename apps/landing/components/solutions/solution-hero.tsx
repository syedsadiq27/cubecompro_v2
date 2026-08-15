import { Button, Eyebrow, Heading, Lede, PageHero } from '@repo/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

function HeroCta({
  href,
  variant,
  children,
}: {
  href: string;
  variant: 'primary' | 'secondary';
  children: ReactNode;
}) {
  if (href.startsWith('http')) {
    return (
      <Button
        as="a"
        href={href}
        variant={variant}
        size="lg"
        rel="noopener noreferrer"
      >
        {children}
      </Button>
    );
  }
  return (
    <Button as={Link} href={href} variant={variant} size="lg">
      {children}
    </Button>
  );
}

export function SolutionHero({
  eyebrow,
  title,
  lead,
  primaryCta,
  secondaryCta,
  children,
  visualPriority = false,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  children: ReactNode;
  visualPriority?: boolean;
}) {
  return (
    <PageHero layout={visualPriority ? 'splitFeature' : 'split'}>
      <PageHero.Copy>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading
          as="h1"
          variant={visualPriority ? 'pageFeature' : 'page'}
          spacing="eyebrow"
        >
          {title}
        </Heading>
        <Lede variant="hero">{lead}</Lede>
        <PageHero.Actions>
          <HeroCta href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </HeroCta>
          <HeroCta href={secondaryCta.href} variant="secondary">
            {secondaryCta.label}
          </HeroCta>
        </PageHero.Actions>
      </PageHero.Copy>
      <PageHero.Visual>{children}</PageHero.Visual>
    </PageHero>
  );
}
