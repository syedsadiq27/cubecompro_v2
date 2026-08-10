'use client';

export type ColorwayTypeOption = {
  id: string;
  label: string;
  thumbnailUrl?: string | null;
  selected?: boolean;
};

export function ColorwayTypeGrid({
  title = 'Choose a colorway type',
  types,
  onSelect,
}: {
  title?: string;
  types: ColorwayTypeOption[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      <p className="ui:text-sm ui:font-semibold ui:text-[#1f1f1f]">{title}</p>
      <div className="ui:grid ui:grid-cols-2 ui:gap-3">
        {types.map((type) => {
          const active = Boolean(type.selected);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect?.(type.id)}
              className={[
                'ui:relative ui:aspect-square ui:overflow-hidden ui:rounded-2xl ui:border ui:bg-white ui:text-left',
                active
                  ? 'ui:border-[#1f1f1f] ui:ring-1 ui:ring-[#1f1f1f]'
                  : 'ui:border-[#e4e0d9] ui:hover:border-[#cfc9bf]',
              ].join(' ')}
            >
              {type.thumbnailUrl ? (
                <img
                  src={type.thumbnailUrl}
                  alt=""
                  className="ui:h-full ui:w-full ui:object-contain"
                />
              ) : (
                <div className="ui:flex ui:h-full ui:items-center ui:justify-center ui:bg-[#ece9e4] ui:px-3 ui:text-center ui:text-sm ui:font-medium ui:text-[#5d5d5d]">
                  {type.label}
                </div>
              )}
              <span className="ui:absolute ui:inset-x-0 ui:bottom-0 ui:bg-white/90 ui:px-2 ui:py-1.5 ui:text-xs ui:font-medium ui:text-[#353535]">
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
