'use client';

import { Button, DataTable, PageHeader, StatusBadge } from '@repo/ui';

const FLAGS = [
  { key: 'webgl2-geometry-instancing', description: 'Hardware-accelerated mesh instance rendering in storefront', rollout: '100% (GA)', status: 'Enabled' },
  { key: 'pbr-anisotropy-textures', description: 'Brushed metal anisotropic reflection shading model', rollout: '25% (Beta)', status: 'Enabled' },
  { key: 'ar-spatial-anchors-v2', description: 'Enhanced planar surface locking for iOS Quick Look and Android WebXR', rollout: '10% (Beta)', status: 'Enabled' },
  { key: 'shopify-instant-cart-sync', description: 'Zero-latency GraphQL storefront cart synchronization', rollout: '100% (GA)', status: 'Enabled' },
];

export default function FeatureFlagsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Feature Flags"
          count={FLAGS.length}
          description="Progressive rollout toggles, beta engine capabilities, and tenant override targeting."
          action={
            <Button type="button" size="sm">
              + New flag
            </Button>
          }
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>FLAG KEY</DataTable.Head>
                <DataTable.Head>DESCRIPTION</DataTable.Head>
                <DataTable.Head>ROLLOUT</DataTable.Head>
                <DataTable.Head>STATUS</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {FLAGS.map((flag) => (
                <DataTable.Row key={flag.key}>
                  <DataTable.Cell className="font-mono font-medium text-[var(--ink)]">
                    {flag.key}
                  </DataTable.Cell>
                  <DataTable.Cell className="text-[var(--text-secondary)]">
                    {flag.description}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {flag.rollout}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <StatusBadge role="active" label={flag.status} />
                  </DataTable.Cell>
                  <DataTable.ActionsCell>
                    <Button type="button" size="sm" variant="secondary" className="ui:text-[11px]">
                      Edit
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
