'use client';

export type PartColorRow = {
  id: string;
  label: string;
  valueLabel?: string;
  swatch?: string;
};

export function ColorPartRows({
  title = 'Customize parts',
  rows,
  onSelect,
}: {
  title?: string;
  rows: PartColorRow[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      <p className="ui:text-sm ui:font-semibold ui:text-[#1f1f1f]">{title}</p>
      <ul className="ui:flex ui:flex-col ui:gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect?.(row.id)}
              className="ui:flex ui:w-full ui:items-center ui:justify-between ui:rounded-xl ui:border ui:border-[#e4e0d9] ui:bg-white ui:px-3 ui:py-3 ui:text-left ui:transition-colors ui:hover:border-[#cfc9bf]"
            >
              <span className="ui:text-sm ui:font-medium ui:text-[#353535]">
                {row.label}
              </span>
              <span className="ui:flex ui:items-center ui:gap-2 ui:text-sm ui:text-[#7a776f]">
                {row.swatch ? (
                  <span
                    className="ui:inline-block ui:h-3.5 ui:w-3.5 ui:rounded-full ui:border ui:border-[#d6d6d6]"
                    style={{ backgroundColor: row.swatch }}
                  />
                ) : null}
                <span>{row.valueLabel ?? 'Choose'}</span>
                <span aria-hidden="true">›</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
