import { Button, FaqList, Section } from '@repo/ui';
import Link from 'next/link';

import { faqs } from '@/lib/content';

export function Faq() {
  return (
    <Section id="faq" tone="muted" spacing="default">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <Section.Title>
            Questions teams ask before adopting CubeCom
          </Section.Title>
          <Section.Description>
            Still mapping your catalog, rules, or commerce path? Bring one
            product and we’ll show where CubeCom should sit.
          </Section.Description>
          <Button
            as={Link}
            href="/#contact"
            variant="primary"
            size="lg"
            className="mt-8"
          >
            Book a solution session
          </Button>
        </div>

        <FaqList items={faqs} variant="rail" />
      </div>
    </Section>
  );
}
