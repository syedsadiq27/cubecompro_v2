import { Card, Grid, Section, Typography } from '@repo/ui';

export type OutcomeItem = {
  title: string;
  description: string;
  tag?: string;
};

export function OutcomeGrid({
  eyebrow = 'Commercial & Operational Outcomes',
  title = 'Why configuration architecture matters.',
  description,
  items,
  tone = 'soft',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: OutcomeItem[];
  tone?: 'canvas' | 'soft';
}) {
  return (
    <Section tone={tone} spacing="default">
      <Section.Header
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <Section.Body>
        <Grid cols="sm-2-lg-3" gap="lg">
          {items.map((item) => (
            <Card
              key={item.title}
              padding="md"
              className="transition-all hover:border-[var(--stage-violet)]/60"
            >
              {item.tag ? (
                <Typography variant="mono" tone="accent" className="font-semibold">
                  {item.tag}
                </Typography>
              ) : null}
              <Typography as="h3" variant="title" className="mt-3">
                {item.title}
              </Typography>
              <Typography variant="prose" className="mt-2.5 max-w-none">
                {item.description}
              </Typography>
            </Card>
          ))}
        </Grid>
      </Section.Body>
    </Section>
  );
}
