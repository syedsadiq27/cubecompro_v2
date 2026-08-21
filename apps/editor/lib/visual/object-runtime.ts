import type * as THREE from 'three';
import type { VisualBaseline } from './types';

export type AssetRuntimeSource = {
  objectAssetRevisionId: string;
  template: THREE.Object3D;
};

/**
 * Runtime-only identity. Never persist.
 */
export type ObjectRuntimeInstance = {
  runtimeInstanceId: string;
  objectAssetRevisionId: string;
  compositionSlotKey: string;
  object3D: THREE.Object3D;
  baseline: VisualBaseline;
};

export type StructuralSlotBaseline = {
  compositionSlotKey: string;
  parent: THREE.Object3D;
  childIndex: number;
  /** Immutable restore template — never mount this object. */
  template: THREE.Object3D;
};

let runtimeInstanceSeq = 0;

function nextRuntimeInstanceId(): string {
  runtimeInstanceSeq += 1;
  return `ori_${runtimeInstanceSeq}`;
}

/**
 * Cache immutable object sources; instantiate independent runtime instances.
 * How instantiate copies the template is renderer-private.
 */
export class ObjectRuntimeRegistry {
  private readonly sources = new Map<string, AssetRuntimeSource>();

  hasSource(objectAssetRevisionId: string): boolean {
    return this.sources.has(objectAssetRevisionId);
  }

  registerSource(
    objectAssetRevisionId: string,
    template: THREE.Object3D
  ): AssetRuntimeSource {
    const existing = this.sources.get(objectAssetRevisionId);
    if (existing) return existing;
    const source: AssetRuntimeSource = {
      objectAssetRevisionId,
      template,
    };
    this.sources.set(objectAssetRevisionId, source);
    return source;
  }

  getSource(objectAssetRevisionId: string): AssetRuntimeSource | undefined {
    return this.sources.get(objectAssetRevisionId);
  }

  /**
   * Produce an independent ObjectRuntimeInstance from a cached source.
   * Must not reparent or return the cached template.
   */
  instantiate(
    objectAssetRevisionId: string,
    compositionSlotKey: string
  ): ObjectRuntimeInstance {
    const source = this.sources.get(objectAssetRevisionId);
    if (!source) {
      throw new Error(
        `Missing AssetRuntimeSource for objectAssetRevisionId ${objectAssetRevisionId}`
      );
    }
    const object3D = source.template.clone(true);
    object3D.name = source.template.name || object3D.name;
    const runtimeInstanceId = nextRuntimeInstanceId();
    object3D.userData.objectAssetRevisionId = objectAssetRevisionId;
    object3D.userData.runtimeInstanceId = runtimeInstanceId;
    object3D.userData.compositionSlotKey = compositionSlotKey;
    return {
      runtimeInstanceId,
      objectAssetRevisionId,
      compositionSlotKey,
      object3D,
      baseline: {},
    };
  }

  clear(): void {
    this.sources.clear();
  }
}

export function instantiateStructuralBaseline(
  baseline: StructuralSlotBaseline
): THREE.Object3D {
  return baseline.template.clone(true);
}
