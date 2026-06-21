import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import StoreCTA from '../components/ui/StoreCTA';
import Aurora from '../components/ui/Aurora';
import SectionDoodles from '../components/ui/SectionDoodles';
import PhotoBackdrop from '../components/ui/PhotoBackdrop';
import styles from './Premium.module.css';

interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

const BENEFITS: readonly Benefit[] = [
  {
    icon: 'block',
    title: '광고 완전 제거',
    desc: '배너·전면 광고 없이 깔끔하게',
  },
  {
    icon: 'infinity',
    title: 'AI 상담 무제한*',
    desc: '건강·법률 질문을 마음껏',
  },
] as const;

// 프리미엄 단서 — "무제한*"의 공정사용 정책 부기(약관 제8조와 일치).
const FAIR_USE_NOTE =
  '* 개인 이용 범위 내 무제한이며, 서버 안정성·비용 보호를 위한 공정사용 정책이 적용됩니다.';

// 별(star) 아이콘 — gold 포인트 (jewel 위에서만)
function StarIcon() {
  return (
    <svg
      className={styles.starIcon}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.5l2.78 5.63 6.22.9-4.5 4.39 1.06 6.18L12 16.68 6.44 19.6 7.5 13.42 3 9.03l6.22-.9L12 2.5z"
        fill="var(--champagne)"
        stroke="var(--champagne-bright)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 왕관(crown) 아이콘 — 프리미엄 배지 gold 포인트 (jewel 위에서만)
function CrownIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 7.5l4.2 3.4L12 4.5l4.8 6.4L21 7.5l-1.6 11H4.6L3 7.5z"
        fill="var(--champagne)"
        stroke="var(--champagne-bright)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="3.4" r="1.5" fill="var(--champagne-bright)" />
    </svg>
  );
}

// 혜택 마커 — 광고제거(원+슬래시) / AI무제한(infinity). gold 포인트.
function BenefitGlyph({ icon }: { icon: string }) {
  if (icon === 'block') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="var(--champagne-deep)" strokeWidth="1.8" />
        <path d="M5.6 5.6l12.8 12.8" stroke="var(--champagne-deep)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  // infinity (∞)
  return (
    <svg width="24" height="22" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <path
        d="M9 12a4 4 0 110-.01M9 12c1.6 2.6 3.8 4 5 4s3.4-1.4 5-4M9 12c1.6-2.6 3.8-4 5-4s3.4 1.4 5 4M19 12a4 4 0 100-.01"
        stroke="var(--champagne-deep)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 프리미엄 섹션 — 앱 구독화면 럭셔리 톤.
// jewel 다크 그라운드 + Aurora 깊이 blob + 샴페인골드 메탈릭 보더/구분선/아이콘 +
// frosted 글래스 혜택 카드(광고제거·AI무제한) 위 흰 텍스트.
// 혜택=광고 제거 + AI 무제한, 월 구독(가격은 스토어 자동), CTA=설치 유도.
export default function Premium() {
  return (
    <Section id="premium" background="creamAlt">
      {/* v7.1: 실사 펫(강아지+고양이) 배경 — 카드 뒤 여백을 채워 단색 탈피. 카드가 실사 위에 떠 있는 구도. */}
      <PhotoBackdrop name="hero-pet" side="right" />
      <SectionDoodles set="lav" />
      <Reveal className={styles.cardWrap}>
        <article className={`${styles.card} parallax`} data-parallax="">
          {/* 종이/패브릭 그레인 텍스처(밋밋한 단색 탈피) */}
          <span className={styles.cardGrain} aria-hidden="true" />
          {/* Aurora blob 레이어(transform만, reduced-motion 정지) */}
          <Aurora variant="champagne" className={styles.aurora} />
          {/* gold 광채 — 우상단에서 은은하게 새어 나오는 빛 */}
          <div className={styles.glow} aria-hidden="true" />
          {/* 가장자리 비네팅으로 깊이 강화 */}
          <div className={styles.vignette} aria-hidden="true" />

          <header className={styles.head}>
            <span className={styles.badge}>
              <CrownIcon />
              <span className={styles.badgeText}>MyPet Premium</span>
            </span>
            <h2 className={`t-headline-lg ${styles.title}`}>
              프리미엄으로 광고 없이 <span className={styles.titleAccent}>AI 무제한*</span>
            </h2>
            <p className={`t-body-lg ${styles.lead}`}>
              광고 없이, AI 상담은 마음껏. 반려동물에게 더 집중하세요.
            </p>
          </header>

          <hr className="gold-divider" />

          <ul className={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={120 + i * 90}>
                <li className={styles.benefit}>
                  <span className={styles.benefitMark}>
                    <BenefitGlyph icon={b.icon} />
                  </span>
                  <div>
                    <h3 className={`t-headline-md ${styles.benefitTitle}`}>{b.title}</h3>
                    <p className={`t-body-md ${styles.benefitDesc}`}>{b.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className={styles.priceRow}>
            <StarIcon />
            <span className={`t-label-md ${styles.priceLabel}`}>월 구독</span>
            <span className={`t-body-md ${styles.priceNote}`}>
              월 자동 갱신 · 언제든 해지 · 가격은 스토어 안내
            </span>
          </div>

          <p className={`t-label-md ${styles.fairUse}`}>{FAIR_USE_NOTE}</p>

          <div className={styles.ctaWrap}>
            <StoreCTA align="center" />
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
