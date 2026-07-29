// ════════════════════════════════════════════════════════════════
// page-shell.mjs — 정적 블로그/지역 페이지 공통 HTML 셸 (순수 Node ESM)
// ────────────────────────────────────────────────────────────────
// site-header · breadcrumb · <main class="wrap"> · disclaimer · cta-box · footer
// 클래스명은 web/public/blog.css 실제 정의를 따른다.
// 스토어/사업자정보는 stores.shared.mjs 단일소스에서 import(재선언 금지).
// ════════════════════════════════════════════════════════════════

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  BUSINESS_INFO,
  CONTACT_EMAIL,
  COMPANY_URL,
} from '../../src/constants/stores.shared.mjs';
import { escapeHtml } from './seo.mjs';
import { analyticsSnippet } from './analytics.mjs';

// 법무 문서 — 홍보웹 내부 페이지(메인 GNB·디자인 동일)로 통일한다.
//   메인/법적 페이지는 해시 라우팅(useHashRoute)으로 #privacy·#terms 를 렌더한다.
//   정적 페이지는 루트 배포이므로 '/#privacy' 로 홈 SPA를 열면 해당 문서가 표시된다.
//   (별도 mypet-legal 사이트는 스토어 심사·앱 공유용으로 계속 유지되지만, 웹 GNB 일관성을 위해 여기선 내부 링크 사용.)
const PRIVACY_URL = '/#privacy';
const TERMS_URL = '/#terms';

// ── 사이트 헤더 ──────────────────────────────────────────────────
// [GNB 동기화] 이 정적 헤더의 브랜드·네비 링크·순서는 React 공용 헤더
//   (web/src/components/ui/Header.tsx)와 일치시켜 유지한다.
//   렌더 시스템이 달라(빌드타임 문자열 vs 런타임 JSX) 컴포넌트는 공유하지 않으므로,
//   네비 항목을 추가·변경할 때는 이 함수와 Header.tsx를 함께 수정해야 한다.
//   브랜드(→홈) → 네비(블로그 /blog/, 지역 /near/) → 설치 CTA(스토어) 순서.
function renderHeader() {
  return `<header class="site-header">
  <div class="site-header__inner">
    <a class="site-header__brand" href="/" aria-label="MyPet 홈"><img class="site-header__logo" src="/assets/logo.png" alt="MyPet 로고" width="34" height="34" /><span class="site-header__name">MyPet</span></a>
    <nav class="site-nav" aria-label="주요">
      <a href="/blog/">블로그</a>
      <a href="/near/">지역</a>
    </nav>
    <a class="site-header__cta" href="${escapeHtml(PLAY_STORE_URL)}" target="_blank" rel="noopener noreferrer">앱 설치</a>
  </div>
</header>`;
}

// ── 브레드크럼 ──────────────────────────────────────────────────
// trail: [{name, url}]. 마지막 항목은 현재 페이지(aria-current, 링크 없음).
function renderBreadcrumb(trail = []) {
  if (!Array.isArray(trail) || trail.length === 0) return '';
  const items = trail
    .map((step, i) => {
      const isLast = i === trail.length - 1;
      const name = escapeHtml(step.name);
      if (isLast || !step.url) {
        return `<li><span aria-current="page">${name}</span></li>`;
      }
      return `<li><a href="${escapeHtml(step.url)}">${name}</a></li>`;
    })
    .join('');
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="wrap">
    <ol>${items}</ol>
  </div>
</nav>`;
}

// ── YMYL 면책 블록 ──────────────────────────────────────────────
function renderDisclaimer(disclaimer) {
  if (!disclaimer) return '';
  return `<div class="wrap">
  <aside class="disclaimer">
    <span class="disclaimer__title">안내</span>
    <p>${escapeHtml(disclaimer)}</p>
  </aside>
</div>`;
}

// ── CTA 박스 ────────────────────────────────────────────────────
function renderCtaBox(ctaText) {
  if (!ctaText) return '';
  return `<div class="wrap">
  <section class="cta-box" aria-label="앱 설치 안내">
    <h2>MyPet 앱에서 더 많은 정보를</h2>
    <p>${escapeHtml(ctaText)}</p>
    <div class="cta-box__buttons">
      <a class="cta-btn" href="${escapeHtml(APP_STORE_URL)}" target="_blank" rel="noopener noreferrer">App Store</a>
      <a class="cta-btn" href="${escapeHtml(PLAY_STORE_URL)}" target="_blank" rel="noopener noreferrer">Google Play</a>
    </div>
  </section>
</div>`;
}

// ── 푸터 ────────────────────────────────────────────────────────
function renderFooter() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <a class="site-footer__brand" href="/">MyPet</a>
    <nav class="site-footer__links" aria-label="법무 및 문의">
      <a href="${escapeHtml(PRIVACY_URL)}">개인정보처리방침</a>
      <a href="${escapeHtml(TERMS_URL)}">이용약관</a>
      <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">문의</a>
      <a href="${escapeHtml(COMPANY_URL)}" target="_blank" rel="noopener noreferrer">회사소개</a>
    </nav>
    <div class="site-footer__stores">
      <a href="${escapeHtml(APP_STORE_URL)}" target="_blank" rel="noopener noreferrer">App Store</a>
      <a href="${escapeHtml(PLAY_STORE_URL)}" target="_blank" rel="noopener noreferrer">Google Play</a>
    </div>
    <div class="site-footer__legal">
      <span class="site-footer__biz">${escapeHtml(BUSINESS_INFO)}</span>
      <span>© ${year} MyPet</span>
    </div>
  </div>
</footer>`;
}

// ── 페이지 조립 ─────────────────────────────────────────────────
// head: seo.buildHead() 결과(<head> 안쪽 문자열, 태그 미포함).
export function renderPage({
  head = '',
  breadcrumb = [],
  bodyHtml = '',
  ctaText,
  disclaimer,
} = {}) {
  const analytics = analyticsSnippet();
  return `<!DOCTYPE html>
<html lang="ko">
<head>
${head}${analytics ? '\n' + analytics : ''}
</head>
<body class="blog-page">
${renderHeader()}
${renderBreadcrumb(breadcrumb)}
<main class="wrap">
${bodyHtml}
</main>
${renderDisclaimer(disclaimer)}
${renderCtaBox(ctaText)}
${renderFooter()}
</body>
</html>`;
}
