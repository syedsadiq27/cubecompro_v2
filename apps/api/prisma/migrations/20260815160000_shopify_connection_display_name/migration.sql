-- AlterTable
ALTER TABLE "IntegrationConnection" ADD COLUMN IF NOT EXISTS "displayName" TEXT;

-- DropForeignKey
ALTER TABLE "CommerceMappingSet" DROP CONSTRAINT IF EXISTS "CommerceMappingSet_integrationConnectionId_fkey";

-- AddForeignKey
ALTER TABLE "CommerceMappingSet" ADD CONSTRAINT "CommerceMappingSet_integrationConnectionId_fkey" FOREIGN KEY ("integrationConnectionId") REFERENCES "IntegrationConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
