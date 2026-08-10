import { whyReasons } from '../../lib/content';

export function Why3d() {
  return (
    <section id="why" className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-8 lg:py-28">
        <p className="text-sm text-[var(--text-muted)]">Why brands need this</p>
        <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
          Photos freeze one look. Your product does not.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
          CubeCom exists for brands whose options outrun the photo studio — and
          who still need every look to resolve into commerce.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {whyReasons.map((reason, index) => (
            <div key={reason.title}>
              <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--stage-violet)]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="type-section mt-3 text-[20px] md:text-[22px]">
                {reason.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-[15px]">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
