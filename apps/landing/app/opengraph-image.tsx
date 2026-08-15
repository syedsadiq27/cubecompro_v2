import { ImageResponse } from 'next/og';

export const alt = 'CubeCom Pro — The Digital Product Stage';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5F3EE',
          padding: '72px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 55% at 70% 40%, rgba(102,92,255,0.2) 0%, rgba(168,160,255,0.08) 30%, transparent 58%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#0E0F12',
            }}
          >
            cubec○m
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#73716C',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Pro · Product Configuration Infrastructure
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.045em',
              color: '#0E0F12',
            }}
          >
            Stage the product. Sell the state.
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.35, color: '#52504C' }}>
            Product configuration infrastructure for visual commerce.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
