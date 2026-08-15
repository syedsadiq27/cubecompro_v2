import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const DRACO_DECODER_PATH = '/draco/gltf/';

let sharedDraco: DRACOLoader | null = null;

function getDracoLoader(): DRACOLoader {
  if (sharedDraco) return sharedDraco;
  sharedDraco = new DRACOLoader();
  sharedDraco.setDecoderPath(DRACO_DECODER_PATH);
  sharedDraco.setWorkerLimit(1);
  return sharedDraco;
}

export function createGltfLoader(): GLTFLoader {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(getDracoLoader());
  return loader;
}
