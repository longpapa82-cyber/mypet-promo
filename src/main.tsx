import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
