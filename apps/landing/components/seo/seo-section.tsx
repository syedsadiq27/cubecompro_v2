import { Section } from '@repo/ui';
import type { ReactNode } from 'react';

export function SeoSection({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = 'default',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: 'default' | 'soft';
}) {
  return (
    <Section
      id={id}
      tone={tone === 'soft' ? 'soft' : 'canvas'}
      spacing="default"
    >
      <Section.Header
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <Section.Body gap="lg">{children}</Section.Body>
    </Section>
  );
}
