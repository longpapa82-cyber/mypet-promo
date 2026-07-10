// MyPet 스토어/연락처/법무 단일소스 (URL은 모든 컴포넌트에서 여기만 참조)
//
// URL·사업자정보 등 순수 문자열 상수는 stores.shared.mjs(plain ESM)가 정본 —
// TS와 Node 빌드 스크립트(.mjs)가 같은 값을 공유하도록 여기서는 re-export만 한다.
export {
  APP_STORE_URL,
  PLAY_STORE_URL,
  CONTACT_EMAIL,
  COMPANY_URL,
  BUSINESS_INFO,
} from './stores.shared.mjs';

import { APP_STORE_URL, PLAY_STORE_URL } from './stores.shared.mjs';

// 스토어 출시 상태 — iOS=출시됨(활성), Android=출시됨(활성, 2026-06-22 프로덕션 정식 출시)
export type StoreStatus = 'live' | 'coming-soon';

export interface StoreInfo {
  url: string;
  status: StoreStatus;
}

export const APP_STORE: StoreInfo = { url: APP_STORE_URL, status: 'live' };
export const PLAY_STORE: StoreInfo = { url: PLAY_STORE_URL, status: 'live' };

export const LEGAL_BASE_URL = 'https://longpapa82-cyber.github.io/mypet-legal/';
export const PRIVACY_POLICY_URL = `${LEGAL_BASE_URL}privacy-policy.html`;
export const TERMS_URL = `${LEGAL_BASE_URL}terms.html`;

// vite base('/')를 반영한 public 에셋 경로 헬퍼(BASE_URL 접두 → base 변경 시 자동 대응)
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
