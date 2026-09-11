import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '너는 나한테 어떤 사람?',
  description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
  openGraph: {
    title: '너는 나한테 어떤 사람?',
    description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
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
    title: '너는 나한테 어떤 사람?',
    description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
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
