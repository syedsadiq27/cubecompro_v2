import { Section, Typography } from '@repo/ui';
import Link from 'next/link';

import { SolutionPathCards } from '@/components/solutions/solution-path-cards';

export function Solutions() {
  return (
    <Section id="surfaces" tone="canvas" spacing="default">
      <Section.Header
        eyebrow="Engine Surfaces"
        title="One configuration runtime. Four ways to sell the resolved state."
        description="The engine underneath stays identical whether you are running a 3D visual storefront, a headless React stack, an in-store sales tool, or an automated API client."
      />

      <Section.Body gap="xl">
        <SolutionPathCards />
        <Typography
          as={Link}
          href="/solutions"
          variant="bodyStrong"
          tone="accent"
          className="mt-8 inline-block underline-offset-4 hover:underline"
        >
          Explore all solutions →
        </Typography>
      </Section.Body>
    </Section>
  );
}
