import { Card, Grid, Section, Stack, Typography } from '@repo/ui';

const CAPABILITIES = [
  {
    title: 'Option dependencies',
    body: 'Choosing one value changes what else is legal — size constrains fabric, finish constrains hardware.',
  },
  {
    title: 'Exclusion rules',
    body: 'Hard blocks for combinations you will never manufacture or stock, without deleting options from the family.',
  },
  {
    title: 'Conditional availability',
    body: 'Options appear, hide, or rewrite at runtime from the current state — not from a static variant list.',
  },
  {
    title: 'Product-family modeling',
    body: 'One graph for a sofa line or apparel set: shared attributes, per-SKU commerce references, shared rules.',
  },
  {
    title: 'Runtime state resolution',
    body: 'Every selection map becomes one valid configuration before it can resolve to commerce.',
  },
  {
    title: 'Catalog without explosion',
    body: 'Stop pre-publishing thousands of variants. Author dimensions and rules; resolve sellable states on demand.',
  },
] as const;

export function PcRulesDepth() {
  return (
    <Section tone="canvas" spacing="compact">
      <Section.Header>
        <Section.Title>
          Stop managing combinations. Start modeling the product.
        </Section.Title>
        <Typography variant="body" className="mt-4 max-w-2xl md:text-base">
          Define dependencies, exclusions, and availability once. CubeCom
          resolves the legal sellable state at runtime.
        </Typography>
      </Section.Header>
      <Section.Body gap="md">
        <Grid cols="sm-2-lg-3" gap="sm">
          {CAPABILITIES.map((item) => (
            <Card as="article" key={item.title} tone="soft" padding="sm">
              <Stack gap="sm">
                <Typography variant="titleSm">{item.title}</Typography>
                <Typography variant="support">{item.body}</Typography>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section.Body>
    </Section>
  );
}
