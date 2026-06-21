import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Aurora from '../components/ui/Aurora';
import SectionDoodles from '../components/ui/SectionDoodles';
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

// 시설검색 카드 미니 결과 목록 (지도 느낌 + 거리 배지)
const NEARBY: readonly NearbyItem[] = [
  { name: '행복한 동물병원', category: '동물병원', distance: '55m' },
  { name: '멍냥 미용실', category: '미용실', distance: '320m' },
  { name: '댕댕 호텔', category: '호텔', distance: '1.3km' },
] as const;

// 카테고리 10종
// ⚠️표시광고 정직성: 실제 노출(verified·영업중) 데이터가 있는 카테고리만 광고한다.
// DB 조회(2026-06-20): 미용실9531·용품점7878·동물병원6333·호텔5304·공원844·유치원411·훈련소100·식당79.
// 응급실·카페는 0건이라 제외(데이터 적재 시 다시 추가). '계속 확대 중' 카피가 미래 확장은 커버.
// F3: 카테고리별 픽토그램(이모지) — 텍스트만인 칩에 시각 단서. 아기자기+스캔성.
const CATEGORIES: readonly { name: string; icon: string }[] = [
  { name: '동물병원', icon: '🏥' },
  { name: '미용실', icon: '✂️' },
  { name: '호텔', icon: '🏨' },
  { name: '용품점', icon: '🛍️' },
  { name: '유치원', icon: '🎒' },
  { name: '훈련소', icon: '🦴' },
  { name: '공원', icon: '🌳' },
  { name: '식당', icon: '🍽️' },
] as const;

export default function Value() {
  return (
    <Section id="services" background="skySoft" className={styles.section}>
      {/* Aurora 메시 배경 — sky(시설검색=스카이) 분위기로 Hero(mixed)와 대비. 콘텐츠 뒤(z-index 0). */}
      <Aurora variant="sky" className={styles.aurora} />
      <SectionDoodles set="sky" />

      <div className={styles.content}>
        <Reveal>
          <header className={styles.head}>
            <span className={styles.eyebrow}>두 가지 핵심 서비스</span>
            <h2 className={`${styles.title} t-headline-lg`}>
              찾고, 묻고. 반려 생활의 두 축
            </h2>
            <p className={`${styles.lead} t-body-lg`}>
              가까운 펫 시설을 한눈에, 건강·법률 궁금증은 AI에게. MyPet 하나로 해결하세요.
            </p>
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

              {/* F2: CSS 지도 일러스트(격자 도로 + 현재위치/시설 핀) + 거리 배지 결과 목록.
                  강아지 사진 대신 '지도로 주변을 본다' 직관. 저작권 자유·가벼움. */}
              <div className={styles.mapPanel}>
                <div className={styles.mapCanvas} aria-hidden="true">
                  {/* 격자 도로 라인(::before·::after) + 현재 위치 펄스 + 시설 핀 3개 */}
                  <span className={styles.mapCurrent} />
                  <span className={`${styles.mapMarker} ${styles.marker1}`}>
                    <PinIcon />
                  </span>
                  <span className={`${styles.mapMarker} ${styles.marker2}`}>
                    <PinIcon />
                  </span>
                  <span className={`${styles.mapMarker} ${styles.marker3}`}>
                    <PinIcon />
                  </span>
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

          {/* ② AI 상담 — 말풍선 모티프 (민트, 글래스 액센트) */}
          <Reveal bounce className={styles.cellAi} delay={90}>
            <article className={`${styles.card} ${styles.ai} glass`}>
              <div className={styles.cardHead}>
                <span className={`${styles.iconWrap} ${styles.iconMint}`}>
                  <ChatIcon />
                </span>
                <h3 className={`${styles.cardTitle} t-headline-md`}>AI 펫 상담</h3>
              </div>
              <p className={`${styles.cardDesc} t-body-md`}>
                건강·법률 궁금증을 <strong>바로 질문</strong>
              </p>

              {/* 말풍선 대화 미리보기 */}
              <div className={styles.bubbles} aria-hidden="true">
                <span className={`${styles.bubble} ${styles.bubbleUser}`}>
                  우리 강아지가 오늘 기운이 없어요
                </span>
                <span className={`${styles.bubble} ${styles.bubbleAi}`}>
                  잇몸 색·물 섭취량을 먼저 확인해 보세요 🐾
                </span>
              </div>

              <p className={styles.disclaimer}>
                ※ AI 답변은 참고용이며 진단이 아닙니다. 정확한 진단은 전문가 상담을 권장합니다.
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
                      {c.icon}
                    </span>
                    {c.name}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          {/* ④ 통계 — "전국 3만+" (글래스 액센트) */}
          <Reveal bounce className={styles.cellStat} delay={210}>
            <article className={`${styles.card} ${styles.stat} glass`}>
              <span className={`${styles.statNumber} t-display-lg`}>3만+</span>
              <span className={`${styles.statLabel} t-label-md`}>등록 펫 시설</span>
              <p className={`${styles.statNote} t-body-md`}>
                거리순 · 운영시간 안내
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
