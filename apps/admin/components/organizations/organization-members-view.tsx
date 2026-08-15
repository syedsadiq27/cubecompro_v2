'use client';

import { DataTable, Panel } from '@repo/ui';
import type { Member } from '@/lib/types';

export function OrganizationMembersView({ members }: { members: Member[] }) {
  return (
    <Panel title="Members">
      {members.length === 0 ? (
        <p className="type-meta">No members on this tenant.</p>
      ) : (
        <DataTable.Root>
          <DataTable.Header>
            <tr>
              <DataTable.Head>Email</DataTable.Head>
              <DataTable.Head>Name</DataTable.Head>
              <DataTable.Head>Role</DataTable.Head>
            </tr>
          </DataTable.Header>
          <DataTable.Body>
            {members.map((member) => (
              <DataTable.Row key={member.id}>
                <DataTable.Cell>{member.email}</DataTable.Cell>
                <DataTable.Cell>{member.name ?? '—'}</DataTable.Cell>
                <DataTable.Cell className="capitalize">
                  {member.roleName}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable.Root>
      )}
    </Panel>
  );
}
