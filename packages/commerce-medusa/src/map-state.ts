import type { CommerceState } from '@repo/product-graph';

export type MedusaCalculatedPrice = {
  calculated_amount?: number | null;
  currency_code?: string | null;
};

export type MedusaStoreVariant = {
  id?: string;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  inventory_quantity?: number | null;
  calculated_price?: MedusaCalculatedPrice | null;
};

export type MedusaStoreVariantsResponse = {
  product_variants?: MedusaStoreVariant[];
  variants?: MedusaStoreVariant[];
};

export function mapMedusaVariantToCommerceState(
  variant: MedusaStoreVariant | null | undefined,
  observedAt: Date = new Date()
): CommerceState {
  if (!variant || typeof variant.id !== 'string' || variant.id.length === 0) {
    return {
      sellability: { status: 'UNSELLABLE', reason: 'NOT_AVAILABLE' },
      observedAt,
    };
  }

  const manageInventory = variant.manage_inventory === true;
  const allowBackorder = variant.allow_backorder === true;
  const available =
    typeof variant.inventory_quantity === 'number'
      ? variant.inventory_quantity
      : null;

  const inventory = {
    available,
    tracked: manageInventory,
  };

  const price = toMoney(variant.calculated_price);

  if (
    manageInventory &&
    !allowBackorder &&
    (available === null || available <= 0)
  ) {
    return {
      ...(price ? { price } : {}),
      inventory,
      sellability: { status: 'UNSELLABLE', reason: 'OUT_OF_STOCK' },
      observedAt,
    };
  }

  return {
    ...(price ? { price } : {}),
    inventory,
    sellability: { status: 'SELLABLE' },
    observedAt,
  };
}

export function commerceStateFromProviderFailure(
  reason: 'PROVIDER_BLOCKED' | 'UNKNOWN' = 'UNKNOWN',
  observedAt: Date = new Date()
): CommerceState {
  return {
    sellability: { status: 'UNSELLABLE', reason },
    observedAt,
  };
}

export function pickVariantFromStoreResponse(
  body: MedusaStoreVariantsResponse,
  variantId: string
): MedusaStoreVariant | undefined {
  const list = body.product_variants ?? body.variants ?? [];
  return list.find((variant) => variant.id === variantId);
}

function toMoney(
  calculated: MedusaCalculatedPrice | null | undefined
): CommerceState['price'] | undefined {
  if (!calculated) {
    return undefined;
  }
  if (
    typeof calculated.calculated_amount !== 'number' ||
    typeof calculated.currency_code !== 'string' ||
    calculated.currency_code.length === 0
  ) {
    return undefined;
  }
  return {
    amount: String(calculated.calculated_amount),
    currencyCode: calculated.currency_code.toUpperCase(),
  };
}
