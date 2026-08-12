import { solutions } from '@/lib/content';

export function Solutions() {
  return (
    <section
      id="surfaces"
      className="border-t border-[var(--line)] bg-[var(--surface)]"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-8 lg:py-28">
        <p className="text-sm text-[var(--text-muted)]">Surfaces</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
          The tools behind purchasable 3D experiences.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
          From catalog setup to storefront embed — one product graph, many
          surfaces. Not five disconnected tools.
        </p>

        <ol className="mt-14 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {solutions.map((solution, index) => (
            <li
              key={solution.name}
              className="grid gap-3 py-9 md:grid-cols-[4.5rem_minmax(0,13rem)_1fr] md:items-baseline md:gap-10"
            >
              <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--stage-violet)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="type-section text-[20px]">{solution.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {solution.role}
                </p>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-[15px]">
                {solution.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
