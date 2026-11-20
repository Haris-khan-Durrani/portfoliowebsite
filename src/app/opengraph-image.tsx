import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Haris Khan Durrani — Head of IT | Senior Full-Stack Developer | Solution Architect';
export const size = {
  width: 1200,
  height: 630,
};
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
          backgroundColor: '#060608',
          backgroundImage:
            'radial-gradient(circle at 82% 24%, rgba(200, 255, 61, 0.22), transparent 46%), radial-gradient(circle at 18% 82%, rgba(56, 189, 248, 0.16), transparent 48%)',
          padding: '58px 68px',
          color: '#f4f4f0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                border: '2px solid rgba(200, 255, 61, 0.6)',
                background: 'rgba(200, 255, 61, 0.14)',
                color: '#c8ff3d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              HKD
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 800 }}>
              Haris Khan Durrani
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid rgba(200, 255, 61, 0.35)',
              background: 'rgba(200, 255, 61, 0.1)',
              color: '#c8ff3d',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            DUBAI · UAE
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ display: 'flex', gap: 18 }}>
              <span>I ENGINEER</span>
              <span style={{ color: '#c8ff3d' }}>SYSTEMS</span>
            </div>
            <div style={{ display: 'flex' }}>THAT MOVE BUSINESSES.</div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 23,
              color: 'rgba(244, 244, 240, 0.74)',
              maxWidth: 980,
              lineHeight: 1.4,
            }}
          >
            Head of IT · Senior Full-Stack Developer · Solution Architect — Enterprise SaaS,
            ERP/CRM, GoHighLevel, 3CX Telephony &amp; Cloud Infrastructure
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 24,
            fontSize: 18,
            color: 'rgba(244, 244, 240, 0.65)',
          }}
        >
          <div style={{ display: 'flex', gap: 34 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#c8ff3d', fontWeight: 800 }}>9+</span>
              <span>Years Leadership</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#c8ff3d', fontWeight: 800 }}>105</span>
              <span>EBMS Users</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#c8ff3d', fontWeight: 800 }}>-80%</span>
              <span>Tooling Cut</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#c8ff3d', fontWeight: 800 }}>12+</span>
              <span>Platforms</span>
            </div>
          </div>
          <div style={{ display: 'flex', color: '#38bdf8', fontWeight: 700 }}>
            hariskhandurrani.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
