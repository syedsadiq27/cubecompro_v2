import { Button, FaqList, Section } from '@repo/ui';
import Link from 'next/link';
import type { SeoFaqItem } from '@/lib/seo-pages';

export function SeoFaq({
  id,
  items,
  title = 'Questions teams ask before adopting CubeCom',
  description = 'Still mapping your catalog, rules, or commerce path? Bring one product and we’ll show where CubeCom should sit.',
  compact = false,
  tone = 'soft',
  ctaHref = '/#contact',
  ctaLabel = 'Book a solution session',
}: {
  id?: string;
  items: readonly SeoFaqItem[];
  title?: string;
  description?: string;
  compact?: boolean;
  tone?: 'canvas' | 'soft';
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Section
      id={id}
      tone={tone}
      spacing={compact ? 'compact' : 'default'}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
        <div>
          <Section.Title>{title}</Section.Title>
          {description ? (
            <Section.Description>{description}</Section.Description>
          ) : null}
          <Button
            as={Link}
            href={ctaHref}
            variant="primary"
            size="lg"
            className="mt-8"
          >
            {ctaLabel}
          </Button>
        </div>

        <FaqList items={items} />
      </div>
    </Section>
  );
}
