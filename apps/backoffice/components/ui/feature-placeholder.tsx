import Link from 'next/link';
import { PageHeader, Panel } from '../ui';

export function FeaturePlaceholder({
  title,
  description,
  detail,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  detail?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Panel className="space-y-3">
        <p className="text-[13px] text-[var(--bo-muted)]">
          {detail ??
            'This surface is deferred in CubeCom v1. Catalog, library, and resolve stay on the API; workflows, CMS, and commerce adapters land later.'}
        </p>
        {href ? (
          <Link
            href={href}
            className="inline-flex rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px]"
          >
            {linkLabel ?? 'Back'}
          </Link>
        ) : null}
      </Panel>
    </div>
  );
}
