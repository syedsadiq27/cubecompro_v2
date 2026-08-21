-- Persist document/object/material/texture paths as store-relative keys.
-- Absolute file:// and host paths break when DOCUMENT_STORE_PATH / GCS moves.

CREATE OR REPLACE FUNCTION cubecom_store_relative_key(uri text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  path text;
  marker_pos int;
BEGIN
  IF uri IS NULL OR btrim(uri) = '' THEN
    RETURN uri;
  END IF;

  path := btrim(uri);

  IF path !~* '^(file://|/|[A-Za-z]:[\\/]|gs://|s3://|https?://)'
     AND position('://' in path) = 0 THEN
    RETURN regexp_replace(path, '^/+', '');
  END IF;

  IF path ~* '^file://' THEN
    path := regexp_replace(path, '^file://', '');
  END IF;

  marker_pos := position('/.data/documents/' in path);
  IF marker_pos > 0 THEN
    RETURN substring(path from marker_pos + length('/.data/documents/'));
  END IF;

  marker_pos := position('/documents/' in path);
  IF marker_pos > 0 THEN
    RETURN substring(path from marker_pos + length('/documents/'));
  END IF;

  IF path ~ 'assets/sha256/' THEN
    RETURN regexp_replace(path, '^.*?(assets/sha256/[^?#]+)$', '\1');
  END IF;

  IF path !~ '^/' AND path !~* '^[A-Za-z]:[\\/]' AND position('://' in path) = 0 THEN
    RETURN regexp_replace(path, '^/+', '');
  END IF;

  RETURN path;
END;
$$;

UPDATE "MaterialAsset"
SET "documentUri" = cubecom_store_relative_key("documentUri")
WHERE "documentUri" IS NOT NULL
  AND "documentUri" <> cubecom_store_relative_key("documentUri");

UPDATE "MaterialAssetRevision"
SET "definitionUri" = cubecom_store_relative_key("definitionUri")
WHERE "definitionUri" IS NOT NULL
  AND "definitionUri" <> cubecom_store_relative_key("definitionUri");

UPDATE "TextureAsset"
SET "fileUri" = cubecom_store_relative_key("fileUri")
WHERE "fileUri" IS NOT NULL
  AND "fileUri" <> cubecom_store_relative_key("fileUri");

UPDATE "TextureAssetRevision"
SET "artifactUri" = cubecom_store_relative_key("artifactUri")
WHERE "artifactUri" IS NOT NULL
  AND "artifactUri" <> cubecom_store_relative_key("artifactUri");

UPDATE "ObjectAsset"
SET "fileUri" = cubecom_store_relative_key("fileUri")
WHERE "fileUri" IS NOT NULL
  AND "fileUri" <> cubecom_store_relative_key("fileUri");

UPDATE "ObjectAsset"
SET "parsedMetadataUri" = cubecom_store_relative_key("parsedMetadataUri")
WHERE "parsedMetadataUri" IS NOT NULL
  AND "parsedMetadataUri" <> cubecom_store_relative_key("parsedMetadataUri");

UPDATE "ObjectAssetRevision"
SET "runtimeArtifactUri" = cubecom_store_relative_key("runtimeArtifactUri")
WHERE "runtimeArtifactUri" IS NOT NULL
  AND "runtimeArtifactUri" <> cubecom_store_relative_key("runtimeArtifactUri");

UPDATE "ObjectAssetRevision"
SET "parsedMetadataUri" = cubecom_store_relative_key("parsedMetadataUri")
WHERE "parsedMetadataUri" IS NOT NULL
  AND "parsedMetadataUri" <> cubecom_store_relative_key("parsedMetadataUri");

UPDATE "ProductGraphVersion"
SET "graphUri" = cubecom_store_relative_key("graphUri")
WHERE "graphUri" IS NOT NULL
  AND "graphUri" <> cubecom_store_relative_key("graphUri");

UPDATE "SavedConfiguration"
SET "stateUri" = cubecom_store_relative_key("stateUri")
WHERE "stateUri" IS NOT NULL
  AND "stateUri" <> cubecom_store_relative_key("stateUri");

DROP FUNCTION cubecom_store_relative_key(text);
