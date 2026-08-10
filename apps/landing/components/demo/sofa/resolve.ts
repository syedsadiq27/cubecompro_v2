import {
  BASE_PRICE,
  getFabric,
  getFrame,
  getLegs,
  INVENTORY_BY_SKU,
} from './catalog';
import { applyConstraints, getDisabledOptions } from './rules';
import type { ConfigurationState, ResolvedConfiguration } from './types';

export function buildSku(state: ConfigurationState): string {
  const frame = getFrame(state.frame).skuCode;
  const fabric = getFabric(state.fabric).skuCode;
  const legs = getLegs(state.legs).skuCode;
  return `SOFA-${frame}-${fabric}-${legs}`;
}

export function resolveConfiguration(
  input: ConfigurationState
): ResolvedConfiguration {
  const state = applyConstraints(input);
  const frame = getFrame(state.frame);
  const fabric = getFabric(state.fabric);
  const legs = getLegs(state.legs);
  const sku = buildSku(state);
  const price = BASE_PRICE + frame.priceDelta + fabric.priceDelta + legs.priceDelta;
  const inventory = INVENTORY_BY_SKU[sku] ?? 0;
  const blockedOptions = getDisabledOptions(state);
  const valid =
    !blockedOptions.frame.includes(state.frame) &&
    !blockedOptions.fabric.includes(state.fabric) &&
    !blockedOptions.legs.includes(state.legs);

  return {
    state,
    sku,
    price,
    inventory,
    valid,
    blockedOptions,
    materials: {
      frame: frame.material,
      fabric: fabric.material,
      legs: legs.material,
    },
    labels: {
      frame: frame.label,
      fabric: fabric.label,
      legs: legs.label,
    },
  };
}
