// build-sitemap.mjs — 전 정적 페이지를 수집해 dist/sitemap.xml 생성.
//
// 🔴 결합도 0 원칙(design §1 H1): build-blog / build-near 와 함수 리턴으로
//    연결하지 않는다(각 node 스크립트는 별도 프로세스라 리턴 계약 불가).
//    대신 dist/blog/**/*.html + dist/near/**/*.html 를 파일시스템 재귀 글롭으로
//    스캔해 URL을 도출한다. 반드시 build-blog·build-near 이후에 실행.
//
// 부수 작업: src/styles/tokens.css → dist/tokens.css 복사
//    (정적 블로그/지역 페이지가 <link href="/tokens.css"> 로 참조하므로.
//     blog.css 는 public/ 이라 vite 가 이미 dist 로 복사함.)
//
// 순수 Node ESM · 외부 네트워크 호출 0 · 의존성 0.
import { readdirSync, statSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

const ORIGIN = 'https://with-my-pet.com';

// 사이트맵 lastmod(YYYY-MM-DD). 빌드 시각 기준.
const LASTMOD = new Date().toISOString().slice(0, 10);

// ── 재귀 글롭: dir 하위 모든 .html 절대경로 ──────────────────────────
function walkHtml(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkHtml(full));
    } else if (st.isFile() && entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// ── 파일 절대경로 → 사이트맵 URL 경로(디렉토리 계약 반영) ───────────
// design C1 링크 계약:
//   - index.html      → 디렉토리 URL(trailing slash): /blog/index.html → /blog/
//   - 그 외 .html      → .html 그대로:                 /near/x/y/z.html
function fileToUrlPath(absFile) {
  // dist 기준 상대경로를 URL 세그먼트로(윈도우 sep 방어)
  const rel = relative(distDir, absFile).split(sep).join('/');
  if (rel.endsWith('/index.html')) {
    // a/b/index.html → /a/b/
    return '/' + rel.slice(0, -'index.html'.length);
  }
  if (rel === 'index.html') {
    return '/';
  }
  return '/' + rel;
}

// ── 페이지 유형별 priority / changefreq ─────────────────────────────
// design §6.3: 홈 1.0, /blog/ 0.9, 글 0.7, /near/ 0.8, 시도 index 0.7, 랜딩 0.6.
//   changefreq: 목록(디렉토리) weekly, 글·랜딩 monthly.
function classify(urlPath) {
  if (urlPath === '/') {
    return { priority: '1.0', changefreq: 'weekly' };
  }
  if (urlPath === '/blog/') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (urlPath === '/near/') {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  // 시/도 index: /near/<sido>/  (세그먼트 3개: '', 'near', '<sido>', '')
  if (urlPath.startsWith('/near/') && urlPath.endsWith('/')) {
    return { priority: '0.7', changefreq: 'weekly' };
  }
  // 블로그 개별 글: /blog/<slug>.html
  if (urlPath.startsWith('/blog/') && urlPath.endsWith('.html')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  // 지역 랜딩: /near/<sido>/<sigungu>/<category>.html
  if (urlPath.startsWith('/near/') && urlPath.endsWith('.html')) {
    return { priority: '0.6', changefreq: 'monthly' };
  }
  // 기타 디렉토리/파일 안전 기본값
  return { priority: '0.5', changefreq: 'monthly' };
}

// ── XML escape (loc URL 안전) ───────────────────────────────────────
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── tokens.css 복사(정적 페이지 /tokens.css 링크 대상) ──────────────
function copyTokens() {
  const src = resolve(root, 'src/styles/tokens.css');
  const dest = resolve(distDir, 'tokens.css');
  if (!existsSync(src)) {
    console.warn(`⚠ build-sitemap: tokens.css 원본 없음(${src}) — 복사 생략`);
    return;
  }
  copyFileSync(src, dest);
  console.log('✓ build-sitemap: src/styles/tokens.css → dist/tokens.css 복사');
}

// ── 메인 ────────────────────────────────────────────────────────────
function main() {
  if (!existsSync(distDir)) {
    throw new Error(`build-sitemap: dist 디렉토리 없음(${distDir}) — build:client 이후 실행할 것`);
  }

  copyTokens();

  // 수집: 홈 + blog/near 글롭
  const urlPaths = new Set();
  urlPaths.add('/'); // 홈(dist/index.html)

  for (const f of walkHtml(resolve(distDir, 'blog'))) {
    urlPaths.add(fileToUrlPath(f));
  }
  for (const f of walkHtml(resolve(distDir, 'near'))) {
    urlPaths.add(fileToUrlPath(f));
  }

  // 정렬(결정적 출력): 홈 먼저, 그다음 사전순
  const sorted = [...urlPaths].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

  const entries = sorted.map((p) => {
    const { priority, changefreq } = classify(p);
    return [
      '  <url>',
      `    <loc>${xmlEscape(ORIGIN + p)}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  const out = resolve(distDir, 'sitemap.xml');
  writeFileSync(out, xml, 'utf-8');
  console.log(`✓ build-sitemap: dist/sitemap.xml 생성 (${sorted.length} URL)`);
}

main();
