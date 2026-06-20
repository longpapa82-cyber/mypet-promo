import type { ReactNode } from 'react';
import styles from './Section.module.css';

type BgVariant =
  | 'surface'
  | 'low'
  | 'jewel'
  | 'warm'
  | 'mint'
  | 'sky'
  | 'skySoft'
  | 'mintSoft'
  | 'peachSoft'
  | 'lavSoft'
  | 'butterSoft';

interface SectionProps {
  id?: string;
  children: ReactNode;
  background?: BgVariant;
  tight?: boolean;
  className?: string;
  /** 컨테이너 래핑 없이 풀블리드 콘텐츠를 직접 넘길 때 */
  fullBleed?: boolean;
}

// 섹션 래퍼: id 앵커 + max-width 컨테이너 + 상하 여백 토큰 + optional 배경 variant.
export default function Section({
  id,
  children,
  background = 'surface',
  tight = false,
  className,
  fullBleed = false,
}: SectionProps) {
  const sectionCls = [
    tight ? 'section-tight' : 'section',
    styles.section,
    styles[background],
    background === 'jewel' ? styles.onDark : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={sectionCls}>
      {fullBleed ? children : <div className="container">{children}</div>}
    </section>
  );
}
