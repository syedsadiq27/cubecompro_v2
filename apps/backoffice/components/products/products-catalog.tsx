'use client';

import {
  AttentionState,
  BackofficePageHeader,
  BulkActionBar,
  ClearFiltersButton,
  DownloadIcon,
  EmptyState,
  InspectorActionCards,
  MoreFiltersButton,
  PlusIcon,
  RowActionMenu,
  StatusBadge,
  ToolbarSettingsButton,
  UploadIcon,
  ViewModeSwitcher,
} from '@/components/bo';
import { BoxIcon, ChevronRightIcon, PencilIcon } from '@/components/bo/icons';
import type { CommerceHealth, CommerceSignals } from '@/lib/commerce-signals';
import {
  formatListStatus,
  toOperationalStatus,
  toStatusGrammarRole,
} from '@/lib/product-status';
import {
  Button,
  cn,
  ConfirmDialog,
  DataTable,
  FilterBar,
  FilterSelect,
  FilterTab,
  FilterTabs,
  InspectorBody,
  InspectorField,
  InspectorHeader,
  InspectorSection,
  InspectorThumb,
  InspectorWorkspace,
  ListWorkspace,
  PageWorkspace,
  PageWorkspaceBody,
  SearchField,
  useToast,
} from '@repo/ui';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { setProductStatusAction, softDeleteProductAction } from '@/actions/products';
import { ImportModal } from './import-modal';

export type CatalogProduct = {
  id: string;
  name: string;
  code: string;
  statusName: string | null;
  imageUrl: string | null;
  categoryNames: string[];
  brandLabel: string | null;
  description?: string | null;
  createdLabel?: string | null;
  updatedDate?: string | null;
  updatedTime?: string | null;
  modelCount: number;
  hasModels: boolean;
  updatedLabel: string | null;
  signals: CommerceSignals;
};

const INITIAL_DEMO_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod_01JTN0Z8KQ7F3S5VZ6Q1E2P4X9',
    name: 'Studio Chair',
    code: 'CHAIR-01',
    statusName: 'ACTIVE',
    imageUrl:
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&auto=format&fit=crop&q=80',
    categoryNames: ['Seating'],
    brandLabel: 'CubeCom',
    description: 'Modern studio chair with premium materials and ergonomic design.',
    createdLabel: 'Apr 28, 2025 by Demo Owner',
    updatedLabel: 'May 14, 2025 by Demo Owner',
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
    modelCount: 1,
    hasModels: true,
    signals: {
      health: 'mapping_required',
      healthLabel: 'Mapping required',
      needsAttention: true,
      skuCount: 1,
      configurationCount: 1,
      mappedCount: 0,
      channel: null,
      channelLabel: '0',
      priceLabel: 'No price',
      hasPrice: false,
      threeDReady: true,
      commerceMapped: false,
    },
  },
  {
    id: 'prod_01JTN0Z8KQ7F3S5VZ6Q1E2P4TB',
    name: 'Dining Table',
    code: 'TABLE-01',
    statusName: 'ACTIVE',
    imageUrl:
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=120&auto=format&fit=crop&q=80',
    categoryNames: ['Tables'],
    brandLabel: 'CubeCom',
    description: 'Solid oak dining table for contemporary homes.',
    createdLabel: 'Apr 20, 2025 by Demo Owner',
    updatedLabel: 'May 12, 2025 by Demo Owner',
    updatedDate: 'May 12, 2025',
    updatedTime: '3:18 PM',
    modelCount: 1,
    hasModels: true,
    signals: {
      health: 'ready',
      healthLabel: 'Mapped to 2 channels',
      needsAttention: false,
      skuCount: 4,
      configurationCount: 2,
      mappedCount: 2,
      channel: 'Shopify',
      channelLabel: '2 channels',
      priceLabel: '$450',
      hasPrice: true,
      threeDReady: true,
      commerceMapped: true,
    },
  },
  {
    id: 'prod_01JTN0Z8KQ7F3S5VZ6Q1E2P4SF',
    name: 'Lounge Sofa',
    code: 'SOFA-01',
    statusName: 'DRAFT',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=80',
    categoryNames: ['Seating'],
    brandLabel: 'CubeCom',
    description: 'Deep cushion lounge sofa with modular sectionals.',
    createdLabel: 'Apr 15, 2025 by Demo Owner',
    updatedLabel: 'May 10, 2025 by Demo Owner',
    updatedDate: 'May 10, 2025',
    updatedTime: '11:05 AM',
    modelCount: 1,
    hasModels: true,
    signals: {
      health: 'mapping_required',
      healthLabel: 'Mapping required',
      needsAttention: true,
      skuCount: 2,
      configurationCount: 2,
      mappedCount: 0,
      channel: null,
      channelLabel: '0',
      priceLabel: 'No price',
      hasPrice: false,
      threeDReady: true,
      commerceMapped: false,
    },
  },
  {
    id: 'prod_01JTN0Z8KQ7F3S5VZ6Q1E2P4LP',
    name: 'Floor Lamp',
    code: 'LAMP-01',
    statusName: 'ACTIVE',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&auto=format&fit=crop&q=80',
    categoryNames: ['Lighting'],
    brandLabel: 'CubeCom',
    description: 'Minimalist ambient floor lamp with brass accents.',
    createdLabel: 'Apr 10, 2025 by Demo Owner',
    updatedLabel: 'May 8, 2025 by Demo Owner',
    updatedDate: 'May 8, 2025',
    updatedTime: '9:42 AM',
    modelCount: 1,
    hasModels: true,
    signals: {
      health: 'ready',
      healthLabel: 'Mapped to 1 channel',
      needsAttention: false,
      skuCount: 1,
      configurationCount: 1,
      mappedCount: 1,
      channel: 'Shopify',
      channelLabel: '1 channel',
      priceLabel: '$120',
      hasPrice: true,
      threeDReady: true,
      commerceMapped: true,
    },
  },
];

type StatusFilter = 'all' | 'published' | 'draft' | 'cancelled';
type SortKey = 'name' | 'status' | 'commerce' | 'config' | 'skus' | 'updated';
type SortDirection = 'asc' | 'desc';

function commerceTone(
  health: CommerceHealth
): 'warning' | 'success' | 'danger' | 'neutral' {
  if (health === 'ready') return 'success';
  if (health === 'configuration_errors') return 'danger';
  return 'warning';
}

function exportToCsv(products: CatalogProduct[]) {
  const headers = [
    'Product ID',
    'Name',
    'SKU',
    'Status',
    'Category',
    'Brand',
    'Commerce Health',
    'Config Count',
    'SKU Count',
    'Updated Date',
    'Updated Time',
  ];
  const rows = products.map((p) => [
    `"${p.id}"`,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.code || ''}"`,
    `"${p.statusName || 'ACTIVE'}"`,
    `"${p.categoryNames.join('; ')}"`,
    `"${p.brandLabel || 'CubeCom'}"`,
    `"${p.signals.healthLabel}"`,
    `"${p.signals.mappedCount}/${p.signals.configurationCount}"`,
    `"${p.signals.skuCount}"`,
    `"${p.updatedDate || ''}"`,
    `"${p.updatedTime || ''}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
    '\n'
  );
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `cubecom-products-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ProductsCatalog({
  projectId,
  products: initialProducts,
}: {
  projectId: string;
  products: CatalogProduct[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [catalog, setCatalog] = useState<CatalogProduct[]>(
    initialProducts.length > 0 ? initialProducts : INITIAL_DEMO_PRODUCTS
  );

  useEffect(() => {
    if (initialProducts.length > 0) {
      setCatalog(initialProducts);
    }
  }, [initialProducts]);

  // Filter States initialized from URL params if present
  const initialStatusParam = (searchParams.get('status') as StatusFilter) || 'all';
  const initialCommerceParam = searchParams.get('commerce') || 'all';
  const initialQueryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQueryParam);
  const [status, setStatus] = useState<StatusFilter>(initialStatusParam);
  const [commerceFilter, setCommerceFilter] = useState(initialCommerceParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasModelsOnly, setHasModelsOnly] = useState(false);

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // UI States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set([catalog[0]?.id].filter(Boolean) as string[])
  );
  const [inspectId, setInspectId] = useState<string | null>(
    catalog[0]?.id ?? null
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [importOpen, setImportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    body: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    body: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update URL Search Params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (status !== 'all') params.set('status', status);
    if (commerceFilter !== 'all') params.set('commerce', commerceFilter);
    if (page > 1) params.set('page', String(page));

    const paramString = params.toString();
    const targetUrl = paramString ? `${pathname}?${paramString}` : pathname;
    window.history.replaceState(null, '', targetUrl);
  }, [query, status, commerceFilter, page, pathname]);

  // All distinct categories for More Filters
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const p of catalog) {
      for (const c of p.categoryNames) set.add(c);
    }
    return Array.from(set);
  }, [catalog]);

  // Filter tab counts
  const counts = useMemo(() => {
    let published = 0;
    let draft = 0;
    let cancelled = 0;
    for (const product of catalog) {
      const operational = toOperationalStatus(product.statusName);
      if (operational === 'published') published += 1;
      else if (operational === 'draft') draft += 1;
      else if (operational === 'cancelled') cancelled += 1;
    }
    return { all: catalog.length, published, draft, cancelled };
  }, [catalog]);

  // Filtering + Sorting
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = catalog.filter((product) => {
      const operational = toOperationalStatus(product.statusName);
      if (status !== 'all' && operational !== status) return false;
      if (commerceFilter === 'attention' && !product.signals.needsAttention) {
        return false;
      }
      if (commerceFilter === 'ready' && product.signals.health !== 'ready') {
        return false;
      }
      if (
        selectedCategory !== 'all' &&
        !product.categoryNames.includes(selectedCategory)
      ) {
        return false;
      }
      if (hasModelsOnly && !product.hasModels) {
        return false;
      }
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.code.toLowerCase().includes(needle) ||
        (product.brandLabel || '').toLowerCase().includes(needle) ||
        product.categoryNames.some((name) =>
          name.toLowerCase().includes(needle)
        )
      );
    });

    return result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === 'status') {
        cmp = (a.statusName || '').localeCompare(b.statusName || '');
      } else if (sortKey === 'commerce') {
        cmp = a.signals.healthLabel.localeCompare(b.signals.healthLabel);
      } else if (sortKey === 'config') {
        cmp = a.signals.mappedCount - b.signals.mappedCount;
      } else if (sortKey === 'skus') {
        cmp = a.signals.skuCount - b.signals.skuCount;
      } else if (sortKey === 'updated') {
        cmp = (a.updatedDate || '').localeCompare(b.updatedDate || '');
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [
    catalog,
    query,
    status,
    commerceFilter,
    selectedCategory,
    hasModelsOnly,
    sortKey,
    sortDirection,
  ]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const inspected =
    filtered.find((product) => product.id === inspectId) ??
    catalog.find((product) => product.id === inspectId) ??
    null;

  const allPageSelected =
    pageItems.length > 0 &&
    pageItems.every((product) => selectedIds.has(product.id));
  const somePageSelected = pageItems.some((product) =>
    selectedIds.has(product.id)
  );

  const hasActiveFilters =
    status !== 'all' ||
    commerceFilter !== 'all' ||
    selectedCategory !== 'all' ||
    hasModelsOnly ||
    query.trim().length > 0;

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setCommerceFilter('all');
    setSelectedCategory('all');
    setHasModelsOnly(false);
    setPage(1);
    toast.info('Filters cleared');
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const togglePage = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const product of pageItems) {
        if (checked) next.add(product.id);
        else next.delete(product.id);
      }
      return next;
    });
  };

  const openInspector = (id: string) => {
    setInspectId(id);
  };

  const closeInspector = () => {
    setInspectId(null);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Product ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Actions
  const handleBulkPublish = () => {
    const count = selectedIds.size;
    setCatalog((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, statusName: 'ACTIVE' } : p
      )
    );
    setSelectedIds(new Set());
    toast.success(`${count} product${count === 1 ? '' : 's'} published`);
  };

  const handleBulkArchive = () => {
    const ids = [...selectedIds];
    const count = ids.length;
    if (count === 0) return;
    setConfirmDialog({
      open: true,
      title: `Archive ${count} product${count === 1 ? '' : 's'}?`,
      body: 'Archived products leave the active catalog. Attached 3D models used only by these products are archived too. Shared models stay published.',
      confirmLabel: 'Archive',
      danger: false,
      onConfirm: () => {
        startTransition(async () => {
          const results = await Promise.all(
            ids.map((id) => setProductStatusAction(projectId, id, 'ARCHIVED'))
          );
          const failed = results.find((result) => !result.ok);
          if (failed) {
            toast.error(failed.error || 'Archive failed.');
            return;
          }
          setSelectedIds(new Set());
          setConfirmDialog((d) => ({ ...d, open: false }));
          toast.success(
            `${count} product${count === 1 ? '' : 's'} archived`
          );
          router.refresh();
        });
      },
    });
  };

  const handleBulkDelete = () => {
    const ids = [...selectedIds];
    const count = ids.length;
    if (count === 0) return;
    setConfirmDialog({
      open: true,
      title: `Delete ${count} product${count === 1 ? '' : 's'}?`,
      body: 'This permanently removes the selected products from the catalog. This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        startTransition(async () => {
          const results = await Promise.all(
            ids.map((id) => softDeleteProductAction(projectId, id))
          );
          const failed = results.find((result) => !result.ok);
          if (failed) {
            toast.error(failed.error || 'Delete failed.');
            return;
          }
          setCatalog((prev) => prev.filter((p) => !ids.includes(p.id)));
          if (inspectId && ids.includes(inspectId)) setInspectId(null);
          setSelectedIds(new Set());
          setConfirmDialog((d) => ({ ...d, open: false }));
          toast.success(`Deleted ${count} product${count === 1 ? '' : 's'}`);
          router.refresh();
        });
      },
    });
  };

  const handleSingleArchive = (product: CatalogProduct) => {
    const isArchived = product.statusName?.toUpperCase() === 'ARCHIVED';
    if (isArchived) {
      setConfirmDialog({
        open: true,
        title: `Restore “${product.name}”?`,
        body: 'This returns the product to the active catalog.',
        confirmLabel: 'Restore',
        danger: false,
        onConfirm: () => {
          startTransition(async () => {
            const result = await setProductStatusAction(
              projectId,
              product.id,
              'ACTIVE'
            );
            if (!result.ok) {
              toast.error(result.error || 'Restore failed.');
              return;
            }
            setConfirmDialog((d) => ({ ...d, open: false }));
            toast.success(`${product.name} restored`);
            router.refresh();
          });
        },
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: `Archive “${product.name}”?`,
      body: 'Archived products leave the active catalog. Attached 3D models used only by these products are archived too. Shared models stay published.',
      confirmLabel: 'Archive',
      danger: false,
      onConfirm: () => {
        startTransition(async () => {
          const result = await setProductStatusAction(
            projectId,
            product.id,
            'ARCHIVED'
          );
          if (!result.ok) {
            toast.error(result.error || 'Archive failed.');
            return;
          }
          setConfirmDialog((d) => ({ ...d, open: false }));
          toast.success(`${product.name} archived`);
          router.refresh();
        });
      },
    });
  };

  const handleDuplicate = (product: CatalogProduct) => {
    const copy: CatalogProduct = {
      ...product,
      id: `prod_${Date.now()}_copy`,
      name: `${product.name} (Copy)`,
      code: `${product.code}-COPY`,
      statusName: 'DRAFT',
      updatedDate: 'Today',
      updatedTime: 'Just now',
      updatedLabel: 'Just now',
    };
    setCatalog((prev) => [copy, ...prev]);
    setInspectId(copy.id);
    toast.success(`Created copy of ${product.name}`);
  };

  const handleSingleDelete = (product: CatalogProduct) => {
    setConfirmDialog({
      open: true,
      title: `Delete “${product.name}”?`,
      body: 'This permanently removes the product from the catalog. This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        startTransition(async () => {
          const result = await softDeleteProductAction(projectId, product.id);
          if (!result.ok) {
            toast.error(result.error || 'Delete failed.');
            return;
          }
          setCatalog((prev) => prev.filter((p) => p.id !== product.id));
          if (inspectId === product.id) setInspectId(null);
          setConfirmDialog((d) => ({ ...d, open: false }));
          toast.success(`Deleted ${product.name}`);
          router.refresh();
        });
      },
    });
  };

  const handleImport = (newProducts: CatalogProduct[]) => {
    setCatalog((prev) => [...newProducts, ...prev]);
    if (newProducts.length > 0) {
      setInspectId(newProducts[0]!.id);
    }
    toast.success(`Successfully imported ${newProducts.length} products`);
  };

  const handleExport = () => {
    exportToCsv(filtered);
    toast.success(`Exported ${filtered.length} products to CSV`);
  };

  const rangeStart =
    filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length);

  return (
    <PageWorkspace
      inspector={
        <InspectorWorkspace open={Boolean(inspected)} onClose={closeInspector}>
          {inspected ? (
            <>
              <InspectorHeader
                title={inspected.name}
                subtitle={inspected.code || '—'}
                status={
                  <StatusBadge
                    role={toStatusGrammarRole(inspected.statusName)}
                    label={formatListStatus(inspected.statusName)}
                  />
                }
                thumbnail={<InspectorThumb src={inspected.imageUrl} />}
                onClose={closeInspector}
              />
              <InspectorActionCards
                configureHref={`/${projectId}/products/${inspected.id}?tab=options`}
                editHref={`/${projectId}/products/${inspected.id}`}
                mapCommerceHref={`/${projectId}/products/${inspected.id}?tab=commerce`}
                onMore={() =>
                  router.push(`/${projectId}/products/${inspected.id}`)
                }
              />
              <InspectorBody>
                <InspectorSection title="Summary">
                  <div className="space-y-2">
                  <InspectorField
                    label="Description"
                    value={
                      inspected.description ||
                      'Modern studio chair with premium materials and ergonomic design.'
                    }
                  />
                  <InspectorField
                    label="Category"
                    value={inspected.categoryNames.join(', ') || 'Seating'}
                  />
                  <InspectorField
                    label="Brand"
                    value={inspected.brandLabel || 'CubeCom'}
                  />
                  <InspectorField
                    label="Created"
                    value={inspected.createdLabel || 'Apr 28, 2025 by Demo Owner'}
                  />
                  <InspectorField
                    label="Updated"
                    value={inspected.updatedLabel || 'May 14, 2025 by Demo Owner'}
                  />
                  </div>
                </InspectorSection>
                <InspectorSection title="Details">
                  <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 py-0.5 text-[11px] sm:text-[12px]">
                    <span className="shrink-0 text-[var(--text-secondary)]">
                      Product ID
                    </span>
                    <button
                      type="button"
                      title="Click to copy Product ID"
                      onClick={() => handleCopyId(inspected.id)}
                      className="group flex max-w-[68%] items-center justify-end gap-1.5 truncate rounded px-1 py-0.5 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--brand)]"
                    >
                      <span className="truncate">{inspected.id}</span>
                      <span className="shrink-0 text-[10px] text-[var(--text-muted)] group-hover:text-[var(--brand)]">
                        {copiedId === inspected.id ? '✓' : '❐'}
                      </span>
                    </button>
                  </div>
                  <InspectorField
                    label="Config"
                    value={`${inspected.signals.mappedCount} of ${inspected.signals.configurationCount} configured`}
                    href={`/${projectId}/products/${inspected.id}?tab=options`}
                    affordance
                  />
                  <InspectorField
                    label="SKUs"
                    value={String(inspected.signals.skuCount)}
                    href={`/${projectId}/products/${inspected.id}`}
                    affordance
                  />
                  <InspectorField
                    label="Commerce mappings"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            inspected.signals.health === 'ready'
                              ? 'bg-[#34A853]'
                              : 'bg-[#B06000]'
                          }`}
                        />
                        <span>{inspected.signals.healthLabel}</span>
                      </span>
                    }
                    href={`/${projectId}/products/${inspected.id}?tab=commerce`}
                    affordance
                  />
                  <InspectorField
                    label="Assets"
                    value="3"
                    href={`/${projectId}/library`}
                    affordance
                  />
                  <InspectorField
                    label="Channels"
                    value={
                      inspected.signals.channel
                        ? inspected.signals.channelLabel
                        : '0'
                    }
                    href={`/${projectId}/settings/commerce`}
                    affordance
                  />
                  </div>
                </InspectorSection>
              </InspectorBody>
            </>
          ) : null}
        </InspectorWorkspace>
      }
    >
      <BackofficePageHeader
        title="Products"
        count={`${filtered.length} items`}
        actions={
          <BackofficePageHeader.Actions
            secondary={
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setImportOpen(true)}
                  className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3 ui:rounded-lg ui:text-[13px] ui:font-medium"
                >
                  <UploadIcon size={15} />
                  <span>Import</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleExport}
                  className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3 ui:rounded-lg ui:text-[13px] ui:font-medium"
                >
                  <DownloadIcon size={15} />
                  <span>Export</span>
                </Button>
              </>
            }
            primary={
              <Button
                as={Link}
                href={`/${projectId}/products/new`}
                size="sm"
                className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3.5 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[13px] ui:font-medium ui:shadow-xs"
              >
                <PlusIcon size={15} />
                <span>New product</span>
              </Button>
            }
          />
        }
      />

      <ListWorkspace
        views={
          <FilterTabs>
            <FilterTab
              label="All"
              count={counts.all}
              active={status === 'all'}
              onClick={() => {
                setStatus('all');
                setPage(1);
              }}
            />
            <FilterTab
              label="Active"
              count={counts.published}
              active={status === 'published'}
              onClick={() => {
                setStatus('published');
                setPage(1);
              }}
            />
            <FilterTab
              label="Draft"
              count={counts.draft}
              active={status === 'draft'}
              onClick={() => {
                setStatus('draft');
                setPage(1);
              }}
            />
            <FilterTab
              label="Archived"
              count={counts.cancelled}
              active={status === 'cancelled'}
              onClick={() => {
                setStatus('cancelled');
                setPage(1);
              }}
            />
          </FilterTabs>
        }
        toolbar={
          <div className="relative">
            <FilterBar
              variant="toolbar"
              end={
                <>
                  {hasActiveFilters ? (
                    <ClearFiltersButton onClick={clearFilters} />
                  ) : null}
                  <ViewModeSwitcher
                    mode={viewMode}
                    onChange={(m) => setViewMode(m)}
                  />
                  <ToolbarSettingsButton
                    onClick={() => setMoreOpen((open) => !open)}
                  />
                </>
              }
            >
              <SearchField
                value={query}
                onChange={(value) => {
                  setQuery(value);
                  setPage(1);
                }}
                placeholder="Search products..."
              />
              <FilterSelect
                value={status}
                aria-label="Status"
                onChange={(event) => {
                  setStatus(event.target.value as StatusFilter);
                  setPage(1);
                }}
              >
                <option value="all">Status</option>
                <option value="published">Active</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Archived</option>
              </FilterSelect>
              <FilterSelect
                value={commerceFilter}
                aria-label="Commerce"
                onChange={(event) => {
                  setCommerceFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Commerce</option>
                <option value="attention">Needs attention</option>
                <option value="ready">Ready</option>
              </FilterSelect>
              <MoreFiltersButton
                active={moreOpen || selectedCategory !== 'all' || hasModelsOnly}
                onClick={() => setMoreOpen((open) => !open)}
              />
            </FilterBar>

            {moreOpen ? (
              <div className="absolute top-full left-0 z-40 mt-1.5 w-[min(320px,94vw)] rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 text-[13px] shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                  <p className="font-semibold text-[var(--ink)]">More filters</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setHasModelsOnly(false);
                    }}
                    className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--ink)]"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-3 space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2 text-[12px] text-[var(--ink)] outline-none"
                    >
                      <option value="all">All Categories</option>
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[12px] text-[var(--ink)] font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasModelsOnly}
                        onChange={(e) => setHasModelsOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-[var(--line)] accent-[var(--ink)]"
                      />
                      <span>Has 3D models only</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-[var(--line)] pt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setMoreOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                    onClick={() => setMoreOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        }
        bulk={
          <BulkActionBar
            count={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleBulkPublish}
            >
              Publish
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={handleBulkArchive}
            >
              Archive
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="ui:text-[var(--text-secondary)] ui:hover:text-red-700 ui:hover:bg-red-50"
              onClick={handleBulkDelete}
            >
              Delete
            </Button>
          </BulkActionBar>
        }
      />

      <PageWorkspaceBody flush>
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              variant="filtered"
              title="No products match these filters"
              onClearFilters={clearFilters}
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
            {pageItems.map((product) => {
              const inspecting = inspectId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => openInspector(product.id)}
                  className={cn(
                    'group relative flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 transition-all cursor-pointer hover:shadow-sm hover:border-[var(--border-strong)]',
                    inspecting && 'ring-2 ring-[var(--ink)] border-transparent bg-[var(--canvas)]/40'
                  )}
                >
                  <div className="relative aspect-square w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] overflow-hidden">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                        <BoxIcon size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge
                        role={toStatusGrammarRole(product.statusName)}
                        label={formatListStatus(product.statusName)}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold text-[14px] text-[var(--ink)] leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {product.code}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[11px]">
                      <AttentionState
                        label={product.signals.healthLabel}
                        tone={commerceTone(product.signals.health)}
                      />
                      <span className="text-[var(--text-muted)] font-mono">
                        {product.signals.skuCount} SKU
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <DataTable
            variant="fill"
            minWidth={780}
            footer={
              <DataTable.Footer
                totalItems={filtered.length}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                currentPage={currentPage}
                pageCount={pageCount}
                onPrevious={() => setPage((v) => Math.max(1, v - 1))}
                onNext={() => setPage((v) => Math.min(pageCount, v + 1))}
              />
            }
          >
            <DataTable.Header sticky>
              <tr>
                <DataTable.HeaderCheckboxCell
                  checked={allPageSelected}
                  indeterminate={somePageSelected && !allPageSelected}
                  ariaLabel="Select all on page"
                  onChange={togglePage}
                />
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'name' ? sortDirection : undefined}
                  onSort={() => handleSort('name')}
                >
                  Product
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'status' ? sortDirection : undefined}
                  onSort={() => handleSort('status')}
                >
                  Status
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'commerce' ? sortDirection : undefined}
                  onSort={() => handleSort('commerce')}
                >
                  Commerce
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'config' ? sortDirection : undefined}
                  onSort={() => handleSort('config')}
                >
                  Config
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'skus' ? sortDirection : undefined}
                  onSort={() => handleSort('skus')}
                >
                  SKUs
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'updated' ? sortDirection : undefined}
                  onSort={() => handleSort('updated')}
                >
                  Updated
                </DataTable.HeaderCell>
                <DataTable.HeaderCell align="right" className="w-16">
                  Actions
                </DataTable.HeaderCell>
              </tr>
            </DataTable.Header>
            <tbody>
              {pageItems.map((product) => {
                const bulkSelected = selectedIds.has(product.id);
                const inspecting = inspectId === product.id;
                return (
                  <DataTable.Row
                    key={product.id}
                    selected={inspecting || bulkSelected}
                    onClick={() => openInspector(product.id)}
                  >
                    <DataTable.CheckboxCell
                      checked={bulkSelected}
                      ariaLabel={`Select ${product.name}`}
                      onChange={(checked) => {
                        toggleSelected(product.id, checked);
                      }}
                    />
                    <DataTable.IdentityCell
                      title={product.name}
                      subtitle={product.code || product.brandLabel || '—'}
                      href={`/${projectId}/products/${product.id}`}
                      thumbnailUrl={product.imageUrl}
                    />
                    <DataTable.Cell>
                      <StatusBadge
                        role={toStatusGrammarRole(product.statusName)}
                        label={formatListStatus(product.statusName)}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <AttentionState
                        label={product.signals.healthLabel}
                        tone={commerceTone(product.signals.health)}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {product.signals.mappedCount}/
                      {product.signals.configurationCount}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {product.signals.skuCount}
                    </DataTable.Cell>
                    <DataTable.DateCell
                      date={product.updatedDate || 'May 14, 2025'}
                      time={product.updatedTime || '10:24 AM'}
                    />
                    <DataTable.ActionsCell>
                      <RowActionMenu
                        label={`Actions for ${product.name}`}
                        items={[
                          {
                            id: 'inspect',
                            label: inspecting
                              ? 'Close inspector'
                              : 'Inspect details',
                            onClick: () =>
                              setInspectId((current) =>
                                current === product.id ? null : product.id
                              ),
                          },
                          {
                            id: 'configure',
                            label: 'Configure options',
                            onClick: () =>
                              router.push(
                                `/${projectId}/products/${product.id}?tab=options`
                              ),
                          },
                          {
                            id: 'edit',
                            label: 'Edit details',
                            onClick: () =>
                              router.push(
                                `/${projectId}/products/${product.id}`
                              ),
                          },
                          {
                            id: 'map_commerce',
                            label: 'Map commerce',
                            onClick: () =>
                              router.push(
                                `/${projectId}/products/${product.id}?tab=commerce`
                              ),
                          },
                          {
                            id: 'studio',
                            label: 'Open 3D Studio',
                            onClick: () =>
                              router.push(
                                `/${projectId}/products/${product.id}?tab=3d`
                              ),
                          },
                          {
                            id: 'duplicate',
                            label: 'Duplicate product',
                            separatorBefore: true,
                            onClick: () => handleDuplicate(product),
                          },
                          {
                            id: 'archive',
                            label:
                              product.statusName?.toUpperCase() === 'ARCHIVED'
                                ? 'Restore product'
                                : 'Archive product',
                            onClick: () => handleSingleArchive(product),
                          },
                          {
                            id: 'delete',
                            label: 'Delete product',
                            danger: true,
                            separatorBefore: true,
                            onClick: () => handleSingleDelete(product),
                          },
                        ]}
                      />
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </PageWorkspaceBody>

      {/* Real Import Modal */}
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      {/* Confirmation Dialog for Destructive Actions */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        body={confirmDialog.body}
        confirmLabel={confirmDialog.confirmLabel}
        danger={confirmDialog.danger}
        pending={pending}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, open: false }))}
      />
    </PageWorkspace>
  );
}
