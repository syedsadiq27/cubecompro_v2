CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'TRIAL', 'SUSPENDED');
CREATE TYPE "EntitlementKind" AS ENUM ('CAPABILITY', 'LIMIT');

CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentPlanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Plan_key_key" ON "Plan"("key");

CREATE TABLE "PlanEntitlement" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "EntitlementKind" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PlanEntitlement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlanEntitlement_planId_key_key" ON "PlanEntitlement"("planId", "key");
CREATE INDEX "PlanEntitlement_planId_idx" ON "PlanEntitlement"("planId");

CREATE TABLE "OrganizationOverride" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "EntitlementKind" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationOverride_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrganizationOverride_organizationId_key_key" ON "OrganizationOverride"("organizationId", "key");
CREATE INDEX "OrganizationOverride_organizationId_idx" ON "OrganizationOverride"("organizationId");

CREATE TABLE "UsageCounter" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageCounter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UsageCounter_organizationId_key_period_key" ON "UsageCounter"("organizationId", "key", "period");
CREATE INDEX "UsageCounter_organizationId_idx" ON "UsageCounter"("organizationId");

ALTER TABLE "Organization" ADD COLUMN "planId" TEXT;
ALTER TABLE "Organization" ADD COLUMN "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Organization" ADD COLUMN "trialEndsAt" TIMESTAMP(3);

ALTER TABLE "Plan" ADD CONSTRAINT "Plan_parentPlanId_fkey" FOREIGN KEY ("parentPlanId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationOverride" ADD CONSTRAINT "OrganizationOverride_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageCounter" ADD CONSTRAINT "UsageCounter_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
