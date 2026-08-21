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
import type { GraphDetail, GraphSessionAuth } from '@repo/product-graph';
import {
  CREATE_DRAFT_PRODUCT_REVISION_MUTATION,
  CREATE_MODEL_TARGET_MUTATION,
  DELETE_MODEL_TARGET_MUTATION,
  PRODUCT_REVISION_DETAIL_QUERY,
  SET_CHOICE_DEFAULT_MUTATION,
  graphRequest,
} from '@repo/product-graph';
import {
  composeCubeSlices,
  type CubeStore,
  type WorkspaceIds,
} from '@repo/store';
import { ENVIRONMENT_MAP_URL } from './constants';
import { disposeModelLoaders, loadModel } from './load-model';
import {
  applyConfigMaterialsToObject,
  type ParsedModelMaterials,
} from './materials';
import {
  resolveSelectionIdentity,
  type SelectionIdentity,
} from './selection-identity';
import { semanticKeyFromName } from './scene-tree';
import {
  INITIAL_CAMERA_ANIMATIONS,
  type CameraAnimation,
  type CameraDefinition,
  type CameraPreset,
  type CameraProjection,
  type OrbitDefinition,
} from './camera/types';
import {
  emptyEffectComposer,
  isRevisionEditable,
  validateEffectTarget,
  type AuthoringFocus,
  type EffectComposer,
  type EffectRef,
  type PickMode,
  composerToBinding,
} from './authoring-focus';
import {
  bindingSemanticKey,
  captureStructuralBaselines,
  captureVisualBaseline,
  createVisualReplayContext,
  normalizeVisualDocumentFromGraphDetail,
  persistVisualDocument,
  replayVisualDocument,
  type VisualBaseline,
  type VisualBinding,
  type VisualDocument,
  type VisualReplayContext,
  type VisualTarget,
} from './visual';
import type { Material } from 'three';

export type EditorIds = WorkspaceIds;

export type SceneStats = {
  materialCount: number;
  ruleCount: number;
  meshCount: number;
  objectCount: number;
};

export type EditorDocument = {
  productId: string;
  productName: string;
  productCode: string;
  modelId: string;
  modelName: string;
  modelSku: string;
  objectAssetId?: string;
} & SceneStats;

export type ToolMode = 'select' | 'translate' | 'rotate' | 'scale';

export type EditorWorkspace =
  | 'product'
  | 'model'
  | 'scene'
  | 'objects'
  | 'materials'
  | 'mappings'
  | 'cameras'
  | 'camera'
  | 'assets'
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

export type EditorCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera;

export type EditorRuntime = {
  scene: THREE.Scene;
  camera: EditorCamera;
  gl: THREE.WebGLRenderer;
  orbitControls: OrbitControls;
  transformControls: TransformControls;
  productRoot: THREE.Group;
  pointerDown: (event: PointerEvent) => void;
  pointerUp: (event: PointerEvent) => void;
  setToolMode: (mode: ToolMode) => void;
  attachSelection: (object: THREE.Object3D | null) => void;
  frameSelection: () => void;
  zoomCamera: (factor: number) => void;
  setProjection: (projection: CameraProjection) => void;
  render: () => void;
  resize: (width: number, height: number) => void;
  clearProduct: () => void;
  mountAssets: (options: MountAssetsOptions) => Promise<number>;
  dispose: () => void;
};

type EditorState = CubeStore & {
  selected: THREE.Object3D | null;
  selectionIdentity: SelectionIdentity | null;
  toolMode: ToolMode;
  embedded: boolean;
  returnTo?: string;
  outlineNodes: THREE.Object3D[];
  outlineRevision: number;
  selectionRevision: number;
  document: EditorDocument | null;
  configuration: ProductConfiguration | null;
  activeConfigValues: ActiveConfigValues;
  configSelection: ConfigSelection | null;
  visualDocument: VisualDocument | null;
  visualBaseline: VisualBaseline | null;
  visualReplayContext: VisualReplayContext | null;
  visualMaterialCache: Map<string, Material>;
  previewSelections: Record<string, string>;
  authoringFocus: AuthoringFocus | null;
  selectedEffect: EffectRef | null;
  effectComposer: EffectComposer | null;
  pickMode: PickMode;
  activeWorkspace: EditorWorkspace;
  drawer: DrawerId;
  modal: ModalId;
  inspectorStepId: string | null;
  runtime: EditorRuntime | null;
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
  renameObject: (object: THREE.Object3D, name: string) => void;
  updateSelectedTransform: (next: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  }) => void;
  setSelectedColor: (hex: string) => void;
  bumpSelection: () => void;
  setOutlineNodes: (outlineNodes: THREE.Object3D[]) => void;
  setDocument: (document: EditorDocument | null) => void;
  setVisualDocument: (visualDocument: VisualDocument | null) => void;
  hydrateVisualReplay: (options: {
    detail: GraphDetail;
    productModelId?: string | null;
    preserveAuthoring?: boolean;
  }) => Promise<void>;
  updateVisualBinding: (
    key: {
      choiceKey: string;
      valueKey: string;
      targetKey: string;
      operation: VisualBinding['operation'];
    },
    patch: {
      materialAssetRevisionId?: string;
      visible?: boolean;
      linkedAssetKey?: string;
    }
  ) => void;
  addDraftVisualBinding: (binding: VisualBinding) => void;
  removeDraftVisualBinding: (key: {
    choiceKey: string;
    valueKey: string;
    targetKey: string;
    operation: VisualBinding['operation'];
  }) => void;
  selectedTargetKey: string | null;
  setSelectedTargetKey: (key: string | null) => void;
  updateTarget: (key: string, patch: Partial<VisualTarget>) => void;
  removeTarget: (key: string) => Promise<void>;
  createModelTargetFromSelection: (input?: {
    key?: string;
    targetType?: string;
    materialSlot?: string;
  }) => Promise<void>;
  reloadVisualDocument: () => Promise<void>;
  saveVisualDocument: () => Promise<void>;
  setVisualSelection: (choiceKey: string, valueKey: string) => void;
  clearVisualSelection: () => void;
  resetVisualSelection: () => void;
  ensureLivePreview: () => Promise<void>;
  previewChoiceValue: (choiceKey: string, valueKey: string) => void;
  setChoiceDefault: (
    choiceId: string,
    defaultValueId: string | null
  ) => Promise<void>;
  replayActiveVisual: () => Promise<void>;
  setAuthoringFocus: (focus: AuthoringFocus | null) => void;
  setSelectedEffect: (effect: EffectRef | null) => void;
  beginEffectComposer: () => void;
  updateEffectComposer: (patch: Partial<EffectComposer>) => void;
  cancelEffectComposer: () => void;
  startTargetPick: (operation: VisualBinding['operation']) => void;
  cancelTargetPick: () => void;
  applyPickedTargetFromSelection: () => Promise<void>;
  commitEffectComposer: () => void;
  createDraftRevisionForEdit: () => Promise<void>;
  setPreviewSelection: (attributeId: string, valueId: string) => void;
  cameraAnimations: CameraAnimation[];
  activeAnimationId: string | null;
  isPlayingAnimation: boolean;
  animationProgress: number;
  setActiveCameraPreset: (id: string) => void;
  saveCurrentViewAsPreset: (name?: string) => void;
  saveActivePreset: () => void;
  updateCameraConfig: (patch: Partial<CameraDefinition>) => void;
  updateOrbitConfig: (patch: Partial<OrbitDefinition>) => void;
  playCameraAnimation: (animationId: string) => void;
  stopCameraAnimation: () => void;
  setAnimationProgress: (progress: number) => void;
  openDrawer: (drawer: DrawerId) => void;
  closeDrawer: () => void;
  openModal: (modal: ModalId) => void;
  closeModal: () => void;
  attachRuntime: (runtime: EditorRuntime) => void;
  clearRuntime: () => void;
};

export const useEditorStore = create<EditorState>()((set, get) => ({
  ...composeCubeSlices(set, get),
  selected: null,
  selectionIdentity: null,
  toolMode: 'select',
  embedded: false,
  returnTo: undefined,
  outlineNodes: [],
  outlineRevision: 0,
  selectionRevision: 0,
  document: null,
  configuration: null,
  activeConfigValues: {},
  configSelection: null,
  visualDocument: null,
  visualBaseline: null,
  visualReplayContext: null,
  visualMaterialCache: new Map(),
  previewSelections: {},
  authoringFocus: null,
  selectedEffect: null,
  effectComposer: null,
  pickMode: null,
  activeWorkspace: 'scene',
  drawer: null,
  modal: null,
  inspectorStepId: null,
  runtime: null,
  selectedTargetKey: null,
  setSelectedTargetKey: (key: string | null) => set({ selectedTargetKey: key }),
  updateTarget: (key: string, patch: Partial<VisualTarget>) => {
    const visualDocument = get().visualDocument;
    if (!visualDocument) return;
    const nextTargets = visualDocument.targets.map((t) =>
      t.key === key ? { ...t, ...patch } : t
    );
    set({
      visualDocument: { ...visualDocument, targets: nextTargets },
      dirty: true,
    });
  },
  removeTarget: async (key) => {
    const { visualDocument, graphAuth, graphDetail } = get();
    if (!visualDocument) return;
    const target = visualDocument.targets.find((entry) => entry.key === key);
    if (!target) return;

    if (!target.id) {
      const nextTargets = visualDocument.targets.filter((t) => t.key !== key);
      const nextBindings = visualDocument.bindings.filter(
        (b) => b.targetKey !== key
      );
      set({
        visualDocument: {
          ...visualDocument,
          targets: nextTargets,
          bindings: nextBindings,
        },
        selectedTargetKey:
          get().selectedTargetKey === key ? null : get().selectedTargetKey,
        dirty: true,
        statusMessage: `Removed local target “${key}”.`,
      });
      return;
    }

    if (!graphAuth || !graphDetail) {
      throw new Error('Sign in before deleting a ModelTarget');
    }
    if (!isRevisionEditable(graphDetail.status)) {
      throw new Error('Revision is read-only. Create a new draft to edit.');
    }

    set({ loading: true, statusMessage: `Deleting target “${key}”…` });
    try {
      await graphRequest(
        DELETE_MODEL_TARGET_MUTATION,
        { id: target.id },
        graphAuth.token,
        graphAuth.apiUrl
      );
      const data = await graphRequest<{
        productRevisionDetail: GraphDetail;
      }>(
        PRODUCT_REVISION_DETAIL_QUERY,
        { id: graphDetail.id },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await get().hydrateVisualReplay({
        detail: data.productRevisionDetail,
        productModelId: visualDocument.productModelId,
        preserveAuthoring: true,
      });
      set({
        loading: false,
        dirty: false,
        selectedTargetKey:
          get().selectedTargetKey === key ? null : get().selectedTargetKey,
        statusMessage: `Deleted ModelTarget “${key}”.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete ModelTarget';
      set({ loading: false, loadError: message, statusMessage: message });
      throw error;
    }
  },
  cameraAnimations: INITIAL_CAMERA_ANIMATIONS,
  activeAnimationId: null,
  isPlayingAnimation: false,
  animationProgress: 0,

  setActiveCameraPreset: (id: string) => {
    const preset = get().cameraPresets.find((p) => p.id === id);
    if (!preset) return;
    const runtime = get().runtime;
    if (runtime) {
      applyStoreCameraToRuntime(runtime, preset.camera, preset.controls);
    }
    set({
      activeCameraPresetId: id,
      cameraConfig: { ...preset.camera },
      orbitConfig: { ...preset.controls },
      statusMessage: `Camera preset: ${preset.name}`,
    });
  },

  saveCurrentViewAsPreset: (name?: string) => {
    const runtime = get().runtime;
    if (!runtime) return;
    const camera = readCameraDefinitionFromRuntime(
      runtime.camera,
      runtime.orbitControls,
      get().cameraConfig.projection
    );
    const presetName = name || `View ${get().cameraPresets.length + 1}`;
    const newPreset: CameraPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      sceneCount: 1,
      camera,
      controls: { ...get().orbitConfig },
    };
    set((state) => ({
      cameraPresets: [...state.cameraPresets, newPreset],
      activeCameraPresetId: newPreset.id,
      cameraConfig: { ...camera },
      statusMessage: `Saved current view as “${presetName}”`,
    }));
  },

  saveActivePreset: () => {
    const activeId = get().activeCameraPresetId;
    const currentCam = get().cameraConfig;
    const currentOrbit = get().orbitConfig;
    const presetName =
      get().cameraPresets.find((p) => p.id === activeId)?.name || 'Default View';
    set((state) => ({
      cameraPresets: state.cameraPresets.map((p) =>
        p.id === activeId
          ? {
              ...p,
              camera: { ...currentCam },
              controls: { ...currentOrbit },
            }
          : p
      ),
      statusMessage: `Preset updated: ${presetName}`,
    }));
  },

  updateCameraConfig: (patch: Partial<CameraDefinition>) => {
    const nextConfig = { ...get().cameraConfig, ...patch };
    const runtime = get().runtime;
    if (runtime) {
      applyStoreCameraToRuntime(runtime, nextConfig, get().orbitConfig);
    }
    set({ cameraConfig: nextConfig });
  },

  updateOrbitConfig: (patch: Partial<OrbitDefinition>) => {
    const nextConfig = { ...get().orbitConfig, ...patch };
    const runtime = get().runtime;
    if (runtime) {
      applyStoreCameraToRuntime(runtime, get().cameraConfig, nextConfig);
    }
    set({ orbitConfig: nextConfig });
  },

  playCameraAnimation: (animationId: string) => {
    const anim = get().cameraAnimations.find((a) => a.id === animationId);
    if (!anim) return;
    const runtime = get().runtime;
    if (!runtime) return;

    set({ isPlayingAnimation: true, activeAnimationId: animationId, animationProgress: 0 });
    const startTime = performance.now();
    const duration = anim.durationMs;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const progress =
        anim.easing === 'linear'
          ? t
          : anim.easing === 'ease-in'
          ? t * t
          : anim.easing === 'ease-out'
          ? t * (2 - t)
          : t < 0.5
          ? 2 * t * t
          : -1 + (4 - 2 * t) * t;

      withSuppressedCameraSync(() => {
        const posX = anim.from.position[0] + (anim.to.position[0] - anim.from.position[0]) * progress;
        const posY = anim.from.position[1] + (anim.to.position[1] - anim.from.position[1]) * progress;
        const posZ = anim.from.position[2] + (anim.to.position[2] - anim.from.position[2]) * progress;
        runtime.camera.position.set(posX, posY, posZ);

        const tarX = anim.from.target[0] + (anim.to.target[0] - anim.from.target[0]) * progress;
        const tarY = anim.from.target[1] + (anim.to.target[1] - anim.from.target[1]) * progress;
        const tarZ = anim.from.target[2] + (anim.to.target[2] - anim.from.target[2]) * progress;
        runtime.orbitControls.target.set(tarX, tarY, tarZ);

        if (
          anim.from.fov &&
          anim.to.fov &&
          isPerspectiveCamera(runtime.camera)
        ) {
          runtime.camera.fov =
            anim.from.fov + (anim.to.fov - anim.from.fov) * progress;
          runtime.camera.updateProjectionMatrix();
        }

        runtime.orbitControls.update();
        runtime.render();
      });

      set({
        animationProgress: t,
        cameraConfig: readCameraDefinitionFromRuntime(
          runtime.camera,
          runtime.orbitControls,
          get().cameraConfig.projection
        ),
      });

      if (t < 1 && get().isPlayingAnimation) {
        requestAnimationFrame(animate);
      } else {
        set({ isPlayingAnimation: false });
      }
    };

    requestAnimationFrame(animate);
  },

  stopCameraAnimation: () => {
    set({ isPlayingAnimation: false });
  },

  setAnimationProgress: (progress: number) => {
    set({ animationProgress: progress });
  },
  setActiveWorkspace: (activeWorkspace) =>
    set({
      activeWorkspace:
        activeWorkspace === 'preview' ? 'product' : activeWorkspace,
    }),
  setEmbed: ({ embedded, returnTo }) => set({ embedded, returnTo }),
  setSelected: (selected) => {
    const runtime = get().runtime;
    runtime?.attachSelection(selected);
    const selectionIdentity = resolveSelectionIdentity({
      object: selected,
      productRoot: runtime?.productRoot ?? null,
      document: get().visualDocument,
    });
    set((state) => ({
      selected,
      selectionIdentity,
      selectionRevision: state.selectionRevision + 1,
      inspectorStepId: null,
    }));
    if (selected && (get().pickMode?.kind === 'effect-target' || get().effectComposer)) {
      if (get().pickMode?.kind === 'effect-target') {
        void get()
          .applyPickedTargetFromSelection()
          .catch((error) => {
            const message =
              error instanceof Error ? error.message : 'Target pick failed';
            set({ statusMessage: message });
          });
      }
    }
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
    }));
  },
  setObjectVisible: (object, visible) => {
    object.visible = visible;
    set((state) => ({
      outlineRevision: state.outlineRevision + 1,
    }));
  },
  renameObject: (object, name) => {
    const nextName = name.trim();
    if (!nextName) return;
    object.userData.name = nextName;
    object.name = nextName;
    const runtime = get().runtime;
    const selectionIdentity = resolveSelectionIdentity({
      object: get().selected,
      productRoot: runtime?.productRoot ?? null,
      document: get().visualDocument,
    });
    set((state) => ({
      selectionIdentity,
      outlineRevision: state.outlineRevision + 1,
      selectionRevision: state.selectionRevision + 1,
      statusMessage: `Renamed to ${nextName}`,
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
    }));
  },
  bumpSelection: () =>
    set((state) => ({
      selectionRevision: state.selectionRevision + 1,
    })),
  setOutlineNodes: (outlineNodes) =>
    set((state) => ({
      outlineNodes,
      outlineRevision: state.outlineRevision + 1,
    })),
  setDocument: (document) => set({ document, dirty: false }),
  setGraphDetail: (graphDetail) =>
    set({
      graphDetail,
      selection: {},
      visualDocument: null,
      visualBaseline: null,
      visualReplayContext: null,
      visualMaterialCache: new Map(),
      selectionIdentity: null,
      selected: null,
    }),
  setVisualDocument: (visualDocument) => set({ visualDocument }),
  hydrateVisualReplay: async ({ detail, productModelId, preserveAuthoring }) => {
    const runtime = get().runtime;
    if (!runtime) {
      throw new Error('Editor runtime is not attached');
    }
    const document = normalizeVisualDocumentFromGraphDetail(
      detail,
      productModelId
    );
    const materialCache = new Map<string, Material>();
    const context = createVisualReplayContext();
    const priorSelection = preserveAuthoring ? get().selection : {};
    const priorFocus = preserveAuthoring ? get().authoringFocus : null;
    const priorEffect = preserveAuthoring ? get().selectedEffect : null;
    const priorComposer = preserveAuthoring ? get().effectComposer : null;

    const seededSelection: Record<string, string> = { ...priorSelection };
    for (const choice of detail.choices) {
      if (seededSelection[choice.key]) continue;
      const preferred = choice.values[0];
      if (!preferred) continue;
      seededSelection[choice.key] = preferred.key;
    }

    const nextWorkspace = preserveAuthoring ? get().activeWorkspace : 'scene';
    set({
      graphDetail: detail,
      visualDocument: document,
      visualBaseline: null,
      visualReplayContext: context,
      selection: seededSelection,
      visualMaterialCache: materialCache,
      authoringFocus: priorFocus,
      selectedEffect: priorEffect,
      effectComposer: priorComposer,
      pickMode: null,
      activeWorkspace:
        nextWorkspace === 'preview' ? 'product' : nextWorkspace,
    });

    const baseline = captureVisualBaseline(runtime.productRoot, document);
    context.structuralBaselines = captureStructuralBaselines(
      runtime.productRoot,
      document
    );
    for (const child of runtime.productRoot.children) {
      child.userData.objectAssetRevisionId = document.rootObjectAssetRevisionId;
      child.userData.compositionSlotKey = 'root';
    }
    set({ visualBaseline: baseline });
    await replayVisualDocument({
      root: runtime.productRoot,
      document,
      baseline,
      selection: seededSelection,
      auth: get().graphAuth,
      materialCache,
      productRevisionId: detail.id,
      context,
    });
    set({ loadError: null });
    runtime.render();
  },
  updateVisualBinding: (key, patch) => {
    const semantic = bindingSemanticKey(key);
    set((state) => {
      if (!state.visualDocument) return state;
      const bindings = state.visualDocument.bindings.map((binding) => {
        if (bindingSemanticKey(binding) !== semantic) return binding;
        if (
          binding.operation === 'SET_MATERIAL' &&
          typeof patch.materialAssetRevisionId === 'string'
        ) {
          return { ...binding, materialAssetRevisionId: patch.materialAssetRevisionId };
        }
        if (
          binding.operation === 'SET_VISIBILITY' &&
          typeof patch.visible === 'boolean'
        ) {
          return { ...binding, visible: patch.visible };
        }
        if (
          binding.operation === 'REPLACE_COMPONENT' &&
          typeof patch.linkedAssetKey === 'string'
        ) {
          return { ...binding, linkedAssetKey: patch.linkedAssetKey };
        }
        return binding;
      });
      return {
        visualDocument: { ...state.visualDocument, bindings },
        dirty: true,
        selectionIdentity: resolveSelectionIdentity({
          object: state.selected,
          productRoot: state.runtime?.productRoot ?? null,
          document: { ...state.visualDocument, bindings },
        }),
      };
    });
    void get()
      .replayActiveVisual()
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Visual replay failed';
        set({ loadError: message, statusMessage: message });
      });
  },
  addDraftVisualBinding: (binding) => {
    set((state) => {
      if (!state.visualDocument) return state;
      const exists = state.visualDocument.bindings.some(
        (entry) => bindingSemanticKey(entry) === bindingSemanticKey(binding)
      );
      if (exists) return state;
      const bindings = [...state.visualDocument.bindings, binding];
      const visualDocument = { ...state.visualDocument, bindings };
      return {
        visualDocument,
        dirty: true,
        selectionIdentity: resolveSelectionIdentity({
          object: state.selected,
          productRoot: state.runtime?.productRoot ?? null,
          document: visualDocument,
        }),
      };
    });
    void get()
      .replayActiveVisual()
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Visual replay failed';
        set({ loadError: message, statusMessage: message });
      });
  },
  removeDraftVisualBinding: (key) => {
    const semantic = bindingSemanticKey(key);
    set((state) => {
      if (!state.visualDocument) return state;
      const bindings = state.visualDocument.bindings.filter(
        (binding) => bindingSemanticKey(binding) !== semantic
      );
      const visualDocument = { ...state.visualDocument, bindings };
      return {
        visualDocument,
        dirty: true,
        selectionIdentity: resolveSelectionIdentity({
          object: state.selected,
          productRoot: state.runtime?.productRoot ?? null,
          document: visualDocument,
        }),
      };
    });
    void get()
      .replayActiveVisual()
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Visual replay failed';
        set({ loadError: message, statusMessage: message });
      });
  },
  createModelTargetFromSelection: async (input) => {
    const {
      selected,
      selectionIdentity,
      visualDocument,
      graphAuth,
      graphDetail,
      runtime,
    } = get();
    if (!selected || !selectionIdentity || !visualDocument || !graphAuth) {
      throw new Error('Select a mesh before creating a ModelTarget');
    }
    if (selectionIdentity.target) {
      throw new Error(
        `Node already bound as target "${selectionIdentity.target.key}"`
      );
    }
    const key =
      input?.key?.trim() ||
      semanticKeyFromName(selectionIdentity.objectName) ||
      `target_${Date.now()}`;
    const targetType = input?.targetType?.trim() || 'MATERIAL';
    set({ loading: true, statusMessage: 'Creating model target…' });
    try {
      await graphRequest(
        CREATE_MODEL_TARGET_MUTATION,
        {
          input: {
            productModelId: visualDocument.productModelId,
            key,
            targetType,
            nodePath: selectionIdentity.nodePath,
            ...(input?.materialSlot
              ? { materialSlot: input.materialSlot }
              : {}),
          },
        },
        graphAuth.token,
        graphAuth.apiUrl
      );
      const revisionId = graphDetail?.id ?? visualDocument.productRevisionId;
      const data = await graphRequest<{
        productRevisionDetail: GraphDetail;
      }>(
        PRODUCT_REVISION_DETAIL_QUERY,
        { id: revisionId },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await get().hydrateVisualReplay({
        detail: data.productRevisionDetail,
        productModelId: visualDocument.productModelId,
        preserveAuthoring: true,
      });
      if (runtime && selected) {
        get().setSelected(selected);
      }
      const identity = get().selectionIdentity;
      const composer = get().effectComposer;
      if (composer && identity?.target) {
        const validation = validateEffectTarget({
          document: get().visualDocument!,
          operation: composer.operation ?? 'SET_MATERIAL',
          targetKey: identity.target.key,
        });
        if (validation.ok) {
          set({
            effectComposer: {
              ...composer,
              targetKey: identity.target.key,
              pendingNodePath: null,
              materialSlot: identity.target.materialSlot ?? null,
            },
            pickMode: null,
          });
        }
      }
      set({
        loading: false,
        statusMessage: `Created ModelTarget “${key}”.`,
        dirty: false,
        activeWorkspace: 'scene',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create ModelTarget';
      set({ loading: false, loadError: message, statusMessage: message });
      throw error;
    }
  },
  reloadVisualDocument: async () => {
    const { graphAuth, graphDetail, visualDocument } = get();
    if (!graphAuth || !graphDetail || !visualDocument) {
      throw new Error('Nothing to reload');
    }
    set({ loading: true, statusMessage: 'Reloading visual document…' });
    try {
      const data = await graphRequest<{
        productRevisionDetail: GraphDetail;
      }>(
        PRODUCT_REVISION_DETAIL_QUERY,
        { id: graphDetail.id },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await get().hydrateVisualReplay({
        detail: data.productRevisionDetail,
        productModelId: visualDocument.productModelId,
      });
      set({
        loading: false,
        dirty: false,
        statusMessage: 'Visual document reloaded.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Reload failed';
      set({ loading: false, loadError: message, statusMessage: message });
      throw error;
    }
  },
  saveVisualDocument: async () => {
    const {
      graphAuth,
      productId,
      document,
      graphDetail,
      visualDocument,
    } = get();
    if (!graphAuth || !productId || !graphDetail || !visualDocument) {
      throw new Error('Load a product revision before saving bindings');
    }
    const productModelId =
      visualDocument.productModelId || document?.modelId || '';
    if (!productModelId) {
      throw new Error('Missing product model for visual save');
    }

    set({ loading: true, statusMessage: 'Saving visual bindings…' });
    try {
      const desired = visualDocument;
      const result = await persistVisualDocument({
        auth: graphAuth,
        productId,
        productModelId,
        detail: graphDetail,
        desired,
      });

      await get().hydrateVisualReplay({
        detail: result.detail,
        productModelId: result.document.productModelId,
      });

      const nextAuth: GraphSessionAuth = {
        ...graphAuth,
        productRevisionId: result.detail.id,
        graphVersionId: result.detail.id,
      };
      const currentDoc = get().document;
      set({
        graphAuth: nextAuth,
        dirty: false,
        loading: false,
        statusMessage:
          result.opsApplied === 0
            ? 'Visual bindings already up to date.'
            : `Saved ${result.opsApplied} visual change(s).`,
        document: currentDoc
          ? {
              ...currentDoc,
              modelId: result.document.productModelId,
              ruleCount: result.detail.visualEffects.length,
            }
          : currentDoc,
        modelId: result.document.productModelId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save visual bindings';
      set({ loading: false, loadError: message, statusMessage: message });
      throw error;
    }
  },
  setVisualSelection: (choiceKey, valueKey) => {
    get().setChoiceValue(choiceKey, valueKey);
    void get()
      .replayActiveVisual()
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Visual replay failed';
        set({ loadError: message, statusMessage: message });
      });
  },
  clearVisualSelection: () => {
    get().clearSelection();
    void get()
      .replayActiveVisual()
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Visual replay failed';
        set({ loadError: message, statusMessage: message });
      });
  },
  resetVisualSelection: () => {
    get().clearVisualSelection();
  },
  ensureLivePreview: async () => {
    const { graphDetail, selection } = get();
    if (!graphDetail) {
      set({ statusMessage: 'Load a product revision before previewing.' });
      return;
    }

    const nextSelection: Record<string, string> = { ...selection };
    for (const choice of graphDetail.choices) {
      if (nextSelection[choice.key]) continue;
      const preferred = choice.values[0];
      if (!preferred) continue;
      nextSelection[choice.key] = preferred.key;
    }
    get().setSelection(nextSelection);
    await get().replayActiveVisual();
    set({
      statusMessage: 'Live preview — change Config or the bar below to update the scene',
    });
  },
  previewChoiceValue: (choiceKey, valueKey) => {
    set({
      authoringFocus: { choiceKey, valueKey },
      selectedEffect: null,
      effectComposer: null,
      pickMode: null,
      activeWorkspace: 'product',
    });
    get().setVisualSelection(choiceKey, valueKey);
  },
  setChoiceDefault: async (choiceId, defaultValueId) => {
    const { graphAuth, graphDetail } = get();
    if (!graphAuth || !graphDetail) {
      throw new Error('Load a product revision before setting a default');
    }
    if (!isRevisionEditable(graphDetail.status)) {
      throw new Error('Revision is read-only. Create a new draft to edit.');
    }
    set({ statusMessage: 'Updating choice default…' });
    try {
      await graphRequest(
        SET_CHOICE_DEFAULT_MUTATION,
        {
          input: {
            choiceId,
            defaultValueId,
          },
        },
        graphAuth.token,
        graphAuth.apiUrl
      );
      set((state) => {
        if (!state.graphDetail) return state;
        return {
          graphDetail: {
            ...state.graphDetail,
            choices: state.graphDetail.choices.map((choice) =>
              choice.id === choiceId
                ? { ...choice, defaultValueId }
                : choice
            ),
          },
          statusMessage: defaultValueId
            ? 'Default value updated.'
            : 'Choice default cleared.',
        };
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to set choice default';
      set({ loadError: message, statusMessage: message });
      throw error;
    }
  },
  setAuthoringFocus: (focus) => {
    set({
      authoringFocus: focus,
      selectedEffect: null,
      effectComposer: null,
      pickMode: null,
      activeWorkspace: 'product',
    });
  },
  setSelectedEffect: (effect) => {
    set({
      selectedEffect: effect,
      effectComposer: null,
      pickMode: null,
    });
  },
  beginEffectComposer: () => {
    const focus = get().authoringFocus;
    const detail = get().graphDetail;
    if (!focus) {
      set({ statusMessage: 'Select a choice value before adding an effect.' });
      return;
    }
    if (!isRevisionEditable(detail?.status)) {
      set({
        statusMessage: 'Revision is read-only. Create a new draft to edit.',
      });
      return;
    }
    set({
      effectComposer: emptyEffectComposer(focus),
      selectedEffect: null,
      pickMode: null,
      activeWorkspace: 'product',
    });
  },
  updateEffectComposer: (patch) => {
    set((state) => {
      if (!state.effectComposer) return state;
      return {
        effectComposer: { ...state.effectComposer, ...patch },
      };
    });
  },
  cancelEffectComposer: () => {
    set({ effectComposer: null, pickMode: null });
  },
  startTargetPick: (operation) => {
    if (!isRevisionEditable(get().graphDetail?.status)) {
      set({
        statusMessage: 'Revision is read-only. Create a new draft to edit.',
      });
      return;
    }
    set((state) => ({
      pickMode: { kind: 'effect-target', operation },
      effectComposer: state.effectComposer
        ? { ...state.effectComposer, operation }
        : state.effectComposer,
      toolMode: 'select',
      statusMessage:
        operation === 'SET_MATERIAL'
          ? 'Pick a surface target in the viewport'
          : operation === 'REPLACE_COMPONENT'
            ? 'Pick a structural target in the viewport'
            : 'Pick a visibility target in the viewport',
    }));
    get().runtime?.setToolMode('select');
  },
  cancelTargetPick: () => {
    set({ pickMode: null, statusMessage: null });
  },
  applyPickedTargetFromSelection: async () => {
    const {
      pickMode,
      effectComposer,
      selectionIdentity,
      visualDocument,
      selected,
    } = get();
    if (!effectComposer || !selectionIdentity || !visualDocument) {
      return;
    }
    if (!selected) return;
    const operation = pickMode?.operation ?? effectComposer.operation;
    if (!operation) {
      set({ statusMessage: 'Choose an operation before picking a target.' });
      return;
    }

    if (!selectionIdentity.target) {
      set({
        effectComposer: {
          ...effectComposer,
          operation,
          targetKey: null,
          pendingNodePath: selectionIdentity.nodePath,
        },
        statusMessage:
          'No ModelTarget on this node — create one to continue.',
      });
      return;
    }

    const validation = validateEffectTarget({
      document: visualDocument,
      operation,
      targetKey: selectionIdentity.target.key,
    });
    if (!validation.ok) {
      set({ statusMessage: validation.message });
      return;
    }

    set({
      effectComposer: {
        ...effectComposer,
        operation,
        targetKey: selectionIdentity.target.key,
        pendingNodePath: null,
        materialSlot: selectionIdentity.target.materialSlot ?? null,
      },
      pickMode: null,
      statusMessage: `Target set to ${selectionIdentity.target.key}`,
    });
  },
  commitEffectComposer: () => {
    const { effectComposer, visualDocument, graphDetail } = get();
    if (!effectComposer || !visualDocument) return;
    if (!isRevisionEditable(graphDetail?.status)) {
      set({
        statusMessage: 'Revision is read-only. Create a new draft to edit.',
      });
      return;
    }
    const binding = composerToBinding(effectComposer);
    if (!binding) {
      set({
        statusMessage:
          'Complete operation, target, and payload before adding the effect.',
      });
      return;
    }
    const validation = validateEffectTarget({
      document: visualDocument,
      operation: binding.operation,
      targetKey: binding.targetKey,
    });
    if (!validation.ok) {
      set({ statusMessage: validation.message });
      return;
    }
    get().addDraftVisualBinding(binding);
    set({
      effectComposer: null,
      pickMode: null,
      selectedEffect: {
        choiceKey: binding.choiceKey,
        valueKey: binding.valueKey,
        targetKey: binding.targetKey,
        operation: binding.operation,
      },
      statusMessage:
        'Draft effect added. Use Preview Selection to see it, then Save.',
    });
  },
  createDraftRevisionForEdit: async () => {
    const { graphAuth, productId, graphDetail } = get();
    if (!graphAuth || !productId || !graphDetail) {
      throw new Error('Load a product revision first');
    }
    if (isRevisionEditable(graphDetail.status)) {
      set({ statusMessage: 'Already on a draft revision.' });
      return;
    }
    set({ loading: true, statusMessage: 'Creating draft revision…' });
    try {
      const draft = await graphRequest<{
        createDraftProductRevision: { id: string; status: string };
      }>(
        CREATE_DRAFT_PRODUCT_REVISION_MUTATION,
        {
          productId,
          sourceProductRevisionId: graphDetail.id,
        },
        graphAuth.token,
        graphAuth.apiUrl
      );
      const data = await graphRequest<{
        productRevisionDetail: GraphDetail;
      }>(
        PRODUCT_REVISION_DETAIL_QUERY,
        { id: draft.createDraftProductRevision.id },
        graphAuth.token,
        graphAuth.apiUrl
      );
      await get().hydrateVisualReplay({
        detail: data.productRevisionDetail,
        productModelId: get().visualDocument?.productModelId,
      });
      set({
        graphAuth: {
          ...graphAuth,
          productRevisionId: data.productRevisionDetail.id,
          graphVersionId: data.productRevisionDetail.id,
        },
        loading: false,
        dirty: false,
        statusMessage: 'Draft revision ready for authoring.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create draft';
      set({ loading: false, loadError: message, statusMessage: message });
      throw error;
    }
  },
  replayActiveVisual: async () => {
    const {
      runtime,
      visualDocument,
      visualBaseline,
      visualReplayContext,
      selection,
      visualMaterialCache,
      graphAuth,
      graphDetail,
    } = get();
    if (!runtime || !visualDocument || !graphDetail) {
      return;
    }
    if (!visualBaseline || !visualReplayContext) {
      throw new Error('Visual baseline missing — reload the product');
    }
    await replayVisualDocument({
      root: runtime.productRoot,
      document: visualDocument,
      baseline: visualBaseline,
      selection,
      auth: graphAuth,
      materialCache: visualMaterialCache,
      productRevisionId: graphDetail.id,
      context: visualReplayContext,
    });
    set({ loadError: null });
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

let cameraSyncSuppressDepth = 0;

function isPerspectiveCamera(
  camera: THREE.Camera
): camera is THREE.PerspectiveCamera {
  return (camera as THREE.PerspectiveCamera).isPerspectiveCamera === true;
}

function isOrthographicCamera(
  camera: THREE.Camera
): camera is THREE.OrthographicCamera {
  return (camera as THREE.OrthographicCamera).isOrthographicCamera === true;
}

function frustumHeightFromFov(fovDeg: number, distance: number) {
  return (
    2 *
    Math.tan(((fovDeg * Math.PI) / 180) / 2) *
    Math.max(distance, 0.01)
  );
}

function applyOrthoFrustum(
  camera: THREE.OrthographicCamera,
  aspect: number,
  frustumHeight: number
) {
  camera.left = (-frustumHeight * aspect) / 2;
  camera.right = (frustumHeight * aspect) / 2;
  camera.top = frustumHeight / 2;
  camera.bottom = -frustumHeight / 2;
  camera.updateProjectionMatrix();
}

function withSuppressedCameraSync(fn: () => void) {
  cameraSyncSuppressDepth += 1;
  try {
    fn();
  } finally {
    cameraSyncSuppressDepth -= 1;
  }
}

function readCameraDefinitionFromRuntime(
  camera: EditorCamera,
  controls: OrbitControls,
  projection: CameraDefinition['projection'] = 'PERSPECTIVE',
  fallbackFov = 45
): CameraDefinition {
  return {
    projection,
    position: [
      Number(camera.position.x.toFixed(2)),
      Number(camera.position.y.toFixed(2)),
      Number(camera.position.z.toFixed(2)),
    ],
    target: [
      Number(controls.target.x.toFixed(2)),
      Number(controls.target.y.toFixed(2)),
      Number(controls.target.z.toFixed(2)),
    ],
    fov: isPerspectiveCamera(camera)
      ? Number(camera.fov.toFixed(2))
      : fallbackFov,
    near: Number(camera.near.toFixed(4)),
    far: Number(camera.far.toFixed(2)),
  };
}

function applyStoreCameraToRuntime(
  runtime: Pick<
    EditorRuntime,
    'camera' | 'orbitControls' | 'render' | 'setProjection' | 'gl'
  >,
  cameraConfig: CameraDefinition,
  orbitConfig: OrbitDefinition
) {
  withSuppressedCameraSync(() => {
    runtime.setProjection(cameraConfig.projection);

    const camera = runtime.camera;
    camera.position.set(
      cameraConfig.position[0],
      cameraConfig.position[1],
      cameraConfig.position[2]
    );
    runtime.orbitControls.target.set(
      cameraConfig.target[0],
      cameraConfig.target[1],
      cameraConfig.target[2]
    );
    camera.near = cameraConfig.near;
    camera.far = cameraConfig.far;

    if (isPerspectiveCamera(camera)) {
      camera.fov = cameraConfig.fov;
      camera.updateProjectionMatrix();
    } else {
      const size = new THREE.Vector2();
      runtime.gl.getSize(size);
      const aspect = size.y > 0 ? size.x / size.y : 1;
      const distance = camera.position.distanceTo(runtime.orbitControls.target);
      camera.zoom = 1;
      applyOrthoFrustum(
        camera,
        aspect,
        frustumHeightFromFov(cameraConfig.fov, distance)
      );
    }

    runtime.orbitControls.enabled = orbitConfig.enabled;
    runtime.orbitControls.enableRotate = orbitConfig.enableRotate;
    runtime.orbitControls.enablePan = orbitConfig.enablePan;
    runtime.orbitControls.enableZoom = orbitConfig.enableZoom;
    runtime.orbitControls.minDistance = orbitConfig.minDistance;
    runtime.orbitControls.maxDistance = orbitConfig.maxDistance;
    runtime.orbitControls.minPolarAngle =
      (orbitConfig.minPolarAngle * Math.PI) / 180;
    runtime.orbitControls.maxPolarAngle =
      (orbitConfig.maxPolarAngle * Math.PI) / 180;
    runtime.orbitControls.autoRotate = orbitConfig.autoRotate;
    runtime.orbitControls.autoRotateSpeed = orbitConfig.autoRotateSpeed;
    runtime.orbitControls.update();
    runtime.render();
  });
}

function commitFramedCameraToStore(
  camera: EditorCamera,
  controls: OrbitControls,
  next: CameraDefinition
) {
  withSuppressedCameraSync(() => {
    camera.position.set(next.position[0], next.position[1], next.position[2]);
    controls.target.set(next.target[0], next.target[1], next.target[2]);
    camera.near = next.near;
    camera.far = next.far;
    if (isPerspectiveCamera(camera)) {
      camera.fov = next.fov;
      camera.updateProjectionMatrix();
    }
    controls.update();
  });
  useEditorStore.setState({ cameraConfig: { ...next } });
}

function applyCamera(
  camera: EditorCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
  productCamera?: ProductCamera | null
) {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const current = useEditorStore.getState().cameraConfig;

  const fov = productCamera?.fov ?? current.fov;
  const maxDim = Math.max(size.x, size.y, size.z, 0.2);
  const fovInRad = (fov * Math.PI) / 180;
  const fitDistance = (maxDim / (2 * Math.tan(fovInRad / 2))) * 1.25;

  const hasPosition =
    typeof productCamera?.x === 'number' &&
    typeof productCamera?.y === 'number' &&
    typeof productCamera?.z === 'number';

  const position: [number, number, number] = hasPosition
    ? [productCamera.x!, productCamera.y!, productCamera.z!]
    : (() => {
        const direction = new THREE.Vector3(0.55, 0.35, 0.75).normalize();
        const pos = center.clone().add(direction.multiplyScalar(fitDistance));
        return [
          Number(pos.x.toFixed(2)),
          Number(pos.y.toFixed(2)),
          Number(pos.z.toFixed(2)),
        ];
      })();

  const target: [number, number, number] = [
    Number(center.x.toFixed(2)),
    Number(center.y.toFixed(2)),
    Number(center.z.toFixed(2)),
  ];

  const near = productCamera?.near ?? Math.max(0.01, fitDistance / 100);
  const far = productCamera?.far ?? Math.max(100, fitDistance * 50);

  commitFramedCameraToStore(camera, controls, {
    projection: current.projection,
    position,
    target,
    fov,
    near: Number(near.toFixed(4)),
    far: Number(far.toFixed(2)),
  });

  if (isOrthographicCamera(camera)) {
    const aspect = Math.max(
      (camera.right - camera.left) /
        Math.max(camera.top - camera.bottom, 0.0001),
      0.01
    );
    const distance = new THREE.Vector3(...position).distanceTo(
      new THREE.Vector3(...target)
    );
    camera.zoom = 1;
    applyOrthoFrustum(camera, aspect, frustumHeightFromFov(fov, distance));
  }
}

function frameObject(
  camera: EditorCamera,
  controls: OrbitControls,
  object: THREE.Object3D
) {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const current = useEditorStore.getState().cameraConfig;
  const maxDim = Math.max(size.x, size.y, size.z, 0.2);
  const fov = isPerspectiveCamera(camera) ? camera.fov : current.fov;
  const fovInRad = (fov * Math.PI) / 180;
  const fitDistance = (maxDim / (2 * Math.tan(fovInRad / 2))) * 1.2;
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (direction.lengthSq() < 0.0001) {
    direction.set(0.55, 0.35, 0.75).normalize();
  }
  const pos = center.clone().add(direction.multiplyScalar(fitDistance));

  commitFramedCameraToStore(camera, controls, {
    projection: current.projection,
    position: [
      Number(pos.x.toFixed(2)),
      Number(pos.y.toFixed(2)),
      Number(pos.z.toFixed(2)),
    ],
    target: [
      Number(center.x.toFixed(2)),
      Number(center.y.toFixed(2)),
      Number(center.z.toFixed(2)),
    ],
    fov,
    near: camera.near,
    far: camera.far,
  });

  if (isOrthographicCamera(camera)) {
    const aspect = Math.max(
      (camera.right - camera.left) / Math.max(camera.top - camera.bottom, 0.0001),
      0.01
    );
    camera.zoom = 1;
    applyOrthoFrustum(camera, aspect, frustumHeightFromFov(fov, fitDistance));
  }
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
  const aspect = width / height;
  const { cameraConfig, orbitConfig } = useEditorStore.getState();

  const scene = new THREE.Scene();
  scene.background = null;

  const perspectiveCamera = new THREE.PerspectiveCamera(
    cameraConfig.fov,
    aspect,
    cameraConfig.near,
    cameraConfig.far
  );
  perspectiveCamera.position.set(
    cameraConfig.position[0],
    cameraConfig.position[1],
    cameraConfig.position[2]
  );

  const orthographicCamera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    cameraConfig.near,
    cameraConfig.far
  );
  orthographicCamera.position.copy(perspectiveCamera.position);
  const initialDistance = perspectiveCamera.position.distanceTo(
    new THREE.Vector3(
      cameraConfig.target[0],
      cameraConfig.target[1],
      cameraConfig.target[2]
    )
  );
  applyOrthoFrustum(
    orthographicCamera,
    aspect,
    frustumHeightFromFov(cameraConfig.fov, initialDistance)
  );

  let camera: EditorCamera =
    cameraConfig.projection === 'ORTHOGRAPHIC'
      ? orthographicCamera
      : perspectiveCamera;

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
  orbitControls.zoomSpeed = 1.2;
  orbitControls.enabled = orbitConfig.enabled;
  orbitControls.enableRotate = orbitConfig.enableRotate;
  orbitControls.enablePan = orbitConfig.enablePan;
  orbitControls.enableZoom = orbitConfig.enableZoom;
  orbitControls.minDistance = orbitConfig.minDistance;
  orbitControls.maxDistance = orbitConfig.maxDistance;
  orbitControls.minPolarAngle = (orbitConfig.minPolarAngle * Math.PI) / 180;
  orbitControls.maxPolarAngle = (orbitConfig.maxPolarAngle * Math.PI) / 180;
  orbitControls.autoRotate = orbitConfig.autoRotate;
  orbitControls.autoRotateSpeed = orbitConfig.autoRotateSpeed;
  orbitControls.target.set(
    cameraConfig.target[0],
    cameraConfig.target[1],
    cameraConfig.target[2]
  );
  orbitControls.update();

  orbitControls.addEventListener('change', () => {
    if (cameraSyncSuppressDepth > 0) return;
    const state = useEditorStore.getState();
    const next = readCameraDefinitionFromRuntime(
      camera,
      orbitControls,
      state.cameraConfig.projection,
      state.cameraConfig.fov
    );
    const prev = state.cameraConfig;
    if (
      next.position[0] !== prev.position[0] ||
      next.position[1] !== prev.position[1] ||
      next.position[2] !== prev.position[2] ||
      next.target[0] !== prev.target[0] ||
      next.target[1] !== prev.target[1] ||
      next.target[2] !== prev.target[2] ||
      next.fov !== prev.fov ||
      next.near !== prev.near ||
      next.far !== prev.far ||
      next.projection !== prev.projection
    ) {
      state.syncLiveCameraFromViewport(next);
    }
  });

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

  const setProjection = (projection: CameraProjection) => {
    const wantOrtho = projection === 'ORTHOGRAPHIC';
    const isOrtho = isOrthographicCamera(camera);
    if (wantOrtho === isOrtho) return;

    const prev = camera;
    const next = wantOrtho ? orthographicCamera : perspectiveCamera;
    next.position.copy(prev.position);
    next.quaternion.copy(prev.quaternion);
    next.up.copy(prev.up);
    next.near = prev.near;
    next.far = prev.far;

    if (wantOrtho) {
      const size = new THREE.Vector2();
      gl.getSize(size);
      const nextAspect = size.y > 0 ? size.x / size.y : 1;
      const distance = next.position.distanceTo(orbitControls.target);
      const fov = useEditorStore.getState().cameraConfig.fov;
      orthographicCamera.zoom = 1;
      applyOrthoFrustum(
        orthographicCamera,
        nextAspect,
        frustumHeightFromFov(fov, distance)
      );
    } else {
      perspectiveCamera.fov = useEditorStore.getState().cameraConfig.fov;
      const size = new THREE.Vector2();
      gl.getSize(size);
      perspectiveCamera.aspect = size.y > 0 ? size.x / size.y : 1;
      perspectiveCamera.updateProjectionMatrix();
    }

    camera = next;
    orbitControls.object = camera;
    transformControls.camera = camera;
    orbitControls.update();
  };

  const materialCache = new Map<string, THREE.Material>();
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  let environmentMap: THREE.Texture | null = null;
  let pmremDisposed = false;
  let selectionOutline: THREE.BoxHelper | null = null;
  const pointer = { x: 0, y: 0, moved: false };
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  const clearSelectionOutline = () => {
    if (!selectionOutline) return;
    scene.remove(selectionOutline);
    selectionOutline.geometry.dispose();
    const material = selectionOutline.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else {
      material.dispose();
    }
    selectionOutline = null;
  };

  const syncSelectionOutline = (object: THREE.Object3D | null) => {
    clearSelectionOutline();
    if (!object) return;
    selectionOutline = new THREE.BoxHelper(object, 0x665cff);
    selectionOutline.name = 'SelectionOutline';
    selectionOutline.userData.isSelectionHelper = true;
    selectionOutline.raycast = () => undefined;
    scene.add(selectionOutline);
  };

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
    syncSelectionOutline(object);
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

  const zoomCamera = (factor: number) => {
    if (factor > 0) {
      orbitControls.dollyIn(1 + factor);
    } else {
      orbitControls.dollyOut(1 - factor);
    }
    orbitControls.update();
    render();
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
          if (
            current.userData.isTransformControls ||
            current.userData.isSelectionHelper
          ) {
            return false;
          }
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
    selectionOutline?.update();
    gl.render(scene, camera);
  };

  const resize = (nextWidth: number, nextHeight: number) => {
    if (nextWidth <= 0 || nextHeight <= 0) return;
    const nextAspect = nextWidth / nextHeight;
    if (isPerspectiveCamera(camera)) {
      camera.aspect = nextAspect;
      camera.updateProjectionMatrix();
    } else {
      const frustumHeight = camera.top - camera.bottom;
      applyOrthoFrustum(camera, nextAspect, frustumHeight);
    }
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(nextWidth, nextHeight, false);
    render();
  };

  const clearProduct = () => {
    useEditorStore.getState().setSelected(null);
    clearSelectionOutline();
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
    clearSelectionOutline();
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
    get camera() {
      return camera;
    },
    gl,
    orbitControls,
    transformControls,
    productRoot,
    pointerDown,
    pointerUp,
    setToolMode,
    attachSelection,
    frameSelection,
    zoomCamera,
    setProjection,
    render,
    resize,
    clearProduct,
    mountAssets,
    dispose,
  };
}
