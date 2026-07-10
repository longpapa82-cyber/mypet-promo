// ════════════════════════════════════════════════════════════════
// build-blog.mjs — content/blog/*.md → dist/blog/*.html + 목록
// ────────────────────────────────────────────────────────────────
// 순수 Node ESM · 네트워크 0 · 의존성 0.
//
// 흐름:
//   1. content/blog/*.md 스캔 → parseMarkdown → 메타(정본, H2 단일소스).
//   2. 각 글: renderPage(buildHead+blogPosting, breadcrumb, 본문+관련글,
//      disclaimer, ctaText) → dist/blog/<slug>.html.
//   3. 관련글: tags 교집합 상위 3~5(없으면 최신순), 본문 끝 .related.
//   4. 목록: .post-grid 카드 + blogList JSON-LD → dist/blog/index.html.
//   5. 생성 수 로그.
//
// 링크 규칙(design C1): 목록 디렉토리 '/blog/', 글은 '/blog/<slug>.html'.
// ════════════════════════════════════════════════════════════════

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { parseMarkdown } from './lib/md.mjs';
import { renderPage } from './lib/page-shell.mjs';
import {
  buildHead,
  blogPosting,
  blogList,
  breadcrumb as breadcrumbJsonLd,
  escapeHtml,
} from './lib/seo.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, '..');
const CONTENT_DIR = join(WEB_ROOT, 'content', 'blog');
const OUT_DIR = join(WEB_ROOT, 'dist', 'blog');

// 관련글 개수 범위
const RELATED_MIN = 3;
const RELATED_MAX = 5;

// CTA 문구
const POST_CTA = '지금 MyPet 앱에서 우리 동네 반려동물 시설을 찾아보세요.';
const LIST_CTA = 'MyPet 앱에서 반려동물 건강·시설 정보를 한곳에서 확인하세요.';

// YMYL 면책 문구(앱 AI 면책과 일관)
const YMYL_DISCLAIMER =
  '본 글은 정보 제공용이며 진단·법률 자문이 아닙니다. 정확한 진단은 수의사, 법률 문제는 변호사와 상담하세요.';

// ── 링크 헬퍼(C1 계약) ───────────────────────────────────────────
function postPath(slug) {
  return '/blog/' + slug + '.html';
}
const BLOG_INDEX_PATH = '/blog/';

// ── MD 스캔 → 글 메타 목록(정본) ─────────────────────────────────
function loadPosts() {
  let files;
  try {
    files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }

  const posts = [];
  for (const file of files) {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
    const { frontmatter, html } = parseMarkdown(raw);

    // slug: 프론트매터 우선, 없으면 파일명
    const slug = (frontmatter.slug || file.replace(/\.md$/, '')).trim();
    if (!slug) continue;

    posts.push({
      slug,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      date: frontmatter.date || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      cover: frontmatter.cover || undefined,
      hasDisclaimer: frontmatter.disclaimer === true,
      bodyHtml: html,
    });
  }

  // 최신순 정렬(date 문자열 내림차순; 없으면 뒤로)
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return posts;
}

// ── 관련글 선정: tags 교집합 상위 → 부족분 최신순 ─────────────────
function pickRelated(current, all) {
  const others = all.filter((p) => p.slug !== current.slug);
  const currentTags = new Set(current.tags);

  const scored = others
    .map((p) => {
      const overlap = p.tags.filter((t) => currentTags.has(t)).length;
      return { post: p, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return (b.post.date || '').localeCompare(a.post.date || '');
    });

  // 교집합 있는 것 우선, 그다음 최신순으로 채움. 최대 RELATED_MAX.
  const selected = [];
  for (const { post } of scored) {
    if (selected.length >= RELATED_MAX) break;
    selected.push(post);
  }
  // RELATED_MIN 미만이면 있는 만큼만(글이 적을 때).
  return selected.slice(0, Math.max(RELATED_MIN, Math.min(RELATED_MAX, selected.length)));
}

// ── 관련글 HTML(.related) ────────────────────────────────────────
function renderRelated(related) {
  if (!related.length) return '';
  const items = related
    .map(
      (p) =>
        `<li><a href="${escapeHtml(postPath(p.slug))}">${escapeHtml(p.title)}</a></li>`
    )
    .join('\n');
  return `<nav class="related" aria-label="관련 글">
  <p class="related__title">관련 글</p>
  <ul>
${items}
  </ul>
</nav>`;
}

// ── 글 본문 래핑(article + 헤더) ─────────────────────────────────
function renderArticle(post, related) {
  const eyebrow = post.tags.length ? escapeHtml(post.tags[0]) : '반려동물';
  const metaParts = [];
  if (post.date) metaParts.push(`<span>${escapeHtml(post.date)}</span>`);
  if (post.tags.length) {
    metaParts.push(`<span>${post.tags.map((t) => escapeHtml(t)).join(', ')}</span>`);
  }
  const meta = metaParts.length
    ? `<div class="article__meta">${metaParts.join('')}</div>`
    : '';

  return `<article class="article">
  <header class="article__header">
    <span class="article__eyebrow">${eyebrow}</span>
    <h1>${escapeHtml(post.title)}</h1>
    ${meta}
  </header>
${post.bodyHtml}
${renderRelated(related)}
</article>`;
}

// ── 개별 글 페이지 생성 ──────────────────────────────────────────
function buildPostPage(post, allPosts) {
  const url = postPath(post.slug);
  const trail = [
    { name: '홈', url: '/' },
    { name: '블로그', url: BLOG_INDEX_PATH },
    { name: post.title, url },
  ];

  const head = buildHead({
    title: `${post.title} | MyPet 블로그`,
    description: post.description,
    canonical: url,
    ogType: 'article',
    ogImage: post.cover,
    jsonLd: [
      blogPosting({
        title: post.title,
        description: post.description,
        url,
        date: post.date,
        image: post.cover,
      }),
      breadcrumbJsonLd(trail),
    ],
  });

  const related = pickRelated(post, allPosts);
  const bodyHtml = renderArticle(post, related);

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText: POST_CTA,
    disclaimer: post.hasDisclaimer ? YMYL_DISCLAIMER : undefined,
  });
}

// ── 목록 페이지(post-grid) ───────────────────────────────────────
function renderPostCard(post) {
  const eyebrow = post.tags.length ? escapeHtml(post.tags[0]) : '반려동물';
  const metaParts = [];
  if (post.date) metaParts.push(`<span>${escapeHtml(post.date)}</span>`);
  return `<li>
  <a class="post-card post-card--compact" href="${escapeHtml(postPath(post.slug))}">
    <div class="post-card__body">
      <span class="post-card__eyebrow">${eyebrow}</span>
      <h2 class="post-card__title">${escapeHtml(post.title)}</h2>
      <p class="post-card__excerpt">${escapeHtml(post.description)}</p>
      <div class="post-card__meta">${metaParts.join('')}</div>
    </div>
  </a>
</li>`;
}

function buildIndexPage(posts) {
  const trail = [
    { name: '홈', url: '/' },
    { name: '블로그', url: BLOG_INDEX_PATH },
  ];

  const head = buildHead({
    title: '반려동물 블로그 | MyPet',
    description:
      '반려동물 건강, 시설 선택, 생활 정보까지 — MyPet이 반려인을 위해 정리한 실용 가이드를 만나보세요.',
    canonical: BLOG_INDEX_PATH,
    jsonLd: [
      blogList({
        url: BLOG_INDEX_PATH,
        posts: posts.map((p) => ({
          title: p.title,
          description: p.description,
          url: postPath(p.slug),
          date: p.date,
        })),
      }),
      breadcrumbJsonLd(trail),
    ],
  });

  const gridOrEmpty = posts.length
    ? `<ul class="post-grid">
${posts.map(renderPostCard).join('\n')}
</ul>`
    : `<p>아직 등록된 글이 없습니다. 곧 유용한 반려동물 정보를 채워 나가겠습니다.</p>`;

  const bodyHtml = `<div class="section-head">
  <h1>반려동물 블로그</h1>
  <p>건강·시설·생활 정보를 반려인 눈높이에서 정리했습니다.</p>
</div>
${gridOrEmpty}`;

  return renderPage({
    head,
    breadcrumb: trail,
    bodyHtml,
    ctaText: LIST_CTA,
  });
}

// ── 실행 ─────────────────────────────────────────────────────────
function main() {
  const posts = loadPosts();
  mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const post of posts) {
    const html = buildPostPage(post, posts);
    writeFileSync(join(OUT_DIR, post.slug + '.html'), html, 'utf8');
    count += 1;
  }

  const indexHtml = buildIndexPage(posts);
  writeFileSync(join(OUT_DIR, 'index.html'), indexHtml, 'utf8');

  console.log(
    `[build-blog] 글 ${count}개 생성 → dist/blog/*.html + index.html` +
      (posts.length === 0 ? ' (글 없음: 안내 목록만 생성)' : '')
  );
}

main();
