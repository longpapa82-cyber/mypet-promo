import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { analyticsSnippet } from './scripts/lib/analytics.mjs';

// ── 애널리틱스 주입 플러그인 ──────────────────────────────────────
// index.html <head> 끝에 GA4·네이버 스니펫을 빌드 시 주입한다.
// 정적 blog/near 페이지(page-shell.mjs)와 동일한 단일 소스(analytics.mjs)를 사용(DRY).
// 측정 ID(GA4_MEASUREMENT_ID·NAVER_ANALYTICS_ID)가 환경변수에 없으면 no-op → 안전.
// #root 밖(<head>)이라 프리렌더 hydration과 무관.
function analyticsPlugin(): Plugin {
  return {
    name: 'inject-analytics',
    transformIndexHtml(html: string): string {
      const snippet = analyticsSnippet();
      if (!snippet) return html;
      return html.replace('</head>', `${snippet}\n  </head>`);
    },
  };
}

// NOTE: base 경로
// 커스텀 도메인(https://with-my-pet.com) 루트로 배포 중 → base는 '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), analyticsPlugin()],
});
