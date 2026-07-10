// MyPet 스토어/연락처/법무 — 공유 상수 단일소스 (plain ESM)
//
// 이 파일은 TS(stores.ts)와 순수 Node 빌드 스크립트(.mjs) 양쪽에서 import 가능해야 하므로
// 의존성·타입 없이 plain ESM으로 유지한다. 상수는 여기서만 선언하고, stores.ts는 re-export만 한다.
//
// ⚠️ APP_STORE_URL은 /kr/ 포함 필수 — 앱이 한국 지역에서만 판매(사용 가능)되므로,
// 지역코드 없는 URL은 해외 기준이라 404가 난다. 한국 스토어 직링크로 고정.

export const APP_STORE_URL = 'https://apps.apple.com/kr/app/id6780117383';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.longpapa82.mypet';

export const CONTACT_EMAIL = 'longpapa82@gmail.com';

// 회사(에이아이소프트) 소개 사이트 — MyPet 앱 사업자의 기업 소개 페이지(외부 링크)
export const COMPANY_URL = 'https://aisoft-iota.vercel.app/';

export const BUSINESS_INFO =
  '에이아이소프트 · 대표 박훈재 · 사업자등록 411-18-92743 · 통신판매업 면제';
