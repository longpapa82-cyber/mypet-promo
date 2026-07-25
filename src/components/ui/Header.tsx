import type { MouseEvent } from 'react';
import { asset } from '../../constants/stores';
import StoreCTA from './StoreCTA';
import styles from './Header.module.css';

// 브랜드 클릭 = 어느 라우트(home/privacy/terms)에서든 홈 복귀.
// 해시를 비워 useHashRoute가 'home'으로 판정하게 하고, home에서는 최상단으로 스크롤.
// (앵커(#top) 대신 hash='' 를 써서 URL에 잔여 앵커가 남지 않게 한다.)
function goHome(e: MouseEvent<HTMLAnchorElement>) {
  if (typeof window === 'undefined') return;
  e.preventDefault();
  if (window.location.hash) {
    window.location.hash = '';
  } else {
    window.scrollTo({ top: 0 });
  }
}

// sticky 상단바: 로고(logo.png, 작은 헤더용) + "MyPet" + 네비 + 우측 작은 StoreCTA. glass/blur 배경.
// 메인·법적(개인정보/약관) 페이지 공용 GNB(단일 소스). 헤더는 경량 logo.png(수 KB)만 사용한다
// (무거운 1024px 스토어 아이콘은 스토어 콘솔에만 보관, 웹 번들 제외).
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={[styles.inner, 'container'].join(' ')}>
        <div className={styles.left}>
          <a className={styles.brand} href="#top" onClick={goHome} aria-label="MyPet 홈">
            <img className={styles.logo} src={asset('assets/logo.png')} alt="MyPet 로고" width={36} height={36} />
            <span className={styles.name}>MyPet</span>
          </a>
          {/* [GNB 동기화] 네비 링크·순서는 정적 헤더(scripts/lib/page-shell.mjs
              renderHeader)와 일치시켜 유지한다. 항목 변경 시 두 곳을 함께 수정. */}
          <nav className={styles.nav} aria-label="사이트 메뉴">
            <a className={styles.navLink} href="/blog/">
              블로그
            </a>
            <a className={styles.navLink} href="/near/">
              지역
            </a>
          </nav>
        </div>
        <div className={styles.actions}>
          <StoreCTA className={styles.cta} />
        </div>
      </div>
    </header>
  );
}
