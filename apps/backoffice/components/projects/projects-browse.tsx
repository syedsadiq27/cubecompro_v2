'use client';

import { useMemo, useState } from 'react';
import { ProjectSelectButton } from '@/components/projects/project-select-button';
import {
  BrowseSearch,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import { PageChrome } from '@/components/ui/page-chrome';

type ProjectCard = {
  id: string;
  name: string;
  organizationName: string;
};

export function ProjectsBrowse({ projects }: { projects: ProjectCard[] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(q) ||
        project.organizationName.toLowerCase().includes(q)
    );
  }, [projects, query]);

  const selected = filtered.find((project) => project.id === selectedId) ?? null;

  return (
    <PageChrome flush>
      <BrowseWorkspace
        title="Projects"
        meta="Select a project to open its catalog and library"
        filters={
          <span className="px-1 text-[13px] text-[var(--bo-muted)]">
            All projects
          </span>
        }
        search={
          <BrowseSearch
            value={query}
            onChange={setQuery}
            placeholder="Search projects…"
          />
        }
        inspector={
          selected ? (
            <>
              <button
                type="button"
                aria-label="Close inspector"
                className="absolute inset-0 z-20 bg-black/10 lg:bg-transparent"
                onClick={() => setSelectedId(null)}
              />
              <div className="absolute inset-y-0 right-0 z-30">
                <aside className="flex h-full w-[min(320px,92vw)] flex-col border-l border-[var(--bo-line)] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.06)]">
                  <div className="border-b border-[var(--bo-line)] px-4 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                          Inspector
                        </p>
                        <h2 className="mt-2 truncate text-base font-semibold text-[var(--bo-ink)]">
                          {selected.name}
                        </h2>
                        <p className="mt-0.5 text-sm text-[var(--bo-muted)]">
                          {selected.organizationName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="rounded-md px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04]"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <ProjectSelectButton
                      projectId={selected.id}
                      projectName={selected.name}
                    />
                  </div>
                </aside>
              </div>
            </>
          ) : null
        }
      >
        {filtered.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[var(--bo-line)] text-sm text-[var(--bo-muted)]">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((project) => {
              const active = selectedId === project.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() =>
                    setSelectedId((current) =>
                      current === project.id ? null : project.id
                    )
                  }
                  className={`overflow-hidden rounded-xl border text-left transition ${
                    active
                      ? 'border-[var(--bo-ink)]/45 bg-[var(--bo-ink)]/[0.02]'
                      : 'border-[var(--bo-line)] hover:border-[var(--bo-ink)]/30'
                  }`}
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#f7f4ef,#e0dcd4)] px-3">
                    <p className="line-clamp-2 text-center text-sm font-semibold text-[var(--bo-ink)]">
                      {project.name}
                    </p>
                  </div>
                  <div className="border-t border-[var(--bo-line)] bg-white px-2 py-1.5">
                    <p className="truncate text-[12px] font-medium text-[var(--bo-ink)]">
                      {project.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-[var(--bo-muted)]">
                      {project.organizationName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </BrowseWorkspace>
    </PageChrome>
  );
}
