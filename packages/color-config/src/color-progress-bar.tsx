'use client';

export type ColorProgressItem = {
  id: string;
  label: string;
  complete?: boolean;
  active?: boolean;
};

export function ColorProgressBar({
  items,
  onSelect,
}: {
  items: ColorProgressItem[];
  onSelect?: (id: string) => void;
}) {
  if (items.length <= 1) return null;

  return (
    <ol className="ui:flex ui:flex-wrap ui:items-center ui:gap-2">
      {items.map((item, index) => (
        <li key={item.id} className="ui:flex ui:items-center ui:gap-2">
          <button
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={[
              'ui:rounded-full ui:px-2.5 ui:py-1 ui:text-[0.6875rem] ui:font-bold ui:uppercase',
              item.active
                ? 'ui:bg-[#e11a38] ui:text-white'
                : item.complete
                  ? 'ui:bg-[#FCE8EB] ui:text-[#cf132b]'
                  : 'ui:bg-white ui:text-[#5d5d5d]',
            ].join(' ')}
          >
            {index + 1}. {item.label}
          </button>
          {index < items.length - 1 ? (
            <span className="ui:h-px ui:w-3 ui:bg-[#e11a38]" aria-hidden="true" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
