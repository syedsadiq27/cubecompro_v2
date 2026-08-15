'use client';

import { useState } from 'react';
import { Button, DataTable, useToast } from '@repo/ui';
import {
  BoxIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  EyeIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TagIcon,
} from '@/components/bo/icons';
import { StatusBadge } from '@/components/bo/states/operational-states';
import { RowActionMenu } from '@/components/bo';
import type { GraphDetail } from '@/lib/product-workspace';

export function CommerceTab({
  projectId,
  productId,
  detail,
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [validating, setValidating] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const handleCopySku = () => {
    navigator.clipboard.writeText('SKU-BLK-XL-WAL');
    setCopied(true);
    toast.success('Commerce ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      toast.success('Commerce identity connection validated successfully');
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Main Workspace Area (~8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {/* Top Header Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4 py-1">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--ink)]">Commerce</h2>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Configuration resolves to a sellable identity.
            </p>
          </div>
          <div className="text-right text-[11px]">
            <div className="flex items-center justify-end gap-1.5 font-medium text-emerald-700">
              <span className="font-mono text-[var(--ink)]">generic</span>
              <CheckIcon size={13} />
              <span>Connected</span>
            </div>
            <p className="text-[var(--text-secondary)] mt-0.5">1 sellable configuration</p>
            <p className="text-[var(--text-muted)]">1 mapped · 0 unmapped</p>
          </div>
        </div>

        {/* Card 1: Commerce Identity */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Commerce identity</h3>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={validating}
              onClick={handleValidate}
              className="ui:flex ui:items-center ui:gap-1.5 ui:h-8 ui:text-[12px] ui:font-medium"
            >
              <CheckIcon size={13} className="text-emerald-600" />
              <span>{validating ? 'Validating…' : 'Validate connection'}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-[12px]">
            {/* Column 1: Identity Type */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Identity Type
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="font-mono font-semibold text-[13px] text-[var(--ink)]">
                  generic
                </span>
                <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[var(--text-secondary)] uppercase">
                  Default
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-tight">
                Used for PDP, cart, and checkout.
              </p>
            </div>

            {/* Column 2: Commerce ID */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Commerce ID
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="font-mono font-medium text-[13px] text-[var(--ink)]">
                  SKU-BLK-XL-WAL
                </span>
                <button
                  type="button"
                  title="Copy Commerce ID"
                  onClick={handleCopySku}
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  <CopyIcon size={13} />
                </button>
              </div>
            </div>

            {/* Column 3: Status */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Status
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="font-medium text-emerald-800 text-[12px]">Connected</span>
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-tight">
                Last validated May 14, 2025 10:24 AM
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Sellable Configurations */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)]">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                Sellable configurations
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                These option values are used to build the commerce identity.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="ui:h-8 ui:text-[12px]"
              onClick={() => toast.info('Opening option configuration')}
            >
              Edit configuration
            </Button>
          </div>

          <div className="overflow-x-auto">
            <DataTable variant="fill" minWidth={480}>
              <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <tr>
                  <DataTable.HeaderCell>Option</DataTable.HeaderCell>
                  <DataTable.HeaderCell>Values</DataTable.HeaderCell>
                  <DataTable.HeaderCell>Included in identity</DataTable.HeaderCell>
                </tr>
              </DataTable.Header>
              <DataTable.Body>
                <DataTable.Row>
                  <DataTable.Cell className="font-semibold">Color</DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">Black</DataTable.Cell>
                  <DataTable.Cell>
                    <CheckIcon size={15} className="text-emerald-600" />
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell className="font-semibold">Size</DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">XL</DataTable.Cell>
                  <DataTable.Cell>
                    <CheckIcon size={15} className="text-emerald-600" />
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell className="font-semibold">Frame</DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">Walnut</DataTable.Cell>
                  <DataTable.Cell>
                    <CheckIcon size={15} className="text-emerald-600" />
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable.Body>
            </DataTable>
          </div>
        </div>

        {/* Card 3: Mappings */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[var(--line)]">
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Mappings</h3>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Map this configuration to inventory, pricing, and channels.
            </p>
          </div>

          <div className="overflow-x-auto">
            <DataTable variant="fill" minWidth={640}>
              <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <tr>
                  <DataTable.HeaderCell>Type</DataTable.HeaderCell>
                  <DataTable.HeaderCell>Mapping</DataTable.HeaderCell>
                  <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                  <DataTable.HeaderCell>Last updated</DataTable.HeaderCell>
                  <DataTable.HeaderCell align="right" className="pr-4 pl-2">
                    Actions
                  </DataTable.HeaderCell>
                </tr>
              </DataTable.Header>
              <DataTable.Body>
                <DataTable.Row>
                  <DataTable.Cell>
                    <div className="flex items-center gap-2">
                      <BoxIcon size={15} className="text-[var(--text-muted)]" />
                      <span className="font-semibold text-[var(--ink)]">Inventory</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <p className="font-medium text-[var(--ink)]">Warehouse US - Default</p>
                    <p className="text-[11px] text-[var(--text-muted)]">On hand, reservations</p>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span className="font-medium text-emerald-800 text-[12px]">Mapped</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.DateCell
                    date="May 14, 2025 10:24 AM"
                    time="by Demo Owner"
                  />
                  <DataTable.ActionsCell className="pr-4 pl-2">
                    <RowActionMenu
                      label="Actions for inventory mapping"
                      items={[
                        {
                          id: 'edit',
                          label: 'Edit inventory mapping',
                          onClick: () => toast.info('Edit inventory mapping'),
                        },
                      ]}
                    />
                  </DataTable.ActionsCell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>
                    <div className="flex items-center gap-2">
                      <TagIcon size={15} className="text-[var(--text-muted)]" />
                      <span className="font-semibold text-[var(--ink)]">Pricing</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <p className="font-medium text-[var(--ink)]">USD - Default Price</p>
                    <p className="font-mono text-[11px] text-[var(--text-muted)]">$349.00</p>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span className="font-medium text-emerald-800 text-[12px]">Mapped</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.DateCell
                    date="May 14, 2025 10:24 AM"
                    time="by Demo Owner"
                  />
                  <DataTable.ActionsCell className="pr-4 pl-2">
                    <RowActionMenu
                      label="Actions for pricing mapping"
                      items={[
                        {
                          id: 'edit',
                          label: 'Edit pricing mapping',
                          onClick: () => toast.info('Edit pricing mapping'),
                        },
                      ]}
                    />
                  </DataTable.ActionsCell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>
                    <div className="flex items-center gap-2">
                      <GlobeIcon size={15} className="text-[var(--text-muted)]" />
                      <span className="font-semibold text-[var(--ink)]">Channels</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <p className="font-medium text-[var(--ink)]">Web</p>
                    <p className="text-[11px] text-[var(--text-muted)]">1 channel</p>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span className="font-medium text-emerald-800 text-[12px]">Mapped</span>
                    </div>
                  </DataTable.Cell>
                  <DataTable.DateCell
                    date="May 14, 2025 10:24 AM"
                    time="by Demo Owner"
                  />
                  <DataTable.ActionsCell className="pr-4 pl-2">
                    <RowActionMenu
                      label="Actions for channel mapping"
                      items={[
                        {
                          id: 'edit',
                          label: 'Edit channel mapping',
                          onClick: () => toast.info('Edit channel mapping'),
                        },
                      ]}
                    />
                  </DataTable.ActionsCell>
                </DataTable.Row>
              </DataTable.Body>
            </DataTable>
          </div>

          <div className="p-4 border-t border-[var(--line)]">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => toast.info('Opening commerce mapping manager')}
              className="ui:text-[12px]"
            >
              Manage mappings
            </Button>
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
                onClick={() => toast.info('Preview product')}
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

            {/* Commerce Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Commerce
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Status</span>
                  <span className="font-medium text-emerald-700">generic · Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Sellable configuration</span>
                  <span className="font-mono font-medium text-[var(--ink)]">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Mapped</span>
                  <span className="font-mono font-medium text-[var(--ink)]">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Unmapped</span>
                  <span className="font-mono font-medium text-[var(--ink)]">0</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full ui:h-8 ui:text-[12px]"
                  onClick={() => toast.info('Viewing configuration')}
                >
                  View configuration
                </Button>
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
                    <p className="font-medium text-[var(--ink)]">Configuration connected</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Pricing mapping updated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Commerce identity generated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
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
