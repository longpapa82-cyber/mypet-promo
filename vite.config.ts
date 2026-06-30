import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: base 경로
// 커스텀 도메인(https://with-my-pet.com) 루트로 배포 중 → base는 '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
