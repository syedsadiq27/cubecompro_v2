import { Grid, Section, Typography } from '@repo/ui';

export function ProblemCompare({
  eyebrow,
  title,
  description,
  traditionalLabel = 'Traditional Catalog',
  traditionalTitle = 'Without CubeCom',
  traditionalBody,
  cubecomLabel = 'Configuration Infrastructure',
  cubecomTitle = 'With CubeCom',
  cubecomBody,
  tone = 'soft',
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  traditionalLabel?: string;
  traditionalTitle?: string;
  traditionalBody: string;
  cubecomLabel?: string;
  cubecomTitle?: string;
  cubecomBody: string;
  tone?: 'canvas' | 'soft';
  children?: React.ReactNode;
}) {
  return (
    <Section tone={tone} spacing="default">
      <Section.Header
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <Section.Body gap="lg" className="space-y-8 md:space-y-12">
        {children ? <div>{children}</div> : null}

        <Grid cols="md-2" gap="xl" className="pt-4">
          <div className="border-t-2 border-[var(--border-strong)] pt-6">
            <Typography variant="mono" tone="muted">
              {traditionalLabel}
            </Typography>
            <Typography
              as="h3"
              variant="titleLg"
              className="mt-2 text-[clamp(1.3rem,2.2vw,1.6rem)]"
            >
              {traditionalTitle}
            </Typography>
            <Typography variant="body" className="mt-3">
              {traditionalBody}
            </Typography>
          </div>

          <div className="border-t-2 border-[var(--stage-violet)] pt-6">
            <Typography variant="mono" tone="accent">
              {cubecomLabel}
            </Typography>
            <Typography
              as="h3"
              variant="titleLg"
              className="mt-2 text-[clamp(1.3rem,2.2vw,1.6rem)]"
            >
              {cubecomTitle}
            </Typography>
            <Typography variant="bodyStrong" className="mt-3">
              {cubecomBody}
            </Typography>
          </div>
        </Grid>
      </Section.Body>
    </Section>
  );
}
