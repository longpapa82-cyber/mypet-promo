import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import App from './App';

// JS 부팅 성공 → no-js 폴백 해제(Reveal 진입 애니메이션 활성화).
// JS 미실행 시엔 html.no-js가 남아 Reveal 콘텐츠가 즉시 보인다(빈 화면 방지).
document.documentElement.classList.remove('no-js');

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

// SSG: 빌드 시 prerender가 #root에 본문을 박고 data-prerendered="true"를 단다.
// 그 경우 hydrate(서버 HTML 재사용·이벤트만 부착, 깜빡임 없음). 비어 있으면(dev 등) 일반 렌더.
if (rootEl.getAttribute('data-prerendered') === 'true' && rootEl.hasChildNodes()) {
  hydrateRoot(
    rootEl,
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
