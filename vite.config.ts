import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: base 경로
// GitHub Pages 프로젝트 사이트(https://longpapa82-cyber.github.io/mypet-promo/)에 배포 → base는 '/mypet-promo/'.
// 커스텀 도메인 또는 user/organization 페이지(루트 도메인)로 연결하면 base를 '/' 로 바꿀 것.
export default defineConfig({
  base: '/mypet-promo/',
  plugins: [react()],
});
