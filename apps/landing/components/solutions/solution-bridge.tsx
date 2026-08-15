import Link from 'next/link';
import { Button, Section, Stack, Typography } from '@repo/ui';

export function SolutionBridge({
  title,
  href,
  label,
  tone = 'default',
}: {
  title: string;
  href: string;
  label: string;
  tone?: 'default' | 'soft';
}) {
  return (
    <Section
      tone={tone === 'soft' ? 'soft' : 'canvas'}
      spacing="compact"
      containerClassName="ui:!py-8 ui:md:!py-10"
    >
      <Stack
        direction="row"
        gap="md"
        align="center"
        justify="between"
        wrap
        className="flex-col md:flex-row"
      >
        <Typography variant="titleSm" className="max-w-2xl md:text-lg">
          {title}
        </Typography>
        <Button as={Link} href={href} variant="secondary" size="md" className="shrink-0">
          {label}
        </Button>
      </Stack>
    </Section>
  );
}
