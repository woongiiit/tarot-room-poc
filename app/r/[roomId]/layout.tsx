import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ roomId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/rooms/${roomId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: '관계 역할 타로 방',
      };
    }

    const room = await response.json();
    
    // Determine title and description based on whether cards exist
    let title = room.question;
    let description = '당신은 그 사람에게 어떤 존재인가요? 12가지 관계 역할 메타포로 알아보세요.';
    
    if (room.cards && room.cards.length > 0) {
      const firstCard = room.cards[0];
      const nickname = firstCard.nickname || '익명';
      title = `${nickname}의 타로 — 너는 나한테 ${firstCard.cardType}`;
      description = firstCard.reading.substring(0, 100) + '...';
    }

    return {
      title: `${title} | 관계 역할 타로 방`,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'ko_KR',
        images: [
          {
            url: `/api/og?roomId=${roomId}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`/api/og?roomId=${roomId}`],
      },
    };
  } catch (error) {
    return {
      title: '관계 역할 타로 방',
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
