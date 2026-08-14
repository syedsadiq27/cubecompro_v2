CREATE TABLE "LeadFunnelStatus" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "submittedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadFunnelStatus_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeadFunnelStatus_email_submittedAt_key" ON "LeadFunnelStatus"("email", "submittedAt");
CREATE INDEX "LeadFunnelStatus_status_idx" ON "LeadFunnelStatus"("status");
