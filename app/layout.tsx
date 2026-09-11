import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
