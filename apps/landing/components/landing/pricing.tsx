import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
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

      <Section.Body gap={compact ? 'none' : 'xl'}>
        <Grid cols="lg-3" gap="lg">
          {plans.map((plan) => {
            const onInk = plan.featured;
            return (
              <Card
                key={plan.name}
                tone={onInk ? 'ink' : 'surface'}
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
                    className="text-[22px]"
                  >
                    {plan.name}
                  </Typography>
                  {onInk ? (
                    <Typography variant="label">
                      Most popular
                    </Typography>
                  ) : null}
                </Stack>
                <Typography
                  as="p"
                  variant="titleLg"
                  tone={onInk ? 'inverse' : 'default'}
                  className="ui-type-data mt-5 text-[2.15rem] tracking-tight"
                >
                  {plan.foundingPrice}
                  {plan.foundingPrice !== 'Custom' ? (
                    <Typography
                      as="span"
                      variant="meta"
                      tone={onInk ? 'inverse' : 'muted'}
                      className="ml-1 text-sm font-normal"
                    >
                      /mo
                    </Typography>
                  ) : null}
                </Typography>
                {plan.regularPrice ? (
                  <Typography
                    variant="meta"
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
                  className="mt-2"
                >
                  {plan.bestFor}
                </Typography>
                <List
                  gap="xs"
                  className={`mt-7 flex-1 text-sm ${
                    onInk
                      ? 'text-white/75'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>{feature}</ListItem>
                  ))}
                </List>
                <Button
                  as={Link}
                  href={`/?interest=${plan.interest}#contact`}
                  variant={onInk ? 'inverse' : 'primary'}
                  size="lg"
                  className="mt-8 w-full"
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
