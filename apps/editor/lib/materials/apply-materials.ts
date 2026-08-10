import * as THREE from 'three';
import { createMaterialFromJson, ensureAoMapUvs } from './create-material';
import type {
  ObjectRule,
  ParsedModelMaterials,
  TextureCatalogItem,
} from './types';

function applyTransform(
  object: THREE.Object3D,
  transform?: { elements?: number[] }
): void {
  if (!transform?.elements || transform.elements.length < 16) return;
  const matrix = new THREE.Matrix4().fromArray(transform.elements);
  matrix.decompose(object.position, object.quaternion, object.scale);
}

export async function applyConfigMaterialsToObject(
  object: THREE.Object3D,
  objectId: string,
  parsed: ParsedModelMaterials,
  texturesById: Map<number, TextureCatalogItem>,
  materialCache: Map<string, THREE.Material>
): Promise<THREE.Group> {
  const rule: ObjectRule = parsed.rules[objectId] ?? {};
  const group = new THREE.Group();
  group.name = objectId;
  group.visible = object.visible;
  group.userData = { ...rule, objectId };

  while (object.children.length > 0) {
    group.add(object.children[0]!);
  }

  const childRules = rule.children ?? {};
  const tasks: Promise<void>[] = [];

  group.traverse((node) => {
    const nodeRule = childRules[node.name];
    if (nodeRule) {
      node.userData = { ...node.userData, ...nodeRule };
      if (parsed.version && nodeRule.editableTransform?.elements) {
        applyTransform(node, nodeRule.editableTransform);
      }
    }

    if (!(node instanceof THREE.Mesh)) return;

    const materialId = nodeRule?.material?.[0];
    if (!materialId) return;
    const materialJson = parsed.materials[materialId];
    if (!materialJson) return;

    tasks.push(
      createMaterialFromJson(materialJson, {
        version: parsed.version,
        texturesById,
        cache: materialCache,
      }).then((material) => {
        node.material = material;
        ensureAoMapUvs(node);
        node.userData = {
          ...node.userData,
          material: materialId,
          defualtColor:
            material instanceof THREE.MeshStandardMaterial
              ? material.color.getHexString()
              : undefined,
        };
      })
    );
  });

  await Promise.all(tasks);

  if (!parsed.version && rule.editableTransform?.elements) {
    applyTransform(group, rule.editableTransform);
  }

  return group;
}
