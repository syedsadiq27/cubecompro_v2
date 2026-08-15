-- AlterTable
ALTER TABLE "CommerceMappingSet" ADD COLUMN "integrationConnectionId" TEXT;

-- DropIndex
DROP INDEX IF EXISTS "CommerceMappingSet_productRevisionId_provider_key";

-- CreateIndex
CREATE UNIQUE INDEX "CommerceMappingSet_productRevisionId_provider_integrationConnectionId_key" ON "CommerceMappingSet"("productRevisionId", "provider", "integrationConnectionId");

-- CreateIndex
CREATE INDEX "CommerceMappingSet_integrationConnectionId_idx" ON "CommerceMappingSet"("integrationConnectionId");

-- CreateTable
CREATE TABLE "IntegrationConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "apiVersion" TEXT NOT NULL DEFAULT '2024-10',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductProviderImport" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "integrationConnectionId" TEXT NOT NULL,
    "externalProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductProviderImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntegrationConnection_organizationId_idx" ON "IntegrationConnection"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationConnection_organizationId_provider_externalAccountId_key" ON "IntegrationConnection"("organizationId", "provider", "externalAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductProviderImport_productId_key" ON "ProductProviderImport"("productId");

-- CreateIndex
CREATE INDEX "ProductProviderImport_integrationConnectionId_idx" ON "ProductProviderImport"("integrationConnectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductProviderImport_integrationConnectionId_externalProductId_key" ON "ProductProviderImport"("integrationConnectionId", "externalProductId");

-- AddForeignKey
ALTER TABLE "CommerceMappingSet" ADD CONSTRAINT "CommerceMappingSet_integrationConnectionId_fkey" FOREIGN KEY ("integrationConnectionId") REFERENCES "IntegrationConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationConnection" ADD CONSTRAINT "IntegrationConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductProviderImport" ADD CONSTRAINT "ProductProviderImport_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductProviderImport" ADD CONSTRAINT "ProductProviderImport_integrationConnectionId_fkey" FOREIGN KEY ("integrationConnectionId") REFERENCES "IntegrationConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
