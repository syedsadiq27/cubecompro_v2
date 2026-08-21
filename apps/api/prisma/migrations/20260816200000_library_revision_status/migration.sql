-- CreateEnum
CREATE TYPE "LibraryRevisionStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "MaterialAssetRevision" ADD COLUMN "status" "LibraryRevisionStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "TextureAssetRevision" ADD COLUMN "status" "LibraryRevisionStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ObjectAssetRevision" ADD COLUMN "status" "LibraryRevisionStatus" NOT NULL DEFAULT 'DRAFT';

-- Existing revisions were already treated as frozen tips — mark published.
UPDATE "MaterialAssetRevision" SET "status" = 'PUBLISHED';
UPDATE "TextureAssetRevision" SET "status" = 'PUBLISHED';
UPDATE "ObjectAssetRevision" SET "status" = 'PUBLISHED';

-- CreateIndex
CREATE INDEX "MaterialAssetRevision_materialAssetId_status_idx" ON "MaterialAssetRevision"("materialAssetId", "status");

-- CreateIndex
CREATE INDEX "TextureAssetRevision_textureAssetId_status_idx" ON "TextureAssetRevision"("textureAssetId", "status");

-- CreateIndex
CREATE INDEX "ObjectAssetRevision_objectAssetId_status_idx" ON "ObjectAssetRevision"("objectAssetId", "status");
