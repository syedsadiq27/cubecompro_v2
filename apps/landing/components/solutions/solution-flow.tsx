export function SolutionFlow({
  steps,
  outputs,
}: {
  steps: string[];
  outputs?: string[];
}) {
  return (
    <div>
      <ol className="flex flex-col gap-0 md:flex-row md:flex-wrap md:items-center md:gap-2">
        {steps.map((step, index) => (
          <li key={step} className="flex flex-col items-center md:flex-row md:gap-2">
            <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-[15px] font-medium md:w-auto md:min-w-[8rem]">
              {step}
            </div>
            {index < steps.length - 1 ? (
              <span className="py-1.5 text-white/40 md:py-0" aria-hidden>
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {outputs?.length ? (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {outputs.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-center font-mono text-xs text-white/75"
            >
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
