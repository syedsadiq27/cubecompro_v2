'use client';

import Link from 'next/link';
import { Wordmark } from '@repo/ui/wordmark';
import { FABRICS, FRAMES, LEGS } from '../demo/sofa/catalog';
import { SofaCanvas } from '../demo/sofa/SofaCanvas';
import { useSofaConfigurator } from '../demo/sofa/useSofaConfigurator';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function Hero() {
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
    <section id="home" className="relative text-[var(--ink)]">
      <div className="cube-stage absolute inset-0" aria-hidden>
        <div className="cube-stage-field landing-plane-pulse" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-3.75rem)] max-w-[90rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="landing-rise flex flex-col justify-center px-5 py-12 md:px-8 md:py-16 lg:py-20">
          <Wordmark size="lg" showPro className="landing-brand-in" />
          <p className="mt-5 text-sm tracking-[0.02em] text-[var(--text-muted)]">
            3D Product Configuration Platform for Ecommerce
          </p>
          <h1 className="type-hero mt-4 max-w-[16ch] text-[clamp(2.35rem,5vw,3.6rem)]">
            Stage the product. Sell the state.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-[17px]">
            Turn product data into interactive, rule-bound 3D experiences where
            every configuration resolves to SKU, price, inventory, and cart.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink)]/90"
            >
              Open live demo
            </Link>
            <Link
              href="/#contact"
              className="rounded-lg border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              Book a solution session
            </Link>
          </div>

          <div className="mt-12 max-w-md border-t border-[var(--line)] pt-6">
            <p className="text-[11px] font-medium tracking-[0.04em] text-[var(--text-muted)]">
              Live proof — this sofa
            </p>
            <dl className="mt-3 space-y-2 font-mono text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">SKU</dt>
                <dd>{resolved.sku}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Price</dt>
                <dd>{formatPrice(resolved.price)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">Inventory</dt>
                <dd>
                  {resolved.inventory > 0
                    ? `${resolved.inventory} available`
                    : 'Out of stock'}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  disabled={isFrameOptionDisabled(frame.id)}
                  onClick={() => setFrame(frame.id)}
                  title={frame.label}
                  aria-label={`Frame ${frame.label}`}
                  aria-pressed={state.frame === frame.id}
                  className={`h-8 w-8 rounded-full border transition disabled:opacity-30 ${
                    state.frame === frame.id
                      ? 'border-[var(--ink)] ring-2 ring-[var(--stage-violet)]/35'
                      : 'border-[var(--border-strong)]'
                  }`}
                  style={{ backgroundColor: frame.swatch }}
                />
              ))}
              <span className="mx-1 h-8 w-px bg-[var(--line)]" />
              {FABRICS.map((fabric) => (
                <button
                  key={fabric.id}
                  type="button"
                  disabled={isFabricOptionDisabled(fabric.id)}
                  onClick={() => setFabric(fabric.id)}
                  title={fabric.label}
                  aria-label={`Fabric ${fabric.label}`}
                  aria-pressed={state.fabric === fabric.id}
                  className={`h-8 w-8 rounded-full border transition disabled:opacity-30 ${
                    state.fabric === fabric.id
                      ? 'border-[var(--ink)] ring-2 ring-[var(--stage-violet)]/35'
                      : 'border-[var(--border-strong)]'
                  }`}
                  style={{ backgroundColor: fabric.swatch }}
                />
              ))}
              <span className="mx-1 h-8 w-px bg-[var(--line)]" />
              {LEGS.map((leg) => (
                <button
                  key={leg.id}
                  type="button"
                  disabled={isLegsOptionDisabled(leg.id)}
                  onClick={() => setLegs(leg.id)}
                  title={leg.label}
                  aria-label={`Legs ${leg.label}`}
                  aria-pressed={state.legs === leg.id}
                  className={`h-8 w-8 rounded-full border transition disabled:opacity-30 ${
                    state.legs === leg.id
                      ? 'border-[var(--ink)] ring-2 ring-[var(--stage-violet)]/35'
                      : 'border-[var(--border-strong)]'
                  }`}
                  style={{ backgroundColor: leg.swatch }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              {resolved.labels.frame} · {resolved.labels.fabric} ·{' '}
              {resolved.labels.legs}
            </p>
          </div>
        </div>

        <div className="relative min-h-[52vh] lg:min-h-0">
          <div className="absolute inset-0 cube-stage lg:border-l lg:border-[var(--line)]/60">
            <div className="cube-stage-field" />
          </div>
          <div className="relative h-full min-h-[52vh] lg:min-h-full">
            <SofaCanvas materials={resolved.materials} />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
              <span className="rounded-lg bg-[var(--surface-pure)]/80 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur">
                Drag to orbit
              </span>
              <Link
                href="/demo"
                className="pointer-events-auto rounded-lg bg-[var(--ink)] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[var(--ink)]/90"
              >
                Full demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
