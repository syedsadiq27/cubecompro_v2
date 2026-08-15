import { Section, Typography } from '@repo/ui';

const SELECTION = `{
  "productKey": "sofa-01",
  "selections": {
    "frame": "walnut",
    "fabric": "beige",
    "legs": "brass"
  }
}`;

const RESOLVED = `{
  "valid": true,
  "commerce": {
    "sku": "SOFA-WAL-BEI-BRA",
    "price": { "centAmount": 239900, "currencyCode": "USD" },
    "inventory": 4
  }
}`;

const CART_ACTION = `{
  "action": "addLineItem",
  "sku": "SOFA-WAL-BEI-BRA",
  "quantity": 1,
  "custom": {
    "type": { "key": "cubecom-configuration" },
    "fields": {
      "configurationId": "cfg_8f2a1c"
    }
  }
}`;

function CodePanel({
  label,
  code,
  tone = 'light',
}: {
  label: string;
  code: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        dark
          ? 'border-white/15 bg-[var(--ink)]'
          : 'border-[var(--line)] bg-[var(--surface-pure)]'
      }`}
      data-surface-tone={dark ? 'ink' : 'surface'}
    >
      <div
        className={`border-b px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] ${
          dark
            ? 'border-white/10 text-white/45'
            : 'border-[var(--line)] text-[var(--text-muted)]'
        }`}
      >
        {label}
      </div>
      <pre
        className={`overflow-x-auto p-4 text-[12px] leading-relaxed md:text-[13px] ${
          dark ? 'text-white/80' : 'text-[var(--ink)]'
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function CommercetoolsIntegrationProof() {
  return (
    <Section id="proof" tone="soft" spacing="default">
      <Section.Header
        eyebrow="Architecture proof · early access"
        title="Storefront state resolves into a commercetools cart line."
        description="Intended pattern for composable teams: validate and resolve in CubeCom, then project a sellable SKU into a commercetools cart action — not a turnkey marketplace connector."
      />

      <Section.Body gap="lg">
        <div className="grid gap-4 lg:grid-cols-3">
          <CodePanel
            label="1 · Frontend selection state"
            code={SELECTION}
          />
          <CodePanel
            label="2 · CubeCom resolve"
            code={RESOLVED}
            tone="dark"
          />
          <CodePanel
            label="3 · commercetools cart projection"
            code={CART_ACTION}
            tone="dark"
          />
        </div>
        <Typography variant="support" tone="muted" className="max-w-3xl">
          Your frontend and design system stay yours. CubeCom owns configuration
          truth; commercetools remains catalog, cart, order, and OMS.
        </Typography>
      </Section.Body>
    </Section>
  );
}
