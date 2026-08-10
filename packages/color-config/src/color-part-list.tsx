'use client';

export type ColorPartOption = {
  id: string;
  label: string;
  selected?: boolean;
};

export function ColorPartList({
  parts,
  onSelect,
  title,
}: {
  parts: ColorPartOption[];
  onSelect?: (id: string) => void;
  title?: string;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      {title ? (
        <p className="ui:text-sm ui:font-semibold ui:text-[#1f1f1f]">{title}</p>
      ) : null}
      <ul className="ui:flex ui:flex-col ui:gap-2">
        {parts.map((part) => {
          const active = Boolean(part.selected);
          return (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => onSelect?.(part.id)}
                className={[
                  'ui:flex ui:w-full ui:items-center ui:justify-between ui:rounded-xl ui:border ui:bg-white ui:px-3 ui:py-3 ui:text-left ui:transition-colors',
                  active
                    ? 'ui:border-[#1f1f1f]'
                    : 'ui:border-[#e4e0d9] ui:hover:border-[#cfc9bf]',
                ].join(' ')}
              >
                <span className="ui:text-sm ui:font-medium ui:text-[#353535]">
                  {part.label}
                </span>
                <span className="ui:text-sm ui:text-[#7a776f]" aria-hidden="true">
                  {active ? '✓' : '›'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
