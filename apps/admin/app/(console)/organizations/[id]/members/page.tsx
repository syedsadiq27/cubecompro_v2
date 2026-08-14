import { Panel } from '@/components/panel';
import { loadResolved } from '@/lib/api';

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = await loadResolved(id);

  return (
    <Panel title="Members">
      {resolved.members.length === 0 ? (
        <p className="type-meta">No members on this tenant.</p>
      ) : (
        <table className="w-full text-left text-[13px]">
          <thead className="type-meta">
            <tr>
              <th className="py-1.5 font-medium">Email</th>
              <th className="py-1.5 font-medium">Name</th>
              <th className="py-1.5 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {resolved.members.map((member) => (
              <tr key={member.id} className="border-t border-[var(--line)]">
                <td className="py-2">{member.email}</td>
                <td className="py-2">{member.name ?? '—'}</td>
                <td className="py-2 capitalize">{member.roleName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
