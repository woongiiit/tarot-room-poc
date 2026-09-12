'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND_NAME, LANDING_TITLE, LANDING_TAGLINE, FIXED_ROOM_QUESTION } from '@/lib/copy';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsCreating(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: FIXED_ROOM_QUESTION }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '방 생성에 실패했습니다.');
      }

      const data = await response.json();
      
      // Store host token in localStorage
      localStorage.setItem(`room_${data.id}_token`, data.hostToken);
      
      // Redirect to room
      router.push(`/r/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '방 생성에 실패했습니다.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-lg relative z-10">
        <div className="text-center mb-10 mt-12">
          <div className="text-6xl mb-6 gold-accent">✦</div>
          <h1 className="text-4xl font-bold mb-4 gold-accent tracking-wide">
            {BRAND_NAME}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {LANDING_TITLE}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {LANDING_TAGLINE}
          </p>
        </div>

        <div className="tarot-card rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="w-full gold-accent font-bold py-4 px-6 rounded-lg transition shadow-md hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-40 text-lg tracking-wide"
              style={{ 
                background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.4) 0%, rgba(45, 27, 78, 0.6) 100%)',
                border: '2px solid var(--tarot-gold)',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
              }}
            >
              {isCreating ? '방 만드는 중...' : '✦ 방 만들기'}
            </button>
          </form>
        </div>

        <div className="tarot-card rounded-xl p-5 text-sm">
          <h2 className="font-semibold gold-accent mb-3 text-base">
            ✦ 사용 방법
          </h2>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>방을 만들고 링크를 상대방과 공유하세요</li>
            <li>상대방이 12가지 카드 중 하나를 선택합니다</li>
            <li>선택한 카드로 관계 역할을 해석해드려요</li>
          </ol>
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p className="mb-1">• 방은 7일 후 자동으로 만료됩니다</p>
            <p>• 수집되는 정보: 선택한 카드, 닉네임(선택)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
