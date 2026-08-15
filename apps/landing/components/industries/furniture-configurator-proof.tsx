'use client';

import {
  Button,
  DescriptionList,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { FABRICS, FRAMES, LEGS } from '@/components/demo/sofa/catalog';
import { SofaCanvas } from '@/components/demo/sofa/SofaCanvas';
import { useSofaConfigurator } from '@/components/demo/sofa/useSofaConfigurator';

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
      className={`relative h-9 w-9 overflow-hidden rounded-full border transition ${
        disabled
          ? 'cursor-not-allowed border-[var(--border-strong)] opacity-70'
          : selected
            ? 'border-[var(--ink)] ring-[3px] ring-[var(--stage-violet)]/55'
            : 'border-[var(--border-strong)] hover:border-[var(--ink)]/50'
      }`}
      style={{ backgroundColor: swatch }}
    >
      {disabled ? (
        <span aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--ink)]/80" />
          <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-[var(--ink)]/80" />
        </span>
      ) : null}
    </button>
  );
}

export function FurnitureConfiguratorProof() {
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

  const featuredRule =
    PRODUCT_RULES.find((rule) => rule.isActive(state)) ?? null;

  return (
    <Section id="proof" tone="soft" spacing="default">
      <Section.Header
        eyebrow="Category depth"
        title="Furniture catalogs explode. Photography does not scale."
        description="Configure frame, fabric, and legs on a real sofa. Legal looks resolve to SKU, price, and inventory — without photographing every combination."
      />

      <Section.Body gap="lg">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--canvas)] lg:col-span-7 lg:min-h-[560px]">
            <div className="absolute inset-0">
              <SofaCanvas materials={resolved.materials} />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--surface-pure)]/85 px-4 py-2.5 backdrop-blur-md">
              <Typography
                as="span"
                variant="code"
                className="normal-case tracking-normal text-[var(--text-secondary)]"
              >
                {resolved.labels.frame} · {resolved.labels.fabric} ·{' '}
                {resolved.labels.legs}
              </Typography>
              <Typography
                as="span"
                variant="code"
                tone="accent"
                className="font-semibold normal-case tracking-normal"
              >
                {resolved.sku}
              </Typography>
            </div>
          </div>

          <Stack gap="lg" className="min-w-0 lg:col-span-5">
            <div>
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Frame
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  {resolved.labels.frame}
                </Typography>
              </Stack>
              <div className="mt-2.5 flex flex-wrap gap-2">
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

            <div className="border-t border-[var(--line)] pt-5">
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Fabric
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  {resolved.labels.fabric}
                </Typography>
              </Stack>
              <div className="mt-2.5 flex flex-wrap gap-2">
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

            <div className="border-t border-[var(--line)] pt-5">
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Legs
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  {resolved.labels.legs}
                </Typography>
              </Stack>
              <div className="mt-2.5 flex flex-wrap gap-2">
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

            <div className="border-t border-[var(--line)] pt-5">
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Dimensions
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  Fixed for this SKU family
                </Typography>
              </Stack>
              <Typography variant="body" className="mt-2.5">
                84″ W · 36″ D · 33″ H
              </Typography>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Typography variant="mono" tone="muted">
                Active constraint
              </Typography>
              {featuredRule ? (
                <Typography variant="body" className="mt-2">
                  <Typography as="span" variant="bodyStrong" tone="accent">
                    {featuredRule.when}
                  </Typography>
                  <Typography as="span" variant="meta" tone="muted">
                    {' '}
                    →{' '}
                  </Typography>
                  {featuredRule.then}
                </Typography>
              ) : (
                <Typography variant="support" className="mt-2">
                  All current options are compatible.
                </Typography>
              )}
            </div>

            <div
              className="rounded-2xl border border-white/10 bg-[var(--ink)] px-4 py-4"
              data-surface-tone="ink"
            >
              <Stack direction="row" align="center" justify="between">
                <Typography
                  variant="mono"
                  tone="accent"
                  className="text-[var(--stage-violet-light)]"
                >
                  Resolved state
                </Typography>
                <Typography as="span" variant="mono" tone="inverse" className="text-[10px]">
                  Synced
                </Typography>
              </Stack>
              <DescriptionList gap="sm" className="mt-3 sm:grid-cols-3">
                <div>
                  <Typography as="dt" variant="mono" tone="inverse" className="text-[10px]">
                    SKU
                  </Typography>
                  <Typography
                    as="dd"
                    variant="code"
                    tone="inverse"
                    className="mt-1 normal-case tracking-normal"
                  >
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
            </div>

            <Button as={Link} href="/demo" variant="primary" size="lg" className="w-full">
              Open full sofa demo →
            </Button>
          </Stack>
        </div>
      </Section.Body>
    </Section>
  );
}
