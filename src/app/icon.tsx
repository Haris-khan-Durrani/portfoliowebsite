import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          background: '#060608',
          border: '2px solid #c8ff3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c8ff3d',
          fontSize: 11,
          fontWeight: 900,
          fontFamily: 'monospace',
        }}
      >
        HKD
      </div>
    ),
    { ...size }
  );
}
