import type { CSSProperties } from 'react';

export const gradientStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #070B1A 0%, #10266B 12.5%, #12B5A6 32.5%, #2F5BFF 50%, #12B5A6 67.5%, #10266B 87.5%, #070B1A 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)',
};
