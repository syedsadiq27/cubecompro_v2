export type TenantStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED';

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  trialEndsAt?: string | null;
  memberCount: number;
  planId?: string | null;
  planName?: string | null;
  planKey?: string | null;
};

export type CatalogApplication = {
  id: string;
  label: string;
  gate: string;
};

export type CatalogItem = {
  key: string;
  shortKey: string;
  label: string;
  application: string;
  unit?: string | null;
};

export type Catalog = {
  applications: CatalogApplication[];
  capabilities: CatalogItem[];
  limits: CatalogItem[];
};

export type ResolvedRow = {
  key: string;
  shortKey: string;
  application: string;
  kind: 'CAPABILITY' | 'LIMIT';
  value: string;
  baseValue: string;
  enabled: boolean;
  limit?: number | null;
  used?: number | null;
  source: string;
  label: string;
};

export type Override = {
  id: string;
  key: string;
  kind: 'CAPABILITY' | 'LIMIT';
  value: string;
};

export type Member = {
  id: string;
  userId: string;
  email: string;
  name?: string | null;
  roleName: string;
};

export type ApplicationAccess = {
  id: string;
  label: string;
  gate: string;
  enabled: boolean;
  source: string;
};

export type ResolvedAccess = {
  organizationId: string;
  organizationName: string;
  slug: string;
  status: TenantStatus;
  trialEndsAt?: string | null;
  planId?: string | null;
  planName?: string | null;
  planKey?: string | null;
  parentPlanName?: string | null;
  capabilities: ResolvedRow[];
  limits: ResolvedRow[];
  applications: ApplicationAccess[];
  overrides: Override[];
  members: Member[];
};

export type PlanEntitlement = {
  id: string;
  key: string;
  kind: 'CAPABILITY' | 'LIMIT';
  value: string;
};

export type Plan = {
  id: string;
  key: string;
  name: string;
  parentPlanId?: string | null;
  parentName?: string | null;
  entitlements: PlanEntitlement[];
};

export type AuditEvent = {
  id: string;
  actorEmail?: string | null;
  action: string;
  organizationId?: string | null;
  targetType: string;
  targetId?: string | null;
  summary: string;
  metadata?: string | null;
  createdAt: string;
};
