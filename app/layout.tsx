import type { Metadata } from 'next';
import './globals.css';
import { LANDING_TITLE, LANDING_DESCRIPTION, BUILD_VERSION } from '@/lib/copy';

// Build version: forces Railway cache invalidation
console.log('Build version:', BUILD_VERSION);

export const metadata: Metadata = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: '타로 방',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
