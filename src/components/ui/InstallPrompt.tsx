import { useEffect, useState } from 'react';
import { APP_STORE, PLAY_STORE } from '../../constants/stores';
import styles from './InstallPrompt.module.css';

/**
 * InstallPrompt — 모바일(iOS/Android) 접속 시 앱 설치 유도 바텀시트.
 *
 * 홍보 사이트의 핵심 목적(설치 유도)을 직접 강화. UA로 모바일만 노출,
 * 첫 방문 1회만(sessionStorage), 닫으면 그 세션 동안 다시 안 뜬다.
 * - iOS: App Store 출시(활성) → "App Store에서 설치"
 * - Android: Google Play 출시(활성) → "Google Play에서 설치"
 *   (stores.ts status가 coming-soon이면 "곧 출시" 안내로 자동 전환)
 * SSR-safe(마운트 후 판별), reduced-motion 시 슬라이드 모션 생략.
 */
type Platform = 'ios' | 'android' | 'other';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

const DISMISS_KEY = 'mypet-install-prompt-dismissed';

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>('other');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    if (p === 'other') return; // 데스크톱엔 안 띄움
    // 이번 세션에 이미 닫았으면 재노출 안 함
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    setPlatform(p);
    // 살짝 늦게 띄워(콘텐츠 먼저 보이고) 부드럽게 등장
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* sessionStorage 차단 환경 무시 */
    }
  };

  if (platform === 'other' || !open) return null;

  const isIos = platform === 'ios';
  const androidComingSoon = PLAY_STORE.status === 'coming-soon';

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="MyPet 앱 설치 안내">
      <button className={styles.scrim} aria-label="닫기" onClick={close} />
      <div className={styles.sheet}>
        <button className={styles.closeBtn} aria-label="닫기" onClick={close}>
          ✕
        </button>
        <div className={styles.handle} aria-hidden="true" />

        <picture>
          <source srcSet={`${import.meta.env.BASE_URL}assets/mascot-duo.webp`} type="image/webp" />
          <img
            className={styles.mascot}
            src={`${import.meta.env.BASE_URL}assets/mascot-duo.png`}
            alt=""
            width={120}
            height={84}
            aria-hidden="true"
          />
        </picture>

        <h2 className={styles.title}>앱으로 더 편하게 🐾</h2>
        <p className={styles.body}>
          {isIos || !androidComingSoon
            ? '내 주변 펫 시설 검색과 AI 건강·법률 상담을 MyPet 앱에서 바로 이용하세요.'
            : 'MyPet 앱은 곧 Google Play에 출시됩니다. iOS는 지금 App Store에서 만나보세요.'}
        </p>

        {isIos ? (
          <a className={styles.cta} href={APP_STORE.url} target="_blank" rel="noopener noreferrer" onClick={close}>
            App Store에서 설치
          </a>
        ) : (
          <a
            className={styles.cta}
            href={PLAY_STORE.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            {androidComingSoon ? 'Google Play에서 보기' : 'Google Play에서 설치'}
          </a>
        )}

        <button className={styles.later} onClick={close}>
          나중에 할게요
        </button>
      </div>
    </div>
  );
}
