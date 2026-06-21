import { useEffect, useRef, type ReactNode } from 'react';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SectionDoodles from '../components/ui/SectionDoodles';
import styles from './Features.module.css';

// 에셋 경로: vite base('/mypet/')를 고려해 BASE_URL을 접두로 붙인다.
const asset = (file: string): string => `${import.meta.env.BASE_URL}assets/${file}`;

// 기능 항목 정의.
// 실제 앱 화면 스크린샷(shot-*.webp, 2026-06-20 실기기 캡처 — OS 상태바/네비 크롭)을 폰 목업
// 프레임 안에 넣는다. 스크린샷엔 이미 앱 상태바/탭바가 있으므로 목업의 가짜 상태바·탭바는
// shot 모드에서 숨긴다(isShot). 노치+베젤+그림자만 진짜 폰처럼 감싼다.
interface FeatureItem {
  key: string;
  badge: string;
  title: string;
  body: string;
  bullets: string[];
  /** 폰 화면에 깔리는 이미지(사진=hero, 일러스트=마스코트) */
  image: string;
  imageAlt: string;
  /** 화면 합성 종류 — sky/mint/warm은 라이트 톤, gold는 jewel 다크 + 골드 액센트 */
  tone: 'sky' | 'mint' | 'warm' | 'gold';
  /** 폰 화면 상단 모의 상태바에 표기될 화면 제목(앱 화면 느낌) */
  screenTitle: string;
  /** Aurora 분위기 — 행별 배경 톤 */
  aurora: 'sky' | 'mint' | 'peach' | 'jewel';
  /** image가 사진이면 cover(꽉 채움), 마스코트면 contain(여백) */
  fit: 'cover' | 'contain';
}

const FEATURES: FeatureItem[] = [
  {
    key: 'facility',
    badge: '내 주변 시설',
    title: '주변 펫 시설을 한눈에',
    body: '현재 위치 기준, 가까운 펫 시설을 한눈에. 등록 3만+ 곳.',
    bullets: ['거리순 정렬', '운영시간·전화', '카테고리 필터'],
    image: asset('shot-map.webp'),
    imageAlt: 'MyPet 앱 주변 펫 시설 화면',
    tone: 'sky',
    screenTitle: '내 주변 시설',
    aurora: 'sky',
    fit: 'cover',
  },
  {
    key: 'home',
    badge: '홈',
    title: '오늘 우리 아이 일정까지',
    body: '예방접종·검진 일정을 D-day로, 매일 반려 팁까지 한 화면에.',
    bullets: ['다가오는 의료 일정', '매일 반려 팁', '내 반려동물 관리'],
    image: asset('shot-home.webp'),
    imageAlt: 'MyPet 앱 홈 화면',
    tone: 'mint',
    screenTitle: '홈',
    aurora: 'mint',
    fit: 'cover',
  },
  {
    key: 'ai',
    badge: 'AI 상담',
    title: 'AI에게 건강·법률을 묻다',
    body: '건강·법률 궁금증을 AI에게 바로. (참고용 정보 · 진단 아님)',
    bullets: ['건강·법률 질의', '면책 안내 동반', '주제별 빠른 질문'],
    image: asset('shot-chat.webp'),
    imageAlt: 'MyPet 앱 AI 상담 화면',
    tone: 'warm',
    screenTitle: 'AI 상담',
    aurora: 'peach',
    fit: 'cover',
  },
  {
    key: 'premium',
    badge: '프리미엄',
    title: '광고 없이, AI 상담 무제한*',
    body: '광고 없이, AI 상담은 마음껏. 월 자동 갱신 · 언제든 해지.',
    bullets: ['광고 제거', 'AI 상담 무제한*', '월 자동 갱신'],
    image: asset('shot-premium.webp'),
    imageAlt: 'MyPet 앱 프리미엄 구독 화면',
    tone: 'gold',
    screenTitle: '프리미엄',
    aurora: 'jewel',
    fit: 'cover',
  },
];

// 실제 앱 스크린샷(.webp) — png 폴백을 picture로 제공. 폰 화면을 꽉 채운다(cover).
function ScreenImage({ item }: { item: FeatureItem }) {
  return (
    <picture>
      <source srcSet={item.image} type="image/webp" />
      <img
        className={styles.screenShot}
        src={item.image.replace(/\.webp$/, '.png')}
        alt={item.imageAlt}
        width={300}
        height={626}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

interface PhoneMockProps {
  item: FeatureItem;
  /** 패럴랙스 깊이 — 0.2~0.4 */
  parallax?: number;
  children?: ReactNode;
}

// 폰 목업 프레임: 둥근 베젤 + 노치 + 그림자 안에 "앱 화면 느낌" 합성.
// 화면 = 모의 상태바(시간/배지) + 미디어 + 하단 모의 탭바, 위로 글래스 캡션 카드 오버레이.
function PhoneMock({ item, parallax = 0.3, children }: PhoneMockProps) {
  const onDark = item.tone === 'gold';
  return (
    <div className={[styles.phone, styles[`tone_${item.tone}`]].join(' ')}>
      <span className={styles.phoneNotch} aria-hidden="true" />
      <div
        className={[styles.screen, onDark ? styles.screenDark : ''].filter(Boolean).join(' ')}
        {...(onDark ? { 'data-on-dark': '' } : {})}
      >
        {/* 실제 앱 스크린샷이 화면을 꽉 채운다(자체 상태바·탭바 포함). 목업 가짜 UI는 제거. */}
        <div
          className={styles.screenMedia}
          data-parallax=""
          style={{ '--p-depth': parallax } as React.CSSProperties}
        >
          <ScreenImage item={item} />
        </div>
      </div>

      {children}
    </div>
  );
}

interface FeatureRowProps {
  item: FeatureItem;
  index: number;
}

// 좌우 교차(zig-zag) 한 행. 짝수 index는 미디어 왼쪽, 홀수는 오른쪽.
function FeatureRow({ item, index }: FeatureRowProps) {
  const mediaRight = index % 2 === 1;
  const onDark = item.tone === 'gold';

  // 글래스 캡션 카드 — 폰 위에 떠 있는 작은 정보 칩.
  const caption = (
    <div
      className={['glass', styles.caption, onDark ? styles.captionDark : '']
        .filter(Boolean)
        .join(' ')}
      {...(onDark ? { 'data-on-dark': '' } : {})}
      data-parallax=""
      style={{ '--p-depth': 0.2 } as React.CSSProperties}
    >
      <span className={styles.captionDot} aria-hidden="true" />
      <span className={`${styles.captionText} t-label-md`}>{item.bullets[0]}</span>
    </div>
  );

  return (
    <Reveal>
      <div className={[styles.row, mediaRight ? styles.rowReverse : ''].filter(Boolean).join(' ')}>
        <div className={styles.media}>
          <PhoneMock item={item} parallax={mediaRight ? 0.34 : 0.26}>
            {caption}
          </PhoneMock>
        </div>

        <div className={styles.copy}>
          <span className={styles.badge}>{item.badge}</span>
          <h3 className={`t-headline-md ${styles.title}`}>{item.title}</h3>
          <p className={`t-body-lg ${styles.body}`}>{item.body}</p>
          <ul className={styles.bullets}>
            {item.bullets.map((b) => (
              <li key={b} className={`t-body-md ${styles.bullet}`}>
                {/* F3: 점 → 체크 아이콘(기능 제공 시각화·스캔성) */}
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="13" height="13" focusable="false">
                    <path
                      d="M5 10.5l3.2 3.2L15 6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

// 스크롤 진행도에 따라 [data-parallax] 요소를 transform translate만으로 미세 이동.
// transform만 사용(레이아웃 무관, 합성) · reduced-motion 시 전면 비활성.
function useParallax(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (targets.length === 0) return;

    let ticking = false;
    let active = false;

    const apply = () => {
      ticking = false;
      const vh = window.innerHeight || 1;
      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        // 뷰포트 중앙 기준 진행도 (-1 ~ 1)
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const depth = Number(el.style.getPropertyValue('--p-depth')) || 0.3;
        const shift = -progress * depth * 40; // px, 최대 ±~12px
        el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!active || ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    // 섹션이 화면에 있을 때만 스크롤 리스너 활성 + will-change 부여.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          active = entry.isIntersecting;
          for (const el of targets) {
            el.style.setProperty('will-change', active ? 'transform' : 'auto');
          }
          if (active) apply();
        }
      },
      { threshold: 0 },
    );

    io.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      for (const el of targets) el.style.setProperty('will-change', 'auto');
    };
  }, [rootRef]);
}

// 기능 상세 섹션: 폰 목업 + 글래스 캡션 + 설명을 좌우 교차로 4개 배치.
// Aurora 메시 배경(은은) + 패럴랙스 깊이. reduced-motion 시 모션 전면 정지.
export default function Features() {
  const rootRef = useRef<HTMLDivElement>(null);
  useParallax(rootRef);

  return (
    <Section id="features" background="surface">
      <div ref={rootRef} className={styles.root}>
        {/* Aurora 제거: 폰 목업이 주인공인 섹션이라 배경은 조용하게(흰 surface).
            warm Aurora의 골드 blob이 폰 주변을 노랗게 물들여 '테두리 두꺼움'으로 보이던 근본 원인. */}
        <SectionDoodles set="butter" />

        <div className={styles.content}>
          <Reveal>
            <header className={styles.head}>
              <span className={styles.kicker}>핵심 기능</span>
              <h2 className={`t-headline-lg ${styles.heading}`}>
                반려생활에 꼭 필요한 두 가지
              </h2>
              <p className={`t-body-lg ${styles.lead}`}>
                내 주변 펫 시설을 찾고, 그 자리에서 AI에게 건강·법률을 물어보세요.
              </p>
            </header>
          </Reveal>

          <div className={styles.rows}>
            {FEATURES.map((item, index) => (
              <FeatureRow key={item.key} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
