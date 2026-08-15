import Link from 'next/link';
import { Container, Stack, Typography } from '@repo/ui';

export function SolutionBridge({
  title,
  href,
  label,
  tone = 'default',
}: {
  title: string;
  href: string;
  label: string;
  tone?: 'default' | 'muted';
}) {
  return (
    <section
      className={
        tone === 'muted'
          ? 'border-t border-[var(--line)] bg-[var(--surface)]'
          : 'border-t border-[var(--line)] bg-[var(--canvas)]'
      }
    >
      <Container className="py-8 md:py-10">
        <Stack
          direction="row"
          gap="md"
          align="center"
          justify="between"
          wrap
          className="flex-col md:flex-row"
        >
          <Typography
            variant="titleSm"
            tone="strong"
            className="max-w-2xl md:text-lg"
          >
            {title}
          </Typography>
          <Link
            href={href}
            className="inline-flex shrink-0 rounded-lg border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
          >
            {label}
          </Link>
        </Stack>
      </Container>
    </section>
  );
}
