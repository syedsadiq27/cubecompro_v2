'use client';

import { Button, DataTable, PageHeader, StatusBadge } from '@repo/ui';

const JOBS = [
  { id: 'job-9841', org: 'Nike Demo', type: '3D Geometry Optimization', status: 'Running', duration: '2m 14s', attempts: 1, created: '2 mins ago' },
  { id: 'job-9840', org: 'Acme Corp', type: 'Dynamic Thumbnail Render', status: 'Completed', duration: '45s', attempts: 1, created: '14 mins ago' },
  { id: 'job-9839', org: 'Vandelay', type: 'Shopify Webhook Ingestion', status: 'Failed', duration: '5s', attempts: 3, created: '1 hour ago' },
  { id: 'job-9838', org: 'Northwind', type: 'USDZ AR Asset Export', status: 'Completed', duration: '1m 20s', attempts: 1, created: '3 hours ago' },
];

export default function JobsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Processing Jobs"
          count={JOBS.length}
          description="Async 3D mesh compression, texture baking, thumbnail queues, and ingestion pipelines."
          action={
            <Button type="button" size="sm" variant="secondary">
              Retry all failed
            </Button>
          }
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>JOB ID</DataTable.Head>
                <DataTable.Head>ORGANIZATION</DataTable.Head>
                <DataTable.Head>TYPE</DataTable.Head>
                <DataTable.Head>STATUS</DataTable.Head>
                <DataTable.Head>DURATION</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {JOBS.map((job) => (
                <DataTable.Row key={job.id}>
                  <DataTable.Cell className="font-mono font-medium text-[var(--ink)]">
                    {job.id}
                  </DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">
                    {job.org}
                  </DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">
                    {job.type}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <StatusBadge
                      role={job.status === 'Completed' ? 'published' : job.status === 'Running' ? 'info' : 'danger'}
                      label={job.status}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {job.duration}
                  </DataTable.Cell>
                  <DataTable.ActionsCell>
                    <Button type="button" size="sm" variant="secondary" className="ui:text-[11px]">
                      Logs
                    </Button>
                  </DataTable.ActionsCell>
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable.Root>
        </div>
      </div>
    </div>
  );
}
