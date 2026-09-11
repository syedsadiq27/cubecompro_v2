export const COMMERCE_PROVIDERS = [
  'cubecom',
  'shopify',
  'commercetools',
] as const;

export type CommerceProvider = (typeof COMMERCE_PROVIDERS)[number];

export function isCommerceProvider(value: string): value is CommerceProvider {
  return (COMMERCE_PROVIDERS as readonly string[]).includes(value);
}
