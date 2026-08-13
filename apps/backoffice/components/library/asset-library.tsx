'use client';

import { useMemo, useState } from 'react';
import { AssetCard } from './asset-card';
import { AssetInspector } from './asset-inspector';
import { CreateAssetDialog } from './create-asset-dialog';
import {
  BrowseSearch,
  BrowseTab,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import {
  type LibraryAssetItem,
  type LibraryAssetType,
  type LibraryFolderItem,
  type LibraryScope,
} from './types';

const TYPE_FOLDER_NAMES = new Set([
  'materials',
  'material',
  'objects',
  'object',
  'models',
  'model',
  'textures',
  'texture',
]);

function isOrganizationalFolder(folder: LibraryFolderItem) {
  return !TYPE_FOLDER_NAMES.has(folder.name.trim().toLowerCase());
}

export function AssetLibrary({
  projectId,
  folders,
  assets,
  initialScope,
}: {
  projectId: string;
  folders: LibraryFolderItem[];
  assets: LibraryAssetItem[];
  initialScope?: LibraryScope;
}) {
  const [typeTab, setTypeTab] = useState<LibraryAssetType | 'all'>(
    initialScope?.kind === 'type' ? initialScope.type : 'all'
  );
  const [folderId, setFolderId] = useState<string | null>(
    initialScope?.kind === 'folder' ? initialScope.folderId : null
  );
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<LibraryAssetType>('material');
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  const orgFolders = useMemo(
    () => folders.filter(isOrganizationalFolder),
    [folders]
  );

  const counts = useMemo(
    () => ({
      all: assets.length,
      material: assets.filter((a) => a.type === 'material').length,
      model: assets.filter((a) => a.type === 'model').length,
      texture: assets.filter((a) => a.type === 'texture').length,
    }),
    [assets]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      if (typeTab !== 'all' && asset.type !== typeTab) return false;
      if (folderId && asset.folderId !== folderId) return false;
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        (asset.code || '').toLowerCase().includes(q)
      );
    });
  }, [assets, typeTab, folderId, query]);

  const selected =
    filtered.find((asset) => `${asset.type}:${asset.id}` === selectedKey) ??
    assets.find((asset) => `${asset.type}:${asset.id}` === selectedKey) ??
    null;

  return (
    <>
      <BrowseWorkspace
        title="Asset Library"
        actions={
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCreateType('model');
                setCreateOpen(true);
              }}
              className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setNewMenuOpen((open) => !open)}
              className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              + New
            </button>
            {newMenuOpen ? (
              <div className="absolute top-full right-0 z-20 mt-1 min-w-[150px] overflow-hidden rounded-xl border border-[var(--bo-line)] bg-white shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03]"
                  onClick={() => {
                    setNewMenuOpen(false);
                    setCreateType('material');
                    setCreateOpen(true);
                  }}
                >
                  Material
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-black/[0.03]"
                  onClick={() => {
                    setNewMenuOpen(false);
                    setCreateType('model');
                    setCreateOpen(true);
                  }}
                >
                  Model
                </button>
              </div>
            ) : null}
          </div>
        }
        filters={
          <>
            <BrowseTab
              label="All assets"
              count={counts.all}
              active={typeTab === 'all'}
              onClick={() => {
                setTypeTab('all');
                setFolderId(null);
              }}
            />
            <BrowseTab
              label="Materials"
              count={counts.material}
              active={typeTab === 'material'}
              onClick={() => {
                setTypeTab('material');
                setFolderId(null);
              }}
            />
            <BrowseTab
              label="Models"
              count={counts.model}
              active={typeTab === 'model'}
              onClick={() => {
                setTypeTab('model');
                setFolderId(null);
              }}
            />
            <BrowseTab
              label="Textures"
              count={counts.texture}
              active={typeTab === 'texture'}
              onClick={() => {
                setTypeTab('texture');
                setFolderId(null);
              }}
            />
            {orgFolders.length > 0 ? (
              <button
                type="button"
                onClick={() => setFoldersOpen((open) => !open)}
                className={`ml-1 rounded-lg border px-3 py-1.5 text-sm ${
                  foldersOpen || folderId
                    ? 'border-[var(--bo-ink)] text-[var(--bo-ink)]'
                    : 'border-[var(--bo-line)] text-[var(--bo-muted)]'
                }`}
              >
                Folders
              </button>
            ) : null}
          </>
        }
        search={
          <BrowseSearch value={query} onChange={setQuery} placeholder="Search…" />
        }
        secondary={
          foldersOpen && orgFolders.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--bo-line)] px-4 py-2">
              <span className="mr-1 text-[11px] font-semibold tracking-[0.06em] text-[var(--bo-muted)] uppercase">
                Folders
              </span>
              <FolderChip
                label="All"
                active={!folderId}
                onClick={() => setFolderId(null)}
              />
              {orgFolders.map((folder) => (
                <FolderChip
                  key={folder.id}
                  label={folder.name}
                  active={folderId === folder.id}
                  onClick={() =>
                    setFolderId((current) =>
                      current === folder.id ? null : folder.id
                    )
                  }
                />
              ))}
            </div>
          ) : null
        }
        inspector={
          selected ? (
            <>
              <button
                type="button"
                aria-label="Close inspector"
                className="absolute inset-0 z-20 bg-black/10 lg:bg-transparent"
                onClick={() => setSelectedKey(null)}
              />
              <div className="absolute inset-y-0 right-0 z-30">
                <AssetInspector
                  asset={selected}
                  projectId={projectId}
                  onClose={() => setSelectedKey(null)}
                />
              </div>
            </>
          ) : null
        }
      >
        <div className="mb-3">
          <p className="text-xs text-[var(--bo-muted)]">
            {filtered.length} asset{filtered.length === 1 ? '' : 's'}
            {folderId
              ? ` in ${orgFolders.find((f) => f.id === folderId)?.name ?? 'folder'}`
              : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--bo-line)] px-6 text-center">
            <p className="text-sm font-medium text-[var(--bo-ink)]">
              No assets here
            </p>
            <p className="mt-1 max-w-sm text-sm text-[var(--bo-muted)]">
              Upload a model or create a material. Library is for find and
              reuse — authoring stays in 3D Studio.
            </p>
            <button
              type="button"
              onClick={() => {
                setCreateType('material');
                setCreateOpen(true);
              }}
              className="bo-btn-primary mt-4 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              + New material
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {filtered.map((asset) => (
              <AssetCard
                key={`${asset.type}-${asset.id}`}
                asset={asset}
                selected={selectedKey === `${asset.type}:${asset.id}`}
                onSelect={() => {
                  const key = `${asset.type}:${asset.id}`;
                  setSelectedKey((current) =>
                    current === key ? null : key
                  );
                }}
              />
            ))}
          </div>
        )}
      </BrowseWorkspace>

      <CreateAssetDialog
        projectId={projectId}
        open={createOpen}
        initialType={createType}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}

function FolderChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[12px] ${
        active
          ? 'bg-black/[0.08] font-medium text-[var(--bo-ink)]'
          : 'text-[var(--bo-ink)]/70 hover:bg-black/[0.04]'
      }`}
    >
      {label}
    </button>
  );
}
