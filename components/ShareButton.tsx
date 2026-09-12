'use client';

import { useEffect, useState } from 'react';

interface ShareButtonProps {
  roomId: string;
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
  variant?: 'kakao' | 'primary' | 'secondary';
}

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: 'feed';
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons?: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

export default function ShareButton({
  roomId,
  title,
  description,
  imageUrl,
  className = '',
  variant = 'primary',
}: ShareButtonProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    // Check if Kakao SDK is available and initialize
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (kakaoKey && typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }
      setKakaoReady(true);
    }
  }, []);

  const getRoomUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const handleKakaoShare = () => {
    if (!window.Kakao || !kakaoReady) {
      handleFallbackShare();
      return;
    }

    const roomUrl = getRoomUrl();
    const finalImageUrl = imageUrl || `${window.location.origin}/share/kakao-card.webp`;

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: finalImageUrl,
          link: {
            mobileWebUrl: roomUrl,
            webUrl: roomUrl,
          },
        },
        buttons: [
          {
            title: '카드 뽑으러 가기',
            link: {
              mobileWebUrl: roomUrl,
              webUrl: roomUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Kakao share error:', error);
      handleFallbackShare();
    }
  };

  const handleFallbackShare = async () => {
    const roomUrl = getRoomUrl();

    // Try Web Share API first (mobile)
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text: description,
          url: roomUrl,
        });
        return;
      } catch (error) {
        // User cancelled or error - fall through to copy
        if ((error as Error).name !== 'AbortError') {
          console.log('Web Share failed:', error);
        }
      }
    }

    // Fallback to copy
    handleCopyLink();
  };

  const handleCopyLink = () => {
    const roomUrl = getRoomUrl();
    navigator.clipboard.writeText(roomUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'kakao':
        return 'bg-[#FEE500] hover:bg-[#FDD835] text-[#000000] font-bold border-2 border-transparent';
      case 'secondary':
        return 'bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 font-medium';
      case 'primary':
      default:
        return 'gold-accent font-bold border-2 border-[var(--tarot-gold)] bg-gradient-to-br from-purple-900/40 to-purple-900/60 hover:from-purple-800/60 hover:to-purple-800/80 shadow-lg hover:shadow-2xl';
    }
  };

  const getButtonContent = () => {
    if (showCopied) {
      return '✓ 복사됨!';
    }

    if (kakaoReady && variant === 'kakao') {
      return (
        <>
          <svg
            className="w-5 h-5 inline-block mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C6.486 3 2 6.262 2 10.5c0 2.545 1.528 4.816 3.922 6.238-.147.645-.515 2.267-.565 2.516-.062.31.114.305.238.222.098-.065 2.016-1.366 2.909-1.966C9.414 17.827 10.68 18 12 18c5.514 0 10-3.262 10-7.5S17.514 3 12 3z" />
          </svg>
          카톡으로 공유
        </>
      );
    }

    return '✦ 링크 공유';
  };

  const handleClick = () => {
    if (kakaoReady) {
      handleKakaoShare();
    } else {
      handleFallbackShare();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${getButtonStyles()} py-3 px-6 rounded-lg transition text-sm ${className}`}
    >
      {getButtonContent()}
    </button>
  );
}
