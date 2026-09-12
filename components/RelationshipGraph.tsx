'use client';

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

export default function RelationshipGraph({
  cards,
  centerLabel = '나',
  cardEmojis,
  cardColors,
}: RelationshipGraphProps) {
  if (cards.length === 0) return null;

  // SVG viewport
  const width = 100;
  const height = 100;
  const centerX = 50;
  const centerY = 50;
  const centerRadius = 8;
  
  // Calculate positions for surrounding nodes in a circle
  const nodeRadius = 6;
  const orbitRadius = 32;
  
  const positions = cards.map((_, index) => {
    const angle = (index * 2 * Math.PI) / cards.length - Math.PI / 2;
    return {
      x: centerX + orbitRadius * Math.cos(angle),
      y: centerY + orbitRadius * Math.sin(angle),
    };
  });

  return (
    <div className="tarot-card rounded-2xl p-4 md:p-6 mb-6">
      <h2 className="text-xl font-bold gold-accent text-center mb-4">
        ✦ 관계도
      </h2>
      
      <div className="relative w-full" style={{ aspectRatio: '1' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          role="img"
          aria-label="관계 그래프"
        >
          {/* Connection lines */}
          <g className="connections">
            {cards.map((card, index) => {
              const pos = positions[index];
              const colors = cardColors[card.cardType];
              return (
                <line
                  key={`line-${card.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={colors?.accent || 'var(--tarot-gold)'}
                  strokeWidth="0.3"
                  opacity="0.4"
                  strokeDasharray="1,1"
                />
              );
            })}
          </g>

          {/* Center node */}
          <g className="center-node">
            <circle
              cx={centerX}
              cy={centerY}
              r={centerRadius}
              fill="url(#centerGradient)"
              stroke="var(--tarot-gold)"
              strokeWidth="0.5"
            />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--tarot-gold)"
              fontSize="5"
              fontWeight="bold"
            >
              {centerLabel}
            </text>
          </g>

          {/* Card nodes */}
          {cards.map((card, index) => {
            const pos = positions[index];
            const colors = cardColors[card.cardType];
            const emoji = cardEmojis[card.cardType] || '✦';
            const displayName = card.nickname || card.cardType;
            
            return (
              <g key={card.id} className="card-node">
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={colors?.accent || 'var(--tarot-gold)'}
                  fillOpacity="0.3"
                  stroke={colors?.accent || 'var(--tarot-gold)'}
                  strokeWidth="0.4"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="4"
                  aria-label={displayName}
                >
                  {emoji}
                </text>
                
                {/* Label below node */}
                <text
                  x={pos.x}
                  y={pos.y + nodeRadius + 3}
                  textAnchor="middle"
                  fill="var(--tarot-gold)"
                  fontSize="2.5"
                  fontWeight="500"
                  opacity="0.8"
                >
                  {card.nickname || card.cardType}
                </text>
              </g>
            );
          })}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="rgba(109, 40, 217, 0.5)" />
              <stop offset="100%" stopColor="rgba(45, 27, 78, 0.8)" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <p className="text-xs text-gray-400 text-center mt-3">
        {cards.length}개의 카드가 선택되었습니다
      </p>
    </div>
  );
}
