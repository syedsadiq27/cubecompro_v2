import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/suite-ui';
import { OrgSubnav } from '@/components/org-subnav';
import { loadResolved } from '@/lib/api';
import { tenantStatusRole, trialLabel } from '@/lib/format';

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let resolved;
  try {
    resolved = await loadResolved(id);
  } catch {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/organizations"
            className="type-meta mb-1 inline-block hover:text-[var(--ink)]"
          >
            Organizations
          </Link>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            {resolved.organizationName}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <span>{resolved.planName ?? 'No plan'}</span>
            <span className="text-[var(--line)]">·</span>
            <StatusBadge
              role={tenantStatusRole(resolved.status)}
              label={trialLabel(resolved.status, resolved.trialEndsAt)}
            />
            <span className="type-meta font-mono">{resolved.slug}</span>
          </p>
        </div>
      </div>
      <OrgSubnav organizationId={id} />
      <div className="pt-5">{children}</div>
    </div>
  );
}
