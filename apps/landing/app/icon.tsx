import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0E0F12',
          color: '#F5F3EE',
          fontSize: 220,
          fontWeight: 700,
          letterSpacing: '-0.06em',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        c
      </div>
    ),
    { ...size }
  );
}
