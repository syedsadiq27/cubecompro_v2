-- Phase 4B: ProductModel multi-asset link layer

CREATE TYPE "ProductModelAssetRole" AS ENUM (
  'OBJECT',
  'MATERIAL',
  'TEXTURE',
  'ENVIRONMENT',
  'SHADER',
  'ANIMATION'
);

CREATE TABLE "ProductModelAsset" (
  "id" TEXT NOT NULL,
  "productModelId" TEXT NOT NULL,
  "role" "ProductModelAssetRole" NOT NULL,
  "key" TEXT NOT NULL,
  "assetRevisionId" TEXT NOT NULL,

  CONSTRAINT "ProductModelAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductModelAsset_productModelId_role_key_key"
  ON "ProductModelAsset"("productModelId", "role", "key");
CREATE INDEX "ProductModelAsset_productModelId_idx"
  ON "ProductModelAsset"("productModelId");
CREATE INDEX "ProductModelAsset_assetRevisionId_idx"
  ON "ProductModelAsset"("assetRevisionId");

ALTER TABLE "ProductModelAsset"
  ADD CONSTRAINT "ProductModelAsset_productModelId_fkey"
  FOREIGN KEY ("productModelId") REFERENCES "ProductModel"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Mirror each existing root pin as OBJECT/root
INSERT INTO "ProductModelAsset" ("id", "productModelId", "role", "key", "assetRevisionId")
SELECT
  'pma_root_' || "id",
  "id",
  'OBJECT',
  'root',
  "objectAssetRevisionId"
FROM "ProductModel";
