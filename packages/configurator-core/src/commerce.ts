import type { PriceState } from './pricing';

export type CommerceSelection = {
  productId: string;
  commerceReference?: string;
  sku?: string;
  quantity: number;
  configurationId?: string;
  price: PriceState;
};

export type AddToCartResult =
  | { ok: true; reference?: string }
  | { ok: false; message: string };

export type CommerceAdapter = {
  addToCart: (selection: CommerceSelection) => Promise<AddToCartResult>;
};
