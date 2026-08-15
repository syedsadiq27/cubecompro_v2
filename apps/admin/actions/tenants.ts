'use server';

import { revalidatePath } from 'next/cache';
import {
  ASSIGN_PLAN_MUTATION,
  CREATE_PLAN_MUTATION,
  CREATE_TENANT_MUTATION,
  DELETE_OVERRIDE_MUTATION,
  SET_TENANT_STATUS_MUTATION,
  UPDATE_PLAN_MUTATION,
  UPDATE_TENANT_MUTATION,
  UPSERT_OVERRIDE_MUTATION,
  graphRequest,
} from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export type ActionResult = { ok: boolean; error?: string; id?: string };

async function token() {
  const user = await getSessionUser();
  if (!user) throw new Error('Not authenticated');
  return user.token;
}

function fail(error: unknown): ActionResult {
  return {
    ok: false,
    error: error instanceof Error ? error.message : 'Failed',
  };
}

function touchOrg(organizationId: string) {
  revalidatePath(`/organizations/${organizationId}`);
  revalidatePath('/organizations');
  revalidatePath('/usage');
  revalidatePath('/audit');
}

export async function createTenantAction(input: {
  name: string;
  slug: string;
  planId?: string | null;
  status?: string;
}): Promise<ActionResult> {
  try {
    const data = await graphRequest<{
      createTenant: { organizationId: string };
    }>(CREATE_TENANT_MUTATION, { input }, await token());
    touchOrg(data.createTenant.organizationId);
    return { ok: true, id: data.createTenant.organizationId };
  } catch (error) {
    return fail(error);
  }
}

export async function updateTenantAction(
  organizationId: string,
  input: { name?: string; slug?: string }
): Promise<ActionResult> {
  try {
    await graphRequest(
      UPDATE_TENANT_MUTATION,
      { organizationId, input },
      await token()
    );
    touchOrg(organizationId);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function assignPlanAction(
  organizationId: string,
  planId: string
): Promise<ActionResult> {
  try {
    await graphRequest(
      ASSIGN_PLAN_MUTATION,
      { organizationId, planId },
      await token()
    );
    touchOrg(organizationId);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function setStatusAction(
  organizationId: string,
  status: string
): Promise<ActionResult> {
  try {
    await graphRequest(
      SET_TENANT_STATUS_MUTATION,
      { organizationId, status, trialEndsAt: null },
      await token()
    );
    touchOrg(organizationId);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function upsertOverrideAction(input: {
  organizationId: string;
  key: string;
  kind?: string;
  value: string;
}): Promise<ActionResult> {
  try {
    await graphRequest(UPSERT_OVERRIDE_MUTATION, { input }, await token());
    touchOrg(input.organizationId);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteOverrideAction(
  organizationId: string,
  key: string
): Promise<ActionResult> {
  try {
    await graphRequest(
      DELETE_OVERRIDE_MUTATION,
      { organizationId, key },
      await token()
    );
    touchOrg(organizationId);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function createPlanAction(input: {
  key: string;
  name: string;
  parentPlanId?: string | null;
  entitlements: Array<{
    key: string;
    kind: 'CAPABILITY' | 'LIMIT';
    value: string;
  }>;
}): Promise<ActionResult> {
  try {
    const data = await graphRequest<{ createPlan: { id: string } }>(
      CREATE_PLAN_MUTATION,
      { input },
      await token()
    );
    revalidatePath('/plans');
    revalidatePath('/audit');
    return { ok: true, id: data.createPlan.id };
  } catch (error) {
    return fail(error);
  }
}

export async function updatePlanAction(
  planId: string,
  input: {
    name?: string;
    parentPlanId?: string | null;
    entitlements?: Array<{
      key: string;
      kind: 'CAPABILITY' | 'LIMIT';
      value: string;
    }>;
  }
): Promise<ActionResult> {
  try {
    await graphRequest(
      UPDATE_PLAN_MUTATION,
      { planId, input },
      await token()
    );
    revalidatePath('/plans');
    revalidatePath(`/plans/${planId}`);
    revalidatePath('/organizations');
    revalidatePath('/audit');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
