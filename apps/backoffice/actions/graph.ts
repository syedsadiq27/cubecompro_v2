'use server';

import { revalidatePath } from 'next/cache';
import { graphRequest } from '@repo/product-graph';
import {
  CREATE_ATTRIBUTE_VALUE_MUTATION,
  CREATE_CONFIGURATION_RULE_MUTATION,
  CREATE_CONSTRAINT_MUTATION,
  CREATE_DRAFT_GRAPH_VERSION_MUTATION,
  CREATE_MODEL_TARGET_MUTATION,
  CREATE_PRODUCT_ATTRIBUTE_MUTATION,
  CREATE_PRODUCT_MODEL_MUTATION,
  CREATE_PRODUCT_VARIANT_MUTATION,
  CREATE_VARIANT_SELECTION_MUTATION,
  CREATE_VISUAL_EFFECT_MUTATION,
  DELETE_CONSTRAINT_MUTATION,
  DELETE_VISUAL_EFFECT_MUTATION,
  DISCARD_DRAFT_GRAPH_VERSION_MUTATION,
  PUBLISH_GRAPH_VERSION_MUTATION,
  UPDATE_PRODUCT_MODEL_REVISION_MUTATION,
  UPDATE_VISUAL_EFFECT_MUTATION,
  replaceComponentValueJson,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export type GraphMutationResult = {
  ok: boolean;
  error?: string;
  id?: string;
};

async function withProject(
  projectId: string,
  run: (token: string) => Promise<GraphMutationResult>
): Promise<GraphMutationResult> {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Project session missing.' };
  }
  try {
    return await run(project.projectToken);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Request failed.',
    };
  }
}

function revalidateProduct(projectId: string, productId: string) {
  revalidatePath(`/${projectId}/products/${productId}`);
  revalidatePath(`/${projectId}/products/${productId}/edit`);
  revalidatePath(`/${projectId}/products`);
}

export async function createDraftGraphVersionAction(
  projectId: string,
  productId: string,
  sourceProductRevisionId?: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createDraftProductRevision: { id: string };
    }>(
      CREATE_DRAFT_GRAPH_VERSION_MUTATION,
      {
        productId,
        ...(sourceProductRevisionId ? { sourceProductRevisionId } : {}),
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createDraftProductRevision.id };
  });
}

export async function discardDraftGraphVersionAction(
  projectId: string,
  productId: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    await graphRequest(
      DISCARD_DRAFT_GRAPH_VERSION_MUTATION,
      { productId },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true };
  });
}

export async function recreateDraftFromVersionAction(
  projectId: string,
  productId: string,
  sourceProductRevisionId: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    try {
      await graphRequest(
        DISCARD_DRAFT_GRAPH_VERSION_MUTATION,
        { productId },
        token
      );
    } catch {
      // no draft to discard
    }
    const data = await graphRequest<{
      createDraftProductRevision: { id: string };
    }>(
      CREATE_DRAFT_GRAPH_VERSION_MUTATION,
      { productId, sourceProductRevisionId },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createDraftProductRevision.id };
  });
}

export async function publishGraphVersionByIdAction(
  projectId: string,
  productId: string,
  graphVersionId: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    await graphRequest(
      PUBLISH_GRAPH_VERSION_MUTATION,
      { id: graphVersionId },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true };
  });
}

export async function createAttributeAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createChoice: { id: string };
    }>(
      CREATE_PRODUCT_ATTRIBUTE_MUTATION,
      {
        input: {
          productRevisionId: String(
            formData.get('productRevisionId') ??
              formData.get('graphVersionId') ??
              ''
          ),
          key: String(formData.get('key') ?? '').trim(),
          name: String(formData.get('name') ?? '').trim(),
          type: 'SELECT',
          required: formData.get('required') === 'on',
          sortOrder: Number(formData.get('sortOrder') ?? 0),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createChoice.id };
  });
}

export async function createAttributeValueAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createChoiceValue: { id: string };
    }>(
      CREATE_ATTRIBUTE_VALUE_MUTATION,
      {
        input: {
          choiceId: String(
            formData.get('choiceId') ?? formData.get('attributeId') ?? ''
          ),
          key: String(formData.get('key') ?? '').trim(),
          name: String(formData.get('name') ?? '').trim(),
          sortOrder: Number(formData.get('sortOrder') ?? 0),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createChoiceValue.id };
  });
}

export async function createRuleAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const whenAttr = String(formData.get('whenAttr') ?? '').trim();
    const whenEq = String(formData.get('whenEq') ?? '').trim();
    const effectKind = String(formData.get('effectKind') ?? 'forbid');
    const effectAttr = String(formData.get('effectAttr') ?? '').trim();
    const effectEq = String(formData.get('effectEq') ?? '').trim();

    const condition = { all: [{ attr: whenAttr, eq: whenEq }] };
    const effect =
      effectKind === 'require'
        ? { require: { attr: effectAttr, eq: effectEq } }
        : { forbid: { attr: effectAttr, eq: effectEq } };

    const data = await graphRequest<{
      createConfigurationRule: { id: string };
    }>(
      CREATE_CONFIGURATION_RULE_MUTATION,
      {
        input: {
          productRevisionId: String(
            formData.get('productRevisionId') ??
              formData.get('graphVersionId') ??
              ''
          ),
          conditionJson: JSON.stringify(condition),
          effectJson: JSON.stringify(effect),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createConfigurationRule.id };
  });
}

export async function createConstraintAction(
  projectId: string,
  productId: string,
  input: { productRevisionId: string; choiceValueIds: string[] }
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createConstraint: { id: string };
    }>(
      CREATE_CONSTRAINT_MUTATION,
      {
        input: {
          productRevisionId: input.productRevisionId,
          choiceValueIds: input.choiceValueIds,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createConstraint.id };
  });
}

export async function deleteConstraintAction(
  projectId: string,
  productId: string,
  constraintId: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    await graphRequest<{ deleteConstraint: boolean }>(
      DELETE_CONSTRAINT_MUTATION,
      { id: constraintId },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true };
  });
}

export async function createProductModelAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createProductModel: { id: string };
    }>(
      CREATE_PRODUCT_MODEL_MUTATION,
      {
        input: {
          productRevisionId: String(
            formData.get('productRevisionId') ??
              formData.get('graphVersionId') ??
              ''
          ),
          assetId: String(formData.get('assetId') ?? ''),
          key: String(formData.get('key') ?? '').trim(),
          name: String(formData.get('name') ?? '').trim(),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createProductModel.id };
  });
}

export async function updateProductModelRevisionAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const assetId = String(formData.get('assetId') ?? '').trim();
    const objectAssetRevisionId = String(
      formData.get('objectAssetRevisionId') ?? ''
    ).trim();
    const data = await graphRequest<{
      updateProductModelRevision: { id: string };
    }>(
      UPDATE_PRODUCT_MODEL_REVISION_MUTATION,
      {
        input: {
          productModelId: String(formData.get('productModelId') ?? ''),
          ...(objectAssetRevisionId
            ? { objectAssetRevisionId }
            : { assetId }),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    revalidatePath(`/${projectId}/products/${productId}/studio`);
    return { ok: true, id: data.updateProductModelRevision.id };
  });
}

export async function createModelTargetAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createModelTarget: { id: string };
    }>(
      CREATE_MODEL_TARGET_MUTATION,
      {
        input: {
          productModelId: String(formData.get('productModelId') ?? ''),
          key: String(formData.get('key') ?? '').trim(),
          targetType: String(formData.get('targetType') ?? 'VISIBILITY').trim(),
          nodePath: String(formData.get('nodePath') ?? '').trim() || undefined,
          materialSlot:
            String(formData.get('materialSlot') ?? '').trim() || undefined,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createModelTarget.id };
  });
}

function encodeVisualEffectValue(formData: FormData): {
  ok: true;
  operation: string;
  valueJson: string;
} | {
  ok: false;
  error: string;
} {
  const operation = String(formData.get('operation') ?? 'SET_MATERIAL');
  const rawValue = String(formData.get('value') ?? '').trim();
  if (operation === 'SET_VISIBILITY') {
    const visible =
      rawValue === 'true' || rawValue === 'Show' || rawValue === 'Visible';
    return { ok: true, operation, valueJson: JSON.stringify(visible) };
  }
  if (operation === 'SET_MATERIAL') {
    const materialAssetRevisionId = String(
      formData.get('materialAssetRevisionId') ?? rawValue
    ).trim();
    if (!materialAssetRevisionId) {
      return { ok: false, error: 'materialAssetRevisionId is required.' };
    }
    return {
      ok: true,
      operation,
      valueJson: JSON.stringify({ materialAssetRevisionId }),
    };
  }
  if (operation === 'REPLACE_COMPONENT') {
    const linkedAssetKey = String(
      formData.get('linkedAssetKey') ?? rawValue
    ).trim();
    if (!linkedAssetKey) {
      return { ok: false, error: 'linkedAssetKey is required.' };
    }
    return {
      ok: true,
      operation,
      valueJson: replaceComponentValueJson(linkedAssetKey),
    };
  }
  let valueJson = rawValue;
  try {
    JSON.parse(rawValue);
  } catch {
    valueJson = JSON.stringify(rawValue);
  }
  return { ok: true, operation, valueJson };
}

export async function createVisualEffectAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const encoded = encodeVisualEffectValue(formData);
    if (!encoded.ok) return encoded;

    const data = await graphRequest<{
      createVisualEffect: { id: string };
    }>(
      CREATE_VISUAL_EFFECT_MUTATION,
      {
        input: {
          choiceValueId: String(
            formData.get('choiceValueId') ??
              formData.get('attributeValueId') ??
              ''
          ),
          modelTargetId: String(formData.get('modelTargetId') ?? ''),
          operation: encoded.operation,
          valueJson: encoded.valueJson,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createVisualEffect.id };
  });
}

export async function updateVisualEffectAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const encoded = encodeVisualEffectValue(formData);
    if (!encoded.ok) return encoded;

    const data = await graphRequest<{
      updateVisualEffect: { id: string };
    }>(
      UPDATE_VISUAL_EFFECT_MUTATION,
      {
        input: {
          id: String(formData.get('id') ?? ''),
          operation: encoded.operation,
          valueJson: encoded.valueJson,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.updateVisualEffect.id };
  });
}

export async function deleteVisualEffectAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const id = String(formData.get('id') ?? '');
    if (!id) {
      return { ok: false, error: 'Visual effect id is required.' };
    }
    await graphRequest<{ deleteVisualEffect: boolean }>(
      DELETE_VISUAL_EFFECT_MUTATION,
      { id },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id };
  });
}

export async function createVariantAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createProductVariant: { id: string };
    }>(
      CREATE_PRODUCT_VARIANT_MUTATION,
      {
        input: {
          productRevisionId: String(
            formData.get('productRevisionId') ??
              formData.get('graphVersionId') ??
              ''
          ),
          provider: String(formData.get('provider') ?? 'generic').trim(),
          externalId: String(formData.get('externalId') ?? '').trim(),
          sku: String(formData.get('sku') ?? '').trim() || undefined,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createProductVariant.id };
  });
}

export async function createVariantSelectionAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createVariantSelection: { id: string };
    }>(
      CREATE_VARIANT_SELECTION_MUTATION,
      {
        input: {
          variantId: String(formData.get('variantId') ?? ''),
          choiceId: String(
            formData.get('choiceId') ?? formData.get('attributeId') ?? ''
          ),
          choiceValueId: String(
            formData.get('choiceValueId') ??
              formData.get('attributeValueId') ??
              ''
          ),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createVariantSelection.id };
  });
}
