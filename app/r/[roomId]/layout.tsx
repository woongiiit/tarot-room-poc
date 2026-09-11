import type { Metadata } from 'next';

interface Props {
  params: Promise<{ roomId: string }>;
}

const CARD_EMOJIS: Record<string, string> = {
  '안전기지': '🏠',
  '도화선': '💥',
  '거울': '🪞',
  '배터리': '🔋',
  '네비': '🧭',
  '방패': '🛡️',
  '개그담당': '😄',
  '솔직봇': '💬',
  '거리두기': '↔️',
  '썸온도': '🌡️',
  '멘토': '📚',
  '라이벌': '⚔️',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/rooms/${roomId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: '타로 방',
        description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
      };
    }

    const room = await response.json();
    const siteUrl = baseUrl;
    const currentUrl = `${siteUrl}/r/${roomId}`;
    const ogImageUrl = `${siteUrl}/api/og?roomId=${roomId}`;

    let ogTitle = '';
    let ogDescription = '';

    if (room.cards && room.cards.length > 0) {
      const latestCard = room.cards[room.cards.length - 1];
      const cardName = latestCard.cardType;
      const nickname = latestCard.nickname;
      
      const lines = latestCard.reading.split('\n').filter((l: string) => l.trim());
      const hookLine = lines[0] || '';
      
      if (nickname) {
        ogTitle = `${nickname}의 타로 — 너는 나한테 ${cardName}`;
      } else {
        ogTitle = `타로 — 너는 나한테 ${cardName}`;
      }
      
      ogDescription = hookLine 
        ? `${hookLine}. 링크 열고 네 카드도 뽑아봐.`
        : '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.';
    } else {
      const questionLines = room.question.split('\n');
      const firstLine = questionLines[0] || room.question;
      const trimmedQuestion = firstLine.length > 100 
        ? firstLine.substring(0, 100) + '...' 
        : firstLine;
      
      ogTitle = trimmedQuestion;
      ogDescription = '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.';
    }

    return {
      title: `${ogTitle} | 타로 방`,
      description: ogDescription,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: 'website',
        locale: 'ko_KR',
        url: currentUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '타로 방',
      description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
    };
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
