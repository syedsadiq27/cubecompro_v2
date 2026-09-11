'use server';

import { graphRequest } from '@repo/product-graph';
import { ME_QUERY, RESOLVE_COMMERCE_LIVE_QUERY } from '@repo/product-graph';
import {
  getProjectSession,
  getSessionUser,
} from '@/lib/session-server';

export type CommerceLivePreview = {
  resolutionStatus: string;
  identitySignature?: string | null;
  identityJson?: string | null;
  externalId?: string | null;
  externalSku?: string | null;
  connectionRef?: string | null;
  evaluationValid: boolean;
  evaluationComplete: boolean;
  canPurchase: boolean;
  sellabilityStatus?: string | null;
  unsellableReason?: string | null;
  priceAmount?: string | null;
  priceCurrencyCode?: string | null;
  inventoryAvailable?: number | null;
  inventoryTracked?: boolean | null;
};

async function requireOrgContext(projectId: string) {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    throw new Error('Session missing.');
  }
  const me = await graphRequest<{
    me: { organizationId?: string | null };
  }>(ME_QUERY, undefined, project.projectToken);
  const organizationId = me.me.organizationId;
  if (!organizationId) {
    throw new Error('Organization missing.');
  }
  return { project, organizationId };
}

export async function resolveCommerceLiveAction(
  projectId: string,
  input: {
    productRevisionId: string;
    selection: Record<string, string>;
    integrationConnectionId?: string;
  }
): Promise<{ preview: CommerceLivePreview | null; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      resolveCommerceLive: {
        resolution: {
          status: string;
          identitySignature?: string | null;
          identityJson?: string | null;
          externalReference?: {
            id?: string | null;
            sku?: string | null;
          } | null;
        };
        connectionRef?: string | null;
        evaluationValid: boolean;
        evaluationComplete: boolean;
        canPurchase: boolean;
        commerceState?: {
          sellabilityStatus: string;
          unsellableReason?: string | null;
          priceAmount?: string | null;
          priceCurrencyCode?: string | null;
          inventoryAvailable?: number | null;
          inventoryTracked?: boolean | null;
        } | null;
      };
    }>(
      RESOLVE_COMMERCE_LIVE_QUERY,
      {
        input: {
          productRevisionId: input.productRevisionId,
          organizationId,
          provider: 'cubecom',
          selectionJson: JSON.stringify(input.selection),
          integrationConnectionId: input.integrationConnectionId,
        },
      },
      project.projectToken
    );

    const live = data.resolveCommerceLive;
    return {
      preview: {
        resolutionStatus: live.resolution.status,
        identitySignature: live.resolution.identitySignature,
        identityJson: live.resolution.identityJson,
        externalId: live.resolution.externalReference?.id ?? null,
        externalSku: live.resolution.externalReference?.sku ?? null,
        connectionRef: live.connectionRef,
        evaluationValid: live.evaluationValid,
        evaluationComplete: live.evaluationComplete,
        canPurchase: live.canPurchase,
        sellabilityStatus: live.commerceState?.sellabilityStatus ?? null,
        unsellableReason: live.commerceState?.unsellableReason ?? null,
        priceAmount: live.commerceState?.priceAmount ?? null,
        priceCurrencyCode: live.commerceState?.priceCurrencyCode ?? null,
        inventoryAvailable: live.commerceState?.inventoryAvailable ?? null,
        inventoryTracked: live.commerceState?.inventoryTracked ?? null,
      },
    };
  } catch (error) {
    return {
      preview: null,
      error: error instanceof Error ? error.message : 'Live resolve failed',
    };
  }
}
