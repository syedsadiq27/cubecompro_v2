'use client';

export type ColorwayCard = {
  id: string;
  label: string;
  thumbnailUrl?: string | null;
  selected?: boolean;
};

export function ColorwayCardRail({
  title = 'Popular',
  cards,
  onSelect,
}: {
  title?: string;
  cards: ColorwayCard[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-2 ui:md:gap-3">
      <p className="ui:text-[0.75rem] ui:font-medium ui:tracking-[0.14em] ui:text-[#8a867e] ui:uppercase">
        {title}
      </p>
      <div className="ui:-mx-4 ui:flex ui:gap-2.5 ui:overflow-x-auto ui:px-4 ui:pb-1 ui:md:-mx-6 ui:md:gap-3 ui:md:px-6 ui:[scrollbar-width:none] ui:[&::-webkit-scrollbar]:hidden">
        {cards.map((card) => {
          const active = Boolean(card.selected);
          const shortLabel = card.label.split(' / ')[0] || card.label;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect?.(card.id)}
              className="ui:group ui:flex ui:w-[calc((100%-1.25rem)/2.3)] ui:shrink-0 ui:flex-col ui:text-left ui:transition-transform ui:duration-200 ui:hover:-translate-y-0.5 ui:md:w-[8.5rem]"
            >
              <span
                className={[
                  'ui:relative ui:mb-2 ui:aspect-[4/5] ui:overflow-hidden ui:rounded-[1rem] ui:bg-[#ece8e1] ui:md:mb-2.5 ui:md:rounded-[1.25rem]',
                  active
                    ? 'ui:ring-2 ui:ring-[#141311] ui:ring-offset-2 ui:ring-offset-[#fffcf8]'
                    : 'ui:ring-1 ui:ring-black/5',
                ].join(' ')}
              >
                {card.thumbnailUrl ? (
                  <img
                    src={card.thumbnailUrl}
                    alt=""
                    className="ui:h-full ui:w-full ui:object-cover ui:transition-transform ui:duration-300 ui:group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:px-3 ui:text-center ui:text-xs ui:font-medium ui:tracking-wide ui:text-[#7a776f] ui:uppercase">
                    {shortLabel}
                  </span>
                )}
              </span>
              <span className="ui:text-[0.6875rem] ui:font-medium ui:tracking-[0.12em] ui:text-[#8a867e] ui:uppercase">
                {shortLabel}
              </span>
              <span className="ui:mt-0.5 ui:truncate ui:text-sm ui:text-[#2f2d2a]">
                {card.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
