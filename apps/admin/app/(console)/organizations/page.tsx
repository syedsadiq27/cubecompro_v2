import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { loadTenants } from '@/lib/api';

export default async function OrganizationsPage() {
  const tenants = await loadTenants();

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Tenants are the unit of access. Open one to see resolved plan, apps, limits, and overrides."
        action={{ href: '/organizations/new', label: 'New organization' }}
      />
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead className="bg-[var(--surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Organization</th>
              <th className="px-4 py-2.5 font-semibold">Plan</th>
              <th className="px-4 py-2.5 font-semibold">Members</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-t border-[var(--line)] hover:bg-[var(--surface)]"
              >
                <td className="p-0">
                  <Link
                    href={`/organizations/${tenant.id}`}
                    className="block px-4 py-3"
                  >
                    <span className="block font-medium text-[var(--ink)]">
                      {tenant.name}
                    </span>
                    <span className="type-meta font-mono">{tenant.slug}</span>
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/organizations/${tenant.id}`}
                    className="block px-4 py-3"
                  >
                    {tenant.planName ?? '—'}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/organizations/${tenant.id}/members`}
                    className="block px-4 py-3 tabular-nums"
                  >
                    {tenant.memberCount}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/organizations/${tenant.id}`}
                    className="block px-4 py-3"
                  >
                    <StatusBadge
                      status={tenant.status}
                      trialEndsAt={tenant.trialEndsAt}
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
