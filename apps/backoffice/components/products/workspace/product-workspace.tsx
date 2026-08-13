'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createDraftGraphVersionAction,
  discardDraftGraphVersionAction,
  publishGraphVersionByIdAction,
  recreateDraftFromVersionAction,
} from '@/actions/graph';
import { CommerceTab } from '@/components/products/workspace/commerce-tab';
import { OptionsTab } from '@/components/products/workspace/options-tab';
import {
  EditProductDetailsDrawer,
  ProductOverview,
} from '@/components/products/workspace/product-overview';
import { RulesTab } from '@/components/products/workspace/rules-tab';
import { ThreeDTab } from '@/components/products/workspace/three-d-tab';
import {
  BrowseTab,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import {
  type GraphDetail,
  type MaterialAssetOption,
  type ObjectAssetOption,
  type WorkspaceTab,
} from '@/lib/product-workspace';

const TABS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'options', label: 'Options' },
  { id: '3d', label: '3D' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'rules', label: 'Rules' },
];

export function ProductWorkspace({
  projectId,
  productId,
  product,
  detail,
  objectAssets,
  materialAssets,
  publishedVersions,
  initialTab,
}: {
  projectId: string;
  productId: string;
  product: {
    name: string;
    key: string;
    description?: string | null;
    status: string;
  };
  detail: GraphDetail | null;
  objectAssets: ObjectAssetOption[];
  materialAssets: MaterialAssetOption[];
  publishedVersions: Array<{ id: string; version: number }>;
  initialTab: WorkspaceTab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<WorkspaceTab>(initialTab);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);

  const editable = detail?.status === 'DRAFT';
  const published = detail?.status === 'PUBLISHED';
  const optionCount = detail?.attributes.length ?? 0;
  const variantCount = detail?.variants.length ?? 0;
  const latestPublished = publishedVersions[0] ?? null;
  const modelCount = detail?.models.length ?? 0;
  const mappingCount = detail?.visualEffects.length ?? 0;

  const productStatus =
    product.status === 'ACTIVE'
      ? 'Active'
      : product.status === 'ARCHIVED'
        ? 'Archived'
        : 'Draft';

  const versionLabel = !detail
    ? 'No configuration'
    : published
      ? `Published v${detail.version}`
      : editable
        ? `Draft v${detail.version}`
        : `Archived v${detail.version}`;

  function selectTab(next: WorkspaceTab) {
    setTab(next);
    router.replace(`/${projectId}/products/${productId}?tab=${next}`, {
      scroll: false,
    });
  }

  function createDraft(fromVersionId?: string) {
    startTransition(async () => {
      const result = await createDraftGraphVersionAction(
        projectId,
        productId,
        fromVersionId
      );
      setMessage(
        result.ok
          ? fromVersionId
            ? 'Draft ready to edit.'
            : 'Configuration started.'
          : result.error || 'Could not create draft.'
      );
      setVersionMenuOpen(false);
      if (result.ok) {
        if (!detail) selectTab('options');
        router.refresh();
      }
    });
  }

  function editConfiguration() {
    const fromId = latestPublished?.id ?? detail?.id;
    if (!fromId) {
      createDraft();
      return;
    }
    createDraft(fromId);
  }

  return (
    <BrowseWorkspace
      title={product.name}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bo-live-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--bo-live)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--bo-live)]" />
          {productStatus}
        </span>
      }
      subtitle={
        detail ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Configuration</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--bo-ink)]">
              {versionLabel}
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  editable
                    ? 'bg-amber-500'
                    : published
                      ? 'bg-[var(--bo-live)]'
                      : 'bg-[var(--bo-muted)]'
                }`}
              />
            </span>
            {editable ? (
              <span className="text-[var(--bo-muted)]">Editing</span>
            ) : null}
          </div>
        ) : (
          <p>
            {product.key}
            {optionCount || variantCount
              ? ` · ${optionCount} options · ${variantCount} variants`
              : ''}
          </p>
        )
      }
      actions={
        <div className="relative flex flex-wrap items-center gap-2">
          {!detail ? (
            <button
              type="button"
              disabled={pending}
              className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-60"
              onClick={() => createDraft()}
            >
              {pending ? 'Starting…' : 'Start configuration'}
            </button>
          ) : published ? (
            <>
              <button
                type="button"
                disabled={pending}
                className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-60"
                onClick={editConfiguration}
              >
                {pending ? 'Opening…' : 'Edit configuration'}
              </button>
              <button
                type="button"
                onClick={() => setVersionMenuOpen((open) => !open)}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
              >
                Versions
              </button>
            </>
          ) : editable ? (
            <>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium disabled:opacity-60"
                onClick={() => {
                  if (
                    !confirm(
                      'Discard this draft? Unpublished changes will be lost.'
                    )
                  ) {
                    return;
                  }
                  startTransition(async () => {
                    const result = await discardDraftGraphVersionAction(
                      projectId,
                      productId
                    );
                    setMessage(
                      result.ok
                        ? 'Draft discarded.'
                        : result.error || 'Could not discard draft.'
                    );
                    if (result.ok) router.refresh();
                  });
                }}
              >
                Discard
              </button>
              <button
                type="button"
                disabled={pending}
                className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-60"
                onClick={() => {
                  startTransition(async () => {
                    const result = await publishGraphVersionByIdAction(
                      projectId,
                      productId,
                      detail.id
                    );
                    setMessage(
                      result.ok
                        ? 'Configuration published.'
                        : result.error || 'Publish failed.'
                    );
                    if (result.ok) router.refresh();
                  });
                }}
              >
                {pending ? 'Publishing…' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => setVersionMenuOpen((open) => !open)}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
              >
                Versions
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={pending}
              className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-60"
              onClick={editConfiguration}
            >
              {pending ? 'Opening…' : 'Edit configuration'}
            </button>
          )}

          {versionMenuOpen && detail ? (
            <div className="absolute top-full right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[var(--bo-line)] bg-white py-1 shadow-lg">
              {latestPublished ? (
                <button
                  type="button"
                  disabled={pending}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03] disabled:opacity-60"
                  onClick={() => createDraft(latestPublished.id)}
                >
                  New draft from v{latestPublished.version}
                </button>
              ) : null}
              {editable && latestPublished ? (
                <button
                  type="button"
                  disabled={pending}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03] disabled:opacity-60"
                  onClick={() => {
                    if (
                      !confirm(
                        'Replace the current draft with a copy of the published version?'
                      )
                    ) {
                      return;
                    }
                    startTransition(async () => {
                      const result = await recreateDraftFromVersionAction(
                        projectId,
                        productId,
                        latestPublished.id
                      );
                      setMessage(
                        result.ok
                          ? 'Draft replaced from published version.'
                          : result.error || 'Could not replace draft.'
                      );
                      setVersionMenuOpen(false);
                      if (result.ok) router.refresh();
                    });
                  }}
                >
                  Replace draft from published
                </button>
              ) : null}
              {!editable && !latestPublished ? (
                <button
                  type="button"
                  disabled={pending}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03] disabled:opacity-60"
                  onClick={() => createDraft()}
                >
                  Create draft
                </button>
              ) : null}
            </div>
          ) : null}

          <Link
            href={`/${projectId}/products`}
            className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
          >
            All products
          </Link>
        </div>
      }
      filters={
        <>
          {TABS.map((entry) => (
            <BrowseTab
              key={entry.id}
              label={entry.label}
              active={tab === entry.id}
              onClick={() => selectTab(entry.id)}
            />
          ))}
        </>
      }
      inspector={
        <EditProductDetailsDrawer
          projectId={projectId}
          productId={productId}
          product={product}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      }
    >
      {message ? (
        <p className="mb-3 text-[13px] text-[var(--bo-muted)]">{message}</p>
      ) : null}

      {tab === 'product' ? (
        <ProductOverview
          product={product}
          detail={detail}
          modelCount={modelCount}
          mappingCount={mappingCount}
          onEditDetails={() => setEditOpen(true)}
          onConfigureOptions={() => selectTab('options')}
          onOpen3d={() => selectTab('3d')}
          onOpenCommerce={() => selectTab('commerce')}
        />
      ) : null}

      {tab === 'options' ? (
        <OptionsTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          editable={editable}
          materialAssets={materialAssets}
        />
      ) : null}
      {tab === '3d' ? (
        <ThreeDTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          objectAssets={objectAssets}
          materialAssets={materialAssets}
          editable={editable}
        />
      ) : null}
      {tab === 'commerce' ? (
        <CommerceTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          editable={editable}
        />
      ) : null}
      {tab === 'rules' ? (
        <RulesTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          editable={editable}
        />
      ) : null}
    </BrowseWorkspace>
  );
}
