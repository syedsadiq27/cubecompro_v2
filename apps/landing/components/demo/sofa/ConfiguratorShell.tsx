'use client';

import Link from 'next/link';
import { Wordmark } from '@repo/ui/wordmark';
import { CommercePanel } from './CommercePanel';
import { OptionPanel } from './OptionPanel';
import { SofaCanvas } from './SofaCanvas';
import { useSofaConfigurator } from './useSofaConfigurator';
import type { ConfigurationState } from './types';

type ConfiguratorShellProps = {
  initialState?: ConfigurationState;
  notice?: string | null;
};

export function ConfiguratorShell({
  initialState,
  notice = null,
}: ConfiguratorShellProps) {
  const {
    state,
    resolved,
    shareId,
    copied,
    addedToCart,
    setFrame,
    setFabric,
    setLegs,
    isFrameOptionDisabled,
    isFabricOptionDisabled,
    isLegsOptionDisabled,
    copyShareLink,
    addToCart,
  } = useSofaConfigurator({ initialState });

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4 md:px-8">
        <div>
          <Link href="/" aria-label="CubeCom Pro home">
            <Wordmark size="nav" showPro />
          </Link>
          <p className="mt-1 text-xs tracking-wide text-[var(--text-muted)]">
            Sofa · live configurator
          </p>
        </div>
        <Link
          href="/"
          className="type-nav text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
        >
          Home
        </Link>
      </header>

      {notice ? (
        <div className="border-b border-[var(--warning)]/30 bg-[var(--warning-soft)] px-5 py-2.5 text-sm text-[var(--warning)] md:px-8">
          {notice}
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1.4fr_1fr]">
        <section className="relative min-h-[48vh] border-b border-[var(--line)] bg-[var(--surface)] lg:min-h-[calc(100vh-4.5rem)] lg:border-r lg:border-b-0">
          <SofaCanvas materials={resolved.materials} />
          <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-lg bg-[var(--surface-pure)]/85 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur">
            Drag to orbit
          </div>
        </section>

        <section className="flex flex-col gap-8 bg-[var(--surface)] px-5 py-6 md:px-8 md:py-8">
          <div>
            <h1 className="type-page text-[clamp(1.75rem,3vw,2.5rem)]">
              Change the product. Watch commerce follow.
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Options, constraints, shareable state, and cart resolution — the
              working product graph, not a slideshow.
            </p>
          </div>

          <OptionPanel
            state={state}
            onFrame={setFrame}
            onFabric={setFabric}
            onLegs={setLegs}
            isFrameDisabled={isFrameOptionDisabled}
            isFabricDisabled={isFabricOptionDisabled}
            isLegsDisabled={isLegsOptionDisabled}
          />

          <CommercePanel
            resolved={resolved}
            shareId={shareId}
            copied={copied}
            addedToCart={addedToCart}
            onCopyShareLink={copyShareLink}
            onAddToCart={addToCart}
          />
        </section>
      </div>
    </div>
  );
}
