import { Grid, Section, Typography } from '@repo/ui';

import { MediaSlot } from '@/components/patterns/media-slot';

export function Why3d() {
  return (
    <Section id="why" tone="soft" spacing="default">
      <Section.Header
        eyebrow="The Catalog Problem"
        title="Static product pages sell a snapshot. Configurable products need a live state."
        description="Photo PDPs and variant matrices fall apart as options multiply. Shoppers need a product that updates — and still resolves to something you can sell."
      />

      <Section.Body gap="lg" className="space-y-8 md:space-y-12">
        <MediaSlot
          src="/images/problem-variant-resolution-v2.jpg"
          alt="Fragmented product variants and invalid combinations resolving into one valid configurable product state"
          aspectRatio="aspect-[21/9]"
          className="rounded-2xl border border-[var(--line)]"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />

        <Grid cols="md-2" gap="xl" className="pt-6">
          <div className="border-t-2 border-[var(--border-strong)] pt-6">
            <Typography variant="mono" tone="muted">
              Traditional Catalog
            </Typography>
            <Typography
              as="h3"
              variant="titleLg"
              className="mt-2 text-[clamp(1.3rem,2.2vw,1.6rem)]"
            >
              Without CubeCom
            </Typography>
            <Typography variant="body" className="mt-3">
              Flat PDPs require photographing every combination. As dimensions
              multiply, variant matrices explode into thousands of fragmented
              SKUs — and invalid combinations inevitably slip through to
              checkout.
            </Typography>
          </div>

          <div className="border-t-2 border-[var(--stage-violet)] pt-6">
            <Typography variant="mono" tone="accent">
              Configuration Infrastructure
            </Typography>
            <Typography
              as="h3"
              variant="titleLg"
              className="mt-2 text-[clamp(1.3rem,2.2vw,1.6rem)]"
            >
              With CubeCom
            </Typography>
            <Typography variant="bodyStrong" className="mt-3">
              One rules graph resolves validity in real time. Shoppers configure
              freely while visual 3D state, SKU, price, inventory, and cart stay
              locked on a single guaranteed sellable state.
            </Typography>
          </div>
        </Grid>

        <div
          className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--stage-violet)]/40 to-transparent"
          aria-hidden
        />
      </Section.Body>
    </Section>
  );
}
