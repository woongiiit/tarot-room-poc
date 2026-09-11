import type { Metadata } from 'next';

interface Props {
    params: Promise<{ roomId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { roomId } = await params;
    try {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000');
          const response = await fetch(`${baseUrl}/api/rooms/${roomId}`, { cache: 'no-store' });
          if (!response.ok) {
                  return { title: '타로 방', description: '타로  장으로 말해줘. 링크 고 네 카드도 뽑아봐.' };
          }
          const room = await response.json();
          const siteUrl = baseUrl;
          const currentUrl = `${siteUrl}/r/${roomId}`;
          const ogImageUrl = `${siteUrl}/api/og?roomId=${roomId}`;
          let title = '';
          let description = '';
          if (room.cards && room.cards.length > 0) {
                  const card = room.cards[room.cards.length - 1];
                  const cardName = card.cardType;
                  const nickname = card.nickname;
                  const line = (card.reading || '').split('\n').find((l: string) => l.trim()) || '';
                  title = nickname ? `${nickname}의 타로 — 너는 나한테 ${cardName}` : `타로 — 너는 나테 ${cardName}`;
                  description = line ? `${line}. 링 열고 네 카드도 아봐.` : '타로 한 으로 말해줘. 크 열고 네 카드도 아봐.';
          } else {
                  const firstLine = (room.question || '').split('\n')[0] || '타 방';
                  title = firstLine.length > 100 ? `${firstLine.substring(0, 100)}...` : firstLine;
                  description = '타  장으로 해줘. 링크 열고 네 드도 뽑아봐.';
          }
          return {
                  title: `${title} | 타로 방`,
                  description,
                  openGraph: {
                            title,
                            description,
                            type: 'website',
                            locale: 'ko_KR',
                            url: currentUrl,
                            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
                  },
                  twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl] },
          };
    } catch (error) {
          console.error('Error generating metadata:', error);
          return { title: '타로 ', description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아.' };
    }
}

export default function RoomLayout({ children }: { children: React.ReactNode }) {
    return children;
}
