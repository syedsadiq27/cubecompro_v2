import type { ReactNode } from 'react';

export function CustomizerStickyBar({
  rack,
  disclaimer,
  price,
  actions,
  mobile,
}: {
  rack?: ReactNode;
  disclaimer?: ReactNode;
  price?: ReactNode;
  actions?: ReactNode;
  mobile?: ReactNode;
}) {
  return (
    <>
      <footer className="ui:z-[6] ui:hidden ui:w-full ui:flex-col ui:justify-between ui:gap-y-[0.9375rem] ui:border-t ui:border-[#e0e0e0] ui:bg-[#F2F1EE] ui:p-0 ui:md:flex ui:md:flex-row">
        <div className="ui:flex ui:h-full ui:w-full ui:items-center ui:justify-between ui:gap-1 ui:self-center ui:xl:w-5/6 ui:xl:gap-x-3">
          {rack}
          <div className="ui:flex ui:flex-1 ui:items-center ui:justify-center ui:gap-2 ui:p-1 ui:text-[0.75rem] ui:text-[#5d5d5d] ui:xl:p-0">
            {disclaimer}
          </div>
          {price}
        </div>
        <div className="ui:flex ui:w-full ui:justify-between ui:gap-2 ui:p-1 ui:xl:w-1/6 ui:xl:justify-normal ui:xl:gap-[0.9375rem] ui:xl:p-0 ui:xl:pt-[0.6875rem] ui:xl:pb-[0.5625rem]">
          {actions}
        </div>
      </footer>
      {mobile ? (
        <div className="ui:absolute ui:right-0 ui:bottom-0 ui:left-0 ui:z-[1] ui:flex ui:h-[50px] ui:w-full ui:flex-row ui:justify-between ui:border-t ui:border-[#e0e0e0] ui:bg-[#F2F1EE] ui:md:hidden">
          {mobile}
        </div>
      ) : null}
    </>
  );
}

export function CustomizerStickyRack({
  label = 'Product Rack',
  count,
  onClick,
}: {
  label?: string;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ui:hidden ui:max-w-[280px] ui:w-full ui:cursor-pointer ui:items-center ui:justify-center ui:bg-[#E21938] ui:px-2 ui:sm:flex ui:md:pt-[1.4375rem] ui:md:pb-[1.375rem] ui:xl:max-w-[12.5rem] ui:xl:px-0"
    >
      <span className="ui:relative ui:flex ui:items-center ui:gap-x-[0.5rem] ui:text-[1rem] ui:font-bold ui:text-white">
        {typeof count === 'number' ? (
          <span className="ui:absolute ui:top-[-0.25rem] ui:right-[-1.875rem] ui:rounded-full ui:bg-white ui:px-[0.5rem] ui:py-[0.0625rem] ui:text-[0.8125rem] ui:text-[#E21938] ui:md:top-[-0.8125rem] ui:md:right-[-1.2625rem]">
            {count}
          </span>
        ) : null}
        <span aria-hidden="true">▦</span>
        <span className="ui:hidden ui:md:block">{label}</span>
      </span>
    </button>
  );
}

export function CustomizerStickyPrice({
  label = 'Price:',
  value = '—',
}: {
  label?: string;
  value?: string;
}) {
  return (
    <div className="ui:flex ui:items-center ui:whitespace-nowrap ui:text-[18px] ui:font-bold ui:text-[#cf132b] ui:xl:pr-[3.125rem] ui:xl:text-[1.5625rem]">
      <span>{label}</span>
      <span className="ui:pl-2">{value}</span>
    </div>
  );
}

export function CustomizerStickyAction({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="ui:viewSummary ui:mr-[0.9375rem] ui:flex ui:items-center ui:md:flex-1">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="ui:flex ui:h-[3rem] ui:flex-1 ui:items-center ui:justify-center ui:rounded-none ui:bg-[#353535] ui:px-[0.6875rem] ui:py-[0.6875rem] ui:text-[1rem] ui:font-bold ui:text-white ui:disabled:opacity-50 ui:min-[1300px]:text-[1.0625rem]"
      >
        {children}
      </button>
    </div>
  );
}
