# Shopify cart handoff: scope

Status: proposed, not started.

## Goal

A shopper configures a product on a real Shopify storefront, adds it to the Shopify cart, and pays through Shopify checkout. The order shows exactly what they configured.

This is the proof the Shopify landing page needs before it can drop "planned" from the cart step.

## What exists today

| Capability | State | Where |
| --- | --- | --- |
| Shopify OAuth, default scope `read_products` | Built | `apps/api/src/integrations/shopify-oauth.ts` |
| Product import and variant mapping | Built, capped (gap 1) | `apps/api/src/integrations/shopify-import.service.ts`, `packages/product-graph/src/commerce/shopify-import.ts` |
| Resolve selection to a mapped variant | Built | `apps/api/src/resolve/resolve.service.ts` |
| `cartPayload` in the resolve response | Built, nothing consumes it | `apps/api/src/resolve/resolve.service.ts`, `resolve.resolver.ts` |
| Commerce adapter interface | Built | `packages/configurator-core/src/commerce.ts` |
| Real Shopify adapter | Missing | Only a stub exists |
| Storefront embed or SDK | Missing | `packages/product-graph/src/editor/embed.ts` covers the editor only |

## Gaps

1. **Import stops at 100 variants.** `getProduct` requests `variants(first: 100)` with no pagination (`shopify-admin.client.ts`). Larger products import incompletely, and the missing variants would look like catalog gaps.
2. **The customizer reports fake success.** It defaults to `createStubCommerceAdapter()` (`apps/customizer/providers/configuration-provider.tsx`), which returns `ok: true`, so the UI shows "Added to cart" when nothing was added.
3. **The customizer doesn't call resolve.** No `resolveConfiguration` call was found in `apps/customizer` or `packages/configurator-core`, and `addToCart` never receives a variant reference (`customizer-app.tsx`).
4. **The adapter input lacks cart data.** `CommerceSelection` has `commerceReference` and `sku`, but no selections or line properties for showing the configuration in cart and on the order.
5. **Variant ID format.** `externalId` is a GID (`gid://shopify/ProductVariant/123`). The theme cart AJAX API takes the numeric ID; the Storefront API takes the GID.
6. **Unmapped selections return null commerce fields.** The add-to-cart step must block these with a clear message, not fail silently.
7. **Resolve has no price or inventory.** The `commerce` result holds provider, references, SKU and `cartPayload` only. The shopper needs to see Shopify's price before adding to cart.
8. **Resolve has no auth guard.** No guard on the resolver and no global `APP_GUARD` or `useGlobalGuards` were found. That suits public storefront calls, but it needs a deliberate decision, with rate limiting, before merchant stores depend on it.

## Proposed phases

Estimates are rough, for one engineer, and assume no surprises in the customizer.

### Phase 0: Prove it on a dev store (2–4 days)

Hard-code as much as possible and test the riskiest assumption first.

- Fix import pagination (gap 1).
- Add one sofa with a small variant set to a Shopify dev store, then import and map it.
- Build a minimal theme snippet: configure, resolve, then `POST /cart/add.js` with the numeric variant ID and line item properties.
- Record the purchase through to a test order.

**Exit:** a test order contains the right variant and configuration.

### Phase 1: Variant-mapped handoff (1–2 weeks)

- Add a Shopify cart adapter implementing `CommerceAdapter`, with its own failure results (gaps 3–6).
- Make the customizer's adapter explicit, so production can't silently fall back to the stub (gap 2).
- Embed the customizer on the product page and pass cart requests to the parent page with a `postMessage` bridge that validates origin. The adapter must add to the cart from the storefront's own origin.
- Show the Shopify variant price (gap 7).
- Decide and implement resolve access and rate limits (gap 8).
- Write merchant install steps for a manual theme snippet.

**Exit:** a merchant can follow the docs and take a real order on a mapped product.

### Phase 2: Configurations without a pre-created variant (scope after Phase 1)

This is what the made-to-order furniture pitch depends on.

- Sell a base variant, carrying the full configuration in line item properties.
- Solve price: the cart charges the variant price, so surcharges need another mechanism. Candidates are Shopify's Cart Transform function, draft orders, or hidden priced add-on products.
- Pass the configuration through to fulfillment on the order.

Check current Shopify limits and plan restrictions before choosing. These are the highest-risk unknowns in this document.

### Phase 3: Shopify app and App Store listing (scope later)

Theme app extension in place of the manual snippet, then App Store review. This is what self-serve merchants expect, but it should follow at least one successful merchant.

## Decisions needed

1. **Who is the first customer?** A finite-SKU catalog can launch on Phase 1. A made-to-order brand needs Phase 2 first.
2. **Embed method:** iframe of `apps/customizer` (faster, isolated) or a script embed (better page integration, more work). The recommendation is an iframe for Phase 1.
3. **Cart API:** theme AJAX for theme stores (no token needed). Storefront API `cartCreate` for headless stores. The recommendation is AJAX first.
4. **Resolve access:** stay public with rate limits, or require a per-store publishable key.

## Landing copy to update when this ships

The current copy marks the cart step as planned. After Phase 1, update:

- `apps/landing/components/integrations/shopify-integration-page.tsx`
- `apps/landing/components/integrations/shopify-integration-proof.tsx` (replace sample data with the real order)
- `apps/landing/lib/seo-pages.ts`, `apps/landing/lib/seo-bodies.ts`
- `apps/landing/public/llms.txt`
- `apps/docs/content/docs/integrations/shopify.mdx`

## Out of scope

- commercetools. Its page makes similar cart claims, and no implementation was found in `apps/api/src` or `packages`; it needs its own review.
- Changes to the sofa and t-shirt demos on the landing site, which use local state.
