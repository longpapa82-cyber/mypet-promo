import { useEffect, useRef } from 'react';
import Section from '../components/ui/Section';
import StoreCTA from '../components/ui/StoreCTA';
import Reveal from '../components/ui/Reveal';
import Aurora from '../components/ui/Aurora';
import Doodle from '../components/ui/Doodle';
import { asset } from '../constants/stores';
import styles from './Hero.module.css';

// LCP 후보이므로 경량 WebP를 우선 제공하고 PNG로 폴백한다(index.html에서 WebP preload).
const mascotDuoWebp = asset('assets/mascot-duo.webp');
const mascotDuoPng = asset('assets/mascot-duo.png');

// 플로팅 통계칩 — 앱 2대 서비스(시설검색·AI상담)의 핵심 수치를 요약.
const STATS = [
  { label: '전국', value: '3만+', unit: '펫 시설', tone: 'sky' as const },
  { label: '한 번에', value: '다양한', unit: '시설 종류', tone: 'mint' as const },
  { label: '바로', value: 'AI', unit: '건강·법률 상담', tone: 'green' as const },
];

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Hero — 풀블리드 첫 화면.
// 배경: Aurora mixed(mint/sky/peach) 메시 blob.
// 좌: 오버사이즈 헤드라인 + 서브카피 + StoreCTA(iOS활성·Android 출시예정).
// 우: mascot-duo 글래스+골드 보더 카드 + 패럴랙스(스크롤 0.2~0.4) + 글래스 플로팅 통계칩.
// 모바일 세로 스택 → 1024+ 2열. reduced-motion 시 패럴랙스 정지.
export default function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);

  // 패럴랙스: 스크롤에 따라 레이어를 서로 다른 속도(0.2~0.4)로 transform translateY.
  // transform만 변경(layout 무관·합성 친화). reduced-motion 시 전면 비활성.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = visualRef.current;
    if (!node || typeof window === 'undefined') return;

    const layers = Array.from(
      node.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    if (layers.length === 0) return;

    let raf = 0;
    let active = true;

    const apply = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      // 섹션이 뷰포트 중앙을 기준으로 얼마나 벗어났는지(px)
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      for (const layer of layers) {
        const speed = Number(layer.dataset.parallax) || 0;
        layer.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (raf || !active) return;
      raf = window.requestAnimationFrame(apply);
    };

    // 가시 영역에 들어올 때만 스크롤 핸들러 가동 + will-change 승격.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          active = entry.isIntersecting;
          for (const layer of layers) {
            layer.style.setProperty('will-change', active ? 'transform' : 'auto');
          }
          if (active) apply();
        }
      },
      { threshold: 0 },
    );
    io.observe(node);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      for (const layer of layers) layer.style.setProperty('will-change', 'auto');
    };
  }, []);

  return (
    <Section id="hero" background="warm" fullBleed className={styles.hero}>
      <Aurora variant="mixed" className={styles.aurora} />

      <div className={styles.inner}>
        <Reveal className={styles.copy}>
          <span className={`${styles.eyebrow} sticker t-label-md`}>
            <Doodle kind="paw" size={16} color="var(--green)" />
            반려동물 필수 정보 앱
          </span>

          <h1 className={`${styles.headline} t-display-lg`}>
            반려생활 필수 정보를
            <br />
            한 곳에서, <span className={styles.accent}>MyPet</span>
          </h1>

          <p className={`${styles.subcopy} t-body-lg`}>
            내 주변 펫 시설을 거리순으로 찾고, AI에게 반려동물 건강·법률을
            바로 물어보세요. 전국 3만여 곳의 병원·미용실·호텔·카페까지 한 번에.
          </p>

          <StoreCTA className={styles.cta} />
        </Reveal>

        <Reveal className={styles.visual} delay={120}>
          <div className={styles.stage} ref={visualRef}>
            {/* 깊이 blob 레이어 (느린 패럴랙스) */}
            <span
              className={styles.blob}
              data-parallax="0.06"
              data-blob=""
              aria-hidden="true"
            />
            <span
              className={styles.blobGold}
              data-parallax="0.1"
              data-blob=""
              aria-hidden="true"
            />

            {/* 깜찍 도들 — 절제 2개(발자국·하트). 콘텐츠/통계칩 비가림 여백. 레이어 수 최소화. */}
            <Doodle kind="paw" size={30} color="var(--cute-lav)" className={`${styles.doodle} ${styles.doodlePaw} cute-float`} />
            <Doodle kind="heart" size={22} color="var(--cute-coral)" className={`${styles.doodle} ${styles.doodleHeart} cute-pulse`} />

            {/* 마스코트 글래스+골드 보더 카드 (중간 속도 패럴랙스) + 둥실 통통 */}
            <div className={`${styles.imageCard} cute-float`} data-parallax="0.04">
              <span className={styles.cardCrown} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                  <path
                    fill="currentColor"
                    d="M3 7l4.5 3.2L12 4l4.5 6.2L21 7l-1.6 11H4.6L3 7zm2.5 9h13l.7-5-3 2.1L12 7.6 7.8 13l-3-2.1.7 5z"
                  />
                </svg>
              </span>
              <picture>
                <source srcSet={mascotDuoWebp} type="image/webp" />
                <img
                  className={styles.image}
                  src={mascotDuoPng}
                  alt="MyPet 마스코트 강아지와 고양이"
                  width={768}
                  height={535}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>

            {/* 글래스 플로팅 통계칩 (빠른 패럴랙스로 깊이 강조) */}
            <ul className={styles.chips} aria-label="MyPet 핵심 요약">
              {STATS.map((stat, i) => (
                <li
                  key={stat.unit}
                  className={`glass ${styles.chip} ${styles[`chip${i + 1}`]} ${
                    styles[`tone_${stat.tone}`]
                  }`}
                  data-parallax={(0.16 + i * 0.08).toFixed(2)}
                >
                  <span className={`${styles.chipValue} t-headline-md`}>
                    {stat.value}
                  </span>
                  <span className={`${styles.chipLabel} t-label-md`}>
                    {stat.label} {stat.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
