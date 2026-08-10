'use client';

import { useEffect } from 'react';
import { bootstrapEditorProduct } from '../lib/bootstrap-editor';
import {
  buildProductConfiguration,
  initialActiveValues,
} from '../lib/configuration';
import { useEditorStore } from '../lib/editor-store';

export function useEditorProductLoad() {
  const runtime = useEditorStore((state) => state.runtime);
  const projectId = useEditorStore((state) => state.projectId);
  const productId = useEditorStore((state) => state.productId);
  const modelId = useEditorStore((state) => state.modelId);
  const setLoading = useEditorStore((state) => state.setLoading);
  const setLoadError = useEditorStore((state) => state.setLoadError);
  const setOutlineNodes = useEditorStore((state) => state.setOutlineNodes);
  const setDocument = useEditorStore((state) => state.setDocument);
  const setConfiguration = useEditorStore((state) => state.setConfiguration);
  const selectConfigValue = useEditorStore((state) => state.selectConfigValue);

  useEffect(() => {
    if (!runtime || !projectId || !productId) {
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError(null);
      setDocument(null);
      setConfiguration(null, {}, null);
      try {
        const bundle = await bootstrapEditorProduct({
          projectId,
          productId,
          modelId,
        });
        if (cancelled) return;

        const meshCount = await runtime.mountAssets({
          assets: bundle.assets,
          cameraConfig: bundle.camera,
          materials: bundle.materials,
          textures: bundle.textures,
        });

        if (cancelled) return;

        const configuration = buildProductConfiguration(bundle.product);
        const visibleAssetIds = new Set(
          bundle.assets
            .filter((asset) => asset.visible)
            .map((asset) => asset.id)
        );
        const activeValues = initialActiveValues(
          configuration,
          visibleAssetIds
        );
        const firstProperty = configuration.properties.find(
          (property) => activeValues[property.id]
        );
        const selection = firstProperty
          ? {
              propertyId: firstProperty.id,
              valueId: activeValues[firstProperty.id]!,
            }
          : null;

        setDocument({
          productId,
          productName: bundle.product.Name || `Product ${productId}`,
          productCode: bundle.product.code || productId,
          modelId: modelId || String(bundle.model?.id ?? ''),
          modelName:
            bundle.model?.name ||
            bundle.model?.sku ||
            (modelId ? `Model ${modelId}` : 'Model'),
          modelSku: bundle.model?.sku || bundle.product.code || '',
          materialCount: Object.keys(bundle.materials.materials).length,
          ruleCount: Object.keys(bundle.materials.rules).length,
          meshCount,
          objectCount: bundle.assets.length,
        });
        setConfiguration(configuration, activeValues, selection);

        Object.entries(activeValues).forEach(([propertyId, valueId]) => {
          selectConfigValue(propertyId, valueId, { focus: false });
        });
        if (selection) {
          selectConfigValue(selection.propertyId, selection.valueId, {
            focus: true,
          });
        }
      } catch (error) {
        if (cancelled) return;
        runtime.clearProduct();
        setOutlineNodes([]);
        setDocument(null);
        setConfiguration(null, {}, null);
        setLoadError(
          error instanceof Error ? error.message : 'Failed to load model'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    runtime,
    projectId,
    productId,
    modelId,
    setLoading,
    setLoadError,
    setOutlineNodes,
    setDocument,
    setConfiguration,
    selectConfigValue,
  ]);
}
