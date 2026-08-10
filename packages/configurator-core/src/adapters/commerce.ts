import type { AddToCartResult, CommerceAdapter } from '../commerce';

export function createStubCommerceAdapter(): CommerceAdapter {
  return {
    async addToCart(selection): Promise<AddToCartResult> {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('cubecom:add-to-cart', { detail: selection })
        );
      }
      return {
        ok: true,
        reference: `stub-${selection.productId}-${Date.now()}`,
      };
    },
  };
}
