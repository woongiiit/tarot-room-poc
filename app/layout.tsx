import type { Metadata } from 'next';
import './globals.css';
import { LANDING_TITLE, LANDING_DESCRIPTION, BUILD_VERSION } from '@/lib/copy';

// Build version: forces Railway cache invalidation
console.log('Build version:', BUILD_VERSION);

const getMetadataBase = (): string | undefined => {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.APP_URL) return process.env.APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    return undefined;
};


export const metadata: Metadata = {
  metadataBase: getMetadataBase() ? new URL(getMetadataBase()!) : undefined,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
          <html lang="ko">
        <head>
          <script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
            integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK/vSMPPO+Kfu7Ba/4r10L+8I"
            crossOrigin="anonymous"
            async
          ></script>
        </head>
        <body className="antialiased">{children}</body>
            </html>
        );
}
