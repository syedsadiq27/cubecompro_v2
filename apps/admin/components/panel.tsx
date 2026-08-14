export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-[var(--ink)]">{title}</h2>
        {action}
      </header>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}
