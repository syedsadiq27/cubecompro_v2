'use server';

import { revalidatePath } from 'next/cache';
import { graphRequest } from '@repo/product-graph';
import {
  CREATE_ATTRIBUTE_VALUE_MUTATION,
  CREATE_CONFIGURATION_RULE_MUTATION,
  CREATE_DRAFT_GRAPH_VERSION_MUTATION,
  CREATE_MODEL_TARGET_MUTATION,
  CREATE_PRODUCT_ATTRIBUTE_MUTATION,
  CREATE_PRODUCT_MODEL_MUTATION,
  CREATE_PRODUCT_VARIANT_MUTATION,
  CREATE_VARIANT_SELECTION_MUTATION,
  CREATE_VISUAL_EFFECT_MUTATION,
  DISCARD_DRAFT_GRAPH_VERSION_MUTATION,
  PUBLISH_GRAPH_VERSION_MUTATION,
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
  sourceGraphVersionId?: string
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createDraftGraphVersion: { id: string };
    }>(
      CREATE_DRAFT_GRAPH_VERSION_MUTATION,
      {
        productId,
        ...(sourceGraphVersionId ? { sourceGraphVersionId } : {}),
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createDraftGraphVersion.id };
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
  sourceGraphVersionId: string
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
      createDraftGraphVersion: { id: string };
    }>(
      CREATE_DRAFT_GRAPH_VERSION_MUTATION,
      { productId, sourceGraphVersionId },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createDraftGraphVersion.id };
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
      createProductAttribute: { id: string };
    }>(
      CREATE_PRODUCT_ATTRIBUTE_MUTATION,
      {
        input: {
          graphVersionId: String(formData.get('graphVersionId') ?? ''),
          key: String(formData.get('key') ?? '').trim(),
          name: String(formData.get('name') ?? '').trim(),
          type: String(formData.get('type') ?? 'SELECT'),
          required: formData.get('required') === 'on',
          sortOrder: Number(formData.get('sortOrder') ?? 0),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createProductAttribute.id };
  });
}

export async function createAttributeValueAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const data = await graphRequest<{
      createAttributeValue: { id: string };
    }>(
      CREATE_ATTRIBUTE_VALUE_MUTATION,
      {
        input: {
          attributeId: String(formData.get('attributeId') ?? ''),
          key: String(formData.get('key') ?? '').trim(),
          name: String(formData.get('name') ?? '').trim(),
          sortOrder: Number(formData.get('sortOrder') ?? 0),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createAttributeValue.id };
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
          graphVersionId: String(formData.get('graphVersionId') ?? ''),
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
          graphVersionId: String(formData.get('graphVersionId') ?? ''),
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

export async function createVisualEffectAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<GraphMutationResult> {
  return withProject(projectId, async (token) => {
    const operation = String(formData.get('operation') ?? 'SET_MATERIAL');
    const rawValue = String(formData.get('value') ?? '').trim();
    let valueJson = rawValue;
    if (operation === 'SET_VISIBILITY') {
      valueJson = JSON.stringify(rawValue === 'true' || rawValue === 'Show');
    } else if (operation === 'SET_MATERIAL') {
      const materialAssetId = String(
        formData.get('materialAssetId') ?? rawValue
      ).trim();
      if (!materialAssetId) {
        return { ok: false, error: 'materialAssetId is required.' };
      }
      valueJson = JSON.stringify({ materialAssetId });
    } else {
      try {
        JSON.parse(rawValue);
      } catch {
        valueJson = JSON.stringify(rawValue);
      }
    }

    const data = await graphRequest<{
      createVisualEffect: { id: string };
    }>(
      CREATE_VISUAL_EFFECT_MUTATION,
      {
        input: {
          attributeValueId: String(formData.get('attributeValueId') ?? ''),
          modelTargetId: String(formData.get('modelTargetId') ?? ''),
          operation,
          valueJson,
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createVisualEffect.id };
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
          graphVersionId: String(formData.get('graphVersionId') ?? ''),
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
          attributeId: String(formData.get('attributeId') ?? ''),
          attributeValueId: String(formData.get('attributeValueId') ?? ''),
        },
      },
      token
    );
    revalidateProduct(projectId, productId);
    return { ok: true, id: data.createVariantSelection.id };
  });
}
