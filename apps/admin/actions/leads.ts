'use server';

import { revalidatePath } from 'next/cache';
import {
  SET_LEAD_FUNNEL_STATUS_MUTATION,
  graphRequest,
} from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export type ActionResult = { ok: boolean; error?: string };

export async function setLeadStatusAction(
  email: string,
  submittedAt: string,
  status: string
): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error('Not authenticated');
    await graphRequest(
      SET_LEAD_FUNNEL_STATUS_MUTATION,
      { email, submittedAt, status },
      user.token
    );
    revalidatePath('/leads');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed',
    };
  }
}
