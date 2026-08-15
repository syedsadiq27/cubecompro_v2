import { Grid, Section, Typography } from '@repo/ui';

export type EditorialColumnItem = {
  number?: string;
  tag?: string;
  title: string;
  body: string;
};

export function EditorialColumns({
  eyebrow,
  title,
  description,
  items,
  tone = 'canvas',
  spacing = 'default',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: EditorialColumnItem[];
  tone?: 'canvas' | 'soft';
  spacing?: 'compact' | 'default' | 'spacious';
}) {
  const cols =
    items.length === 3
      ? ('md-3' as const)
      : items.length === 2
        ? ('md-2' as const)
        : ('sm-2-lg-4' as const);

  return (
    <Section tone={tone} spacing={spacing === 'spacious' ? 'default' : spacing}>
      {title ? (
        <Section.Header
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      ) : null}

      <Section.Body>
        <Grid cols={cols} gap="xl">
          {items.map((item, idx) => {
            const num = item.number ?? `0${idx + 1}`;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between border-t-2 border-[var(--line)] pt-5 transition-colors hover:border-[var(--stage-violet)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Typography variant="mono" tone="muted">
                      {num}
                    </Typography>
                    {item.tag ? (
                      <Typography variant="mono" tone="accent" className="font-semibold">
                        {item.tag}
                      </Typography>
                    ) : null}
                  </div>
                  <Typography as="h3" variant="titleLg" className="mt-3">
                    {item.title}
                  </Typography>
                  <Typography variant="prose" className="mt-2.5 max-w-none">
                    {item.body}
                  </Typography>
                </div>
              </div>
            );
          })}
        </Grid>
      </Section.Body>
    </Section>
  );
}
