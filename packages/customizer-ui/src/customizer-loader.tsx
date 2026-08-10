export function CustomizerLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="ui:absolute ui:inset-0 ui:z-20 ui:flex ui:items-center ui:justify-center ui:bg-[#2f2d2a]/70"
    >
      <div className="ui:flex ui:flex-col ui:items-center ui:gap-3">
        <div className="ui:h-8 ui:w-8 ui:animate-spin ui:rounded-full ui:border-2 ui:border-white/70 ui:border-t-transparent" />
        <span className="ui:text-sm ui:font-medium ui:text-white/80">
          {label}
        </span>
      </div>
    </div>
  );
}
