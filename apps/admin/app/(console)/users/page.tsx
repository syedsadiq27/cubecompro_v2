import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { loadUsers } from '@/lib/api';

export default async function UsersPage() {
  const users = await loadUsers();

  return (
    <>
      <PageHeader
        title="Users"
        description="Membership lookup across tenants. Open the organization to see resolved access."
      />
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-[var(--surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Email</th>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Organization</th>
              <th className="px-4 py-2.5 font-semibold">Plan</th>
              <th className="px-4 py-2.5 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-[var(--line)] hover:bg-[var(--surface)]"
              >
                <td className="p-0">
                  <Link
                    href={`/organizations/${user.organizationId}/members`}
                    className="block px-4 py-2.5"
                  >
                    {user.email}
                  </Link>
                </td>
                <td className="px-4 py-2.5">{user.name ?? '—'}</td>
                <td className="p-0">
                  <Link
                    href={`/organizations/${user.organizationId}`}
                    className="block px-4 py-2.5"
                  >
                    {user.organizationName}
                  </Link>
                </td>
                <td className="px-4 py-2.5">{user.planName ?? '—'}</td>
                <td className="px-4 py-2.5 capitalize">{user.roleName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
