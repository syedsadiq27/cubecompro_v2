-- AlterTable
ALTER TABLE "IntegrationConnection" ADD COLUMN "configJson" JSONB;

-- AlterTable: allow empty accessToken for cubecom connections that use configJson
ALTER TABLE "IntegrationConnection" ALTER COLUMN "accessToken" SET DEFAULT '';
