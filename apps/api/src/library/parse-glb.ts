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

export async function parseGlbMetadata(
  bytes: Buffer,
  options: { assetName: string; format: 'glb' | 'gltf' }
): Promise<ParsedObjectMetadata> {
  const io = new NodeIO();
  const document = await io.readBinary(new Uint8Array(bytes));
  return buildMetadataFromDocument(document, options);
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
