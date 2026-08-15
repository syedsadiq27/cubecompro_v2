'use client';

import { useState } from 'react';
import { HelpCircleIcon } from '@/components/bo/icons';

export function ConfigurationSessionsChart({
  totalSessions = '1,248',
  trend = '↑ 18% vs prior 30 days',
}: {
  totalSessions?: string;
  trend?: string;
}) {
  const [timeframe, setTimeframe] = useState<'30' | '7' | '90'>('30');

  // SVG Area Line coordinates (Normalized for a 400x120 viewBox)
  // Trend points: Apr 15 to May 13 with natural peaks and troughs
  const points = [
    { x: 10, y: 80, label: 'Apr 15' },
    { x: 50, y: 55, label: 'Apr 18' },
    { x: 90, y: 70, label: 'Apr 22' },
    { x: 130, y: 40, label: 'Apr 25' },
    { x: 170, y: 58, label: 'Apr 29' },
    { x: 210, y: 42, label: 'May 2' },
    { x: 250, y: 65, label: 'May 6' },
    { x: 290, y: 45, label: 'May 9' },
    { x: 330, y: 68, label: 'May 11' },
    { x: 380, y: 30, label: 'May 13' },
  ];

  // SVG Path generator for smooth curved line
  const dPath = `M 10 80 C 40 55, 60 55, 90 70 C 110 40, 150 40, 170 58 C 190 42, 230 42, 250 65 C 270 45, 310 45, 330 68 C 350 40, 370 30, 380 30`;
  const areaPath = `${dPath} L 380 110 L 10 110 Z`;

  return (
    <div className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--ink)]">
          <span>Configuration sessions</span>
          <span title="Unique 3D configuration interactions across channels" className="text-[var(--text-muted)] cursor-help">
            <HelpCircleIcon size={14} />
          </span>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as '30' | '7' | '90')}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[12px] font-medium text-[var(--ink)] outline-none"
        >
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[24px] font-semibold tracking-tight text-[var(--ink)] tabular-nums">
          {totalSessions}
        </span>
        <span className="text-[12px] text-[var(--text-muted)]">Total sessions</span>
        <span className="text-[12px] font-medium text-emerald-700 tabular-nums">
          {trend}
        </span>
      </div>

      {/* SVG Smooth Area Line Chart */}
      <div className="mt-4 relative w-full h-36">
        <svg
          viewBox="0 0 390 120"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#665CFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#665CFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2="390" y2="30" stroke="var(--line)" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1="0" y1="70" x2="390" y2="70" stroke="var(--line)" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1="0" y1="110" x2="390" y2="110" stroke="var(--line)" strokeOpacity="0.8" />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#sessionsGrad)" />

          {/* Curve Line */}
          <path
            d={dPath}
            fill="none"
            stroke="#665CFF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Markers */}
          <circle cx="380" cy="30" r="3.5" fill="#665CFF" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* Y-axis Labels */}
        <div className="absolute top-0 -left-1 flex flex-col justify-between h-full text-[10px] text-[var(--text-muted)] pointer-events-none tabular-nums font-mono">
          <span>300</span>
          <span>200</span>
          <span>100</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis Labels */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--text-muted)] px-2">
        <span>Apr 15</span>
        <span>Apr 22</span>
        <span>Apr 29</span>
        <span>May 6</span>
        <span>May 13</span>
      </div>
    </div>
  );
}
