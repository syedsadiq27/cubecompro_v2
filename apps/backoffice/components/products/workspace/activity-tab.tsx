'use client';

import { useMemo, useState } from 'react';
import { Button, useToast } from '@repo/ui';
import {
  CloseIcon,
  SearchIcon,
} from '@/components/bo/icons';
import { EmptyState } from '@/components/bo';
import type { ShopifyCommerceView } from '@/actions/shopify';
import {
  type GraphDetail,
  useLiveProductData,
} from '@/lib/product-workspace';

type AuditEvent = {
  id: string;
  requestId?: string;
  dateGroup: 'Today' | 'Yesterday' | 'May 10, 2025' | 'May 02, 2025' | 'Apr 28, 2025';
  type: 'publish' | 'mapping' | 'rule' | 'option' | 'asset' | 'metadata';
  title: string;
  target: string;
  description: string;
  actor: string;
  actorRole: string;
  time: string;
  fullTimestamp: string;
  diff?: Array<{
    field: string;
    before: string;
    after: string;
  }>;
};

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt_01HZY8Q9K3W501',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J01',
    dateGroup: 'Today',
    type: 'publish',
    title: 'Product published (v1)',
    target: 'Storefront customizer & commerce',
    description: 'Graph version v1 published to public storefront customizer and commerce channels.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '10:24 AM',
    fullTimestamp: 'May 14, 2025 10:24:12 AM UTC',
    diff: [
      { field: 'isPublished', before: 'false', after: 'true' },
      { field: 'versionStatus', before: 'DRAFT', after: 'ACTIVE' },
    ],
  },
  {
    id: 'evt_01HZY8Q9K3W502',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J02',
    dateGroup: 'Today',
    type: 'mapping',
    title: 'Pricing mapping updated',
    target: 'Default Price ($299 → $349)',
    description: 'Resolved base price adjusted across standard configurations.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '10:24 AM',
    fullTimestamp: 'May 14, 2025 10:24:01 AM UTC',
    diff: [
      { field: 'price.amount', before: '299.00', after: '349.00' },
      { field: 'price.currency', before: 'USD', after: 'USD' },
    ],
  },
  {
    id: 'evt_01HZY8Q9K3W503',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J03',
    dateGroup: 'Today',
    type: 'asset',
    title: '3D model processed',
    target: 'demo-chair.glb (24.6 MB)',
    description: 'Processed GLB geometry demo-chair.glb with 6 mesh targets and Draco compression.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '10:20 AM',
    fullTimestamp: 'May 14, 2025 10:20:45 AM UTC',
    diff: [
      { field: 'model.status', before: 'PROCESSING', after: 'READY' },
      { field: 'model.targets', before: '0', after: '3 (web, ar, thumbnails)' },
    ],
  },
  {
    id: 'evt_01HZY8Q9K3W504',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J04',
    dateGroup: 'Yesterday',
    type: 'option',
    title: 'Option value added',
    target: 'Option: Color → Added “White”',
    description: 'Added choice value “White” to option “Color”.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '03:45 PM',
    fullTimestamp: 'May 13, 2025 03:45:10 PM UTC',
    diff: [
      { field: 'attributes[color].values', before: '["Black"]', after: '["Black", "White"]' },
    ],
  },
  {
    id: 'evt_01HZY8Q9K3W505',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J05',
    dateGroup: 'May 10, 2025',
    type: 'rule',
    title: 'Compatibility rule created',
    target: 'Material = Leather → Color ≠ White',
    description: 'Added compatibility rule: White is not available for leather material.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '09:11 AM',
    fullTimestamp: 'May 10, 2025 09:11:00 AM UTC',
    diff: [
      { field: 'rule.priority', before: '—', after: '1' },
      { field: 'rule.condition', before: '—', after: 'Material = Leather' },
      { field: 'rule.action', before: '—', after: 'Color ≠ White' },
    ],
  },
  {
    id: 'evt_01HZY8Q9K3W506',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J06',
    dateGroup: 'May 02, 2025',
    type: 'mapping',
    title: 'Commerce connector initialized',
    target: 'Generic SKU-BLK-XL-WAL',
    description: 'Attached Shopify Generic Connector to resolve SKU-BLK-XL-WAL.',
    actor: 'API Service',
    actorRole: 'Service Account',
    time: '02:15 PM',
    fullTimestamp: 'May 02, 2025 02:15:22 PM UTC',
  },
  {
    id: 'evt_01HZY8Q9K3W507',
    requestId: 'req_01HZY8Q9K3W5YD8M7F2J07',
    dateGroup: 'Apr 28, 2025',
    type: 'metadata',
    title: 'Product created',
    target: 'Key: CHAIR-01',
    description: 'Initial product record created with key CHAIR-01.',
    actor: 'Demo Owner',
    actorRole: 'Admin',
    time: '09:11 AM',
    fullTimestamp: 'Apr 28, 2025 09:11:00 AM UTC',
  },
];

const SHOPIFY_IMPORT_EVENT: AuditEvent = {
  id: 'evt_shopify_import',
  dateGroup: 'Today',
  type: 'mapping',
  title: 'Imported from Shopify',
  target: 'ProductRevision + CommerceMappingSet',
  description:
    'Choices and commerce mappings were created from the Shopify catalog. No compatibility rules or 3D bindings were invented.',
  actor: 'System',
  actorRole: 'Import',
  time: 'Just now',
  fullTimestamp: new Date().toISOString(),
};

export function ActivityTab({
  projectId,
  productId,
  detail,
  shopifyCommerce,
}: {
  projectId: string;
  productId: string;
  detail?: GraphDetail | null;
  shopifyCommerce?: ShopifyCommerceView | null;
}) {
  const toast = useToast();
  const live = useLiveProductData(detail ?? null, shopifyCommerce);
  const events = live
    ? shopifyCommerce
      ? [SHOPIFY_IMPORT_EVENT]
      : []
    : AUDIT_EVENTS;
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    events[0]?.id ?? null
  );
  const [typeFilter, setTypeFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (typeFilter !== 'all' && evt.type !== typeFilter) return false;
      if (actorFilter !== 'all' && evt.actor !== actorFilter) return false;
      if (dateFilter === 'today' && evt.dateGroup !== 'Today') return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.target.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.actor.toLowerCase().includes(q) ||
        (evt.requestId || '').toLowerCase().includes(q) ||
        evt.id.toLowerCase().includes(q)
      );
    });
  }, [events, typeFilter, actorFilter, dateFilter, query]);

  // Group events by dateGroup
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: AuditEvent[] } = {};
    for (const evt of filteredEvents) {
      if (!groups[evt.dateGroup]) {
        groups[evt.dateGroup] = [];
      }
      groups[evt.dateGroup]!.push(evt);
    }
    return groups;
  }, [filteredEvents]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  if (live && events.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--ink)]">Activity</h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
            Immutable event timeline and change audit for this product graph.
          </p>
        </div>
        <EmptyState
          title="No activity yet"
          description="Publish, option edits, and commerce sync events will appear here when the audit stream is wired."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Chronological Stream Area (~8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {/* Header */}
        <div className="py-1">
          <h2 className="text-[15px] font-semibold text-[var(--ink)]">Activity</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Immutable event timeline and change audit for this product graph.
          </p>
        </div>

        {/* Dense Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by event, actor, SKU, or ID..."
              className="h-8 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] pl-8 pr-3 text-[12px] text-[var(--ink)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--ink)]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
          >
            <option value="all">Event type: All</option>
            <option value="publish">Publishing</option>
            <option value="mapping">Commerce mappings</option>
            <option value="rule">Rules</option>
            <option value="option">Options</option>
            <option value="asset">3D assets</option>
            <option value="metadata">Metadata</option>
          </select>

          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="h-8 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
          >
            <option value="all">Actor: All</option>
            <option value="Demo Owner">Demo Owner</option>
            <option value="API Service">API Service</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-8 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
          >
            <option value="all">Date: All time</option>
            <option value="today">Today only</option>
          </select>
        </div>

        {/* Dense Audit Feed */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="p-8 text-center text-[13px] text-[var(--text-muted)]">
              No audit events match your filters.
            </div>
          ) : (
            Object.entries(groupedEvents).map(([dateGroup, items]) => (
              <div key={dateGroup} className="p-0">
                {/* Date Group Header */}
                <div className="bg-[var(--canvas)]/50 px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--line)]/60">
                  {dateGroup}
                </div>

                {/* Event Rows */}
                <div className="divide-y divide-[var(--line)]/40">
                  {items.map((evt) => {
                    const isSelected = selectedEventId === evt.id;
                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={`flex items-center gap-3.5 px-4 py-2.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[var(--canvas)]/70 shadow-[inset_2px_0_0_0_#665CFF]'
                            : 'hover:bg-[var(--canvas)]/30'
                        }`}
                      >
                        {/* Time */}
                        <div className="w-16 shrink-0 font-mono text-[11px] text-[var(--text-muted)]">
                          {evt.time}
                        </div>

                        {/* Muted category dot */}
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />

                        {/* Event Title & Target */}
                        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2 text-[12px]">
                          <span className="font-semibold text-[var(--ink)] truncate">
                            {evt.title}
                          </span>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-[var(--text-secondary)] font-mono text-[11px] truncate">
                            {evt.target}
                          </span>
                        </div>

                        {/* Actor */}
                        <div className="shrink-0 text-right text-[11px]">
                          <span className="font-medium text-[var(--ink)]">{evt.actor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Event Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {selectedEvent ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                      {selectedEvent.type}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {selectedEvent.time}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[14px] font-semibold text-[var(--ink)]">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventId(null)}
                  aria-label="Close"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>

            {/* Context & Provenance */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Context &amp; Provenance
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Actor</span>
                  <span className="font-medium text-[var(--ink)]">
                    {selectedEvent.actor} ({selectedEvent.actorRole})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Timestamp</span>
                  <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                    {selectedEvent.fullTimestamp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Event ID</span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {selectedEvent.id}
                  </span>
                </div>
                {selectedEvent.requestId ? (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Request ID</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {selectedEvent.requestId}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Summary Description */}
            <div className="p-4 space-y-1 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Event Description
              </h4>
              <p className="text-[var(--text-secondary)] leading-relaxed pt-0.5">
                {selectedEvent.description}
              </p>
            </div>

            {/* Structured State Diff Viewer */}
            {selectedEvent.diff && selectedEvent.diff.length > 0 ? (
              <div className="p-4 space-y-2">
                <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  State Changes
                </h4>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 overflow-hidden text-[11px] font-mono">
                  <div className="grid grid-cols-12 border-b border-[var(--line)] bg-[var(--canvas)]/80 px-3 py-1.5 font-semibold text-[10px] text-[var(--text-muted)] uppercase">
                    <span className="col-span-4">Field</span>
                    <span className="col-span-4 text-red-700">Before</span>
                    <span className="col-span-4 text-emerald-700">After</span>
                  </div>
                  <div className="divide-y divide-[var(--line)]/50">
                    {selectedEvent.diff.map((d, i) => (
                      <div key={i} className="grid grid-cols-12 px-3 py-2 text-[11px] items-center">
                        <span className="col-span-4 text-[var(--ink)] truncate" title={d.field}>
                          {d.field}
                        </span>
                        <span className="col-span-4 text-red-700 truncate" title={d.before}>
                          - {d.before}
                        </span>
                        <span className="col-span-4 text-emerald-700 truncate" title={d.after}>
                          + {d.after}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Action */}
            <div className="p-4">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full ui:h-8 ui:text-[12px]"
                onClick={() => toast.info(`Comparing snapshot at ${selectedEvent.time}`)}
              >
                Inspect snapshot diff
              </Button>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
