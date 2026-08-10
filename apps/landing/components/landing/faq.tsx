import { faqs } from '../../lib/content';

export function Faq() {
  return (
    <section id="faq" className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-8 lg:py-28">
        <p className="text-sm text-[var(--text-muted)]">FAQ</p>
        <h2 className="type-page mt-3 max-w-xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
          Before you book a session.
        </h2>

        <div className="mt-12 max-w-3xl divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer list-none text-base font-medium tracking-tight text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-6">
                  {item.question}
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-[var(--text-muted)] transition group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
