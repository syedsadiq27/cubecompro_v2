import Link from 'next/link';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          {title}
        </h1>
        {description ? <p className="type-meta mt-1">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          target={action.href.startsWith('http') ? '_blank' : undefined}
          rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-lg bg-[var(--ink)] px-3 py-1.5 text-[12px] font-medium text-white"
        >
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}
