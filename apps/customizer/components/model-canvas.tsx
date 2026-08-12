'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { applyPartColor } from '@repo/color-config';
import {
  applyVariant as applyColorwayVariant,
  type ColorwayVariant,
} from '@repo/colorways';
import { CustomizerLoader } from '@repo/customizer-ui';
import type { ProductObjectAsset, ProductTexture } from '@/lib/api/model';
import {
  applyCompositionOffset,
  createScene,
  resizeScene,
  type SceneContext,
} from '@/lib/create-scene';
import {
  applyProductCamera,
  placeGroundUnderObject,
  type ProductCameraConfig,
} from '@/lib/product-camera';
import { loadModel, disposeModelLoaders } from '@/lib/load-model';
import {
  applyConfigMaterialsToObject,
  type ParsedModelMaterials,
} from '@/lib/materials';

type CameraConfig = ProductCameraConfig;

export type CameraPresetInput = {
  position: [number, number, number];
  target: [number, number, number];
};

export type ModelSceneApi = {
  applyPartColor: (partId: string, hex: string) => boolean;
  applyVariant: (variant: ColorwayVariant) => boolean;
  getRoot: () => THREE.Object3D | null;
  rotate: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  focusRegion: (preset: CameraPresetInput) => void;
};

function animateCameraTo(
  context: SceneContext,
  preset: CameraPresetInput,
  durationMs = 280
) {
  const startPosition = context.camera.position.clone();
  const startTarget = context.controls.target.clone();
  const endPosition = new THREE.Vector3(...preset.position);
  const endTarget = new THREE.Vector3(...preset.target);
  const startedAt = performance.now();

  const tick = (now: number) => {
    const t = Math.min(1, (now - startedAt) / durationMs);
    const eased = 1 - Math.pow(1 - t, 3);
    context.camera.position.lerpVectors(startPosition, endPosition, eased);
    context.controls.target.lerpVectors(startTarget, endTarget, eased);
    context.controls.update();
    if (t < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

export function ModelCanvas({
  assets,
  camera,
  materials,
  textures,
  onSceneReady,
}: {
  assets: ProductObjectAsset[];
  camera?: CameraConfig;
  materials: ParsedModelMaterials;
  textures: ProductTexture[];
  onSceneReady?: (api: ModelSceneApi | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneContext | null>(null);
  const rootRef = useRef<THREE.Group | null>(null);
  const materialCacheRef = useRef<Map<string, THREE.Material>>(new Map());
  const assetsRef = useRef(assets);
  const cameraRef = useRef(camera);
  const materialsRef = useRef(materials);
  const texturesRef = useRef(textures);
  const onSceneReadyRef = useRef(onSceneReady);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  assetsRef.current = assets;
  cameraRef.current = camera;
  materialsRef.current = materials;
  texturesRef.current = textures;
  onSceneReadyRef.current = onSceneReady;

  const assetKey = assets
    .map((asset) => `${asset.id}:${asset.url}:${asset.visible}`)
    .join('|');
  const cameraKey = camera
    ? `${camera.fov ?? ''}:${camera.x ?? ''}:${camera.y ?? ''}:${camera.z ?? ''}`
    : '';
  const materialKey = `${Object.keys(materials.materials).length}:${Object.keys(materials.rules).length}:${materials.version ?? ''}`;
  const textureKey = textures.map((texture) => texture.id).join(',');

  useEffect(() => {
    const container = containerRef.current;
    const currentAssets = assetsRef.current;
    const currentCamera = cameraRef.current;
    const currentMaterials = materialsRef.current;
    const currentTextures = texturesRef.current;
    if (!container || currentAssets.length === 0) return;

    const context = createScene(container);
    sceneRef.current = context;

    applyProductCamera(context.camera, context.controls, currentCamera);
    applyCompositionOffset(
      context.camera,
      container.clientWidth || 1,
      container.clientHeight || 1
    );

    const onResize = () => resizeScene(context, container);
    const observer = new ResizeObserver(onResize);
    observer.observe(container);
    window.addEventListener('resize', onResize);

    let cancelled = false;
    const root = new THREE.Group();
    root.name = 'model-root';
    context.scene.add(root);
    rootRef.current = root;

    const texturesById = new Map(
      currentTextures.map((texture) => [texture.id, texture])
    );
    const materialCache = new Map<string, THREE.Material>();
    materialCacheRef.current = materialCache;

    setStatus('loading');
    setErrorMessage(null);
    onSceneReadyRef.current?.(null);

    const publishApi = () => {
      onSceneReadyRef.current?.({
        getRoot: () => rootRef.current,
        applyPartColor: (partId, hex) => {
          const currentRoot = rootRef.current;
          if (!currentRoot) return false;
          return applyPartColor(
            currentRoot,
            partId,
            hex,
            materialCacheRef.current
          );
        },
        applyVariant: (variant) => {
          const currentRoot = rootRef.current;
          if (!currentRoot) return false;
          return applyColorwayVariant(
            currentRoot,
            variant,
            materialCacheRef.current
          );
        },
        rotate: () => {
          const current = sceneRef.current;
          if (!current) return;
          const offset = new THREE.Vector3().subVectors(
            current.camera.position,
            current.controls.target
          );
          offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
          current.camera.position.copy(current.controls.target).add(offset);
          current.controls.update();
        },
        zoomIn: () => {
          const current = sceneRef.current;
          if (!current) return;
          const direction = new THREE.Vector3()
            .subVectors(current.controls.target, current.camera.position)
            .multiplyScalar(0.18);
          current.camera.position.add(direction);
          current.controls.update();
        },
        zoomOut: () => {
          const current = sceneRef.current;
          if (!current) return;
          const direction = new THREE.Vector3()
            .subVectors(current.camera.position, current.controls.target)
            .multiplyScalar(0.18);
          current.camera.position.add(direction);
          current.controls.update();
        },
        resetView: () => {
          const current = sceneRef.current;
          const host = containerRef.current;
          if (!current || !host) return;
          applyProductCamera(
            current.camera,
            current.controls,
            cameraRef.current
          );
          applyCompositionOffset(
            current.camera,
            host.clientWidth || 1,
            host.clientHeight || 1
          );
        },
        focusRegion: (preset) => {
          const current = sceneRef.current;
          if (!current) return;
          animateCameraTo(current, preset);
        },
      });
    };

    (async () => {
      const objects: THREE.Object3D[] = [];

      for (const asset of currentAssets) {
        const loaded = await loadModel(asset.url);
        loaded.visible = asset.visible;
        if (asset.code) {
          loaded.userData.code = asset.code;
        }

        const prepared = await applyConfigMaterialsToObject(
          loaded,
          asset.id,
          currentMaterials,
          texturesById,
          materialCache
        );
        prepared.visible = asset.visible;
        objects.push(prepared);
      }

      if (cancelled) return;
      objects.forEach((object) => root.add(object));
      placeGroundUnderObject(root, context.ground);
      applyProductCamera(context.camera, context.controls, currentCamera);
      applyCompositionOffset(
        context.camera,
        container.clientWidth || 1,
        container.clientHeight || 1
      );
      const endPosition = context.camera.position.clone();
      const endTarget = context.controls.target.clone();
      const offset = endPosition
        .clone()
        .sub(endTarget)
        .normalize()
        .multiplyScalar(0.8);
      context.camera.position.copy(endPosition).add(offset);
      animateCameraTo(
        context,
        {
          position: endPosition.toArray() as [number, number, number],
          target: endTarget.toArray() as [number, number, number],
        },
        320
      );
      setStatus('ready');
      onResize();
      publishApi();
    })().catch((error: unknown) => {
      if (cancelled) return;
      const message =
        error instanceof Error ? error.message : 'Failed to load model';
      setErrorMessage(message);
      setStatus('error');
      onSceneReadyRef.current?.(null);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      context.scene.remove(root);
      materialCache.forEach((material) => material.dispose());
      context.dispose();
      disposeModelLoaders();
      sceneRef.current = null;
      rootRef.current = null;
      onSceneReadyRef.current?.(null);
    };
  }, [assetKey, cameraKey, materialKey, textureKey]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {status === 'loading' ? <CustomizerLoader label="Loading model…" /> : null}
      {status === 'error' ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#2f2d2a]/80 px-6 text-center">
          <p className="text-sm text-[#ffb4a8]">
            {errorMessage ?? 'Failed to load model'}
          </p>
        </div>
      ) : null}
    </div>
  );
}
