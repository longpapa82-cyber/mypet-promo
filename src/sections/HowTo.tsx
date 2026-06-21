import type { ReactNode } from 'react';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Aurora from '../components/ui/Aurora';
import SectionDoodles from '../components/ui/SectionDoodles';
import PhotoBackdrop from '../components/ui/PhotoBackdrop';
import styles from './HowTo.module.css';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
}

// gold 포인트 아이콘 (currentColor → --gold-deep, 흰 배경 위 대비). 24x24 viewBox.
const DownloadIcon = (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20.5h14" />
  </svg>
);

const SparkIcon = (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    <path d="M9 9 7 7M17 7l-2 2M9 15l-2 2M17 17l-2-2" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>
);

const SearchIcon = (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

const STEPS: readonly Step[] = [
  {
    number: 1,
    title: '앱 설치',
    description: 'App Store 또는 Google Play에서 MyPet을 무료로 설치하세요.',
    icon: DownloadIcon,
  },
  {
    number: 2,
    title: '간편 가입',
    description: '이메일 또는 소셜 계정(카카오·구글·애플)으로 빠르게 시작하세요.',
    icon: SparkIcon,
  },
  {
    number: 3,
    title: '내 주변 검색·AI 상담',
    description: '내 주변 펫 시설을 거리순으로 찾고, AI에게 건강·법률을 물어보세요.',
    icon: SearchIcon,
  },
];

// 이용 방법 3스텝 — 골드 번호 원형 + 스텝 연결선(애니메이션, reduced-motion 정지)
// + 깊이 그림자(shadow-raised) + 글래스 카드 hover. surface-low 배경 + mint Aurora 메시.
export default function HowTo() {
  return (
    <Section id="how-to" background="creamAlt">
      {/* v7.1: 실사 강아지 배경(단색 탈피·진짜 사이트 느낌). 좌측 사진 + 우측 크림 페이드로 텍스트 보호. */}
      <PhotoBackdrop name="hero-puppy" side="left" />
      <Aurora variant="cream" />
      <SectionDoodles set="mint" />

      <div className={styles.inner}>
        <Reveal>
          <header className={styles.header}>
            <p className={styles.eyebrow}>How To</p>
            <h2 className="t-headline-lg" style={{ color: 'var(--ink)' }}>
              세 단계면 충분해요
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--ink-soft)' }}>
              설치부터 첫 검색·상담까지, 1분이면 시작할 수 있어요.
            </p>
          </header>
        </Reveal>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 120} bounce className={styles.stepReveal}>
              <li className={`glass ${styles.step}`}>
                <span className={styles.badge} aria-hidden="true">
                  <span className={styles.badgeRing} />
                  <span className={styles.badgeNum}>{step.number}</span>
                </span>
                <span className={styles.iconWrap} aria-hidden="true">
                  {step.icon}
                </span>
                <h3 className="t-headline-md" style={{ color: 'var(--ink)' }}>
                  {step.title}
                </h3>
                <p className="t-body-md" style={{ color: 'var(--ink-soft)' }}>
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
