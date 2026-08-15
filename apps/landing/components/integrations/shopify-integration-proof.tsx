import {
  DescriptionList,
  Section,
  Typography,
} from '@repo/ui';

export function ShopifyIntegrationProof() {
  return (
    <Section id="proof" tone="soft" spacing="default">
      <Section.Header
        eyebrow="Intended shopper loop"
        title="Ship the shopper loop before the App Store listing."
        description="Early-access pattern: configure beside a Shopify PDP, resolve to a variant Shopify already sells, hand the line item to Shopify cart — checkout stays Shopify."
      />

      <Section.Body gap="lg">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 lg:col-span-7">
            <Typography variant="mono" tone="muted">
              Shopify PDP · configuration surface
            </Typography>
            <Typography as="h3" variant="title" className="mt-2">
              Modular sofa
            </Typography>
            <Typography variant="support" className="mt-1.5">
              Options render from CubeCom. Catalog title and price tier still
              come from Shopify.
            </Typography>

            <DescriptionList gap="none" className="mt-5">
              {[
                ['Frame', 'Walnut'],
                ['Fabric', 'Beige'],
                ['Legs', 'Brass'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-[var(--line)] py-2.5"
                >
                  <Typography as="dt" variant="meta" tone="muted">
                    {label}
                  </Typography>
                  <Typography as="dd" variant="bodyStrong">
                    {value}
                  </Typography>
                </div>
              ))}
            </DescriptionList>

            <Typography variant="support" className="mt-4">
              Constraint example: leather fabric blocks black frame before the
              look reaches cart.
            </Typography>
          </div>

          <div
            className="rounded-2xl border border-white/10 bg-[var(--ink)] p-5 lg:col-span-5"
            data-surface-tone="ink"
          >
            <Typography
              variant="mono"
              tone="accent"
              className="text-[var(--stage-violet-light)]"
            >
              Shopify cart line · resolved
            </Typography>
            <DescriptionList gap="none" className="mt-4">
              {[
                ['variant_id', 'gid://shopify/ProductVariant/48291033'],
                ['sku', 'SOFA-WAL-BEI-BRA'],
                ['price', '$2,399'],
                ['qty', '1'],
                ['checkout', 'Shopify'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-white/10 py-2.5"
                >
                  <Typography as="dt" variant="meta" tone="inverse">
                    {label}
                  </Typography>
                  <Typography
                    as="dd"
                    variant="code"
                    tone="inverse"
                    className="max-w-[60%] text-right normal-case tracking-normal"
                  >
                    {value}
                  </Typography>
                </div>
              ))}
            </DescriptionList>
            <Typography
              variant="support"
              className="mt-4 text-white/55"
            >
              Intended handoff via theme cart AJAX or Storefront API — not a
              published App Store connector yet.
            </Typography>
          </div>
        </div>
      </Section.Body>
    </Section>
  );
}
