import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACO_DECODER_PATH } from './constants';

let sharedDraco: DRACOLoader | null = null;
let loadQueue: Promise<unknown> = Promise.resolve();

function getDracoLoader(): DRACOLoader {
  if (sharedDraco) return sharedDraco;
  sharedDraco = new DRACOLoader();
  sharedDraco.setDecoderPath(DRACO_DECODER_PATH);
  sharedDraco.setWorkerLimit(1);
  return sharedDraco;
}

function createGltfLoader(): GLTFLoader {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(getDracoLoader());
  return loader;
}

export function loadModel(
  url: string,
  headers?: Record<string, string>
): Promise<THREE.Group> {
  const task = loadQueue.then(async () => {
    let loadUrl = url;
    let revokeUrl: string | null = null;
    if (headers && Object.keys(headers).length > 0) {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to load model (${response.status})`);
      }
      const blob = await response.blob();
      loadUrl = URL.createObjectURL(blob);
      revokeUrl = loadUrl;
    }

    try {
      return await new Promise<THREE.Group>((resolve, reject) => {
        const loader = createGltfLoader();
        loader.load(
          loadUrl,
          (gltf) => {
            const root = gltf.scene;
            root.name = 'loaded-model';
            resolve(root);
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      });
    } finally {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    }
  });

  loadQueue = task.catch(() => undefined);
  return task;
}

export function disposeModelLoaders(): void {
  sharedDraco?.dispose();
  sharedDraco = null;
  loadQueue = Promise.resolve();
}
