import {
  AUDIT_EVENTS_QUERY,
  ENTITLEMENT_CATALOG_QUERY,
  LEAD_FUNNEL_STATUSES_QUERY,
  PLANS_QUERY,
  RESOLVED_ACCESS_QUERY,
  TENANTS_QUERY,
  TENANT_USERS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import { getSessionUser } from './session-server';
import type {
  AuditEvent,
  Catalog,
  Plan,
  ResolvedAccess,
  Tenant,
} from './types';

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error('Not authenticated');
  return user;
}

export async function loadTenants() {
  const user = await requireUser();
  const data = await graphRequest<{ tenants: Tenant[] }>(
    TENANTS_QUERY,
    undefined,
    user.token
  );
  return data.tenants;
}

export async function loadUsers() {
  const user = await requireUser();
  const data = await graphRequest<{
    tenantUsers: Array<{
      id: string;
      userId: string;
      email: string;
      name?: string | null;
      roleName: string;
      organizationId: string;
      organizationName: string;
      planName?: string | null;
    }>;
  }>(TENANT_USERS_QUERY, undefined, user.token);
  return data.tenantUsers;
}

export async function loadPlans() {
  const user = await requireUser();
  const data = await graphRequest<{ plans: Plan[] }>(
    PLANS_QUERY,
    undefined,
    user.token
  );
  return data.plans;
}

export async function loadCatalog() {
  const user = await requireUser();
  const data = await graphRequest<{ entitlementCatalog: Catalog }>(
    ENTITLEMENT_CATALOG_QUERY,
    undefined,
    user.token
  );
  return data.entitlementCatalog;
}

export async function loadResolved(organizationId: string) {
  const user = await requireUser();
  const data = await graphRequest<{ resolvedAccess: ResolvedAccess }>(
    RESOLVED_ACCESS_QUERY,
    { organizationId },
    user.token
  );
  return data.resolvedAccess;
}

export async function loadAudit(organizationId?: string) {
  const user = await requireUser();
  const data = await graphRequest<{ auditEvents: AuditEvent[] }>(
    AUDIT_EVENTS_QUERY,
    { organizationId: organizationId ?? null },
    user.token
  );
  return data.auditEvents;
}

export async function loadLeadFunnel() {
  const user = await requireUser();
  const data = await graphRequest<{
    leadFunnelStatuses: Array<{
      email: string;
      submittedAt: string;
      status: string;
    }>;
  }>(LEAD_FUNNEL_STATUSES_QUERY, undefined, user.token);
  return data.leadFunnelStatuses;
}
