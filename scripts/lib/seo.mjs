// ════════════════════════════════════════════════════════════════
// seo.mjs — 정적 페이지 <head> 메타 + JSON-LD 생성 (순수 Node ESM)
// ────────────────────────────────────────────────────────────────
// 네트워크 0 · 의존성 0. buildHead()는 <head> "안쪽" 문자열만 반환하고,
// <head>/</head> 태그 및 <html> 셸은 page-shell.mjs가 감싼다.
//
// 링크 규칙(design C1): canonical/og:url 은 항상 절대 URL(SITE_ORIGIN + 경로).
// 디렉토리형은 trailing slash('/blog/'), 글/랜딩은 '.html'. 호출자가 경로를
// 규칙대로 넘긴다(여기선 그대로 붙임).
// ════════════════════════════════════════════════════════════════

export const SITE_ORIGIN = 'https://with-my-pet.com';

// ── HTML 이스케이프 ──────────────────────────────────────────────
// &<>"' 5종. & 를 가장 먼저 치환(이중 이스케이프 방지).
export function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// canonical 등 경로를 절대 URL로 정규화. 이미 http(s)면 그대로.
function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_ORIGIN + '/';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : '/' + pathOrUrl;
  return SITE_ORIGIN + path;
}

// ── buildHead ────────────────────────────────────────────────────
// <head> 안쪽 문자열을 생성한다.
export function buildHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/assets/hero-pet.jpg',
  jsonLd,
} = {}) {
  const canonicalUrl = toAbsoluteUrl(canonical);
  const imageUrl = toAbsoluteUrl(ogImage);
  const t = escapeHtml(title);
  const d = escapeHtml(description);

  const lines = [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    '<meta name="robots" content="index,follow" />',
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    // Open Graph
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    '<meta property="og:locale" content="ko_KR" />',
    // Twitter
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    // 스타일: tokens.css → blog.css 순서(폴백은 blog.css 안에서 처리)
    '<link rel="stylesheet" href="/tokens.css" />',
    '<link rel="stylesheet" href="/blog.css" />',
  ];

  if (jsonLd) {
    // JSON-LD는 script 내용이라 HTML 이스케이프 대신 </script> 시퀀스만 무력화.
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json">${json}</script>`);
  }

  return lines.join('\n');
}

// ════════════════════════════════════════════════════════════════
// JSON-LD 헬퍼 — 객체를 반환(buildHead의 jsonLd 인자로 전달).
// ════════════════════════════════════════════════════════════════

// 개별 블로그 글
export function blogPosting({ title, description, url, date, image } = {}) {
  const absUrl = toAbsoluteUrl(url);
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title || '',
    description: description || '',
    url: absUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl },
    image: toAbsoluteUrl(image || '/assets/hero-pet.jpg'),
    publisher: {
      '@type': 'Organization',
      name: 'MyPet',
      url: SITE_ORIGIN,
    },
  };
  if (date) {
    obj.datePublished = date;
    obj.dateModified = date;
  }
  return obj;
}

// 블로그 목록(Blog + BlogPosting[])
export function blogList({ url, posts = [] } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: toAbsoluteUrl(url),
    name: '반려동물 블로그',
    publisher: { '@type': 'Organization', name: 'MyPet', url: SITE_ORIGIN },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title || '',
      description: p.description || '',
      url: toAbsoluteUrl(p.url),
      ...(p.date ? { datePublished: p.date } : {}),
    })),
  };
}

// 아이템 목록(지역 랜딩 시설 리스트 등)
export function itemList({ name, url, items = [] } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: name || '',
    url: toAbsoluteUrl(url),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name || '',
    })),
  };
}

// 브레드크럼(BreadcrumbList)
export function breadcrumb(trail = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name || '',
      ...(step.url ? { item: toAbsoluteUrl(step.url) } : {}),
    })),
  };
}
