import { Frame, Typography } from '@repo/ui';

const STEPS = [
  {
    zone: 'Your stack',
    title: 'Your Frontend',
    detail: 'UI / CMS',
  },
  {
    zone: 'CubeCom',
    title: 'CubeCom Engine',
    detail: 'Rules / Resolve',
  },
  {
    zone: 'Commerce',
    title: 'Commerce',
    detail: 'Cart / OMS',
  },
] as const;

export function HeadlessArchitectureDiagram() {
  return (
    <Frame className="bg-[var(--surface-pure)] shadow-[0_28px_70px_-42px_rgba(16,16,16,0.5)]">
      <div className="hidden border-b border-[var(--line)] px-6 py-5 md:block">
        <Typography variant="code" tone="muted">
          ARCHITECTURE
        </Typography>
        <Typography variant="titleSm" tone="strong" className="mt-2 text-lg">
          Your Frontend → CubeCom Engine → Commerce
        </Typography>
        <Typography variant="mono" className="mt-3 tracking-[0.08em]">
          Your stack&nbsp;&nbsp;|&nbsp;&nbsp;CubeCom&nbsp;&nbsp;|&nbsp;&nbsp;Commerce
        </Typography>
      </div>

      <div className="p-0">
        <ol className="grid md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`relative border-t border-[var(--line)] px-4 py-4 first:border-t-0 md:border-t-0 md:p-6 ${
                index > 0 ? 'md:border-l md:border-[var(--border-strong)]' : ''
              } ${
                index === 1
                  ? 'bg-[var(--ink)] text-[var(--canvas)] md:min-h-[11rem]'
                  : 'bg-[var(--surface)] md:min-h-[11rem]'
              }`}
            >
              <Typography
                variant="mono"
                tone={index === 1 ? 'ink' : 'muted'}
                className="hidden md:block"
              >
                {step.zone}
              </Typography>
              <Typography
                variant="titleSm"
                tone={index === 1 ? 'ink' : 'strong'}
                className="md:mt-4 md:text-[20px]"
              >
                {step.title}
              </Typography>
              <Typography
                variant="code"
                tone={index === 1 ? 'ink' : 'muted'}
                className="mt-1 md:mt-3"
              >
                {step.detail}
              </Typography>
              {index < STEPS.length - 1 ? (
                <span
                  className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 translate-x-1/2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-pure)] px-2 py-1 text-sm font-medium text-[var(--ink)] shadow-sm md:block"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
              {index < STEPS.length - 1 ? (
                <span
                  className={`mt-3 flex justify-center text-sm md:hidden ${
                    index === 1 ? 'text-white/55' : 'text-[var(--text-muted)]'
                  }`}
                  aria-hidden
                >
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <Typography
          variant="bodyStrong"
          className="border-t border-[var(--line)] px-4 py-4 md:px-6 md:py-5 md:text-[17px]"
        >
          You own presentation. CubeCom owns configuration truth.
        </Typography>
      </div>
    </Frame>
  );
}
