'use client';

import { DataTable, PageHeader } from '@repo/ui';
import type { AuditEvent } from '@/lib/types';

export function AuditView({ events }: { events: AuditEvent[] }) {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Platform Audit Log"
          count={events.length}
          description="Immutable platform-wide audit log tracking administrative, configuration, and billing events."
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>EVENT / ACTION</DataTable.Head>
                <DataTable.Head>ACTOR</DataTable.Head>
                <DataTable.Head>TARGET</DataTable.Head>
                <DataTable.Head>SUMMARY</DataTable.Head>
                <DataTable.Head className="text-right">TIMESTAMP</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {events.length > 0 ? (
                events.map((evt) => (
                  <DataTable.Row key={evt.id}>
                    <DataTable.Cell className="font-semibold text-[var(--ink)]">
                      {evt.action}
                    </DataTable.Cell>
                    <DataTable.Cell className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {evt.actorEmail}
                    </DataTable.Cell>
                    <DataTable.Cell className="font-mono text-[10px] text-[var(--text-muted)]">
                      {evt.targetType}: {evt.targetId}
                    </DataTable.Cell>
                    <DataTable.Cell className="text-[11px] text-[var(--text-secondary)]">
                      {evt.summary}
                    </DataTable.Cell>
                    <DataTable.DateCell
                      date={new Date(evt.createdAt).toLocaleDateString()}
                      time={new Date(evt.createdAt).toLocaleTimeString()}
                    />
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell
                    colSpan={5}
                    className="p-6 text-center text-[var(--text-muted)]"
                  >
                    No audit events recorded yet.
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable.Body>
          </DataTable.Root>
        </div>
      </div>
    </div>
  );
}
