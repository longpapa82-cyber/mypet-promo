import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** 목표 수치(예: 3 → "3만+") */
  to: number;
  /** 접미사(예: "만+") */
  suffix?: string;
  /** 애니메이션 시간(ms) */
  duration?: number;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * CountUp — 스크롤 진입 시 0 → to 카운트업(절제된 delight, v9).
 * IntersectionObserver로 1회 트리거. reduced-motion 시 즉시 최종값.
 * 합성 친화는 아니나 1회·짧은 시간이라 성능 영향 미미.
 */
export default function CountUp({ to, suffix = '', duration = 1200, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0);
  const done = useRef(prefersReducedMotion());

  useEffect(() => {
    if (done.current) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            io.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              // easeOutCubic — 끝에서 부드럽게 감속
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(eased * to));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
