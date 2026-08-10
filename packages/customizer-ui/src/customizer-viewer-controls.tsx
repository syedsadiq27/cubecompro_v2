'use client';

export function CustomizerViewerControls({
  onRotate,
  onFit,
  onReset,
}: {
  onRotate?: () => void;
  onFit?: () => void;
  onReset?: () => void;
}) {
  const buttonClass =
    'ui:flex ui:h-10 ui:w-10 ui:items-center ui:justify-center ui:rounded-full ui:border ui:border-white/15 ui:bg-black/35 ui:text-base ui:text-white/85 ui:shadow-sm ui:backdrop-blur-md ui:transition-colors ui:hover:bg-black/50 ui:hover:text-white';

  return (
    <div className="ui:pointer-events-auto ui:flex ui:flex-col ui:gap-2">
      <button
        type="button"
        className={buttonClass}
        onClick={onRotate}
        title="Rotate"
        aria-label="Rotate"
      >
        ↻
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={onFit}
        title="Fit view"
        aria-label="Fit view"
      >
        ⛶
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={onReset}
        title="Reset"
        aria-label="Reset"
      >
        ⟳
      </button>
    </div>
  );
}
