export function StateLabel({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`text-[12px] font-medium ${
        enabled ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'
      }`}
    >
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  );
}
