// SSG 프리렌더 — 빌드 후 실행.
// vite build --ssr 로 만든 SSR 번들의 render()를 호출해 <App /> HTML 문자열을 얻고,
// dist/index.html 의 <div id="root"></div> 안에 본문을 박아넣는다(+ data-prerendered 플래그).
// 결과: 정적 HTML이라 네이버 Yeti가 JS 없이도 전체 본문을 읽고, 구글이 즉시 색인.
// 순수 Node 스크립트(외부 네트워크 호출 0). GitHub Pages는 이 결과물만 서빙(런타임 서버 불필요).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const htmlPath = resolve(root, 'dist/index.html');
const serverEntry = resolve(root, 'dist-ssr/entry-server.js');

// 1) SSR 번들 로드 → render() 호출
const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

// 2) dist/index.html 의 #root 비어있는 마운트 지점을 본문으로 치환
const template = readFileSync(htmlPath, 'utf-8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: '${marker}' 를 dist/index.html 에서 찾지 못함`);
}
const injected = template.replace(marker, `<div id="root" data-prerendered="true">${appHtml}</div>`);
writeFileSync(htmlPath, injected, 'utf-8');

const sizeKb = (appHtml.length / 1024).toFixed(1);
console.log(`✓ prerender: dist/index.html #root 에 본문 주입 완료 (${sizeKb} kB HTML)`);
