'use client';

import { useState } from 'react';
import { Button, Field, Input, Textarea, useToast } from '@repo/ui';
import {
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  LayersIcon,
  PencilIcon,
} from '@/components/bo/icons';
import { StatusBadge } from '@/components/bo/states/operational-states';
import type { GraphDetail } from '@/lib/product-workspace';

export function EditProductDetailsDrawer({
  projectId,
  productId,
  product,
  open,
  onClose,
}: {
  projectId: string;
  productId: string;
  product: {
    name: string;
    key: string;
    description?: string | null;
    status: string;
  };
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(product.name);
  const [key, setKey] = useState(product.key);
  const [description, setDescription] = useState(
    product.description ||
      'Modern lounge chair with premium upholstery and solid wood frame. Designed for comfort and timeless interiors.'
  );

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product details updated');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-in fade-in duration-150">
      <div className="w-full h-full sm:max-w-md bg-[var(--surface-pure)] border-l border-[var(--line)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[var(--ink)]">
                Edit product details
              </h3>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                Update product identity and core attributes
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              <CloseIcon size={16} />
            </button>
          </div>

          <form id="edit-product-form" onSubmit={handleSave} className="space-y-4">
            <Field label="Product Name" htmlFor="edit-product-name">
              <Input
                id="edit-product-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Product Key / Code" htmlFor="edit-product-key">
              <Input
                id="edit-product-key"
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="ui:font-mono"
              />
            </Field>

            <Field label="Description" htmlFor="edit-product-description">
              <Textarea
                id="edit-product-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </form>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--line)] pt-4 mt-6">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-product-form"
            size="sm"
            className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductOverview({
  projectId,
  product,
  detail,
  modelCount = 1,
  mappingCount = 1,
  onEditDetails,
  onConfigureOptions,
  onOpenVariants,
  onOpen3d,
  onOpenCommerce,
  onOpenActivity,
}: {
  projectId?: string;
  product: {
    name: string;
    key: string;
    status: string;
    description?: string | null;
  };
  detail: GraphDetail | null;
  modelCount?: number;
  mappingCount?: number;
  onEditDetails: () => void;
  onConfigureOptions: () => void;
  onOpenVariants?: () => void;
  onOpen3d: () => void;
  onOpenCommerce: () => void;
  onOpenActivity?: () => void;
}) {
  const toast = useToast();

  const galleryImages = [
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580481077197-28565a0db830?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=600&auto=format&fit=crop&q=80',
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [moreMetaExpanded, setMoreMetaExpanded] = useState(false);

  const productStatus =
    product.status === 'ACTIVE'
      ? 'ACTIVE'
      : product.status === 'ARCHIVED'
        ? 'ARCHIVED'
        : 'DRAFT';

  const statusRole =
    productStatus === 'ACTIVE'
      ? 'published'
      : productStatus === 'ARCHIVED'
        ? 'archived'
        : 'draft';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* MAIN LEFT COLUMN (~8 cols on Desktop, 12 cols on Mobile) */}
      <div className="space-y-6 lg:col-span-8">
        {/* Top Row: Product Overview + Configuration Structure */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Card 1: Product Overview Hero */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--ink)] mb-3">
                Product overview
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Left: Image Gallery */}
                <div className="sm:col-span-5 space-y-2">
                  <div className="relative h-52 sm:h-auto sm:aspect-square w-full rounded-xl border border-[var(--line)] bg-[#F8F7F5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-200"
                    />
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {galleryImages.slice(0, 4).map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative h-10 w-10 shrink-0 rounded-md border overflow-hidden transition-all ${
                          activeImageIndex === i
                            ? 'border-[#665CFF] ring-1 ring-[#665CFF]'
                            : 'border-[var(--line)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                    <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--canvas)] text-[10px] font-mono text-[var(--text-muted)]">
                      +3
                    </div>
                  </div>
                </div>

                {/* Right: Identity & Meta */}
                <div className="sm:col-span-7 space-y-2.5">
                  <div>
                    <h2 className="text-[16px] sm:text-[17px] font-semibold text-[var(--ink)] leading-snug">
                      {product.name}
                    </h2>
                    <p className="font-mono text-[12px] text-[var(--text-muted)]">
                      {product.key}
                    </p>
                  </div>

                  <div>
                    <StatusBadge role={statusRole} label={productStatus} />
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                    {product.description ||
                      'Modern lounge chair with premium upholstery and solid wood frame. Designed for comfort and timeless interiors.'}
                  </p>

                  <div className="space-y-1.5 border-t border-[var(--line)] pt-2.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Brand</span>
                      <span className="font-medium text-[var(--ink)]">CubeCom</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Category</span>
                      <span className="font-medium text-[var(--ink)]">Seating &gt; Lounge Chairs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Created</span>
                      <span className="text-[var(--text-secondary)]">Apr 28, 2025 by Demo Owner</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Updated</span>
                      <span className="text-[var(--text-secondary)]">May 14, 2025 by Demo Owner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--line)]">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
                onClick={onEditDetails}
              >
                <PencilIcon size={12} className="mr-1.5 inline" />
                <span>Edit details</span>
              </Button>
            </div>
          </div>

          {/* Card 2: Configuration Structure */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[var(--ink)]">
                  Configuration structure
                </p>
                <span className="rounded bg-[var(--canvas)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-muted)]">
                  4 options
                </span>
              </div>

              <div className="space-y-2.5 text-[12px]">
                {/* Color Choice */}
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink)]">Color</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Swatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-black border border-black/20" title="Black" />
                    <span className="h-3 w-3 rounded-full bg-white border border-gray-300" title="White" />
                    <span className="text-[11px] text-[var(--text-secondary)] ml-1">Black, White</span>
                  </div>
                </div>

                {/* Size Choice */}
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink)]">Size</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Choice</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                    <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5">L</span>
                    <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5">XL</span>
                  </div>
                </div>

                {/* Frame Choice */}
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink)]">Frame</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Choice</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Walnut, Oak
                  </div>
                </div>

                {/* Material Choice */}
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink)]">Material</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Choice</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Leather, Fabric
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--line)]">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
                onClick={onConfigureOptions}
              >
                <span>Configure options &rarr;</span>
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: Progressive Disclosure Operational Summary */}
        <div className="block lg:hidden rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs divide-y divide-[var(--line)] overflow-hidden">
          <div className="p-3.5 bg-[var(--canvas)]/40">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">
              Operational details &amp; state
            </h3>
          </div>

          {/* Status Row */}
          <div
            className="flex items-center justify-between p-3.5 hover:bg-[var(--canvas)]/40 cursor-pointer"
            onClick={() => toast.info('Status details: Published v1 on May 14, 2025')}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">Status</p>
              <p className="text-[11px] text-[var(--text-muted)]">Published v1 · May 14, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge role={statusRole} label={productStatus} />
              <ChevronRightIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Variants Row */}
          <div
            className="flex items-center justify-between p-3.5 hover:bg-[var(--canvas)]/40 cursor-pointer"
            onClick={onOpenVariants}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">Variants</p>
              <p className="text-[11px] text-[var(--text-muted)]">4 configured · All sellable</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--ink)]">
              <span>4 / 4</span>
              <ChevronRightIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>

          {/* 3D & Assets Row */}
          <div
            className="flex items-center justify-between p-3.5 hover:bg-[var(--canvas)]/40 cursor-pointer"
            onClick={onOpen3d}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">3D &amp; Assets</p>
              <p className="text-[11px] text-[var(--text-muted)]">{modelCount} model · 8 assets</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#665CFF] font-medium">
              <span>Studio</span>
              <ChevronRightIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Commerce Row */}
          <div
            className="flex items-center justify-between p-3.5 hover:bg-[var(--canvas)]/40 cursor-pointer"
            onClick={onOpenCommerce}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">Commerce</p>
              <p className="text-[11px] text-[var(--text-muted)]">1 channel · 4 active SKUs</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--ink)]">
              <span>$299–$349</span>
              <ChevronRightIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Activity Row */}
          <div
            className="flex items-center justify-between p-3.5 hover:bg-[var(--canvas)]/40 cursor-pointer"
            onClick={onOpenActivity}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--ink)]">Activity</p>
              <p className="text-[11px] text-[var(--text-muted)]">3 recent events</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#665CFF] font-medium">
              <span>Log</span>
              <ChevronRightIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>
        </div>

        {/* Primary Content Cards: Description + Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 3: Description */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Description</h3>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              {product.description ||
                'The Studio Chair pairs ergonomic design with refined craft. Precision-machined solid wood legs provide stability, while the hand-finished upholstery ensures lasting comfort for contract and residential use.'}
            </p>
            <div className="pt-2 border-t border-[var(--line)]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase mb-1.5">
                Key Features
              </h4>
              <ul className="space-y-1 text-[12px] text-[var(--text-secondary)] list-disc list-inside">
                <li>Commercial-grade contract durability</li>
                <li>FSC-certified solid wood components</li>
                <li>Modular upholstery replacement system</li>
              </ul>
            </div>
          </div>

          {/* Card 4: Attributes */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Attributes</h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between border-b border-[var(--line)]/60 pb-1.5">
                <span className="text-[var(--text-muted)]">Dimensions</span>
                <span className="font-mono text-[var(--ink)]">W 68 x D 74 x H 78 cm</span>
              </div>
              <div className="flex justify-between border-b border-[var(--line)]/60 pb-1.5">
                <span className="text-[var(--text-muted)]">Seat Height</span>
                <span className="font-mono text-[var(--ink)]">44 cm</span>
              </div>
              <div className="flex justify-between border-b border-[var(--line)]/60 pb-1.5">
                <span className="text-[var(--text-muted)]">Weight</span>
                <span className="font-mono text-[var(--ink)]">14.2 kg</span>
              </div>
              <div className="flex justify-between border-b border-[var(--line)]/60 pb-1.5">
                <span className="text-[var(--text-muted)]">Warranty</span>
                <span className="text-[var(--ink)]">5-Year Structural</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[var(--text-muted)]">Origin</span>
                <span className="text-[var(--ink)]">Portugal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metadata Cards (Desktop Full, Mobile Collapsible) */}
        <div className="space-y-4">
          <div className="lg:hidden">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMoreMetaExpanded((e) => !e)}
              className="ui:flex ui:h-auto ui:w-full ui:items-center ui:justify-between ui:rounded-xl ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:p-3.5 ui:text-[13px] ui:font-semibold ui:text-[var(--ink)] ui:shadow-xs ui:hover:bg-[var(--canvas)]"
            >
              <span>More product information (SEO, Linked Resources)</span>
              <span className="text-[12px] text-[var(--text-muted)] font-mono">
                {moreMetaExpanded ? '▲' : '▼'}
              </span>
            </Button>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              moreMetaExpanded ? 'block' : 'hidden lg:grid'
            }`}
          >
            {/* Card 5: SEO */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">SEO</h3>
              <div className="space-y-2 text-[12px]">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                    Title
                  </p>
                  <p className="font-medium text-[var(--ink)] mt-0.5">Studio Chair — CubeCom</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                    Handle / Slug
                  </p>
                  <p className="font-mono text-[11px] text-[var(--text-secondary)] mt-0.5">
                    /products/studio-chair
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                    Description
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Configure your bespoke Studio Chair with custom leather and walnut finishes.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6: Linked Resources */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">Linked Resources</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between rounded-lg border border-[var(--line)] p-2 hover:bg-[var(--canvas)] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <LayersIcon size={14} className="text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--ink)]">Assembly Guide (PDF)</span>
                  </div>
                  <ExternalLinkIcon size={12} className="text-[var(--text-muted)]" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[var(--line)] p-2 hover:bg-[var(--canvas)] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <LayersIcon size={14} className="text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--ink)]">Material Specs & Care</span>
                  </div>
                  <ExternalLinkIcon size={12} className="text-[var(--text-muted)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY: RIGHT SIDEBAR COLUMN (~4 cols / 340px) */}
      <div className="hidden lg:block lg:col-span-4 space-y-4">
        {/* Block 1: Status */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Status</h3>
            <StatusBadge role={statusRole} label={productStatus} />
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Published version</span>
              <span className="font-mono font-medium text-[var(--ink)]">v1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Published</span>
              <span className="text-[var(--text-secondary)]">May 14, 2025 10:24 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Next version</span>
              <span className="text-[var(--text-muted)]">—</span>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
            onClick={() => toast.info('Creating new draft version...')}
          >
            Create new version
          </Button>
        </div>

        {/* Block 2: Variants */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">Variants</h3>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Total variants</span>
              <span className="font-mono font-semibold text-[var(--ink)]">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Configured</span>
              <span className="font-mono font-semibold text-[var(--ink)]">4</span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
            onClick={onOpenVariants ?? onOpenCommerce}
          >
            View variants
          </Button>
        </div>

        {/* Block 3: 3D & Assets */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">3D &amp; Assets</h3>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">3D model</span>
              <span className="font-mono font-semibold text-[var(--ink)]">{modelCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Assets</span>
              <span className="font-mono font-semibold text-[var(--ink)]">8</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpen3d}
            className="ui:h-auto ui:justify-start ui:px-0 ui:pt-1 ui:text-[12px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
          >
            Open Studio →
          </Button>
        </div>

        {/* Block 4: Commerce */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">Commerce</h3>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Mapped channels</span>
              <span className="font-mono font-semibold text-[var(--ink)]">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Active SKUs</span>
              <span className="font-mono font-semibold text-[var(--ink)]">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Price range</span>
              <span className="font-mono font-semibold text-[var(--ink)]">$299.00 - $349.00</span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
            onClick={onOpenCommerce}
          >
            Manage commerce
          </Button>
        </div>

        {/* Block 5: Activity */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Activity</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ui:h-auto ui:px-0 ui:text-[11px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
              onClick={onOpenActivity ?? (() => toast.info('Viewing full activity audit log'))}
            >
              View all
            </Button>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
              <div className="min-w-0 text-[12px]">
                <p className="font-medium text-[var(--ink)]">Product published</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  May 14, 2025 10:24 AM by Demo Owner
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
              <div className="min-w-0 text-[12px]">
                <p className="font-medium text-[var(--ink)]">Configuration updated</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  May 13, 2025 3:45 PM by Demo Owner
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
              <div className="min-w-0 text-[12px]">
                <p className="font-medium text-[var(--ink)]">Product created</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Apr 28, 2025 9:11 AM by Demo Owner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
