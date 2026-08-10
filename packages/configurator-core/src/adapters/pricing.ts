import type { ConfigurationState } from '../configuration';
import {
  createUnresolvedPrice,
  type PriceAdjustment,
  type PriceState,
} from '../pricing';

export type PricingAdapter = {
  resolvePrice: (state: ConfigurationState) => Promise<PriceState> | PriceState;
};

export function createStubPricingAdapter(options?: {
  base?: number;
  currency?: string;
  decorationAmount?: number;
}): PricingAdapter {
  const base = options?.base ?? 24;
  const currency = options?.currency ?? 'USD';
  const decorationAmount = options?.decorationAmount ?? 7.5;

  return {
    resolvePrice(state) {
      const adjustments: PriceAdjustment[] = [];
      const hasDecoration = state.decorations.some(
        (entry) => Boolean(entry.logoName) || Boolean(entry.text)
      );
      if (hasDecoration) {
        adjustments.push({
          id: 'decoration',
          label: 'Decoration',
          amount: decorationAmount,
        });
      }

      const total =
        base + adjustments.reduce((sum, entry) => sum + entry.amount, 0);

      return {
        base,
        adjustments,
        total,
        currency,
        resolved: true,
      } satisfies PriceState;
    },
  };
}

export function createUnresolvedPricingAdapter(
  base = 24,
  currency = 'USD'
): PricingAdapter {
  return {
    resolvePrice: () => createUnresolvedPrice(base, currency),
  };
}
