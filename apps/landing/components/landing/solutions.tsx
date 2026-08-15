import { Section } from '@repo/ui';
import Link from 'next/link';

import { SolutionPathCards } from '@/components/solutions/solution-path-cards';

export function Solutions() {
  return (
    <Section id="surfaces" tone="muted" spacing="default">
      <Section.Header
        title="One platform. Multiple surfaces."
        description="Choose how you sell. Keep the same configuration truth underneath."
      />

      <Section.Body gap="spacious">
        <SolutionPathCards />
        <p className="mt-8">
          <Link
            href="/solutions"
            className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
          >
            Explore all solutions
          </Link>
        </p>
      </Section.Body>
    </Section>
  );
}
