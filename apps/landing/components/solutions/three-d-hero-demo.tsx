'use client';

import dynamic from 'next/dynamic';

const SeoDemoEmbed = dynamic(
  () =>
    import('@/components/seo/seo-demo-embed').then((mod) => mod.SeoDemoEmbed),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[320px] animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--surface)] lg:min-h-[420px]" />
    ),
  }
);

export function ThreeDHeroDemo() {
  return <SeoDemoEmbed product="sofa" />;
}
