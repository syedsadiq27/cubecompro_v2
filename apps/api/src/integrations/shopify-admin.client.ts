export type ShopifyAdminProduct = {
  id: number | string;
  title: string;
  handle?: string | null;
  options: Array<{ name: string; values: string[] }>;
  variants: Array<{
    id: number | string;
    sku?: string | null;
    option1?: string | null;
    option2?: string | null;
    option3?: string | null;
  }>;
};

export class ShopifyAdminClient {
  constructor(
    private readonly shop: string,
    private readonly accessToken: string,
    private readonly apiVersion = '2024-10'
  ) {}

  private shopHost(): string {
    const trimmed = this.shop.trim().toLowerCase();
    if (!trimmed) {
      throw new Error('Shopify shop is required');
    }
    return trimmed.includes('.')
      ? trimmed
      : `${trimmed}.myshopify.com`;
  }

  async getProduct(productId: string): Promise<ShopifyAdminProduct> {
    const id = productId.trim();
    if (!id) {
      throw new Error('Shopify product id is required');
    }
    const url = `https://${this.shopHost()}/admin/api/${this.apiVersion}/products/${id}.json`;
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Shopify Admin API error (${response.status}): ${body.slice(0, 400)}`
      );
    }
    const json = (await response.json()) as { product?: ShopifyAdminProduct };
    if (!json.product) {
      throw new Error('Shopify Admin API returned no product');
    }
    return json.product;
  }
}
