import { useEffect, useRef } from 'react';
import styles from './Aurora.module.css';

type AuroraVariant = 'mint' | 'sky' | 'peach' | 'jewel' | 'mixed' | 'warm' | 'cream' | 'champagne';

interface AuroraProps {
  /** 섹션 분위기 — blob 색 조합 */
  variant?: AuroraVariant;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// 섹션 배경용 Aurora blob 레이어.
// 2~3개의 heavy-blur blob을 절대배치하고 transform translate만으로 은은히 부유시킨다.
// 콘텐츠 뒤(z-index 0) + pointer-events none. reduced-motion 시 애니메이션 정지(global + module).
// will-change는 부유 시작 시에만 켜고, 무한 애니메이션이므로 가시성 벗어나면(IO) 해제한다.
export default function Aurora({ variant = 'mint', className }: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const blobs = Array.from(node.querySelectorAll<HTMLElement>(`.${styles.blob}`));
    if (blobs.length === 0) return;

    // 화면에 보일 때만 will-change(합성 레이어 승격) 부여 → 벗어나면 해제.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const onScreen = entry.isIntersecting;
          for (const blob of blobs) {
            blob.style.setProperty('will-change', onScreen ? 'transform' : 'auto');
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      for (const blob of blobs) blob.style.setProperty('will-change', 'auto');
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.layer, styles[variant], className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className={`${styles.blob} ${styles.b1}`} data-blob="" />
      <span className={`${styles.blob} ${styles.b2}`} data-blob="" />
      <span className={`${styles.blob} ${styles.b3}`} data-blob="" />
      {/* 노이즈 오버레이(B3) — 메시 위 미세 입자로 촉각감(매끈한 디지털 느낌 탈피). */}
      <span className={styles.grain} aria-hidden="true" />
    </div>
  );
}
