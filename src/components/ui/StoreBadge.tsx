import { APP_STORE, PLAY_STORE, type StoreStatus } from '../../constants/stores';
import styles from './StoreBadge.module.css';

type Store = 'ios' | 'android';

interface StoreBadgeProps {
  store: Store;
  /** 출시 상태 override — 미지정 시 stores.ts 기본값(iOS=live, Android=coming-soon) */
  status?: StoreStatus;
  className?: string;
}

const CONFIG = {
  ios: {
    info: APP_STORE,
    label: 'App Store에서 다운로드',
    small: 'Download on the',
    big: 'App Store',
    aria: 'App Store에서 MyPet 다운로드',
    soonAria: 'App Store 출시 예정',
  },
  android: {
    info: PLAY_STORE,
    label: 'Google Play에서 다운로드',
    small: 'GET IT ON',
    big: 'Google Play',
    aria: 'Google Play에서 MyPet 다운로드',
    soonAria: 'Google Play 출시 예정',
  },
} as const;

function AppleIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.05 12.74c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.04 8.23.69 1 1.5 2.11 2.57 2.07 1.03-.04 1.42-.67 2.67-.67 1.24 0 1.6.67 2.69.65 1.11-.02 1.81-1.01 2.49-2.01.78-1.15 1.1-2.27 1.12-2.33-.02-.01-2.14-.82-2.16-3.26zM15 6.6c.57-.69.95-1.65.85-2.6-.82.03-1.81.55-2.39 1.23-.52.61-.98 1.58-.86 2.51.91.07 1.83-.46 2.4-1.14z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#00d4ff" d="M3.6 2.3c-.3.3-.5.7-.5 1.3v16.8c0 .6.2 1 .5 1.3l.1.1L13 12.1v-.2L3.7 2.2l-.1.1z" />
      <path fill="#ffce00" d="M16.3 15.2 13 12.1v-.2l3.3-3.1.1.1 3.9 2.2c1.1.6 1.1 1.6 0 2.3l-3.9 2.2-.1-.4z" />
      <path fill="#00f076" d="M16.4 15.1 13 12 3.6 21.7c.4.4 1 .4 1.7.1l11.1-6.3" />
      <path fill="#ff3a44" d="M16.4 8.9 5.3 2.6c-.7-.4-1.3-.3-1.7.1L13 12l3.4-3.1z" />
    </svg>
  );
}

// 공식 스토어 배지 스타일: 검정 알약 + 스토어 아이콘 + 2줄 텍스트.
// coming-soon: 비활성(클릭 막힘, aria-disabled) + "출시 예정" 배지.
export default function StoreBadge({ store, status, className }: StoreBadgeProps) {
  const c = CONFIG[store];
  const resolved: StoreStatus = status ?? c.info.status;
  const comingSoon = resolved === 'coming-soon';

  const icon = store === 'ios' ? <AppleIcon /> : <PlayIcon />;
  const inner = (
    <>
      {icon}
      <span className={styles.text}>
        <span className={styles.small}>{c.small}</span>
        <span className={styles.big}>{c.big}</span>
      </span>
      {comingSoon && <span className={styles.soon}>출시 예정</span>}
    </>
  );

  if (comingSoon) {
    // button(aria-disabled)으로 렌더 → 키보드 포커스 도달 가능하되 동작 무효,
    // 스크린리더가 "출시 예정" 비활성으로 올바르게 안내. (role=link span은 포커스 불가였음)
    return (
      <button
        type="button"
        className={[styles.badge, styles.disabled, className].filter(Boolean).join(' ')}
        aria-disabled="true"
        aria-label={c.soonAria}
        onClick={(e) => e.preventDefault()}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      className={[styles.badge, className].filter(Boolean).join(' ')}
      href={c.info.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.aria}
    >
      {inner}
    </a>
  );
}
