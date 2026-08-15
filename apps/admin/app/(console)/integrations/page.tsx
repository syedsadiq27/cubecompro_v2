'use client';

import { Button, DataTable, PageHeader, StatusBadge } from '@repo/ui';

const INTEGRATIONS = [
  { provider: 'Shopify Plus Connector', connected: '18 orgs', successRate: '99.8%', status: 'Healthy', version: 'v2.4' },
  { provider: 'commercetools API Engine', connected: '4 orgs', successRate: '100%', status: 'Healthy', version: 'v1.8' },
  { provider: 'AWS S3 Asset Ingestion', connected: '24 orgs', successRate: '100%', status: 'Healthy', version: 'Native' },
  { provider: 'Stripe Billing & Subscriptions', connected: '24 orgs', successRate: '99.9%', status: 'Healthy', version: 'v2024-11' },
];

export default function IntegrationsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Global Integrations"
          count={INTEGRATIONS.length}
          description="Platform connectors, commerce adapters, cloud storage buckets, and payment gateways."
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>INTEGRATION</DataTable.Head>
                <DataTable.Head>CONNECTED TENANTS</DataTable.Head>
                <DataTable.Head>SUCCESS RATE</DataTable.Head>
                <DataTable.Head>STATUS</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {INTEGRATIONS.map((intg) => (
                <DataTable.Row key={intg.provider}>
                  <DataTable.Cell className="font-semibold text-[var(--ink)]">
                    {intg.provider}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {intg.connected}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {intg.successRate}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <StatusBadge role="active" label={intg.status} />
                  </DataTable.Cell>
                  <DataTable.ActionsCell>
                    <Button type="button" size="sm" variant="secondary" className="ui:text-[11px]">
                      Configure
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
