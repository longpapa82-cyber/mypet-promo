import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import StoreCTA from '../components/ui/StoreCTA';
import Aurora from '../components/ui/Aurora';
import DuotonePhoto from '../components/ui/DuotonePhoto';
import Doodle from '../components/ui/Doodle';
import styles from './FinalCTA.module.css';

const MASCOT_WEBP = `${import.meta.env.BASE_URL}assets/mascot-duo.webp`;
const MASCOT_PNG = `${import.meta.env.BASE_URL}assets/mascot-duo.png`;

// 별(star) 아이콘 — jewel 다크 위 gold 메탈릭 포인트 (텍스트 아님, 아이콘만)
function SparkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.5l2.78 5.63 6.22.9-4.5 4.39 1.06 6.18L12 16.68 6.44 19.6 7.5 13.42 3 9.03l6.22-.9L12 2.5z"
        fill="var(--accent)"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 최종 CTA 섹션 — jewel 다크 그라운드 + Aurora(jewel/mixed) 메시 분위기 + 글래스 CTA 박스.
// 오버사이즈 헤드라인("지금 MyPet과 시작하세요") + 작은 마스코트(골드 링) + StoreCTA.
// 골드 메탈릭은 jewel 위 보더/구분선/아이콘으로만(텍스트 금지). 주 CTA는 StoreCTA 내부 규칙 따름.
export default function FinalCTA() {
  return (
    <Section id="download" background="cream">
      {/* 실사 펫 배경(듀오톤) — 밝은 크림 위 감성 깊이. 글래스 박스가 텍스트 가독 담당. */}
      <DuotonePhoto
        name="hero-home"
        className={styles.photoBg}
        intensity={0.5}
        scrimDir="none"
        decorative
      />
      {/* 크림 위 Aurora 메시 — 따뜻한 골드/크림 blob으로 깊이감 부여 */}
      <Aurora variant="champagne" className={styles.aurora} />

      <Reveal>
        <div className={styles.inner}>
          {/* 글래스 CTA 박스 — 밝은 크림 글래스 + 골드 헤어라인 */}
          <div className={`glass ${styles.glassBox}`}>
            {/* 깜찍 도들 — 절제 2개(골드 별·라벤더 발자국). 박스 상/하 모서리, 텍스트 비가림. */}
            <Doodle kind="star" size={24} color="var(--champagne)" className={`${styles.cuteStar} cute-float`} />
            <Doodle kind="paw" size={26} color="var(--cute-lav)" className={`${styles.cutePaw} cute-float`} />

            {/* 마스코트: 작게, 골드 링으로 분리 + 둥실 통통 */}
            <figure className={`${styles.mascotWrap} cute-float`}>
              <span className={styles.mascotRing} aria-hidden="true" />
              <picture>
                <source srcSet={MASCOT_WEBP} type="image/webp" />
                <img
                  className={styles.mascot}
                  src={MASCOT_PNG}
                  width={768}
                  height={535}
                  alt="MyPet 마스코트 강아지와 고양이"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>

            <span className={styles.eyebrow}>
              <SparkIcon />
              <span className="t-label-md">반려동물의 더 나은 하루</span>
            </span>

            <h2 className={`${styles.heading} t-display-lg`}>지금 MyPet과 시작하세요</h2>

            {/* 골드 메탈릭 구분선 (jewel 위 — 텍스트 아님) */}
            <hr className={`gold-divider ${styles.divider}`} aria-hidden="true" />

            <p className={`${styles.subcopy} t-body-lg`}>
              내 주변 펫 시설 검색부터 AI 건강·법률 상담까지. 앱을 설치하고 반려동물의 일상을 더
              편하게 돌보세요.
            </p>

            <StoreCTA className={styles.store} align="center" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
