import { Card, DividedList, Frame, Grid, Stack, Typography } from '@repo/ui';

export function OwnershipDiagram({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}) {
  return (
    <Frame>
      <Grid cols="md-2" gap="none">
        <Card variant="surface" padding="md" inset>
          <Stack gap="lg">
            <Typography variant="mono">{leftTitle}</Typography>
            <DividedList items={leftItems} density="compact" />
          </Stack>
        </Card>
        <Card variant="ink" padding="md" inset>
          <Stack gap="lg">
            <Typography variant="mono" tone="ink">
              {rightTitle}
            </Typography>
            <DividedList items={rightItems} tone="ink" density="compact" />
          </Stack>
        </Card>
      </Grid>
      <Card
        padding="md"
        inset
        className="border-t border-[var(--border-strong)]"
      >
        <Stack gap="xs">
          <Typography variant="mono">Hand-off</Typography>
          <Typography variant="bodyStrong">
            Configuration state → sellable variant / line item → cart stays on
            your commerce platform
          </Typography>
        </Stack>
      </Card>
    </Frame>
  );
}
