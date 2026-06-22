import { useEffect, useState } from 'react';
import StoreBadge from './StoreBadge';
import { PLAY_STORE } from '../../constants/stores';
import styles from './StoreCTA.module.css';

type Platform = 'ios' | 'android' | 'both';

interface StoreCTAProps {
  className?: string;
  align?: 'start' | 'center';
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'both';
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'both';
}

// 두 배지를 묶고 UA 기반 자동 분기.
// SSR-safe: 초기 렌더는 'both'(둘 다 노출) → 마운트 후 useEffect로 플랫폼 판별.
// 스토어 상태는 stores.ts 단일소스를 따른다(iOS·Android 모두 출시됨 → 안내 미표시).
// 한쪽이 다시 coming-soon이 되면 해당 UA에서만 "곧 출시" 안내가 자동 노출된다.
export default function StoreCTA({ className, align = 'start' }: StoreCTAProps) {
  const [platform, setPlatform] = useState<Platform>('both');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isAndroid = platform === 'android';
  const androidComingSoon = PLAY_STORE.status === 'coming-soon';

  return (
    <div
      className={[styles.wrap, align === 'center' ? styles.center : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[styles.cta, align === 'center' ? styles.center : ''].filter(Boolean).join(' ')}>
        {/* iOS는 출시되어 활성. Android UA에서는 App Store를 먼저(강조) 노출 */}
        <StoreBadge store="ios" className={isAndroid ? styles.emphasis : undefined} />
        <StoreBadge store="android" />
      </div>

      {isAndroid && androidComingSoon && (
        <p className={styles.notice} role="note">
          iOS 버전이 먼저 출시되었어요. Android 버전은 곧 출시됩니다.
        </p>
      )}
    </div>
  );
}
