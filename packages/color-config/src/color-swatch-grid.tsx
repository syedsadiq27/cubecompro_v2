'use client';

export type ColorSwatch = {
  hex: string;
  label?: string;
  selected?: boolean;
};

function isLightColor(hex: string): boolean {
  const normalized = hex.replace('#', '').toLowerCase();
  return normalized === 'ffffff' || normalized === 'f3f5fb' || normalized === 'fff';
}

export function ColorSwatchGrid({
  title = 'Colors',
  swatches,
  onSelect,
}: {
  title?: string;
  swatches: ColorSwatch[];
  onSelect?: (hex: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3">
      <p className="ui:text-sm ui:font-semibold ui:text-[#1f1f1f]">{title}</p>
      <div className="ui:grid ui:max-h-[15.4375rem] ui:grid-cols-[repeat(auto-fill,minmax(1.875rem,1.875rem))] ui:gap-x-[0.8125rem] ui:gap-y-[0.3125rem] ui:overflow-y-auto ui:pr-1">
        {swatches.map((swatch) => {
          const active = Boolean(swatch.selected);
          const light = isLightColor(swatch.hex);
          return (
            <button
              key={swatch.hex}
              type="button"
              title={swatch.label || swatch.hex}
              aria-label={swatch.label || swatch.hex}
              aria-pressed={active}
              onClick={() => onSelect?.(swatch.hex)}
              className={[
                'ui:relative ui:h-[1.875rem] ui:w-[1.875rem] ui:rounded-sm ui:border ui:border-[#D6D6D6]',
                active ? 'ui:ring-2 ui:ring-[#1f1f1f] ui:ring-offset-1' : '',
              ].join(' ')}
              style={{ backgroundColor: swatch.hex }}
            >
              {active ? (
                <span
                  className={[
                    'ui:absolute ui:inset-0 ui:flex ui:items-center ui:justify-center ui:text-[0.65rem] ui:font-bold',
                    light ? 'ui:text-[#353535]' : 'ui:text-white',
                  ].join(' ')}
                >
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
