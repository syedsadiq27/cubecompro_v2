import {
  BASE_PRICE,
  getColor,
  getFit,
  getSize,
  INVENTORY_BY_SKU,
} from './catalog';
import { applyConstraints, getDisabledOptions } from './rules';
import type { ConfigurationState, ResolvedConfiguration } from './types';

export function buildSku(state: ConfigurationState): string {
  return `TEE-${getColor(state.color).skuCode}-${getFit(state.fit).skuCode}-${getSize(state.size).skuCode}`;
}

export function resolveConfiguration(
  input: ConfigurationState
): ResolvedConfiguration {
  const state = applyConstraints(input);
  const color = getColor(state.color);
  const fit = getFit(state.fit);
  const size = getSize(state.size);
  const sku = buildSku(state);
  const price =
    BASE_PRICE + color.priceDelta + fit.priceDelta + size.priceDelta;
  const inventory = INVENTORY_BY_SKU[sku] ?? 0;
  const blockedOptions = getDisabledOptions(state);

  return {
    state,
    sku,
    price,
    inventory,
    valid: true,
    blockedOptions,
    materials: {
      body: color.material,
    },
    labels: {
      color: color.label,
      fit: fit.label,
      size: size.label,
    },
    fitScale: state.fit === 'oversized' ? 1.08 : 1,
  };
}
