// MyPet 스토어/연락처/법무 단일소스 (URL은 모든 컴포넌트에서 여기만 참조)

// ⚠️/kr/ 포함 필수 — 앱이 한국 지역에서만 판매(사용 가능)되므로, 지역코드 없는 URL은
// 미국 등 해외 기준이라 404가 난다. 한국 스토어 직링크로 고정.
export const APP_STORE_URL = 'https://apps.apple.com/kr/app/id6780117383';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.longpapa82.mypet';

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

export const CONTACT_EMAIL = 'longpapa82@gmail.com';

export const BUSINESS_INFO = 'AI Soft · 대표 박훈재 · 사업자등록 411-18-92743 · 통신판매업 면제';

// vite base('/mypet/')를 반영한 public 에셋 경로 헬퍼
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
