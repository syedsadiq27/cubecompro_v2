'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, useToast } from '@repo/ui';
import { createProductModelAction } from '@/actions/graph';
import { ChangeProductModelForm } from '@/components/products/workspace/change-product-model-form';
import { ModelGlbPreview } from '@/components/library/model-preview';
import {
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  EyeIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SmartphoneIcon,
} from '@/components/bo/icons';
import { EmptyState } from '@/components/bo';
import { StatusBadge } from '@/components/bo/states/operational-states';
import { ThreeDMappingsSection } from '@/components/products/workspace/three-d-mappings-section';
import { getEditorStudioPath, getProduct3DStudioPath } from '@/lib/editor-embed';
import type { ShopifyCommerceView } from '@/actions/shopify';
import {
  type GraphDetail,
  type MaterialAssetOption,
  type ObjectAssetOption,
  useLiveProductData,
} from '@/lib/product-workspace';

export function ThreeDTab({
  projectId,
  productId,
  productName,
  productKey,
  detail,
  objectAssets = [],
  materialAssets = [],
  editable,
  shopifyCommerce,
}: {
  projectId: string;
  productId: string;
  productName: string;
  productKey?: string;
  detail: GraphDetail | null;
  objectAssets?: ObjectAssetOption[];
  materialAssets?: MaterialAssetOption[];
  editable: boolean;
  shopifyCommerce?: ShopifyCommerceView | null;
}) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const live = useLiveProductData(detail, shopifyCommerce);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [showAttach, setShowAttach] = useState(false);
  const [showChangeModel, setShowChangeModel] = useState(false);

  const primaryModel = detail?.models[0] ?? null;
  const primaryAsset =
    objectAssets.find((asset) => asset.id === primaryModel?.assetId) ?? null;
  const assetName =
    primaryAsset?.name ??
    primaryModel?.name ??
    (live ? 'Attached model' : 'Demo Chair');
  const editorHref = primaryModel
    ? getEditorStudioPath(projectId, productId, primaryModel.id)
    : null;
  const studioHref = getProduct3DStudioPath(projectId, productId);

  if (live && !primaryModel) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-[12px] font-medium text-[var(--text-secondary)]">
            {productName}
          </p>
          <h2 className="mt-0.5 text-[15px] font-semibold text-[var(--ink)]">
            3D
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)] max-w-xl">
            No VisualDocument for this ProductRevision yet. Do not reuse another
            product&apos;s model just to fill the viewport.
          </p>
        </div>
        {!showAttach ? (
          <EmptyState
            title="No visual model configured"
            description="Attach a library object to this product revision, then bind targets to choice values in 3D Studio."
            action={
              editable ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowAttach(true)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <PlusIcon size={14} />
                    Attach model
                  </span>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--ink)]">
                  Attach library object
                </h3>
                <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                  Choose a GLB from the project library. Upload new models under
                  Library first if needed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAttach(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            {objectAssets.length === 0 ? (
              <p className="text-[13px] text-[var(--text-secondary)]">
                No object assets in this project yet.{' '}
                <Link
                  href={`/${projectId}/library`}
                  className="font-medium text-[#665CFF] hover:underline"
                >
                  Open library
                </Link>
              </p>
            ) : detail ? (
              <form
                className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const formData = new FormData(form);
                  startTransition(async () => {
                    const result = await createProductModelAction(
                      projectId,
                      productId,
                      formData
                    );
                    if (result.ok) {
                      toast.success('Model attached');
                      setShowAttach(false);
                      router.refresh();
                    } else {
                      toast.error(result.error || 'Failed to attach model');
                    }
                  });
                }}
              >
                <input
                  type="hidden"
                  name="productRevisionId"
                  value={detail.id}
                />
                <input type="hidden" name="key" value="primary" />
                <input
                  name="name"
                  required
                  placeholder="Model name"
                  defaultValue="Primary model"
                  className="w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-[13px]"
                />
                <select
                  name="assetId"
                  required
                  className="w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-[13px]"
                >
                  {objectAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" disabled={pending}>
                  {pending ? 'Attaching…' : 'Attach'}
                </Button>
              </form>
            ) : null}
            <p className="text-[12px] text-[var(--text-muted)]">
              Or open{' '}
              <Link
                href={studioHref}
                className="font-medium text-[#665CFF] hover:underline"
              >
                3D Studio
              </Link>{' '}
              for the full attach flow.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Main 3D Workspace Area (~8 cols) */}
      <div className="space-y-6 lg:col-span-8">
        {/* Top Row: 3D Overview (7 cols) + 3D Targets (5 cols) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Card 1: 3D Overview with Rotating Canvas */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <h3 className="text-[14px] font-semibold text-[var(--ink)]">3D Overview</h3>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  See how the product looks in 3D and which mappings are used.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* 3D Rotating Canvas Section (Preserved interactive viewer) */}
                <div className="sm:col-span-6 space-y-2">
                  <div className="relative aspect-square w-full rounded-xl border border-[var(--line)] bg-[#F4F3F0] overflow-hidden">
                    {primaryModel?.assetId ? (
                      <ModelGlbPreview
                        assetId={primaryModel.assetId}
                        objectAssetRevisionId={
                          primaryModel.objectAssetRevisionId
                        }
                        priority
                        interactive
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      // Interactive fallback demo model viewer
                      <div className="relative h-full w-full flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
                          alt="Demo Chair 3D"
                          className="h-full w-full object-cover"
                        />
                        {/* Canvas Overlay Controls */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg border border-black/10 bg-white/80 backdrop-blur-xs px-1.5 py-1 shadow-xs">
                          <button
                            type="button"
                            title="Reset rotation"
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink)] hover:bg-black/5"
                            onClick={() => toast.info('Reset camera view')}
                          >
                            ↺
                          </button>
                          <button
                            type="button"
                            title="Toggle wireframe"
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink)] hover:bg-black/5"
                            onClick={() => toast.info('Wireframe toggled')}
                          >
                            🧊
                          </button>
                          <button
                            type="button"
                            title="Fullscreen"
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink)] hover:bg-black/5"
                            onClick={() => toast.info('Fullscreen view')}
                          >
                            ⤢
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Metadata & Studio CTA */}
                <div className="sm:col-span-6 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[var(--ink)]">{assetName}</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {primaryAsset?.meshCount != null
                        ? `${primaryAsset.meshCount} meshes`
                        : 'Library object'}
                      {primaryModel?.targets?.length
                        ? ` · ${primaryModel.targets.length} targets`
                        : ''}
                    </p>

                    <div className="mt-3 space-y-2 text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">3D Status</span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60 uppercase">
                          Ready
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[var(--text-muted)] shrink-0">3D model</span>
                        <span className="truncate font-medium text-[var(--ink)]">
                          {assetName}
                        </span>
                      </div>
                    </div>

                    {editable && primaryModel ? (
                      <div className="mt-3 space-y-2">
                        {!showChangeModel ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="w-full"
                            onClick={() => setShowChangeModel(true)}
                          >
                            Change model
                          </Button>
                        ) : (
                          <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-3 space-y-2">
                            <p className="text-[12px] text-[var(--text-secondary)]">
                              Pins the latest revision of the selected library
                              object on this draft.
                            </p>
                            <ChangeProductModelForm
                              projectId={projectId}
                              productId={productId}
                              productModelId={primaryModel.id}
                              objectAssets={objectAssets}
                              currentAssetId={primaryModel.assetId}
                              onCancel={() => setShowChangeModel(false)}
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <Button
                    as={Link}
                    href={editorHref ?? studioHref}
                    size="sm"
                    className="w-full ui:flex ui:items-center ui:justify-center ui:gap-1.5 ui:h-9 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[12px] ui:font-medium ui:shadow-xs"
                  >
                    <span>Open 3D Studio</span>
                    <ExternalLinkIcon size={13} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 3D Targets */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-[var(--text-muted)]">ⓘ</span>
                  <h3 className="text-[13px] font-semibold text-[var(--ink)]">3D Targets</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.info('Edit targets configuration')}
                  className="ui:h-auto ui:px-0 ui:text-[12px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
                >
                  Edit targets
                </Button>
              </div>

              <div className="divide-y divide-[var(--line)]/60">
                {/* Target 1: Web */}
                <div
                  className="flex items-center justify-between py-3.5 hover:bg-[var(--canvas)]/40 px-1 rounded transition-colors cursor-pointer group"
                  onClick={() => toast.info('Web target settings')}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)]">
                      <GlobeIcon size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--ink)]">Web</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Real-time 3D for web experiences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 border border-emerald-200/60 uppercase">
                      Ready
                    </span>
                    <ChevronRightIcon size={13} className="text-[var(--text-muted)]" />
                  </div>
                </div>

                {/* Target 2: AR */}
                <div
                  className="flex items-center justify-between py-3.5 hover:bg-[var(--canvas)]/40 px-1 rounded transition-colors cursor-pointer group"
                  onClick={() => toast.info('AR target settings')}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)]">
                      <SmartphoneIcon size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--ink)]">AR</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Augmented reality experiences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 border border-emerald-200/60 uppercase">
                      Ready
                    </span>
                    <ChevronRightIcon size={13} className="text-[var(--text-muted)]" />
                  </div>
                </div>

                {/* Target 3: Thumbnails */}
                <div
                  className="flex items-center justify-between py-3.5 hover:bg-[var(--canvas)]/40 px-1 rounded transition-colors cursor-pointer group"
                  onClick={() => toast.info('Thumbnails generator settings')}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)]">
                      <EyeIcon size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--ink)]">Thumbnails</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        2D preview images
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 border border-emerald-200/60 uppercase">
                      Ready
                    </span>
                    <ChevronRightIcon size={13} className="text-[var(--text-muted)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ThreeDMappingsSection
          projectId={projectId}
          productId={productId}
          modelId={primaryModel?.id}
          detail={detail}
          objectAssets={objectAssets}
          materialAssets={materialAssets}
          editable={editable}
        />
      </div>

      {/* Right Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {inspectorOpen ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Header */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="h-14 w-14 shrink-0 rounded-lg border border-[var(--line)] bg-[#F8F7F5] overflow-hidden">
                {primaryModel?.assetId ? (
                  <ModelGlbPreview
                    assetId={primaryModel.assetId}
                    objectAssetRevisionId={primaryModel.objectAssetRevisionId}
                    className="h-full w-full"
                  />
                ) : live ? (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-muted)]">
                    No thumb
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&auto=format&fit=crop&q=80"
                    alt={productName || 'Studio Chair'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="truncate text-[15px] font-semibold text-[var(--ink)]">
                    {live ? productName : 'Studio Chair'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setInspectorOpen(false)}
                    aria-label="Close inspector"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  {live ? productKey || productId.slice(0, 8) : 'CHAIR-01'}
                </p>
                <div className="mt-1">
                  <StatusBadge role="published" label="ACTIVE" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 ui:h-8 ui:text-[12px]"
                onClick={() => toast.info('Edit product')}
              >
                <PencilIcon size={13} className="mr-1 inline" />
                <span>Edit</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 ui:h-8 ui:text-[12px]"
                onClick={() => toast.info('Preview 3D session')}
              >
                <EyeIcon size={13} className="mr-1 inline" />
                <span>Preview</span>
              </Button>
              <button
                type="button"
                aria-label="More"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:bg-[var(--canvas)]"
              >
                <MoreHorizontalIcon size={15} />
              </button>
            </div>

            {/* Summary Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Summary
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Brand</span>
                  <span className="font-medium text-[var(--ink)]">CubeCom</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Category</span>
                  <span className="text-[var(--ink)]">Seating · Lounge Chairs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Created</span>
                  <span className="text-[var(--text-secondary)]">Apr 28, 2025 by Demo Owner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Updated</span>
                  <span className="text-[var(--text-secondary)]">May 14, 2025 by Demo Owner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Published</span>
                  <span className="text-[var(--text-secondary)]">May 14, 2025 10:24 AM (v1)</span>
                </div>
              </div>
            </div>

            {/* 3D & Assets Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                3D &amp; Assets
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">3D model</span>
                  <span className="font-mono font-medium text-[var(--ink)]">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Assets</span>
                  <span className="font-mono font-medium text-[var(--ink)]">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Textures</span>
                  <span className="font-mono font-medium text-[var(--ink)]">4</span>
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Usage
              </h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group">
                  <span className="text-[var(--text-secondary)]">Variants</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    4
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group">
                  <span className="text-[var(--text-secondary)]">Configurations</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    3
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group">
                  <span className="text-[var(--text-secondary)]">Commerce channels</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    1
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Activity
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ui:h-auto ui:px-0 ui:text-[11px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
                  onClick={() => toast.info('Viewing full activity')}
                >
                  View all
                </Button>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">3D model updated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Mapping &quot;Color: Black&quot; updated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 13, 2025 3:45 PM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">3D targets configured</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 10, 2025 9:11 AM by Demo Owner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
