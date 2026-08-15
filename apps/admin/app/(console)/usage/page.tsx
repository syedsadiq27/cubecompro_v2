'use client';

import { Button, DataTable, PageHeader } from '@repo/ui';

const USAGE_ROWS = [
  { org: 'Acme Corp', api: '1.44M / 2M', apiPct: 72, storage: '48 GB / 100 GB', storagePct: 48, compute: '84 hrs / 200 hrs', computePct: 42, ai: '420 / 1K', aiPct: 42 },
  { org: 'Soylent Corp', api: '1.82M / 2M', apiPct: 91, storage: '76 GB / 100 GB', storagePct: 76, compute: '140 hrs / 200 hrs', computePct: 70, ai: '880 / 1K', aiPct: 88 },
  { org: 'Nike Demo', api: '180K / 1M', apiPct: 18, storage: '12 GB / 100 GB', storagePct: 12, compute: '36 hrs / 150 hrs', computePct: 24, ai: '80 / 1K', aiPct: 8 },
  { org: 'Northwind', api: '1.22M / 2M', apiPct: 61, storage: '140 GB / 3 TB', storagePct: 5, compute: '110 hrs / Unlimited', computePct: 20, ai: '1.2K / 5K', aiPct: 24 },
];

export default function UsagePage() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Usage &amp; Telemetry"
          description="Resource consumption, API quotas, compute times, and storage limits across organizations."
          action={
            <Button type="button" size="sm" variant="secondary">
              Export CSV
            </Button>
          }
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>ORGANIZATION</DataTable.Head>
                <DataTable.Head>API CALLS</DataTable.Head>
                <DataTable.Head>STORAGE</DataTable.Head>
                <DataTable.Head>3D COMPUTE</DataTable.Head>
                <DataTable.Head>AI CREDITS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {USAGE_ROWS.map((row) => (
                <DataTable.Row key={row.org}>
                  <DataTable.Cell className="font-semibold text-[var(--ink)]">
                    {row.org}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{row.api}</span>
                      <div className="h-1.5 w-28 rounded-full bg-[var(--canvas)] overflow-hidden">
                        <div className="h-full bg-[var(--ink)]" style={{ width: `${row.apiPct}%` }} />
                      </div>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{row.storage}</span>
                      <div className="h-1.5 w-28 rounded-full bg-[var(--canvas)] overflow-hidden">
                        <div className="h-full bg-[var(--ink)]" style={{ width: `${row.storagePct}%` }} />
                      </div>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{row.compute}</span>
                      <div className="h-1.5 w-28 rounded-full bg-[var(--canvas)] overflow-hidden">
                        <div className="h-full bg-[var(--ink)]" style={{ width: `${row.computePct}%` }} />
                      </div>
                    </div>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{row.ai}</span>
                      <div className="h-1.5 w-28 rounded-full bg-[var(--canvas)] overflow-hidden">
                        <div className="h-full bg-[var(--ink)]" style={{ width: `${row.aiPct}%` }} />
                      </div>
                    </div>
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
