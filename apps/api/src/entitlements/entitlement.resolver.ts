import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { EntitlementKind, OrganizationStatus } from '@prisma/client';
import { CurrentUser, type AuthUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { APPLICATIONS, CAPABILITIES, LIMITS } from './catalog';
import { EntitlementService } from './entitlement.service';

registerEnumType(OrganizationStatus, { name: 'OrganizationStatus' });
registerEnumType(EntitlementKind, { name: 'EntitlementKind' });

@ObjectType()
class ApplicationModel {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  gate: string;
}

@ObjectType()
class CatalogItemModel {
  @Field()
  key: string;

  @Field()
  shortKey: string;

  @Field()
  label: string;

  @Field()
  application: string;

  @Field(() => String, { nullable: true })
  unit?: string | null;
}

@ObjectType()
class EntitlementCatalogModel {
  @Field(() => [ApplicationModel])
  applications: ApplicationModel[];

  @Field(() => [CatalogItemModel])
  capabilities: CatalogItemModel[];

  @Field(() => [CatalogItemModel])
  limits: CatalogItemModel[];
}

@ObjectType()
class PlanEntitlementModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field(() => EntitlementKind)
  kind: EntitlementKind;

  @Field()
  value: string;
}

@ObjectType()
class PlanModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  parentPlanId?: string | null;

  @Field(() => String, { nullable: true })
  parentName?: string | null;

  @Field(() => [PlanEntitlementModel])
  entitlements: PlanEntitlementModel[];
}

@ObjectType()
class TenantModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => OrganizationStatus)
  status: OrganizationStatus;

  @Field(() => Date, { nullable: true })
  trialEndsAt?: Date | null;

  @Field(() => Int)
  memberCount: number;

  @Field(() => ID, { nullable: true })
  planId?: string | null;

  @Field(() => String, { nullable: true })
  planName?: string | null;

  @Field(() => String, { nullable: true })
  planKey?: string | null;
}

@ObjectType()
class TenantUserModel {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field()
  roleName: string;

  @Field()
  organizationId: string;

  @Field()
  organizationName: string;

  @Field(() => String, { nullable: true })
  planName?: string | null;
}

@ObjectType()
class OverrideModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field(() => EntitlementKind)
  kind: EntitlementKind;

  @Field()
  value: string;
}

@ObjectType()
class ResolvedRowModel {
  @Field()
  key: string;

  @Field()
  shortKey: string;

  @Field()
  application: string;

  @Field(() => EntitlementKind)
  kind: EntitlementKind;

  @Field()
  value: string;

  @Field()
  baseValue: string;

  @Field()
  enabled: boolean;

  @Field(() => Number, { nullable: true })
  limit?: number | null;

  @Field(() => Number, { nullable: true })
  used?: number | null;

  @Field()
  source: string;

  @Field()
  label: string;
}

@ObjectType()
class ApplicationAccessModel {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  gate: string;

  @Field()
  enabled: boolean;

  @Field()
  source: string;
}

@ObjectType()
class ResolvedAccessModel {
  @Field()
  organizationId: string;

  @Field()
  organizationName: string;

  @Field()
  slug: string;

  @Field(() => OrganizationStatus)
  status: OrganizationStatus;

  @Field(() => Date, { nullable: true })
  trialEndsAt?: Date | null;

  @Field(() => ID, { nullable: true })
  planId?: string | null;

  @Field(() => String, { nullable: true })
  planName?: string | null;

  @Field(() => String, { nullable: true })
  planKey?: string | null;

  @Field(() => String, { nullable: true })
  parentPlanName?: string | null;

  @Field(() => [ResolvedRowModel])
  capabilities: ResolvedRowModel[];

  @Field(() => [ResolvedRowModel])
  limits: ResolvedRowModel[];

  @Field(() => [ApplicationAccessModel])
  applications: ApplicationAccessModel[];

  @Field(() => [OverrideModel])
  overrides: OverrideModel[];

  @Field(() => [TenantUserModel])
  members: TenantUserModel[];
}

@ObjectType()
class AuditEventModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  actorUserId?: string | null;

  @Field(() => String, { nullable: true })
  actorEmail?: string | null;

  @Field()
  action: string;

  @Field(() => String, { nullable: true })
  organizationId?: string | null;

  @Field()
  targetType: string;

  @Field(() => String, { nullable: true })
  targetId?: string | null;

  @Field()
  summary: string;

  @Field(() => String, { nullable: true })
  metadata?: string | null;

  @Field()
  createdAt: Date;
}

@InputType()
class UpsertOverrideInput {
  @Field()
  organizationId: string;

  @Field()
  key: string;

  @Field(() => EntitlementKind)
  kind: EntitlementKind;

  @Field()
  value: string;
}

@InputType()
class CreateTenantInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => ID, { nullable: true })
  planId?: string | null;

  @Field(() => OrganizationStatus, { nullable: true })
  status?: OrganizationStatus;
}

@InputType()
class UpdateTenantInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  slug?: string;
}

@InputType()
class PlanEntitlementInput {
  @Field()
  key: string;

  @Field(() => EntitlementKind)
  kind: EntitlementKind;

  @Field()
  value: string;
}

@InputType()
class CreatePlanInput {
  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  parentPlanId?: string | null;

  @Field(() => [PlanEntitlementInput])
  entitlements: PlanEntitlementInput[];
}

@InputType()
class UpdatePlanInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => ID, { nullable: true })
  parentPlanId?: string | null;

  @Field(() => [PlanEntitlementInput], { nullable: true })
  entitlements?: PlanEntitlementInput[];
}

function toPlanModel(row: {
  id: string;
  key: string;
  name: string;
  parentPlanId: string | null;
  parent?: { name: string } | null;
  entitlements: Array<{
    id: string;
    key: string;
    kind: EntitlementKind;
    value: string;
  }>;
}): PlanModel {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    parentPlanId: row.parentPlanId,
    parentName: row.parent?.name ?? null,
    entitlements: row.entitlements,
  };
}

function actorOf(user?: AuthUser | null) {
  if (!user) return null;
  return { userId: user.userId, email: user.email };
}

@Resolver()
export class EntitlementResolver {
  constructor(private readonly entitlements: EntitlementService) {}

  @Query(() => EntitlementCatalogModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  entitlementCatalog(): EntitlementCatalogModel {
    return {
      applications: APPLICATIONS.map((item) => ({
        id: item.id,
        label: item.label,
        gate: item.gate,
      })),
      capabilities: CAPABILITIES.map((item) => ({
        key: item.key,
        shortKey: item.shortKey,
        label: item.label,
        application: item.application,
      })),
      limits: LIMITS.map((item) => ({
        key: item.key,
        shortKey: item.shortKey,
        label: item.label,
        application: item.application,
        unit: item.unit,
      })),
    };
  }

  @Query(() => [TenantModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  tenants() {
    return this.entitlements.listOrganizations();
  }

  @Query(() => [TenantUserModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  tenantUsers() {
    return this.entitlements.listUsers();
  }

  @Query(() => [PlanModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async plans(): Promise<PlanModel[]> {
    const rows = await this.entitlements.listPlans();
    return rows.map(toPlanModel);
  }

  @Query(() => [AuditEventModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  auditEvents(
    @Args('organizationId', { type: () => String, nullable: true })
    organizationId?: string
  ) {
    return this.entitlements.listAudit(organizationId);
  }

  @Query(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard)
  resolvedAccess(
    @Args('organizationId', { type: () => String }) organizationId: string
  ) {
    return this.entitlements.resolve(organizationId);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  can(
    @Args('organizationId', { type: () => String }) organizationId: string,
    @Args('key') key: string
  ) {
    return this.entitlements.can(organizationId, key);
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  createTenant(
    @Args('input') input: CreateTenantInput,
    @CurrentUser() user?: AuthUser
  ) {
    return this.entitlements.createTenant(input, actorOf(user));
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  updateTenant(
    @Args('organizationId', { type: () => String }) organizationId: string,
    @Args('input') input: UpdateTenantInput,
    @CurrentUser() user?: AuthUser
  ) {
    return this.entitlements.updateTenant(organizationId, input, actorOf(user));
  }

  @Mutation(() => PlanModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async createPlan(
    @Args('input') input: CreatePlanInput,
    @CurrentUser() user?: AuthUser
  ) {
    const row = await this.entitlements.createPlan(input, actorOf(user));
    const plans = await this.entitlements.listPlans();
    const created = plans.find((plan) => plan.id === row.id);
    if (!created) return toPlanModel({ ...row, parent: null, entitlements: [] });
    return toPlanModel(created);
  }

  @Mutation(() => PlanModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async updatePlan(
    @Args('planId', { type: () => String }) planId: string,
    @Args('input') input: UpdatePlanInput,
    @CurrentUser() user?: AuthUser
  ) {
    const row = await this.entitlements.updatePlan(planId, input, actorOf(user));
    return toPlanModel(row);
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  assignPlan(
    @Args('organizationId', { type: () => String }) organizationId: string,
    @Args('planId', { type: () => String }) planId: string,
    @CurrentUser() user?: AuthUser
  ) {
    return this.entitlements.setOrganizationPlan(
      organizationId,
      planId,
      actorOf(user)
    );
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  setTenantStatus(
    @Args('organizationId', { type: () => String }) organizationId: string,
    @Args('status', { type: () => OrganizationStatus })
    status: OrganizationStatus,
    @Args('trialEndsAt', { type: () => Date, nullable: true })
    trialEndsAt?: Date | null,
    @CurrentUser() user?: AuthUser
  ) {
    return this.entitlements.setOrganizationStatus(
      organizationId,
      status,
      trialEndsAt,
      actorOf(user)
    );
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async upsertOverride(
    @Args('input') input: UpsertOverrideInput,
    @CurrentUser() user?: AuthUser
  ) {
    await this.entitlements.upsertOverride(
      input.organizationId,
      input.key,
      input.kind,
      input.value,
      actorOf(user)
    );
    return this.entitlements.resolve(input.organizationId);
  }

  @Mutation(() => ResolvedAccessModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async deleteOverride(
    @Args('organizationId', { type: () => String }) organizationId: string,
    @Args('key') key: string,
    @CurrentUser() user?: AuthUser
  ) {
    await this.entitlements.deleteOverride(
      organizationId,
      key,
      actorOf(user)
    );
    return this.entitlements.resolve(organizationId);
  }
}
