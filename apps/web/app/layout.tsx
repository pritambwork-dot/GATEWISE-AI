import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GATEWISE AI — Institutional Gate Verification & Visitor Identification',
  description: 'AI-assisted institutional security platform for educational and research campuses.',
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
