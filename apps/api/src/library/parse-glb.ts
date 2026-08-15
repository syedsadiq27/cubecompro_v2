import { Document, NodeIO, type Node as GltfNode } from '@gltf-transform/core';

export type ParsedObjectNode = {
  name: string;
  path: string;
  type: 'mesh' | 'group' | 'node';
  materialSlots: number[];
  materialNames: string[];
  children: ParsedObjectNode[];
};

export type ParsedObjectMetadata = {
  metadataVersion: number;
  assetName: string;
  format: 'glb' | 'gltf';
  nodes: ParsedObjectNode[];
  materials: Array<{ index: number; name: string }>;
  animations: string[];
  stats: {
    nodeCount: number;
    meshCount: number;
    materialCount: number;
    animationCount: number;
  };
};

type GltfJson = {
  nodes?: Array<{
    name?: string;
    mesh?: number;
    children?: number[];
  }>;
  meshes?: Array<{
    name?: string;
    primitives?: Array<{ material?: number }>;
  }>;
  materials?: Array<{ name?: string }>;
  animations?: Array<{ name?: string }>;
  scenes?: Array<{ nodes?: number[] }>;
  scene?: number;
};

export async function parseGlbMetadata(
  bytes: Buffer,
  options: { assetName: string; format: 'glb' | 'gltf' }
): Promise<ParsedObjectMetadata> {
  try {
    const io = new NodeIO();
    const document = await io.readBinary(new Uint8Array(bytes));
    return buildMetadataFromDocument(document, options);
  } catch {
    return buildMetadataFromGlbJsonChunk(bytes, options);
  }
}

export function buildMetadataFromDocument(
  document: Document,
  options: { assetName: string; format: 'glb' | 'gltf' }
): ParsedObjectMetadata {
  const root = document.getRoot();
  const materials = root.listMaterials().map((material, index) => ({
    index,
    name: material.getName() || `Material_${index}`,
  }));
  const materialIndex = new Map(
    root.listMaterials().map((material, index) => [material, index] as const)
  );

  const scenes = root.listScenes();
  const roots: ParsedObjectNode[] = [];
  let nodeCount = 0;
  let meshCount = 0;

  for (const scene of scenes) {
    for (const child of scene.listChildren()) {
      roots.push(
        walkNode(child, [], materialIndex, () => {
          nodeCount += 1;
        }, () => {
          meshCount += 1;
        })
      );
    }
  }

  const animations = root.listAnimations().map((animation, index) => {
    return animation.getName() || `Animation_${index}`;
  });

  return {
    metadataVersion: 1,
    assetName: options.assetName,
    format: options.format,
    nodes: roots,
    materials,
    animations,
    stats: {
      nodeCount,
      meshCount,
      materialCount: materials.length,
      animationCount: animations.length,
    },
  };
}

function buildMetadataFromGlbJsonChunk(
  bytes: Buffer,
  options: { assetName: string; format: 'glb' | 'gltf' }
): ParsedObjectMetadata {
  const gltf =
    options.format === 'gltf'
      ? (JSON.parse(bytes.toString('utf8')) as GltfJson)
      : readGlbJsonChunk(bytes);

  const materials = (gltf.materials ?? []).map((material, index) => ({
    index,
    name: material.name || `Material_${index}`,
  }));
  const meshes = gltf.meshes ?? [];
  const nodes = gltf.nodes ?? [];
  const sceneIndex = gltf.scene ?? 0;
  const sceneRoots = gltf.scenes?.[sceneIndex]?.nodes ?? [0];

  let nodeCount = 0;
  let meshCount = 0;

  const walk = (nodeIndex: number, parentPath: string[]): ParsedObjectNode => {
    nodeCount += 1;
    const node = nodes[nodeIndex] ?? {};
    const name = node.name || `Node_${nodeIndex}`;
    const pathParts = [...parentPath, name];
    const meshIndex = node.mesh;
    const materialSlots: number[] = [];
    const materialNames: string[] = [];

    if (meshIndex != null && meshes[meshIndex]) {
      meshCount += 1;
      for (const prim of meshes[meshIndex].primitives ?? []) {
        if (prim.material == null) continue;
        if (!materialSlots.includes(prim.material)) {
          materialSlots.push(prim.material);
          materialNames.push(
            materials[prim.material]?.name || `Material_${prim.material}`
          );
        }
      }
    }

    const children = (node.children ?? []).map((child) =>
      walk(child, pathParts)
    );

    return {
      name,
      path: pathParts.join('/'),
      type: meshIndex != null ? 'mesh' : children.length > 0 ? 'group' : 'node',
      materialSlots,
      materialNames,
      children,
    };
  };

  const roots = sceneRoots
    .filter((index) => Number.isInteger(index) && index >= 0)
    .map((index) => walk(index, []));

  const animations = (gltf.animations ?? []).map(
    (animation, index) => animation.name || `Animation_${index}`
  );

  return {
    metadataVersion: 1,
    assetName: options.assetName,
    format: options.format,
    nodes: roots,
    materials,
    animations,
    stats: {
      nodeCount,
      meshCount,
      materialCount: materials.length,
      animationCount: animations.length,
    },
  };
}

function readGlbJsonChunk(bytes: Buffer): GltfJson {
  if (bytes.length < 20) {
    throw new Error('GLB too short');
  }
  const magic = bytes.toString('ascii', 0, 4);
  if (magic !== 'glTF') {
    throw new Error('Not a GLB file');
  }
  const jsonLength = bytes.readUInt32LE(12);
  const jsonType = bytes.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a) {
    throw new Error('GLB missing JSON chunk');
  }
  const start = 20;
  const end = start + jsonLength;
  if (end > bytes.length) {
    throw new Error('GLB JSON chunk truncated');
  }
  return JSON.parse(bytes.subarray(start, end).toString('utf8')) as GltfJson;
}

function walkNode(
  node: GltfNode,
  parentPath: string[],
  materialIndex: Map<unknown, number>,
  onNode: () => void,
  onMesh: () => void
): ParsedObjectNode {
  onNode();
  const name = node.getName() || 'Node';
  const pathParts = [...parentPath, name];
  const path = pathParts.join('/');
  const mesh = node.getMesh();
  const materialSlots: number[] = [];
  const materialNames: string[] = [];

  if (mesh) {
    onMesh();
    for (const prim of mesh.listPrimitives()) {
      const material = prim.getMaterial();
      if (!material) continue;
      const index = materialIndex.get(material);
      if (index == null) continue;
      if (!materialSlots.includes(index)) {
        materialSlots.push(index);
        materialNames.push(material.getName() || `Material_${index}`);
      }
    }
  }

  const children = node.listChildren().map((child) =>
    walkNode(child, pathParts, materialIndex, onNode, onMesh)
  );

  return {
    name,
    path,
    type: mesh ? 'mesh' : children.length > 0 ? 'group' : 'node',
    materialSlots,
    materialNames,
    children,
  };
}
