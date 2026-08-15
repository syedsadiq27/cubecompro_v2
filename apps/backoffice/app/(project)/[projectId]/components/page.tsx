'use client';

import { use, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  FilterBar,
  FilterSelect,
  FilterTab,
  FilterTabs,
  InspectorActions,
  InspectorBody,
  InspectorField,
  InspectorHeader,
  InspectorPanel,
  InspectorSection,
  InspectorThumb,
  SearchField,
  useToast,
} from '@repo/ui';
import {
  AccordionRow,
  AttentionState,
  AuditLogItem,
  BackofficePageHeader,
  BulkActionBar,
  DetailGrid,
  DetailRow,
  EmptyState,
  EntityTab,
  EntityTabs,
  FileUploadZone,
  FormField,
  IncompleteConfigBanner,
  InlineEditField,
  InspectorActionCards,
  ListChrome,
  MoreFiltersButton,
  PageBody,
  Pagination,
  ProcessingState,
  RadioCard,
  RowActionMenu,
  SectionHeader,
  SelectInput,
  SkeletonRows,
  SplitPane,
  StatusBadge,
  StickyActionBar,
  SuccessBanner,
  SwitchInput,
  TextInput,
  TextareaInput,
  ToolbarSettingsButton,
  ViewModeSwitcher,
} from '@/components/bo';
import {
  BoxIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  FolderIcon,
  GlobeIcon,
  HelpCircleIcon,
  LayersIcon,
  PencilIcon,
  PlusIcon,
  SmartphoneIcon,
  TagIcon,
  UploadIcon,
} from '@/components/bo/icons';

export default function ComponentsReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const toast = useToast();

  // State handles for live sandboxes
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1']));
  const [activeEntityTab, setActiveEntityTab] = useState('options');
  const [switchChecked, setSwitchChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('furniture');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed'>('uploading');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      {/* Canonical Backoffice Page Header */}
      <BackofficePageHeader
        title="Component System & Primitives Reference"
        description="The canonical reference for composition primitives, form controls, operational lifecycle states, interaction contracts, and layout grammar."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(
                  "import { PageHeader, SectionHeader, DetailGrid, SplitPane, FormField, TextInput, Pagination, StatusBadge, EmptyState, SuccessBanner } from '@/components/bo';\nimport { DataTable, FilterBar, ConfirmDialog, InspectorPanel } from '@repo/ui';"
                );
                toast.success('Import snippet copied to clipboard');
              }}
            >
              Copy imports
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setStickyBarVisible((v) => !v)}
            >
              Toggle Sticky Action Bar
            </Button>
            <Button
              type="button"
              size="sm"
              className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
              onClick={() => setInspectorOpen(true)}
            >
              Open Inspector
            </Button>
          </div>
        }
      />

      <PageBody>
        <div className="max-w-7xl mx-auto space-y-16 pb-32">
          {/* ========================================================================= */}
          {/* SECTION 0: INTERACTION CONTRACTS */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <SectionHeader
              title="Interaction Contracts (Locked Behavioral Rules)"
              subtitle="Explicit grammar rules governing mouse, keyboard, color semantics, and layout behavior across all backoffice apps."
            />

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] overflow-hidden shadow-xs">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[var(--canvas)] border-b border-[var(--line)] text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Trigger / Visual Element</th>
                    <th className="p-3.5">Contracted Behavior</th>
                    <th className="p-3.5">Scope &amp; Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-[var(--ink)]">checkbox</td>
                    <td className="p-3.5">Bulk selection toggle; opens &amp; updates sticky BulkActionBar</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Table / Grid items</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-[var(--ink)]">row click</td>
                    <td className="p-3.5">Opens 340px right Inspector Panel without full page navigation</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Product, Asset, Variant rows</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-[var(--ink)]">name / title click</td>
                    <td className="p-3.5">Navigates to dedicated Workspace PDP / Detail URL</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">/[projectId]/products/[id]</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-[var(--ink)]">••• menu</td>
                    <td className="p-3.5">Consolidates secondary and destructive actions in an accessible popover</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Headers, Table Rows, Inspector</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-[#665CFF]">violet (#665CFF)</td>
                    <td className="p-3.5">Active tab underline, selected item rail, focus ring indicator</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Design system brand accent</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-amber-700">amber (#D97706)</td>
                    <td className="p-3.5">Attention, blockers, unmapped variants, dirty draft state</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Operational warnings</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-emerald-700">green (#059669)</td>
                    <td className="p-3.5">Healthy status, published live version, synchronized connector</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Success confirmations</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono font-semibold text-red-700">red (#DC2626)</td>
                    <td className="p-3.5">Failure states, API errors, and destructive confirmation modals only</td>
                    <td className="p-3.5 text-[var(--text-secondary)]">Delete / Discard actions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 1: COMPOSITION PRIMITIVES */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <SectionHeader
              title="1. Composition Primitives (Layout Skeletons)"
              subtitle="PageHeader, SectionHeader, DetailGrid, SplitPane, and StickyActionBar composition templates."
            />

            <div className="space-y-4">
              {/* Composition Demo 1: Section Header with counts and actions */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
                <SectionHeader
                  title="Configuration Options"
                  count={4}
                  subtitle="Options define customer-facing choices and geometry bindings."
                  actions={
                    <Button
                      type="button"
                      size="sm"
                      className="ui:bg-[var(--ink)] ui:text-white"
                      onClick={() => toast.info('Add option clicked')}
                    >
                      + Add option
                    </Button>
                  }
                />

                {/* Composition Demo 2: DetailGrid */}
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    DetailGrid (2-Column &amp; 3-Column Metadata Grid)
                  </p>
                  <DetailGrid cols={3}>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-3">
                      <span className="text-[11px] text-[var(--text-muted)]">Base Price</span>
                      <p className="font-mono text-[14px] font-semibold text-[var(--ink)] mt-0.5">$349.00</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-3">
                      <span className="text-[11px] text-[var(--text-muted)]">Resolved States</span>
                      <p className="font-mono text-[14px] font-semibold text-[var(--ink)] mt-0.5">8 valid / 2 blocked</p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-3">
                      <span className="text-[11px] text-[var(--text-muted)]">Commerce Channel</span>
                      <p className="font-medium text-[13px] text-[var(--ink)] mt-0.5">Shopify (Connected)</p>
                    </div>
                  </DetailGrid>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: FORM CONTROLS FULL FAMILY */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <SectionHeader
              title="2. Form Controls Family"
              subtitle="FormField, TextInput, TextareaInput, SelectInput, SwitchInput, RadioCard, and InlineEditField."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Form Control: Text Input with Helper */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
                <FormField
                  label="Product Name"
                  required
                  tooltip="Customer-facing showroom title"
                  helperText="Slug will auto-generate from this title."
                >
                  <TextInput defaultValue="Studio Lounge Chair" />
                </FormField>

                <FormField
                  label="Product Key (Error State)"
                  required
                  errorText="Key CHAIR-01 is already assigned to an active product."
                >
                  <TextInput defaultValue="CHAIR-01" hasError />
                </FormField>
              </div>

              {/* Form Control: Select & Textarea */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
                <FormField label="Category Taxonomy">
                  <SelectInput defaultValue="seating">
                    <option value="seating">Seating &gt; Lounge Chairs</option>
                    <option value="tables">Tables &gt; Desks</option>
                  </SelectInput>
                </FormField>

                <FormField label="Short Description" helperText="Markdown formatting supported.">
                  <TextareaInput defaultValue="Modern lounge chair with solid FSC wood frame." rows={2} />
                </FormField>
              </div>

              {/* Form Control: Switch & Inline Edit */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
                <div>
                  <p className="text-[12px] font-semibold text-[var(--ink)] mb-2">Switch Toggle</p>
                  <SwitchInput
                    checked={switchChecked}
                    onChange={setSwitchChecked}
                    label="Enable AR Quick Look"
                    description="Generates USDZ asset bundle for iOS devices."
                  />
                </div>

                <div className="border-t border-[var(--line)] pt-3">
                  <p className="text-[12px] font-semibold text-[var(--ink)] mb-1.5">
                    Inline Editable Field
                  </p>
                  <InlineEditField
                    label="Product SKU"
                    initialValue="SKU-CHAIR-01-BLK"
                    onSave={async (v) => {
                      toast.success(`SKU updated to ${v}`);
                      return true;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RadioCard
                name="sample_blueprint"
                value="furniture"
                checked={radioSelected === 'furniture'}
                onChange={setRadioSelected}
                label="Modular Furniture Blueprint"
                description="Includes Color swatch, Dimension scales, and Material choices."
                badge={<span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--canvas)] px-1.5 py-0.5 rounded">~8 states</span>}
              />
              <RadioCard
                name="sample_blueprint"
                value="apparel"
                checked={radioSelected === 'apparel'}
                onChange={setRadioSelected}
                label="Apparel & Sizing Matrix"
                description="Garment sizes (S-XL), color swatches, and fabric weights."
                badge={<span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--canvas)] px-1.5 py-0.5 rounded">~16 states</span>}
              />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: TABS & SEGMENTED CONTROLS */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <SectionHeader
              title="3. Tabs &amp; Segmented Controls"
              subtitle="Entity tabs (workspace modules), Filter tabs (status filtering), and Segmented view toggles."
            />

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Entity Workspace Tabs (`FilterTabs` with single-row scroll)
                </p>
                <FilterTabs>
                  {['Product', 'Options', 'Variants', '3D', 'Commerce', 'Rules', 'Activity'].map((t) => (
                    <FilterTab
                      key={t}
                      label={t}
                      active={activeEntityTab.toLowerCase() === t.toLowerCase()}
                      onClick={() => setActiveEntityTab(t.toLowerCase())}
                    />
                  ))}
                </FilterTabs>
              </div>

              <div className="border-t border-[var(--line)] pt-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Segmented View Switcher
                  </p>
                  <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4: THE 8 OPERATIONAL & LIFECYCLE FEEDBACK STATES */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <SectionHeader
              title="4. The 8 Operational States &amp; Lifecycle Feedback"
              subtitle="All 8 lifecycle states: success publish, incomplete blockers, sync fail, processing, first-use, filtered, error, and permission."
              count="8 States"
            />

            {/* State 1: Success after save/publish */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[var(--ink)]">
                  1. Success After Save / Publish (`SuccessBanner`)
                </p>
                <span className="text-[11px] text-emerald-800 font-medium">● Storefront Synchronized</span>
              </div>
              <SuccessBanner
                title="Product published successfully (v1 is live)"
                description="Configuration graph is active and synchronized across storefront customizers and commerce endpoints."
                storefrontUrl="https://cubecom.demo/customizer/chair-01"
                onClose={() => toast.info('Dismissed success banner')}
              />
            </div>

            {/* State 2: Partial / Incomplete configuration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[var(--ink)]">
                  2. Partial / Incomplete Configuration (`IncompleteConfigBanner`)
                </p>
                <span className="text-[11px] text-amber-800 font-medium">● 2 Blockers Detected</span>
              </div>
              <IncompleteConfigBanner
                title="Configuration incomplete before publish"
                issues={[
                  'Variant SKU-BLK-L-OAK is missing commerce price mapping.',
                  '3D Target "AR" is missing Draco compressed USDZ asset.',
                ]}
                onResolve={() => toast.info('Opening blocker resolution wizard...')}
              />
            </div>

            {/* State 3: Sync Failed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[var(--ink)]">
                  3. Sync Failed / Connector Error (`EmptyState variant="syncFailed"`)
                </p>
                <span className="text-[11px] text-amber-800 font-medium">● Integration Alert</span>
              </div>
              <EmptyState
                variant="syncFailed"
                title="Shopify Connector synchronization failed"
                description="Timed out while validating inventory levels on Warehouse US - Default. Last validated May 14, 2025."
                onRetry={() => toast.info('Retrying connector sync...')}
              />
            </div>

            {/* State 4: Processing / Async progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[var(--ink)]">
                  4. Processing State with Progress (`ProcessingState`)
                </p>
                <span className="text-[11px] text-blue-800 font-medium">● In-Flight (67%)</span>
              </div>
              <ProcessingState
                title="Processing 3D model geometry…"
                subtitle="Optimizing GLB meshes, generating LODs, and binding texture maps."
                step={2}
                totalSteps={3}
              />
            </div>

            {/* States 5, 6, 7, 8: 4-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-[var(--ink)]">5. First-Use Empty</p>
                <EmptyState
                  variant="firstUse"
                  title="No products yet"
                  description="Create your first 3D customizer product or import catalog."
                  action={
                    <Button
                      type="button"
                      size="sm"
                      className="ui:bg-[var(--ink)] ui:text-white"
                      onClick={() => toast.info('Create product')}
                    >
                      + Add product
                    </Button>
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-[var(--ink)]">6. Filtered Empty</p>
                <EmptyState
                  variant="filtered"
                  title="No matching assets"
                  description="No results match your active query and status filters."
                  onClearFilters={() => toast.info('Filters cleared')}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-[var(--ink)]">7. Failed Load Error</p>
                <EmptyState
                  variant="error"
                  title="Failed to load graph"
                  description="An error occurred while fetching graph data from API."
                  onRetry={() => toast.info('Retrying query...')}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-[var(--ink)]">8. No Permission (403)</p>
                <EmptyState
                  variant="noPermission"
                  title="Read-only workspace"
                  description="Editor role required to modify configuration rules."
                  action={
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => toast.info('Access requested')}
                    >
                      Request access
                    </Button>
                  }
                />
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 5: ACCORDIONS, AUDIT DIFFS & DETAIL ROWS */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <SectionHeader
              title="5. Accordions, Audit History &amp; Detail Rows"
              subtitle="Collapsible groupings for rules/3D, chronological audit logs with diffs, and copyable ID detail pairs."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Accordion & Detail Rows */}
              <div className="space-y-4">
                <AccordionRow
                  title="3D Material Target Mappings"
                  subtitle="4 meshes bound to dynamic colorway slots"
                  badge={<span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Mapped</span>}
                  defaultOpen={true}
                >
                  <div className="space-y-1">
                    <DetailRow label="Mesh 'Seat_Cushion'" value="mat_leather_black" />
                    <DetailRow label="Mesh 'Wood_Legs'" value="mat_walnut_finish" />
                    <DetailRow label="Asset ID" value="ast_01HZY99" copyable={true} />
                    <DetailRow label="AR LOD Binding" value="Missing USDZ" warning="Action required" />
                  </div>
                </AccordionRow>
              </div>

              {/* Right: Audit Log Item */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-2">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Chronological Audit Log Item (`AuditLogItem`)
                </p>
                <div className="divide-y divide-[var(--line)]/60">
                  <AuditLogItem
                    title="Price mapped on variant"
                    actor="Demo Owner"
                    timestamp="Today 10:24 AM"
                    diff={{ before: 'Price: $0.00 (Unmapped)', after: 'Price: $349.00 (Mapped)' }}
                  />
                  <AuditLogItem
                    title="Rule condition modified"
                    actor="Demo Owner"
                    timestamp="Yesterday 03:15 PM"
                    diff={{ before: 'IF Size == XL THEN ALLOW Oak', after: 'IF Size == XL THEN BLOCK Oak' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 6: FILE & ASSET UPLOAD STATES */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <SectionHeader
              title="6. File &amp; Asset Upload States"
              subtitle="Drag-and-drop zone, queued uploads, in-flight progress meter, and completed geometry validation."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadZone
                status="uploading"
                progress={74}
                fileName="studio-chair-v2.glb"
              />
              <FileUploadZone
                status="completed"
                fileName="demo-chair.glb"
                fileSize="24.6 MB · 6 meshes"
              />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 7: DATA TABLES & PAGINATION */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <SectionHeader
              title="7. Data Tables &amp; Complete Pagination"
              subtitle="Dense operational table cells, multi-selection bulk actions, skeleton loaders, and 3 pagination variants."
            />

            {/* Bulk Action Bar */}
            <BulkActionBar
              count={selectedIds.size}
              onClear={() => setSelectedIds(new Set())}
            >
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="ui:h-7 ui:text-[11px]"
                onClick={() => toast.success('Bulk publish triggered')}
              >
                Publish selected
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="ui:h-7 ui:text-[11px]"
                onClick={() => toast.success('Bulk export triggered')}
              >
                Export CSV
              </Button>
            </BulkActionBar>

            {/* DataTable */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
              <DataTable
                variant="fill"
                minWidth={700}
                footer={
                  <DataTable.Footer
                    totalItems={128}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageCount={13}
                    pageSizeOptions={[10, 25, 50]}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    itemLabel="products"
                  />
                }
              >
                <DataTable.Header sticky>
                  <tr>
                    <DataTable.HeaderCheckboxCell
                      checked={selectedIds.size > 0}
                      ariaLabel="Select all"
                      onChange={() => {
                        if (selectedIds.size > 0) setSelectedIds(new Set());
                        else setSelectedIds(new Set(['1', '2']));
                      }}
                    />
                    <DataTable.HeaderCell>Product</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Category</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Updated</DataTable.HeaderCell>
                    <DataTable.HeaderCell align="right">Actions</DataTable.HeaderCell>
                  </tr>
                </DataTable.Header>
                <tbody>
                  <DataTable.Row selected={selectedIds.has('1')}>
                    <DataTable.CheckboxCell
                      checked={selectedIds.has('1')}
                      ariaLabel="Select Studio Chair"
                      onChange={() => {
                        const next = new Set(selectedIds);
                        if (next.has('1')) next.delete('1');
                        else next.add('1');
                        setSelectedIds(next);
                      }}
                    />
                    <DataTable.IdentityCell
                      title="Studio Chair"
                      subtitle="CHAIR-01"
                      icon={<BoxIcon size={16} />}
                    />
                    <DataTable.Cell>Seating &gt; Lounge Chairs</DataTable.Cell>
                    <DataTable.Cell>
                      <StatusBadge role="published" label="ACTIVE" />
                    </DataTable.Cell>
                    <DataTable.DateCell date="May 14, 2025" time="10:24 AM" />
                    <DataTable.ActionsCell>
                      <RowActionMenu
                        label="Actions for Studio Chair"
                        items={[
                          {
                            id: 'edit',
                            label: 'Edit details',
                            onClick: () => toast.info('Edit details'),
                          },
                          {
                            id: 'delete',
                            label: 'Delete',
                            danger: true,
                            separatorBefore: true,
                            onClick: () => setConfirmOpen(true),
                          },
                        ]}
                      />
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                </tbody>
              </DataTable>
            </div>

            {/* Standalone Pagination Variants */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] divide-y divide-[var(--line)]">
              <div className="p-3">
                <p className="text-[11px] font-medium text-[var(--text-muted)] mb-1">Default (Numeric + Page size dropdown)</p>
                <Pagination
                  totalItems={240}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  pageSizeOptions={[10, 25, 50, 100]}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  itemLabel="assets"
                />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-medium text-[var(--text-muted)] mb-1">Compact (Range + Stepper)</p>
                <Pagination
                  variant="compact"
                  totalItems={64}
                  currentPage={currentPage}
                  pageSize={10}
                  onPageChange={setCurrentPage}
                  itemLabel="variants"
                />
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 8: BADGES & ATTENTION INDICATORS */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <SectionHeader
              title="8. Badges &amp; Semantic Status Indicators"
              subtitle="Restrained operational color vocabulary with quiet neutrals and purposeful semantic accents."
            />

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs space-y-6">
              <div>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Status Badges (`StatusBadge`)
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge role="published" label="ACTIVE" />
                  <StatusBadge role="draft" label="DRAFT" />
                  <StatusBadge role="processing" label="PROCESSING" />
                  <StatusBadge role="needs_attention" label="NEEDS ATTENTION" />
                  <StatusBadge role="error" label="ERROR" />
                  <StatusBadge role="archived" label="ARCHIVED" />
                  <StatusBadge role="neutral" label="DEFAULT" />
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-4">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Attention States (`AttentionState`)
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <AttentionState label="100% Ready for Web & AR" tone="success" />
                  <AttentionState label="2 Unmapped Configurations" tone="warning" />
                  <AttentionState label="Sync Connector Blocked" tone="danger" />
                  <AttentionState label="Standard Tier Sync" tone="neutral" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageBody>

      {/* Sticky Action Bar */}
      <StickyActionBar
        visible={stickyBarVisible}
        message="Unsaved configuration draft changes detected."
        primaryAction={
          <Button
            type="button"
            size="sm"
            className="ui:bg-[var(--ink)] ui:text-white"
            onClick={() => {
              toast.success('Changes saved');
              setStickyBarVisible(false);
            }}
          >
            Save changes
          </Button>
        }
        secondaryAction={
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setStickyBarVisible(false)}
          >
            Discard
          </Button>
        }
      />

      {/* Interactive Sample Inspector Drawer */}
      <InspectorPanel
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      >
        <InspectorHeader
          title="Studio Chair"
          subtitle="CHAIR-01"
          status={<StatusBadge role="published" label="ACTIVE" />}
          thumbnail={
            <div className="h-10 w-10 rounded-md border border-[var(--line)] bg-[#F8F7F5] flex items-center justify-center text-[var(--text-muted)]">
              <BoxIcon size={18} />
            </div>
          }
          onClose={() => setInspectorOpen(false)}
        />
        <InspectorBody>
          <InspectorSection title="Operational Summary">
            <div className="space-y-1">
              <DetailRow label="Resolved States" value="4 valid" />
              <DetailRow label="Commerce SKUs" value="4 mapped" />
              <DetailRow label="Geometry Model" value="1 GLB (6 meshes)" />
              <DetailRow label="Product ID" value="prod_01HZY99" copyable={true} />
            </div>
          </InspectorSection>
        </InspectorBody>
      </InspectorPanel>

      {/* Confirmation Dialog Component */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete selected resource?"
        body="This action is permanent and removes the item from the catalog and commerce mapping graph."
        confirmLabel="Delete permanently"
        danger
        onConfirm={() => {
          setConfirmOpen(false);
          toast.success('Resource deleted');
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
