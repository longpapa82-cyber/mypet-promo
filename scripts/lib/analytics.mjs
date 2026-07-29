// ════════════════════════════════════════════════════════════════
// analytics.mjs — 웹 애널리틱스 스니펫 단일 소스 (순수 Node ESM)
// ────────────────────────────────────────────────────────────────
// GA4 + 네이버 애널리틱스 <head> 삽입 스니펫을 생성한다.
// 이 문자열은 index.html(SPA·프리렌더 밖) + page-shell.mjs(정적 blog/near)
// 양쪽에서 동일하게 사용된다(DRY). 한 곳만 고치면 전 페이지에 반영.
//
// 측정 ID는 계정 고유값이라 코드에 하드코딩하지 않는다.
//   - CI/로컬 환경변수로 주입: GA4_MEASUREMENT_ID, NAVER_ANALYTICS_ID
//   - ID가 비어 있으면 스니펫을 아예 출력하지 않음(no-op) → 안전.
//
// ⚠️ 프리렌더 주의: 이 스니펫은 <head>에만 넣는다. React 트리(#root) 밖이라
//   hydration mismatch가 발생하지 않는다.
// ════════════════════════════════════════════════════════════════

// 환경변수에서 측정 ID를 읽는다. 없으면 빈 문자열 → 스니펫 미출력.
export const GA4_ID = (process.env.GA4_MEASUREMENT_ID || '').trim();
export const NAVER_ID = (process.env.NAVER_ANALYTICS_ID || '').trim();

// ── ID 형식 검증(script 컨텍스트 주입 방어) ──────────────────────
// ID는 <script> 안쪽 JS 문자열에 그대로 삽입되므로 HTML 이스케이프로는
// 방어 불가(script 컨텍스트는 JS 파서가 처리 → &#39; 무의미, 따옴표로 탈출 가능).
// 따라서 실제 ID에 나타나는 문자만 허용하는 allowlist로 검증한다.
//   GA4: 항상 'G-' + 대문자·숫자.  네이버 wa: 영숫자·_·- (16진수 해시류).
// 형식 불일치면 빈 문자열 반환 → 스니펫 미출력(오설정·CI 변조 방어).
const GA4_RE = /^G-[A-Z0-9]{4,}$/;
const NAVER_RE = /^[A-Za-z0-9_-]{4,}$/;

// ⚠️ SRI(integrity) 미적용은 의도적:
//   gtag/js·wcslog.js 는 벤더가 URL 고정 채로 내용을 수시 갱신하는 "버전 없는
//   가변 엔드포인트"다. sha384 해시를 고정하면 벤더가 업데이트하는 순간 해시
//   불일치로 스크립트가 차단된다. Google·Naver 모두 SRI 해시를 제공하지 않는다.
//   SRI는 버전 고정 CDN 자산(예: jquery@3.6.0.min.js)에나 유효하다.

// ── GA4 (gtag.js) ────────────────────────────────────────────────
// 비동기 로드. 전환 이벤트는 프론트 코드에서 gtag('event', ...)로 발생.
function ga4Snippet(id) {
  if (!id || !GA4_RE.test(id)) return '';
  return `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`;
}

// ── 네이버 애널리틱스 ────────────────────────────────────────────
// 네이버 서치어드바이저 발급 ID. wcslog.js 표준 스니펫.
function naverSnippet(id) {
  if (!id || !NAVER_RE.test(id)) return '';
  return `<!-- Naver Analytics -->
<script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
<script type="text/javascript">
  if (!wcs_add) var wcs_add = {};
  wcs_add["wa"] = "${id}";
  if (window.wcs) {
    wcs_do();
  }
</script>`;
}

// ── 통합 스니펫 ──────────────────────────────────────────────────
// 두 스니펫을 합쳐 반환. 둘 다 ID 없으면 빈 문자열.
export function analyticsSnippet() {
  return [ga4Snippet(GA4_ID), naverSnippet(NAVER_ID)]
    .filter(Boolean)
    .join('\n');
}
