import { Card, Grid, Section, Stack, Typography } from '@repo/ui';

const SYSTEMS = [
  {
    tag: 'RULES',
    name: 'Rules Engine',
    io: 'graph → transitions',
    body: 'Dependencies and exclusions authored once.',
  },
  {
    tag: 'STATE',
    name: 'State Resolver',
    io: 'selection → valid state',
    body: 'Illegal choices rewrite to a legal state.',
  },
  {
    tag: 'COMMERCE',
    name: 'Commerce Projection',
    io: 'state → SKU / price / stock',
    body: 'Maps state to a sellable line identity.',
  },
  {
    tag: 'RUNTIME',
    name: 'Channel Runtime',
    io: 'state → storefront / API',
    body: 'Same truth for embeds, sales, and agents.',
  },
] as const;

export function PcInfrastructure() {
  return (
    <Section tone="soft" spacing="compact">
      <Section.Header title="Configuration belongs between the catalog and the cart." />
      <Section.Body gap="md">
        <Grid cols={2} gap="sm" className="md:gap-4 lg:grid-cols-4">
          {SYSTEMS.map((system) => (
            <Card
              as="article"
              key={system.name}
              tone="surface"
              padding="sm"
              className="md:rounded-2xl md:p-5"
            >
              <Stack gap="sm">
                <Typography variant="code">{system.tag}</Typography>
                <Typography variant="titleSm">{system.name}</Typography>
                <Typography variant="code" tone="muted">
                  {system.io}
                </Typography>
                <Typography variant="support">{system.body}</Typography>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section.Body>
    </Section>
  );
}
