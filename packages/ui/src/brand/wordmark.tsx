export function Wordmark({
  size = 'md',
  showPro = false,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'nav';
  showPro?: boolean;
  className?: string;
}) {
  const word =
    size === 'lg'
      ? 'ui:text-[28px] ui:tracking-[-0.045em]'
      : size === 'nav'
        ? 'ui:text-[20px] ui:tracking-[-0.035em]'
        : size === 'sm'
          ? 'ui:text-[17px] ui:tracking-[-0.03em]'
          : 'ui:text-[18px] ui:tracking-[-0.035em]';
  const o =
    size === 'lg' || size === 'nav'
      ? 'ui:h-[0.72em] ui:w-[0.72em]'
      : 'ui:h-[0.7em] ui:w-[0.7em]';

  return (
    <div className={`ui:flex ui:items-baseline ui:gap-2.5 ${className}`}>
      <span
        className={`ui:inline-flex ui:items-baseline ui:font-semibold ui:text-[var(--ink)] ui:lowercase ${word}`}
      >
        cubec
        <span
          aria-hidden
          className={`ui:relative ui:mx-[0.04em] ui:inline-flex ${o} ui:shrink-0 ui:translate-y-[0.06em] ui:items-center ui:justify-center`}
        >
          <span className="ui:absolute ui:inset-0 ui:rounded-full ui:border-[1.5px] ui:border-[var(--stage-violet)]" />
          <span className="ui:absolute ui:inset-[22%] ui:rounded-full ui:bg-[var(--stage-violet)]/18" />
        </span>
        m
      </span>
      {showPro ? (
        <span className="ui:text-[11px] ui:font-medium ui:tracking-[0.08em] ui:text-[var(--text-muted)] ui:uppercase">
          Pro
        </span>
      ) : null}
    </div>
  );
}
