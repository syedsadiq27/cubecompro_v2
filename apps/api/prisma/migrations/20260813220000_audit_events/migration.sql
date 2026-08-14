CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "organizationId" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
