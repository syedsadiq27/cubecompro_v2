-- ProductModel static visual setup (always-on; not ChoiceValue-gated)
CREATE TABLE "VisualSetup" (
    "id" TEXT NOT NULL,
    "productModelId" TEXT NOT NULL,
    "modelTargetId" TEXT NOT NULL,
    "operation" "VisualOperation" NOT NULL,
    "value" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VisualSetup_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VisualSetup_productModelId_idx" ON "VisualSetup"("productModelId");
CREATE INDEX "VisualSetup_modelTargetId_idx" ON "VisualSetup"("modelTargetId");

ALTER TABLE "VisualSetup" ADD CONSTRAINT "VisualSetup_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "ProductModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VisualSetup" ADD CONSTRAINT "VisualSetup_modelTargetId_fkey" FOREIGN KEY ("modelTargetId") REFERENCES "ModelTarget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
