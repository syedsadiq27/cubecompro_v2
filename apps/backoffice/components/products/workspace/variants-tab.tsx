'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  DataTable,
  Field,
  Input,
  Select,
  useToast,
} from '@repo/ui';
import {
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  EyeIcon,
  SearchIcon,
  TagIcon,
} from '@/components/bo/icons';
import { RowActionMenu } from '@/components/bo';
import type { GraphDetail } from '@/lib/product-workspace';

export type VariantCombination = {
  id: string;
  combination: string;
  options: {
    color: string;
    size: string;
    frame: string;
    material: string;
  };
  valid: boolean;
  blockedReason?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  inventory?: number;
  inventoryLabel?: string;
  commerceStatus: 'Mapped' | 'Blocked by rule' | 'Unmapped';
  materials: {
    fabric: string;
    frame: string;
  };
};

const DEFAULT_VARIANTS: VariantCombination[] = [
  {
    id: 'var_1',
    combination: 'Black / XL / Walnut / Leather',
    options: { color: 'Black', size: 'XL', frame: 'Walnut', material: 'Leather' },
    valid: true,
    sku: 'SKU-BLK-XL-WAL',
    barcode: '849201948201',
    price: 349.0,
    inventory: 12,
    inventoryLabel: '12 in stock',
    commerceStatus: 'Mapped',
    materials: { fabric: 'Material_Black_Leather', frame: 'Material_Walnut_Wood' },
  },
  {
    id: 'var_2',
    combination: 'White / XL / Walnut / Leather',
    options: { color: 'White', size: 'XL', frame: 'Walnut', material: 'Leather' },
    valid: false,
    blockedReason: 'Blocked by Rule #1: White is not available for leather material.',
    commerceStatus: 'Blocked by rule',
    materials: { fabric: 'Material_White_Leather', frame: 'Material_Walnut_Wood' },
  },
  {
    id: 'var_3',
    combination: 'Black / L / Oak / Leather',
    options: { color: 'Black', size: 'L', frame: 'Oak', material: 'Leather' },
    valid: true,
    sku: 'SKU-BLK-L-OAK',
    barcode: '849201948202',
    price: 329.0,
    inventory: 4,
    inventoryLabel: '4 in stock',
    commerceStatus: 'Mapped',
    materials: { fabric: 'Material_Black_Leather', frame: 'Material_Oak_Wood' },
  },
  {
    id: 'var_4',
    combination: 'White / L / Oak / Leather',
    options: { color: 'White', size: 'L', frame: 'Oak', material: 'Leather' },
    valid: false,
    blockedReason: 'Blocked by Rule #1: White is not available for leather material.',
    commerceStatus: 'Blocked by rule',
    materials: { fabric: 'Material_White_Leather', frame: 'Material_Oak_Wood' },
  },
  {
    id: 'var_5',
    combination: 'Black / XL / Oak / Leather',
    options: { color: 'Black', size: 'XL', frame: 'Oak', material: 'Leather' },
    valid: true,
    sku: 'SKU-BLK-XL-OAK',
    barcode: '849201948203',
    price: 349.0,
    inventory: 7,
    inventoryLabel: '7 in stock',
    commerceStatus: 'Mapped',
    materials: { fabric: 'Material_Black_Leather', frame: 'Material_Oak_Wood' },
  },
  {
    id: 'var_6',
    combination: 'Black / L / Walnut / Leather',
    options: { color: 'Black', size: 'L', frame: 'Walnut', material: 'Leather' },
    valid: true,
    sku: 'SKU-BLK-L-WAL',
    barcode: '849201948204',
    price: 329.0,
    inventory: 15,
    inventoryLabel: '15 in stock',
    commerceStatus: 'Mapped',
    materials: { fabric: 'Material_Black_Leather', frame: 'Material_Walnut_Wood' },
  },
  {
    id: 'var_7',
    combination: 'Custom Fabric / XL / Walnut',
    options: { color: 'Custom', size: 'XL', frame: 'Walnut', material: 'Custom Fabric' },
    valid: true,
    price: 389.0,
    inventoryLabel: 'Custom order',
    commerceStatus: 'Unmapped',
    materials: { fabric: 'Material_Custom_Fabric', frame: 'Material_Walnut_Wood' },
  },
  {
    id: 'var_8',
    combination: 'Custom Fabric / L / Oak',
    options: { color: 'Custom', size: 'L', frame: 'Oak', material: 'Custom Fabric' },
    valid: true,
    price: 369.0,
    inventoryLabel: 'Custom order',
    commerceStatus: 'Unmapped',
    materials: { fabric: 'Material_Custom_Fabric', frame: 'Material_Oak_Wood' },
  },
];

export function VariantsTab({
  projectId,
  productId,
  detail,
  editable,
  onOpenCommerce,
  onOpen3d,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
  onOpenCommerce: () => void;
  onOpen3d: () => void;
}) {
  const toast = useToast();
  const [variants, setVariants] = useState<VariantCombination[]>(DEFAULT_VARIANTS);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(DEFAULT_VARIANTS[0]?.id ?? null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Valid' | 'Blocked' | 'Mapped' | 'Unmapped'>('All');

  // Mapping modal
  const [mappingTarget, setMappingTarget] = useState<VariantCombination | null>(null);
  const [mapSku, setMapSku] = useState('');
  const [mapPrice, setMapPrice] = useState(349);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;

  const totalCount = variants.length;
  const validCount = variants.filter((v) => v.valid).length;
  const blockedCount = variants.filter((v) => !v.valid).length;
  const mappedCount = variants.filter((v) => v.commerceStatus === 'Mapped').length;
  const unmappedCount = variants.filter((v) => v.commerceStatus === 'Unmapped').length;

  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      if (filter === 'Valid' && !v.valid) return false;
      if (filter === 'Blocked' && v.valid) return false;
      if (filter === 'Mapped' && v.commerceStatus !== 'Mapped') return false;
      if (filter === 'Unmapped' && v.commerceStatus !== 'Unmapped') return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        v.combination.toLowerCase().includes(q) ||
        (v.sku || '').toLowerCase().includes(q) ||
        (v.blockedReason || '').toLowerCase().includes(q)
      );
    });
  }, [variants, filter, query]);

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappingTarget) return;

    setVariants((prev) =>
      prev.map((v) =>
        v.id === mappingTarget.id
          ? {
              ...v,
              sku: mapSku.trim() || `SKU-${Date.now()}`,
              price: mapPrice,
              commerceStatus: 'Mapped',
            }
          : v
      )
    );
    setMappingTarget(null);
    toast.success(`SKU mapped for ${mappingTarget.combination}`);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Configuration,Valid,SKU,Price,Inventory,Commerce']
        .concat(
          variants.map(
            (v) =>
              `"${v.combination}",${v.valid ? 'Yes' : 'No'},"${v.sku || ''}",${v.price || ''},"${v.inventoryLabel || ''}","${v.commerceStatus}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `variants-matrix-${productId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Variants resolution matrix exported');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Main Matrix Table (~8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {/* Header & Unified Semantic Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-1">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--ink)]">
              Variants &amp; Resolved States
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Options + Rules &rarr; Resolved configuration matrix &rarr; Commerce identity.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-center border border-[var(--line)] rounded-lg px-3 py-1.5 bg-[var(--surface-pure)] shadow-2xs">
              <div className="px-1.5">
                <p className="text-[13px] font-semibold font-mono text-[var(--ink)]">{totalCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Total</p>
              </div>
              <span className="text-[var(--line)] text-sm">/</span>
              <div className="px-1.5">
                <p className="text-[13px] font-semibold font-mono text-emerald-700">{validCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Valid</p>
              </div>
              <span className="text-[var(--line)] text-sm">/</span>
              <div className="px-1.5">
                <p className="text-[13px] font-semibold font-mono text-amber-700">{blockedCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Blocked</p>
              </div>
              <span className="text-[var(--line)] text-sm">/</span>
              <div className="px-1.5">
                <p className="text-[13px] font-semibold font-mono text-[var(--ink)]">{mappedCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Mapped</p>
              </div>
              <span className="text-[var(--line)] text-sm">/</span>
              <div className="px-1.5">
                <p className="text-[13px] font-semibold font-mono text-blue-700">{unmappedCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Unmapped</p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleExportCsv}
              className="ui:flex ui:items-center ui:gap-1.5 ui:h-8 ui:text-[12px]"
            >
              <DownloadIcon size={13} />
              <span>Export matrix</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-[1]"
            />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search configuration or SKU..."
              className="ui:h-8 ui:pl-8 ui:pr-3 ui:text-[12px]"
            />
          </div>

          <Select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as 'All' | 'Valid' | 'Blocked' | 'Mapped' | 'Unmapped'
              )
            }
            className="ui:h-8 ui:w-auto ui:min-w-[200px] ui:text-[12px]"
          >
            <option value="All">All configurations ({totalCount})</option>
            <option value="Valid">Valid only ({validCount})</option>
            <option value="Blocked">Blocked by rules ({blockedCount})</option>
            <option value="Mapped">Mapped SKUs ({mappedCount})</option>
            <option value="Unmapped">Unmapped ({unmappedCount})</option>
          </Select>
        </div>

        {/* Resolution Matrix Table */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
          <DataTable
            variant="fill"
            minWidth={780}
            footer={
              <div className="p-3 border-t border-[var(--line)] text-[12px] text-[var(--text-muted)] flex justify-between">
                <span>
                  Showing {filteredVariants.length} of {variants.length} combinations
                </span>
                <span className="text-[11px]">
                  {validCount} sellable · {blockedCount} excluded
                </span>
              </div>
            }
          >
            <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <tr>
                <DataTable.HeaderCell>Configuration</DataTable.HeaderCell>
                <DataTable.HeaderCell>Valid</DataTable.HeaderCell>
                <DataTable.HeaderCell>SKU</DataTable.HeaderCell>
                <DataTable.HeaderCell>Price</DataTable.HeaderCell>
                <DataTable.HeaderCell>Inventory</DataTable.HeaderCell>
                <DataTable.HeaderCell>Commerce</DataTable.HeaderCell>
                <DataTable.HeaderCell align="right" className="pr-4 pl-2">
                  Actions
                </DataTable.HeaderCell>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {filteredVariants.length === 0 ? (
                <DataTable.Row>
                  <DataTable.Cell
                    colSpan={7}
                    className="p-6 text-center text-[13px] text-[var(--text-muted)]"
                  >
                    No configurations match your filter.
                  </DataTable.Cell>
                </DataTable.Row>
              ) : (
                filteredVariants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  return (
                    <DataTable.Row
                      key={variant.id}
                      selected={isSelected}
                      onClick={() => setSelectedVariantId(variant.id)}
                    >
                      <DataTable.Cell className="font-medium">
                        <div className="flex items-center gap-2">
                          {variant.options.color === 'Black' ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-black border border-black/20 shrink-0" />
                          ) : variant.options.color === 'White' ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-white border border-gray-300 shrink-0" />
                          ) : null}
                          <span>{variant.combination}</span>
                        </div>
                      </DataTable.Cell>

                      <DataTable.Cell className="text-[12px]">
                        {variant.valid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <span className="text-[12px]">✓</span>
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <span className="text-[12px]">✕</span>
                            <span>No</span>
                          </span>
                        )}
                      </DataTable.Cell>

                      <DataTable.Cell className="font-mono text-[12px]">
                        {variant.sku ? (
                          <span className="text-[var(--ink)] font-medium">{variant.sku}</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </DataTable.Cell>

                      <DataTable.Cell className="font-mono text-[12px]">
                        {variant.price ? (
                          <span className="text-[var(--ink)] font-semibold">
                            ${variant.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </DataTable.Cell>

                      <DataTable.Cell className="text-[12px]">
                        {variant.inventoryLabel ? (
                          <span className="text-[var(--text-secondary)]">
                            {variant.inventoryLabel}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </DataTable.Cell>

                      <DataTable.Cell className="text-[12px]">
                        {variant.commerceStatus === 'Mapped' ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60">
                            Mapped
                          </span>
                        ) : variant.commerceStatus === 'Blocked by rule' ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariantId(variant.id);
                            }}
                            className="ui:h-auto ui:rounded-full ui:border ui:border-amber-200/60 ui:bg-amber-50 ui:px-2 ui:py-0.5 ui:text-[10px] ui:font-semibold ui:text-amber-800 ui:hover:bg-amber-100/80"
                            title="Click to view rule conflict"
                          >
                            Blocked by rule ↗
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMappingTarget(variant);
                              setMapSku(
                                variant.sku ||
                                  `SKU-BLK-${variant.options.size}-${variant.options.frame.slice(0, 3).toUpperCase()}`
                              );
                              setMapPrice(variant.price || 349);
                            }}
                            className="ui:h-auto ui:rounded-full ui:border ui:border-blue-200/60 ui:bg-blue-50 ui:px-2 ui:py-0.5 ui:text-[10px] ui:font-semibold ui:text-blue-800 ui:hover:bg-blue-100/80"
                            title="Click to map SKU"
                          >
                            + Map SKU
                          </Button>
                        )}
                      </DataTable.Cell>

                      <DataTable.ActionsCell className="pr-4 pl-2">
                        <RowActionMenu
                          label="Variant actions"
                          items={[
                            {
                              id: 'inspect',
                              label: isSelected ? 'Close inspector' : 'Inspect state',
                              onClick: () =>
                                setSelectedVariantId((c) =>
                                  c === variant.id ? null : variant.id
                                ),
                            },
                            {
                              id: 'map',
                              label: 'Map commerce SKU',
                              onClick: () => {
                                setMappingTarget(variant);
                                setMapSku(
                                  variant.sku ||
                                    `SKU-BLK-${variant.options.size}-${variant.options.frame.slice(0, 3).toUpperCase()}`
                                );
                                setMapPrice(variant.price || 349);
                              },
                            },
                            {
                              id: '3d',
                              label: 'Test in 3D viewer',
                              onClick: onOpen3d,
                            },
                          ]}
                        />
                      </DataTable.ActionsCell>
                    </DataTable.Row>
                  );
                })
              )}
            </DataTable.Body>
          </DataTable>
        </div>
      </div>

      {/* Right Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {selectedVariant ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-[var(--ink)]">
                      Resolved State
                    </h3>
                    {selectedVariant.valid ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200/60">
                        Valid
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200/60">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">
                    {selectedVariant.combination}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVariantId(null)}
                  aria-label="Close details"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 ui:h-8 ui:text-[12px]"
                onClick={() => {
                  setMappingTarget(selectedVariant);
                  setMapSku(selectedVariant.sku || '');
                  setMapPrice(selectedVariant.price || 349);
                }}
              >
                <TagIcon size={13} className="mr-1 inline" />
                <span>Map SKU</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 ui:h-8 ui:text-[12px]"
                onClick={onOpen3d}
              >
                <EyeIcon size={13} className="mr-1 inline" />
                <span>Test 3D</span>
              </Button>
            </div>

            {/* Validity / Rules Status */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Graph Resolution Status
              </h4>
              {selectedVariant.valid ? (
                <div className="rounded-lg bg-emerald-50/60 border border-emerald-200/60 p-2.5 text-[12px] text-emerald-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <CheckIcon size={13} />
                    <span>Configuration valid</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    No conflicting compatibility rules found. Ready for checkout and 3D rendering.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50/60 border border-amber-200/60 p-2.5 text-[12px] text-amber-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>⚠</span>
                    <span>Excluded by rule</span>
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {selectedVariant.blockedReason}
                  </p>
                </div>
              )}
            </div>

            {/* Commerce Resolution */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Commerce Resolution
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">SKU</span>
                  <span className="font-mono font-medium text-[var(--ink)]">
                    {selectedVariant.sku || '— (Unmapped)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Price</span>
                  <span className="font-mono font-semibold text-[var(--ink)]">
                    {selectedVariant.price ? `$${selectedVariant.price.toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Barcode</span>
                  <span className="font-mono text-[var(--text-muted)]">
                    {selectedVariant.barcode || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Inventory</span>
                  <span className="text-[var(--ink)]">{selectedVariant.inventoryLabel || '—'}</span>
                </div>
              </div>
            </div>

            {/* 3D Appearance Resolution */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                3D Appearance Resolution
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Fabric Binding</span>
                  <span className="text-[var(--ink)]">{selectedVariant.materials.fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Frame Binding</span>
                  <span className="text-[var(--ink)]">{selectedVariant.materials.frame}</span>
                </div>
              </div>
            </div>

            {/* Options Breakdown */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Selected Option Values
              </h4>
              <div className="space-y-1 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Color</span>
                  <span className="font-medium text-[var(--ink)]">{selectedVariant.options.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Size</span>
                  <span className="font-medium text-[var(--ink)]">{selectedVariant.options.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Frame</span>
                  <span className="font-medium text-[var(--ink)]">{selectedVariant.options.frame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Material</span>
                  <span className="font-medium text-[var(--ink)]">{selectedVariant.options.material}</span>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      {/* Map SKU Modal */}
      {mappingTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">Map Commerce SKU</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  {mappingTarget.combination}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMappingTarget(null)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMapping} className="mt-4 space-y-3.5">
              <Field label="SKU Identifier" htmlFor="map-sku">
                <Input
                  id="map-sku"
                  type="text"
                  required
                  placeholder="e.g. SKU-BLK-XL-WAL"
                  value={mapSku}
                  onChange={(e) => setMapSku(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="Resolved Price ($ USD)" htmlFor="map-price">
                <Input
                  id="map-price"
                  type="number"
                  step="0.01"
                  required
                  value={mapPrice}
                  onChange={(e) => setMapPrice(Number(e.target.value))}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setMappingTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Save mapping
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
