// 프리렌더(SSG) 엔트리 — 빌드 시 Node에서 <App />을 HTML 문자열로 렌더.
// scripts/prerender.mjs가 이 render()를 호출해 dist/index.html의 #root 안에 본문을 박는다.
// 브라우저 런타임에선 쓰이지 않음(vite build --ssr 전용 번들).
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import './styles/tokens.css';
import './styles/global.css';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
