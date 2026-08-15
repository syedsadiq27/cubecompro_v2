import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Lede,
  PageHero,
  Section,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { SOLUTION_OUTCOMES } from '@/lib/solutions';
import { TERMS } from '@/lib/terminology';
import { SolutionPathCards } from './solution-path-cards';

export function SolutionsHubPage() {
  return (
    <>
      <PageHero layout="solo">
        <PageHero.Copy>
          <Eyebrow>Solutions</Eyebrow>
          <Heading as="h1" variant="pageSeo" spacing="eyebrow">
            One configuration engine. Every way you sell.
          </Heading>
          <Lede variant="hero" className="mt-5">
            Rules, 3D, headless storefronts, and APIs all resolve to the same
            sellable state.
          </Lede>
        </PageHero.Copy>
      </PageHero>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <Container padding="sectionCompact">
          <Heading as="h2" variant="section" className="max-w-2xl">
            Choose the experience. Keep the product truth.
          </Heading>
          <div className="mt-10">
            <SolutionPathCards />
          </div>
        </Container>
      </section>

      <Section tone="ink" spacing="default" bordered={false}>
        <Section.Header title="Different experiences. One sellable state." />

        <Section.Body gap="spacious">
          <div className="flex flex-col items-center gap-5">
            <div className="grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
              {['Rules', 'Visual', 'Headless', 'API'].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3.5 text-center text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>

            <span className="text-2xl text-white/35" aria-hidden>
              ↓
            </span>

            <div className="w-full max-w-xl rounded-2xl border-2 border-white/40 bg-white px-6 py-7 text-center md:py-9">
              <Typography variant="code" tone="muted">
                SHARED STATE
              </Typography>
              <Typography
                as="p"
                variant="title"
                tone="strong"
                className="mt-2 text-[clamp(1.35rem,3vw,1.85rem)] tracking-[0.04em] uppercase"
              >
                {TERMS.sellableState}
              </Typography>
            </div>

            <span className="text-2xl text-white/35" aria-hidden>
              ↓
            </span>

            <div className="grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
              {SOLUTION_OUTCOMES.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-3.5 text-center font-mono text-sm text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center md:mt-14">
            <Typography
              as="h3"
              variant="title"
              tone="ink"
              className="text-[clamp(1.25rem,2.5vw,1.6rem)]"
            >
              Bring us one configurable product.
            </Typography>
            <Typography
              variant="support"
              className="mx-auto mt-3 max-w-lg text-white/55"
            >
              We’ll show you where the rules, experience, and commerce handoff
              should live.
            </Typography>
            <Button
              as={Link}
              href="/#contact"
              variant="inverse"
              size="lg"
              className="mt-6"
            >
              {TERMS.bookSession}
            </Button>
          </div>
        </Section.Body>
      </Section>
    </>
  );
}
