import type { Metadata } from 'next';
import './globals.css';

const getMetadataBase = (): string | undefined => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  return undefined;
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase() ? new URL(getMetadataBase()!) : undefined,
  title: '관계 역할 타로 방',
  description: '당신은 그 사람에게 어떤 존재인가요? 12가지 관계 역할 메타포로 알아보세요.',
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
