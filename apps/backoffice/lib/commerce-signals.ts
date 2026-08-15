import { toOperationalStatus } from './product-status';

export type CommerceHealth =
  | 'ready'
  | 'mapping_required'
  | 'pricing_missing'
  | 'configuration_errors';

export type CommerceSignals = {
  health: CommerceHealth;
  healthLabel: string;
  channel: string | null;
  channelLabel: string;
  skuCount: number;
  configurationCount: number;
  mappedCount: number;
  priceLabel: string;
  hasPrice: boolean;
  threeDReady: boolean;
  commerceMapped: boolean;
  needsAttention: boolean;
};

export function deriveCommerceSignals(input: {
  statusName?: string | null;
  modelCount: number;
  hasModels: boolean;
  channelPlatform?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
}): CommerceSignals {
  const operational = toOperationalStatus(input.statusName);
  const channel = input.channelPlatform?.trim() || null;
  const skuCount = input.modelCount;
  const configurationCount = Math.max(input.modelCount, input.hasModels ? 1 : 0);
  const hasPrice =
    typeof input.priceMin === 'number' && Number.isFinite(input.priceMin);
  const threeDReady = input.hasModels;
  const commerceMapped =
    Boolean(channel) && threeDReady && operational === 'published';

  let health: CommerceHealth = 'mapping_required';
  if (!threeDReady) {
    health = 'configuration_errors';
  } else if (!channel || !commerceMapped) {
    health = 'mapping_required';
  } else if (!hasPrice) {
    health = 'pricing_missing';
  } else {
    health = 'ready';
  }

  const healthLabel =
    health === 'ready'
      ? 'Ready'
      : health === 'pricing_missing'
        ? 'Pricing missing'
        : health === 'configuration_errors'
          ? 'Configuration errors'
          : 'Mapping required';

  const priceLabel = hasPrice
    ? input.priceMax != null && input.priceMax !== input.priceMin
      ? `$${formatMoney(input.priceMin!)} – $${formatMoney(input.priceMax)}`
      : `$${formatMoney(input.priceMin!)}`
    : 'No price';

  return {
    health,
    healthLabel,
    channel,
    channelLabel: channel ? titleCase(channel) : '—',
    skuCount,
    configurationCount,
    mappedCount: commerceMapped ? configurationCount : 0,
    priceLabel,
    hasPrice,
    threeDReady,
    commerceMapped,
    needsAttention: health !== 'ready' || operational === 'draft',
  };
}

export function summarizeCatalog(
  products: Array<{
    statusName?: string | null;
    signals: CommerceSignals;
  }>
) {
  let live = 0;
  let draft = 0;
  let issues = 0;
  let skus = 0;
  let commerceReady = 0;

  for (const product of products) {
    const operational = toOperationalStatus(product.statusName);
    if (operational === 'published') live += 1;
    if (operational === 'draft') draft += 1;
    if (product.signals.needsAttention) issues += 1;
    if (product.signals.health === 'ready') commerceReady += 1;
    skus += product.signals.skuCount;
  }

  return {
    products: products.length,
    live,
    draft,
    issues,
    skus,
    commerceReady,
  };
}

function formatMoney(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(2);
}

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
