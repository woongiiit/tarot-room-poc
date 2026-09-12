'use client';

import { useState } from 'react';

interface Card {
  id: string;
  cardType: string;
  nickname: string | null;
}

interface RelationshipGraphProps {
  cards: Card[];
  centerLabel?: string;
  cardEmojis: Record<string, string>;
  cardColors: Record<string, { accent: string; bg: string; border: string }>;
}

// Card slug mapping for front images
const CARD_SLUG: Record<string, string> = {
  '안전기지': 'safe-base',
  '도화선': 'fuse',
  '거울': 'mirror',
  '배터리': 'battery',
  '네비': 'navi',
  '방패': 'shield',
  '개그담당': 'comedian',
  '솔직봇': 'honest-bot',
  '거리두기': 'distance',
  '썸온도': 'subtle-temp',
  '멘토': 'mentor',
  '라이벌': 'rival',
};

function getFrontImageSrc(cardType: string): string {
  const slug = CARD_SLUG[cardType];
  return slug ? `/cards/front-${slug}.webp` : '';
}

export default function RelationshipGraph({
  cards,
  centerLabel = '나',
  cardEmojis,
  cardColors,
}: RelationshipGraphProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (cards.length === 0) return null;

  // Designer-locked sizes and layout
  const canvasSize = 400; // 1:1 canvas
  const padding = 48; // safe padding
  const centerSize = 64; // center node w/h
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;
  const cardThumbW = 48;
  const cardThumbH = 72; // 2:3 ratio
  const fallbackChipSize = 40;
  const orbitRadius = (canvasSize - padding * 2) / 2 - cardThumbH / 2;

  // Fixed circular slots (1-12), angle = -90° + (slot % 12) × 30°
  const positions = cards.map((_, index) => {
    const slot = index % 12;
    const angleDeg = -90 + slot * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: centerX + orbitRadius * Math.cos(angleRad),
      y: centerY + orbitRadius * Math.sin(angleRad),
    };
  });

  const handleImageError = (cardId: string) => {
    setImageErrors((prev) => new Set(prev).add(cardId));
  };

  return (
    <div 
      className="rounded-2xl p-4 md:p-6 mb-6" 
      style={{
        background: 'rgba(26, 11, 46, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '2px solid #d4af37',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(212, 175, 55, 0.3)',
      }}
    >
      <h2 className="text-xl font-bold text-center mb-4" style={{ color: '#d4af37' }}>
        ✦ 관계도
      </h2>
      
      <div className="relative w-full" style={{ aspectRatio: '1' }}>
        <svg
          viewBox={`0 0 ${canvasSize} ${canvasSize}`}
          className="w-full h-full"
          role="img"
          aria-label="관계 그래프"
          style={{ background: '#1a0b2e' }}
        >
          {/* Connection lines (center → periphery only) */}
          <g className="connections">
            {cards.map((card, index) => {
              const pos = positions[index];
              return (
                <line
                  key={`line-${card.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#d4af37"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>

          {/* Center node */}
          <g className="center-node">
            <rect
              x={centerX - centerSize / 2}
              y={centerY - centerSize / 2}
              width={centerSize}
              height={centerSize}
              rx="8"
              fill="#2d1b4e"
              stroke="#d4af37"
              strokeWidth="2.5"
            />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d4af37"
              fontSize="12"
              fontWeight="bold"
            >
              {centerLabel}
            </text>
          </g>

          {/* Card nodes */}
          {cards.map((card, index) => {
            const pos = positions[index];
            const imageSrc = getFrontImageSrc(card.cardType);
            const hasImageError = imageErrors.has(card.id);
            const useImage = imageSrc && !hasImageError;
            const emoji = cardEmojis[card.cardType] || '✦';
            const displayName = card.nickname || card.cardType;
            
            return (
              <g key={card.id} className="card-node">
                {useImage ? (
                  <>
                    {/* Card thumbnail 48×72 */}
                    <image
                      x={pos.x - cardThumbW / 2}
                      y={pos.y - cardThumbH / 2}
                      width={cardThumbW}
                      height={cardThumbH}
                      href={imageSrc}
                      onError={() => handleImageError(card.id)}
                      style={{ 
                        borderRadius: '4px',
                        border: '1.5px solid #d4af37',
                      }}
                      aria-label={displayName}
                    />
                    <rect
                      x={pos.x - cardThumbW / 2}
                      y={pos.y - cardThumbH / 2}
                      width={cardThumbW}
                      height={cardThumbH}
                      rx="4"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="1.5"
                    />
                  </>
                ) : (
                  <>
                    {/* Fallback chip 40×40 */}
                    <rect
                      x={pos.x - fallbackChipSize / 2}
                      y={pos.y - fallbackChipSize / 2}
                      width={fallbackChipSize}
                      height={fallbackChipSize}
                      rx="6"
                      fill="#2d1b4e"
                      stroke="#d4af37"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="16"
                      aria-label={displayName}
                      fill="#f5e6be"
                    >
                      {emoji}
                    </text>
                  </>
                )}
                
                {/* Label below node */}
                <text
                  x={pos.x}
                  y={pos.y + (useImage ? cardThumbH / 2 : fallbackChipSize / 2) + 12}
                  textAnchor="middle"
                  fill="#f5e6be"
                  fontSize="10"
                  fontWeight="500"
                >
                  {card.nickname || card.cardType}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <p className="text-xs text-center mt-3" style={{ color: '#f5e6be', opacity: 0.7 }}>
        {cards.length}개의 카드가 선택되었습니다
      </p>
    </div>
  );
}
