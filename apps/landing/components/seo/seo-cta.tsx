import { Button, Section } from '@repo/ui';
import type { ReactNode } from 'react';
import Link from 'next/link';

function CtaButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: 'inverse' | 'inverseSecondary';
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

export function SeoCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Section tone="ink" spacing="cta">
      <Section.Header title={title} description={description} />
      <Section.Body>
        <div className="flex flex-wrap gap-3">
          <CtaButton href={primaryHref} variant="inverse">
            {primaryLabel}
          </CtaButton>
          {secondaryHref && secondaryLabel ? (
            <CtaButton href={secondaryHref} variant="inverseSecondary">
              {secondaryLabel}
            </CtaButton>
          ) : null}
        </div>
      </Section.Body>
    </Section>
  );
}
