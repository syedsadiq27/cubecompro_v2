export function PageChrome({
  children,
  title,
  description,
  actions,
  toolbar,
  flush = false,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  flush?: boolean;
}) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <div
      data-fill-page
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--bo-line)] bg-[var(--bo-panel)]"
    >
      {hasHeader ? (
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--bo-line)] px-4 py-3">
          <div className="min-w-0">
            {title ? (
              <h1 className="text-lg font-semibold text-[var(--bo-ink)]">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-sm text-[var(--bo-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      <div
        className={
          flush
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'min-h-0 flex-1 overflow-y-auto px-4 py-4'
        }
      >
        {children}
      </div>
    </div>
  );
}
