'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, FilterTab, FilterTabs } from '@repo/ui';
import {
  createDraftGraphVersionAction,
  discardDraftGraphVersionAction,
  publishGraphVersionByIdAction,
  recreateDraftFromVersionAction,
} from '@/actions/graph';
import { ActivityTab } from '@/components/products/workspace/activity-tab';
import { CommerceTab } from '@/components/products/workspace/commerce-tab';
import { OptionsTab } from '@/components/products/workspace/options-tab';
import {
  EditProductDetailsDrawer,
  ProductOverview,
} from '@/components/products/workspace/product-overview';
import { RulesTab } from '@/components/products/workspace/rules-tab';
import { ThreeDTab } from '@/components/products/workspace/three-d-tab';
import { VariantsTab } from '@/components/products/workspace/variants-tab';
import { PublishValidationModal } from '@/components/products/workspace/publish-validation-modal';
import { VersionHistoryDialog } from '@/components/products/workspace/version-history-dialog';
import {
  ProductDraftSaveProvider,
  useProductDraftSave,
} from '@/components/products/workspace/product-draft-save';
import type { ShopifyCommerceView } from '@/actions/shopify';
import {
  BackofficePageHeader,
  IncompleteConfigBanner,
  ListChrome,
  PageBody,
  StatusBadge,
  SuccessBanner,
} from '@/components/bo';
import {
  type GraphDetail,
  type MaterialAssetOption,
  type ObjectAssetOption,
  type WorkspaceTab,
} from '@/lib/product-workspace';

const TABS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: 'product', label: 'Product' },
  { id: 'options', label: 'Options' },
  { id: 'variants', label: 'Variants' },
  { id: '3d', label: '3D' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'rules', label: 'Rules' },
  { id: 'activity', label: 'Activity' },
];

export function ProductWorkspace(props: {
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
  publishedVersions: Array<{
    id: string;
    versionNumber: number;
    publishedAt: string;
  }>;
  initialTab?: WorkspaceTab;
  shopifyCommerce?: ShopifyCommerceView | null;
}) {
  const editable = Boolean(
    props.detail &&
      props.detail.status !== 'PUBLISHED' &&
      !props.detail.publishedAt
  );
  return (
    <ProductDraftSaveProvider
      projectId={props.projectId}
      productId={props.productId}
      enabled={editable}
    >
      <ProductWorkspaceInner {...props} />
    </ProductDraftSaveProvider>
  );
}

function ProductWorkspaceInner({
  projectId,
  productId,
  product,
  detail,
  objectAssets,
  materialAssets,
  publishedVersions,
  initialTab,
  shopifyCommerce,
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
  publishedVersions: Array<{
    id: string;
    versionNumber: number;
    publishedAt: string;
  }>;
  initialTab?: WorkspaceTab;
  shopifyCommerce?: ShopifyCommerceView | null;
}) {
  const router = useRouter();
  const draftSave = useProductDraftSave();
  const [tab, setTab] = useState<WorkspaceTab>(initialTab || 'product');
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const published = Boolean(detail?.status === 'PUBLISHED' || detail?.publishedAt);
  const editable = Boolean(detail && detail.status !== 'PUBLISHED' && !detail.publishedAt);
  const modelCount = detail?.models.length ?? 0;
  const mappingCount = detail?.visualEffects.length ?? 0;

  const versionNum = detail?.version ?? 1;
  const versionLabel = published
    ? `Published v${versionNum}`
    : detail
      ? `Draft v${versionNum}`
      : 'Published v1';

  const productStatus =
    product.status === 'ACTIVE'
      ? 'ACTIVE'
      : product.status === 'ARCHIVED'
        ? 'ARCHIVED'
        : 'DRAFT';

  const selectTab = (nextTab: WorkspaceTab) => {
    setTab(nextTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', nextTab);
    window.history.replaceState(null, '', url.toString());
  };

  const createDraft = (fromVersionId?: string) => {
    startTransition(async () => {
      const result = fromVersionId
        ? await recreateDraftFromVersionAction(
            projectId,
            productId,
            fromVersionId
          )
        : await createDraftGraphVersionAction(projectId, productId);
      setMessage(
        result.ok ? 'Draft ready.' : result.error || 'Could not start draft.'
      );
      if (result.ok) router.refresh();
    });
  };

  const latestPublished = publishedVersions[0];

  function editConfiguration() {
    const fromId = latestPublished?.id || detail?.id;
    if (!fromId) {
      createDraft();
      return;
    }
    createDraft(fromId);
  }

  const saveDraft = () => {
    startTransition(async () => {
      await draftSave.save();
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      {/* Responsive Page Header */}
      <header className="border-b border-[var(--line)] bg-[var(--surface-pure)] px-4 sm:px-6 py-3 sm:py-4">
        {/* Mobile Header Layout (< md) */}
        <div className="block md:hidden space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/${projectId}/products`}
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              <span>←</span>
              <span>Products</span>
            </Link>

            <button
              type="button"
              aria-label="More actions"
              onClick={() => setEditOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:bg-[var(--canvas)]"
            >
              <span className="text-[13px]">•••</span>
            </button>
          </div>

          <div>
            <h1 className="text-[17px] font-semibold text-[var(--ink)] leading-snug">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-1">
              <span className="font-mono text-[var(--ink)]">{product.key}</span>
              <span>·</span>
              <StatusBadge
                role={
                  product.status === 'ACTIVE'
                    ? 'published'
                    : product.status === 'ARCHIVED'
                      ? 'archived'
                      : 'draft'
                }
                label={productStatus}
              />
              <span>·</span>
              <span className="text-[var(--text-secondary)]">{versionLabel}</span>
              {editable ? (
                <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[9px] font-semibold text-amber-800 border border-amber-200/60">
                  Editing
                </span>
              ) : null}
            </div>
          </div>

          {/* Mobile Action Bar */}
          <div className="flex items-center gap-2 pt-1">
            {!detail ? (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                onClick={() => createDraft()}
                className="flex-1 ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-8 ui:text-[12px]"
              >
                {pending ? 'Starting…' : 'Start configuration'}
              </Button>
            ) : published ? (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                onClick={editConfiguration}
                className="flex-1 ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-8 ui:text-[12px]"
              >
                {pending ? 'Opening…' : 'Edit configuration'}
              </Button>
            ) : editable ? (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                className="flex-1 ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-8 ui:text-[12px]"
                onClick={() => {
                  startTransition(async () => {
                    const result = await publishGraphVersionByIdAction(
                      projectId,
                      productId,
                      detail.id
                    );
                    setMessage(
                      result.ok ? 'Published to storefront.' : result.error || 'Could not publish.'
                    );
                    if (result.ok) router.refresh();
                  });
                }}
              >
                Publish to storefront
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                onClick={() => createDraft()}
                className="flex-1 ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-8 ui:text-[12px]"
              >
                Create draft
              </Button>
            )}

            {editable ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={pending || draftSave.saving}
                onClick={saveDraft}
                className="ui:h-8 ui:text-[12px]"
              >
                {draftSave.saving
                  ? 'Saving…'
                  : draftSave.dirty
                    ? `Save (${draftSave.pendingCount})`
                    : 'Save'}
              </Button>
            ) : null}

            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="ui:h-8 ui:text-[12px]"
              onClick={() => selectTab('3d')}
            >
              Preview
            </Button>
          </div>
        </div>

        {/* Desktop Header Layout (>= md) */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-[20px] font-semibold text-[var(--ink)] leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-muted)]">
              <Link
                href={`/${projectId}/products`}
                className="hover:text-[var(--ink)] hover:underline"
              >
                Products
              </Link>
              <span>/</span>
              <span className="font-mono text-[var(--ink)]">{product.key}</span>
              <span>·</span>
              <StatusBadge
                role={
                  product.status === 'ACTIVE'
                    ? 'published'
                    : product.status === 'ARCHIVED'
                      ? 'archived'
                      : 'draft'
                }
                label={productStatus}
              />
              {detail ? (
                <>
                  <span>·</span>
                  <span className="text-[var(--text-secondary)]">{versionLabel}</span>
                  {editable ? (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200/60">
                      Editing
                    </span>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-2">
            {!detail ? (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                onClick={() => createDraft()}
                className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
              >
                {pending ? 'Starting…' : 'Start configuration'}
              </Button>
            ) : published ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  onClick={editConfiguration}
                >
                  {pending ? 'Opening…' : 'Edit configuration'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setHistoryModalOpen(true)}
                >
                  Versions ▾
                </Button>
              </>
            ) : editable ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  className="ui:text-[var(--text-secondary)] ui:hover:text-red-700 ui:hover:bg-red-50"
                  onClick={() => {
                    if (
                      !confirm('Discard this draft? Unpublished changes will be lost.')
                    ) {
                      return;
                    }
                    startTransition(async () => {
                      const result = await discardDraftGraphVersionAction(
                        projectId,
                        productId
                      );
                      setMessage(
                        result.ok ? 'Draft discarded.' : result.error || 'Could not discard draft.'
                      );
                      if (result.ok) router.refresh();
                    });
                  }}
                >
                  Discard
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending || draftSave.saving}
                  onClick={saveDraft}
                >
                  {draftSave.saving
                    ? 'Saving…'
                    : draftSave.dirty
                      ? `Save (${draftSave.pendingCount})`
                      : 'Save'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={pending || draftSave.dirty}
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                  onClick={() => {
                    if (draftSave.dirty) {
                      setMessage('Save pending changes before publishing.');
                      return;
                    }
                    setPublishModalOpen(true);
                  }}
                  title={
                    draftSave.dirty
                      ? 'Save pending changes before publishing'
                      : undefined
                  }
                >
                  Publish
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={pending}
                onClick={() => createDraft()}
                className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
              >
                Create draft
              </Button>
            )}

            {versionMenuOpen ? (
              <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-1 shadow-lg text-[13px]">
                <div className="px-3 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Graph versions
                </div>
                {publishedVersions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-[var(--canvas)] rounded"
                    onClick={() => {
                      setVersionMenuOpen(false);
                      createDraft(v.id);
                    }}
                  >
                    <span>Version {v.versionNumber}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
                {published && latestPublished ? (
                  <button
                    type="button"
                    disabled={pending}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03] disabled:opacity-60 border-t border-[var(--line)] mt-1"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await recreateDraftFromVersionAction(
                          projectId,
                          productId,
                          latestPublished.id
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

            <Button
              as={Link}
              href={`/${projectId}/products`}
              size="sm"
              variant="secondary"
              className="ui:text-[13px]"
            >
              All products
            </Button>

            <button
              type="button"
              aria-label="More actions"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] transition-colors hover:bg-[var(--canvas)]"
              onClick={() => setEditOpen(true)}
            >
              <span className="text-[14px]">•••</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Tab Bar */}
      <ListChrome
        views={
          <FilterTabs>
            {TABS.map((entry) => (
              <FilterTab
                key={entry.id}
                label={entry.label}
                active={tab === entry.id}
                onClick={() => selectTab(entry.id)}
              />
            ))}
          </FilterTabs>
        }
      />

      {/* Main Workspace Body */}
      <PageBody>
        <div className="relative pb-10 space-y-4">
          {published ? (
            <SuccessBanner
              title={`Published version v${versionNum} is live`}
              description="Your configuration graph is active and synchronized with public storefront customizers and commerce endpoints."
              storefrontUrl={`https://cubecom.demo/customizer/${productId}`}
            />
          ) : null}

          {message ? (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[13px] text-[var(--ink)]">
              {message}
            </div>
          ) : null}

          {editable && draftSave.dirty ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-950">
              <p>
                {draftSave.pendingCount} unsaved change
                {draftSave.pendingCount === 1 ? '' : 's'} — Save before
                publishing.
              </p>
              <Button
                type="button"
                size="sm"
                disabled={draftSave.saving}
                onClick={saveDraft}
                className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
              >
                {draftSave.saving ? 'Saving…' : 'Save now'}
              </Button>
            </div>
          ) : null}

          {tab === 'product' ? (
            <ProductOverview
              projectId={projectId}
              product={product}
              detail={detail}
              modelCount={modelCount}
              mappingCount={mappingCount}
              shopifyCommerce={shopifyCommerce}
              onEditDetails={() => setEditOpen(true)}
              onConfigureOptions={() => selectTab('options')}
              onOpenVariants={() => selectTab('variants')}
              onOpen3d={() => selectTab('3d')}
              onOpenCommerce={() => selectTab('commerce')}
              onOpenActivity={() => selectTab('activity')}
            />
          ) : null}

          {tab === 'options' ? (
            <OptionsTab
              projectId={projectId}
              productId={productId}
              detail={detail}
              editable={editable}
              materialAssets={materialAssets}
              shopifyCommerce={shopifyCommerce}
            />
          ) : null}

          {tab === 'variants' ? (
            <VariantsTab
              projectId={projectId}
              productId={productId}
              detail={detail}
              editable={editable}
              shopifyCommerce={shopifyCommerce}
              onOpenCommerce={() => selectTab('commerce')}
              onOpen3d={() => selectTab('3d')}
            />
          ) : null}

          {tab === '3d' ? (
            <ThreeDTab
              projectId={projectId}
              productId={productId}
              productName={product.name}
              productKey={product.key}
              detail={detail}
              objectAssets={objectAssets}
              materialAssets={materialAssets}
              editable={editable}
              shopifyCommerce={shopifyCommerce}
            />
          ) : null}

          {tab === 'commerce' ? (
            <CommerceTab
              projectId={projectId}
              productId={productId}
              detail={detail}
              editable={editable}
              shopifyCommerce={shopifyCommerce}
            />
          ) : null}

          {tab === 'rules' ? (
            <RulesTab
              projectId={projectId}
              productId={productId}
              detail={detail}
              editable={editable}
              shopifyCommerce={shopifyCommerce}
            />
          ) : null}

          {tab === 'activity' ? (
            <ActivityTab
              projectId={projectId}
              productId={productId}
              detail={detail}
              shopifyCommerce={shopifyCommerce}
            />
          ) : null}
        </div>
      </PageBody>

      <EditProductDetailsDrawer
        projectId={projectId}
        productId={productId}
        product={product}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <PublishValidationModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        productName={product.name}
        versionNumber={versionNum}
        isPublishing={pending}
        detail={detail}
        objectAssets={objectAssets}
        materialAssets={materialAssets}
        hasUnsavedChanges={draftSave.dirty}
        onConfirmPublish={() => {
          if (!detail) return;
          startTransition(async () => {
            const result = await publishGraphVersionByIdAction(
              projectId,
              productId,
              detail.id
            );
            setMessage(
              result.ok ? 'Published to storefront.' : result.error || 'Could not publish.'
            );
            setPublishModalOpen(false);
            if (result.ok) router.refresh();
          });
        }}
      />

      <VersionHistoryDialog
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        productName={product.name}
        isRollingBack={pending}
        onRollback={(targetRevisionId, version) => {
          startTransition(async () => {
            setMessage(`Rollback to Revision #${version} (${targetRevisionId}) initiated.`);
            setHistoryModalOpen(false);
            router.refresh();
          });
        }}
      />
    </div>
  );
}
