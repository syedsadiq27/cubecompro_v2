'use client';

export function CurrentLookSummary({
  title,
  descriptor,
  accents,
  labels,
}: {
  title: string;
  descriptor?: string;
  accents?: string[];
  labels?: string[];
}) {
  const chips =
    accents && accents.length > 0
      ? accents.slice(0, 3).map((hex, index) => ({
          hex,
          label: labels?.[index] ?? ['Crown', 'Visor', 'Mesh'][index],
        }))
      : null;

  return (
    <div className="ui:rounded-[1.25rem] ui:bg-[#f4f0ea] ui:px-4 ui:py-3.5">
      <p className="ui:text-[0.625rem] ui:font-medium ui:tracking-[0.16em] ui:text-[#8a867e] ui:uppercase">
        Current look
      </p>
      <p className="ui:mt-1.5 ui:text-lg ui:leading-tight ui:font-semibold ui:tracking-tight ui:text-[#141311]">
        {title}
      </p>
      {descriptor ? (
        <p className="ui:mt-1 ui:text-sm ui:text-[#7a776f]">{descriptor}</p>
      ) : null}
      {chips ? (
        <div className="ui:mt-3.5 ui:flex ui:flex-wrap ui:gap-x-3 ui:gap-y-2">
          {chips.map((chip) => (
            <span
              key={`${chip.label}-${chip.hex}`}
              className="ui:inline-flex ui:items-center ui:gap-1.5 ui:text-xs ui:font-medium ui:text-[#2f2d2a]"
            >
              <span
                className="ui:h-2.5 ui:w-2.5 ui:rounded-full ui:ring-1 ui:ring-black/10"
                style={{ backgroundColor: chip.hex }}
              />
              {chip.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
