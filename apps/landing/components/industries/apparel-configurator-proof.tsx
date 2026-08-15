'use client';

import {
  Button,
  DescriptionList,
  Section,
  Stack,
  Typography,
} from '@repo/ui';
import Link from 'next/link';

import { COLORS, FITS, SIZES } from '@/components/demo/tshirt/catalog';
import { TshirtCanvas } from '@/components/demo/tshirt/TshirtCanvas';
import { useTshirtConfigurator } from '@/components/demo/tshirt/useTshirtConfigurator';

const PRODUCT_RULES = [
  {
    id: 'oversized-s',
    when: 'Oversized fit',
    then: 'Size S blocked',
    isActive: (state: { fit: string; size: string }) =>
      state.fit === 'oversized',
  },
  {
    id: 'heather-oversized',
    when: 'Heather color',
    then: 'Oversized fit blocked',
    isActive: (state: { color: string }) => state.color === 'heather',
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

function ChipButton({
  label,
  selected,
  disabled,
  onSelect,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        disabled
          ? 'cursor-not-allowed border-[var(--line)] text-[var(--text-muted)] opacity-50'
          : selected
            ? 'border-[var(--stage-violet)] bg-[var(--stage-violet)]/10 text-[var(--ink)]'
            : 'border-[var(--line)] bg-[var(--surface-pure)] hover:border-[var(--ink)]/30'
      }`}
    >
      {label}
    </button>
  );
}

export function ApparelConfiguratorProof() {
  const {
    state,
    resolved,
    setColor,
    setFit,
    setSize,
    isColorOptionDisabled,
    isFitOptionDisabled,
    isSizeOptionDisabled,
  } = useTshirtConfigurator();

  const featuredRule =
    PRODUCT_RULES.find((rule) => rule.isActive(state)) ?? null;

  return (
    <Section id="proof" tone="soft" spacing="default">
      <Section.Header
        eyebrow="Live apparel proof"
        title="Color + fit + size becomes a sellable state."
        description="Configure the tee in real time. Availability rules rewrite illegal combinations before they reach cart."
      />

      <Section.Body gap="lg">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] lg:col-span-7 lg:min-h-[520px]">
            <div className="absolute inset-0">
              <TshirtCanvas
                materials={resolved.materials}
                fitScale={resolved.fitScale}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--surface-pure)]/90 px-4 py-2.5">
              <Typography
                as="span"
                variant="code"
                className="normal-case tracking-normal text-[var(--text-secondary)]"
              >
                {resolved.labels.color} · {resolved.labels.fit} ·{' '}
                {resolved.labels.size}
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
              <Typography as="span" variant="bodyStrong">
                Color
              </Typography>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <SwatchButton
                    key={color.id}
                    label={color.label}
                    swatch={color.swatch}
                    selected={state.color === color.id}
                    disabled={isColorOptionDisabled(color.id)}
                    onSelect={() => setColor(color.id)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Typography as="span" variant="bodyStrong">
                Fit
              </Typography>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {FITS.map((fit) => (
                  <ChipButton
                    key={fit.id}
                    label={fit.label}
                    selected={state.fit === fit.id}
                    disabled={isFitOptionDisabled(fit.id)}
                    onSelect={() => setFit(fit.id)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Typography as="span" variant="bodyStrong">
                Size
              </Typography>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <ChipButton
                    key={size.id}
                    label={size.label}
                    selected={state.size === size.id}
                    disabled={isSizeOptionDisabled(size.id)}
                    onSelect={() => setSize(size.id)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Decoration
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  None
                </Typography>
              </Stack>
              <Typography variant="support" className="mt-2">
                Logo / print attach on the same graph when they change what you sell.
              </Typography>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Stack direction="row" align="center" justify="between">
                <Typography as="span" variant="bodyStrong">
                  Placement
                </Typography>
                <Typography as="span" variant="meta" tone="muted">
                  —
                </Typography>
              </Stack>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <Typography variant="mono" tone="muted">
                Availability rule
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
                  Current color, fit, and size are stockable.
                </Typography>
              )}
            </div>

            <div
              className="rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-4"
              data-surface-tone="ink"
            >
              <Typography
                variant="mono"
                tone="accent"
                className="text-[var(--stage-violet-light)]"
              >
                Resolved variant
              </Typography>
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
                      ? `${resolved.inventory} available`
                      : 'Out of stock'}
                  </Typography>
                </div>
              </DescriptionList>
            </div>

            <Button
              as={Link}
              href="/demo/tshirt"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Open full tee demo →
            </Button>
          </Stack>
        </div>
      </Section.Body>
    </Section>
  );
}
