'use client';

import { ExperiencePanel } from '@repo/customizer-ui';
import { useConfiguration } from '../providers/configuration-provider';

export function ProductStep() {
  const { state } = useConfiguration();

  return (
    <ExperiencePanel
      eyebrow="Product"
      title={state.productName || 'Choose your base product'}
      description="Your product is loaded. Continue to make it yours."
    >
      <div className="rounded-2xl border border-[#e4e0d9] bg-white p-5 text-sm text-[#6f6b63]">
        {state.sku
          ? `${state.productName || 'Product'} · SKU ${state.sku}`
          : 'Select a model to begin.'}
      </div>
    </ExperiencePanel>
  );
}
