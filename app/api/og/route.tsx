import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const CARD_EMOJIS: Record<string, string> = {
    '안전기지': '', '도선': '', '거울': '', '배터리': '��',
    '네비': '', '방패': '🛡', '개당': '', '솔직봇': '��',
    '거리두기': '↔️', '썸': '️', '토': '', '라이벌': '⚔️',
};

export async function GET(request: NextRequest) {
    try {
          const roomId = request.nextUrl.searchParams.get('roomId');
          let title = '너는 나테 어떤 사?';
          let cardName = '';
          let cardEmoji = '';
          let hook = '';
          let nickname = '';
      
          if (roomId) {
                  try {
                            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000');
                            const response = await fetch(`${baseUrl}/api/rooms/${roomId}`, { cache: 'no-store' });
                            if (response.ok) {
                                        const room = await response.json();
                                        if (room.cards && room.cards.length > 0) {
                                                      const latestCard = room.cards[room.cards.length - 1];
                                                      cardName = latestCard.cardType;
                                                      cardEmoji = CARD_EMOJIS[cardName] || '';
                                                      nickname = latestCard.nickname || '';
                                                      const lines = (latestCard.reading || '').split('\n').filter((l: string) => l.trim());
                                                      hook = lines[0] || '';
                                                      title = nickname ? `${nickname}의 타로 — 너는 나한테 ${cardName}` : `타로  너는 나한테 ${cardName}`;
                                        } else {
                                                      const firstLine = (room.question || '').split('\n')[0] || '는 나한테 어떤 사람?';
                                                      title = firstLine.length > 60 ? `${firstLine.substring(0, 60)}...` : firstLine;
                                                      hook = '타  장으로 말해줘';
                                        }
                            }
                  } catch (error) {
                            console.error('Error fetching room for OG image:', error);
                  }
          }
      
          return new ImageResponse(
                  <div style={{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c6e 100%)', color: '#ffffff', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
                      <div style={{ fontSize: '180px', marginBottom: '30px', display: 'flex' }}>{cardEmoji}</div>
                      <div style={{ fontSize: cardName ? '56px' : '68px', fontWeight: 'bold', textAlign: 'center', maxWidth: '1000px', marginBottom: '20px', color: '#ffd700', display: 'flex' }}>{title}</div>
              {hook && <div style={{ fontSize: '36px', textAlign: 'center', maxWidth: '900px', color: '#e0d0ff', display: 'flex' }}>{hook.length > 80 ? `${hook.substring(0, 80)}...` : hook}</div>}
                      <div style={{ position: 'absolute', bottom: '40px', fontSize: '28px', color: '#b0a0d0', display: 'flex' }}>타로  장으로 말해줘</div>
                    </div>,
            { width: 1200, height: 630 }
      );
} catch (error) {
      console.error('Error generating OG image:', error);
      return new ImageResponse(
              <div style={{ width: '1200px', height: '630px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c6e 100%)', color: '#ffd700', fontSize: '72px', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}> 너는 나한테 어떤 람?</div>,
        { width: 1200, height: 630 }
    );
}
}
