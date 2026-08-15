import type { HTMLAttributes } from 'react';
import type { SurfaceTone } from '../lib/tone';
import { Card } from './card';
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
  tone: Extract<SurfaceTone, 'soft' | 'ink'>;
  density: CompareDensity;
}) {
  const compact = density === 'compact';

  return (
    <Card
      tone={tone}
      padding={compact ? 'sm' : 'lg'}
      radius="lg"
      inset
      className={compact ? 'ui:md:p-6' : undefined}
    >
      <Stack gap="lg">
        <Typography variant="label">{label}</Typography>
        <DividedList
          items={items}
          density={density}
          marker={tone === 'ink' ? 'success' : 'danger'}
        />
      </Stack>
    </Card>
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
        <ComparePanel tone="soft" density={density} {...left} />
        <ComparePanel tone="ink" density={density} {...right} />
      </Grid>
    </Frame>
  );
}
