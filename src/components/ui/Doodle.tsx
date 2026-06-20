/**
 * Doodle — 깜찍 장식 SVG(발자국·하트·별·물결). cute-elevation P2.
 *
 * 인라인 SVG라 색은 토큰(fill), 애니는 cute-float/cute-pulse 유틸로 제어한다.
 * 장식 전용이므로 aria-hidden. 콘텐츠를 가리지 않는 여백/모서리에 배치한다.
 */
import type { CSSProperties } from 'react';

type DoodleKind = 'paw' | 'heart' | 'star' | 'sparkle' | 'bone';

interface DoodleProps {
  kind: DoodleKind;
  /** 크기(px) */
  size?: number;
  /** 색 — 토큰 var() 또는 색상값 */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Doodle({ kind, size = 28, color = 'var(--cute-coral)', className, style }: DoodleProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: color,
    'aria-hidden': true as const,
    className,
    style,
  };

  switch (kind) {
    case 'paw':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="15.5" rx="4.6" ry="3.8" />
          <ellipse cx="6.2" cy="9.8" rx="1.9" ry="2.5" />
          <ellipse cx="10" cy="6.8" rx="1.9" ry="2.6" />
          <ellipse cx="14" cy="6.8" rx="1.9" ry="2.6" />
          <ellipse cx="17.8" cy="9.8" rx="1.9" ry="2.5" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 21s-7.5-4.6-10-9.3C.4 8.7 2 5.2 5.3 5.2c2 0 3.4 1.2 4.2 2.5.8-1.3 2.2-2.5 4.2-2.5 3.3 0 4.9 3.5 3.3 6.5C19.5 16.4 12 21 12 21z" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 2.6l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 17l-5.6 2.8 1.3-6.3-4.8-4.3 6.4-.7z" />
        </svg>
      );
    case 'bone':
      // 강아지 뼈다귀 — 펫 모티프 다양성(P6). 가로 막대 + 양끝 두 원 쌍.
      return (
        <svg {...common}>
          <circle cx="5.2" cy="8.3" r="2.5" />
          <circle cx="5.2" cy="12.2" r="2.5" />
          <circle cx="18.8" cy="8.3" r="2.5" />
          <circle cx="18.8" cy="12.2" r="2.5" />
          <rect x="5" y="8.4" width="14" height="3.6" rx="1.8" />
        </svg>
      );
    case 'sparkle':
    default:
      return (
        <svg {...common}>
          <path d="M12 2c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" />
        </svg>
      );
  }
}
