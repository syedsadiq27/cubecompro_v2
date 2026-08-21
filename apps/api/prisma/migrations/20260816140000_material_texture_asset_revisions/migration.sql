-- Phase 4D: immutable MaterialAssetRevision + TextureAssetRevision

CREATE TYPE "TextureSemanticSlot" AS ENUM (
  'BASE_COLOR',
  'NORMAL',
  'METALLIC_ROUGHNESS',
  'OCCLUSION',
  'EMISSIVE'
);

CREATE TABLE "TextureAssetRevision" (
    "id" TEXT NOT NULL,
    "textureAssetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "artifactUri" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "frozenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER,

    CONSTRAINT "TextureAssetRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TextureAssetRevision_textureAssetId_version_key" ON "TextureAssetRevision"("textureAssetId", "version");
CREATE INDEX "TextureAssetRevision_textureAssetId_idx" ON "TextureAssetRevision"("textureAssetId");
CREATE INDEX "TextureAssetRevision_contentHash_idx" ON "TextureAssetRevision"("contentHash");

ALTER TABLE "TextureAssetRevision" ADD CONSTRAINT "TextureAssetRevision_textureAssetId_fkey" FOREIGN KEY ("textureAssetId") REFERENCES "TextureAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "TextureAssetRevision" (
  "id",
  "textureAssetId",
  "version",
  "artifactUri",
  "contentHash",
  "frozenAt"
)
SELECT
  'tar_' || "id",
  "id",
  1,
  "fileUri",
  "fileSha256",
  "createdAt"
FROM "TextureAsset";

CREATE TABLE "MaterialAssetRevision" (
    "id" TEXT NOT NULL,
    "materialAssetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "definitionUri" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "frozenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialAssetRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MaterialAssetRevision_materialAssetId_version_key" ON "MaterialAssetRevision"("materialAssetId", "version");
CREATE INDEX "MaterialAssetRevision_materialAssetId_idx" ON "MaterialAssetRevision"("materialAssetId");
CREATE INDEX "MaterialAssetRevision_contentHash_idx" ON "MaterialAssetRevision"("contentHash");

ALTER TABLE "MaterialAssetRevision" ADD CONSTRAINT "MaterialAssetRevision_materialAssetId_fkey" FOREIGN KEY ("materialAssetId") REFERENCES "MaterialAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "MaterialAssetRevision" (
  "id",
  "materialAssetId",
  "version",
  "definitionUri",
  "contentHash",
  "frozenAt"
)
SELECT
  'mar_' || "id",
  "id",
  1,
  "documentUri",
  "documentSha256",
  "createdAt"
FROM "MaterialAsset";

CREATE TABLE "MaterialTextureUsage" (
    "id" TEXT NOT NULL,
    "materialAssetRevisionId" TEXT NOT NULL,
    "slot" "TextureSemanticSlot" NOT NULL,
    "textureAssetRevisionId" TEXT NOT NULL,
    "texCoord" INTEGER,
    "transformJson" JSONB,
    "samplerJson" JSONB,

    CONSTRAINT "MaterialTextureUsage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MaterialTextureUsage_materialAssetRevisionId_slot_key" ON "MaterialTextureUsage"("materialAssetRevisionId", "slot");
CREATE INDEX "MaterialTextureUsage_materialAssetRevisionId_idx" ON "MaterialTextureUsage"("materialAssetRevisionId");
CREATE INDEX "MaterialTextureUsage_textureAssetRevisionId_idx" ON "MaterialTextureUsage"("textureAssetRevisionId");

ALTER TABLE "MaterialTextureUsage" ADD CONSTRAINT "MaterialTextureUsage_materialAssetRevisionId_fkey" FOREIGN KEY ("materialAssetRevisionId") REFERENCES "MaterialAssetRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaterialTextureUsage" ADD CONSTRAINT "MaterialTextureUsage_textureAssetRevisionId_fkey" FOREIGN KEY ("textureAssetRevisionId") REFERENCES "TextureAssetRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Retarget ProductModelAsset MATERIAL/TEXTURE links: asset id → revision v1 id
UPDATE "ProductModelAsset"
SET "assetRevisionId" = 'mar_' || "assetRevisionId"
WHERE "role" = 'MATERIAL'
  AND EXISTS (SELECT 1 FROM "MaterialAsset" m WHERE m."id" = "ProductModelAsset"."assetRevisionId");

UPDATE "ProductModelAsset"
SET "assetRevisionId" = 'tar_' || "assetRevisionId"
WHERE "role" = 'TEXTURE'
  AND EXISTS (SELECT 1 FROM "TextureAsset" t WHERE t."id" = "ProductModelAsset"."assetRevisionId");

-- Retarget SET_MATERIAL VisualEffect values: materialAssetId → materialAssetRevisionId
UPDATE "VisualEffect"
SET "value" = jsonb_build_object(
  'materialAssetRevisionId',
  'mar_' || ("value"->>'materialAssetId')
)
WHERE "operation" = 'SET_MATERIAL'
  AND ("value" ? 'materialAssetId')
  AND NOT ("value" ? 'materialAssetRevisionId')
  AND EXISTS (
    SELECT 1 FROM "MaterialAsset" m
    WHERE m."id" = ("VisualEffect"."value"->>'materialAssetId')
  );
