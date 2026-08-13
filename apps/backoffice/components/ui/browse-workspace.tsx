'use client';

export function BrowseWorkspace({
  title,
  meta,
  subtitle,
  actions,
  filters,
  search,
  secondary,
  children,
  inspector,
}: {
  title: string;
  meta?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  search?: React.ReactNode;
  secondary?: React.ReactNode;
  children: React.ReactNode;
  inspector?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--bo-line)] px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h1 className="text-lg font-semibold text-[var(--bo-ink)]">
                {title}
              </h1>
              {meta}
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-[var(--bo-muted)]">
                {subtitle}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </header>

        {(filters || search) && (
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--bo-line)] px-4 py-2.5">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              {filters}
            </div>
            {search}
          </div>
        )}

        {secondary}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </div>

      {inspector}
    </div>
  );
}

export function BrowseTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap ${
        active
          ? 'bg-[var(--bo-ink)] text-white'
          : 'text-[var(--bo-ink)]/75 hover:bg-black/[0.04]'
      }`}
    >
      {label}
      {count != null ? (
        <span
          className={`ml-1.5 text-[11px] ${
            active ? 'text-white/70' : 'text-[var(--bo-muted)]'
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function BrowseSearch({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full max-w-[220px] rounded-lg border border-[var(--bo-line)] bg-white px-3 py-1.5 text-sm sm:w-[200px]"
    />
  );
}
