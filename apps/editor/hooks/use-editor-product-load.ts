'use client';

import { useEffect } from 'react';
import { bootstrapProductEditor } from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';

export function useEditorProductLoad() {
  const runtime = useEditorStore((state) => state.runtime);
  const projectId = useEditorStore((state) => state.projectId);
  const productId = useEditorStore((state) => state.productId);
  const modelId = useEditorStore((state) => state.modelId);
  const embedded = useEditorStore((state) => state.embedded);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const setLoading = useEditorStore((state) => state.setLoading);
  const setLoadError = useEditorStore((state) => state.setLoadError);
  const setDocument = useEditorStore((state) => state.setDocument);
  const setConfiguration = useEditorStore((state) => state.setConfiguration);
  const setGraphDetail = useEditorStore((state) => state.setGraphDetail);
  const hydrateVisualReplay = useEditorStore(
    (state) => state.hydrateVisualReplay
  );

  useEffect(() => {
    if (!runtime || !projectId || !productId) {
      return;
    }
    if (!graphAuth) {
      setLoading(true);
      setLoadError(
        embedded
          ? null
          : 'Open this editor from backoffice (product → 3D → Open 3D editor).'
      );
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError(null);
      setDocument(null);
      setConfiguration(null, {}, null);
      setGraphDetail(null);
      try {
        const bundle = await bootstrapProductEditor({
          auth: graphAuth,
          productId,
          modelId,
        });
        if (cancelled) return;

        const meshCount = await runtime.mountAssets({
          assets: bundle.assets,
          materials: { materials: {}, rules: {}, colors: {} },
          textures: [],
        });
        if (cancelled) return;

        await hydrateVisualReplay({
          detail: bundle.detail,
          productModelId: bundle.productModelId,
        });
        if (cancelled) return;

        setDocument({
          productId,
          productName: bundle.product.name,
          productCode: bundle.product.key,
          modelId: bundle.productModelId,
          modelName: bundle.modelName,
          modelSku: bundle.product.key,
          objectAssetId: bundle.assetId,
          materialCount: 0,
          ruleCount: bundle.detail.visualEffects.length,
          meshCount,
          objectCount: 1,
        });
        setConfiguration(null, {}, null);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;
        setGraphDetail(null);
        setLoadError(
          error instanceof Error ? error.message : 'Failed to load product'
        );
        setLoading(false);
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
    embedded,
    graphAuth,
    setLoading,
    setLoadError,
    setDocument,
    setConfiguration,
    setGraphDetail,
    hydrateVisualReplay,
  ]);
}
