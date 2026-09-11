import { isCommerceProvider } from './provider';

describe('isCommerceProvider', () => {
  it('accepts public providers', () => {
    expect(isCommerceProvider('cubecom')).toBe(true);
    expect(isCommerceProvider('shopify')).toBe(true);
    expect(isCommerceProvider('commercetools')).toBe(true);
  });

  it('rejects engine names and unknowns', () => {
    expect(isCommerceProvider('medusa')).toBe(false);
    expect(isCommerceProvider('erp')).toBe(false);
  });
});
