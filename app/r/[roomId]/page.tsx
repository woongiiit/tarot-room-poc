'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ShareButton from '@/components/ShareButton';

const CARD_TYPES = [
  '안전기지',
  '도화선',
  '거울',
  '배터리',
  '네비',
  '방패',
  '개그담당',
  '솔직봇',
  '거리두기',
  '썸온도',
  '멘토',
  '라이벌',
];

const CARD_EMOJIS: Record<string, string> = {
  '안전기지': '☽',
  '도화선': '✶',
  '거울': '◈',
  '배터리': '⚡',
  '네비': '✦',
  '방패': '☬',
  '개그담당': '🎭',
  '솔직봇': '✎',
  '거리두기': '◌',
  '썸온도': '❣',
  '멘토': '📖',
  '라이벌': '⚔',
};

const CARD_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  '안전기지': { accent: '#9333ea', bg: 'bg-purple-900/20', border: 'border-purple-500/50' },
  '도화선': { accent: '#dc2626', bg: 'bg-red-900/20', border: 'border-red-500/50' },
  '거울': { accent: '#0891b2', bg: 'bg-cyan-900/20', border: 'border-cyan-500/50' },
  '배터리': { accent: '#eab308', bg: 'bg-yellow-900/20', border: 'border-yellow-500/50' },
  '네비': { accent: '#3b82f6', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
  '방패': { accent: '#059669', bg: 'bg-emerald-900/20', border: 'border-emerald-500/50' },
  '개그담당': { accent: '#f59e0b', bg: 'bg-amber-900/20', border: 'border-amber-500/50' },
  '솔직봇': { accent: '#8b5cf6', bg: 'bg-violet-900/20', border: 'border-violet-500/50' },
  '거리두기': { accent: '#6b7280', bg: 'bg-gray-900/20', border: 'border-gray-500/50' },
  '썸온도': { accent: '#ec4899', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
  '멘토': { accent: '#10b981', bg: 'bg-green-900/20', border: 'border-green-500/50' },
  '라이벌': { accent: '#ef4444', bg: 'bg-rose-900/20', border: 'border-rose-500/50' },
};

interface Card {
  id: string;
  cardType: string;
  nickname: string | null;
  reading: string;
  createdAt: string;
}

interface Room {
  id: string;
  question: string;
  expiresAt: string;
  cards: Card[];
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    loadRoom();
    
    // Check if user is host
    const hostToken = localStorage.getItem(`room_${roomId}_token`);
    setIsHost(!!hostToken);
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '방을 불러올 수 없습니다.');
      }
      const data = await response.json();
      setRoom(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '방을 불러올 수 없습니다.');
      setLoading(false);
    }
  };

  const handlePickCard = async () => {
    if (!selectedCard) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/rooms/${roomId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardType: selectedCard,
          nickname: nickname.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '카드 선택에 실패했습니다.');
      }

      // Reload room to show new card
      await loadRoom();
      setShowPicker(false);
      setSelectedCard('');
      setNickname('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '카드 선택에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!confirm('정말로 이 방을 삭제하시겠습니까?')) return;

    const hostToken = localStorage.getItem(`room_${roomId}_token`);
    if (!hostToken) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'x-host-token': hostToken },
      });

      if (!response.ok) {
        throw new Error('방 삭제에 실패했습니다.');
      }

      localStorage.removeItem(`room_${roomId}_token`);
      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : '방 삭제에 실패했습니다.');
    }
  };

  const handleHideCard = async (cardId: string) => {
    if (!confirm('이 카드를 숨기시겠습니까?')) return;

    const hostToken = localStorage.getItem(`room_${roomId}_token`);
    if (!hostToken) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'x-host-token': hostToken },
      });

      if (!response.ok) {
        throw new Error('카드 숨기기에 실패했습니다.');
      }

      await loadRoom();
    } catch (err) {
      alert(err instanceof Error ? err.message : '카드 숨기기에 실패했습니다.');
    }
  };

  const getShareMetadata = () => {
    if (!room) {
      return {
        title: '타로 방',
        description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
      };
    }

    if (room.cards.length > 0) {
      const latestCard = room.cards[room.cards.length - 1];
      const cardName = latestCard.cardType;
      const nickname = latestCard.nickname;
      const line = latestCard.reading.split('\n').find((l) => l.trim()) || '';
      
      return {
        title: nickname ? `${nickname}의 타로 — 너는 나한테 ${cardName}` : `타로 — 너는 나한테 ${cardName}`,
        description: line ? `${line}. 링크 열고 네 카드도 뽑아봐.` : '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
      };
    }

    return {
      title: room.question,
      description: '타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.',
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 gold-border mx-auto mb-4"></div>
          <p className="text-gray-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="tarot-card rounded-2xl p-8 max-w-md w-full text-center relative z-10">
          <div className="text-6xl mb-4">✦</div>
          <h2 className="text-2xl font-bold gold-accent mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="gold-accent font-bold py-3 px-6 rounded-lg transition"
            style={{ 
              background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.4) 0%, rgba(45, 27, 78, 0.6) 100%)',
              border: '2px solid var(--tarot-gold)',
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const availableCards = CARD_TYPES.filter(
    cardType => !room.cards.some(card => card.cardType === cardType)
  );

  const shareMetadata = getShareMetadata();

  return (
    <div className="min-h-screen relative" style={{ paddingBottom: '2rem' }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Header */}
        <div className="tarot-card rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold gold-accent mb-2">
                {room.question}
              </h1>
              <p className="text-sm text-gray-400">
                만료: {new Date(room.expiresAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          {isHost && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <ShareButton
                roomId={roomId}
                title={shareMetadata.title}
                description={shareMetadata.description}
                variant="kakao"
                className="flex-1"
              />
              <button
                onClick={handleDeleteRoom}
                className="flex-1 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 text-red-200 font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                ✕ 방 삭제
              </button>
            </div>
          )}
        </div>

        {/* Pick Card Button */}
        {availableCards.length > 0 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full gold-accent font-bold py-5 px-6 rounded-xl shadow-lg hover:shadow-2xl transition mb-6 text-lg tracking-wide"
            style={{ 
              background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.4) 0%, rgba(45, 27, 78, 0.6) 100%)',
              border: '2px solid var(--tarot-gold)',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
            }}
          >
            {showPicker ? '✕ 선택 취소' : '✦ 카드 뽑기'}
          </button>
        )}

        {/* Share Section for non-host users */}
        {!isHost && (
          <div className="tarot-card rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-400 text-center mb-3">친구들과 함께 카드를 뽑아보세요</p>
            <ShareButton
              roomId={roomId}
              title={shareMetadata.title}
              description={shareMetadata.description}
              variant="kakao"
              className="w-full"
            />
          </div>
        )}

        {/* Card Picker */}
        {showPicker && (
          <div className="tarot-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold gold-accent mb-2 text-center">
              카드를 선택하세요
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">마음이 끌리는 카드 하나를 고르세요</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {availableCards.map((cardType, index) => {
                const isSelected = selectedCard === cardType;
                return (
                  <button
                    key={cardType}
                    onClick={() => setSelectedCard(cardType)}
                    className="relative rounded-lg transition-all overflow-hidden"
                    style={isSelected ? { 
                      borderColor: 'var(--tarot-gold)',
                      boxShadow: '0 0 24px rgba(212, 175, 55, 0.6)',
                      border: '2px solid var(--tarot-gold)'
                    } : {
                      border: '2px solid var(--tarot-gold-dim)'
                    }}
                    aria-label={`카드 ${index + 1}`}
                  >
                    <div 
                      className="w-full aspect-[2/3] flex items-center justify-center relative"
                    >
                      <img
                        src="/cards/back.webp"
                        alt="Tarot card back"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                      <div 
                        className="hidden absolute inset-0 flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0b2e 100%)'
                        }}
                      >
                        <div className="text-4xl" style={{ 
                          color: 'var(--tarot-gold)',
                          opacity: isSelected ? 0.8 : 0.5
                        }}>
                          ✦
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (선택사항)"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-900/50 text-white placeholder-gray-500"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePickCard}
              disabled={!selectedCard || isSubmitting}
              className="w-full gold-accent font-bold py-4 px-6 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                background: selectedCard ? 'linear-gradient(135deg, rgba(109, 40, 217, 0.5) 0%, rgba(45, 27, 78, 0.7) 100%)' : 'rgba(75, 85, 99, 0.3)',
                border: '2px solid var(--tarot-gold-dim)',
                boxShadow: selectedCard ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
              }}
            >
              {isSubmitting ? '처리 중...' : '✦ 선택 완료'}
            </button>
          </div>
        )}

        {/* Cards List */}
        {room.cards.length > 0 ? (
          <div className="space-y-5">
            <h2 className="text-xl font-bold gold-accent px-1 text-center mb-6">
              ✦ 선택된 카드들 ({room.cards.length}/12)
            </h2>
            {room.cards.map((card) => {
              const colors = CARD_COLORS[card.cardType];
              return (
                <div
                  key={card.id}
                  className="tarot-card rounded-2xl overflow-hidden shadow-2xl"
                  style={{ 
                    borderColor: colors.accent,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.accent}40`
                  }}
                >
                  {/* Card Header */}
                  <div 
                    className="p-6 pb-4 text-center border-b"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.accent}30 0%, transparent 100%)`,
                      borderColor: `${colors.accent}30`
                    }}
                  >
                    <div className="text-6xl mb-3" style={{ color: colors.accent }}>
                      {CARD_EMOJIS[card.cardType]}
                    </div>
                    <h3 className="text-2xl font-bold gold-accent mb-2">
                      {card.cardType}
                    </h3>
                    {card.nickname && (
                      <p className="text-sm text-gray-400">
                        ✎ {card.nickname}
                      </p>
                    )}
                  </div>
                  
                  {/* Card Body - Reading */}
                  <div className="p-6">
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-center">
                      {card.reading}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div 
                    className="px-6 py-4 flex items-center justify-between border-t"
                    style={{ borderColor: `${colors.accent}20` }}
                  >
                    <div className="text-xs text-gray-500">
                      {new Date(card.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {isHost && (
                      <button
                        onClick={() => handleHideCard(card.id)}
                        className="text-xs text-gray-500 hover:text-red-400 transition"
                      >
                        숨기기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tarot-card rounded-2xl p-12 text-center">
            <div className="tarot-card-back w-32 h-48 mx-auto rounded-xl mb-6 relative"></div>
            <p className="text-gray-300 text-lg mb-2">
              아직 선택된 카드가 없습니다
            </p>
            <p className="text-sm text-gray-500">
              위의 버튼을 눌러 카드를 뽑아보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
