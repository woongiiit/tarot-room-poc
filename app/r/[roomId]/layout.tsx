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

    return {
      title: `${room.question} | 관계 역할 타로 방`,
      description: '당신은 그 사람에게 어떤 존재인가요? 12가지 관계 역할 메타포로 알아보세요.',
      openGraph: {
        title: room.question,
        description: '당신은 그 사람에게 어떤 존재인가요? 12가지 관계 역할 메타포로 알아보세요.',
        type: 'website',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: room.question,
        description: '당신은 그 사람에게 어떤 존재인가요? 12가지 관계 역할 메타포로 알아보세요.',
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
