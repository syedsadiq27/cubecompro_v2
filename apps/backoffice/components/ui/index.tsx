export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-[var(--bo-ink)]">{title}</h1>
        {description ? (
          <p className="mt-0.5 max-w-2xl text-sm text-[var(--bo-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--bo-line)] bg-[var(--bo-surface,#f7f5f1)] p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Panel>
      <p className="type-body text-[var(--bo-muted)]">{message}</p>
    </Panel>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Panel className="border-[var(--danger)]/25 bg-[var(--danger-soft)]">
      <p className="text-[13px] text-[var(--bo-danger)]">{message}</p>
    </Panel>
  );
}

export function StatusPill({
  label,
  color,
}: {
  label: string;
  color?: string | null;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: color ? `${color}18` : 'var(--surface)',
        color: color || 'var(--bo-ink)',
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color || 'var(--text-muted)' }}
      />
      {label}
    </span>
  );
}
