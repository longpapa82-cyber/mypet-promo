// ════════════════════════════════════════════════════════════════
// build-near.mjs — facilities-snapshot.json → 지역(near) 정적 SEO 페이지
// ────────────────────────────────────────────────────────────────
// 순수 Node ESM · 네트워크 0 · 의존성 0.
// 생성물:
//   dist/near/index.html                          (허브: 시/도 목록)
//   dist/near/<sido>/index.html                   (시/도: 구·카테고리 매트릭스)
//   dist/near/<sido>/<sigungu>/<category>.html    (핵심 롱테일 랜딩)
//
// 링크 규칙(design C1): 디렉토리형=trailing slash, 글/랜딩=.html.
// 임계치: 조합 시설 수 >= MIN_FACILITIES_PER_PAGE(=3) 만 생성(thin content 방지).
// store(용품점)은 데이터 0건 → CAT_KO에 없으면 스킵.
// ════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MIN_FACILITIES_PER_PAGE } from './lib/region-map.mjs';
import { renderPage } from './lib/page-shell.mjs';
import { buildHead, escapeHtml, itemList, breadcrumb } from './lib/seo.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_PATH = path.join(WEB_ROOT, 'content', 'facilities-snapshot.json');
const OUT_ROOT = path.join(WEB_ROOT, 'dist', 'near');

// 카테고리 라벨 맵 — 여기 없는 카테고리(store 등)는 랜딩 생성에서 스킵.
const CAT_KO = Object.freeze({
  hospital: '동물병원',
  grooming: '미용실',
  hotel: '호텔',
});

// 카테고리별 이용 안내(콘텐츠 밀도 보강 — thin content 방지).
// 시설 목록(고유 콘텐츠) 아래에 배치해 페이지의 최소 유용성을 확보한다.
// 사실·안전 원칙: 일반적 준비 안내에 한정, 진단·법률 단정 금지.
const CAT_GUIDE = Object.freeze({
  hospital: `<section class="cat-guide" aria-labelledby="guide-h">
  <h2 id="guide-h" class="related__title">동물병원 방문 전 알아두면 좋은 점</h2>
  <p>처음 방문하는 동물병원이라면 반려동물의 예방접종 기록과 최근 건강 상태를 미리 정리해 두면 진료가 한결 수월합니다. 접종 수첩이나 이전 병원의 진료 기록이 있다면 함께 지참하는 것이 좋습니다. 증상이 있다면 언제부터, 어떤 양상으로 나타났는지 구체적으로 메모해 두면 수의사가 상태를 파악하는 데 도움이 됩니다.</p>
  <p>야간이나 휴일에 갑작스러운 응급 상황이 생길 수 있으므로, 평소 24시간 진료가 가능한 인근 병원을 미리 확인해 두는 것을 권합니다. 병원마다 진료 과목과 가능한 처치 범위가 다를 수 있어, 방문 전 전화로 진료 가능 여부를 확인하면 헛걸음을 줄일 수 있습니다.</p>
</section>`,
  grooming: `<section class="cat-guide" aria-labelledby="guide-h">
  <h2 id="guide-h" class="related__title">펫 미용실 선택 시 확인할 점</h2>
  <p>반려동물 미용실은 견종·묘종과 털 상태에 따라 가능한 미용 범위가 다릅니다. 처음 방문한다면 원하는 미용 스타일과 우리 아이의 성향(낯가림, 예민한 부위 등)을 미리 전화로 상담하면 당일 진행이 수월합니다. 대형견이나 특수 미용이 필요한 경우 별도 예약이 필요할 수 있습니다.</p>
  <p>미용 전 예방접종 여부를 요구하는 곳이 많으므로 접종 기록을 확인해 두는 것이 좋습니다. 위생과 도구 관리 상태, 미용 중 반려동물을 다루는 방식 등을 미리 살펴보면 안심하고 맡길 수 있습니다.</p>
</section>`,
  hotel: `<section class="cat-guide" aria-labelledby="guide-h">
  <h2 id="guide-h" class="related__title">펫 호텔 이용 전 준비사항</h2>
  <p>펫 호텔에 반려동물을 맡길 때는 대부분 예방접종 증명을 요구하므로 접종 기록을 미리 확인하세요. 평소 먹는 사료와 좋아하는 장난감, 익숙한 담요 등을 함께 보내면 낯선 환경에서의 스트레스를 줄이는 데 도움이 됩니다.</p>
  <p>입실 전 반려동물의 건강 상태와 특이사항(알레르기, 복용 중인 약, 분리불안 등)을 상세히 전달하는 것이 중요합니다. 케이지 크기, 산책·놀이 시간, 보호자 연락 방식, 응급 시 대응 절차 등을 미리 확인해 두면 안심하고 맡길 수 있습니다.</p>
</section>`,
});

// 인접 링크 최대 개수(같은 sigungu 다른 category / 같은 sido 다른 sigungu).
const MAX_NEARBY_SIGUNGU = 5;
// 시설 리스트 최대 표시(초과 시 "앱에서 전체 보기").
const MAX_FACILITIES_SHOWN = 30;

// ── URL 헬퍼(링크 계약) ─────────────────────────────────────────
const nearHubUrl = () => '/near/';
const nearSidoUrl = (sido) => `/near/${sido}/`;
const nearSigunguUrl = (sido, sigungu) => `/near/${sido}/${sigungu}/`;
const nearLandingUrl = (sido, sigungu, category) =>
  `/near/${sido}/${sigungu}/${category}.html`;

// ── 전화 포맷: 하이픈 없는 숫자문자열 방어(있으면 그대로 tel:). ──
function telHref(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/[^\d+]/g, '');
  return digits.length >= 7 ? digits : null;
}

// ════════════════════════════════════════════════════════════════
// 데이터 로드 + 그룹핑
// ════════════════════════════════════════════════════════════════
function loadSnapshot() {
  const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
  const snap = JSON.parse(raw);
  if (!snap || !Array.isArray(snap.facilities)) {
    throw new Error('facilities-snapshot.json: facilities 배열 없음');
  }
  return snap;
}

// 구조: Map<sido, { sidoKo, sigungus: Map<sigungu, { sigunguKo, cats: Map<category, facilities[]> }> }>
function groupFacilities(facilities) {
  const bySido = new Map();
  for (const f of facilities) {
    if (!f || !f.sido || !f.sigungu || !f.category) continue;
    if (!(f.category in CAT_KO)) continue; // 라벨 없는 카테고리(store) 제외

    if (!bySido.has(f.sido)) {
      bySido.set(f.sido, { sidoKo: f.sidoKo || f.sido, sigungus: new Map() });
    }
    const sidoEntry = bySido.get(f.sido);

    if (!sidoEntry.sigungus.has(f.sigungu)) {
      sidoEntry.sigungus.set(f.sigungu, {
        sigunguKo: f.sigunguKo || f.sigungu,
        cats: new Map(),
      });
    }
    const sgEntry = sidoEntry.sigungus.get(f.sigungu);

    if (!sgEntry.cats.has(f.category)) sgEntry.cats.set(f.category, []);
    sgEntry.cats.get(f.category).push(f);
  }
  return bySido;
}

// ════════════════════════════════════════════════════════════════
// 본문 조각 렌더러
// ════════════════════════════════════════════════════════════════

// 지역 랜딩: 시설 리스트
function renderFacilityList(facilities) {
  const shown = facilities.slice(0, MAX_FACILITIES_SHOWN);
  const cards = shown
    .map((f) => {
      const name = escapeHtml(f.name);
      const address = escapeHtml(f.address || '');
      const tel = telHref(f.phone);
      const catKo = CAT_KO[f.category] || '';
      const phoneRow = tel
        ? `<div class="facility-card__row">
        <span class="facility-card__label">전화</span>
        <a class="facility-card__phone" href="tel:${escapeHtml(tel)}">${escapeHtml(f.phone)}</a>
      </div>`
        : '';
      const addrRow = address
        ? `<div class="facility-card__row">
        <span class="facility-card__label">주소</span>
        <span>${address}</span>
      </div>`
        : '';
      return `<li class="facility-card">
      <div class="facility-card__head">
        <strong class="facility-card__name">${name}</strong>
        <span class="facility-card__badge">${escapeHtml(catKo)}</span>
      </div>
      ${addrRow}
      ${phoneRow}
    </li>`;
    })
    .join('\n');
  return `<ul class="facility-list">\n${cards}\n</ul>`;
}

// 인접 링크: 같은 sigungu 다른 category + 같은 sido 다른 sigungu(같은 category)
function renderRelated({ sido, sidoKo, sigungu, sigunguKo, category, sidoEntry }) {
  const links = [];

  // 1) 같은 구, 다른 카테고리 (임계치 통과한 것만)
  const sgEntry = sidoEntry.sigungus.get(sigungu);
  for (const [cat, list] of sgEntry.cats) {
    if (cat === category) continue;
    if (list.length < MIN_FACILITIES_PER_PAGE) continue;
    links.push({
      url: nearLandingUrl(sido, sigungu, cat),
      label: `${sigunguKo} ${CAT_KO[cat]}`,
    });
  }

  // 2) 같은 시/도, 다른 구, 같은 카테고리 (임계치 통과, 최대 MAX_NEARBY_SIGUNGU)
  let added = 0;
  for (const [sg, entry] of sidoEntry.sigungus) {
    if (sg === sigungu) continue;
    const list = entry.cats.get(category);
    if (!list || list.length < MIN_FACILITIES_PER_PAGE) continue;
    links.push({
      url: nearLandingUrl(sido, sg, category),
      label: `${sidoKo} ${entry.sigunguKo} ${CAT_KO[category]}`,
    });
    if (++added >= MAX_NEARBY_SIGUNGU) break;
  }

  if (links.length === 0) return '';
  const items = links
    .map(
      (l) =>
        `<li><a href="${escapeHtml(l.url)}">${escapeHtml(l.label)}</a></li>`
    )
    .join('\n');
  return `<nav class="related" aria-label="주변 지역·카테고리">
  <h2 class="related__title">주변 지역 · 다른 카테고리</h2>
  <ul>\n${items}\n</ul>
</nav>`;
}

// ════════════════════════════════════════════════════════════════
// 페이지 빌더
// ════════════════════════════════════════════════════════════════

// (A) 지역 랜딩 페이지
function buildLanding({ sido, sidoKo, sigungu, sigunguKo, category, facilities, sidoEntry }) {
  const catKo = CAT_KO[category];
  const url = nearLandingUrl(sido, sigungu, category);
  const total = facilities.length;
  const title = `${sigunguKo} ${catKo} 찾기 | MyPet`;
  const description = `${sidoKo} ${sigunguKo}의 ${catKo} ${total}곳을 한눈에. 상호·주소·전화 정보와 함께 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.`;

  const trail = [
    { name: '홈', url: '/' },
    { name: '지역', url: nearHubUrl() },
    { name: sidoKo, url: nearSidoUrl(sido) },
    { name: sigunguKo, url: nearSigunguUrl(sido, sigungu) },
    { name: catKo },
  ];

  const head = buildHead({
    title,
    description,
    canonical: url,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        itemList({
          name: `${sigunguKo} ${catKo}`,
          url,
          items: facilities.map((f) => ({ name: f.name })),
        }),
        breadcrumb(trail),
      ],
    },
  });

  const shownCount = Math.min(total, MAX_FACILITIES_SHOWN);
  const summaryExtra =
    total > MAX_FACILITIES_SHOWN
      ? ` (아래는 <strong>${shownCount}곳</strong>, 전체는 MyPet 앱에서)`
      : '';

  const bodyHtml = `<article class="article">
  <header class="article__header">
    <span class="article__eyebrow">${escapeHtml(sidoKo)} · ${escapeHtml(catKo)}</span>
    <h1>${escapeHtml(`${sigunguKo} ${catKo} 찾기`)}</h1>
  </header>
  <p>${escapeHtml(sidoKo)} ${escapeHtml(sigunguKo)}에서 이용할 수 있는 <strong>${escapeHtml(catKo)}</strong> 정보를 모았습니다. 아래 목록의 상호·주소·전화로 바로 연락할 수 있으며, 지도·거리·운영시간 등 자세한 정보는 MyPet 앱에서 확인할 수 있습니다.</p>
  <p class="facility-summary"><strong>${escapeHtml(sigunguKo)} ${escapeHtml(catKo)} ${total}곳</strong>${summaryExtra}</p>
  ${renderFacilityList(facilities)}
  <p class="facility-summary">운영시간·지도·거리는 시설 사정에 따라 달라질 수 있습니다. 최신 정보는 <strong>MyPet 앱</strong>에서 확인하세요.</p>
  ${CAT_GUIDE[category] || ''}
  ${renderRelated({ sido, sidoKo, sigungu, sigunguKo, category, sidoEntry })}
</article>`;

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText: `${sigunguKo}의 반려동물 시설을 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.`,
  });
}

// (A2) 시군구 index — 한 구의 카테고리별 리프로 연결하는 허브.
//   크롤 경로 보강(시도 index → 시군구 index → 카테고리 리프) + 로컬 유입.
//   thin content 방지: 임계치 통과 카테고리 카드 + 지역·카테고리 요약 문단.
function buildSigunguIndex({ sido, sidoKo, sigungu, sigunguKo, sgEntry }) {
  const url = nearSigunguUrl(sido, sigungu);

  // 임계치 통과 카테고리만 카드로(리프가 실제 존재하는 것).
  const passing = [];
  for (const cat of Object.keys(CAT_KO)) {
    const list = sgEntry.cats.get(cat);
    if (!list || list.length < MIN_FACILITIES_PER_PAGE) continue;
    passing.push({ cat, count: list.length });
  }

  // 자기완결 가드: 통과 카테고리가 없으면 빈/얇은 페이지를 만들지 않고 null 반환.
  //   (호출부의 sigunguLeafCount 가드와 별개로 이 함수 자체가 전제를 검증한다.)
  if (passing.length === 0) return null;

  const catNames = passing.map((p) => CAT_KO[p.cat]).join('·');
  const title = `${sigunguKo} 반려동물 시설 (${catNames}) | MyPet`;
  const description = `${sidoKo} ${sigunguKo}의 ${catNames} 정보를 한 곳에. 상호·주소·전화와 함께 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.`;

  const trail = [
    { name: '홈', url: '/' },
    { name: '지역', url: nearHubUrl() },
    { name: sidoKo, url: nearSidoUrl(sido) },
    { name: sigunguKo },
  ];

  const head = buildHead({
    title,
    description,
    canonical: url,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', name: title, url: `https://with-my-pet.com${url}` },
        breadcrumb(trail),
      ],
    },
  });

  const cards = passing
    .map(
      ({ cat, count }) => `<li class="post-card post-card--compact">
      <a class="post-card__body" href="${escapeHtml(nearLandingUrl(sido, sigungu, cat))}" style="text-decoration:none">
        <span class="post-card__eyebrow">${escapeHtml(sigunguKo)}</span>
        <h2 class="post-card__title">${escapeHtml(CAT_KO[cat])}</h2>
        <p class="post-card__excerpt">${escapeHtml(sigunguKo)} ${escapeHtml(CAT_KO[cat])} ${count}곳</p>
      </a>
    </li>`
    )
    .join('\n');

  const bodyHtml = `<div class="section-head">
    <h1>${escapeHtml(sigunguKo)} 반려동물 시설 찾기</h1>
    <p>${escapeHtml(sidoKo)} ${escapeHtml(sigunguKo)}에서 이용할 수 있는 ${escapeHtml(catNames)}을(를) 카테고리별로 모았습니다. 원하는 시설을 선택해 상호·주소·전화를 확인하고, 지도·거리·운영시간은 MyPet 앱에서 살펴보세요.</p>
  </div>
  <ul class="post-grid">
${cards}
  </ul>`;

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText: `${sigunguKo}의 반려동물 시설을 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.`,
  });
}

// (B) 시/도 index — 구 × 카테고리 매트릭스
function buildSidoIndex({ sido, sidoEntry, generated }) {
  const sidoKo = sidoEntry.sidoKo;
  const url = nearSidoUrl(sido);
  const title = `${sidoKo} 반려동물 시설 찾기 | MyPet`;
  const description = `${sidoKo}의 구별 동물병원·미용실·호텔 정보를 지역별로 모았습니다. 우리 동네 반려동물 시설을 MyPet에서 찾아보세요.`;

  const trail = [
    { name: '홈', url: '/' },
    { name: '지역', url: nearHubUrl() },
    { name: sidoKo },
  ];

  const head = buildHead({
    title,
    description,
    canonical: url,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', name: title, url: `https://with-my-pet.com${url}` },
        breadcrumb(trail),
      ],
    },
  });

  // 각 구: 임계치 통과한 카테고리 링크를 카드로.
  const cards = [];
  // 구 이름 정렬(한글 로케일)
  const sigunguSorted = [...sidoEntry.sigungus.entries()].sort((a, b) =>
    a[1].sigunguKo.localeCompare(b[1].sigunguKo, 'ko')
  );
  for (const [sg, entry] of sigunguSorted) {
    const catLinks = [];
    for (const cat of Object.keys(CAT_KO)) {
      const list = entry.cats.get(cat);
      if (!list || list.length < MIN_FACILITIES_PER_PAGE) continue;
      catLinks.push(
        `<a href="${escapeHtml(nearLandingUrl(sido, sg, cat))}">${escapeHtml(CAT_KO[cat])} (${list.length})</a>`
      );
    }
    if (catLinks.length === 0) continue; // 이 구에 임계치 통과 카테고리 없음
    // 구 제목은 시군구 index로 링크(크롤 허브) + 카테고리 리프 직접 링크 병행.
    cards.push(`<li class="post-card post-card--compact">
      <div class="post-card__body">
        <span class="post-card__eyebrow">${escapeHtml(sidoKo)}</span>
        <h2 class="post-card__title"><a href="${escapeHtml(nearSigunguUrl(sido, sg))}">${escapeHtml(entry.sigunguKo)}</a></h2>
        <div class="post-card__meta">${catLinks.join(' · ')}</div>
      </div>
    </li>`);
  }

  const bodyHtml = `<div class="section-head">
    <h1>${escapeHtml(sidoKo)} 반려동물 시설 찾기</h1>
    <p>${escapeHtml(sidoKo)}의 구별 동물병원·미용실·호텔을 지역별로 모았습니다.</p>
  </div>
  <ul class="post-grid">
${cards.join('\n')}
  </ul>`;

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText: `${sidoKo}의 반려동물 시설을 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.`,
  });
}

// (C) 허브 index — 시/도 목록
function buildHub({ sidos }) {
  const url = nearHubUrl();
  const title = '지역별 반려동물 시설 찾기 | MyPet';
  const description =
    '전국 지역별 동물병원·미용실·호텔 등 반려동물 시설 정보를 지역별로 모았습니다. 우리 동네 반려동물 시설을 MyPet에서 찾아보세요.';

  const trail = [
    { name: '홈', url: '/' },
    { name: '지역' },
  ];

  const head = buildHead({
    title,
    description,
    canonical: url,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', name: title, url: `https://with-my-pet.com${url}` },
        breadcrumb(trail),
      ],
    },
  });

  const cards = sidos
    .map(
      ({ sido, sidoKo, count }) => `<li class="post-card post-card--compact">
      <a class="post-card__body" href="${escapeHtml(nearSidoUrl(sido))}" style="text-decoration:none">
        <span class="post-card__eyebrow">지역</span>
        <h2 class="post-card__title">${escapeHtml(sidoKo)}</h2>
        <p class="post-card__excerpt">${escapeHtml(sidoKo)}의 반려동물 시설 페이지 ${count}곳</p>
      </a>
    </li>`
    )
    .join('\n');

  const bodyHtml = `<div class="section-head">
    <h1>지역별 반려동물 시설 찾기</h1>
    <p>지역을 선택해 우리 동네 동물병원·미용실·호텔을 찾아보세요.</p>
  </div>
  <ul class="post-grid">
${cards}
  </ul>`;

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText:
      '전국 반려동물 시설을 MyPet 앱에서 지도·거리·운영시간까지 확인하세요.',
  });
}

// ── 파일 쓰기 유틸 ──────────────────────────────────────────────
function writeFile(absPath, html) {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, html, 'utf8');
}

// ════════════════════════════════════════════════════════════════
// 메인
// ════════════════════════════════════════════════════════════════
function main() {
  const snap = loadSnapshot();
  const bySido = groupFacilities(snap.facilities);

  let generated = 0;
  let skipped = 0;
  let sigunguIndexCount = 0;

  // 시/도 정렬(한글)
  const sidoSorted = [...bySido.entries()].sort((a, b) =>
    a[1].sidoKo.localeCompare(b[1].sidoKo, 'ko')
  );

  const hubSidos = [];

  for (const [sido, sidoEntry] of sidoSorted) {
    let sidoLandingCount = 0;

    for (const [sigungu, sgEntry] of sidoEntry.sigungus) {
      let sigunguLeafCount = 0;
      for (const [category, facilities] of sgEntry.cats) {
        if (facilities.length < MIN_FACILITIES_PER_PAGE) {
          skipped++;
          continue;
        }
        const html = buildLanding({
          sido,
          sidoKo: sidoEntry.sidoKo,
          sigungu,
          sigunguKo: sgEntry.sigunguKo,
          category,
          facilities,
          sidoEntry,
        });
        const outPath = path.join(OUT_ROOT, sido, sigungu, `${category}.html`);
        writeFile(outPath, html);
        generated++;
        sidoLandingCount++;
        sigunguLeafCount++;
      }

      // 시군구 index — 이 구에 리프가 하나라도 있을 때만(thin content 방지).
      //   buildSigunguIndex 가 자체 가드로 null 을 반환할 수 있으므로 그때는 스킵.
      if (sigunguLeafCount > 0) {
        const sgHtml = buildSigunguIndex({
          sido,
          sidoKo: sidoEntry.sidoKo,
          sigungu,
          sigunguKo: sgEntry.sigunguKo,
          sgEntry,
        });
        if (sgHtml) {
          writeFile(path.join(OUT_ROOT, sido, sigungu, 'index.html'), sgHtml);
          sigunguIndexCount++;
        }
      }
    }

    // 시/도 index — 랜딩이 하나라도 있을 때만.
    if (sidoLandingCount > 0) {
      const sidoHtml = buildSidoIndex({ sido, sidoEntry, generated });
      writeFile(path.join(OUT_ROOT, sido, 'index.html'), sidoHtml);
      hubSidos.push({ sido, sidoKo: sidoEntry.sidoKo, count: sidoLandingCount });
    }
  }

  // 허브 index
  const hubHtml = buildHub({ sidos: hubSidos });
  writeFile(path.join(OUT_ROOT, 'index.html'), hubHtml);

  console.log(
    `[build-near] 생성 ${generated}개 랜딩 + ${sigunguIndexCount}개 시군구 index + ${hubSidos.length}개 시/도 index + 1개 허브. 임계치 미달 스킵 ${skipped}개.`
  );
  console.log(
    `[build-near] 대상 시/도: ${hubSidos.map((s) => `${s.sidoKo}(${s.count})`).join(', ')}`
  );
}

main();
