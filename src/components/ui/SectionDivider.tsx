/**
 * SectionDivider — 섹션 사이 '그라데이션 페이드' 전환(웨이브 곡선 제거 버전).
 *
 * 곡선 SVG는 가장자리 anti-alias·색 단차가 '선'으로 보이는 문제가 있어 폐기.
 * 대신 위 섹션 색(topColor) → 아래 섹션 색(color)으로 세로 그라데이션을 깔아
 * 두 색이 부드럽게 녹아들게 한다 → 경계선이 물리적으로 존재하지 않음.
 *
 * 위·아래 섹션에 1px씩 겹쳐(음수 마진) 서브픽셀 틈도 제거.
 * 사용: App.tsx에서 <SectionDivider topColor={위섹션색} color={아래섹션색} />.
 * 장식 전용 → aria-hidden.
 */
import styles from './SectionDivider.module.css';

interface SectionDividerProps {
  /** 아래(다음) 섹션 배경색. 토큰 var() 권장. */
  color: string;
  /** 위(이전) 섹션 배경색. 토큰 var() 권장. 미지정 시 surface. */
  topColor?: string;
  /** 높이 px (기본 96 — 충분히 길게 페이드해야 단차가 안 보임) */
  height?: number;
  className?: string;
  /** @deprecated 곡선 제거됨(그라데이션 전용). 호환용으로만 받음. */
  variant?: string;
  /** @deprecated 사용 안 함 */
  flip?: boolean;
}

export default function SectionDivider({
  color,
  topColor = 'var(--surface)',
  height = 96,
  className,
}: SectionDividerProps) {
  return (
    <div
      className={[styles.fade, className].filter(Boolean).join(' ')}
      style={{
        height,
        // 위 섹션 색 → 아래 섹션 색 세로 그라데이션. 양 끝은 각 섹션 색과 100% 일치 → 단차 0.
        background: `linear-gradient(to bottom, ${topColor} 0%, ${color} 100%)`,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
