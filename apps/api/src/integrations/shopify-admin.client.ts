import type { ShopifyProductDto } from '@repo/product-graph';

export type ShopifyAdminProductSummary = {
  id: string;
  title: string;
  handle: string;
  status: string;
  options: string[];
  variantCount: number;
};

export type ShopifyShopInfo = {
  name: string;
  myshopifyDomain: string;
  primaryDomain?: string | null;
};

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export class ShopifyAdminClient {
  constructor(
    private readonly shop: string,
    private readonly accessToken: string,
    private readonly apiVersion = '2026-07'
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

  async graphql<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const url = `https://${this.shopHost()}/admin/api/${this.apiVersion}/graphql.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Shopify Admin GraphQL HTTP ${response.status}: ${body.slice(0, 400)}`
      );
    }
    const json = (await response.json()) as GraphQlResponse<T>;
    if (json.errors?.length) {
      throw new Error(
        `Shopify Admin GraphQL: ${json.errors.map((e) => e.message).join('; ')}`
      );
    }
    if (!json.data) {
      throw new Error('Shopify Admin GraphQL returned no data');
    }
    return json.data;
  }

  async getShop(): Promise<ShopifyShopInfo> {
    const data = await this.graphql<{
      shop: {
        name: string;
        myshopifyDomain: string;
        primaryDomain?: { host?: string | null } | null;
      };
    }>(`
      query ShopInfo {
        shop {
          name
          myshopifyDomain
          primaryDomain { host }
        }
      }
    `);
    return {
      name: data.shop.name,
      myshopifyDomain: data.shop.myshopifyDomain,
      primaryDomain: data.shop.primaryDomain?.host ?? null,
    };
  }

  async listProducts(input?: {
    query?: string;
    first?: number;
  }): Promise<ShopifyAdminProductSummary[]> {
    const first = Math.min(Math.max(input?.first ?? 25, 1), 50);
    const search = input?.query?.trim();
    const data = await this.graphql<{
      products: {
        nodes: Array<{
          id: string;
          title: string;
          handle: string;
          status: string;
          options: Array<{ name: string }>;
          variantsCount?: { count?: number } | null;
        }>;
      };
    }>(
      `
      query GetProducts($first: Int!, $query: String) {
        products(first: $first, query: $query, sortKey: TITLE) {
          nodes {
            id
            title
            handle
            status
            options { name }
            variantsCount { count }
          }
        }
      }
    `,
      { first, query: search || null }
    );

    return data.products.nodes.map((node) => ({
      id: shopifyLegacyId(node.id),
      title: node.title,
      handle: node.handle,
      status: node.status,
      options: node.options
        .map((option) => option.name)
        .filter((name) => name.toLowerCase() !== 'title'),
      variantCount: node.variantsCount?.count ?? 0,
    }));
  }

  async getProduct(productId: string): Promise<ShopifyProductDto> {
    const gid = toProductGid(productId);
    const data = await this.graphql<{
      product: {
        id: string;
        title: string;
        handle: string;
        options: Array<{ name: string; values: string[] }>;
        variants: {
          nodes: Array<{
            id: string;
            sku?: string | null;
            selectedOptions: Array<{ name: string; value: string }>;
          }>;
        };
      } | null;
    }>(
      `
      query Product($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          options { name values }
          variants(first: 100) {
            nodes {
              id
              sku
              selectedOptions { name value }
            }
          }
        }
      }
    `,
      { id: gid }
    );

    if (!data.product) {
      throw new Error(`Shopify product ${productId} not found`);
    }

    const product = data.product;
    const options = product.options.map((option) => ({
      name: option.name,
      values: option.values,
    }));

    const variants = product.variants.nodes.map((node) => {
      const byOptionName = new Map(
        node.selectedOptions.map((entry) => [entry.name, entry.value])
      );
      return {
        id: node.id,
        sku: node.sku,
        option1: options[0] ? byOptionName.get(options[0].name) ?? null : null,
        option2: options[1] ? byOptionName.get(options[1].name) ?? null : null,
        option3: options[2] ? byOptionName.get(options[2].name) ?? null : null,
      };
    });

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      options,
      variants,
    };
  }
}

function toProductGid(id: string): string {
  const trimmed = id.trim();
  if (trimmed.startsWith('gid://')) return trimmed;
  return `gid://shopify/Product/${trimmed}`;
}

function shopifyLegacyId(gidOrId: string): string {
  const trimmed = gidOrId.trim();
  const match = /\/(\d+)$/.exec(trimmed);
  return match?.[1] ?? trimmed;
}
