'use client';

import Link from 'next/link';
import { Button, Card, DescriptionList, Typography } from '@repo/ui';
import { FABRICS, FRAMES, LEGS } from '@/components/demo/sofa/catalog';
import { SofaCanvas } from '@/components/demo/sofa/SofaCanvas';
import { useSofaConfigurator } from '@/components/demo/sofa/useSofaConfigurator';
import { COLORS, FITS, SIZES } from '@/components/demo/tshirt/catalog';
import { TshirtCanvas } from '@/components/demo/tshirt/TshirtCanvas';
import { useTshirtConfigurator } from '@/components/demo/tshirt/useTshirtConfigurator';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function SeoDemoEmbed({
  product = 'sofa',
}: {
  product?: 'sofa' | 'tshirt';
}) {
  if (product === 'tshirt') {
    return <TshirtSeoEmbed />;
  }
  return <SofaSeoEmbed />;
}

function SofaSeoEmbed() {
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

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative min-h-[280px] bg-[var(--surface)] lg:min-h-[420px]">
          <div className="absolute inset-0 cube-stage">
            <div className="cube-stage-field" />
          </div>
          <div className="relative h-full min-h-[280px] lg:min-h-[420px]">
            <SofaCanvas materials={resolved.materials} />
          </div>
        </div>
        <div className="flex flex-col gap-5 border-t border-[var(--line)] p-5 lg:border-t-0 lg:border-l lg:p-6">
          <div>
            <Typography variant="label">Live configuration</Typography>
            <Typography variant="support" className="mt-1">
              {resolved.labels.frame} / {resolved.labels.fabric} /{' '}
              {resolved.labels.legs}
            </Typography>
          </div>

          <ResolvedCommerce
            sku={resolved.sku}
            price={resolved.price}
            inventory={resolved.inventory}
          />

          <OptionRow
            label="Frame"
            options={FRAMES}
            value={state.frame}
            disabled={isFrameOptionDisabled}
            onChange={setFrame}
          />
          <OptionRow
            label="Fabric"
            options={FABRICS}
            value={state.fabric}
            disabled={isFabricOptionDisabled}
            onChange={setFabric}
          />
          <OptionRow
            label="Legs"
            options={LEGS}
            value={state.legs}
            disabled={isLegsOptionDisabled}
            onChange={setLegs}
          />

          <Button as={Link} href="/demo" variant="primary" size="md" className="self-start">
            Open full sofa demo
          </Button>
        </div>
      </div>
    </div>
  );
}

function TshirtSeoEmbed() {
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

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative min-h-[280px] bg-[var(--surface)] lg:min-h-[420px]">
          <div className="relative h-full min-h-[280px] lg:min-h-[420px]">
            <TshirtCanvas
              materials={resolved.materials}
              fitScale={resolved.fitScale}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 border-t border-[var(--line)] p-5 lg:border-t-0 lg:border-l lg:p-6">
          <div>
            <Typography variant="label">Live configuration</Typography>
            <Typography variant="support" className="mt-1">
              {resolved.labels.color} / {resolved.labels.fit} /{' '}
              {resolved.labels.size}
            </Typography>
          </div>

          <ResolvedCommerce
            sku={resolved.sku}
            price={resolved.price}
            inventory={resolved.inventory}
          />

          <OptionRow
            label="Color"
            options={COLORS}
            value={state.color}
            disabled={isColorOptionDisabled}
            onChange={setColor}
          />
          <OptionRow
            label="Fit"
            options={FITS}
            value={state.fit}
            disabled={isFitOptionDisabled}
            onChange={setFit}
          />
          <OptionRow
            label="Size"
            options={SIZES}
            value={state.size}
            disabled={isSizeOptionDisabled}
            onChange={setSize}
          />

          <Button
            as={Link}
            href="/demo/tshirt"
            variant="primary"
            size="md"
            className="self-start"
          >
            Open full tee demo
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResolvedCommerce({
  sku,
  price,
  inventory,
}: {
  sku: string;
  price: number;
  inventory: number;
}) {
  return (
    <Card
      tone="canvas"
      padding="xs"
      radius="md"
      className="border-[var(--border-strong)] !px-3"
    >
      <Typography variant="label">Commerce resolve</Typography>
      <DescriptionList gap="xs" className="mt-2.5">
        <div className="flex justify-between gap-3">
          <Typography as="dt" variant="meta" tone="muted">
            SKU
          </Typography>
          <Typography as="dd" variant="code" className="normal-case tracking-normal">
            {sku}
          </Typography>
        </div>
        <div className="flex justify-between gap-3">
          <Typography as="dt" variant="meta" tone="muted">
            Price
          </Typography>
          <Typography as="dd" variant="bodyStrong">
            {formatPrice(price)}
          </Typography>
        </div>
        <div className="flex justify-between gap-3">
          <Typography as="dt" variant="meta" tone="muted">
            Inventory
          </Typography>
          <Typography as="dd" variant="bodyStrong">
            {inventory > 0 ? `${inventory} in stock` : 'Out of stock'}
          </Typography>
        </div>
      </DescriptionList>
    </Card>
  );
}

function OptionRow<T extends string>({
  label,
  options,
  value,
  disabled,
  onChange,
}: {
  label: string;
  options: Array<{ id: T; label: string }>;
  value: T;
  disabled: (id: T) => boolean;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <Typography variant="label" className="mb-2">
        {label}
      </Typography>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isDisabled = disabled(option.id);
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option.id)}
              className={`rounded-md border px-2.5 py-1.5 text-xs ${
                active
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                  : 'border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)]'
              } ${isDisabled ? 'cursor-not-allowed opacity-35' : ''}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
