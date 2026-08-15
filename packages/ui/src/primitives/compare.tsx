import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { DividedList } from './divided-list';
import { Frame } from './frame';
import { Grid } from './grid';
import { Stack } from './stack';
import { Typography } from './typography';

export type CompareDensity = 'default' | 'compact';

type CompareSide = {
  label: string;
  items: readonly string[];
};

function ComparePanel({
  tone,
  label,
  items,
  density,
}: CompareSide & {
  tone: 'muted' | 'ink';
  density: CompareDensity;
}) {
  const compact = density === 'compact';
  const listTone = tone === 'ink' ? 'ink' : 'default';

  return (
    <Stack
      gap="lg"
      className={cn(
        tone === 'muted' && 'ui:bg-[var(--surface)]',
        tone === 'ink' && 'ui:bg-[var(--ink)] ui:text-[var(--canvas)]',
        compact ? 'ui:p-5 ui:md:p-6' : 'ui:p-5 ui:md:p-8'
      )}
    >
      <Typography variant="label" tone={tone === 'ink' ? 'ink' : 'muted'}>
        {label}
      </Typography>
      <DividedList
        items={items}
        tone={listTone}
        density={density}
        marker={tone === 'ink' ? 'success' : 'danger'}
      />
    </Stack>
  );
}

export function Compare({
  left,
  right,
  density = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  left: CompareSide;
  right: CompareSide;
  density?: CompareDensity;
}) {
  return (
    <Frame className={className} {...props}>
      <Grid cols="lg-2" gap="none">
        <ComparePanel tone="muted" density={density} {...left} />
        <ComparePanel tone="ink" density={density} {...right} />
      </Grid>
    </Frame>
  );
}
