import { create } from 'zustand';
import { composeCubeSlices, createCubeStore, type CubeStore } from './index.js';

describe('createCubeStore', () => {
  it('updates session, workspace, selection, and status', () => {
    const store = createCubeStore();

    store.getState().setGraphAuth({
      token: 't',
      apiUrl: 'http://localhost:4000',
    });
    store.getState().setUserName('Ada');
    store.getState().setIds({
      projectId: 'proj_1',
      productId: 'prod_1',
      modelId: 'model_1',
    });
    store.getState().setChoiceValue('finish', 'walnut');
    store.getState().setLoading(true);
    store.getState().markDirty();

    const state = store.getState();
    expect(state.graphAuth).toEqual({
      token: 't',
      apiUrl: 'http://localhost:4000',
    });
    expect(state.userName).toBe('Ada');
    expect(state.projectId).toBe('proj_1');
    expect(state.productId).toBe('prod_1');
    expect(state.modelId).toBe('model_1');
    expect(state.selection).toEqual({ finish: 'walnut' });
    expect(state.loading).toBe(true);
    expect(state.dirty).toBe(true);
  });

  it('hydrates display session and workspace without a client token', () => {
    const store = createCubeStore();
    store.getState().hydrate({
      session: {
        userName: 'Ada Lovelace',
        email: 'ada@example.com',
        role: 'owner',
      },
      workspace: {
        projectId: 'proj_1',
        projectName: 'Showroom',
        organizationId: 'org_1',
        organizationName: 'Introfinity',
      },
    });

    const state = store.getState();
    expect(state.graphAuth).toBeNull();
    expect(state.userName).toBe('Ada Lovelace');
    expect(state.email).toBe('ada@example.com');
    expect(state.role).toBe('owner');
    expect(state.projectName).toBe('Showroom');
    expect(state.organizationId).toBe('org_1');
    expect(state.organizationName).toBe('Introfinity');
  });

  it('clears selection when the product graph changes', () => {
    const store = createCubeStore();
    store.getState().setChoiceValue('finish', 'walnut');
    store.getState().setGraphDetail(null);
    expect(store.getState().selection).toEqual({});
  });

  it('replaces and clears selection independently of the product graph', () => {
    const store = createCubeStore();
    store.getState().setSelection({ finish: 'oak', size: 'lg' });
    expect(store.getState().selection).toEqual({ finish: 'oak', size: 'lg' });
    store.getState().clearSelection();
    expect(store.getState().selection).toEqual({});
  });

  it('merges partial workspace hydrates without wiping sibling ids', () => {
    const store = createCubeStore();
    store.getState().hydrate({
      workspace: { projectId: 'proj_1', projectName: 'Showroom' },
    });
    store.getState().hydrate({
      workspace: { productId: 'prod_1' },
    });
    expect(store.getState().projectId).toBe('proj_1');
    expect(store.getState().projectName).toBe('Showroom');
    expect(store.getState().productId).toBe('prod_1');
  });

  it('resets session and workspace independently', () => {
    const store = createCubeStore();
    store.getState().hydrate({
      session: { userName: 'Ada', email: 'ada@example.com', role: 'owner' },
      workspace: {
        projectId: 'proj_1',
        projectName: 'Showroom',
        productId: 'prod_1',
      },
    });
    store.getState().resetWorkspace();
    expect(store.getState().userName).toBe('Ada');
    expect(store.getState().projectId).toBeUndefined();
    expect(store.getState().productId).toBeUndefined();

    store.getState().resetSession();
    expect(store.getState().userName).toBeNull();
    expect(store.getState().email).toBeNull();
    expect(store.getState().role).toBeNull();
  });

  it('initializes camera from the shared camera slice', () => {
    const store = createCubeStore();
    const state = store.getState();
    expect(state.activeCameraPresetId).toBe('preset-default');
    expect(state.cameraConfig.fov).toBe(45);
    expect(state.cameraConfig.position).toEqual([3.2, 2.1, 5.8]);
    expect(state.orbitConfig.enabled).toBe(true);

    store.getState().setActiveCameraPreset('preset-hero');
    expect(store.getState().cameraConfig.fov).toBe(40);
    expect(store.getState().activeCameraPresetId).toBe('preset-hero');

    store.getState().updateCameraConfig({ fov: 55 });
    expect(store.getState().cameraConfig.fov).toBe(55);

    store.getState().renameCameraPreset('preset-hero', 'Hero Shot');
    expect(
      store.getState().cameraPresets.find((p) => p.id === 'preset-hero')?.name
    ).toBe('Hero Shot');
  });
});

describe('composeCubeSlices', () => {
  type HostStore = CubeStore & {
    canvasReady: boolean;
    setCanvasReady: (canvasReady: boolean) => void;
  };

  it('lets a host store add local slices without duplicating cube state', () => {
    const store = create<HostStore>()((set, get) => ({
      ...composeCubeSlices(set, get),
      canvasReady: false,
      setCanvasReady: (canvasReady) => set({ canvasReady }),
      setGraphDetail: (graphDetail) =>
        set({
          graphDetail,
          selection: {},
          canvasReady: false,
        }),
    }));

    store.getState().setChoiceValue('finish', 'walnut');
    store.getState().setCanvasReady(true);
    store.getState().setGraphDetail(null);

    expect(store.getState().selection).toEqual({});
    expect(store.getState().canvasReady).toBe(false);
  });
});
