DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ModelBinding'
  ) THEN
    ALTER TABLE "ModelBinding" RENAME TO "ModelTarget";

    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ModelBinding_pkey') THEN
      ALTER INDEX "ModelBinding_pkey" RENAME TO "ModelTarget_pkey";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ModelBinding_productModelId_idx') THEN
      ALTER INDEX "ModelBinding_productModelId_idx" RENAME TO "ModelTarget_productModelId_idx";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ModelBinding_productModelId_key_key') THEN
      ALTER INDEX "ModelBinding_productModelId_key_key" RENAME TO "ModelTarget_productModelId_key_key";
    END IF;
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'ModelBinding_productModelId_fkey'
    ) THEN
      ALTER TABLE "ModelTarget" RENAME CONSTRAINT "ModelBinding_productModelId_fkey" TO "ModelTarget_productModelId_fkey";
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'VisualEffect'
      AND column_name = 'modelBindingId'
  ) THEN
    ALTER TABLE "VisualEffect" RENAME COLUMN "modelBindingId" TO "modelTargetId";
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'VisualEffect_modelBindingId_idx') THEN
      ALTER INDEX "VisualEffect_modelBindingId_idx" RENAME TO "VisualEffect_modelTargetId_idx";
    END IF;
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'VisualEffect_modelBindingId_fkey'
    ) THEN
      ALTER TABLE "VisualEffect" RENAME CONSTRAINT "VisualEffect_modelBindingId_fkey" TO "VisualEffect_modelTargetId_fkey";
    END IF;
  END IF;
END $$;
