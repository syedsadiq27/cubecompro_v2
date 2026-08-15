import Link from 'next/link';
import { Card, Grid, Stack, Typography } from '@repo/ui';
import { SOLUTION_PATHS } from '@/lib/solutions';

export function SolutionPathCards() {
  return (
    <Grid cols="sm-2-lg-4" gap="lg">
      {SOLUTION_PATHS.map((path) => (
        <Card
          key={path.href}
          as={Link}
          href={path.href}
          variant="soft"
          padding="md"
          className="group flex flex-col transition hover:border-[var(--ink)]"
        >
          <Stack gap="lg" className="h-full">
            <Typography variant="code" tone="strong">
              {path.label}
            </Typography>
            <Typography variant="titleLg" className="group-hover:underline">
              {path.title}
            </Typography>
            <Typography variant="body" className="flex-1">
              {path.claim}
            </Typography>
            <Typography
              variant="code"
              tone="strong"
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 tracking-tight"
            >
              {path.flow}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Grid>
  );
}
