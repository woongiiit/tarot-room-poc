/**
 * Centralized tarot card type definitions and asset mappings.
 */

export const CARD_TYPES = [
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
] as const;

export type CardType = typeof CARD_TYPES[number];

/**
 * Slug mapping for front card assets.
 * Maps Korean card names to their URL-safe slug identifiers.
 */
export const CARD_SLUG: Record<string, string> = {
  '안전기지': 'safe-base',
  '도화선': 'fuse',
  '거울': 'mirror',
  '배터리': 'battery',
  '네비': 'navi',
  '방패': 'shield',
  '개그담당': 'gag',
  '솔직봇': 'honest-bot',
  '거리두기': 'distance',
  '썸온도': 'chemistry',
  '멘토': 'mentor',
  '라이벌': 'rival',
};

/**
 * Returns the front image src path for a given card type.
 * @param cardType - Korean card type name
 * @returns Path to front card image (e.g., "/cards/front-mirror.webp")
 */
export function getFrontImageSrc(cardType: string): string {
  const slug = CARD_SLUG[cardType];
  if (!slug) {
    console.warn(`No slug found for card type: ${cardType}`);
    return '';
  }
  return `/cards/front-${slug}.webp`;
}

/**
 * Returns the back card image path (always the same for all cards).
 */
export function getBackImageSrc(): string {
  return '/cards/back.webp';
}

export const CARD_EMOJIS: Record<string, string> = {
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

export const CARD_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
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
