import type { GraphDetail } from '@repo/product-graph';
import type { MaterialAssetOption, ObjectAssetOption } from '@/lib/product-workspace';
import { countValues } from '@/lib/product-workspace';

export type PublishDependencyAction =
  | 'publish'
  | 'freeze'
  | 'advance_tip'
  | 'include'
  | 'missing'
  | 'blocked';

export type PublishDependencyNode = {
  id: string;
  kind:
    | 'product'
    | 'options'
    | 'rules'
    | 'variants'
    | 'commerce'
    | 'model'
    | 'object_revision'
    | 'material'
    | 'mappings';
  label: string;
  detail?: string;
  action: PublishDependencyAction;
  children?: PublishDependencyNode[];
};

export type PublishDependencyGraph = {
  root: PublishDependencyNode;
  blockers: string[];
  tipAdvances: number;
};

function actionLabel(action: PublishDependencyAction): string {
  switch (action) {
    case 'publish':
      return 'Will publish';
    case 'freeze':
      return 'Will freeze pin';
    case 'advance_tip':
      return 'Will advance to tip';
    case 'include':
      return 'Included';
    case 'missing':
      return 'Missing';
    case 'blocked':
      return 'Blocked';
  }
}

export { actionLabel as publishDependencyActionLabel };

export function buildPublishDependencyGraph(input: {
  productName: string;
  detail: GraphDetail;
  objectAssets: ObjectAssetOption[];
  materialAssets: MaterialAssetOption[];
}): PublishDependencyGraph {
  const { productName, detail, objectAssets, materialAssets } = input;
  const blockers: string[] = [];
  let tipAdvances = 0;

  const assetById = new Map(objectAssets.map((asset) => [asset.id, asset]));
  const materialById = new Map(
    materialAssets.map((material) => [material.id, material])
  );

  const optionCount = detail.choices.length;
  const valueCount = countValues(detail);
  const constraintCount = detail.constraints?.length ?? 0;
  const ruleCount = detail.rules?.length ?? 0;
  const variantCount = detail.variants.length;
  const commerceCount = detail.commerceMappingSets?.length ?? 0;
  const mappingCount = detail.visualEffects.length;

  const modelNodes: PublishDependencyNode[] = detail.models.map((model) => {
    const asset = assetById.get(model.assetId);
    const tipId = asset?.currentRevisionId ?? null;
    const status = (asset?.status || 'READY').toUpperCase();
    const willAdvance = Boolean(tipId && tipId !== model.objectAssetRevisionId);

    if (!asset) {
      blockers.push(`Model “${model.name}” references a missing library object`);
    } else if (status === 'FAILED') {
      blockers.push(`Library object “${asset.name}” is FAILED`);
    } else if (status === 'PROCESSING') {
      blockers.push(`Library object “${asset.name}” is still PROCESSING`);
    } else if (!tipId) {
      blockers.push(`Library object “${asset.name}” has no tip revision`);
    }

    if (willAdvance) tipAdvances += 1;

    const revisionAction: PublishDependencyAction = !asset
      ? 'missing'
      : status === 'FAILED' || status === 'PROCESSING'
        ? 'blocked'
        : willAdvance
          ? 'advance_tip'
          : 'freeze';

    return {
      id: `model:${model.id}`,
      kind: 'model',
      label: model.name || model.key,
      detail: asset
        ? `Library · ${asset.name}`
        : `Missing library object ${model.assetId}`,
      action: revisionAction === 'missing' || revisionAction === 'blocked'
        ? revisionAction
        : 'include',
      children: [
        {
          id: `revision:${model.id}`,
          kind: 'object_revision',
          label: willAdvance
            ? 'Object revision pin → library tip'
            : 'Object revision pin',
          detail: willAdvance
            ? `Pinned ${model.objectAssetRevisionId.slice(0, 10)}… → tip ${tipId?.slice(0, 10)}…`
            : `Freeze ${model.objectAssetRevisionId.slice(0, 12)}…`,
          action: revisionAction,
        },
      ],
    };
  });

  if (detail.models.length === 0) {
    blockers.push('No 3D model attached to this draft');
  }

  const materialIds = new Set<string>();
  for (const effect of detail.visualEffects) {
    try {
      const value = JSON.parse(effect.valueJson) as { materialAssetId?: string };
      if (value.materialAssetId) materialIds.add(value.materialAssetId);
    } catch {
      /* ignore */
    }
  }

  const materialNodes: PublishDependencyNode[] = [...materialIds].map((id) => {
    const material = materialById.get(id);
    if (!material) {
      blockers.push(`Visual mapping references missing material ${id}`);
      return {
        id: `material:${id}`,
        kind: 'material' as const,
        label: 'Unknown material',
        detail: id,
        action: 'missing' as const,
      };
    }
    return {
      id: `material:${id}`,
      kind: 'material' as const,
      label: material.name,
      detail: material.code || id.slice(0, 12),
      action: 'include' as const,
    };
  });

  const children: PublishDependencyNode[] = [
    {
      id: 'options',
      kind: 'options',
      label: 'Options graph',
      detail: `${optionCount} options · ${valueCount} values`,
      action: optionCount > 0 ? 'include' : 'missing',
    },
    {
      id: 'rules',
      kind: 'rules',
      label: 'Rules & constraints',
      detail: `${constraintCount} constraints · ${ruleCount} legacy rules`,
      action: 'include',
    },
    {
      id: 'variants',
      kind: 'variants',
      label: 'Variants',
      detail: `${variantCount} variant row${variantCount === 1 ? '' : 's'}`,
      action: 'include',
    },
    {
      id: 'commerce',
      kind: 'commerce',
      label: 'Commerce mappings',
      detail:
        commerceCount > 0
          ? `${commerceCount} mapping set${commerceCount === 1 ? '' : 's'}`
          : 'None on this draft',
      action: 'include',
    },
    {
      id: 'mappings',
      kind: 'mappings',
      label: 'Visual mappings',
      detail: `${mappingCount} effect${mappingCount === 1 ? '' : 's'}`,
      action: 'include',
      children: materialNodes.length > 0 ? materialNodes : undefined,
    },
    {
      id: 'models',
      kind: 'model',
      label: '3D models & asset pins',
      detail:
        detail.models.length === 0
          ? 'No model attached'
          : `${detail.models.length} model${detail.models.length === 1 ? '' : 's'}`,
      action: detail.models.length === 0 ? 'missing' : 'include',
      children: modelNodes,
    },
  ];

  if (optionCount === 0) {
    blockers.push('No options defined on this draft');
  }

  return {
    root: {
      id: 'product',
      kind: 'product',
      label: productName,
      detail: `Draft v${detail.version} → PUBLISHED`,
      action: blockers.length > 0 ? 'blocked' : 'publish',
      children,
    },
    blockers,
    tipAdvances,
  };
}
