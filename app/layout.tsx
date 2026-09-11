import type { Metadata } from 'next';
import './globals.css';

const getMetadataBase = (): string | undefined => {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.APP_URL) return process.env.APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    return undefined;
};

export const metadata: Metadata = {
    metadataBase: getMetadataBase() ? new URL(getMetadataBase()!) : undefined,
    title: '너는 나한테 떤 사람?',
    description: '로 한 장으로 해줘. 링크  네 카드도 뽑아봐.',
    openGraph: {
          title: '너는 나한테 어 사?',
          description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 봐.',
          type: 'website',
          locale: 'ko_KR',
          images: [{ url: '/api/og', width: 1200, height: 630, alt: '타 방' }],
    },
    twitter: {
          card: 'summary_large_image',
          title: '너는 나한 어떤 사람?',
          description: '타로  장으 말. 링크 열고 네 드 뽑아봐.',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
          <html lang="ko">
        <body className="antialiased">{children}</body>
            </html>
        );
}
