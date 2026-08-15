import { Section } from '@repo/ui';
import type { ReactNode } from 'react';

export function SolutionSection({
  eyebrow,
  title,
  description,
  children,
  tone = 'default',
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: 'default' | 'soft' | 'ink';
  compact?: boolean;
}) {
  const sectionTone =
    tone === 'ink' ? 'ink' : tone === 'soft' ? 'soft' : 'canvas';

  return (
    <Section tone={sectionTone} spacing={compact ? 'compact' : 'default'}>
      <Section.Header
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      {children ? <Section.Body>{children}</Section.Body> : null}
    </Section>
  );
}
