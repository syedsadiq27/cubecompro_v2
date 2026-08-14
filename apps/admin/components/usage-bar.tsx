export function UsageBar({
  used,
  limit,
}: {
  used: number;
  limit: number;
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const over = limit > 0 && used > limit;
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
      <div
        className={`h-full rounded-full ${
          over ? 'bg-[var(--danger)]' : 'bg-[var(--brand)]'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
