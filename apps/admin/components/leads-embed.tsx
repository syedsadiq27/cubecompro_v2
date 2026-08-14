export function LeadsEmbed({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)]">
      <iframe
        title="Google Form leads"
        src={src}
        className="h-[min(78vh,840px)] w-full border-0"
      />
    </div>
  );
}
