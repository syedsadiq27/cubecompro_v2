'use client';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { create } from 'zustand';
import type {
  ProductCamera,
  ProductObjectAsset,
  ProductTexture,
} from './model-types';
import type {
  ActiveConfigValues,
  ConfigSelection,
  ProductConfiguration,
} from './configuration';
import type {
  GraphDetail,
  GraphSessionAuth,
} from '@repo/product-graph';
import { ENVIRONMENT_MAP_URL } from './constants';
import { disposeModelLoaders, loadModel } from './load-model';
import {
  applyConfigMaterialsToObject,
  type ParsedModelMaterials,
} from './materials';
import {
  captureVisualBaseline,
  normalizeVisualDocumentFromGraphDetail,
  replayVisualDocument,
  type VisualBaseline,
  type VisualDocument,
  type VisualSelection,
} from './visual';
import type { Material } from 'three';

export type EditorIds = {
  projectId?: string;
  productId?: string;
  modelId?: string;
};

export type EditorDocument = {
  productId: string;
  productName: string;
  productCode: string;
  modelId: string;
  modelName: string;
  modelSku: string;
  objectAssetId?: string;
  materialCount: number;
  ruleCount: number;
  meshCount: number;
  objectCount: number;
};

export type ToolMode = 'select' | 'translate' | 'rotate' | 'scale';

export type EditorWorkspace =
  | 'scene'
  | 'objects'
  | 'materials'
  | 'mappings'
  | 'cameras'
  | 'lights'
  | 'environment'
  | 'behaviors'
  | 'preview';

export type DrawerId =
  | 'materials'
  | 'textures'
  | 'colors'
  | 'variants'
  | 'lights'
  | 'camera'
  | 'objects'
  | null;

export type ModalId = 'save' | 'info' | null;

type MountAssetsOptions = {
  assets: ProductObjectAsset[];
  cameraConfig?: ProductCamera;
  materials: ParsedModelMaterials;
  textures: ProductTexture[];
};

export type EditorRuntime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  gl: THREE.WebGLRenderer;
  orbitControls: OrbitControls;
  transformControls: TransformControls;
  productRoot: THREE.Group;
  pointerDown: (event: PointerEvent) => void;
  pointerUp: (event: PointerEvent) => void;
  setToolMode: (mode: ToolMode) => void;
  attachSelection: (object: THREE.Object3D | null) => void;
  frameSelection: () => void;
  render: () => void;
  resize: (width: number, height: number) => void;
  clearProduct: () => void;
  mountAssets: (options: MountAssetsOptions) => Promise<number>;
  dispose: () => void;
};

type EditorState = EditorIds & {
  selected: THREE.Object3D | null;
  toolMode: ToolMode;
  dirty: boolean;
  embedded: boolean;
  returnTo?: string;
  loading: boolean;
  loadError: string | null;
  statusMessage: string | null;
  outlineNodes: THREE.Object3D[];
  outlineRevision: number;
  selectionRevision: number;
  document: EditorDocument | null;
  configuration: ProductConfiguration | null;
  activeConfigValues: ActiveConfigValues;
  configSelection: ConfigSelection | null;
  graphAuth: GraphSessionAuth | null;
  userName: string | null;
  graphDetail: GraphDetail | null;
  visualDocument: VisualDocument | null;
  visualBaseline: VisualBaseline | null;
  visualSelection: VisualSelection;
  visualMaterialCache: Map<string, Material>;
  previewSelections: Record<string, string>;
  activeWorkspace: EditorWorkspace;
  drawer: DrawerId;
  modal: ModalId;
  inspectorStepId: string | null;
  runtime: EditorRuntime | null;
  setIds: (ids: EditorIds) => void;
  setActiveWorkspace: (workspace: EditorWorkspace) => void;
  setEmbed: (embed: { embedded: boolean; returnTo?: string }) => void;
  setSelected: (selected: THREE.Object3D | null) => void;
  setToolMode: (mode: ToolMode) => void;
  setInspectorStepId: (inspectorStepId: string | null) => void;
  setConfiguration: (
    configuration: ProductConfiguration | null,
    activeValues?: ActiveConfigValues,
    selection?: ConfigSelection | null
  ) => void;
  selectConfigValue: (
    propertyId: string,
    valueId: string,
    options?: { focus?: boolean }
  ) => void;
  toggleVisibility: (object: THREE.Object3D) => void;
  setObjectVisible: (object: THREE.Object3D, visible: boolean) => void;
  updateSelectedTransform: (next: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  }) => void;
  setSelectedColor: (hex: string) => void;
  bumpSelection: () => void;
  markDirty: () => void;
  setLoading: (loading: boolean) => void;
  setLoadError: (loadError: string | null) => void;
  setStatusMessage: (statusMessage: string | null) => void;
  setOutlineNodes: (outlineNodes: THREE.Object3D[]) => void;
  setDocument: (document: EditorDocument | null) => void;
  setGraphAuth: (graphAuth: GraphSessionAuth | null) => void;
  setUserName: (userName: string | null) => void;
  setGraphDetail: (graphDetail: GraphDetail | null) => void;
  setVisualDocument: (visualDocument: VisualDocument | null) => void;
  hydrateVisualReplay: (options: {
    detail: GraphDetail;
    productModelId?: string | null;
  }) => Promise<void>;
  setVisualSelection: (choiceKey: string, valueKey: string) => void;
  clearVisualSelection: () => void;
  resetVisualSelection: () => void;
  replayActiveVisual: () => Promise<void>;
  setPreviewSelection: (attributeId: string, valueId: string) => void;
  resetPreviewSelections: () => void;
  openDrawer: (drawer: DrawerId) => void;
  closeDrawer: () => void;
  openModal: (modal: ModalId) => void;
  closeModal: () => void;
  attachRuntime: (runtime: EditorRuntime) => void;
  clearRuntime: () => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: undefined,
  productId: undefined,
  modelId: undefined,
  selected: null,
  toolMode: 'select',
  dirty: false,
  embedded: false,
  returnTo: undefined,
  loading: false,
  loadError: null,
  statusMessage: null,
  outlineNodes: [],
  outlineRevision: 0,
  selectionRevision: 0,
  document: null,
  configuration: null,
  activeConfigValues: {},
  configSelection: null,
  graphAuth: null,
  userName: null,
  graphDetail: null,
  visualDocument: null,
  visualBaseline: null,
  visualSelection: {},
  visualMaterialCache: new Map(),
  previewSelections: {},
  activeWorkspace: 'scene',
  drawer: null,
  modal: null,
  inspectorStepId: null,
  runtime: null,
  setIds: (ids) => set(ids),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  setEmbed: ({ embedded, returnTo }) => set({ embedded, returnTo }),
  setSelected: (selected) => {
    const runtime = get().runtime;
    runtime?.attachSelection(selected);
    set((state) => ({
      selected,
      selectionRevision: state.selectionRevision + 1,
      inspectorStepId: null,
    }));
  },
  setToolMode: (mode) => {
    set({ toolMode: mode });
    get().runtime?.setToolMode(mode);
  },
  setInspectorStepId: (inspectorStepId) => set({ inspectorStepId }),
  setConfiguration: (configuration, activeValues = {}, selection = null) =>
    set({
      configuration,
      activeConfigValues: activeValues,
      configSelection: selection,
    }),
  selectConfigValue: (propertyId, valueId, options) => {
    const focus = options?.focus !== false;
    const { configuration, outlineNodes, runtime } = get();
    if (!configuration) return;
    const property = configuration.properties.find(
      (entry) => entry.id === propertyId
    );
    if (!property) return;
    const nextValue = property.values.find((entry) => entry.id === valueId);
    if (!nextValue) return;

    const byAssetId = new Map(
      outlineNodes.map((node) => [node.name, node] as const)
    );

    for (const value of property.values) {
      const visible = value.id === valueId;
      for (const object of value.objects) {
        const node = byAssetId.get(object.assetId);
        if (node) node.visible = visible;
      }
    }

    const focusAsset = nextValue.objects[0];
    const focusNode = focusAsset
      ? byAssetId.get(focusAsset.assetId) ?? null
      : null;

    if (!focus) {
      set((state) => ({
        activeConfigValues: {
          ...state.activeConfigValues,
          [propertyId]: valueId,
        },
        outlineRevision: state.outlineRevision + 1,
      }));
      return;
    }

    set((state) => ({
      activeConfigValues: {
        ...state.activeConfigValues,
        [propertyId]: valueId,
      },
      configSelection: { propertyId, valueId },
      selected: focusNode,
      selectionRevision: state.selectionRevision + 1,
      outlineRevision: state.outlineRevision + 1,
      inspectorStepId: null,
      dirty: true,
    }));

    runtime?.attachSelection(focusNode);
    if (focusNode) {
      runtime?.frameSelection();
    }
  },
  toggleVisibility: (object) => {
    object.visible = !object.visible;
    set((state) => ({
      outlineRevision: state.outlineRevision + 1,
      dirty: true,
    }));
  },
  setObjectVisible: (object, visible) => {
    object.visible = visible;
    set((state) => ({
      outlineRevision: state.outlineRevision + 1,
      dirty: true,
    }));
  },
  updateSelectedTransform: (next) => {
    const selected = get().selected;
    if (!selected) return;
    if (next.position) selected.position.fromArray(next.position);
    if (next.rotation) selected.rotation.set(...next.rotation);
    if (next.scale) selected.scale.fromArray(next.scale);
    selected.updateMatrixWorld(true);
    set((state) => ({
      selectionRevision: state.selectionRevision + 1,
      dirty: true,
    }));
  },
  setSelectedColor: (hex) => {
    const selected = get().selected;
    if (!selected) return;
    const color = new THREE.Color(hex);
    selected.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      materials.forEach((material) => {
        if (
          material &&
          'color' in material &&
          material.color instanceof THREE.Color
        ) {
          material.color.copy(color);
          material.needsUpdate = true;
        }
      });
    });
    set((state) => ({
      selectionRevision: state.selectionRevision + 1,
      dirty: true,
    }));
  },
  bumpSelection: () =>
    set((state) => ({
      selectionRevision: state.selectionRevision + 1,
      dirty: true,
    })),
  markDirty: () => set({ dirty: true }),
  setLoading: (loading) => set({ loading }),
  setLoadError: (loadError) => set({ loadError }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setOutlineNodes: (outlineNodes) =>
    set((state) => ({
      outlineNodes,
      outlineRevision: state.outlineRevision + 1,
    })),
  setDocument: (document) => set({ document, dirty: false }),
  setGraphAuth: (graphAuth) => set({ graphAuth }),
  setUserName: (userName) => set({ userName }),
  setGraphDetail: (graphDetail) =>
    set({
      graphDetail,
      visualSelection: {},
      visualDocument: null,
      visualBaseline: null,
      visualMaterialCache: new Map(),
    }),
  setVisualDocument: (visualDocument) => set({ visualDocument }),
  hydrateVisualReplay: async ({ detail, productModelId }) => {
    const runtime = get().runtime;
    if (!runtime) {
      throw new Error('Editor runtime is not attached');
    }
    const document = normalizeVisualDocumentFromGraphDetail(
      detail,
      productModelId
    );
    const materialCache = new Map<string, Material>();
    set({
      graphDetail: detail,
      visualDocument: document,
      visualBaseline: null,
      visualSelection: {},
      visualMaterialCache: materialCache,
      activeWorkspace: 'preview',
    });

    const baseline = captureVisualBaseline(runtime.productRoot, document);
    set({ visualBaseline: baseline });
    await replayVisualDocument({
      root: runtime.productRoot,
      document,
      baseline,
      selection: {},
      auth: get().graphAuth,
      materialCache,
      productRevisionId: detail.id,
    });
    set({ loadError: null });
    runtime.render();
  },
  setVisualSelection: (choiceKey, valueKey) => {
    set((state) => ({
      visualSelection: {
        ...state.visualSelection,
        [choiceKey]: valueKey,
      },
    }));
    void get().replayActiveVisual();
  },
  clearVisualSelection: () => {
    set({ visualSelection: {} });
    void get().replayActiveVisual();
  },
  resetVisualSelection: () => {
    get().clearVisualSelection();
  },
  replayActiveVisual: async () => {
    const {
      runtime,
      visualDocument,
      visualBaseline,
      visualSelection,
      visualMaterialCache,
      graphAuth,
      graphDetail,
    } = get();
    if (!runtime || !visualDocument || !visualBaseline || !graphDetail) {
      return;
    }
    await replayVisualDocument({
      root: runtime.productRoot,
      document: visualDocument,
      baseline: visualBaseline,
      selection: visualSelection,
      auth: graphAuth,
      materialCache: visualMaterialCache,
      productRevisionId: graphDetail.id,
    });
    runtime.render();
  },
  setPreviewSelection: (attributeId, valueId) =>
    set((state) => ({
      previewSelections: {
        ...state.previewSelections,
        [attributeId]: valueId,
      },
    })),
  resetPreviewSelections: () =>
    set({
      previewSelections: {},
    }),
  openDrawer: (drawer) => set({ drawer }),
  closeDrawer: () => set({ drawer: null }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  attachRuntime: (runtime) => set({ runtime }),
  clearRuntime: () =>
    set({
      runtime: null,
      selected: null,
      outlineNodes: [],
      document: null,
      configuration: null,
      activeConfigValues: {},
      configSelection: null,
      statusMessage: null,
      dirty: false,
      drawer: null,
      modal: null,
      embedded: false,
      returnTo: undefined,
      inspectorStepId: null,
      previewSelections: {},
      visualDocument: null,
      visualBaseline: null,
      visualSelection: {},
      visualMaterialCache: new Map(),
    }),
}));

function disposeObject(object: THREE.Object3D) {
  object.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else {
      material?.dispose();
    }
  });
}

function applyCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
  cameraConfig?: ProductCamera
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  if (cameraConfig?.fov) camera.fov = cameraConfig.fov;
  if (cameraConfig?.near) camera.near = cameraConfig.near;
  if (cameraConfig?.far) camera.far = cameraConfig.far;

  const hasPosition =
    typeof cameraConfig?.x === 'number' &&
    typeof cameraConfig?.y === 'number' &&
    typeof cameraConfig?.z === 'number';

  if (hasPosition) {
    camera.position.set(cameraConfig.x!, cameraConfig.y!, cameraConfig.z!);
    controls.target.copy(center);
  } else {
    const maxDim = Math.max(size.x, size.y, size.z, 0.2);
    const distance = maxDim * 2.4;
    camera.position.set(
      center.x + distance * 0.55,
      center.y + distance * 0.35,
      center.z + distance * 0.85
    );
    controls.target.copy(center);
  }

  camera.updateProjectionMatrix();
  controls.update();
}

function frameObject(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D
) {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.2);
  const distance = maxDim * 2.2;
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (direction.lengthSq() < 0.0001) {
    direction.set(0.55, 0.35, 0.85).normalize();
  }
  camera.position.copy(center).add(direction.multiplyScalar(distance));
  controls.target.copy(center);
  camera.updateProjectionMatrix();
  controls.update();
}

function resolveSelectable(
  hit: THREE.Object3D,
  productRoot: THREE.Object3D
): THREE.Object3D | null {
  let current: THREE.Object3D | null = hit;
  while (current && current !== productRoot) {
    if (current.name?.trim()) return current;
    current = current.parent;
  }
  let walk: THREE.Object3D | null = hit;
  while (walk && walk.parent && walk.parent !== productRoot) {
    walk = walk.parent;
  }
  if (walk && walk.parent === productRoot) return walk;
  return hit !== productRoot ? hit : null;
}

function countMeshes(root: THREE.Object3D): number {
  let count = 0;
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.isMesh) count += 1;
  });
  return count;
}

export function createEditorRuntime(container: HTMLElement): EditorRuntime {
  const width = container.clientWidth || 1;
  const height = container.clientHeight || 1;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 100);
  camera.position.set(0.55, 0.42, 0.85);

  const gl = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  gl.setSize(width, height);
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1;
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  gl.domElement.style.display = 'block';
  gl.domElement.style.width = '100%';
  gl.domElement.style.height = '100%';
  container.appendChild(gl.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb8b0a4, 0.35);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(2.5, 4, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 12;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.2);
  fill.position.set(-2, 1, -1);
  scene.add(fill);

  const productRoot = new THREE.Group();
  productRoot.name = 'ProductRoot';
  scene.add(productRoot);

  const orbitControls = new OrbitControls(camera, gl.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.08;
  orbitControls.minDistance = 0.1;
  orbitControls.maxDistance = 40;
  orbitControls.target.set(0, 0.28, 0);
  orbitControls.update();

  const transformControls = new TransformControls(camera, gl.domElement);
  const transformHelper = transformControls.getHelper();
  transformHelper.traverse((obj) => {
    obj.userData.isTransformControls = true;
  });
  scene.add(transformHelper);
  transformControls.enabled = false;
  transformHelper.visible = false;

  transformControls.addEventListener('dragging-changed', (event) => {
    orbitControls.enabled = !event.value;
  });
  transformControls.addEventListener('objectChange', () => {
    useEditorStore.getState().bumpSelection();
  });

  const materialCache = new Map<string, THREE.Material>();
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  let environmentMap: THREE.Texture | null = null;
  let pmremDisposed = false;
  const pointer = { x: 0, y: 0, moved: false };
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  const disposePmrem = () => {
    if (pmremDisposed) return;
    pmremDisposed = true;
    pmremGenerator.dispose();
  };

  new RGBELoader().load(
    ENVIRONMENT_MAP_URL,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = environmentMap;
      texture.dispose();
      disposePmrem();
    },
    undefined,
    () => {
      disposePmrem();
    }
  );

  const syncTransformUi = (object?: THREE.Object3D | null) => {
    const mode = useEditorStore.getState().toolMode;
    const selected =
      object === undefined ? useEditorStore.getState().selected : object;
    const transforming = mode !== 'select' && Boolean(selected);
    transformControls.enabled = transforming;
    transformHelper.visible = transforming;
    if (transforming && selected) {
      transformControls.attach(selected);
      transformControls.setMode(mode);
    } else {
      transformControls.detach();
    }
  };

  const attachSelection = (object: THREE.Object3D | null) => {
    syncTransformUi(object);
  };

  const setToolMode = (mode: ToolMode) => {
    const selected = useEditorStore.getState().selected;
    const transforming = mode !== 'select' && Boolean(selected);
    transformControls.enabled = transforming;
    transformHelper.visible = transforming;
    if (transforming && selected) {
      transformControls.attach(selected);
      transformControls.setMode(mode);
    } else {
      transformControls.detach();
    }
  };

  const frameSelection = () => {
    const selected = useEditorStore.getState().selected;
    frameObject(camera, orbitControls, selected ?? productRoot);
  };

  const pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.moved = false;
  };

  const pointerUp = (event: PointerEvent) => {
    if (event.button !== 0) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (Math.hypot(dx, dy) > 4) {
      pointer.moved = true;
    }
    if (pointer.moved || transformControls.dragging) return;

    const rect = gl.domElement.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);

    const hits = raycaster
      .intersectObjects(productRoot.children, true)
      .filter((hit) => {
        let current: THREE.Object3D | null = hit.object;
        while (current) {
          if (current.userData.isTransformControls) return false;
          current = current.parent;
        }
        return hit.object.visible;
      });

    if (!hits.length) {
      useEditorStore.getState().setSelected(null);
      return;
    }

    const selectable = resolveSelectable(hits[0]!.object, productRoot);
    useEditorStore.getState().setSelected(selectable);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    if (event.key === 'Escape') {
      useEditorStore.getState().setSelected(null);
      return;
    }

    if (event.key.toLowerCase() === 'f') {
      frameSelection();
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'v') useEditorStore.getState().setToolMode('select');
    if (key === 'w') useEditorStore.getState().setToolMode('translate');
    if (key === 'e') useEditorStore.getState().setToolMode('rotate');
    if (key === 'r') useEditorStore.getState().setToolMode('scale');
  };

  window.addEventListener('keydown', onKeyDown);

  const render = () => {
    orbitControls.update();
    gl.render(scene, camera);
  };

  const resize = (nextWidth: number, nextHeight: number) => {
    if (nextWidth <= 0 || nextHeight <= 0) return;
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    gl.setSize(nextWidth, nextHeight);
    render();
  };

  const clearProduct = () => {
    useEditorStore.getState().setSelected(null);
    while (productRoot.children.length > 0) {
      const child = productRoot.children[0]!;
      productRoot.remove(child);
      disposeObject(child);
    }
    materialCache.forEach((material) => material.dispose());
    materialCache.clear();
  };

  const mountAssets = async ({
    assets,
    cameraConfig,
    materials,
    textures,
  }: MountAssetsOptions) => {
    clearProduct();

    const texturesById = new Map(
      textures.map((texture) => [texture.id, texture] as const)
    );

    for (const asset of assets) {
      const auth = useEditorStore.getState().graphAuth;
      const headers = auth
        ? { Authorization: `Bearer ${auth.token}` }
        : undefined;
      const loaded = await loadModel(asset.url, headers);
      loaded.visible = asset.visible;
      if (asset.code) {
        loaded.userData.code = asset.code;
      }
      loaded.userData.assetId = asset.id;

      const prepared = await applyConfigMaterialsToObject(
        loaded,
        asset.id,
        materials,
        texturesById,
        materialCache
      );
      prepared.visible = asset.visible;
      prepared.userData.name = asset.name;
      if (asset.code) {
        prepared.userData.code = asset.code;
      }

      prepared.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      productRoot.add(prepared);
    }

    applyCamera(camera, orbitControls, productRoot, cameraConfig);
    useEditorStore.getState().setOutlineNodes([...productRoot.children]);
    useEditorStore.getState().setSelected(null);
    return countMeshes(productRoot);
  };

  const dispose = () => {
    window.removeEventListener('keydown', onKeyDown);
    clearProduct();
    disposeModelLoaders();
    transformControls.dispose();
    orbitControls.dispose();
    scene.environment = null;
    environmentMap?.dispose();
    environmentMap = null;
    disposePmrem();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      }
    });
    gl.dispose();
    if (gl.domElement.parentElement === container) {
      container.removeChild(gl.domElement);
    }
  };

  return {
    scene,
    camera,
    gl,
    orbitControls,
    transformControls,
    productRoot,
    pointerDown,
    pointerUp,
    setToolMode,
    attachSelection,
    frameSelection,
    render,
    resize,
    clearProduct,
    mountAssets,
    dispose,
  };
}
