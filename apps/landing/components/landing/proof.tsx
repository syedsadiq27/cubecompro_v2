'use client';

import {
  Button,
  Card,
  DescriptionList,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
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
        eyebrow="Live proof"
        title="Change the product. Watch the sellable state follow."
        description="Configure the sofa in real time. Rules, visual scene, SKU, price, and inventory stay locked on one valid state."
      />

      <Section.Body gap="xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--canvas)] shadow-[0_20px_48px_-20px_rgba(14,15,18,0.18)] lg:col-span-7 lg:min-h-[580px]">
            <Stack
              direction="row"
              align="center"
              justify="between"
              className="relative z-10 border-b border-[var(--line)] bg-[var(--surface-pure)]/70 px-5 py-3.5 backdrop-blur-md"
            >
              <Stack direction="row" align="center" gap="sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--stage-violet)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--stage-violet)]" />
                </span>
                <Typography variant="mono" className="font-semibold tracking-wider text-[var(--ink)]">
                  Live Showroom Viewport
                </Typography>
              </Stack>
              <Typography
                as="span"
                variant="meta"
                tone="muted"
                className="hidden sm:inline"
              >
                Drag to orbit · Pinch to zoom
              </Typography>
            </Stack>

            <div className="relative min-h-[400px] flex-1 lg:min-h-[500px]">
              <SofaCanvas materials={resolved.materials} />
            </div>

            <Stack
              direction="row"
              align="center"
              justify="between"
              className="relative z-10 border-t border-[var(--line)] bg-[var(--surface-pure)]/80 px-5 py-2.5 backdrop-blur-md"
            >
              <Typography as="span" variant="code" className="normal-case tracking-normal text-[var(--text-secondary)]">
                {resolved.labels.frame} · {resolved.labels.fabric} · {resolved.labels.legs}
              </Typography>
              <Typography as="span" variant="code" tone="accent" className="font-semibold normal-case tracking-normal">
                {resolved.sku}
              </Typography>
            </Stack>
          </div>

          <Stack gap="md" className="lg:col-span-5">
            <Card padding="md" className="flex flex-1 flex-col border-[var(--border-strong)]">
              <Typography variant="mono" tone="accent" className="font-bold">
                Configuration Selector
              </Typography>

              <div className="mt-5 space-y-4">
                <div>
                  <Stack direction="row" align="center" justify="between">
                    <Typography as="span" variant="bodyStrong" className="text-[13px]">
                      Frame Material
                    </Typography>
                    <Typography as="span" variant="meta" tone="muted">
                      {resolved.labels.frame}
                    </Typography>
                  </Stack>
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
                  <Stack direction="row" align="center" justify="between">
                    <Typography as="span" variant="bodyStrong" className="text-[13px]">
                      Upholstery Fabric
                    </Typography>
                    <Typography as="span" variant="meta" tone="muted">
                      {resolved.labels.fabric}
                    </Typography>
                  </Stack>
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
                  <Stack direction="row" align="center" justify="between">
                    <Typography as="span" variant="bodyStrong" className="text-[13px]">
                      Leg Finish
                    </Typography>
                    <Typography as="span" variant="meta" tone="muted">
                      {resolved.labels.legs}
                    </Typography>
                  </Stack>
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

              <div className="mt-auto pt-6">
                <Button as={Link} href="/demo" variant="primary" size="lg" className="w-full">
                  Open full configurator demo →
                </Button>
              </div>
            </Card>

            <Card padding="sm" className="border-[var(--border-strong)]">
              <Typography variant="mono" tone="muted">
                Active Constraint Rules
              </Typography>
              {featuredRule ? (
                <Typography variant="prose" className="mt-2.5 max-w-none leading-snug text-[var(--ink)]">
                  <Typography as="span" variant="bodyStrong" tone="accent">
                    {featuredRule.when}
                  </Typography>
                  <Typography as="span" variant="meta" tone="muted">
                    {' '}
                    →{' '}
                  </Typography>
                  <Typography as="span" variant="body">
                    {featuredRule.then}
                  </Typography>
                </Typography>
              ) : (
                <Typography variant="prose" className="mt-2.5 max-w-none leading-snug">
                  All current options are compatible and valid.
                </Typography>
              )}
            </Card>

            <Card tone="ink" padding="sm" className="border-white/10 md:py-4">
              <Stack direction="row" align="center" justify="between">
                <Typography variant="mono" tone="accent" className="text-[var(--stage-violet-light)]">
                  Resolved Commerce State
                </Typography>
                <Typography as="span" variant="mono" tone="inverse" className="text-[10px]">
                  Synced
                </Typography>
              </Stack>
              <DescriptionList gap="sm" className="mt-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <Typography as="dt" variant="mono" tone="inverse" className="text-[10px]">
                    SKU
                  </Typography>
                  <Typography as="dd" variant="code" tone="inverse" className="mt-1 text-[13px] normal-case tracking-normal">
                    {resolved.sku}
                  </Typography>
                </div>
                <div>
                  <Typography as="dt" variant="mono" tone="inverse" className="text-[10px]">
                    Price
                  </Typography>
                  <Typography as="dd" variant="title" tone="inverse" className="mt-1 text-[17px]">
                    {formatPrice(resolved.price)}
                  </Typography>
                </div>
                <div>
                  <Typography as="dt" variant="mono" tone="inverse" className="text-[10px]">
                    Inventory
                  </Typography>
                  <Typography as="dd" variant="bodyStrong" tone="inverse" className="mt-1">
                    {resolved.inventory > 0
                      ? `${resolved.inventory} in stock`
                      : 'Out of stock'}
                  </Typography>
                </div>
              </DescriptionList>
            </Card>
          </Stack>
        </div>
      </Section.Body>
    </Section>
  );
}
