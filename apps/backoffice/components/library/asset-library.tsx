'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  cn,
  ConfirmDialog,
  DataTable,
  FilterBar,
  FilterSelect,
  FilterTab,
  FilterTabs,
  InspectorPanel,
  SearchField,
  useToast,
} from '@repo/ui';
import {
  deleteObjectAction,
  deleteTextureAction,
  setObjectAssetStatusAction,
} from '@/actions/assets';
import {
  BackofficePageHeader,
  BulkActionBar,
  ClearFiltersButton,
  DownloadIcon,
  EmptyState,
  ListChrome,
  MoreFiltersButton,
  PageBody,
  PageFrame,
  Pagination,
  PlusIcon,
  RowActionMenu,
  StatusBadge,
  ToolbarSettingsButton,
  UploadIcon,
  ViewModeSwitcher,
} from '@/components/bo';
import { BoxIcon, LayersIcon, LinkIcon } from '@/components/bo/icons';
import { AssetInspector } from './asset-inspector';
import {
  libraryAssetStatusFilterKey,
  libraryAssetStatusLabel,
  libraryAssetStatusRole,
} from './asset-status';
import { CreateAssetDialog } from './create-asset-dialog';
import {
  assetTypeLabel,
  type LibraryAssetItem,
  type LibraryAssetType,
  type LibraryFolderItem,
  type LibraryScope,
} from './types';

export function AssetLibrary({
  projectId,
  folders,
  assets: serverAssets,
  initialScope,
}: {
  projectId: string;
  folders: LibraryFolderItem[];
  assets: LibraryAssetItem[];
  initialScope?: LibraryScope;
}) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [catalog, setCatalog] = useState<LibraryAssetItem[]>(serverAssets);

  useEffect(() => {
    setCatalog(serverAssets);
  }, [serverAssets]);

  const [typeTab, setTypeTab] = useState<LibraryAssetType | 'all' | 'folders'>(
    initialScope?.kind === 'type' ? initialScope.type : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'draft' | 'archived'
  >('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'material' | 'model' | 'texture' | 'image'>('all');
  const [query, setQuery] = useState('');
  const [inspectId, setInspectId] = useState<string | null>(
    serverAssets[0]?.id ?? null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<LibraryAssetType>('material');
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

  const [sortKey, setSortKey] = useState<'name' | 'type' | 'status' | 'updated'>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const counts = useMemo(
    () => ({
      all: catalog.length,
      materials: catalog.filter((a) => a.type === 'material').length,
      models: catalog.filter((a) => a.type === 'model').length,
      textures: catalog.filter((a) => a.type === 'texture').length,
      images: catalog.filter((a) => a.type === 'image').length,
      folders: folders.length,
    }),
    [catalog, folders.length]
  );

  // Filter and sort catalog
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = catalog.filter((asset) => {
      if (typeTab === 'material' && asset.type !== 'material') return false;
      if (typeTab === 'model' && asset.type !== 'model') return false;
      if (typeTab === 'texture' && asset.type !== 'texture') return false;
      if (typeTab === 'image' && asset.type !== 'image') return false;

      if (typeFilter !== 'all' && asset.type !== typeFilter) return false;

      if (statusFilter !== 'all') {
        const bucket = libraryAssetStatusFilterKey(asset.status);
        if (statusFilter === 'published' && bucket !== 'published') return false;
        if (statusFilter === 'draft' && bucket !== 'draft') return false;
        if (statusFilter === 'archived' && bucket !== 'archived') return false;
      }

      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        (asset.code || '').toLowerCase().includes(q) ||
        (asset.detail || '').toLowerCase().includes(q) ||
        (asset.folderName || '').toLowerCase().includes(q)
      );
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'type') cmp = a.type.localeCompare(b.type);
      else if (sortKey === 'status') cmp = (a.status || '').localeCompare(b.status || '');
      else if (sortKey === 'updated') cmp = (a.updatedDate || '').localeCompare(b.updatedDate || '');
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [catalog, typeTab, typeFilter, statusFilter, query, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const inspected =
    filtered.find((a) => a.id === inspectId) ??
    catalog.find((a) => a.id === inspectId) ??
    null;

  const allPageSelected = pageItems.length > 0 && pageItems.every((a) => selectedIds.has(a.id));
  const somePageSelected = pageItems.some((a) => selectedIds.has(a.id));

  const togglePage = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const a of pageItems) {
        if (checked) next.add(a.id);
        else next.delete(a.id);
      }
      return next;
    });
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSort = (key: 'name' | 'type' | 'status' | 'updated') => {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const archiveModelAssets = (
    assets: LibraryAssetItem[],
    nextStatus: 'ARCHIVED' | 'READY',
    successLabel: string
  ) => {
    const models = assets.filter((asset) => asset.type === 'model');
    const skipped = assets.length - models.length;
    if (models.length === 0) {
      toast.error(
        skipped > 0
          ? 'Only 3D models can be archived right now.'
          : 'No assets selected.'
      );
      return;
    }
    startTransition(async () => {
      const results = await Promise.all(
        models.map((asset) =>
          setObjectAssetStatusAction(projectId, asset.id, nextStatus)
        )
      );
      const failed = results.find((result) => !result.ok);
      if (failed) {
        toast.error(failed.error || 'Archive failed.');
        return;
      }
      setConfirmDialog((d) => ({ ...d, open: false }));
      if (nextStatus === 'ARCHIVED') {
        setSelectedIds(new Set());
      }
      if (skipped > 0) {
        toast.info(
          `${skipped} non-model asset${skipped === 1 ? '' : 's'} skipped`
        );
      }
      toast.success(successLabel);
      router.refresh();
    });
  };

  const handleBulkArchive = () => {
    const selected = catalog.filter((asset) => selectedIds.has(asset.id));
    const count = selected.length;
    if (count === 0) return;
    setConfirmDialog({
      open: true,
      title: `Archive ${count} asset${count === 1 ? '' : 's'}?`,
      body: 'Archived models leave the attachable library only if no active product still pins them. Materials/textures are skipped for now.',
      confirmLabel: 'Archive',
      danger: false,
      onConfirm: () => {
        archiveModelAssets(
          selected,
          'ARCHIVED',
          `${count} asset${count === 1 ? '' : 's'} archived`
        );
      },
    });
  };

  const deleteAssets = (assets: LibraryAssetItem[], successLabel: string) => {
    if (assets.length === 0) return;
    const unsupported = assets.filter(
      (asset) => asset.type !== 'model' && asset.type !== 'texture'
    );
    const deletable = assets.filter(
      (asset) => asset.type === 'model' || asset.type === 'texture'
    );
    if (deletable.length === 0) {
      toast.error(
        unsupported.length > 0
          ? 'Material delete is not available yet. Delete models or textures.'
          : 'No assets selected.'
      );
      return;
    }
    startTransition(async () => {
      const results = await Promise.all(
        deletable.map((asset) =>
          asset.type === 'texture'
            ? deleteTextureAction(projectId, asset.id)
            : deleteObjectAction(projectId, asset.id)
        )
      );
      const failed = results.find((result) => !result.ok);
      if (failed) {
        toast.error(failed.error || 'Delete failed.');
        return;
      }
      const deletedIds = new Set(deletable.map((asset) => asset.id));
      setCatalog((prev) => prev.filter((asset) => !deletedIds.has(asset.id)));
      if (inspectId && deletedIds.has(inspectId)) setInspectId(null);
      setSelectedIds(new Set());
      setConfirmDialog((d) => ({ ...d, open: false }));
      if (unsupported.length > 0) {
        toast.info(
          `${unsupported.length} material${unsupported.length === 1 ? '' : 's'} skipped`
        );
      }
      toast.success(successLabel);
      router.refresh();
    });
  };

  const handleBulkDelete = () => {
    const selected = catalog.filter((asset) => selectedIds.has(asset.id));
    const count = selected.length;
    if (count === 0) return;
    setConfirmDialog({
      open: true,
      title: `Delete ${count} asset${count === 1 ? '' : 's'}?`,
      body: 'This permanently removes selected models and textures. Materials are skipped for now.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteAssets(
          selected,
          `Deleted ${count} asset${count === 1 ? '' : 's'}`
        );
      },
    });
  };

  const handleSingleArchive = (asset: LibraryAssetItem) => {
    const isArchived =
      libraryAssetStatusFilterKey(asset.status) === 'archived';
    if (asset.type !== 'model') {
      toast.error('Only 3D models can be archived right now.');
      return;
    }
    if (isArchived) {
      setConfirmDialog({
        open: true,
        title: `Restore “${asset.name}”?`,
        body: 'This returns the model to the published library tip.',
        confirmLabel: 'Restore',
        danger: false,
        onConfirm: () => {
          archiveModelAssets([asset], 'READY', `${asset.name} restored`);
        },
      });
      return;
    }
    setConfirmDialog({
      open: true,
      title: `Archive “${asset.name}”?`,
      body: 'Archived models leave the attachable library only if no active product still pins them. You can restore them later from the Archived filter.',
      confirmLabel: 'Archive',
      danger: false,
      onConfirm: () => {
        archiveModelAssets([asset], 'ARCHIVED', `${asset.name} archived`);
      },
    });
  };

  const hasActiveFilters =
    typeTab !== 'all' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    query.trim().length > 0;

  const clearFilters = () => {
    setTypeTab('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setQuery('');
    setPage(1);
    toast.info('Filters cleared');
  };

  return (
    <PageFrame
      inspector={
        <InspectorPanel open={Boolean(inspected)} onClose={() => setInspectId(null)}>
          {inspected ? (
            <AssetInspector
              asset={inspected}
              projectId={projectId}
              onClose={() => setInspectId(null)}
            />
          ) : null}
        </InspectorPanel>
      }
    >
      {/* Header */}
      <BackofficePageHeader
        title="Assets"
        count={String(counts.all)}
        actions={
          <BackofficePageHeader.Actions
            secondary={
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setCreateType(
                    typeTab === 'texture'
                      ? 'texture'
                      : typeTab === 'material'
                        ? 'material'
                        : 'model'
                  );
                  setCreateOpen(true);
                }}
                className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3 ui:rounded-lg ui:text-[13px] ui:font-medium"
              >
                <UploadIcon size={15} />
                <span>
                  {typeTab === 'texture'
                    ? 'Upload texture'
                    : typeTab === 'material'
                      ? 'New material'
                      : 'Upload'}
                </span>
              </Button>
            }
            primary={
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setCreateType('material');
                  setCreateOpen(true);
                }}
                className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3.5 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[13px] ui:font-medium ui:shadow-xs"
              >
                <PlusIcon size={15} />
                <span>New asset</span>
              </Button>
            }
          />
        }
      />

      {/* Tabs */}
      <ListChrome
        views={
          <FilterTabs>
            <FilterTab
              label="All assets"
              count={counts.all}
              active={typeTab === 'all'}
              onClick={() => {
                setTypeTab('all');
                setPage(1);
              }}
            />
            <FilterTab
              label="Materials"
              count={counts.materials}
              active={typeTab === 'material'}
              onClick={() => {
                setTypeTab('material');
                setPage(1);
              }}
            />
            <FilterTab
              label="Models"
              count={counts.models}
              active={typeTab === 'model'}
              onClick={() => {
                setTypeTab('model');
                setPage(1);
              }}
            />
            <FilterTab
              label="Textures"
              count={counts.textures}
              active={typeTab === 'texture'}
              onClick={() => {
                setTypeTab('texture');
                setPage(1);
              }}
            />
            <FilterTab
              label="Images"
              count={counts.images}
              active={typeTab === 'image'}
              onClick={() => {
                setTypeTab('image');
                setPage(1);
              }}
            />
            <FilterTab
              label="Folders"
              count={counts.folders}
              active={typeTab === 'folders'}
              onClick={() => {
                setTypeTab('folders');
                setPage(1);
              }}
            />
          </FilterTabs>
        }
        toolbar={
          <FilterBar
            variant="toolbar"
            end={
              <>
                {hasActiveFilters ? <ClearFiltersButton onClick={clearFilters} /> : null}
                <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />
                <ToolbarSettingsButton onClick={() => setMoreOpen((o) => !o)} />
              </>
            }
          >
            <SearchField
              value={query}
              onChange={(q) => {
                setQuery(q);
                setPage(1);
              }}
              placeholder="Search assets..."
            />
            <FilterSelect
              value={typeFilter}
              aria-label="Type filter"
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="all">Type: All</option>
              <option value="material">Material</option>
              <option value="model">Model</option>
              <option value="texture">Texture</option>
              <option value="image">Image</option>
            </FilterSelect>
            <FilterSelect
              value={statusFilter}
              aria-label="Status filter"
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="all">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </FilterSelect>
            <MoreFiltersButton
              active={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
            />
          </FilterBar>
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
              onClick={handleBulkArchive}
              disabled={pending}
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

      {/* Main Table / Grid View */}
      <PageBody flush>
        {catalog.length === 0 ? (
          <div className="p-6">
            <EmptyState
              variant="firstUse"
              title="No assets yet"
              description="Upload a model or texture, or create a material to get started."
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              variant="filtered"
              title="No assets match these filters"
              onClearFilters={clearFilters}
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="flex flex-col min-h-0 flex-1">
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1">
              {pageItems.map((asset) => {
                const inspecting = inspectId === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setInspectId(asset.id)}
                    className={cn(
                      'group relative flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 transition-all cursor-pointer hover:shadow-xs hover:border-[var(--border-strong)]',
                      inspecting && 'ring-2 ring-[var(--ink)] border-transparent bg-[var(--canvas)]/40'
                    )}
                  >
                    <div className="relative aspect-square w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] overflow-hidden">
                      {asset.imageUrl || asset.fileUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.imageUrl || asset.fileUrl || ''}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                          <BoxIcon size={28} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <StatusBadge
                          role={libraryAssetStatusRole(asset.status)}
                          label={libraryAssetStatusLabel(asset.status)}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-[13px] text-[var(--ink)] truncate">
                        {asset.name}
                      </p>
                      <p className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                        {asset.code || asset.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination
              totalItems={filtered.length}
              currentPage={currentPage}
              pageSize={pageSize}
              pageSizeOptions={[12, 24, 48]}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="assets"
            />
          </div>
        ) : (
          <DataTable
            variant="fill"
            minWidth={740}
            footer={
              <DataTable.Footer
                totalItems={filtered.length}
                currentPage={currentPage}
                pageCount={pageCount}
                pageSize={pageSize}
                pageSizeOptions={[10, 25, 50]}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemLabel="assets"
              />
            }
          >
            <DataTable.Header sticky>
              <tr>
                <DataTable.HeaderCheckboxCell
                  checked={allPageSelected}
                  indeterminate={somePageSelected && !allPageSelected}
                  ariaLabel="Select all assets on page"
                  onChange={togglePage}
                />
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'name' ? sortDirection : undefined}
                  onSort={() => handleSort('name')}
                >
                  Name
                </DataTable.HeaderCell>
                <DataTable.HeaderCell
                  sortable
                  sorted={sortKey === 'type' ? sortDirection : undefined}
                  onSort={() => handleSort('type')}
                >
                  Type
                </DataTable.HeaderCell>
                <DataTable.HeaderCell>
                  Detail
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
                  sorted={sortKey === 'updated' ? sortDirection : undefined}
                  onSort={() => handleSort('updated')}
                >
                  Updated ↓
                </DataTable.HeaderCell>
                <DataTable.HeaderCell align="right" className="w-16">
                  Actions
                </DataTable.HeaderCell>
              </tr>
            </DataTable.Header>

            <tbody>
              {pageItems.map((asset) => {
                const bulkSelected = selectedIds.has(asset.id);
                const inspecting = inspectId === asset.id;
                const statusRole = libraryAssetStatusRole(asset.status);
                const statusLabel = libraryAssetStatusLabel(asset.status);

                return (
                  <DataTable.Row
                    key={asset.id}
                    selected={inspecting || bulkSelected}
                    onClick={() => setInspectId(asset.id)}
                  >
                    <DataTable.CheckboxCell
                      checked={bulkSelected}
                      ariaLabel={`Select ${asset.name}`}
                      onChange={(checked) => toggleSelected(asset.id, checked)}
                    />

                    <DataTable.IdentityCell
                      title={asset.name}
                      subtitle={asset.code || asset.detail || '—'}
                      thumbnailUrl={asset.imageUrl}
                    />

                    <DataTable.Cell>
                      <span className="text-[13px] text-[var(--ink)]">
                        {assetTypeLabel(asset.type)}
                      </span>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                        {asset.detail || asset.code || '—'}
                      </span>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <StatusBadge role={statusRole} label={statusLabel} />
                    </DataTable.Cell>

                    <DataTable.DateCell
                      date={asset.updatedDate || '—'}
                      time={asset.updatedTime || undefined}
                    />

                    <DataTable.ActionsCell>
                      <RowActionMenu
                        label={`Actions for ${asset.name}`}
                        items={[
                          {
                            id: 'inspect',
                            label: inspecting ? 'Close inspector' : 'Inspect asset',
                            onClick: () =>
                              setInspectId((curr) => (curr === asset.id ? null : asset.id)),
                          },
                          {
                            id: 'preview',
                            label: 'Preview in 3D',
                            onClick: () => toast.info(`Previewing ${asset.name}`),
                          },
                          {
                            id: 'archive',
                            label:
                              libraryAssetStatusFilterKey(asset.status) ===
                              'archived'
                                ? 'Restore asset'
                                : 'Archive asset',
                            onClick: () => handleSingleArchive(asset),
                          },
                          {
                            id: 'delete',
                            label: 'Delete asset',
                            danger: true,
                            separatorBefore: true,
                            onClick: () => {
                              setConfirmDialog({
                                open: true,
                                title: `Delete “${asset.name}”?`,
                                body:
                                  asset.type === 'material'
                                    ? 'Material delete is not available yet.'
                                    : 'This permanently removes the asset from your library. This action cannot be undone.',
                                confirmLabel: 'Delete',
                                danger: true,
                                onConfirm: () => {
                                  if (asset.type === 'material') {
                                    toast.error(
                                      'Material delete is not available yet.'
                                    );
                                    setConfirmDialog((d) => ({
                                      ...d,
                                      open: false,
                                    }));
                                    return;
                                  }
                                  deleteAssets(
                                    [asset],
                                    `Deleted ${asset.name}`
                                  );
                                },
                              });
                            },
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
      </PageBody>

      {/* Upload / Create Asset Dialog */}
      <CreateAssetDialog
        projectId={projectId}
        initialType={createType}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Confirmation Dialog */}
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
    </PageFrame>
  );
}
