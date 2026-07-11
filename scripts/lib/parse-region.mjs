// 주소 텍스트 → { sido, sidoKo, sigungu, sigunguKo } 파싱.
// 실측 포맷(2026-07-11):
//   - 광역시/특별시: "서울특별시 강남구 …"   → 2번째 토큰이 "…구"
//   - 道: "경기도 수원시 …", "경상북도 칠곡군 …"  → 2번째 토큰이 "…시"/"…군"
//   - 세종(단층제): "세종특별자치시 조치원읍 …"  → 시/군/구 없음 → sigungu null(시/도 페이지만)
// 대상 시/도(전국 17개) + 실측 시군구(207개) 밖은 null(=지역 페이지 미생성, 임계치와 별개).
import {
  SIDO_SLUG,
  SIDO_KO,
  SIGUNGU_SLUG,
  SIDO_SINGLE_TIER,
} from './region-map.mjs';

/**
 * @param {string} address
 * @returns {{ sido: string, sidoKo: string, sigungu: string | null, sigunguKo: string | null } | null}
 *   sigungu가 null이면 세종처럼 시/도 단층 지역(시/도 페이지만 생성).
 */
export function parseRegion(address) {
  if (!address || typeof address !== 'string') return null;
  const tokens = address.trim().split(/\s+/);
  if (tokens.length < 2) return null;

  const sido = SIDO_SLUG[tokens[0]];
  if (!sido) return null; // 대상 시/도 밖 → 제외

  // 세종 등 단층제: 시/군/구 없음 → sigungu null로 반환(시/도 페이지만).
  if (SIDO_SINGLE_TIER.has(sido)) {
    return { sido, sidoKo: SIDO_KO[sido], sigungu: null, sigunguKo: null };
  }

  // 시/군/구: 2번째 토큰이 "…구"(광역시) / "…시"·"…군"(道) 이어야 함.
  const sigunguKo = tokens[1];
  if (!/(구|시|군)$/.test(sigunguKo)) return null;

  const sigungu = SIGUNGU_SLUG[sigunguKo];
  if (!sigungu) return null; // 매핑 테이블(최대집합) 밖 → 제외

  return { sido, sidoKo: SIDO_KO[sido], sigungu, sigunguKo };
}
