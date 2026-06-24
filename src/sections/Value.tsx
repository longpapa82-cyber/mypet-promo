import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Aurora from '../components/ui/Aurora';
import SectionDoodles from '../components/ui/SectionDoodles';
import CategoryIcon from '../components/ui/CategoryIcon';
import CountUp from '../components/ui/CountUp';
import DuotonePhoto from '../components/ui/DuotonePhoto';
import { asset } from '../constants/stores';
import styles from './Value.module.css';

// 핵심 가치 — 베이토(bento) 그리드 재구성.
// 크기 다른 4셀: ① 펫 시설검색(큰 셀, 지도 느낌+거리 배지, 스카이) ② AI 상담(말풍선, 민트)
// ③ 카테고리 칩 클러스터(10종) ④ 통계("전국 3만+"). 모바일 세로 스택 → 768 2열 → 1024 베이토.
// 토큰 변수만 사용(theme.ts 단일소스). 연두 버튼배경/골드 텍스트 금지.

// 지도 핀 — 스카이(secondary) 톤 라인 아이콘
function PinIcon() {
  return (
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
      <path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

// 말풍선 — 민트(tertiary) 톤 라인 아이콘
function ChatIcon() {
  return (
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
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5Z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </svg>
  );
}

interface NearbyItem {
  name: string;
  category: string;
  distance: string;
}

// 시설검색 카드 미니 결과 목록 (실제 앱 거리순 결과 예시)
const NEARBY: readonly NearbyItem[] = [
  { name: '행복한 동물병원', category: '동물병원', distance: '55m' },
  { name: '멍냥 미용실', category: '미용실', distance: '320m' },
  { name: '포근 펫호텔', category: '호텔', distance: '1.3km' },
  { name: '튼튼 훈련소', category: '훈련소', distance: '2.1km' },
] as const;

// 카테고리 8종
// ⚠️표시광고 정직성: 실제 노출(verified·영업중) 데이터가 있는 카테고리만 광고한다.
// DB 조회(2026-06-20): 미용실9531·용품점7878·동물병원6333·호텔5304·공원844·유치원411·훈련소100·식당79.
// v7.1: 이모지 → 통일된 디자인 SVG 아이콘(CategoryIcon) — '목업/기본' 느낌 제거.
const CATEGORIES: readonly { name: string; icon: string }[] = [
  { name: '동물병원', icon: 'hospital' },
  { name: '미용실', icon: 'grooming' },
  { name: '호텔', icon: 'hotel' },
  { name: '용품점', icon: 'store' },
  { name: '유치원', icon: 'daycare' },
  { name: '훈련소', icon: 'training' },
  { name: '공원', icon: 'park' },
  { name: '식당', icon: 'restaurant' },
] as const;

export default function Value() {
  return (
    <Section id="services" background="creamAlt" className={styles.section}>
      {/* v7: 따뜻한 크림/골드 Aurora(다색 폐기, 통일). */}
      <Aurora variant="cream" className={styles.aurora} />

      <SectionDoodles set="sky" />

      <div className={styles.content}>
        <Reveal>
          <header className={styles.head}>
            <span className={styles.eyebrow}>두 가지 핵심 서비스</span>
            <h2 className={`${styles.title} t-headline-lg`}>
              <span className={styles.accentWord}>찾고, 묻고.</span><br />반려 생활의 두 축
            </h2>
          </header>
        </Reveal>

        <div className={styles.bento}>
          {/* ① 펫 시설검색 — 큰 셀, 지도 느낌 + 거리 배지 (스카이 액센트) */}
          <Reveal bounce className={styles.cellFacility}>
            <article className={`${styles.card} ${styles.facility}`}>
              <div className={styles.cardHead}>
                <span className={`${styles.iconWrap} ${styles.iconSky}`}>
                  <PinIcon />
                </span>
                <div>
                  <h3 className={`${styles.cardTitle} t-headline-md`}>내 주변 펫 시설</h3>
                  <p className={`${styles.cardDesc} t-body-md`}>
                    현재 위치에서 <strong>가까운 순서</strong>로 한눈에
                  </p>
                </div>
              </div>

              {/* v7.1: 가짜 CSS 지도 폐기 → 실제 앱 지도화면 스크린샷(shot-map). 폰 베젤 액자에
                  담아 '진짜 작동하는 위치검색 앱'으로 읽히게. 옆에 거리 결과 배지로 보강. */}
              <div className={styles.shotPanel}>
                <div className={styles.shotPhone}>
                  <picture>
                    <source srcSet={asset('assets/shot-map.webp')} type="image/webp" />
                    <img
                      className={styles.shotImg}
                      src={asset('assets/shot-map.png')}
                      alt="MyPet 앱 내 주변 펫 시설 지도 화면"
                      width={300}
                      height={626}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                <ul className={styles.nearbyList}>
                  {NEARBY.map((item) => (
                    <li key={item.name} className={styles.nearbyItem}>
                      <span className={styles.nearbyDot} aria-hidden="true" />
                      <span className={styles.nearbyName}>{item.name}</span>
                      <span className={styles.nearbyCat}>{item.category}</span>
                      <span className={styles.distanceBadge}>{item.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          {/* ② AI 상담 — jewel 다크 카드 + 풀블리드 고양이 화보(크림 카드들과 극적 대비). */}
          <Reveal bounce className={styles.cellAi} delay={90}>
            <article className={`${styles.card} ${styles.ai} ${styles.cardDark}`}>
              {/* 카드 안을 꽉 채우는 듀오톤 강아지 화보(미사용 hero-profile, 타 섹션 중복 없음). */}
              <DuotonePhoto
                name="hero-profile"
                decorative
                intensity={0.7}
                scrimDir="bottom"
                position="50% 45%"
                className={styles.cardPhoto}
              />
              {/* 헤더 그룹 — 텍스트 뒤 백플레이트(국소 어둠)로 사진 밝은 영역 위에서도 또렷. */}
              <div className={styles.darkHeadGroup}>
                <div className={styles.cardHead}>
                  <span className={`${styles.iconWrap} ${styles.iconOnDark}`}>
                    <ChatIcon />
                  </span>
                  <h3 className={`${styles.cardTitle} ${styles.titleOnDark} t-headline-md`}>AI 펫 상담</h3>
                </div>
                <p className={`${styles.cardDesc} ${styles.descOnDark} t-body-md`}>
                  건강·법률 궁금증을 <strong>바로 질문</strong>
                </p>
              </div>

              {/* 말풍선 대화 미리보기 — 실제 상담 흐름(밀도↑, 휑함 제거) */}
              <div className={styles.bubbles} aria-hidden="true">
                <span className={`${styles.bubble} ${styles.bubbleUser}`}>
                  우리 강아지가 오늘 기운이 없어요
                </span>
                <span className={`${styles.bubble} ${styles.bubbleAi}`}>
                  잇몸 색·물 섭취량을 먼저 확인해 보세요 🐾
                </span>
                <span className={`${styles.bubble} ${styles.bubbleUser}`}>
                  분양 계약 파기하면 환불되나요?
                </span>
                <span className={`${styles.bubble} ${styles.bubbleAi}`}>
                  계약 조건과 동물보호법 기준을 함께 알려드릴게요 ⚖️
                </span>
              </div>

              <p className={`${styles.disclaimer} ${styles.disclaimerOnDark}`}>
                ※ 참고용 정보 · 진단 아님
              </p>
            </article>
          </Reveal>

          {/* ③ 카테고리 칩 클러스터 — 10종 */}
          <Reveal bounce className={styles.cellCategories} delay={150}>
            <article className={`${styles.card} ${styles.categories}`}>
              <h3 className={`${styles.cardTitle} t-headline-md`}>다양한 카테고리</h3>
              <p className={`${styles.cardDesc} t-body-md`}>
                필요한 곳을 한 곳에서 <span className={styles.muted}>· 계속 확대 중</span>
              </p>
              <ul className={styles.chips}>
                {CATEGORIES.map((c) => (
                  <li key={c.name} className={styles.chip}>
                    <span className={styles.chipIcon} aria-hidden="true">
                      <CategoryIcon kind={c.icon} className={styles.chipSvg} />
                    </span>
                    {c.name}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          {/* ④ 통계 — 주지표(3만+) + 보조지표(카테고리·전국)로 밀도 확보(M4).
              숫자 하나만 덩그러니 → 신뢰 지표 묶음 = 운영 사이트 느낌. 법무: 실측치만 표기. */}
          <Reveal bounce className={styles.cellStat} delay={210}>
            <article className={`${styles.card} ${styles.stat} ${styles.cardDark}`}>
              {/* 풀블리드 강아지 화보(꽃밭 골든 2마리 — "3만+" 골드 넘버 뒤 따뜻한 풍성함). */}
              <DuotonePhoto
                name="hero-home"
                decorative
                intensity={0.66}
                scrimDir="none"
                position="50% 40%"
                className={styles.cardPhoto}
              />
              <div className={styles.statMain}>
                <CountUp to={3} suffix="만+" duration={1400} className={`${styles.statNumber} t-display-lg`} />
                <span className={`${styles.statLabel} t-label-md`}>등록 펫 시설</span>
              </div>
              <ul className={styles.statSubs}>
                <li className={styles.statSub}>
                  <CountUp to={8} duration={1200} className={styles.statSubNum} />
                  <span className={styles.statSubLabel}>시설 카테고리</span>
                </li>
                <li className={styles.statSub}>
                  <span className={styles.statSubNum}>전국</span>
                  <span className={styles.statSubLabel}>거리순 · 운영시간</span>
                </li>
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
