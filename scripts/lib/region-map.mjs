// 한국 행정구역 → 로마자 슬러그 매핑 (프로그래매틱 지역 SEO용)
// 최대집합(서울 25구 + 6대 광역시 전 구)을 담고, 실제 페이지 생성 여부는
// build-near.mjs 의 임계치(MIN_FACILITIES_PER_PAGE)가 결정한다.
// (design blog-menu §4.3 M3 정책: "매핑 최대집합 + 임계치 게이트")

// 시/도 표기 정규화: 주소 첫 토큰("서울"/"부산"…) → 표준 시/도 슬러그.
export const SIDO_SLUG = Object.freeze({
  서울: 'seoul',
  서울특별시: 'seoul',
  부산: 'busan',
  부산광역시: 'busan',
  대구: 'daegu',
  대구광역시: 'daegu',
  인천: 'incheon',
  인천광역시: 'incheon',
  광주: 'gwangju',
  광주광역시: 'gwangju',
  대전: 'daejeon',
  대전광역시: 'daejeon',
  울산: 'ulsan',
  울산광역시: 'ulsan',
});

export const SIDO_KO = Object.freeze({
  seoul: '서울',
  busan: '부산',
  daegu: '대구',
  incheon: '인천',
  gwangju: '광주',
  daejeon: '대전',
  ulsan: '울산',
});

// 시군구(구) → 슬러그. 키는 한글 "…구" 원문. 서울 25구 + 6광역시 전 구(최대집합).
export const SIGUNGU_SLUG = Object.freeze({
  // 서울 25구
  종로구: 'jongno',
  중구: 'jung',
  용산구: 'yongsan',
  성동구: 'seongdong',
  광진구: 'gwangjin',
  동대문구: 'dongdaemun',
  중랑구: 'jungnang',
  성북구: 'seongbuk',
  강북구: 'gangbuk',
  도봉구: 'dobong',
  노원구: 'nowon',
  은평구: 'eunpyeong',
  서대문구: 'seodaemun',
  마포구: 'mapo',
  양천구: 'yangcheon',
  강서구: 'gangseo',
  구로구: 'guro',
  금천구: 'geumcheon',
  영등포구: 'yeongdeungpo',
  동작구: 'dongjak',
  관악구: 'gwanak',
  서초구: 'seocho',
  강남구: 'gangnam',
  송파구: 'songpa',
  강동구: 'gangdong',
  // 부산 15구 1군
  서구: 'seo',
  동구: 'dong',
  영도구: 'yeongdo',
  부산진구: 'busanjin',
  동래구: 'dongnae',
  남구: 'nam',
  북구: 'buk',
  해운대구: 'haeundae',
  사하구: 'saha',
  금정구: 'geumjeong',
  연제구: 'yeonje',
  수영구: 'suyeong',
  사상구: 'sasang',
  기장군: 'gijang',
  // 대구 (중·동·서·남·북·수성·달서 + 달성군·군위군) — 동명 구는 위 키와 공유
  수성구: 'suseong',
  달서구: 'dalseo',
  달성군: 'dalseong',
  군위군: 'gunwi',
  // 인천 (중·동·미추홀·연수·남동·부평·계양·서 + 강화·옹진)
  미추홀구: 'michuhol',
  연수구: 'yeonsu',
  남동구: 'namdong',
  부평구: 'bupyeong',
  계양구: 'gyeyang',
  강화군: 'ganghwa',
  옹진군: 'ongjin',
  // 광주 (동·서·남·북·광산)
  광산구: 'gwangsan',
  // 대전 (동·중·서·유성·대덕)
  유성구: 'yuseong',
  대덕구: 'daedeok',
  // 울산 (중·남·동·북 + 울주)
  울주군: 'ulju',
});

// ⚠️ 동명(同名) 구 주의: 서구/동구/남구/북구/중구는 여러 광역시에 존재한다.
// URL은 /near/<sido>/<sigungu> 로 sido가 앞에 있어 유일성이 보장된다
// (예: /near/busan/seo vs /near/gwangju/seo). 슬러그 자체는 재사용해도 안전.

export const MIN_FACILITIES_PER_PAGE = 3;
