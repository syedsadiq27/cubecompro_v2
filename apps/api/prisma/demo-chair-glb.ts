import { Document, NodeIO } from '@gltf-transform/core';
import {
  buildMetadataFromDocument,
  type ParsedObjectMetadata,
} from '../src/library/parse-glb';

export async function buildDemoChairGlb(): Promise<Buffer> {
  const { bytes } = await buildDemoChairBundle();
  return bytes;
}

export async function buildDemoChairBundle(): Promise<{
  bytes: Buffer;
  metadata: ParsedObjectMetadata;
}> {
  const document = new Document();
  const buffer = document.createBuffer();
  const material = document
    .createMaterial('Wood')
    .setBaseColorFactor([0.55, 0.38, 0.22, 1]);

  const root = document.createNode('Chair');

  const parts: Array<{
    name: string;
    size: [number, number, number];
    y: number;
  }> = [
    { name: 'Seat', size: [1.2, 0.12, 1.1], y: 0.55 },
    { name: 'Backrest', size: [1.15, 1.0, 0.12], y: 1.15 },
    { name: 'LeftArm', size: [0.12, 0.35, 1.0], y: 0.75 },
    { name: 'RightArm', size: [0.12, 0.35, 1.0], y: 0.75 },
    { name: 'Legs', size: [1.1, 0.5, 1.0], y: 0.25 },
    { name: 'Frame', size: [1.25, 0.08, 1.15], y: 0.48 },
  ];

  for (const part of parts) {
    const [sx, sy, sz] = part.size;
    const positions = new Float32Array([
      -sx / 2,
      -sy / 2,
      sz / 2,
      sx / 2,
      -sy / 2,
      sz / 2,
      sx / 2,
      sy / 2,
      sz / 2,
      -sx / 2,
      sy / 2,
      sz / 2,
      -sx / 2,
      -sy / 2,
      -sz / 2,
      sx / 2,
      -sy / 2,
      -sz / 2,
      sx / 2,
      sy / 2,
      -sz / 2,
      -sx / 2,
      sy / 2,
      -sz / 2,
    ]);
    const indices = new Uint16Array([
      0, 1, 2, 0, 2, 3, 1, 5, 6, 1, 6, 2, 5, 4, 7, 5, 7, 6, 4, 0, 3, 4, 3, 7, 3,
      2, 6, 3, 6, 7, 4, 5, 1, 4, 1, 0,
    ]);

    const positionAccessor = document
      .createAccessor(`${part.name}_POSITION`)
      .setType('VEC3')
      .setArray(positions)
      .setBuffer(buffer);
    const indexAccessor = document
      .createAccessor(`${part.name}_INDICES`)
      .setType('SCALAR')
      .setArray(indices)
      .setBuffer(buffer);
    const prim = document
      .createPrimitive()
      .setAttribute('POSITION', positionAccessor)
      .setIndices(indexAccessor)
      .setMaterial(material);
    const mesh = document.createMesh(part.name).addPrimitive(prim);
    const node = document.createNode(part.name).setMesh(mesh).setTranslation([
      part.name === 'LeftArm' ? -0.66 : part.name === 'RightArm' ? 0.66 : 0,
      part.y,
      part.name === 'Backrest' ? -0.5 : 0,
    ]);
    root.addChild(node);
  }

  document.createScene('DemoChair').addChild(root);
  const io = new NodeIO();
  const bytes = Buffer.from(await io.writeBinary(document));
  const metadata = buildMetadataFromDocument(document, {
    assetName: 'Demo Chair',
    format: 'glb',
  });
  return { bytes, metadata };
}
