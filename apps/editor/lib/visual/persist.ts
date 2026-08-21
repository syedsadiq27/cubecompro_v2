import {
  CREATE_DRAFT_PRODUCT_REVISION_MUTATION,
  CREATE_VISUAL_EFFECT_MUTATION,
  DELETE_VISUAL_EFFECT_MUTATION,
  PRODUCT_REVISION_DETAIL_QUERY,
  PRODUCT_REVISIONS_QUERY,
  UPDATE_VISUAL_EFFECT_MUTATION,
  graphRequest,
  pickGraphVersionId,
  type GraphDetail,
  type GraphSessionAuth,
  type GraphVersionSummary,
} from '@repo/product-graph';
import { normalizeVisualDocumentFromGraphDetail } from './from-graph';
import {
  bindingSemanticKey,
  bindingsEqualForPersist,
  diffVisualBindings,
  serializeBindingValueJson,
} from './serialize';
import type { VisualBinding, VisualDocument } from './types';

function resolveChoiceValueId(
  detail: GraphDetail,
  choiceKey: string,
  valueKey: string
): string {
  const choice = detail.choices.find((entry) => entry.key === choiceKey);
  const value = choice?.values.find((entry) => entry.key === valueKey);
  if (!value) {
    throw new Error(`Missing choice value ${choiceKey}=${valueKey}`);
  }
  return value.id;
}

function resolveModelTargetId(
  detail: GraphDetail,
  productModelId: string,
  targetKey: string
): string {
  const model =
    detail.models.find((entry) => entry.id === productModelId) ??
    detail.models[0];
  const target = model?.targets.find((entry) => entry.key === targetKey);
  if (!target) {
    throw new Error(`Missing model target ${targetKey}`);
  }
  return target.id;
}

async function loadDetail(
  auth: GraphSessionAuth,
  productRevisionId: string
): Promise<GraphDetail> {
  const data = await graphRequest<{
    productRevisionDetail: GraphDetail;
  }>(
    PRODUCT_REVISION_DETAIL_QUERY,
    { id: productRevisionId },
    auth.token,
    auth.apiUrl
  );
  return data.productRevisionDetail;
}

async function ensureDraftRevision(input: {
  auth: GraphSessionAuth;
  productId: string;
  detail: GraphDetail;
}): Promise<GraphDetail> {
  if (input.detail.status === 'DRAFT') {
    return input.detail;
  }

  const draft = await graphRequest<{
    createDraftProductRevision: { id: string; status: string };
  }>(
    CREATE_DRAFT_PRODUCT_REVISION_MUTATION,
    {
      productId: input.productId,
      sourceProductRevisionId: input.detail.id,
    },
    input.auth.token,
    input.auth.apiUrl
  );

  return loadDetail(input.auth, draft.createDraftProductRevision.id);
}

export type PersistVisualDocumentResult = {
  detail: GraphDetail;
  document: VisualDocument;
  opsApplied: number;
};

export async function persistVisualDocument(input: {
  auth: GraphSessionAuth;
  productId: string;
  productModelId: string;
  detail: GraphDetail;
  desired: VisualDocument;
}): Promise<PersistVisualDocumentResult> {
  const draftDetail = await ensureDraftRevision({
    auth: input.auth,
    productId: input.productId,
    detail: input.detail,
  });

  const sourceModel =
    input.detail.models.find((model) => model.id === input.productModelId) ??
    input.detail.models[0];
  const modelOnDraft =
    draftDetail.models.find((model) => model.key === sourceModel?.key) ??
    draftDetail.models[0];
  const productModelId = modelOnDraft?.id ?? input.productModelId;

  const currentDocument = normalizeVisualDocumentFromGraphDetail(
    draftDetail,
    productModelId
  );

  const desiredOnDraft: VisualDocument = {
    ...input.desired,
    productRevisionId: draftDetail.id,
    productModelId,
    assetId: modelOnDraft?.assetId ?? input.desired.assetId,
    targets: currentDocument.targets,
    bindings: input.desired.bindings.map((binding) => {
      const match = currentDocument.bindings.find(
        (entry) =>
          entry.choiceKey === binding.choiceKey &&
          entry.valueKey === binding.valueKey &&
          entry.targetKey === binding.targetKey &&
          entry.operation === binding.operation
      );
      return match?.effectId
        ? { ...binding, effectId: match.effectId }
        : binding;
    }),
  };

  const filteredCurrent = currentDocument.bindings;

  const ops = diffVisualBindings({
    desired: desiredOnDraft.bindings,
    current: filteredCurrent,
  });

  for (const op of ops) {
    if (op.type === 'create') {
      await graphRequest(
        CREATE_VISUAL_EFFECT_MUTATION,
        {
          input: {
            choiceValueId: resolveChoiceValueId(
              draftDetail,
              op.binding.choiceKey,
              op.binding.valueKey
            ),
            modelTargetId: resolveModelTargetId(
              draftDetail,
              productModelId,
              op.binding.targetKey
            ),
            operation: op.binding.operation,
            valueJson: serializeBindingValueJson(op.binding),
          },
        },
        input.auth.token,
        input.auth.apiUrl
      );
      continue;
    }
    if (op.type === 'update') {
      await graphRequest(
        UPDATE_VISUAL_EFFECT_MUTATION,
        {
          input: {
            id: op.effectId,
            operation: op.binding.operation,
            valueJson: serializeBindingValueJson(op.binding),
          },
        },
        input.auth.token,
        input.auth.apiUrl
      );
      continue;
    }
    await graphRequest(
      DELETE_VISUAL_EFFECT_MUTATION,
      { id: op.effectId },
      input.auth.token,
      input.auth.apiUrl
    );
  }

  const revisions = await graphRequest<{
    productRevisions: GraphVersionSummary[];
  }>(
    PRODUCT_REVISIONS_QUERY,
    { productId: input.productId },
    input.auth.token,
    input.auth.apiUrl
  );
  const draftId = pickGraphVersionId(revisions.productRevisions, draftDetail.id);
  const freshDetail = await loadDetail(input.auth, draftId);
  const document = normalizeVisualDocumentFromGraphDetail(
    freshDetail,
    productModelId
  );

  if (!documentsMatchForSaveProof(desiredOnDraft, document)) {
    throw new Error(
      `Save proof failed: reloaded VisualDocument does not match (${describeSaveProofMismatch(desiredOnDraft, document)})`
    );
  }

  return {
    detail: freshDetail,
    document,
    opsApplied: ops.length,
  };
}

export function documentsMatchForSaveProof(
  a: VisualDocument,
  b: VisualDocument
): boolean {
  if (a.bindings.length !== b.bindings.length) return false;
  const byKey = new Map(
    a.bindings.map((binding) => [bindingSemanticKey(binding), binding])
  );
  if (byKey.size !== a.bindings.length) return false;
  for (const binding of b.bindings) {
    const other = byKey.get(bindingSemanticKey(binding));
    if (!other || !bindingsEqualForPersist(binding, other)) return false;
  }
  return true;
}

export function describeSaveProofMismatch(
  desired: VisualDocument,
  reloaded: VisualDocument
): string {
  const desiredKeys = new Map(
    desired.bindings.map((binding) => [
      bindingSemanticKey(binding),
      serializeBindingValueJson(binding),
    ])
  );
  const reloadedKeys = new Map(
    reloaded.bindings.map((binding) => [
      bindingSemanticKey(binding),
      serializeBindingValueJson(binding),
    ])
  );
  const missing: string[] = [];
  const extra: string[] = [];
  const changed: string[] = [];
  for (const [key, value] of desiredKeys) {
    const next = reloadedKeys.get(key);
    if (next === undefined) missing.push(key.replaceAll('\0', '/'));
    else if (next !== value) changed.push(key.replaceAll('\0', '/'));
  }
  for (const key of reloadedKeys.keys()) {
    if (!desiredKeys.has(key)) extra.push(key.replaceAll('\0', '/'));
  }
  const parts = [
    missing.length ? `missing after reload: ${missing.join(', ')}` : null,
    extra.length ? `extra after reload: ${extra.join(', ')}` : null,
    changed.length ? `value changed: ${changed.join(', ')}` : null,
    `counts desired=${desired.bindings.length} reloaded=${reloaded.bindings.length}`,
  ].filter(Boolean);
  return parts.join(' · ');
}

export type { VisualBinding };
