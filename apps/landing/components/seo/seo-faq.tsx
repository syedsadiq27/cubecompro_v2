import { FaqList, Section } from '@repo/ui';
import type { SeoFaqItem } from '@/lib/seo-pages';

export function SeoFaq({
  items,
  title = 'Questions teams ask before adopting CubeCom',
  description,
  compact = false,
}: {
  items: SeoFaqItem[];
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <Section tone="canvas" spacing={compact ? 'compact' : 'default'}>
      <Section.Header title={title} description={description} />
      <Section.Body gap={compact ? 'default' : 'loose'} className="max-w-3xl">
        <FaqList items={items} variant="stack" />
      </Section.Body>
    </Section>
  );
}
