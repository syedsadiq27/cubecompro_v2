'use client';

import Link from 'next/link';

export function AuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--canvas)]">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: AUTH FORM CANVAS (5 cols on lg, 5 cols on xl) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[var(--surface-pure)] border-r border-[var(--line)] min-h-screen">
        <div className="w-full max-w-[400px] mx-auto flex flex-col justify-between flex-1">
          <div>
            {/* Top Brand Bar (Aligned directly with form width) */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-1.5">
                <span className="text-[20px] font-bold tracking-tight text-[var(--ink)]">
                  cubecom
                </span>
                <span className="rounded bg-[#665CFF]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#665CFF] uppercase">
                  pro
                </span>
              </Link>
              <span className="rounded-full bg-[var(--canvas)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--text-muted)] border border-[var(--line)]">
                v2.4
              </span>
            </div>

            {/* Form Content */}
            <div className="space-y-5">
              {children}
            </div>
          </div>

          {/* Footer (Aligned directly with form width) */}
          <div className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[var(--text-muted)]">
            <p>© 2025 CubeCom Systems. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link href="/privacy" className="hover:text-[var(--ink)] hover:underline">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-[var(--ink)] hover:underline">
                Terms
              </Link>
            </div>
          </div>

          {/* Bottom Floating Utilities */}
          <div className="flex items-center gap-2 mt-4 pt-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] font-mono text-[11px] font-semibold text-white shadow-2xs">
              N
            </div>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)] text-[14px]"
              title="Theme settings"
            >
              ☼
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: VISUAL COMMERCE SHOWCASE (7 cols on lg, 7 cols on xl) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-between p-12 xl:p-16 bg-[#07080A] text-white relative overflow-hidden select-none min-h-screen">
        <div className="w-full max-w-[620px] mx-auto flex flex-col justify-between h-full">
          {/* Top Status */}
          <div className="flex items-center justify-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10 text-[12px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-white/80 font-medium">All systems operational</span>
            </div>
          </div>

          {/* Centerpiece Hero */}
          <div className="relative z-10 my-auto py-10 space-y-8">
            <div className="space-y-4">
              <h1 className="text-[36px] xl:text-[42px] font-bold tracking-tight text-white leading-[1.12]">
                Product configuration infrastructure for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#C084FC]">
                  visual commerce.
                </span>
              </h1>

              <p className="text-[14px] text-white/65 leading-relaxed">
                CubeCom connects product rules, 3D state, SKU, price, inventory, and cart—so every configuration is always valid, shoppable, and ready to publish.
              </p>
            </div>

            {/* Diagram Centerpiece */}
            <div className="relative pt-6 pb-4">
              {/* Ambient Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#665CFF]/25 blur-3xl pointer-events-none" />

              {/* Connecting Dotted Line passing through the centers */}
              <div className="absolute top-1/2 left-20 right-20 -translate-y-1/2 border-t-2 border-dashed border-[#665CFF]/40 pointer-events-none z-0" />

              <div className="relative z-10 grid grid-cols-3 gap-5 items-center">
                {/* 1. Configuration Card */}
                <div className="rounded-2xl border border-white/10 bg-[#12141A]/95 p-5 text-center shadow-xl backdrop-blur space-y-3 flex flex-col items-center justify-center h-44">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#665CFF]/15 text-[#8B5CF6]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-white">Configuration</h3>
                    <p className="text-[11px] text-white/50 mt-0.5">Options &amp; Rules</p>
                  </div>
                </div>

                {/* 2. Center Glowing Crystal Hexagon Core */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    {/* Outer Glowing Hexagon */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#665CFF] to-[#A855F7] opacity-40 blur-md" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[#A855F7]/50 bg-[#16132C]/90 shadow-2xl shadow-[#665CFF]/50 backdrop-blur">
                      {/* CubeCom Hexagonal Mark */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-[#665CFF] to-[#C084FC] text-white font-bold text-[18px]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-white">Valid State</h3>
                    <p className="text-[11px] text-white/60 mt-0.5">Resolved 3D + Data</p>
                  </div>
                </div>

                {/* 3. Commerce Card */}
                <div className="rounded-2xl border border-white/10 bg-[#12141A]/95 p-5 text-center shadow-xl backdrop-blur space-y-3 flex flex-col items-center justify-center h-44">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#665CFF]/15 text-[#8B5CF6]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-white">Commerce</h3>
                    <p className="text-[11px] text-white/50 mt-0.5">SKU, Price, Inventory, Cart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Pillars (3 Columns) */}
          <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#8B5CF6] border border-white/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <p className="text-[12px] font-medium text-white/90 leading-tight">
                Real-time rule validation
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#8B5CF6] border border-white/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <p className="text-[12px] font-medium text-white/90 leading-tight">
                3D + data always in sync
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#8B5CF6] border border-white/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <p className="text-[12px] font-medium text-white/90 leading-tight">
                Headless ready for any commerce channel
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
