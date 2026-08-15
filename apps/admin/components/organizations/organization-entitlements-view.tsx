'use client';

import { AccessToggles } from '@/components/access-toggles';
import { DataTable, Panel, StatusBadge } from '@repo/ui';
import { sourceLabel } from '@/lib/format';
import type { CatalogApplication, ResolvedRow } from '@/lib/types';

export function OrganizationEntitlementsView({
  organizationId,
  applications,
  capabilities,
  planName,
}: {
  organizationId: string;
  applications: CatalogApplication[];
  capabilities: ResolvedRow[];
  planName?: string | null;
}) {
  return (
    <div className="space-y-4">
      <Panel title="Applications">
        <AccessToggles
          organizationId={organizationId}
          applications={applications}
          capabilities={capabilities}
          planName={planName}
        />
      </Panel>
      {applications.map((app) => {
        const caps = capabilities.filter((row) => row.application === app.id);
        if (caps.length === 0) return null;
        return (
          <Panel key={app.id} title={app.label}>
            <DataTable.Root>
              <DataTable.Header>
                <tr>
                  <DataTable.Head>Capability</DataTable.Head>
                  <DataTable.Head>Key</DataTable.Head>
                  <DataTable.Head>State</DataTable.Head>
                  <DataTable.Head>Source</DataTable.Head>
                </tr>
              </DataTable.Header>
              <DataTable.Body>
                {caps.map((row) => (
                  <DataTable.Row key={row.key}>
                    <DataTable.Cell>{row.label}</DataTable.Cell>
                    <DataTable.Cell className="font-mono text-[12px]">
                      {row.key}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <StatusBadge
                        role={row.enabled ? 'active' : 'draft'}
                        label={row.enabled ? 'Enabled' : 'Disabled'}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell className="text-[var(--text-muted)]">
                      {sourceLabel(row.source, planName)}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable.Body>
            </DataTable.Root>
          </Panel>
        );
      })}
    </div>
  );
}
