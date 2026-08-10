'use client';

export type SignatureLookCard = {
  id: string;
  title: string;
  descriptor: string;
  thumbnailUrl?: string | null;
  accents?: string[];
  selected?: boolean;
};

export function SignatureLookGrid({
  title = 'Signature colorways',
  looks,
  onSelect,
  footer,
}: {
  title?: string;
  looks: SignatureLookCard[];
  onSelect?: (id: string) => void;
  footer?: string;
}) {
  return (
    <div className="ui:flex ui:flex-col ui:gap-3.5">
      <p className="ui:text-[0.6875rem] ui:font-medium ui:tracking-[0.16em] ui:text-[#8a867e] ui:uppercase">
        {title}
      </p>
      <div className="ui:grid ui:grid-cols-2 ui:gap-3">
        {looks.map((look) => {
          const active = Boolean(look.selected);
          return (
            <button
              key={look.id}
              type="button"
              onClick={() => onSelect?.(look.id)}
              className={[
                'ui:group ui:relative ui:flex ui:flex-col ui:overflow-hidden ui:rounded-[1.25rem] ui:bg-[#f4f0ea] ui:text-left ui:transition-transform ui:duration-200 ui:hover:-translate-y-0.5',
                active
                  ? 'ui:ring-2 ui:ring-[#141311]'
                  : 'ui:ring-1 ui:ring-black/8',
              ].join(' ')}
            >
              <span className="ui:relative ui:aspect-[4/3] ui:overflow-hidden ui:bg-[#ece8e1]">
                {look.thumbnailUrl ? (
                  <img
                    src={look.thumbnailUrl}
                    alt=""
                    className="ui:h-full ui:w-full ui:object-cover ui:transition-transform ui:duration-300 ui:group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:px-3 ui:text-center ui:text-sm ui:font-medium ui:text-[#7a776f]">
                    {look.title}
                  </span>
                )}
                {active ? (
                  <span className="ui:absolute ui:top-2.5 ui:right-2.5 ui:flex ui:h-6 ui:w-6 ui:items-center ui:justify-center ui:rounded-full ui:bg-[#141311] ui:text-xs ui:font-bold ui:text-white">
                    ✓
                  </span>
                ) : null}
              </span>
              <span className="ui:flex ui:flex-col ui:gap-1.5 ui:px-3 ui:pt-2.5 ui:pb-3">
                {look.accents && look.accents.length > 0 ? (
                  <span className="ui:flex ui:gap-1.5">
                    {look.accents.map((hex) => (
                      <span
                        key={hex}
                        className="ui:h-2.5 ui:w-2.5 ui:rounded-full ui:ring-1 ui:ring-black/10"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </span>
                ) : null}
                <span className="ui:text-[0.9375rem] ui:leading-tight ui:font-semibold ui:tracking-tight ui:text-[#141311]">
                  {look.title}
                </span>
                <span className="ui:line-clamp-2 ui:text-xs ui:leading-snug ui:text-[#7a776f]">
                  {look.descriptor}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {footer ? (
        <p className="ui:text-xs ui:text-[#8a867e]">{footer}</p>
      ) : null}
    </div>
  );
}
