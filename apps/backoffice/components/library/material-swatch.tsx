'use client';

export function MaterialSwatch({
  color,
  roughness,
  metalness,
  className = '',
}: {
  color: string;
  roughness: number;
  metalness: number;
  className?: string;
}) {
  const gloss = Math.max(0.15, 1 - roughness);
  const metallicMix = Math.min(1, Math.max(0, metalness));
  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#f7f4ef,transparent_55%),linear-gradient(160deg,#e8e4de,#d5d0c8)] ${className}`}
    >
      <div
        className="absolute top-1/2 left-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-[46%] rounded-full"
        style={{
          background: `
            radial-gradient(circle at 32% 28%, rgba(255,255,255,${0.55 * gloss}) 0%, transparent 36%),
            radial-gradient(circle at 70% 78%, rgba(0,0,0,${0.28 + roughness * 0.25}) 0%, transparent 42%),
            linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} ${Math.round((1 - metallicMix) * 100)}%, #9a9a9a))
          `,
          boxShadow: `inset 0 0 ${12 + gloss * 18}px rgba(0,0,0,${0.18 + roughness * 0.2}), 0 8px 18px rgba(0,0,0,0.1)`,
        }}
      />
    </div>
  );
}
