import { Button, Card, Grid, Section, Stack, Typography } from '@repo/ui';
import Link from 'next/link';

import { plans } from '@/lib/content';

export function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <Section
      id="pricing"
      tone="canvas"
      spacing={compact ? 'softTop' : 'default'}
      bordered={!compact}
    >
      {compact ? null : (
        <Section.Header
          title="Founding rates while we’re still early."
          description="Lock in early. Decorations and image generation stay modular — compute does not inflate the base plan."
        />
      )}

      <Section.Body gap={compact ? 'none' : 'spacious'}>
        <Grid cols="lg-3" gap="lg">
          {plans.map((plan) => {
            const onInk = plan.featured;
            return (
              <Card
                key={plan.name}
                variant={onInk ? 'ink' : 'default'}
                padding="md"
                className="flex flex-col"
              >
                <Stack
                  direction="row"
                  align="baseline"
                  justify="between"
                  gap="md"
                >
                  <Typography
                    as="h3"
                    variant="title"
                    tone={onInk ? 'ink' : 'strong'}
                    className="text-[22px]"
                  >
                    {plan.name}
                  </Typography>
                  {onInk ? (
                    <Typography variant="label" tone="ink">
                      Most popular
                    </Typography>
                  ) : null}
                </Stack>
                <p
                  className={`mt-5 text-[2.15rem] font-semibold tracking-tight ${
                    onInk ? 'text-white' : 'text-[var(--ink)]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {plan.foundingPrice}
                  {plan.foundingPrice !== 'Custom' ? (
                    <span
                      className={`ml-1 text-sm font-normal ${
                        onInk ? 'text-white/55' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      /mo
                    </span>
                  ) : null}
                </p>
                {plan.regularPrice ? (
                  <Typography
                    variant="meta"
                    tone={onInk ? 'ink' : 'muted'}
                    className="mt-1"
                  >
                    then {plan.regularPrice}/mo
                  </Typography>
                ) : null}
                <Typography
                  variant="support"
                  className={onInk ? 'mt-4 text-white/75' : 'mt-4'}
                >
                  {plan.blurb}
                </Typography>
                <Typography
                  variant="meta"
                  tone={onInk ? 'ink' : 'muted'}
                  className="mt-2"
                >
                  {plan.bestFor}
                </Typography>
                <ul
                  className={`mt-7 flex-1 space-y-2 text-sm ${
                    onInk
                      ? 'text-white/75'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Button
                  as={Link}
                  href={`/?interest=${plan.interest}#contact`}
                  variant={onInk ? 'inverse' : 'primary'}
                  size="lg"
                  className={
                    onInk
                      ? 'mt-8 w-full bg-white px-4 hover:bg-white/90'
                      : 'mt-8 w-full px-4'
                  }
                >
                  {plan.cta}
                </Button>
              </Card>
            );
          })}
        </Grid>
      </Section.Body>
    </Section>
  );
}
