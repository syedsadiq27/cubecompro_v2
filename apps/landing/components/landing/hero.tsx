import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Lede,
  Stack,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { MediaSlot } from '@/components/patterns/media-slot';

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden text-[var(--ink)]"
    >
      <div className="cube-stage absolute inset-0" aria-hidden>
        <div className="cube-stage-field landing-plane-pulse" />
      </div>

      <Container
        padding="none"
        className="relative z-10 grid items-center gap-10 py-14 md:py-20 lg:min-h-[calc(100svh-3.75rem)] lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)] lg:gap-10 lg:py-20 xl:gap-14"
      >
        <div className="landing-rise order-1 min-w-0 w-full max-w-3xl lg:max-w-[46rem]">
          <Eyebrow>Visual commerce infrastructure</Eyebrow>
          <div
            className="mt-4 h-px w-12 bg-[var(--stage-violet)]"
            aria-hidden
          />
          <Heading
            as="h1"
            variant="hero"
            spacing="brand"
            className="max-w-[22ch] text-[clamp(2.75rem,12vw,4.75rem)]"
          >
            Product configuration infrastructure for visual commerce.
          </Heading>
          <Typography className="ui-type-tagline mt-7 max-w-md text-[clamp(1.15rem,2.2vw,1.35rem)] leading-snug text-[var(--ink)]">
            Stage the product. Sell the state.
          </Typography>
          <Lede variant="support" className="max-w-xl">
            CubeCom keeps product rules, 3D state, SKU, price, inventory, and
            cart aligned as shoppers configure.
          </Lede>

          <Stack
            direction="row"
            align="center"
            gap="sm"
            wrap
            className="mt-9"
          >
            <Button as={Link} href="/#proof" variant="primary" size="lg">
              Try the live configurator
            </Button>
            <Button as={Link} href="/#contact" variant="secondary" size="lg">
              Book a solution session
            </Button>
          </Stack>
        </div>

        <MediaSlot
          src="/images/homepage-hero-system-v2.jpg"
          alt="Material choices and commerce states synchronized through a configuration engine to a resolved modular product"
          aspectRatio="aspect-[16/9]"
          priority
          className="order-2 min-w-0 rounded-2xl border border-[var(--line)] shadow-[0_24px_64px_-28px_rgba(14,15,18,0.28)]"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </Container>
    </section>
  );
}
