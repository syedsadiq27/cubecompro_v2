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

export function loadModel(url: string): Promise<THREE.Group> {
  const task = loadQueue.then(
    () =>
      new Promise<THREE.Group>((resolve, reject) => {
        const loader = createGltfLoader();
        loader.load(
          url,
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
      })
  );

  loadQueue = task.catch(() => undefined);
  return task;
}

export function disposeModelLoaders(): void {
  sharedDraco?.dispose();
  sharedDraco = null;
  loadQueue = Promise.resolve();
}
