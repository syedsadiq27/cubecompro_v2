'use client';

import { DataTable, PageHeader } from '@repo/ui';

type CapabilityRow = {
  key: string;
  label: string;
  application: string;
};

export function EntitlementsCatalogView({
  capabilities,
}: {
  capabilities: CapabilityRow[];
}) {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Entitlements Catalog"
          count={capabilities.length}
          description="Live capability catalog, feature gates, and organization entitlement overrides."
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>KEY</DataTable.Head>
                <DataTable.Head>CAPABILITY LABEL</DataTable.Head>
                <DataTable.Head>APPLICATION</DataTable.Head>
                <DataTable.Head className="text-right">GATE</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {capabilities.map((cap) => (
                <DataTable.Row key={cap.key}>
                  <DataTable.Cell className="font-mono font-semibold text-[var(--ink)]">
                    {cap.key}
                  </DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">
                    {cap.label}
                  </DataTable.Cell>
                  <DataTable.Cell className="font-mono text-[10px] text-[var(--text-secondary)]">
                    {cap.application}
                  </DataTable.Cell>
                  <DataTable.Cell className="text-right font-mono text-[11px] text-emerald-700">
                    Enforced
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable.Root>
        </div>
      </div>
    </div>
  );
}
