// 한국 행정구역 → 로마자 슬러그 매핑 (프로그래매틱 지역 SEO용)
// 최대집합(전국 17개 시/도 + 실측 시/군/구 207개)을 담고, 실제 페이지 생성 여부는
// build-near.mjs 의 임계치(MIN_FACILITIES_PER_PAGE)가 결정한다.
// (design blog-menu §4.3 M3 정책: "매핑 최대집합 + 임계치 게이트")
//
// 2026-07-11 전국 확장(facility-data-elevation P1): 서울+6광역시 → 17개 시/도 전체.
//   - 광역시/특별시: 주소 2번째 토큰이 "…구"(예: "서울특별시 강남구").
//   - 道(경기·강원·충청·전라·경상): 2번째 토큰이 "…시"/"…군"(예: "경기도 수원시").
//   - 세종특별자치시: 단층제 → 시/군/구 없음. parseRegion이 sigungu:null 반환하지만
//     build-near.groupFacilities가 sigungu 없는 시설을 드롭 → 현재 세종 페이지는 미생성.
//     (세종 주소 대부분이 읍·면·도로명이라 파싱 자체가 어렵고 SEO 가치 낮음. 추후 필요 시
//      groupFacilities에 sigungu===null 분기 추가로 시/도 단일 페이지 생성 가능.)
//   슬러그는 명시적 매핑(국어 로마자 표기법 + 관용 표기). 새 지역은 여기에 추가.

// 시/도 표기 정규화: 주소 첫 토큰(풀네임/축약 모두) → 표준 시/도 슬러그.
export const SIDO_SLUG = Object.freeze({
  서울특별시: 'seoul',
  서울: 'seoul',
  부산광역시: 'busan',
  부산: 'busan',
  대구광역시: 'daegu',
  대구: 'daegu',
  인천광역시: 'incheon',
  인천: 'incheon',
  광주광역시: 'gwangju',
  광주: 'gwangju',
  대전광역시: 'daejeon',
  대전: 'daejeon',
  울산광역시: 'ulsan',
  울산: 'ulsan',
  세종특별자치시: 'sejong',
  세종: 'sejong',
  경기도: 'gyeonggi',
  경기: 'gyeonggi',
  강원특별자치도: 'gangwon',
  강원도: 'gangwon',
  강원: 'gangwon',
  충청북도: 'chungbuk',
  충북: 'chungbuk',
  충청남도: 'chungnam',
  충남: 'chungnam',
  전북특별자치도: 'jeonbuk',
  전라북도: 'jeonbuk',
  전북: 'jeonbuk',
  전라남도: 'jeonnam',
  전남: 'jeonnam',
  경상북도: 'gyeongbuk',
  경북: 'gyeongbuk',
  경상남도: 'gyeongnam',
  경남: 'gyeongnam',
  제주특별자치도: 'jeju',
  제주도: 'jeju',
  제주: 'jeju',
});

export const SIDO_KO = Object.freeze({
  seoul: '서울',
  busan: '부산',
  daegu: '대구',
  incheon: '인천',
  gwangju: '광주',
  daejeon: '대전',
  ulsan: '울산',
  sejong: '세종',
  gyeonggi: '경기',
  gangwon: '강원',
  chungbuk: '충북',
  chungnam: '충남',
  jeonbuk: '전북',
  jeonnam: '전남',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  jeju: '제주',
});

// 세종은 단층제(시/군/구 없음) → 시/도 단일 페이지로만 처리. parse-region이 참조.
export const SIDO_SINGLE_TIER = Object.freeze(new Set(['sejong']));

// 시군구(시/군/구) → 슬러그. 키는 한글 원문("…구"/"…시"/"…군").
// 전국 실측 시/군/구. 키 206개(동명 구 중구/서구/동구/남구/북구는 여러 광역시가 키 공유).
// 동명(同名) 구/시/군은 URL에서 sido가 앞에 와 유일성 보장
// (예: /near/busan/seo vs /near/gwangju/seo). 슬러그 재사용 안전.
export const SIGUNGU_SLUG = Object.freeze({
  // ── 서울 25구 ──
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
  // ── 광역시 구/군 (동명 구는 위 키와 공유) ──
  // 부산
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
  // 대구
  수성구: 'suseong',
  달서구: 'dalseo',
  달성군: 'dalseong',
  군위군: 'gunwi',
  // 인천
  미추홀구: 'michuhol',
  연수구: 'yeonsu',
  남동구: 'namdong',
  부평구: 'bupyeong',
  계양구: 'gyeyang',
  강화군: 'ganghwa',
  옹진군: 'ongjin',
  // 광주
  광산구: 'gwangsan',
  // 대전
  유성구: 'yuseong',
  대덕구: 'daedeok',
  // 울산
  울주군: 'ulju',

  // ── 경기 31개 시/군 ──
  수원시: 'suwon',
  고양시: 'goyang',
  화성시: 'hwaseong',
  용인시: 'yongin',
  남양주시: 'namyangju',
  성남시: 'seongnam',
  평택시: 'pyeongtaek',
  김포시: 'gimpo',
  부천시: 'bucheon',
  파주시: 'paju',
  안산시: 'ansan',
  시흥시: 'siheung',
  의정부시: 'uijeongbu',
  하남시: 'hanam',
  광주시: 'gwangju-si', // ⚠️ 광주광역시(gwangju)와 구분
  양주시: 'yangju',
  안양시: 'anyang',
  이천시: 'icheon',
  구리시: 'guri',
  광명시: 'gwangmyeong',
  안성시: 'anseong',
  포천시: 'pocheon',
  오산시: 'osan',
  여주시: 'yeoju',
  양평군: 'yangpyeong',
  군포시: 'gunpo',
  동두천시: 'dongducheon',
  의왕시: 'uiwang',
  가평군: 'gapyeong',
  연천군: 'yeoncheon',
  과천시: 'gwacheon',

  // ── 강원 18개 시/군 ──
  원주시: 'wonju',
  강릉시: 'gangneung',
  춘천시: 'chuncheon',
  속초시: 'sokcho',
  동해시: 'donghae',
  영월군: 'yeongwol',
  양양군: 'yangyang',
  삼척시: 'samcheok',
  철원군: 'cheorwon',
  평창군: 'pyeongchang',
  홍천군: 'hongcheon',
  횡성군: 'hoengseong',
  고성군: 'goseong', // ⚠️ 강원/경남 둘 다 존재 → sido로 구분
  인제군: 'inje',
  화천군: 'hwacheon',
  태백시: 'taebaek',
  양구군: 'yanggu',
  정선군: 'jeongseon',

  // ── 충북 11개 시/군 ──
  청주시: 'cheongju',
  충주시: 'chungju',
  제천시: 'jecheon',
  진천군: 'jincheon',
  음성군: 'eumseong',
  옥천군: 'okcheon',
  영동군: 'yeongdong',
  증평군: 'jeungpyeong',
  보은군: 'boeun',
  괴산군: 'goesan',
  단양군: 'danyang',

  // ── 충남 15개 시/군 ──
  천안시: 'cheonan',
  아산시: 'asan',
  당진시: 'dangjin',
  논산시: 'nonsan',
  서산시: 'seosan',
  공주시: 'gongju',
  홍성군: 'hongseong',
  예산군: 'yesan',
  보령시: 'boryeong',
  태안군: 'taean',
  부여군: 'buyeo',
  금산군: 'geumsan',
  서천군: 'seocheon',
  계룡시: 'gyeryong',
  청양군: 'cheongyang',

  // ── 전북 14개 시/군 ──
  전주시: 'jeonju',
  익산시: 'iksan',
  군산시: 'gunsan',
  정읍시: 'jeongeup',
  김제시: 'gimje',
  남원시: 'namwon',
  완주군: 'wanju',
  고창군: 'gochang',
  부안군: 'buan',
  순창군: 'sunchang',
  진안군: 'jinan',
  임실군: 'imsil',
  무주군: 'muju',
  장수군: 'jangsu',

  // ── 전남 22개 시/군 ──
  순천시: 'suncheon',
  여수시: 'yeosu',
  목포시: 'mokpo',
  나주시: 'naju',
  광양시: 'gwangyang',
  무안군: 'muan',
  영광군: 'yeonggwang',
  화순군: 'hwasun',
  해남군: 'haenam',
  담양군: 'damyang',
  장흥군: 'jangheung',
  고흥군: 'goheung',
  영암군: 'yeongam',
  함평군: 'hampyeong',
  완도군: 'wando',
  보성군: 'boseong',
  구례군: 'gurye',
  장성군: 'jangseong',
  강진군: 'gangjin',
  곡성군: 'gokseong',
  진도군: 'jindo',
  신안군: 'sinan',

  // ── 경북 21개 시/군 ──
  포항시: 'pohang',
  구미시: 'gumi',
  경산시: 'gyeongsan',
  경주시: 'gyeongju',
  칠곡군: 'chilgok',
  김천시: 'gimcheon',
  영천시: 'yeongcheon',
  안동시: 'andong',
  영주시: 'yeongju',
  상주시: 'sangju',
  문경시: 'mungyeong',
  울진군: 'uljin',
  의성군: 'uiseong',
  예천군: 'yecheon',
  성주군: 'seongju',
  청도군: 'cheongdo',
  영덕군: 'yeongdeok',
  고령군: 'goryeong',
  봉화군: 'bonghwa',
  청송군: 'cheongsong',
  영양군: 'yeongyang',
  울릉군: 'ulleung',

  // ── 경남 18개 시/군 (고성군: 강원과 동명 → 위 강원 섹션 정의 goseong 공유) ──
  창원시: 'changwon',
  김해시: 'gimhae',
  양산시: 'yangsan',
  진주시: 'jinju',
  거제시: 'geoje',
  사천시: 'sacheon',
  통영시: 'tongyeong',
  밀양시: 'miryang',
  창녕군: 'changnyeong',
  거창군: 'geochang',
  함안군: 'haman',
  합천군: 'hapcheon',
  하동군: 'hadong',
  남해군: 'namhae',
  산청군: 'sancheong',
  함양군: 'hamyang',
  의령군: 'uiryeong',

  // ── 제주 2개 시 ──
  제주시: 'jeju-si', // ⚠️ 제주도(jeju)와 구분
  서귀포시: 'seogwipo',
});

// ⚠️ 동명(同名) 주의:
//  - 구: 서구/동구/남구/북구/중구는 여러 광역시에 존재. URL의 sido가 앞에 와 유일성 보장.
//  - 시/도 vs 시: 광주광역시(gwangju) vs 경기 광주시(gwangju-si), 제주도(jeju) vs 제주시(jeju-si)
//    → 시 슬러그에 -si 접미로 충돌 회피.
//  - 고성군: 강원·경남 둘 다 존재 → sido로 구분(슬러그 goseong 공유 안전).

export const MIN_FACILITIES_PER_PAGE = 3;
