import {
  Grid,
  Heading,
  Lede,
  List,
  ListItem,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { audiences, benefitOutcomes } from '@/lib/content';

const OUTCOME_SUPPORT = [
  'Author constraints once. Every surface inherits them without drift.',
  'Dimensions and rules replace combinatorial, exploding SKU tables.',
  'What shoppers see on screen is what operations can fulfill.',
  'Visual state and cart identity remain in lockstep at checkout.',
] as const;

export function Benefits() {
  return (
    <Section id="outcomes" tone="canvas" spacing="default">
      <Section.Body gap="none">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Stack direction="row" align="center" gap="xs">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--stage-violet)]"
                aria-hidden
              />
              <Typography variant="mono" tone="accent">
                Commercial Payoff
              </Typography>
            </Stack>

            <Heading
              as="h2"
              variant="section"
              className="mt-4 max-w-none text-[clamp(2.1rem,4.2vw,3.3rem)]"
            >
              One configuration truth.
              <br />
              <Typography
                as="span"
                variant="support"
                className="font-medium text-[var(--text-secondary)]"
              >
                Everywhere it matters.
              </Typography>
            </Heading>

            <Lede className="mt-6 max-w-none">
              Stage the product once. Product rules, 3D viewport, SKU, price,
              and cart stay in sync whether buying on your website, custom app,
              or in-store showroom.
            </Lede>

            <div className="mt-8 border-t border-[var(--line)] pt-6">
              <Typography variant="mono" tone="muted">
                Tailored for
              </Typography>
              <List direction="row" wrap className="mt-3 gap-x-5 gap-y-2">
                {audiences.map((item) => (
                  <ListItem key={item.href}>
                    <Typography
                      as={Link}
                      href={item.href}
                      variant="bodyStrong"
                      className="underline-offset-4 transition hover:text-[var(--stage-violet)] hover:underline"
                    >
                      {item.label} →
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>

          <Grid cols="md-2" gap="xl" className="lg:col-span-7">
            {benefitOutcomes.map((outcome, index) => (
              <div
                key={outcome}
                className="group border-t-2 border-[var(--border-strong)] pt-6 transition duration-200 hover:border-[var(--stage-violet)]"
              >
                <Stack direction="row" align="center" gap="xs">
                  <Typography
                    as="span"
                    variant="mono"
                    tone="accent"
                    className="text-base font-bold tracking-normal"
                  >
                    →
                  </Typography>
                  <Typography variant="mono" tone="accent">
                    0{index + 1}
                  </Typography>
                </Stack>

                <Typography
                  as="p"
                  variant="titleLg"
                  className="mt-3 text-[clamp(1.35rem,2.2vw,1.7rem)]"
                >
                  {outcome}
                </Typography>

                <Typography variant="body" className="mt-2.5">
                  {OUTCOME_SUPPORT[index]}
                </Typography>
              </div>
            ))}
          </Grid>
        </div>
      </Section.Body>
    </Section>
  );
}
