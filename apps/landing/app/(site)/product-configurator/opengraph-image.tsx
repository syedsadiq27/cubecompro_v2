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
          background: '#F5F3EE',
          padding: '64px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(65% 50% at 78% 35%, rgba(102,92,255,0.18) 0%, transparent 55%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#0E0F12',
            }}
          >
            cubec○m Pro
          </div>
          <div style={{ fontSize: 16, color: '#73716C' }}>
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
              color: '#0E0F12',
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
              color: '#52504C',
            }}
          >
            <span
              style={{
                border: '1px solid #D8D5CE',
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
                border: '1px solid #D8D5CE',
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
                border: '1px solid #D8D5CE',
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
                border: '1px solid #0E0F12',
                borderRadius: 999,
                padding: '8px 14px',
                background: '#0E0F12',
                color: '#F5F3EE',
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
