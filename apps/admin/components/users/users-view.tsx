'use client';

import Link from 'next/link';
import { DataTable, PageHeader } from '@repo/ui';

export type TenantUser = {
  id: string;
  userId: string;
  email: string;
  name?: string | null;
  roleName: string;
  organizationId: string;
  organizationName: string;
  planName?: string | null;
};

export function UsersView({ users }: { users: TenantUser[] }) {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Users"
          count={users.length}
          description="Cross-platform identity, multi-tenant memberships, and authentication security."
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>USER</DataTable.Head>
                <DataTable.Head>ORGANIZATION</DataTable.Head>
                <DataTable.Head>ROLE</DataTable.Head>
                <DataTable.Head>PLAN</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {users.length > 0 ? (
                users.map((u) => (
                  <DataTable.Row key={u.id}>
                    <DataTable.Cell>
                      <p className="font-semibold text-[var(--ink)]">
                        {u.name || 'User'}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">
                        {u.email}
                      </p>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Link
                        href={`/organizations/${u.organizationId}`}
                        className="hover:underline"
                      >
                        {u.organizationName}
                      </Link>
                    </DataTable.Cell>
                    <DataTable.Cell className="font-mono text-[10px] text-[var(--ink)] capitalize">
                      {u.roleName}
                    </DataTable.Cell>
                    <DataTable.Cell className="font-mono text-[10px] text-[var(--text-muted)]">
                      {u.planName ?? '—'}
                    </DataTable.Cell>
                    <DataTable.ActionsCell>
                      <Link
                        href={`/organizations/${u.organizationId}/members`}
                        className="rounded-md border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
                      >
                        Manage
                      </Link>
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell
                    colSpan={5}
                    className="p-6 text-center text-[var(--text-muted)]"
                  >
                    No active users found in cluster.
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
