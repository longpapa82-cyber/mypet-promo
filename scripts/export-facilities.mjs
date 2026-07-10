// 일회성/주기 수동 실행 — Supabase(공개 읽기)에서 시설을 조회해
// web/content/facilities-snapshot.json 을 생성(커밋). 빌드는 이 JSON만 읽는다(네트워크 0).
//
// 실행: node --env-file=../app/.env web/scripts/export-facilities.mjs
//   (또는 EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY 를 env로 주입)
//
// 🔴 재배포 필터: source in ('publicdata','user') — kakao/naver 재배포 금지(약관).
// 🔴 카테고리 필터: category_id in (1,3,4,7) = hospital/grooming/hotel/store (스냅샷 축소).
// 좌표·평점 등 민감/비공개 필드 제외, 공개정보(상호·주소·전화)만.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRegion } from './lib/parse-region.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../content/facilities-snapshot.json');

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) {
  console.error('❌ EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY 필요');
  process.exit(1);
}

const CATEGORY_IDS = [1, 3, 4, 7];
const rest = `${URL.replace(/\/$/, '')}/rest/v1`;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function fetchAll(path) {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const res = await fetch(`${rest}/${path}`, {
      headers: { ...headers, Range: `${from}-${to}`, Prefer: 'count=exact' },
    });
    if (!res.ok) {
      console.error(`❌ ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}

// 1) 카테고리 코드 매핑(런타임 조회 — 하드코딩 금지, 스키마 드리프트 방지)
const cats = await fetchAll('facility_categories?select=id,code');
const codeById = Object.fromEntries(cats.map((c) => [c.id, c.code]));

// 2) 시설 조회: 카테고리·재배포·폐업 필터를 쿼리 단계에서 적용
const catFilter = `category_id=in.(${CATEGORY_IDS.join(',')})`;
const srcFilter = `source=in.(publicdata,user)`;
const notClosed = `license_status=not.eq.폐업`;
const select = `select=name,category_id,address,phone,source&${catFilter}&${srcFilter}&${notClosed}`;
const raw = await fetchAll(`facilities?${select}`);

// 3) 지역 파싱 + 정제
let kept = 0;
let dropped = 0;
const facilities = [];
for (const f of raw) {
  const region = parseRegion(f.address);
  if (!region) {
    dropped++;
    continue;
  }
  facilities.push({
    name: f.name,
    category: codeById[f.category_id],
    sido: region.sido,
    sidoKo: region.sidoKo,
    sigungu: region.sigungu,
    sigunguKo: region.sigunguKo,
    address: f.address,
    phone: f.phone ?? null,
  });
  kept++;
}

const snapshot = {
  generatedAt: new Date().toISOString().slice(0, 10),
  categories: Object.fromEntries(CATEGORY_IDS.map((id) => [id, codeById[id]])),
  facilities,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 0), 'utf-8');

const sizeKb = (JSON.stringify(snapshot).length / 1024).toFixed(0);
console.log(`✓ export: raw ${raw.length} → kept ${kept} / dropped ${dropped} (대상외 지역)`);
console.log(`✓ ${OUT} (${sizeKb} kB)`);
