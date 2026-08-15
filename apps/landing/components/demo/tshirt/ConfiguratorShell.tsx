'use client';

import { CommerceSummary } from '@/components/demo/shared/CommerceSummary';
import { ConfiguratorLayout } from '@/components/demo/shared/ConfiguratorLayout';
import { useState } from 'react';

import { OptionPanel } from './OptionPanel';
import { TshirtCanvas } from './TshirtCanvas';
import type { ConfigurationState } from './types';
import { useTshirtConfigurator } from './useTshirtConfigurator';

type ConfiguratorShellProps = {
  initialState?: ConfigurationState;
  notice?: string | null;
};

export function ConfiguratorShell({
  initialState,
  notice = null,
}: ConfiguratorShellProps) {
  const [viewKey, setViewKey] = useState(0);
  const {
    state,
    resolved,
    copied,
    addedToCart,
    setColor,
    setFit,
    setSize,
    isColorOptionDisabled,
    isFitOptionDisabled,
    isSizeOptionDisabled,
    copyShareLink,
    addToCart,
  } = useTshirtConfigurator({ initialState });

  return (
    <ConfiguratorLayout
      active="tshirt"
      demoLabel="T-shirt"
      productName="Core Tee"
      productMeta="Premium cotton"
      notice={notice}
      onReset={() => setViewKey((key) => key + 1)}
      stage={
        <TshirtCanvas
          materials={resolved.materials}
          fitScale={resolved.fitScale}
          viewKey={viewKey}
        />
      }
    >
      <OptionPanel
        state={state}
        onColor={setColor}
        onFit={setFit}
        onSize={setSize}
        isColorDisabled={isColorOptionDisabled}
        isFitDisabled={isFitOptionDisabled}
        isSizeDisabled={isSizeOptionDisabled}
      />

      <CommerceSummary
        sku={resolved.sku}
        price={resolved.price}
        inventory={resolved.inventory}
        configuration={`${resolved.labels.color} · ${resolved.labels.fit} · ${resolved.labels.size}`}
        copied={copied}
        addedToCart={addedToCart}
        onCopyShareLink={copyShareLink}
        onAddToCart={addToCart}
      />
    </ConfiguratorLayout>
  );
}
