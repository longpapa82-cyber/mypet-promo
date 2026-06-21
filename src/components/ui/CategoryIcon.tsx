/**
 * CategoryIcon — 펫 시설 카테고리 라인 SVG 아이콘(이모지 대체).
 * OS마다 다른 이모지(🏥✂️) 대신 통일된 디자인 아이콘으로 '목업/기본' 느낌 제거.
 * currentColor 스트로크 — 부모에서 색 지정(샴페인 톤). 24x24 viewBox.
 */
interface CategoryIconProps {
  kind: string;
  className?: string;
}

const PATHS: Record<string, React.ReactNode> = {
  // 동물병원 — 십자 + 하트
  hospital: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2.5" />
      <path d="M12 10v6M9 13h6" />
      <path d="M8 6V4.5h8V6" />
    </>
  ),
  // 미용실 — 가위
  grooming: (
    <>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="6" cy="17" r="2.2" />
      <path d="M8 8.4 19 16M8 15.6 19 8" />
    </>
  ),
  // 호텔 — 침대
  hotel: (
    <>
      <path d="M3 8v10M3 13h18v5M21 18v-4a3 3 0 0 0-3-3h-7v3" />
      <circle cx="7.5" cy="11" r="1.6" />
    </>
  ),
  // 용품점 — 쇼핑백
  store: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  // 유치원 — 가방
  daycare: (
    <>
      <rect x="5" y="8" width="14" height="12" rx="3" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2M5 13h14" />
    </>
  ),
  // 훈련소 — 뼈
  training: (
    <>
      <path d="M7 9.5a2 2 0 1 0-2.2 2.4M7 14.5a2 2 0 1 1-2.2-2.4M17 9.5a2 2 0 1 1 2.2 2.4M17 14.5a2 2 0 1 0 2.2-2.4" />
      <path d="M6.8 11.9h10.4" />
    </>
  ),
  // 공원 — 나무
  park: (
    <>
      <path d="M12 3c3 0 5 2.4 5 5.2 0 2.2-1.4 3.6-3 4.2 1.8.4 3 1.8 3 3.6H7c0-1.8 1.2-3.2 3-3.6-1.6-.6-3-2-3-4.2C7 5.4 9 3 12 3Z" />
      <path d="M12 17v4" />
    </>
  ),
  // 식당 — 포크+나이프
  restaurant: (
    <>
      <path d="M8 3v8M6 3v4a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5ZM16 12v9" />
    </>
  ),
};

export default function CategoryIcon({ kind, className }: CategoryIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[kind] ?? PATHS.store}
    </svg>
  );
}
