import type {
  CommerceState,
  ResolvedCommerce,
} from '@repo/product-graph';

import type {
  CommerceConnectionRef,
  ExternalCartRef,
  ExternalCheckoutRef,
} from './refs.js';

export type FetchCommerceState = (
  resolved: ResolvedCommerce
) => Promise<CommerceState>;

export type CartLineInput = {
  resolved: ResolvedCommerce;
  quantity: number;
};

export type CreateCartInput = {
  connectionRef: CommerceConnectionRef;
};

export type CreateCartResult = {
  cartRef: ExternalCartRef;
};

export type AddCartLineInput = {
  cartRef: ExternalCartRef;
  line: CartLineInput;
};

export type StartCheckoutInput = {
  cartRef: ExternalCartRef;
};

export type StartCheckoutResult = {
  checkoutRef: ExternalCheckoutRef;
};

export interface CommerceRuntime {
  fetchState: FetchCommerceState;
  createCart(input: CreateCartInput): Promise<CreateCartResult>;
  addCartLine(input: AddCartLineInput): Promise<void>;
  startCheckout(input: StartCheckoutInput): Promise<StartCheckoutResult>;
}
