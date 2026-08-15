import { Frame, Typography } from '@repo/ui';

const STAGES = [
  {
    id: 'selection',
    title: 'Selection',
    owner: 'Your storefront',
    tone: 'light' as const,
    payload: [
      ['fabric', 'beige'],
      ['size', '3-seat'],
      ['legs', 'brass'],
    ],
  },
  {
    id: 'validate',
    title: 'Validate',
    owner: 'CubeCom',
    tone: 'ink' as const,
    payload: [
      ['valid', 'true'],
      ['violations', '[]'],
    ],
  },
  {
    id: 'resolve',
    title: 'Resolve',
    owner: 'CubeCom',
    tone: 'ink' as const,
    payload: [
      ['sku', 'SOFA-3S-BEI-BRS'],
      ['price', '2399'],
      ['inventory', '4'],
    ],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    owner: 'Commerce',
    tone: 'light' as const,
    payload: [
      ['variant', 'SOFA-3S-BEI-BRS'],
      ['line', 'ready'],
      ['qty', '1'],
    ],
  },
  {
    id: 'cart',
    title: 'Cart',
    owner: 'Commerce',
    tone: 'light' as const,
    payload: [
      ['cart', 'open'],
      ['checkout', 'next'],
      ['order', 'pending'],
    ],
  },
] as const;

function StageCard({ stage }: { stage: (typeof STAGES)[number] }) {
  return (
    <div
      data-surface-tone={stage.tone === 'ink' ? 'ink' : 'soft'}
      className={`flex w-full flex-col rounded-xl border px-3.5 py-3.5 md:h-full md:w-[11.25rem] md:px-4 md:py-4 ${
        stage.tone === 'ink'
          ? 'border-white/15 bg-[var(--ink)]'
          : 'border-[var(--line)] bg-[var(--surface)]'
      }`}
    >
      <p
        className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
          stage.tone === 'ink' ? 'text-white/45' : 'text-[var(--text-muted)]'
        }`}
      >
        {stage.title}
      </p>
      <dl className="mt-2.5 flex-1 space-y-1.5 font-mono text-[12px] leading-snug md:mt-3 md:space-y-2">
        {stage.payload.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-3">
            <dt
              className={
                stage.tone === 'ink'
                  ? 'text-white/45'
                  : 'text-[var(--text-muted)]'
              }
            >
              {key}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function OwnershipRail() {
  return (
    <div className="grid grid-cols-3 border-t border-[var(--line)] text-center">
      <div className="border-r border-[var(--line)] px-2 py-3">
        <p className="text-[12px] font-medium text-[var(--ink)] md:text-[13px]">
          Storefront
        </p>
      </div>
      <div className="border-r border-[var(--line)] bg-[var(--ink)] px-2 py-3">
        <p className="text-[12px] font-medium text-[var(--canvas)] md:text-[13px]">
          CubeCom
        </p>
      </div>
      <div className="px-2 py-3">
        <p className="text-[12px] font-medium text-[var(--ink)] md:text-[13px]">
          Commerce
        </p>
      </div>
    </div>
  );
}

export function HeadlessStatePipeline() {
  return (
    <Frame className="bg-[var(--surface-pure)]">
      <div className="border-b border-[var(--line)] px-4 py-3 md:px-5">
        <Typography variant="code" tone="muted">
          STATE PIPELINE
        </Typography>
        <Typography variant="support" className="mt-1">
          Selection → Validate → Resolve → Commerce → Cart
        </Typography>
      </div>

      <div className="p-4 md:hidden">
        <ol className="relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[9px] before:w-0.5 before:bg-[var(--ink)]/25">
          {STAGES.map((stage, index) => (
            <li key={stage.id} className="relative flex gap-3">
              <span
                className="relative z-10 mt-[30px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--surface-pure)] font-mono text-[10px] font-medium text-[var(--ink)]"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <StageCard stage={stage} />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="hidden overflow-x-auto p-5 md:block">
        <ol className="flex min-w-max items-stretch">
          {STAGES.map((stage, index) => (
            <li key={stage.id} className="flex items-center">
              <StageCard stage={stage} />
              {index < STAGES.length - 1 ? (
                <div
                  className="flex shrink-0 items-center justify-center px-3 text-[var(--ink)]"
                  aria-hidden
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--surface-pure)] text-lg font-medium">
                    →
                  </span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <OwnershipRail />
    </Frame>
  );
}
