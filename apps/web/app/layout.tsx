import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#23865D',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'GATEWISE AI — Smarter Gate Verification. Simpler Campus Operations.',
    template: '%s · GATEWISE AI',
  },
  description:
    'AI-assisted institutional gate verification and visitor management platform with single-shot camera capture, sovereign human guard oversight, and cryptographic audit logging.',
  keywords: [
    'campus security',
    'gate verification',
    'visitor management',
    'facial recognition',
    'SFace',
    'YuNet',
    'institutional access control',
    'GATEWISE AI',
  ],
  authors: [{ name: 'GATEWISE AI Engineering Team' }],
  openGraph: {
    title: 'GATEWISE AI — Smarter Gate Verification. Simpler Campus Operations.',
    description:
      'Connected institutional gate verification and visitor management platform for educational and research campuses.',
    url: 'https://gatewiseai.internal',
    siteName: 'GATEWISE AI',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-gatewise-text antialiased">
        {children}
      </body>
    </html>
  );
}
