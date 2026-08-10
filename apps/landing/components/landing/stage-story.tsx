import { graphNodes, stageBeats, stageOutcomes } from '../../lib/content';

export function StageStory() {
  return (
    <section id="stage" className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-8 lg:py-28">
        <p className="text-sm text-[var(--text-muted)]">How CubeCom works</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
          One product graph. The Stage and the cart agree.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
          Catalog data becomes a product graph. The Stage shows it. Commerce
          sells it. Change the object — the sellable state follows.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
          <ol className="space-y-10">
            {stageBeats.map((beat, index) => (
              <li key={beat.label}>
                <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--stage-violet)]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="type-section mt-2 text-[20px]">{beat.label}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                  {beat.detail}
                </p>
              </li>
            ))}
          </ol>

          <div className="font-mono text-sm text-[var(--ink)]">
            <div className="border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-4">
              Catalog / PIM
            </div>
            <div className="flex justify-center py-2 text-[var(--text-muted)]">
              ↓
            </div>
            <div className="border border-[var(--ink)] bg-[var(--ink)] px-5 py-4 text-white">
              Product graph · on Stage
            </div>
            <ul className="border border-t-0 border-[var(--border-strong)] bg-[var(--surface-pure)]">
              {graphNodes.map((node) => (
                <li
                  key={node}
                  className="border-t border-[var(--line)] px-5 py-3 text-[var(--text-secondary)]"
                >
                  ├── {node}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-[var(--line)] pt-14 md:grid-cols-3">
          {stageOutcomes.map((outcome) => (
            <div key={outcome.title}>
              <h3 className="type-card text-[17px]">{outcome.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {outcome.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
