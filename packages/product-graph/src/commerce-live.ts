/**
 * Commerce live-state contract (frozen).
 *
 * Selection → evaluateConfiguration → require VALID+COMPLETE
 *   → resolveCommerce → UNMAPPED | RESOLVED
 *   → RESOLVED → ResolvedCommerce → fetchCommerceState → CommerceState
 *   → canPurchase (derived; never persisted on Selection)
 *
 * Visual projection is independent of CommerceState.
 * Inventory facts ≠ sellability. Do not implement provider I/O here.
 */

import type { CommerceExternalReference, CommerceResolution } from './commerce.js';

export type Money = {
  amount: string;
  currencyCode: string;
};

/**
 * Provider inventory observation. Zero available does not imply UNSELLABLE;
 * oversell / backorder policy lives in sellability.
 */
export type InventoryState = {
  available?: number | null;
  tracked?: boolean | null;
};

export type CommerceUnsellableReason =
  | 'OUT_OF_STOCK'
  | 'NOT_AVAILABLE'
  | 'PROVIDER_BLOCKED'
  | 'UNKNOWN';

export type CommerceSellability =
  | { status: 'SELLABLE' }
  | {
      status: 'UNSELLABLE';
      reason: CommerceUnsellableReason;
    };

/**
 * Live provider facts for a ResolvedCommerce identity.
 * Fetched only after RESOLVED — never for UNMAPPED.
 */
export type CommerceState = {
  price?: Money;
  inventory?: InventoryState;
  sellability: CommerceSellability;
  /** Optional cache stamp; not required for v1. */
  observedAt?: Date;
};

/**
 * Handoff boundary between identity resolution and provider I/O.
 * Must carry connection + external sellable identity — no sideways shop lookup.
 */
export type ResolvedCommerce = {
  provider: string;
  integrationConnectionId: string;
  externalReference: CommerceExternalReference;
};

export type ConfigurationEvaluation = {
  valid: boolean;
  complete: boolean;
};

/**
 * Build ResolvedCommerce only when resolution is RESOLVED and a connection id
 * is available (from the mapping set or explicit argument).
 */
export function toResolvedCommerce(input: {
  resolution: CommerceResolution;
  integrationConnectionId?: string | null;
}): ResolvedCommerce | null {
  if (input.resolution.status !== 'RESOLVED') {
    return null;
  }
  const fromResolution = input.resolution.integrationConnectionId?.trim();
  const fromArg = input.integrationConnectionId?.trim();
  const integrationConnectionId = fromArg || fromResolution;
  if (!integrationConnectionId) {
    return null;
  }
  return {
    provider: input.resolution.provider,
    integrationConnectionId,
    externalReference: input.resolution.externalReference,
  };
}

/**
 * Final purchase gate. Derived only — never persisted on Selection.
 *
 * canPurchase =
 *   evaluation.valid &&
 *   evaluation.complete &&
 *   resolution.status === "RESOLVED" &&
 *   commerceState.sellability.status === "SELLABLE"
 */
export function canPurchase(input: {
  evaluation: ConfigurationEvaluation;
  resolution: CommerceResolution;
  commerceState: CommerceState;
}): boolean {
  return (
    input.evaluation.valid &&
    input.evaluation.complete &&
    input.resolution.status === 'RESOLVED' &&
    input.commerceState.sellability.status === 'SELLABLE'
  );
}

/**
 * Adapter contract for live provider I/O. Implement outside this package.
 * Call only after toResolvedCommerce succeeds.
 */
export type FetchCommerceState = (
  resolved: ResolvedCommerce
) => Promise<CommerceState>;
