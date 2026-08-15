import Link from 'next/link';
import { Panel, StatusBadge } from '@/components/suite-ui';
import { UsageBar } from '@/components/usage-bar';
import { loadResolved } from '@/lib/api';
import { limitDisplay, sourceLabel } from '@/lib/format';

export default async function OrganizationOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = await loadResolved(id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Plan"
        actions={
          <Link
            href={`/organizations/${id}/plan`}
            className="type-meta hover:text-[var(--ink)]"
          >
            Change
          </Link>
        }
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
          <dt className="type-meta">Plan</dt>
          <dd className="font-medium">{resolved.planName ?? 'None'}</dd>
          <dt className="type-meta">Includes</dt>
          <dd>{resolved.parentPlanName ?? '—'}</dd>
          <dt className="type-meta">Renews</dt>
          <dd>—</dd>
          <dt className="type-meta">Source</dt>
          <dd>Manual</dd>
        </dl>
      </Panel>

      <Panel
        title="Applications"
        actions={
          <Link
            href={`/organizations/${id}/entitlements`}
            className="type-meta hover:text-[var(--ink)]"
          >
            Edit
          </Link>
        }
      >
        <ul className="space-y-2">
          {resolved.applications.map((app) => (
            <li
              key={app.id}
              className="flex items-center justify-between text-[13px]"
            >
              <span>{app.label}</span>
              <span className="flex items-center gap-2">
                <StatusBadge
                  role={app.enabled ? 'active' : 'draft'}
                  label={app.enabled ? 'Enabled' : 'Disabled'}
                />
                <span className="type-meta">
                  {sourceLabel(app.source, resolved.planName)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Limits"
        actions={
          <Link
            href={`/organizations/${id}/usage`}
            className="type-meta hover:text-[var(--ink)]"
          >
            Usage
          </Link>
        }
      >
        <ul className="space-y-3">
          {resolved.limits.map((row) => (
            <li key={row.key}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span>{row.label}</span>
                <span className="tabular-nums text-[var(--text-secondary)]">
                  {limitDisplay(row)}
                </span>
              </div>
              <UsageBar used={row.used ?? 0} limit={row.limit ?? 0} />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Overrides"
        actions={
          <Link
            href={`/organizations/${id}/overrides`}
            className="type-meta hover:text-[var(--ink)]"
          >
            Manage
          </Link>
        }
      >
        {resolved.overrides.length === 0 ? (
          <p className="type-meta">None. Plan values apply as-is.</p>
        ) : (
          <ul className="space-y-1.5 text-[13px]">
            {resolved.overrides.map((row) => (
              <li key={row.id} className="flex justify-between gap-3">
                <code className="font-mono text-[12px]">{row.key}</code>
                <span>
                  {row.kind === 'CAPABILITY'
                    ? row.value === 'true' || row.value === '1'
                      ? 'enabled'
                      : 'disabled'
                    : row.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Members"
        actions={
          <Link
            href={`/organizations/${id}/members`}
            className="type-meta hover:text-[var(--ink)]"
          >
            All
          </Link>
        }
      >
        {resolved.members.length === 0 ? (
          <p className="type-meta">No members.</p>
        ) : (
          <ul className="space-y-2 text-[13px]">
            {resolved.members.map((member) => (
              <li key={member.id} className="flex justify-between gap-3">
                <span>{member.email}</span>
                <span className="type-meta capitalize">{member.roleName}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
