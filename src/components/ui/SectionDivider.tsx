/**
 * SectionDivider — 섹션 사이 곡선 전환(배경·섹션 구분 강화 B1).
 *
 * 풀폭 SVG로 위 섹션 끝을 곡선/물결/언덕 모양으로 깎아 아래 섹션 색이 올라오게 한다.
 * fill = '아래 섹션 배경색'(토큰). 곡선 위쪽은 **투명**이라 위 섹션의 실제 배경(Aurora 그라디언트 포함)이
 * 그대로 비친다 → 평평한 색 띠(헤어라인/밴드) 없이 매끄럽게 연결된다.
 *
 * 기하: .wrap을 음수 top 마진으로 위 섹션에 통째로 겹쳐 올린다(투명 top이 위 섹션 위에 놓임).
 * 곡선의 채워진 아래쪽(다음 색)만 경계에 닿는다. topColor 같은 '단색 채움'은 쓰지 않는다(밴드 원인).
 *
 * 사용: 위 섹션과 아래 섹션 사이(App.tsx)에 <SectionDivider variant color />.
 * 장식 전용 → aria-hidden. 색은 토큰 var()로 일관/다크 대응.
 */
import styles from './SectionDivider.module.css';

type DividerVariant = 'wave' | 'hill' | 'blob' | 'tilt';

interface SectionDividerProps {
  /** 곡선 종류 */
  variant?: DividerVariant;
  /** 채울 색 = 아래(다음) 섹션의 배경색. 토큰 var() 권장. */
  color: string;
  /** @deprecated 더 이상 사용 안 함(단색 채움이 밴드 헤어라인 원인). 투명 top + 음수마진 겹침으로 대체. */
  topColor?: string;
  /** 위아래 뒤집기(아래로 볼록 등) */
  flip?: boolean;
  /** 높이 px (기본 80 — 곡선이 또렷하게 보이도록 충분한 높이) */
  height?: number;
  className?: string;
}

// viewBox 1440 x 100 기준 path들. 아래쪽을 채워 '다음 섹션 색이 위로 올라온' 모양.
const PATHS: Record<DividerVariant, string> = {
  // 부드러운 물결 (MyPet 친근 — 기본)
  wave: 'M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,45 L1440,100 L0,100 Z',
  // 완만한 언덕 (가운데 솟음)
  hill: 'M0,70 C360,10 1080,10 1440,70 L1440,100 L0,100 Z',
  // 블롭(불규칙 곡선, 더 장난스럽게)
  blob: 'M0,55 C180,20 360,80 600,55 C840,30 1020,75 1260,50 C1350,38 1410,45 1440,50 L1440,100 L0,100 Z',
  // 비스듬한 각도(모던)
  tilt: 'M0,80 L1440,20 L1440,100 L0,100 Z',
};

export default function SectionDivider({
  variant = 'wave',
  color,
  flip = false,
  height = 80,
  className,
}: SectionDividerProps) {
  return (
    <div
      className={[styles.wrap, flip ? styles.flip : '', className].filter(Boolean).join(' ')}
      // 투명 top → 위 섹션 배경이 비침. 음수 top 마진(CSS)으로 위 섹션에 통째로 겹친다.
      style={{ height, color, marginTop: -height }}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        className={styles.svg}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={PATHS[variant]} fill="currentColor" />
      </svg>
    </div>
  );
}
