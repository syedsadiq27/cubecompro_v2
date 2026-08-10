'use client';

export type ColorwayVariantOption = {
  id: string;
  label: string;
  thumbnailUrl?: string | null;
  selected?: boolean;
};

export function ColorwayVariantGrid({
  title = 'Choose Color',
  variants,
  onSelect,
}: {
  title?: string;
  variants: ColorwayVariantOption[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      <p className="ui:text-[1.125rem] ui:font-bold ui:uppercase ui:text-[#cf132b]">
        {title}
      </p>
      <div className="ui:grid ui:max-h-[28rem] ui:grid-cols-2 ui:gap-3 ui:overflow-y-auto ui:pr-1 ui:min-[450px]:grid-cols-3">
        {variants.map((variant) => {
          const active = Boolean(variant.selected);
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect?.(variant.id)}
              className={[
                'ui:relative ui:aspect-square ui:overflow-hidden ui:rounded-sm ui:border ui:bg-white ui:text-left ui:shadow-[0px_0px_6px_#9898981C]',
                active ? 'ui:border-[#e11a38]' : 'ui:border-transparent',
              ].join(' ')}
            >
              {variant.thumbnailUrl ? (
                <img
                  src={variant.thumbnailUrl}
                  alt=""
                  className="ui:h-full ui:w-full ui:object-contain ui:mix-blend-multiply"
                />
              ) : (
                <div className="ui:flex ui:h-full ui:items-center ui:justify-center ui:bg-[#F2F1EE] ui:px-2 ui:text-center ui:text-xs ui:font-bold ui:uppercase ui:text-[#5d5d5d]">
                  {variant.label}
                </div>
              )}
              <span className="ui:absolute ui:right-0 ui:bottom-0 ui:left-0 ui:bg-white/90 ui:px-2 ui:py-1 ui:text-[0.6875rem] ui:font-bold ui:uppercase ui:text-[#353535]">
                {variant.label}
              </span>
              {active ? (
                <span className="ui:absolute ui:top-0 ui:right-0 ui:bg-[#e11a38] ui:px-2 ui:py-1 ui:text-xs ui:font-bold ui:text-white">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
