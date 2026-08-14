import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntitlementKind, OrganizationStatus } from '@prisma/client';
import { OrganizationService } from '../organization/organization.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  APPLICATIONS,
  CAPABILITIES,
  LIMITS,
  isCapabilityEnabled,
} from './catalog';

export type ResolvedRow = {
  key: string;
  kind: EntitlementKind;
  value: string;
  baseValue: string;
  enabled: boolean;
  limit: number | null;
  used: number | null;
  source: string;
  label: string;
  application: string;
  shortKey: string;
};

export type AuditActor = {
  userId: string;
  email: string;
};

export type PlanEntitlementInput = {
  key: string;
  kind: EntitlementKind;
  value: string;
};

@Injectable()
export class EntitlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationService
  ) {}

  async can(organizationId: string, key: string) {
    const resolved = await this.resolve(organizationId);
    const row = resolved.capabilities.find((item) => item.key === key);
    return row?.enabled === true;
  }

  async getLimit(organizationId: string, key: string) {
    const resolved = await this.resolve(organizationId);
    const row = resolved.limits.find((item) => item.key === key);
    return row?.limit ?? 0;
  }

  async listOrganizations() {
    const rows = await this.prisma.organization.findMany({
      include: {
        plan: true,
        _count: { select: { memberships: true } },
      },
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      status: row.status,
      trialEndsAt: row.trialEndsAt,
      memberCount: row._count.memberships,
      planId: row.planId,
      planName: row.plan?.name ?? null,
      planKey: row.plan?.key ?? null,
    }));
  }

  async listUsers() {
    const rows = await this.prisma.organizationMembership.findMany({
      include: {
        user: true,
        role: true,
        organization: { include: { plan: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      email: row.user.email,
      name: row.user.name,
      roleName: row.role.name,
      organizationId: row.organizationId,
      organizationName: row.organization.name,
      planName: row.organization.plan?.name ?? null,
    }));
  }

  listPlans() {
    return this.prisma.plan.findMany({
      include: { entitlements: true, parent: true },
      orderBy: { name: 'asc' },
    });
  }

  async listAudit(organizationId?: string) {
    return this.prisma.auditEvent.findMany({
      where: organizationId ? { organizationId } : {},
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async createTenant(
    input: {
      name: string;
      slug: string;
      planId?: string | null;
      status?: OrganizationStatus;
    },
    actor?: AuditActor | null
  ) {
    const slug = input.slug.trim().toLowerCase();
    if (!slug) throw new BadRequestException('Slug is required');
    const { organization } = await this.organizations.create(
      input.name.trim(),
      slug
    );
    if (input.planId || input.status) {
      await this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          ...(input.planId ? { planId: input.planId } : {}),
          ...(input.status ? { status: input.status } : {}),
        },
      });
    }
    await this.recordAudit({
      actor,
      action: 'ORG_CREATED',
      organizationId: organization.id,
      targetType: 'ORGANIZATION',
      targetId: organization.id,
      summary: `Created ${input.name}`,
      metadata: { slug, planId: input.planId ?? null },
    });
    return this.resolve(organization.id);
  }

  async updateTenant(
    organizationId: string,
    input: { name?: string; slug?: string },
    actor?: AuditActor | null
  ) {
    const data: { name?: string; slug?: string } = {};
    if (input.name?.trim()) data.name = input.name.trim();
    if (input.slug?.trim()) data.slug = input.slug.trim().toLowerCase();
    const row = await this.prisma.organization.update({
      where: { id: organizationId },
      data,
    });
    await this.recordAudit({
      actor,
      action: 'ORG_UPDATED',
      organizationId,
      targetType: 'ORGANIZATION',
      targetId: organizationId,
      summary: `Updated ${row.name}`,
      metadata: data,
    });
    return this.resolve(organizationId);
  }

  async createPlan(
    input: {
      key: string;
      name: string;
      parentPlanId?: string | null;
      entitlements: PlanEntitlementInput[];
    },
    actor?: AuditActor | null
  ) {
    const key = input.key.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(key)) {
      throw new BadRequestException('Plan key must be lowercase kebab-case');
    }
    const created = await this.prisma.plan.create({
      data: {
        key,
        name: input.name.trim(),
        parentPlanId: input.parentPlanId || null,
        entitlements: {
          create: input.entitlements.map((row) => ({
            key: row.key,
            kind: row.kind,
            value: row.value,
          })),
        },
      },
    });
    await this.recordAudit({
      actor,
      action: 'PLAN_CREATED',
      targetType: 'PLAN',
      targetId: created.id,
      summary: `Created plan ${created.name}`,
      metadata: { key: created.key, parentPlanId: created.parentPlanId },
    });
    return created;
  }

  async updatePlan(
    planId: string,
    input: {
      name?: string;
      parentPlanId?: string | null;
      entitlements?: PlanEntitlementInput[];
    },
    actor?: AuditActor | null
  ) {
    const existing = await this.prisma.plan.findUnique({
      where: { id: planId },
    });
    if (!existing) throw new NotFoundException(`Plan ${planId} not found`);
    if (input.parentPlanId === planId) {
      throw new BadRequestException('A plan cannot include itself');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.plan.update({
        where: { id: planId },
        data: {
          ...(input.name?.trim() ? { name: input.name.trim() } : {}),
          ...(input.parentPlanId !== undefined
            ? { parentPlanId: input.parentPlanId || null }
            : {}),
        },
      });
      if (input.entitlements) {
        await tx.planEntitlement.deleteMany({ where: { planId } });
        if (input.entitlements.length > 0) {
          await tx.planEntitlement.createMany({
            data: input.entitlements.map((row) => ({
              planId,
              key: row.key,
              kind: row.kind,
              value: row.value,
            })),
          });
        }
      }
    });

    await this.recordAudit({
      actor,
      action: 'PLAN_UPDATED',
      targetType: 'PLAN',
      targetId: planId,
      summary: `Updated plan ${input.name?.trim() || existing.name}`,
    });

    const updated = await this.prisma.plan.findUnique({
      where: { id: planId },
      include: { entitlements: true, parent: true },
    });
    if (!updated) throw new NotFoundException(`Plan ${planId} not found`);
    return updated;
  }

  async setOrganizationPlan(
    organizationId: string,
    planId: string,
    actor?: AuditActor | null
  ) {
    const before = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: { plan: true },
    });
    const next = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!next) throw new NotFoundException(`Plan ${planId} not found`);
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { planId },
    });
    await this.recordAudit({
      actor,
      action: 'PLAN_ASSIGNED',
      organizationId,
      targetType: 'ORGANIZATION',
      targetId: organizationId,
      summary: `Assigned ${next.name}`,
      metadata: {
        from: before?.plan?.name ?? null,
        to: next.name,
      },
    });
    return this.resolve(organizationId);
  }

  async setOrganizationStatus(
    organizationId: string,
    status: OrganizationStatus,
    trialEndsAt?: Date | null,
    actor?: AuditActor | null
  ) {
    const before = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        status,
        ...(trialEndsAt !== undefined ? { trialEndsAt } : {}),
      },
    });
    await this.recordAudit({
      actor,
      action: 'STATUS_CHANGED',
      organizationId,
      targetType: 'ORGANIZATION',
      targetId: organizationId,
      summary: `Status ${before?.status ?? '?'} → ${status}`,
      metadata: { from: before?.status ?? null, to: status },
    });
    return this.resolve(organizationId);
  }

  async upsertOverride(
    organizationId: string,
    key: string,
    kind: EntitlementKind,
    value: string,
    actor?: AuditActor | null
  ) {
    const row = await this.prisma.organizationOverride.upsert({
      where: { organizationId_key: { organizationId, key } },
      create: { organizationId, key, kind, value },
      update: { kind, value },
    });
    await this.recordAudit({
      actor,
      action: 'OVERRIDE_UPSERTED',
      organizationId,
      targetType: 'OVERRIDE',
      targetId: row.id,
      summary: `Override ${key} = ${value}`,
      metadata: { key, kind, value },
    });
    return row;
  }

  async deleteOverride(
    organizationId: string,
    key: string,
    actor?: AuditActor | null
  ) {
    await this.prisma.organizationOverride.deleteMany({
      where: { organizationId, key },
    });
    await this.recordAudit({
      actor,
      action: 'OVERRIDE_DELETED',
      organizationId,
      targetType: 'OVERRIDE',
      targetId: key,
      summary: `Removed override ${key}`,
      metadata: { key },
    });
    return true;
  }

  async resolve(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        plan: { include: { parent: true } },
        overrides: true,
        usage: true,
        memberships: {
          include: { user: true, role: true },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { memberships: true, products: true, projects: true } },
      },
    });
    if (!organization) {
      throw new NotFoundException(`Organization ${organizationId} not found`);
    }

    const planRows = await this.planChainValues(organization.planId);
    const overrideMap = new Map(
      organization.overrides.map((row) => [row.key, row])
    );

    const usage = await this.liveUsage(organizationId, organization);

    const capabilities = CAPABILITIES.map((cap) => {
      const override = overrideMap.get(cap.key);
      const plan = planRows.get(cap.key);
      const baseValue = plan?.value ?? 'false';
      const value = override?.value ?? baseValue;
      const source = override ? 'OVERRIDE' : (plan?.source ?? 'NONE');
      return {
        key: cap.key,
        kind: EntitlementKind.CAPABILITY,
        value,
        baseValue,
        enabled: isCapabilityEnabled(value),
        limit: null,
        used: null,
        source,
        label: cap.label,
        application: cap.application,
        shortKey: cap.shortKey,
      } satisfies ResolvedRow;
    });

    const limits = LIMITS.map((limit) => {
      const override = overrideMap.get(limit.key);
      const plan = planRows.get(limit.key);
      const baseValue = plan?.value ?? '0';
      const value = override?.value ?? baseValue;
      const source = override ? 'OVERRIDE' : (plan?.source ?? 'NONE');
      return {
        key: limit.key,
        kind: EntitlementKind.LIMIT,
        value,
        baseValue,
        enabled: true,
        limit: Number(value),
        used: usage[limit.key] ?? 0,
        source,
        label: limit.label,
        application: limit.application,
        shortKey: limit.shortKey,
      } satisfies ResolvedRow;
    });

    const applications = APPLICATIONS.map((app) => {
      const cap = capabilities.find((row) => row.key === app.gate);
      return {
        id: app.id,
        label: app.label,
        gate: app.gate,
        enabled: cap?.enabled === true,
        source: cap?.source ?? 'NONE',
      };
    });

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      slug: organization.slug,
      status: organization.status,
      trialEndsAt: organization.trialEndsAt,
      planId: organization.plan?.id ?? null,
      planName: organization.plan?.name ?? null,
      planKey: organization.plan?.key ?? null,
      parentPlanName: organization.plan?.parent?.name ?? null,
      capabilities,
      limits,
      applications,
      overrides: organization.overrides,
      members: organization.memberships.map((row) => ({
        id: row.id,
        userId: row.userId,
        email: row.user.email,
        name: row.user.name,
        roleName: row.role.name,
        organizationId: organization.id,
        organizationName: organization.name,
        planName: organization.plan?.name ?? null,
      })),
    };
  }

  private async recordAudit(input: {
    actor?: AuditActor | null;
    action: string;
    organizationId?: string | null;
    targetType: string;
    targetId?: string | null;
    summary: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.auditEvent.create({
      data: {
        actorUserId: input.actor?.userId ?? null,
        actorEmail: input.actor?.email ?? null,
        action: input.action,
        organizationId: input.organizationId ?? null,
        targetType: input.targetType,
        targetId: input.targetId ?? null,
        summary: input.summary,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  }

  private async planChainValues(planId: string | null) {
    const map = new Map<string, { value: string; source: string }>();
    if (!planId) return map;

    const chain: Array<{
      id: string;
      entitlements: Array<{ key: string; value: string }>;
    }> = [];
    let currentId: string | null = planId;
    const seen = new Set<string>();
    while (currentId && !seen.has(currentId)) {
      seen.add(currentId);
      const node: {
        id: string;
        parentPlanId: string | null;
        entitlements: Array<{ key: string; value: string }>;
      } | null = await this.prisma.plan.findUnique({
        where: { id: currentId },
        select: {
          id: true,
          parentPlanId: true,
          entitlements: { select: { key: true, value: true } },
        },
      });
      if (!node) break;
      chain.push({ id: node.id, entitlements: node.entitlements });
      currentId = node.parentPlanId;
    }

    for (const node of chain.reverse()) {
      const source = node.id === planId ? 'PLAN' : 'PARENT_PLAN';
      for (const row of node.entitlements) {
        map.set(row.key, { value: row.value, source });
      }
    }
    return map;
  }

  private async liveUsage(
    organizationId: string,
    organization: {
      _count: { memberships: number; products: number; projects: number };
      usage: Array<{ key: string; period: string; used: number }>;
    }
  ) {
    const models = await this.prisma.objectAsset.count({
      where: { organizationId },
    });
    const storage = await this.prisma.objectAsset.aggregate({
      where: { organizationId },
      _sum: { sizeBytes: true },
    });
    const month = new Date().toISOString().slice(0, 7);
    const ai = organization.usage.find(
      (row) =>
        row.key === 'limits.ai.generations.monthly' && row.period === month
    );

    return {
      'limits.products': organization._count.products,
      'limits.models': models,
      'limits.storage.gb': Number(
        ((storage._sum.sizeBytes ?? 0) / 1024 ** 3).toFixed(2)
      ),
      'limits.users': organization._count.memberships,
      'limits.projects': organization._count.projects,
      'limits.ai.generations.monthly': ai?.used ?? 0,
    } as Record<string, number>;
  }
}
