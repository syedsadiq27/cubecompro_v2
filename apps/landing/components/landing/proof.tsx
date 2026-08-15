'use client';

import { Button, Card, Section, Typography } from '@repo/ui';
import Link from 'next/link';

import { FABRICS, FRAMES, LEGS } from '../demo/sofa/catalog';
import { SofaCanvas } from '../demo/sofa/SofaCanvas';
import { useSofaConfigurator } from '../demo/sofa/useSofaConfigurator';

const PRODUCT_RULES = [
  {
    id: 'leather-black',
    when: 'Leather fabric',
    then: 'Black frame blocked',
    isActive: (state: { fabric: string; frame: string }) =>
      state.fabric === 'leather',
  },
  {
    id: 'black-forest',
    when: 'Black frame',
    then: 'Forest fabric blocked',
    isActive: (state: { fabric: string; frame: string }) =>
      state.frame === 'black',
  },
  {
    id: 'black-brass',
    when: 'Black frame',
    then: 'Brass legs blocked',
    isActive: (state: { fabric: string; frame: string }) =>
      state.frame === 'black',
  },
] as const;
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function SwatchButton({
  label,
  swatch,
  selected,
  disabled,
  onSelect,
}: {
  label: string;
  swatch: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      title={disabled ? `${label} — not available` : label}
      aria-label={label}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={`relative h-10 w-10 overflow-hidden rounded-full border transition ${
        disabled
          ? 'cursor-not-allowed border-[var(--border-strong)] opacity-70'
          : selected
            ? 'border-[var(--ink)] ring-[3px] ring-[var(--stage-violet)]/55'
            : 'border-[var(--border-strong)] hover:border-[var(--ink)]/50'
      }`}
      style={{ backgroundColor: swatch }}
    >
      {disabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--ink)]/80" />
          <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-[var(--ink)]/80" />
        </span>
      ) : null}
    </button>
  );
}

export function Proof() {
  const {
    state,
    resolved,
    setFrame,
    setFabric,
    setLegs,
    isFrameOptionDisabled,
    isFabricOptionDisabled,
    isLegsOptionDisabled,
  } = useSofaConfigurator();

  const activeRules = PRODUCT_RULES.filter((rule) => rule.isActive(state));
  const featuredRule = activeRules[0] ?? null;
  return (
    <Section id="proof" tone="canvas" spacing="default">
      <Section.Header
        title="Change the product. Watch the sellable state follow."
        description="Configure the sofa. Rules, scene, SKU, price, and inventory stay on one valid state."
      />

      <Section.Body gap="spacious">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <Card className="relative min-h-[480px] overflow-hidden lg:min-h-[580px]">
            <div className="cube-stage absolute inset-0" aria-hidden>
              <div className="cube-stage-field" />
            </div>
            <div className="relative h-full min-h-[480px] lg:min-h-[580px]">
              <SofaCanvas materials={resolved.materials} />
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card
              padding="md"
              className="flex flex-1 flex-col"
            >
              <Typography variant="mono" tone="secondary">
                Configure
              </Typography>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[13px] font-medium text-[var(--ink)]">
                    Frame
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {FRAMES.map((frame) => (
                      <SwatchButton
                        key={frame.id}
                        label={`Frame ${frame.label}`}
                        swatch={frame.swatch}
                        selected={state.frame === frame.id}
                        disabled={isFrameOptionDisabled(frame.id)}
                        onSelect={() => setFrame(frame.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--line)] pt-4">
                  <p className="text-[13px] font-medium text-[var(--ink)]">
                    Fabric
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {FABRICS.map((fabric) => (
                      <SwatchButton
                        key={fabric.id}
                        label={`Fabric ${fabric.label}`}
                        swatch={fabric.swatch}
                        selected={state.fabric === fabric.id}
                        disabled={isFabricOptionDisabled(fabric.id)}
                        onSelect={() => setFabric(fabric.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--line)] pt-4">
                  <p className="text-[13px] font-medium text-[var(--ink)]">
                    Legs
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {LEGS.map((leg) => (
                      <SwatchButton
                        key={leg.id}
                        label={`Legs ${leg.label}`}
                        swatch={leg.swatch}
                        selected={state.legs === leg.id}
                        disabled={isLegsOptionDisabled(leg.id)}
                        onSelect={() => setLegs(leg.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm text-[var(--text-secondary)]">
                {resolved.labels.frame} · {resolved.labels.fabric} ·{' '}
                {resolved.labels.legs}
              </p>
              <div className="mt-auto pt-6">
                <Button as={Link} href="/demo" variant="primary" size="lg" className="w-fit">
                  Open full demo
                </Button>
              </div>
            </Card>

            <Card padding="sm">
              <Typography variant="mono" tone="secondary">
                Rules
              </Typography>
              {featuredRule ? (
                <p className="mt-3 text-[14px] leading-snug text-[var(--ink)]">
                  <span className="font-medium">{featuredRule.when}</span>
                  <span className="text-[var(--text-muted)]"> → </span>
                  <span>{featuredRule.then}</span>
                </p>
              ) : (
                <p className="mt-3 text-[14px] leading-snug text-[var(--text-secondary)]">
                  All current options are compatible.
                </p>
              )}
              <p className="mt-2 text-[12px] text-[var(--text-muted)]">
                {featuredRule
                  ? `${PRODUCT_RULES.length - 1} more constraints`
                  : `${PRODUCT_RULES.length} constraints on this product`}
              </p>
            </Card>
            <Card variant="ink" padding="sm" className="md:py-4">
              <Typography variant="mono" tone="ink">
                Sellable state
              </Typography>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.08em] text-white/40 uppercase">
                    SKU
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-white">
                    {resolved.sku}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.08em] text-white/40 uppercase">
                    Price
                  </dt>
                  <dd className="mt-1 text-[17px] font-semibold tracking-tight text-white">
                    {formatPrice(resolved.price)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.08em] text-white/40 uppercase">
                    Inventory
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium text-white">
                    {resolved.inventory > 0
                      ? `${resolved.inventory} available`
                      : 'Out of stock'}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </Section.Body>
    </Section>
  );
}
