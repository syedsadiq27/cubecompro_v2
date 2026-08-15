'use client';

import { CommerceSummary } from '@/components/demo/shared/CommerceSummary';
import { ConfiguratorLayout } from '@/components/demo/shared/ConfiguratorLayout';
import Image from 'next/image';
import { useState } from 'react';

import { OptionPanel } from './OptionPanel';
import { SofaCanvas } from './SofaCanvas';
import type { ConfigurationState } from './types';
import { useSofaConfigurator } from './useSofaConfigurator';

type ConfiguratorShellProps = {
  initialState?: ConfigurationState;
  notice?: string | null;
};

const GALLERY_VIEWS = [
  { position: '64% 50%', label: 'Full sofa' },
  { position: '51% 50%', label: 'Frame detail' },
  { position: '31% 53%', label: 'Fabric detail' },
  { position: '78% 66%', label: 'Leg detail' },
];

export function ConfiguratorShell({
  initialState,
  notice = null,
}: ConfiguratorShellProps) {
  const [viewKey, setViewKey] = useState(0);
  const [activeView, setActiveView] = useState(0);
  const {
    state,
    resolved,
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

  const gallery = (
    <div className="absolute right-5 bottom-5 left-5 z-10 hidden items-center justify-center gap-2 md:flex">
      <button
        type="button"
        onClick={() =>
          setActiveView((view) =>
            view === 0 ? GALLERY_VIEWS.length - 1 : view - 1
          )
        }
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)]/90 px-3 py-4 shadow-sm backdrop-blur"
        aria-label="Previous view"
      >
        ‹
      </button>
      {GALLERY_VIEWS.map((view, index) => (
        <button
          key={view.label}
          type="button"
          onClick={() => setActiveView(index)}
          aria-label={view.label}
          aria-pressed={activeView === index}
          className={`relative h-20 w-28 overflow-hidden rounded-lg border-2 bg-[var(--surface-pure)] shadow-sm ${
            activeView === index
              ? 'border-[var(--stage-violet)]'
              : 'border-white'
          }`}
        >
          <Image
            src="/images/three-d-configurator-hero-v2.jpg"
            alt=""
            fill
            sizes="112px"
            className="object-cover"
            style={{ objectPosition: view.position }}
          />
        </button>
      ))}
      <button
        type="button"
        onClick={() =>
          setActiveView((view) => (view + 1) % GALLERY_VIEWS.length)
        }
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)]/90 px-3 py-4 shadow-sm backdrop-blur"
        aria-label="Next view"
      >
        ›
      </button>
    </div>
  );

  return (
    <ConfiguratorLayout
      active="sofa"
      demoLabel="Sofa"
      productName="Luma Sofa"
      productMeta="2 Seater"
      notice={notice}
      onReset={() => setViewKey((key) => key + 1)}
      stage={
        <SofaCanvas
          materials={resolved.materials}
          viewKey={viewKey}
          viewIndex={activeView}
        />
      }
      stageFooter={gallery}
    >
      <OptionPanel
        state={state}
        onFrame={setFrame}
        onFabric={setFabric}
        onLegs={setLegs}
        isFrameDisabled={isFrameOptionDisabled}
        isFabricDisabled={isFabricOptionDisabled}
        isLegsDisabled={isLegsOptionDisabled}
      />

      <CommerceSummary
        sku={resolved.sku}
        price={resolved.price}
        inventory={resolved.inventory}
        configuration={`${resolved.labels.frame} · ${resolved.labels.fabric} · ${resolved.labels.legs}`}
        copied={copied}
        addedToCart={addedToCart}
        onCopyShareLink={copyShareLink}
        onAddToCart={addToCart}
      />
    </ConfiguratorLayout>
  );
}
