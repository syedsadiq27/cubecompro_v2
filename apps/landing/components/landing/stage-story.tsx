import { howItWorksFlow, howItWorksSteps } from '../../lib/content';

export function StageStory() {
  return (
    <section id="stage" className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-8 lg:py-28">
        <p className="text-sm text-[var(--text-muted)]">How CubeCom works</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
          One product. Every choice stays connected.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
          When a shopper changes the product in 3D, CubeCom keeps the product
          data behind it in sync.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <ol className="space-y-10">
            {howItWorksSteps.map((step, index) => (
              <li key={step.label}>
                <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--stage-violet)]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="type-section mt-2 text-[20px]">{step.label}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>

          <div className="text-sm text-[var(--ink)]">
            {howItWorksFlow.map((layer, index) => (
              <div key={layer.title}>
                {index > 0 ? (
                  <div className="flex justify-center py-2.5 text-[var(--text-muted)]">
                    ↓
                  </div>
                ) : null}
                <div
                  className={
                    layer.emphasized
                      ? 'border border-[var(--ink)] bg-[var(--ink)] px-5 py-4 text-white'
                      : 'border border-[var(--border-strong)] bg-[var(--surface-pure)] px-5 py-4'
                  }
                >
                  <p
                    className={`text-[11px] font-medium tracking-[0.06em] uppercase ${
                      layer.emphasized
                        ? 'text-white/55'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {layer.title}
                  </p>
                  <p
                    className={`mt-2 leading-relaxed ${
                      layer.emphasized
                        ? 'text-white'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {layer.items.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-14 max-w-2xl border-t border-[var(--line)] pt-10 text-base leading-relaxed text-[var(--text-secondary)]">
          No duplicate configuration logic. No guessing between the 3D
          experience and your commerce system.
        </p>
      </div>
    </section>
  );
}
