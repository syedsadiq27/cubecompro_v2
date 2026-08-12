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
import { updateProductMetadataAction } from '@/actions/products';
import { ProductMetadataForm } from '@/components/products/product-metadata-form';
import { CommerceTab } from '@/components/products/workspace/commerce-tab';
import { OptionsTab } from '@/components/products/workspace/options-tab';
import { RulesTab } from '@/components/products/workspace/rules-tab';
import { ThreeDTab } from '@/components/products/workspace/three-d-tab';
import { Panel } from '@/components/ui';
import {
  countValues,
  type GraphDetail,
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
  publishedVersions: Array<{ id: string; version: number }>;
  initialTab: WorkspaceTab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<WorkspaceTab>(initialTab);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [sourceVersionId, setSourceVersionId] = useState(
    publishedVersions[0]?.id ?? ''
  );

  const editable = detail?.status === 'DRAFT';
  const published = detail?.status === 'PUBLISHED';
  const optionCount = detail?.attributes.length ?? 0;
  const valueCount = countValues(detail);
  const ruleCount = detail?.rules.length ?? 0;
  const variantCount = detail?.variants.length ?? 0;
  const latestPublished = publishedVersions[0] ?? null;
  const statusLabel = published
    ? 'Published'
    : editable
      ? 'Draft'
      : detail
        ? 'Archived'
        : 'No configuration';

  function selectTab(next: WorkspaceTab) {
    setTab(next);
    router.replace(`/${projectId}/products/${productId}?tab=${next}`, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="type-page max-w-xl">{product.name}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bo-live-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--bo-live)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--bo-live)]" />
              {product.status === 'ACTIVE'
                ? 'Active'
                : product.status === 'ARCHIVED'
                  ? 'Archived'
                  : 'Draft'}
            </span>
            {detail ? (
              <span className="rounded-full bg-[var(--bo-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--bo-muted)]">
                Configuration · {statusLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[13px] text-[var(--bo-muted)]">
            {product.key}
            {detail ? (
              <>
                {' '}
                · {optionCount} options · {valueCount} values · {ruleCount}{' '}
                {ruleCount === 1 ? 'rule' : 'rules'} · {variantCount}{' '}
                {variantCount === 1 ? 'variant' : 'variants'}
              </>
            ) : null}
          </p>
          {detail?.publishedAt ? (
            <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
              Last published{' '}
              {new Date(detail.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          ) : editable ? (
            <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
              Draft · Version {detail?.version}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {!detail ? (
            <button
              type="button"
              disabled={pending}
              className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
              onClick={() => {
                startTransition(async () => {
                  const result = await createDraftGraphVersionAction(
                    projectId,
                    productId
                  );
                  setMessage(
                    result.ok
                      ? 'Configuration started.'
                      : result.error || 'Could not start configuration.'
                  );
                  if (result.ok) {
                    selectTab('options');
                    router.refresh();
                  }
                });
              }}
            >
              {pending ? 'Starting…' : 'Start configuration'}
            </button>
          ) : null}
          {detail && !editable ? (
            <button
              type="button"
              disabled={pending}
              className="rounded-xl border border-[var(--bo-line)] bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
              onClick={() => {
                startTransition(async () => {
                  const result = await createDraftGraphVersionAction(
                    projectId,
                    productId,
                    latestPublished?.id
                  );
                  setMessage(
                    result.ok
                      ? 'Editing draft created from published configuration.'
                      : result.error || 'Could not create draft.'
                  );
                  if (result.ok) router.refresh();
                });
              }}
            >
              {pending ? 'Opening…' : 'Edit configuration'}
            </button>
          ) : null}
          {editable ? (
            <>
              <button
                type="button"
                disabled={pending}
                className="rounded-xl border border-[var(--bo-line)] bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
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
                {pending ? 'Discarding…' : 'Discard draft'}
              </button>
              <button
                type="button"
                disabled={pending}
                className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
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
            </>
          ) : null}
          <Link
            href={`/${projectId}/products`}
            className="rounded-xl border border-[var(--bo-line)] bg-white px-4 py-2 text-sm font-medium"
          >
            All products
          </Link>
        </div>
      </div>

      {publishedVersions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--bo-line)] bg-white px-4 py-3">
          <span className="text-[13px] text-[var(--bo-muted)]">
            New draft from
          </span>
          <select
            value={sourceVersionId}
            onChange={(event) => setSourceVersionId(event.target.value)}
            className="rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]"
          >
            {publishedVersions.map((version) => (
              <option key={version.id} value={version.id}>
                Version {version.version}
                {latestPublished?.id === version.id ? ' · published' : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending || !sourceVersionId}
            className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
            onClick={() => {
              if (
                editable &&
                !confirm(
                  'Replace the current draft with a copy of the selected version?'
                )
              ) {
                return;
              }
              startTransition(async () => {
                const result = editable
                  ? await recreateDraftFromVersionAction(
                      projectId,
                      productId,
                      sourceVersionId
                    )
                  : await createDraftGraphVersionAction(
                      projectId,
                      productId,
                      sourceVersionId
                    );
                setMessage(
                  result.ok
                    ? 'Draft created from selected version.'
                    : result.error || 'Could not create draft.'
                );
                if (result.ok) router.refresh();
              });
            }}
          >
            {editable ? 'Replace draft' : 'Create draft'}
          </button>
        </div>
      ) : null}

      {message ? (
        <p className="text-[13px] text-[var(--bo-muted)]">{message}</p>
      ) : null}

      <div className="flex flex-wrap gap-1 border-b border-[var(--bo-line)]">
        {TABS.map((entry) => {
          const active = tab === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => selectTab(entry.id)}
              className={`relative px-3.5 py-2.5 text-[13px] font-medium transition ${
                active
                  ? 'text-[var(--bo-ink)]'
                  : 'text-[var(--bo-muted)] hover:text-[var(--bo-ink)]'
              }`}
            >
              {entry.label}
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--bo-ink)]" />
              ) : null}
            </button>
          );
        })}
      </div>

      {tab === 'product' ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel className="space-y-4">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Product
            </h2>
            <ProductMetadataForm
              projectId={projectId}
              productId={productId}
              defaults={{
                Name: product.name,
                key: product.key,
              }}
              action={updateProductMetadataAction}
            />
          </Panel>
          <Panel className="space-y-4">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Configuration
            </h2>
            {!detail ? (
              <p className="text-sm text-[var(--bo-muted)]">
                No configuration yet. Start one to define customer options,
                3D mappings, commerce variants, and rules.
              </p>
            ) : (
              <>
                <ul className="space-y-2 text-sm">
                  {detail.attributes.map((attribute) => (
                    <li
                      key={attribute.id}
                      className="flex items-center justify-between gap-3 border-b border-[var(--bo-line)] py-2 last:border-b-0"
                    >
                      <span className="font-medium">{attribute.name}</span>
                      <span className="text-[var(--bo-muted)]">
                        {attribute.values?.length ?? 0}{' '}
                        {(attribute.values?.length ?? 0) === 1
                          ? 'option'
                          : 'options'}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-[var(--bo-surface)] px-4 py-3 text-[13px] text-[var(--bo-muted)]">
                  Variants · {variantCount} mapped
                  {ruleCount > 0 ? ` · ${ruleCount} rules` : ''}
                </div>
                <button
                  type="button"
                  onClick={() => selectTab('options')}
                  className="text-[13px] font-medium text-[var(--bo-ink)] underline-offset-2 hover:underline"
                >
                  + Add option
                </button>
              </>
            )}
          </Panel>
        </div>
      ) : null}

      {tab === 'options' ? (
        <OptionsTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          editable={editable}
        />
      ) : null}
      {tab === '3d' ? (
        <ThreeDTab
          projectId={projectId}
          productId={productId}
          detail={detail}
          objectAssets={objectAssets}
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
    </div>
  );
}
