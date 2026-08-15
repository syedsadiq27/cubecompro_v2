-- Phase 4A: immutable ObjectAssetRevision pinning

CREATE TABLE "ObjectAssetRevision" (
    "id" TEXT NOT NULL,
    "objectAssetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "runtimeArtifactUri" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "frozenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "format" TEXT,
    "sizeBytes" INTEGER,
    "parsedMetadataUri" TEXT,
    "parsedMetadataSha256" TEXT,
    "metadataVersion" INTEGER,

    CONSTRAINT "ObjectAssetRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ObjectAssetRevision_objectAssetId_version_key" ON "ObjectAssetRevision"("objectAssetId", "version");
CREATE INDEX "ObjectAssetRevision_objectAssetId_idx" ON "ObjectAssetRevision"("objectAssetId");
CREATE INDEX "ObjectAssetRevision_contentHash_idx" ON "ObjectAssetRevision"("contentHash");

ALTER TABLE "ObjectAssetRevision" ADD CONSTRAINT "ObjectAssetRevision_objectAssetId_fkey" FOREIGN KEY ("objectAssetId") REFERENCES "ObjectAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- One initial revision per existing ObjectAsset (current canonical bytes only)
INSERT INTO "ObjectAssetRevision" (
  "id",
  "objectAssetId",
  "version",
  "runtimeArtifactUri",
  "contentHash",
  "frozenAt",
  "format",
  "sizeBytes",
  "parsedMetadataUri",
  "parsedMetadataSha256",
  "metadataVersion"
)
SELECT
  'oar_' || "id",
  "id",
  1,
  "fileUri",
  "fileSha256",
  "createdAt",
  "format",
  "sizeBytes",
  "parsedMetadataUri",
  "parsedMetadataSha256",
  "metadataVersion"
FROM "ObjectAsset";

ALTER TABLE "ProductModel" ADD COLUMN "objectAssetRevisionId" TEXT;

UPDATE "ProductModel" AS pm
SET "objectAssetRevisionId" = 'oar_' || pm."assetId"
WHERE pm."objectAssetRevisionId" IS NULL;

ALTER TABLE "ProductModel" ALTER COLUMN "objectAssetRevisionId" SET NOT NULL;

ALTER TABLE "ProductModel" DROP CONSTRAINT IF EXISTS "ProductModel_assetId_fkey";
DROP INDEX IF EXISTS "ProductModel_assetId_idx";
ALTER TABLE "ProductModel" DROP COLUMN "assetId";

CREATE INDEX "ProductModel_objectAssetRevisionId_idx" ON "ProductModel"("objectAssetRevisionId");

ALTER TABLE "ProductModel" ADD CONSTRAINT "ProductModel_objectAssetRevisionId_fkey" FOREIGN KEY ("objectAssetRevisionId") REFERENCES "ObjectAssetRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
