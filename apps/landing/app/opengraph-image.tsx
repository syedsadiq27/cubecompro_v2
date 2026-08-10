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
          background: '#f2f1ed',
          padding: '72px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 55% at 70% 40%, rgba(95,87,247,0.22) 0%, rgba(166,159,255,0.08) 30%, transparent 58%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#101010',
            }}
          >
            cubec○m
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#8a8a84',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Pro · Digital Product Stage
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
              color: '#101010',
            }}
          >
            Stage the product. Sell the state.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: '#5c5c59' }}>
            Configure in 3D. Resolve to SKU, price, inventory, and cart.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
