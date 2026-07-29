// ════════════════════════════════════════════════════════════════
// track.ts — 프론트엔드 전환 이벤트 계측 래퍼 (GA4)
// ────────────────────────────────────────────────────────────────
// window.gtag 는 index.html <head>에 주입된 GA4 스니펫이 설정한다.
// (scripts/lib/analytics.mjs → vite.config transformIndexHtml)
// 측정 ID가 없거나 dev 환경이면 gtag 가 undefined → trackEvent 는 안전하게 no-op.
//
// 전역 접근(any)을 이 파일 한 곳에 격리하고, 앱 나머지는 타입 안전한
// trackEvent()·전환 이벤트 상수만 사용한다.
// ════════════════════════════════════════════════════════════════

declare global {
  interface Window {
    // 실제 gtag은 'js'|'config'|'event'|'set' 등 다중 오버로드의 가변 함수다.
    //   'js'·'config' 호출은 index.html에 주입된 원시 스니펫(문자열)에서 실행되고,
    //   TS 코드에서는 'event'만 호출한다. 선언을 실제 API에 맞춰 가변으로 두되,
    //   앱 코드는 아래 trackEvent() 래퍼로만 접근해 타입 안전을 확보한다.
    gtag?: (...args: unknown[]) => void;
  }
}

// ── 전환 이벤트 이름(단일 소스) ──────────────────────────────────
// GA4 대시보드에서 "전환"으로 표시할 이벤트를 여기서 관리한다.
// 이름은 GA4 규칙(snake_case, 40자 이내)을 따른다.
export const ConversionEvent = {
  /** 스토어 배지·CTA 클릭(App Store / Google Play 이동) = 설치 인텐트 */
  STORE_CLICK: 'store_click',
} as const;

export type ConversionEventName =
  (typeof ConversionEvent)[keyof typeof ConversionEvent];

// ── 이벤트 발생 ──────────────────────────────────────────────────
// gtag 미존재 시(ID 미설정·dev·차단) 조용히 무시. 절대 예외를 던지지 않는다.
export function trackEvent(
  name: ConversionEventName,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return; // SSR/프리렌더 가드
  if (typeof window.gtag !== 'function') return; // 애널리틱스 미로드
  window.gtag('event', name, params);
}
