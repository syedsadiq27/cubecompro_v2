const WITHOUT = [
  'Invalid combinations reach checkout',
  'Duplicated rules in every frontend',
  'Catalog explosion with every new option',
  'Brittle handoff to ERP and OMS',
];

const WITH = [
  'One rule graph for every surface',
  'One valid state at a time',
  'One resolution path to commerce',
  'Same truth for web, sales, and API',
];

export function PcCompare() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-10 md:px-8 md:py-16">
        <p className="text-sm text-[var(--text-muted)]">Contrast</p>
        <h2 className="type-page mt-3 max-w-3xl text-[clamp(1.85rem,3.5vw,2.6rem)]">
          Without CubeCom vs with CubeCom
        </h2>

        <div className="mt-8 grid gap-0 overflow-hidden rounded-2xl border border-[var(--border-strong)] md:mt-12 lg:grid-cols-2">
          <div className="bg-[var(--surface)] p-5 md:p-8">
            <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--text-muted)] uppercase">
              Without CubeCom
            </p>
            <ul className="mt-5 space-y-4 md:mt-6">
              {WITHOUT.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-[var(--line)] pt-4 text-[15px] text-[var(--ink)] first:border-t-0 first:pt-0 md:text-base"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--ink)] p-5 text-[var(--canvas)] md:p-8">
            <p className="text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
              With CubeCom
            </p>
            <ul className="mt-5 space-y-4 md:mt-6">
              {WITH.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-white/10 pt-4 text-[15px] first:border-t-0 first:pt-0 md:text-base"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
