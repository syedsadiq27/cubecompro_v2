'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Button,
  DataTable,
  FilterBar,
  FilterSelect,
  InspectorActions,
  InspectorBody,
  InspectorHeader,
  InspectorPanel,
  InspectorSection,
  SearchField,
  useToast,
} from '@repo/ui';
import { selectProjectAction } from '@/actions/auth';
import {
  BackofficePageHeader,
  DetailRow,
  EmptyState,
  PageBody,
  Pagination,
  RowActionMenu,
  StatusBadge,
  ViewModeSwitcher,
} from '@/components/bo';
import {
  BoxIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  FolderIcon,
  GlobeIcon,
  LayersIcon,
  PlusIcon,
} from '@/components/bo/icons';

type ProjectCard = {
  id: string;
  name: string;
  organizationName: string;
  productCount?: number;
  updatedAt?: string;
  status?: string;
};

export function ProjectsBrowse({ projects }: { projects: ProjectCard[] }) {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const organizations = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.organizationName) set.add(p.organizationName);
    });
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchQuery =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.organizationName.toLowerCase().includes(q) ||
        project.id.toLowerCase().includes(q);

      const matchOrg =
        orgFilter === 'all' ||
        project.organizationName.toLowerCase() === orgFilter.toLowerCase();

      return matchQuery && matchOrg;
    });
  }, [projects, query, orgFilter]);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const handleOpenProject = (projectId: string, projectName: string) => {
    setPendingId(projectId);
    startTransition(async () => {
      await selectProjectAction(projectId, projectName);
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      {/* Canonical Backoffice Page Header */}
      <BackofficePageHeader
        title="Workspaces & Projects"
        count={`${filtered.length} total`}
        description="Select a product workspace to manage configuration graphs, 3D assets, and commerce channels."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
              onClick={() => toast.info('New workspace creation')}
            >
              <PlusIcon size={14} className="mr-1.5 inline" />
              <span>Create workspace</span>
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-pure)] px-6 py-2.5">
        <FilterBar variant="toolbar">
          <SearchField
            value={query}
            placeholder="Search workspaces by name, org, or key…"
            onChange={setQuery}
          />
          <FilterSelect
            value={orgFilter}
            aria-label="Organization"
            onChange={(e) => setOrgFilter(e.target.value)}
          >
            <option value="all">Organization: All</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </FilterSelect>
          <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />
        </FilterBar>
      </div>

      {/* Main Body */}
      <PageBody>
        <div className="relative pb-16">
          {filtered.length === 0 ? (
            query.trim().length > 0 || orgFilter !== 'all' ? (
              <EmptyState
                variant="filtered"
                title="No workspaces match your filters"
                description="Try clearing search filters to see all available workspaces."
                onClearFilters={() => {
                  setQuery('');
                  setOrgFilter('all');
                }}
              />
            ) : (
              <EmptyState
                variant="firstUse"
                title="No workspaces available"
                description="You don't have access to any product workspaces yet."
                action={
                  <Button
                    type="button"
                    size="sm"
                    className="ui:bg-[var(--ink)] ui:text-white"
                    onClick={() => toast.info('Create project')}
                  >
                    + Create new workspace
                  </Button>
                }
              />
            )
          ) : viewMode === 'grid' ? (
            /* ========================================================================= */
            /* GRID VIEW */
            /* ========================================================================= */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((project) => {
                const isOpening = isPending && pendingId === project.id;
                const isSelected = selectedId === project.id;

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    className={`group rounded-xl border bg-[var(--surface-pure)] p-4 shadow-xs transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#665CFF] ring-1 ring-[#665CFF]'
                        : 'border-[var(--line)] hover:border-[var(--border-strong)] hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)]">
                          <FolderIcon size={18} />
                        </div>
                        <StatusBadge role="published" label="ACTIVE" />
                      </div>

                      <div>
                        <h3 className="text-[15px] font-semibold text-[var(--ink)] group-hover:text-[#665CFF] transition-colors leading-snug">
                          {project.name}
                        </h3>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                          {project.organizationName}
                        </p>
                      </div>

                      <div className="space-y-1.5 border-t border-[var(--line)]/60 pt-2.5 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Catalog</span>
                          <span className="font-mono font-medium text-[var(--ink)]">
                            {project.productCount ?? 12} products
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Graph Engine</span>
                          <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                            v2.4 (Active)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {project.id.slice(0, 12)}…
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        disabled={isOpening}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project.id, project.name);
                        }}
                        className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-7 ui:text-[11px]"
                      >
                        {isOpening ? 'Opening…' : 'Open Workspace →'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ========================================================================= */
            /* TABLE VIEW */
            /* ========================================================================= */
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
              <DataTable variant="fill" minWidth={700}>
                <DataTable.Header sticky>
                  <tr>
                    <DataTable.HeaderCell>Workspace</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Organization</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Catalog</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                    <DataTable.HeaderCell>Last Active</DataTable.HeaderCell>
                    <DataTable.HeaderCell align="right">Action</DataTable.HeaderCell>
                  </tr>
                </DataTable.Header>
                <tbody>
                  {filtered.map((project) => {
                    const isOpening = isPending && pendingId === project.id;
                    const isSelected = selectedId === project.id;

                    return (
                      <DataTable.Row
                        key={project.id}
                        selected={isSelected}
                        onClick={() => setSelectedId(project.id)}
                        className="cursor-pointer"
                      >
                        <DataTable.IdentityCell
                          title={project.name}
                          subtitle={project.id}
                          icon={<FolderIcon size={16} />}
                        />
                        <DataTable.Cell>{project.organizationName}</DataTable.Cell>
                        <DataTable.Cell>
                          <span className="font-mono text-[12px] text-[var(--ink)]">
                            {project.productCount ?? 12} products
                          </span>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <StatusBadge role="published" label="ACTIVE" />
                        </DataTable.Cell>
                        <DataTable.DateCell date="Today" time="10:24 AM" />
                        <DataTable.ActionsCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              disabled={isOpening}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenProject(project.id, project.name);
                              }}
                              className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-7 ui:text-[11px]"
                            >
                              {isOpening ? '…' : 'Open'}
                            </Button>
                            <RowActionMenu
                              label={`Actions for ${project.name}`}
                              items={[
                                {
                                  id: 'open',
                                  label: 'Open workspace',
                                  onClick: () => handleOpenProject(project.id, project.name),
                                },
                                {
                                  id: 'settings',
                                  label: 'Workspace settings',
                                  onClick: () => toast.info('Workspace settings'),
                                },
                              ]}
                            />
                          </div>
                        </DataTable.ActionsCell>
                      </DataTable.Row>
                    );
                  })}
                </tbody>
              </DataTable>
            </div>
          )}
        </div>
      </PageBody>

      {/* Inspector Panel Drawer */}
      <InspectorPanel
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
      >
        {selected ? (
          <>
            <InspectorHeader
              title={selected.name}
              subtitle={selected.organizationName}
              status={<StatusBadge role="published" label="ACTIVE" />}
              thumbnail={
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)]">
                  <FolderIcon size={18} />
                </div>
              }
              onClose={() => setSelectedId(null)}
            />

            <InspectorBody>
              <InspectorSection title="Workspace Details">
                <div className="space-y-1">
                  <DetailRow label="Project ID" value={selected.id} copyable={true} />
                  <DetailRow label="Organization" value={selected.organizationName} />
                  <DetailRow label="Catalog Items" value={`${selected.productCount ?? 12} products`} />
                  <DetailRow label="3D Engine" value="WebGL + USDZ (v2.4)" />
                  <DetailRow label="Commerce Connector" value="Shopify (Synced)" />
                </div>
              </InspectorSection>
            </InspectorBody>

            <InspectorActions>
              <Button
                type="button"
                size="md"
                disabled={isPending && pendingId === selected.id}
                onClick={() => handleOpenProject(selected.id, selected.name)}
                className="w-full ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:h-9 ui:text-[13px] ui:font-medium"
              >
                {isPending && pendingId === selected.id ? 'Opening workspace…' : 'Open Workspace →'}
              </Button>
            </InspectorActions>
          </>
        ) : null}
      </InspectorPanel>
    </div>
  );
}
