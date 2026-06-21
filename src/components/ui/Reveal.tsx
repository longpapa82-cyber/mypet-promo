import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  /** 진입 지연(ms) — 순차 스태거 연출용 */
  delay?: number;
  className?: string;
  /** 인뷰 판정 임계값 */
  threshold?: number;
  /** 통통 등장(cute) — spring 백스윙 + 살짝 scale. 카드·스텝 등 깜찍 진입용 */
  bounce?: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// IntersectionObserver 스크롤 인뷰 래퍼.
// once: 한 번 보이면 관찰 해제. reduced-motion 시 즉시 표시(애니메이션 생략).
// 안전장치: IO 미지원·실패·SSR 시 즉시 visible 폴백 → 콘텐츠가 영구 숨김(빈 화면)되지 않게 한다.
// (no-JS/스크린샷/OG/검색봇은 .reveal 초기 opacity:0를 .no-js 폴백[index.html]으로 표시)
export default function Reveal({ children, delay = 0, className, threshold = 0.15, bounce = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // armed: 진입 임박/전환 진행 중에만 will-change(합성 레이어)를 부여한다.
  // 미진입 다수 요소가 합성 레이어를 상시 점유하지 않도록 베이스 CSS가 아닌 상태로 관리한다.
  const [armed, setArmed] = useState(false);

  // 애니메이션 없이 즉시 표시할 때(reduced-motion·IO 미지원·SSR 폴백)는
  // transition/transitionend가 없으므로 will-change 자체를 부여하지 않는다(누수 방지).
  const showInstant = () => {
    setArmed(false);
    setVisible(true);
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      showInstant();
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      showInstant();
      return;
    }

    // 프리트리거: 뷰포트 진입 한참 전(아래로 20% 여유)부터 will-change를 미리 무장해
    // 합성 레이어를 준비하되, 실제 표시는 threshold 만족 시에만 한다.
    const armObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArmed(true);
            armObserver.disconnect();
            break;
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px 20% 0px' },
    );

    // 근본 수정: threshold 0(1px만 보이면 표시) + rootMargin으로 뷰포트보다 넓게 관찰한다.
    // 기존 threshold 0.15는 폰목업처럼 키 큰 요소나 빠른 스크롤에서 "15% 진입" 순간을 놓쳐
    // 콘텐츠가 opacity:0에 영구로 갇혔다(features 5/5 숨음 = 빈 공백·목업 느낌의 원인).
    // 위/아래 12% 여유로 '화면 근처에 오면 무조건 표시' → 빈 공백 근절.
    const reveal = () => {
      setArmed(true);
      setVisible(true);
    };
    const showObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            showObserver.disconnect();
            window.removeEventListener('scroll', scrollFallback);
            break;
          }
        }
      },
      // rootMargin 아래로 40% 여유 — 키 큰 폰목업도 뷰포트 진입 한참 전 미리 표시(빈 공백 근절).
      { threshold: 0, rootMargin: '0px 0px 40% 0px' },
    );

    // 안전망: IO가 트리거 못 해도, 요소 상단이 뷰포트 하단 아래 40% 이내로 오면 강제 표시.
    const scrollFallback = () => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.4 && r.bottom > -window.innerHeight * 0.4) {
        reveal();
        showObserver.disconnect();
        window.removeEventListener('scroll', scrollFallback);
      }
    };

    armObserver.observe(node);
    showObserver.observe(node);
    window.addEventListener('scroll', scrollFallback, { passive: true });
    // 초기 1회 체크(이미 화면 안이면 즉시 표시).
    scrollFallback();
    return () => {
      armObserver.disconnect();
      showObserver.disconnect();
      window.removeEventListener('scroll', scrollFallback);
    };
  }, [threshold]);

  // 인뷰 전환 완료 후 will-change 해제(상시 합성 레이어 유지 방지).
  const handleTransitionEnd = (event: { target: EventTarget | null }) => {
    if (event.target === ref.current) {
      setArmed(false);
    }
  };

  return (
    <div
      ref={ref}
      className={[
        styles.reveal,
        bounce ? styles.bounce : '',
        armed ? styles.arm : '',
        visible ? styles.visible : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}
