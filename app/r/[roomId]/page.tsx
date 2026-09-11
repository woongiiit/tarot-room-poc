'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  const [showCopied, setShowCopied] = useState(false);

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

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {room.question}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                만료: {new Date(room.expiresAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          {isHost && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCopyLink}
                className="flex-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200 font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                {showCopied ? '✓ 복사됨!' : '🔗 링크 복사'}
              </button>
              <button
                onClick={handleDeleteRoom}
                className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                🗑️ 방 삭제
              </button>
            </div>
          )}
        </div>

        {/* Pick Card Button */}
        {availableCards.length > 0 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition mb-6"
          >
            {showPicker ? '카드 선택 취소' : '🎴 카드 선택하기'}
          </button>
        )}

        {/* Card Picker */}
        {showPicker && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              카드를 선택하세요
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {availableCards.map((cardType) => (
                <button
                  key={cardType}
                  onClick={() => setSelectedCard(cardType)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedCard === cardType
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="text-3xl mb-1">{CARD_EMOJIS[cardType]}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {cardType}
                  </div>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (선택사항)"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePickCard}
              disabled={!selectedCard || isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '선택 완료'}
            </button>
          </div>
        )}

        {/* Cards List */}
        {room.cards.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 px-1">
              선택된 카드들 ({room.cards.length}/12)
            </h2>
            {room.cards.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{CARD_EMOJIS[card.cardType]}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {card.cardType}
                      </h3>
                      {card.nickname && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {card.nickname}
                        </p>
                      )}
                    </div>
                  </div>
                  {isHost && (
                    <button
                      onClick={() => handleHideCard(card.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition text-sm"
                    >
                      숨기기
                    </button>
                  )}
                </div>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {card.reading}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  {new Date(card.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎴</div>
            <p className="text-gray-600 dark:text-gray-400">
              아직 선택된 카드가 없습니다
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              위의 버튼을 눌러 카드를 선택해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
