// MyPet 스토어/연락처/법무 단일소스 (URL은 모든 컴포넌트에서 여기만 참조)

export const APP_STORE_URL = 'https://apps.apple.com/app/id6780117383';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.longpapa82.mypet';

// 스토어 출시 상태 — iOS=출시됨(활성), Android=준비중(출시예정)
export type StoreStatus = 'live' | 'coming-soon';

export interface StoreInfo {
  url: string;
  status: StoreStatus;
}

export const APP_STORE: StoreInfo = { url: APP_STORE_URL, status: 'live' };
export const PLAY_STORE: StoreInfo = { url: PLAY_STORE_URL, status: 'coming-soon' };

export const LEGAL_BASE_URL = 'https://longpapa82-cyber.github.io/mypet-legal/';
export const PRIVACY_POLICY_URL = `${LEGAL_BASE_URL}privacy-policy.html`;
export const TERMS_URL = `${LEGAL_BASE_URL}terms.html`;

export const CONTACT_EMAIL = 'longpapa82@gmail.com';

export const BUSINESS_INFO = 'AI Soft · 대표 박훈재 · 사업자등록 411-18-92743 · 통신판매업 면제';

// vite base('/mypet/')를 반영한 public 에셋 경로 헬퍼
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
