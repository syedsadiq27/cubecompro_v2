import { createHmac, timingSafeEqual } from 'node:crypto';

export type ShopifyOAuthState = {
  organizationId: string;
  projectId: string;
  shop: string;
  nonce: string;
};

export function getShopifyAppConfig() {
  const apiKey = process.env.SHOPIFY_API_KEY?.trim() ?? '';
  const apiSecret = process.env.SHOPIFY_API_SECRET?.trim() ?? '';
  const scopes =
    process.env.SHOPIFY_SCOPES?.trim() || 'read_products';
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || '2026-07';
  const redirectUri =
    process.env.SHOPIFY_REDIRECT_URI?.trim() ||
    `${process.env.API_PUBLIC_URL?.trim() || 'http://localhost:3005'}/integrations/shopify/callback`;
  const backofficeUrl =
    process.env.BACKOFFICE_PUBLIC_URL?.trim() || 'http://localhost:3002';

  return { apiKey, apiSecret, scopes, apiVersion, redirectUri, backofficeUrl };
}

export function assertShopifyAppConfigured() {
  const config = getShopifyAppConfig();
  if (!config.apiKey || !config.apiSecret) {
    throw new Error(
      'Shopify app is not configured. Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET.'
    );
  }
  return config;
}

export function normalizeShopDomain(shop: string): string {
  const trimmed = shop.trim().toLowerCase();
  if (!trimmed) {
    throw new Error('shop is required');
  }
  return trimmed.includes('.') ? trimmed : `${trimmed}.myshopify.com`;
}

export function buildShopifyAuthorizeUrl(input: {
  shop: string;
  organizationId: string;
  projectId: string;
}): string {
  const config = assertShopifyAppConfigured();
  const shop = normalizeShopDomain(input.shop);
  const state = signOAuthState({
    organizationId: input.organizationId,
    projectId: input.projectId,
    shop,
    nonce: `${Date.now()}`,
  });
  const params = new URLSearchParams({
    client_id: config.apiKey,
    scope: config.scopes,
    redirect_uri: config.redirectUri,
    state,
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

export function signOAuthState(state: ShopifyOAuthState): string {
  const config = assertShopifyAppConfigured();
  const payload = Buffer.from(JSON.stringify(state)).toString('base64url');
  const signature = createHmac('sha256', config.apiSecret)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyOAuthState(raw: string): ShopifyOAuthState {
  const config = assertShopifyAppConfigured();
  const [payload, signature] = raw.split('.');
  if (!payload || !signature) {
    throw new Error('Invalid OAuth state');
  }
  const expected = createHmac('sha256', config.apiSecret)
    .update(payload)
    .digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('Invalid OAuth state signature');
  }
  const parsed = JSON.parse(
    Buffer.from(payload, 'base64url').toString('utf8')
  ) as ShopifyOAuthState;
  if (!parsed.organizationId || !parsed.projectId || !parsed.shop) {
    throw new Error('OAuth state missing fields');
  }
  return parsed;
}

export async function exchangeShopifyAccessToken(input: {
  shop: string;
  code: string;
}): Promise<string> {
  const config = assertShopifyAppConfigured();
  const shop = normalizeShopDomain(input.shop);
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: config.apiKey,
      client_secret: config.apiSecret,
      code: input.code,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Shopify token exchange failed (${response.status}): ${body.slice(0, 400)}`
    );
  }
  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error('Shopify token exchange returned no access_token');
  }
  return json.access_token;
}
