'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const SHEET_DEFAULT_VH = 42;
const SHEET_EXPANDED_VH = 62;

export function CustomizerShell({
  canvas,
  topBar,
  panel,
}: {
  canvas: ReactNode;
  topBar?: ReactNode;
  panel?: ReactNode;
}) {
  const [sheetVh, setSheetVh] = useState(SHEET_DEFAULT_VH);
  const [isDesktop, setIsDesktop] = useState(false);
  const dragRef = useRef<{ startY: number; startVh: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragRef.current) return;
      const deltaVh =
        ((dragRef.current.startY - event.clientY) / window.innerHeight) * 100;
      const next = dragRef.current.startVh + deltaVh;
      setSheetVh(
        Math.min(SHEET_EXPANDED_VH, Math.max(SHEET_DEFAULT_VH, next))
      );
    };
    const onUp = () => {
      if (!dragRef.current) return;
      setSheetVh((current) =>
        current > (SHEET_DEFAULT_VH + SHEET_EXPANDED_VH) / 2
          ? SHEET_EXPANDED_VH
          : SHEET_DEFAULT_VH
      );
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div className="ui:relative ui:flex ui:h-dvh ui:flex-col ui:overflow-hidden ui:bg-[#2f2d2a]">
      {topBar ? <div className="ui:relative ui:z-40 ui:shrink-0">{topBar}</div> : null}

      <div className="ui:relative ui:flex ui:min-h-0 ui:flex-1 ui:flex-col ui:md:block">
        <div className="ui:relative ui:min-h-0 ui:flex-1 ui:md:absolute ui:md:inset-0">
          <div className="ui:absolute ui:inset-0">{canvas}</div>
        </div>

        {panel ? (
          <div
            className="ui:relative ui:z-30 ui:flex ui:min-h-0 ui:shrink-0 ui:flex-col ui:md:pointer-events-none ui:md:absolute ui:md:inset-x-auto ui:md:top-5 ui:md:right-5 ui:md:bottom-auto ui:md:max-h-[min(72vh,740px)] ui:md:w-[390px]"
            style={isDesktop ? undefined : { height: `${sheetVh}dvh` }}
          >
            <div className="ui:flex ui:justify-center ui:bg-[#fffcf8] ui:pt-2 ui:md:hidden">
              <button
                type="button"
                aria-label="Drag to resize configurator"
                className="ui:flex ui:h-5 ui:w-full ui:items-center ui:justify-center"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragRef.current = {
                    startY: event.clientY,
                    startVh: sheetVh,
                  };
                }}
              >
                <span className="ui:h-1 ui:w-10 ui:rounded-full ui:bg-[#d4cfc6]" />
              </button>
            </div>

            <div className="ui:pointer-events-auto ui:min-h-0 ui:flex-1 ui:overflow-y-auto ui:overscroll-contain ui:rounded-t-[1.25rem] ui:bg-[#fffcf8] ui:md:max-h-[min(72vh,740px)] ui:md:rounded-[1.35rem] ui:md:bg-[#fffcf8]/96 ui:md:shadow-[0_18px_50px_rgba(20,18,14,0.28)] ui:md:backdrop-blur-md">
              {panel}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
