const SYSTEMS = [
  {
    tag: 'RULES',
    name: 'Rules Engine',
    io: 'graph → transitions',
    body: 'Dependencies and exclusions authored once.',
  },
  {
    tag: 'STATE',
    name: 'State Resolver',
    io: 'selection → valid state',
    body: 'Illegal choices rewrite to a legal state.',
  },
  {
    tag: 'COMMERCE',
    name: 'Commerce Projection',
    io: 'state → SKU / price / stock',
    body: 'Maps state to a sellable line identity.',
  },
  {
    tag: 'RUNTIME',
    name: 'Channel Runtime',
    io: 'state → storefront / API',
    body: 'Same truth for embeds, sales, and agents.',
  },
] as const;

export function PcInfrastructure() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[90rem] px-5 py-10 md:px-8 md:py-16">
        <p className="text-sm text-[var(--text-muted)]">Infrastructure</p>
        <h2 className="type-page mt-3 max-w-3xl text-[clamp(1.75rem,3.5vw,2.6rem)]">
          Configuration as commerce infrastructure
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:gap-4 lg:grid-cols-4">
          {SYSTEMS.map((system) => (
            <article
              key={system.name}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 md:rounded-2xl md:p-5"
            >
              <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--ink)]">
                {system.tag}
              </p>
              <h3 className="type-section mt-2 text-[15px] md:mt-3 md:text-[17px]">
                {system.name}
              </h3>
              <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-[var(--text-muted)] md:mt-2">
                {system.io}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)] md:mt-3 md:text-sm">
                {system.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
