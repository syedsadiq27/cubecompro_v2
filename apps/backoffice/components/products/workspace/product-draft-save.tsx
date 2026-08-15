'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@repo/ui';
import {
  createConstraintAction,
  createModelTargetAction,
  createVisualEffectAction,
  deleteConstraintAction,
} from '@/actions/graph';

export type DraftPendingOp =
  | {
      id: string;
      kind: 'createModelTarget';
      label: string;
      form: Record<string, string>;
    }
  | {
      id: string;
      kind: 'createVisualEffect';
      label: string;
      form: Record<string, string>;
    }
  | {
      id: string;
      kind: 'createConstraint';
      label: string;
      productRevisionId: string;
      choiceValueIds: string[];
    }
  | {
      id: string;
      kind: 'deleteConstraint';
      label: string;
      constraintId: string;
    };

type QueueableDraftOp =
  | Omit<Extract<DraftPendingOp, { kind: 'createModelTarget' }>, 'id'>
  | Omit<Extract<DraftPendingOp, { kind: 'createVisualEffect' }>, 'id'>
  | Omit<Extract<DraftPendingOp, { kind: 'createConstraint' }>, 'id'>
  | Omit<Extract<DraftPendingOp, { kind: 'deleteConstraint' }>, 'id'>;

type ProductDraftSaveContextValue = {
  enabled: boolean;
  dirty: boolean;
  pendingCount: number;
  pending: DraftPendingOp[];
  saving: boolean;
  queue: (op: QueueableDraftOp & { id?: string }) => void;
  removePending: (id: string) => void;
  clearPending: () => void;
  save: () => Promise<boolean>;
};

const ProductDraftSaveContext =
  createContext<ProductDraftSaveContextValue | null>(null);

function toFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

export function ProductDraftSaveProvider({
  projectId,
  productId,
  enabled,
  children,
}: {
  projectId: string;
  productId: string;
  enabled: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState<DraftPendingOp[]>([]);
  const [saving, startTransition] = useTransition();

  const queue = useCallback(
    (op: QueueableDraftOp & { id?: string }) => {
      if (!enabled) return;
      const id =
        op.id ??
        `pending_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      setPending((rows) => [...rows, { ...op, id } as DraftPendingOp]);
    },
    [enabled]
  );

  const removePending = useCallback((id: string) => {
    setPending((rows) => rows.filter((row) => row.id !== id));
  }, []);

  const clearPending = useCallback(() => {
    setPending([]);
  }, []);

  const save = useCallback(async () => {
    if (!enabled) return true;
    if (pending.length === 0) {
      toast.info('Draft is up to date');
      return true;
    }

    const snapshot = [...pending];
    return await new Promise<boolean>((resolve) => {
      startTransition(async () => {
        for (const op of snapshot) {
          let result: { ok: boolean; error?: string };
          if (op.kind === 'createModelTarget') {
            result = await createModelTargetAction(
              projectId,
              productId,
              toFormData(op.form)
            );
          } else if (op.kind === 'createVisualEffect') {
            result = await createVisualEffectAction(
              projectId,
              productId,
              toFormData(op.form)
            );
          } else if (op.kind === 'createConstraint') {
            result = await createConstraintAction(projectId, productId, {
              productRevisionId: op.productRevisionId,
              choiceValueIds: op.choiceValueIds,
            });
          } else {
            result = await deleteConstraintAction(
              projectId,
              productId,
              op.constraintId
            );
          }

          if (!result.ok) {
            toast.error(result.error || `Failed: ${op.label}`);
            resolve(false);
            return;
          }
        }

        setPending([]);
        toast.success(
          snapshot.length === 1
            ? 'Saved 1 change'
            : `Saved ${snapshot.length} changes`
        );
        router.refresh();
        resolve(true);
      });
    });
  }, [enabled, pending, productId, projectId, router, toast]);

  useEffect(() => {
    if (!enabled || pending.length === 0) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [enabled, pending.length]);

  const value = useMemo<ProductDraftSaveContextValue>(
    () => ({
      enabled,
      dirty: pending.length > 0,
      pendingCount: pending.length,
      pending,
      saving,
      queue,
      removePending,
      clearPending,
      save,
    }),
    [clearPending, enabled, pending, queue, removePending, save, saving]
  );

  return (
    <ProductDraftSaveContext.Provider value={value}>
      {children}
    </ProductDraftSaveContext.Provider>
  );
}

export function useProductDraftSave() {
  const ctx = useContext(ProductDraftSaveContext);
  if (!ctx) {
    return {
      enabled: false,
      dirty: false,
      pendingCount: 0,
      pending: [] as DraftPendingOp[],
      saving: false,
      queue: () => undefined,
      removePending: () => undefined,
      clearPending: () => undefined,
      save: async () => true,
    } satisfies ProductDraftSaveContextValue;
  }
  return ctx;
}
