// 주소 텍스트 → { sido, sidoKo, sigungu, sigunguKo } 파싱.
// 실측 포맷: "서울 강남구 테헤란로 152" = {시/도} {시군구...} {상세}
// 도(道)의 "…시 …구"(예: 성남시 분당구)는 1차 범위(광역시·특별시) 밖 → null.
import { SIDO_SLUG, SIDO_KO, SIGUNGU_SLUG } from './region-map.mjs';

/**
 * @param {string} address
 * @returns {{ sido: string, sidoKo: string, sigungu: string, sigunguKo: string } | null}
 */
export function parseRegion(address) {
  if (!address || typeof address !== 'string') return null;
  const tokens = address.trim().split(/\s+/);
  if (tokens.length < 2) return null;

  const sido = SIDO_SLUG[tokens[0]];
  if (!sido) return null; // 대상 시/도(서울+6광역시) 밖 → 제외

  // 시군구: tokens[1]이 "…구"/"…군" 이어야 함. (광역시/특별시는 바로 구가 온다)
  const sigunguKo = tokens[1];
  if (!/(구|군)$/.test(sigunguKo)) return null;

  const sigungu = SIGUNGU_SLUG[sigunguKo];
  if (!sigungu) return null; // 매핑 테이블(최대집합) 밖 → 제외

  return { sido, sidoKo: SIDO_KO[sido], sigungu, sigunguKo };
}
