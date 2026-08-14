import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { loadAudit, loadTenants } from '@/lib/api';

export default async function AuditPage() {
  const [events, tenants] = await Promise.all([loadAudit(), loadTenants()]);
  const names = new Map(tenants.map((row) => [row.id, row.name]));

  return (
    <>
      <PageHeader
        title="Audit"
        description="Who changed a plan, status, or override."
      />
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-[var(--surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
            <tr>
              <th className="px-4 py-2.5 font-semibold">When</th>
              <th className="px-4 py-2.5 font-semibold">Actor</th>
              <th className="px-4 py-2.5 font-semibold">Organization</th>
              <th className="px-4 py-2.5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td className="type-meta px-4 py-4" colSpan={4}>
                  No audit events yet. Plan and override changes will appear
                  here.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-[var(--line)]"
                >
                  <td className="px-4 py-2.5 type-meta whitespace-nowrap">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    {event.actorEmail ?? 'system'}
                  </td>
                  <td className="px-4 py-2.5">
                    {event.organizationId ? (
                      <Link
                        href={`/organizations/${event.organizationId}`}
                        className="hover:underline"
                      >
                        {names.get(event.organizationId) ??
                          event.organizationId}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="type-meta mr-2 font-mono">
                      {event.action}
                    </span>
                    {event.summary}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
