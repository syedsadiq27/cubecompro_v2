import Link from 'next/link';
import { PageHeader, Panel } from '../ui';

export function CommercePlaceholder({
  projectId,
  title,
  description,
  href,
  linkLabel,
}: {
  projectId: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Panel className="space-y-3">
        <p className="text-[13px] text-[var(--bo-muted)]">
          This surface is part of the commerce infrastructure information
          architecture. Product → configuration → resolution → SKU / price /
          inventory → channel will land here as dedicated workflows.
        </p>
        <Link
          href={href ?? `/${projectId}/products`}
          className="inline-flex rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px]"
        >
          {linkLabel ?? 'Back to products'}
        </Link>
      </Panel>
    </div>
  );
}
