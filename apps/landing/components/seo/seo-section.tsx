import { Section } from '@repo/ui';
import type { ReactNode } from 'react';

export function SeoSection({
  id,
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
  tone?: 'default' | 'muted';
}) {
  return (
    <Section
      id={id}
      tone={tone === 'muted' ? 'muted' : 'canvas'}
      spacing="default"
    >
      <Section.Header title={title} description={description} />
      <Section.Body gap="loose">{children}</Section.Body>
    </Section>
  );
}
