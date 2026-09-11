import type { ResolvedCommerce } from '@repo/product-graph';

import type { CommerceConnectionRef } from './refs.js';

export type PublishSellableInput = {
  connectionRef: CommerceConnectionRef;
  resolved: ResolvedCommerce;
};

export interface CommerceCatalogPublisher {
  publishSellable(input: PublishSellableInput): Promise<void>;
}
