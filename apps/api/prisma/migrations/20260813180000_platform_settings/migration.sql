CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "app" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlatformSetting_app_key_key" ON "PlatformSetting"("app", "key");
CREATE INDEX "PlatformSetting_app_idx" ON "PlatformSetting"("app");
