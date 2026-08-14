import { ImageResponse } from 'next/og';

export const alt = 'CubeCom Pro — Product Configurator for Ecommerce';
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
          padding: '64px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(65% 50% at 78% 35%, rgba(95,87,247,0.2) 0%, transparent 55%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#101010',
            }}
          >
            cubec○m Pro
          </div>
          <div style={{ fontSize: 16, color: '#8a8a84' }}>
            Product Configurator Software
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.045em',
              color: '#101010',
              maxWidth: 920,
            }}
          >
            Rules first. Variants last.
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              fontSize: 18,
              color: '#5c5c59',
            }}
          >
            <span
              style={{
                border: '1px solid #d2d1cb',
                borderRadius: 999,
                padding: '8px 14px',
                background: '#fff',
              }}
            >
              Options
            </span>
            <span style={{ padding: '8px 4px' }}>→</span>
            <span
              style={{
                border: '1px solid #d2d1cb',
                borderRadius: 999,
                padding: '8px 14px',
                background: '#fff',
              }}
            >
              Constraints
            </span>
            <span style={{ padding: '8px 4px' }}>→</span>
            <span
              style={{
                border: '1px solid #d2d1cb',
                borderRadius: 999,
                padding: '8px 14px',
                background: '#fff',
              }}
            >
              Valid state
            </span>
            <span style={{ padding: '8px 4px' }}>→</span>
            <span
              style={{
                border: '1px solid #101010',
                borderRadius: 999,
                padding: '8px 14px',
                background: '#101010',
                color: '#f2f1ed',
              }}
            >
              Commerce
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
