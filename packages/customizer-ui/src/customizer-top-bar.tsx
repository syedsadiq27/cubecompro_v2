import type { ReactNode } from 'react';

export function CustomizerTopBar({
  logoUrl,
  brand,
  productName,
  productMeta,
  actions,
  poweredBy,
}: {
  logoUrl?: string;
  brand?: string;
  productName?: string;
  productMeta?: string;
  actions?: ReactNode;
  poweredBy?: ReactNode;
}) {
  return (
    <header className="ui:flex ui:shrink-0 ui:items-center ui:justify-between ui:gap-4 ui:border-b ui:border-[#e0ddd7] ui:bg-[#f7f5f1] ui:px-4 ui:py-3 ui:md:px-6">
      <div className="ui:min-w-0 ui:flex ui:items-center ui:gap-3 ui:md:gap-5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={brand || 'Brand'}
            className="ui:h-7 ui:w-auto ui:max-w-[140px] ui:object-contain"
          />
        ) : brand ? (
          <p className="ui:text-sm ui:font-semibold ui:tracking-wide ui:text-[color:var(--cc-primary,#1f1f1f)]">
            {brand}
          </p>
        ) : null}
        {productName ? (
          <div className="ui:min-w-0">
            <p className="ui:truncate ui:text-sm ui:font-medium ui:text-[#353535]">
              {productName}
            </p>
            {productMeta ? (
              <p className="ui:truncate ui:text-xs ui:text-[#7a776f]">{productMeta}</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="ui:flex ui:shrink-0 ui:items-center ui:gap-3">
        {poweredBy}
        {actions}
      </div>
    </header>
  );
}
