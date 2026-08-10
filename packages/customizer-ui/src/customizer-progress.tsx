'use client';

export type ProgressStep = {
  id: string;
  label: string;
  status: 'complete' | 'current' | 'upcoming';
  index: number;
};

export function CustomizerProgress({
  steps,
  onSelect,
  compact = false,
}: {
  steps: ProgressStep[];
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  const current = steps.find((step) => step.status === 'current');
  const total = steps.length;

  if (compact && current) {
    return (
      <div className="ui:flex ui:items-center ui:gap-2">
        {steps.map((step) => {
          const active = step.status === 'current';
          const complete = step.status === 'complete';
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect?.(step.id)}
              title={step.label}
              aria-label={`Go to ${step.label}`}
              aria-current={active ? 'step' : undefined}
              className={[
                'ui:h-1.5 ui:rounded-full ui:transition-all',
                active
                  ? 'ui:w-6 ui:bg-white'
                  : complete
                    ? 'ui:w-1.5 ui:bg-white/55 ui:hover:bg-white/80'
                    : 'ui:w-1.5 ui:bg-white/25 ui:hover:bg-white/45',
              ].join(' ')}
            />
          );
        })}
        <span className="ui:ml-1 ui:text-[0.6875rem] ui:tracking-[0.12em] ui:text-white/55 ui:uppercase">
          {String(current.index).padStart(2, '0')} /{' '}
          {String(total).padStart(2, '0')}
          <span className="ui:text-white/35"> · </span>
          <span className="ui:tracking-normal ui:normal-case ui:text-white/80">
            {current.label}
          </span>
        </span>
      </div>
    );
  }

  return (
    <nav
      aria-label="Customization progress"
      className="ui:flex ui:min-w-0 ui:items-end ui:gap-5 ui:overflow-x-auto"
    >
      {steps.map((step) => {
        const active = step.status === 'current';
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect?.(step.id)}
            className="ui:group ui:flex ui:shrink-0 ui:flex-col ui:items-start ui:gap-2"
          >
            <span
              className={[
                'ui:text-[0.6875rem] ui:tracking-[0.16em] ui:uppercase',
                active
                  ? 'ui:text-white'
                  : 'ui:text-white/40 ui:hover:text-white/70',
              ].join(' ')}
            >
              {String(step.index).padStart(2, '0')} {step.label}
            </span>
            <span
              className={[
                'ui:h-px ui:w-full ui:transition-opacity',
                active
                  ? 'ui:bg-white ui:opacity-100'
                  : 'ui:bg-white/20 ui:opacity-0 ui:group-hover:opacity-100',
              ].join(' ')}
            />
          </button>
        );
      })}
    </nav>
  );
}
