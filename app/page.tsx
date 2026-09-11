'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
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
            관계 역할 타로 방
          </h1>
          <p className="text-xl text-gray-200 mb-3 font-medium">
            나는 너에게 어떤 존재일까?
          </p>
          <p className="text-sm text-gray-400">
            12가지 관계 역할 메타포로 알아보세요
          </p>
        </div>

        <div className="tarot-card rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-gray-300 font-medium mb-2 block">
                질문을 입력하세요
              </span>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 나는 친구에게 어떤 존재일까?"
                maxLength={200}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-900/50 text-white placeholder-gray-500 transition"
                disabled={isCreating}
              />
              <span className="text-xs text-gray-500 mt-1 block">
                {question.length}/200
              </span>
            </label>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating || !question.trim()}
              className="w-full gold-accent font-bold py-4 px-6 rounded-lg transition shadow-md hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-40 text-lg tracking-wide"
              style={{ 
                background: question.trim() ? 'linear-gradient(135deg, rgba(109, 40, 217, 0.4) 0%, rgba(45, 27, 78, 0.6) 100%)' : 'rgba(75, 85, 99, 0.3)',
                border: '2px solid var(--tarot-gold)',
                boxShadow: question.trim() ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none'
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
            <li>질문을 입력하고 방을 만드세요</li>
            <li>링크를 상대방과 공유하세요</li>
            <li>상대방이 12가지 카드 중 하나를 선택합니다</li>
            <li>선택한 카드로 관계 역할을 해석해드려요</li>
          </ol>
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p className="mb-1">• 방은 7일 후 자동으로 만료됩니다</p>
            <p>• 수집되는 정보: 질문, 선택한 카드, 닉네임(선택)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
