'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  applyPcConstraints,
  explainBlocked,
  isFabricBlocked,
  isLegsBlocked,
  isSizeBlocked,
  PC_DEFAULT,
  PC_FABRICS,
  PC_LEGS,
  PC_SIZES,
  resolvePc,
  type PcState,
} from './pc-logic';
import { materialsFromPcState } from './pc-materials';

const SofaCanvas = dynamic(
  () =>
    import('@/components/demo/sofa/SofaCanvas').then((mod) => mod.SofaCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[260px] items-center justify-center bg-[var(--surface)] text-sm text-[var(--text-muted)]">
        Loading product…
      </div>
    ),
  }
);

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PcExample() {
  const [state, setState] = useState<PcState>(PC_DEFAULT);
  const [notice, setNotice] = useState<string | null>(null);
  const [flash, setFlash] = useState(0);
  const resolved = useMemo(() => resolvePc(state), [state]);
  const materials = useMemo(() => materialsFromPcState(state), [state]);

  useEffect(() => {
    setFlash((value) => value + 1);
  }, [resolved.sku, resolved.price]);

  const commit = (next: PcState) => {
    const result = applyPcConstraints(next);
    setState(result.state);
    setNotice(result.rewritten);
  };

  return (
    <section className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-10 md:px-8 md:py-16">
        <p className="text-sm text-[var(--text-muted)]">Concrete example</p>
        <h2 className="type-page mt-3 max-w-3xl text-[clamp(1.85rem,3.5vw,2.6rem)]">
          Configure a sofa
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-base">
          Change options and watch product and commerce update together. Tap a
          blocked option to see why.
        </p>

        <div className="mt-8 grid gap-4 md:mt-10 md:gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.35fr)_minmax(0,0.78fr)]">
          <div className="order-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 md:p-5 lg:order-1">
            <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--text-muted)] uppercase">
              Configuration
            </p>
            <div className="mt-5 space-y-5">
              <MiniGroup label="Fabric">
                {PC_FABRICS.map((option) => (
                  <MiniChip
                    key={option.id}
                    label={option.label}
                    swatch={option.swatch}
                    active={state.fabric === option.id}
                    blocked={isFabricBlocked(state, option.id)}
                    onClick={() => {
                      if (isFabricBlocked(state, option.id)) {
                        setNotice(
                          explainBlocked(state, 'fabric', option.id)
                        );
                        return;
                      }
                      commit({ ...state, fabric: option.id });
                    }}
                  />
                ))}
              </MiniGroup>
              <MiniGroup label="Size">
                {PC_SIZES.map((option) => (
                  <MiniChip
                    key={option.id}
                    label={option.label}
                    active={state.size === option.id}
                    blocked={isSizeBlocked(state, option.id)}
                    onClick={() => {
                      if (isSizeBlocked(state, option.id)) {
                        setNotice(explainBlocked(state, 'size', option.id));
                        return;
                      }
                      commit({ ...state, size: option.id });
                    }}
                  />
                ))}
              </MiniGroup>
              <MiniGroup label="Legs">
                {PC_LEGS.map((option) => (
                  <MiniChip
                    key={option.id}
                    label={option.label}
                    swatch={option.swatch}
                    active={state.legs === option.id}
                    blocked={isLegsBlocked(state, option.id)}
                    onClick={() => {
                      if (isLegsBlocked(state, option.id)) {
                        setNotice(explainBlocked(state, 'legs', option.id));
                        return;
                      }
                      commit({ ...state, legs: option.id });
                    }}
                  />
                ))}
              </MiniGroup>
            </div>
            {notice ? (
              <p className="mt-5 border-t border-[var(--line)] pt-4 text-xs leading-relaxed text-[var(--ink)]">
                {notice}
              </p>
            ) : null}
          </div>

          <div className="relative order-1 min-h-[260px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] md:min-h-[340px] lg:order-2 lg:min-h-[460px]">
            <div className="absolute inset-0">
              <SofaCanvas materials={materials} />
            </div>
            <div className="pointer-events-none absolute top-4 left-4 rounded-lg bg-[var(--surface-pure)]/85 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur">
              Live product
            </div>
          </div>

          <div className="order-3 rounded-2xl border border-[var(--ink)] bg-[var(--ink)] p-4 text-[var(--canvas)] md:p-5 lg:order-3">
            <p className="text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
              Resolved output
            </p>
            <dl
              key={flash}
              className="pc-resolve-flash mt-4 space-y-3 font-mono text-sm md:mt-5 md:space-y-4"
            >
              {[
                ['SKU', resolved.sku],
                ['Price', formatPrice(resolved.price)],
                [
                  'Inventory',
                  resolved.inventory > 0
                    ? String(resolved.inventory)
                    : '0',
                ],
                ['Valid', 'Yes'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3"
                >
                  <dt className="font-sans text-white/50">{label}</dt>
                  <dd className="text-right text-base">{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/demo"
              className="mt-8 inline-flex rounded-lg bg-[var(--canvas)] px-4 py-2.5 text-sm font-medium text-[var(--ink)]"
            >
              Open full sofa demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] tracking-[0.08em] text-[var(--text-muted)] uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MiniChip({
  label,
  swatch,
  active,
  blocked,
  onClick,
}: {
  label: string;
  swatch?: string;
  active: boolean;
  blocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={blocked}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition ${
        blocked
          ? 'border-[var(--line)] text-[var(--text-muted)] line-through opacity-45 hover:opacity-70'
          : active
            ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
            : 'border-[var(--border-strong)] text-[var(--ink)] hover:border-[var(--ink)]'
      }`}
    >
      {swatch ? (
        <span
          className="h-2.5 w-2.5 rounded-full border border-black/10"
          style={{ background: swatch }}
        />
      ) : null}
      {label}
    </button>
  );
}
