import {
  isSetMaterialValue,
  parseSetMaterialValue,
} from '../materials/materials.js';
import {
  isReplaceComponentValue,
  parseReplaceComponentValue,
} from './replace-component.js';
import type {
  GraphDetail,
  GraphModel,
  GraphTarget,
  GraphVisualEffect,
} from '../graph/types.js';

export type VisualMappingAssetRef = {
  name: string;
  version?: number | null;
};

export type VisualMappingLibraryAsset = {
  id: string;
  name: string;
  currentRevisionId?: string | null;
  version?: number | null;
};

export type VisualMappingCatalog = {
  materialsByRevisionId: ReadonlyMap<string, VisualMappingAssetRef>;
  objectsByRevisionId: ReadonlyMap<string, VisualMappingAssetRef>;
};

export type VisualMappingTarget = {
  id: string;
  name: string;
};

export type VisualMappingOperation =
  | 'SET_MATERIAL'
  | 'SET_VISIBILITY'
  | 'REPLACE_COMPONENT';

export type VisualMappingEffectGroup = {
  operation: string;
  resourceKind: 'material' | 'object' | 'visibility' | 'other';
  resourceLabel: string | null;
  resultLabel: string | null;
  resourceId: string | null;
  materialAssetRevisionId: string | null;
  effectIds: string[];
  targets: VisualMappingTarget[];
  compactSummary: string;
};

export type VisualMappingSimpleMaterial = {
  eligible: boolean;
  targetId: string | null;
  effectId: string | null;
  materialAssetRevisionId: string | null;
};

export type VisualMappingSimpleBind = {
  eligible: boolean;
  operation: VisualMappingOperation | null;
  targetId: string | null;
  effectId: string | null;
  resourceId: string | null;
};

export type VisualMappingBatch = {
  eligible: boolean;
  operation: VisualMappingOperation;
  sharedTargetId: string | null;
};

export type VisualMappingResourceOption = {
  id: string;
  label: string;
};

export type VisualMappingValue = {
  id: string;
  key: string;
  name: string;
  unbound: boolean;
  effectCount: number;
  groups: VisualMappingEffectGroup[];
  compactSummary: string;
  simpleBind: VisualMappingSimpleBind;
  simpleMaterial: VisualMappingSimpleMaterial;
};

export type VisualMappingChoice = {
  id: string;
  key: string;
  name: string;
  valueCount: number;
  mappedCount: number;
  unboundCount: number;
  coverageLabel: string;
  batch: VisualMappingBatch;
  simpleMaterial: {
    eligible: boolean;
    sharedTargetId: string | null;
  };
  values: VisualMappingValue[];
};

const OPERATION_ORDER = [
  'REPLACE_COMPONENT',
  'SET_MATERIAL',
  'SET_VISIBILITY',
];

export function humanizeVisualKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatAssetRevisionLabel(
  ref: VisualMappingAssetRef
): string {
  const name = ref.name.trim() || 'Untitled';
  if (typeof ref.version === 'number' && Number.isFinite(ref.version)) {
    return `${name} · v${ref.version}`;
  }
  return name;
}

export function mappingTargetLabel(target: GraphTarget): string {
  const fromKey = humanizeVisualKey(target.key);
  if (fromKey) return fromKey;
  const fromSlot = target.materialSlot
    ? humanizeVisualKey(target.materialSlot)
    : '';
  return fromSlot || 'Target';
}

export function buildVisualMappingCatalog(input: {
  materialAssets?: VisualMappingLibraryAsset[];
  objectAssets?: VisualMappingLibraryAsset[];
}): VisualMappingCatalog {
  return {
    materialsByRevisionId: indexLibraryAssets(input.materialAssets ?? []),
    objectsByRevisionId: indexLibraryAssets(input.objectAssets ?? []),
  };
}

export function buildVisualMappingChoices(
  detail: GraphDetail | null,
  catalog: VisualMappingCatalog = {
    materialsByRevisionId: new Map(),
    objectsByRevisionId: new Map(),
  }
): VisualMappingChoice[] {
  if (!detail) return [];

  const targetById = new Map<string, GraphTarget>();
  for (const model of detail.models) {
    for (const target of model.targets ?? []) {
      targetById.set(target.id, target);
    }
  }

  const effectsByValueId = new Map<string, GraphVisualEffect[]>();
  for (const effect of detail.visualEffects) {
    const list = effectsByValueId.get(effect.choiceValueId) ?? [];
    list.push(effect);
    effectsByValueId.set(effect.choiceValueId, list);
  }

  return [...detail.choices]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((choice) => {
      const values = [...choice.values]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((value) => {
          const effects = effectsByValueId.get(value.id) ?? [];
          const groups = groupEffects(effects, {
            targetById,
            models: detail.models,
            catalog,
          });
          const unbound = groups.length === 0;
          const simpleBind = simpleBindForGroups(groups);
          const simpleMaterial = toSimpleMaterial(simpleBind);
          return {
            id: value.id,
            key: value.key,
            name: value.name.trim() || humanizeVisualKey(value.key),
            unbound,
            effectCount: groups.length,
            groups,
            compactSummary: unbound
              ? 'UNBOUND'
              : groups[0] && groups.length === 1
                ? groups[0].compactSummary
                : `${groups.length} effects`,
            simpleBind,
            simpleMaterial,
          };
        });

      const mappedCount = values.filter((value) => !value.unbound).length;
      const unboundCount = values.length - mappedCount;
      const batch = buildBatch(values);
      const mappedTargets = [
        ...new Set(
          values
            .map((value) => value.simpleMaterial.targetId)
            .filter((id): id is string => Boolean(id))
        ),
      ];
      return {
        id: choice.id,
        key: choice.key,
        name: choice.name.trim() || humanizeVisualKey(choice.key),
        valueCount: values.length,
        mappedCount,
        unboundCount,
        coverageLabel: coverageLabel(values.length, mappedCount, unboundCount),
        batch,
        simpleMaterial: {
          eligible:
            values.every((value) => value.simpleMaterial.eligible) &&
            mappedTargets.length <= 1,
          sharedTargetId: mappedTargets[0] ?? null,
        },
        values,
      };
    });
}

function indexLibraryAssets(
  assets: VisualMappingLibraryAsset[]
): Map<string, VisualMappingAssetRef> {
  const indexed = new Map<string, VisualMappingAssetRef>();
  for (const asset of assets) {
    const ref: VisualMappingAssetRef = {
      name: asset.name,
      version: asset.version ?? null,
    };
    indexed.set(asset.id, ref);
    if (asset.currentRevisionId) {
      indexed.set(asset.currentRevisionId, ref);
    }
  }
  return indexed;
}

export function listSetMaterialTargets(
  detail: GraphDetail | null
): VisualMappingTarget[] {
  return listMappingTargets(detail, 'SET_MATERIAL');
}

export function listMappingTargets(
  detail: GraphDetail | null,
  operation: VisualMappingOperation
): VisualMappingTarget[] {
  if (!detail) return [];
  const targets = detail.models.flatMap((model) => model.targets ?? []);
  const wanted =
    operation === 'SET_MATERIAL'
      ? 'MATERIAL'
      : operation === 'SET_VISIBILITY'
        ? 'VISIBILITY'
        : 'OBJECT';
  const matched = targets.filter(
    (target) => target.targetType.toUpperCase() === wanted
  );
  const usable =
    matched.length > 0
      ? matched
      : operation === 'SET_MATERIAL'
        ? targets.filter(
            (target) => target.targetType.toUpperCase() !== 'VISIBILITY'
          )
        : [];
  return usable.map((target) => ({
    id: target.id,
    name: mappingTargetLabel(target),
  }));
}

export function listLinkedObjectResources(
  detail: GraphDetail | null,
  catalog: VisualMappingCatalog
): VisualMappingResourceOption[] {
  if (!detail) return [];
  const seen = new Set<string>();
  const rows: VisualMappingResourceOption[] = [];
  for (const model of detail.models) {
    for (const link of model.linkedAssets ?? []) {
      if (link.role.toUpperCase() !== 'OBJECT') continue;
      if (link.key === 'root') continue;
      if (seen.has(link.key)) continue;
      seen.add(link.key);
      const ref = catalog.objectsByRevisionId.get(link.assetRevisionId);
      rows.push({
        id: link.key,
        label: ref
          ? formatAssetRevisionLabel(ref)
          : humanizeVisualKey(link.key),
      });
    }
  }
  return rows;
}

function simpleBindForGroups(
  groups: VisualMappingEffectGroup[]
): VisualMappingSimpleBind {
  if (groups.length === 0) {
    return {
      eligible: true,
      operation: null,
      targetId: null,
      effectId: null,
      resourceId: null,
    };
  }
  const group = groups[0];
  if (!group) {
    return {
      eligible: true,
      operation: null,
      targetId: null,
      effectId: null,
      resourceId: null,
    };
  }
  const operation = asBatchOperation(group.operation);
  const eligible =
    Boolean(operation) &&
    groups.length === 1 &&
    group.targets.length <= 1;
  if (!eligible || !operation) {
    return {
      eligible: false,
      operation: null,
      targetId: null,
      effectId: null,
      resourceId: null,
    };
  }
  return {
    eligible: true,
    operation,
    targetId: group.targets[0]?.id ?? null,
    effectId: group.effectIds[0] ?? null,
    resourceId: group.resourceId,
  };
}

function toSimpleMaterial(
  bind: VisualMappingSimpleBind
): VisualMappingSimpleMaterial {
  const eligible =
    bind.eligible &&
    (bind.operation === null || bind.operation === 'SET_MATERIAL');
  return {
    eligible,
    targetId: eligible ? bind.targetId : null,
    effectId: eligible ? bind.effectId : null,
    materialAssetRevisionId:
      eligible && bind.operation === 'SET_MATERIAL' ? bind.resourceId : null,
  };
}

function buildBatch(values: VisualMappingValue[]): VisualMappingBatch {
  const binds = values.map((value) => value.simpleBind);
  const operations = [
    ...new Set(
      binds
        .map((bind) => bind.operation)
        .filter((operation): operation is VisualMappingOperation =>
          Boolean(operation)
        )
    ),
  ];
  const targets = [
    ...new Set(
      binds
        .map((bind) => bind.targetId)
        .filter((id): id is string => Boolean(id))
    ),
  ];
  return {
    eligible:
      binds.every((bind) => bind.eligible) && operations.length <= 1,
    operation: operations[0] ?? 'SET_MATERIAL',
    sharedTargetId: targets[0] ?? null,
  };
}

function asBatchOperation(operation: string): VisualMappingOperation | null {
  if (
    operation === 'SET_MATERIAL' ||
    operation === 'SET_VISIBILITY' ||
    operation === 'REPLACE_COMPONENT'
  ) {
    return operation;
  }
  return null;
}

function coverageLabel(
  valueCount: number,
  mappedCount: number,
  unboundCount: number
): string {
  const values = `${valueCount} ${valueCount === 1 ? 'value' : 'values'}`;
  const mapped = `${mappedCount} mapped`;
  if (unboundCount > 0) {
    return `${values} · ${mapped} · ${unboundCount} unbound`;
  }
  return `${values} · ${mapped}`;
}

function parseEffectValue(valueJson: string): unknown {
  try {
    return JSON.parse(valueJson) as unknown;
  } catch {
    return valueJson;
  }
}

function groupEffects(
  effects: GraphVisualEffect[],
  ctx: {
    targetById: Map<string, GraphTarget>;
    models: GraphModel[];
    catalog: VisualMappingCatalog;
  }
): VisualMappingEffectGroup[] {
  const groups = new Map<
    string,
    {
      sort: number;
      group: VisualMappingEffectGroup;
      seenTargets: Set<string>;
    }
  >();

  for (const effect of effects) {
    const operation = effect.operation.trim().toUpperCase();
    const parsed = parseEffectValue(effect.valueJson);
    const classified = classifyEffect(operation, parsed, ctx);
    const target = ctx.targetById.get(effect.modelTargetId);
    const mappingTarget: VisualMappingTarget | null = target
      ? { id: target.id, name: mappingTargetLabel(target) }
      : null;
    const existing = groups.get(classified.key);
    if (existing) {
      existing.group.effectIds.push(effect.id);
      if (mappingTarget && !existing.seenTargets.has(mappingTarget.id)) {
        existing.seenTargets.add(mappingTarget.id);
        existing.group.targets.push(mappingTarget);
        existing.group.compactSummary = compactGroupSummary(existing.group);
      }
      continue;
    }

    const group: VisualMappingEffectGroup = {
      operation,
      resourceKind: classified.resourceKind,
      resourceLabel: classified.resourceLabel,
      resultLabel: classified.resultLabel,
      resourceId: classified.resourceId,
      materialAssetRevisionId: classified.materialAssetRevisionId,
      effectIds: [effect.id],
      targets: mappingTarget ? [mappingTarget] : [],
      compactSummary: '',
    };
    group.compactSummary = compactGroupSummary(group);
    groups.set(classified.key, {
      sort: operationSort(operation),
      group,
      seenTargets: new Set(mappingTarget ? [mappingTarget.id] : []),
    });
  }

  return [...groups.values()]
    .sort(
      (a, b) =>
        a.sort - b.sort || a.group.operation.localeCompare(b.group.operation)
    )
    .map((entry) => entry.group);
}

function classifyEffect(
  operation: string,
  parsed: unknown,
  ctx: {
    models: GraphModel[];
    catalog: VisualMappingCatalog;
  }
): {
  key: string;
  resourceKind: VisualMappingEffectGroup['resourceKind'];
  resourceLabel: string | null;
  resultLabel: string | null;
  resourceId: string | null;
  materialAssetRevisionId: string | null;
} {
  if (operation === 'SET_MATERIAL' && isSetMaterialValue(parsed)) {
    const value = parseSetMaterialValue(parsed);
    const ref = ctx.catalog.materialsByRevisionId.get(
      value.materialAssetRevisionId
    );
    return {
      key: `${operation}:${value.materialAssetRevisionId}`,
      resourceKind: 'material',
      resourceLabel: ref
        ? formatAssetRevisionLabel(ref)
        : 'Library material',
      resultLabel: null,
      resourceId: value.materialAssetRevisionId,
      materialAssetRevisionId: value.materialAssetRevisionId,
    };
  }

  if (operation === 'REPLACE_COMPONENT' && isReplaceComponentValue(parsed)) {
    const value = parseReplaceComponentValue(parsed);
    const revisionId = findLinkedObjectRevisionId(ctx.models, value.linkedAssetKey);
    const ref = revisionId
      ? ctx.catalog.objectsByRevisionId.get(revisionId)
      : undefined;
    return {
      key: `${operation}:${value.linkedAssetKey}:${value.role}`,
      resourceKind: 'object',
      resourceLabel: ref
        ? formatAssetRevisionLabel(ref)
        : humanizeVisualKey(value.linkedAssetKey),
      resultLabel: null,
      resourceId: value.linkedAssetKey,
      materialAssetRevisionId: null,
    };
  }

  if (operation === 'SET_VISIBILITY' && typeof parsed === 'boolean') {
    return {
      key: `${operation}:${parsed ? 'visible' : 'hidden'}`,
      resourceKind: 'visibility',
      resourceLabel: null,
      resultLabel: parsed ? 'Visible' : 'Hidden',
      resourceId: parsed ? 'true' : 'false',
      materialAssetRevisionId: null,
    };
  }

  return {
    key: `${operation}:${stableUnknownKey(parsed)}`,
    resourceKind: 'other',
    resourceLabel: unknownResourceLabel(parsed),
    resultLabel: null,
    resourceId: null,
    materialAssetRevisionId: null,
  };
}

function findLinkedObjectRevisionId(
  models: GraphModel[],
  linkedAssetKey: string
): string | null {
  for (const model of models) {
    const link = (model.linkedAssets ?? []).find(
      (asset) =>
        asset.role === 'OBJECT' && asset.key === linkedAssetKey
    );
    if (link) return link.assetRevisionId;
  }
  return null;
}

function compactGroupSummary(group: VisualMappingEffectGroup): string {
  const parts = [group.operation];
  if (group.resourceLabel) parts.push(group.resourceLabel);
  if (group.resultLabel) parts.push(group.resultLabel);
  if (group.targets.length === 1 && group.targets[0]) {
    parts.push(group.targets[0].name);
  } else if (group.targets.length > 1) {
    parts.push(`${group.targets.length} targets`);
  }
  return parts.join(' · ');
}

function operationSort(operation: string): number {
  const index = OPERATION_ORDER.indexOf(operation);
  return index === -1 ? OPERATION_ORDER.length : index;
}

function stableUnknownKey(parsed: unknown): string {
  if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
    return String(parsed);
  }
  try {
    return JSON.stringify(parsed);
  } catch {
    return 'unknown';
  }
}

function unknownResourceLabel(parsed: unknown): string | null {
  if (typeof parsed === 'boolean') return parsed ? 'Visible' : 'Hidden';
  if (typeof parsed === 'string' || typeof parsed === 'number') {
    return String(parsed);
  }
  return null;
}
