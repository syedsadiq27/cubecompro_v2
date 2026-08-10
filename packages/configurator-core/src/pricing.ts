export type PriceAdjustment = {
  id: string;
  label: string;
  amount: number;
};

export type PriceState = {
  base: number;
  adjustments: PriceAdjustment[];
  total: number;
  currency: string;
  resolved: boolean;
};

export function formatPrice(price: PriceState): string {
  const amount = price.resolved ? price.total : price.base;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || 'USD',
  }).format(amount);

  if (!price.resolved) {
    return `From ${formatted}`;
  }
  return formatted;
}

export function createUnresolvedPrice(base = 24, currency = 'USD'): PriceState {
  return {
    base,
    adjustments: [],
    total: base,
    currency,
    resolved: false,
  };
}
