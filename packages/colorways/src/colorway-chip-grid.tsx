'use client';

export type ColorwayChip = {
  id: string;
  label: string;
  thumbnailUrl?: string | null;
  selected?: boolean;
};

export function ColorwayChipGrid({
  title = 'Choose a colorway',
  chips,
  onSelect,
}: {
  title?: string;
  chips: ColorwayChip[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      <p className="ui:text-sm ui:font-semibold ui:text-[#1f1f1f]">{title}</p>
      <div className="ui:grid ui:grid-cols-2 ui:gap-2 ui:sm:grid-cols-3">
        {chips.map((chip) => {
          const active = Boolean(chip.selected);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelect?.(chip.id)}
              className={[
                'ui:flex ui:items-center ui:gap-2.5 ui:rounded-full ui:border ui:bg-white ui:px-2.5 ui:py-2 ui:text-left ui:transition-colors',
                active
                  ? 'ui:border-[#1f1f1f] ui:ring-1 ui:ring-[#1f1f1f]'
                  : 'ui:border-[#e4e0d9] ui:hover:border-[#cfc9bf]',
              ].join(' ')}
            >
              <span className="ui:relative ui:h-8 ui:w-8 ui:shrink-0 ui:overflow-hidden ui:rounded-full ui:bg-[#ece9e4]">
                {chip.thumbnailUrl ? (
                  <img
                    src={chip.thumbnailUrl}
                    alt=""
                    className="ui:h-full ui:w-full ui:object-cover"
                  />
                ) : (
                  <span className="ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:text-[0.625rem] ui:font-semibold ui:text-[#7a776f]">
                    {chip.label.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="ui:min-w-0 ui:truncate ui:text-sm ui:text-[#353535]">
                {active ? '● ' : '○ '}
                {chip.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
