'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, useToast } from '@repo/ui';
import { ModelGlbPreview } from '@/components/library/model-preview';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SmartphoneIcon,
} from '@/components/bo/icons';
import { StatusBadge } from '@/components/bo/states/operational-states';
import { getEditorStudioPath } from '@/lib/editor-embed';
import type {
  GraphDetail,
  MaterialAssetOption,
  ObjectAssetOption,
} from '@/lib/product-workspace';

export function ThreeDTab({
  projectId,
  productId,
  detail,
  objectAssets = [],
  materialAssets = [],
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  objectAssets?: ObjectAssetOption[];
  materialAssets?: MaterialAssetOption[];
  editable: boolean;
}) {
  const toast = useToast();
  const [expandedMapping, setExpandedMapping] = useState<'color' | 'frame' | null>('color');
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const primaryModel = detail?.models[0] ?? null;
  const primaryAsset =
    objectAssets.find((asset) => asset.id === primaryModel?.assetId) ?? null;
  const assetName = primaryAsset?.name ?? primaryModel?.name ?? 'Demo Chair';
  const editorHref = primaryModel
    ? getEditorStudioPath(projectId, productId, primaryModel.id)
    : null;

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
                      6 meshes · 3 targets · 2 mappings
                    </p>

                    <div className="mt-3 space-y-2 text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">3D Status</span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60 uppercase">
                          Ready
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">Last updated</span>
                        <span className="text-[var(--text-secondary)]">May 14, 2025 10:24 AM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">3D model</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Downloading demo-chair.glb')}
                          className="ui:h-auto ui:gap-1 ui:px-0 ui:font-mono ui:text-[11px] ui:text-[var(--ink)] ui:hover:bg-transparent ui:hover:underline"
                        >
                          <span>demo-chair.glb</span>
                          <DownloadIcon size={12} className="text-[var(--text-muted)]" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">Thumbnail</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Downloading demo-chair-thumb.png')}
                          className="ui:h-auto ui:gap-1 ui:px-0 ui:font-mono ui:text-[11px] ui:text-[var(--ink)] ui:hover:bg-transparent ui:hover:underline"
                        >
                          <span>demo-chair-thumb.png</span>
                          <DownloadIcon size={12} className="text-[var(--text-muted)]" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">File size</span>
                        <span className="font-mono text-[var(--ink)]">24.6 MB</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    href={editorHref ?? `/${projectId}/editor`}
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

        {/* Bottom Section: 3D Mappings */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--ink)]">3D Mappings</h3>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                Define how options map to 3D materials, meshes, and textures.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => toast.info('Add 3D mapping')}
              className="ui:flex ui:items-center ui:gap-1.5 ui:h-8 ui:px-3 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[12px] ui:font-medium ui:shadow-xs"
            >
              <PlusIcon size={14} />
              <span>Add mapping</span>
            </Button>
          </div>

          {/* Mapping Accordion Cards */}
          <div className="space-y-3">
            {/* Mapping 1: Color: Black (Expanded) */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] overflow-hidden transition-all">
              <div
                className="flex items-center justify-between p-3.5 cursor-pointer bg-[var(--canvas)]/40 hover:bg-[var(--canvas)]/70 transition-colors"
                onClick={() =>
                  setExpandedMapping((cur) => (cur === 'color' ? null : 'color'))
                }
              >
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded border border-black/30 bg-black" />
                  <span className="text-[13px] font-semibold text-[var(--ink)]">
                    Color: Black
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span className="text-[11px] font-medium text-emerald-800">Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Used in 4 variants
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {expandedMapping === 'color' ? (
                      <ChevronUpIcon size={15} />
                    ) : (
                      <ChevronDownIcon size={15} />
                    )}
                  </span>
                </div>
              </div>

              {expandedMapping === 'color' ? (
                <div className="p-4 border-t border-[var(--line)] bg-[var(--surface-pure)] grid grid-cols-1 sm:grid-cols-3 gap-6 text-[12px]">
                  {/* Maps to */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Maps to
                    </p>
                    <div className="space-y-1.5 font-mono text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Material</span>
                        <span className="text-[var(--ink)]">Chair_Fabric</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Body</span>
                        <span className="text-[var(--ink)]">Chair_Frame</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Fabric</span>
                        <span className="text-[var(--ink)]">Fabric_Seat</span>
                      </div>
                    </div>
                  </div>

                  {/* Values */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Values
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="h-4 w-4 rounded border border-black/30 bg-black" />
                      <span className="font-medium text-[var(--ink)]">Black</span>
                    </div>
                  </div>

                  {/* Targets */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Targets
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✓</span>
                        <span>Web</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✓</span>
                        <span>AR</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✓</span>
                        <span>Thumbnails</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Mapping 2: Frame: Walnut (Collapsed) */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] overflow-hidden transition-all">
              <div
                className="flex items-center justify-between p-3.5 cursor-pointer bg-[var(--canvas)]/40 hover:bg-[var(--canvas)]/70 transition-colors"
                onClick={() =>
                  setExpandedMapping((cur) => (cur === 'frame' ? null : 'frame'))
                }
              >
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded border border-black/30 bg-[#5C3A21]" />
                  <span className="text-[13px] font-semibold text-[var(--ink)]">
                    Frame: Walnut
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span className="text-[11px] font-medium text-emerald-800">Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Used in 4 variants
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {expandedMapping === 'frame' ? (
                      <ChevronUpIcon size={15} />
                    ) : (
                      <ChevronDownIcon size={15} />
                    )}
                  </span>
                </div>
              </div>

              {expandedMapping === 'frame' ? (
                <div className="p-4 border-t border-[var(--line)] bg-[var(--surface-pure)] grid grid-cols-1 sm:grid-cols-3 gap-6 text-[12px]">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Maps to
                    </p>
                    <div className="space-y-1.5 font-mono text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Material</span>
                        <span className="text-[var(--ink)]">Wood_Walnut</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Frame</span>
                        <span className="text-[var(--ink)]">Legs_Armrest</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Values
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="h-4 w-4 rounded border border-black/30 bg-[#5C3A21]" />
                      <span className="font-medium text-[var(--ink)]">Walnut</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      Targets
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✓</span>
                        <span>Web</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✓</span>
                        <span>AR</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Callout Notice */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)]/40 px-4 py-3 text-[12px] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="text-[13px] text-[var(--text-muted)]">ⓘ</span>
            <span>Changes to mappings may require regenerating 3D assets for some targets.</span>
          </div>
        </div>
      </div>

      {/* Right Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {inspectorOpen ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Header */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="h-14 w-14 shrink-0 rounded-lg border border-[var(--line)] bg-[#F8F7F5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&auto=format&fit=crop&q=80"
                  alt="Studio Chair"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="truncate text-[15px] font-semibold text-[var(--ink)]">
                    Studio Chair
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
                <p className="text-[11px] font-mono text-[var(--text-muted)]">CHAIR-01</p>
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
