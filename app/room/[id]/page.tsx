'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CARDS, Card, getCardByKey } from '@/lib/cards';

interface Pick {
  id: string;
  cardKey: string;
  roleLine: string;
  nickname: string | null;
  createdAt: string;
}

interface RoomData {
  id: string;
  question: string;
  expiresAt: string;
  picks: Pick[];
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [nickname, setNickname] = useState('');
  const [pickingCard, setPickingCard] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('룸을 찾을 수 없습니다');
        } else if (response.status === 410) {
          setError('만료된 룸입니다');
        } else {
          setError('룸을 불러오는데 실패했습니다');
        }
        return;
      }

      const data = await response.json();
      setRoom(data);
    } catch (err) {
      console.error('Error fetching room:', err);
      setError('룸을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handlePickCard = async (cardKey: string) => {
    setPickingCard(true);
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/picks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardKey,
          nickname: nickname.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to pick card');
      }

      await fetchRoom();
      setShowCardPicker(false);
      setNickname('');
    } catch (err) {
      console.error('Error picking card:', err);
      alert('카드를 뽑는데 실패했습니다');
    } finally {
      setPickingCard(false);
    }
  };

  const handleDeleteRoom = async () => {
    const token = localStorage.getItem(`room_${roomId}_token`);
    
    if (!token) {
      alert('삭제 권한이 없습니다');
      return;
    }

    if (!confirm('정말 이 룸을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}?token=${token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      router.push('/');
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('룸 삭제에 실패했습니다');
    }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('URL이 복사되었습니다!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-2xl text-purple-900 dark:text-purple-100">로딩 중...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-4">
            {room.question}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={copyShareUrl}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
            >
              📋 URL 복사
            </button>
            
            {localStorage.getItem(`room_${roomId}_token`) && (
              <button
                onClick={handleDeleteRoom}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                🗑️ 룸 삭제
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            만료일: {new Date(room.expiresAt).toLocaleDateString('ko-KR')}
          </div>
        </div>

        {!showCardPicker ? (
          <button
            onClick={() => setShowCardPicker(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 text-lg mb-8 shadow-lg"
          >
            🃏 카드 뽑기
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
              카드를 선택하세요
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                닉네임 (선택)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="익명"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {CARDS.map((card) => (
                <button
                  key={card.key}
                  onClick={() => handlePickCard(card.key)}
                  disabled={pickingCard}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  <div className="text-xl font-bold">{card.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCardPicker(false)}
              className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
            뽑은 카드들 ({room.picks.length})
          </h2>
          
          {room.picks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              아직 뽑은 카드가 없습니다
            </div>
          ) : (
            room.picks.map((pick) => {
              const card = getCardByKey(pick.cardKey);
              return (
                <div
                  key={pick.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {card?.name}
                      </span>
                      {pick.nickname && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          by {pick.nickname}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(pick.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {pick.roleLine}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
