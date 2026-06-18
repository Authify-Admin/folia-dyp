import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Folia — Planting Simplified';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

/** Social card in the atelier's voice: parchment, ink, one hairline. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5F1E6',
          color: '#16271C',
          padding: '72px 84px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#315C3B',
          }}
        >
          <div>Folia</div>
          <div style={{ color: '#B4633A' }}>Est. 2025</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 110,
            fontWeight: 400,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
          }}
        >
          <div>Soil first.</div>
          <div style={{ fontStyle: 'italic', color: '#315C3B' }}>
            The rest follows.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(22,39,28,0.25)',
            paddingTop: 28,
            fontSize: 24,
            color: 'rgba(22,39,28,0.65)',
          }}
        >
          <div>Organic plant care — Planting Simplified</div>
          <div>myfolia.in</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
