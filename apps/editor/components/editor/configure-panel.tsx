'use client';

import { useMemo, useState } from 'react';
import type * as THREE from 'three';
import { findConfigValue } from '../../lib/configuration';
import { useEditorStore } from '../../lib/editor-store';

function nodeLabel(node: THREE.Object3D) {
  if (typeof node.userData.name === 'string' && node.userData.name) {
    return node.userData.name;
  }
  return node.name || 'Object';
}

function SceneGraphList() {
  const outlineNodes = useEditorStore((state) => state.outlineNodes);
  const outlineRevision = useEditorStore((state) => state.outlineRevision);
  const selected = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
  void outlineRevision;

  if (!outlineNodes.length) {
    return <p className="type-meta px-2">No scene objects</p>;
  }

  return (
    <ul className="space-y-0.5">
      {outlineNodes.map((node) => {
        const active = selected === node;
        return (
          <li key={node.uuid} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleVisibility(node)}
              className="rounded px-1.5 py-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              {node.visible ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              onClick={() => setSelected(node)}
              className={`min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-[12px] ${
                active
                  ? 'bg-black/[0.05] font-medium text-[var(--ink)]'
                  : 'text-[var(--ink)]/80 hover:bg-black/[0.03]'
              }`}
            >
              {nodeLabel(node)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ConfigurePanel() {
  const configuration = useEditorStore((state) => state.configuration);
  const activeConfigValues = useEditorStore((state) => state.activeConfigValues);
  const configSelection = useEditorStore((state) => state.configSelection);
  const document = useEditorStore((state) => state.document);
  const loading = useEditorStore((state) => state.loading);
  const outlineRevision = useEditorStore((state) => state.outlineRevision);
  const selectConfigValue = useEditorStore((state) => state.selectConfigValue);
  const openDrawer = useEditorStore((state) => state.openDrawer);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [query, setQuery] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  void outlineRevision;

  const properties = useMemo(() => {
    const list = configuration?.properties ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list
      .map((property) => ({
        ...property,
        values: property.values.filter(
          (value) =>
            property.name.toLowerCase().includes(q) ||
            value.name.toLowerCase().includes(q) ||
            value.objects.some((object) =>
              object.name.toLowerCase().includes(q)
            )
        ),
      }))
      .filter((property) => property.values.length > 0);
  }, [configuration, query]);

  const active = findConfigValue(configuration ?? { properties: [] }, configSelection);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="border-b border-[var(--line)] px-3 py-3">
        <p className="type-nav-label">Configure</p>
        <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
          {document?.productCode || document?.modelSku || 'Product'}
        </p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search properties…"
          className="mt-2 w-full rounded-[8px] border border-[var(--line)] bg-white px-2.5 py-1.5 text-[12px] text-[var(--ink)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--ink)]"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {loading ? (
          <p className="type-meta px-2">Loading…</p>
        ) : properties.length === 0 ? (
          <p className="type-meta px-2">
            No product properties mapped. Use Advanced → Scene graph for raw
            objects.
          </p>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <section key={property.id}>
                <p className="px-2 text-[12px] font-medium text-[var(--ink)]">
                  {property.name}
                </p>
                <ul className="mt-1 space-y-0.5">
                  {property.values.map((value) => {
                    const selected =
                      activeConfigValues[property.id] === value.id;
                    return (
                      <li key={value.id}>
                        <button
                          type="button"
                          onClick={() =>
                            selectConfigValue(property.id, value.id)
                          }
                          className={`flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left ${
                            selected
                              ? 'bg-black/[0.05]'
                              : 'hover:bg-black/[0.03]'
                          }`}
                        >
                          <span
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? 'border-[var(--ink)]'
                                : 'border-[var(--line)]'
                            }`}
                          >
                            {selected ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
                            ) : null}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[13px] ${
                                selected
                                  ? 'font-medium text-[var(--ink)]'
                                  : 'text-[var(--ink)]/85'
                              }`}
                            >
                              {value.name}
                            </span>
                            {value.objects[0] ? (
                              <span className="block truncate text-[11px] text-[var(--text-muted)]">
                                {value.objects[0].name}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-[var(--line)] pt-3">
          <button
            type="button"
            onClick={() => setAdvancedOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-[8px] px-2 py-2 text-left hover:bg-black/[0.03]"
          >
            <span>
              <span className="type-nav-label block">Advanced</span>
              <span className="text-[12px] text-[var(--ink)]">Scene graph</span>
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {advancedOpen ? 'Hide' : 'Show'}
            </span>
          </button>
          {advancedOpen ? (
            <div className="mt-1 px-1">
              <SceneGraphList />
            </div>
          ) : null}
        </div>

        {active ? (
          <p className="mt-4 px-2 type-meta">
            Selected {active.property.name} / {active.value.name}
          </p>
        ) : null}
      </div>

      <div className="border-t border-[var(--line)] p-2">
        <button
          type="button"
          onClick={() => {
            openDrawer('objects');
            setStatusMessage('Object library drawer is a shell for now.');
          }}
          className="w-full rounded-[8px] border border-dashed border-[var(--line)] px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.03]"
        >
          + Add object
        </button>
      </div>
    </aside>
  );
}
