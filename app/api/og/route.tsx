import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ fontSize: 80, marginBottom: 20 }}>🔮</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
              관계 역할 타로 방
            </div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.9)', marginTop: 20 }}>
              당신은 그 사람에게 어떤 존재인가요?
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Fetch room data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.APP_URL || 
                    'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/rooms/${roomId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Room not found');
    }

    const room = await response.json();

    // If room has cards, show first card
    if (room.cards && room.cards.length > 0) {
      const firstCard = room.cards[0];
      const nickname = firstCard.nickname || '익명';
      const emoji = CARD_EMOJIS[firstCard.cardType] || '🎴';

      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontFamily: 'sans-serif',
              padding: 60,
            }}
          >
            <div style={{ fontSize: 120, marginBottom: 30 }}>{emoji}</div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {nickname}의 타로
            </div>
            <div
              style={{
                fontSize: 36,
                color: 'rgba(255,255,255,0.95)',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              너는 나한테 {firstCard.cardType}
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
                maxWidth: 900,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {firstCard.reading}
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // No cards yet, show question
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'sans-serif',
            padding: 60,
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 40 }}>🔮</div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: 30,
              maxWidth: 900,
            }}
          >
            {room.question}
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }}>
            관계 역할 타로 방
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    // Return a generic error image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🔮</div>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
            관계 역할 타로 방
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
