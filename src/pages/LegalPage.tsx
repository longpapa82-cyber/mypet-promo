import type { ReactNode } from 'react';
import { asset } from '../constants/stores';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  /** 접근성: 페이지 전체 라벨 */
  ariaLabel: string;
  children: ReactNode;
}

// 홈 — 해시 제거(home 뷰). 웹 표준: 로고 클릭 = 홈.
function goHome() {
  if (typeof window === 'undefined') return;
  window.location.hash = '';
}

// 법적 문서(약관·처리방침) 공통 레이아웃.
// 상단 sticky 헤더에 MyPet 로고+워드마크 하나(클릭=홈, 웹 표준) + 스크롤 본문.
// 외부 새 창(target=_blank) 대신 사이트 내부 화면 전환으로 표시한다.
export default function LegalPage({ ariaLabel, children }: LegalPageProps) {
  return (
    <div className={styles.page} aria-label={ariaLabel}>
      <header className={styles.bar}>
        <button type="button" className={styles.brand} onClick={goHome} aria-label="MyPet 홈">
          <img className={styles.logo} src={asset('assets/logo.png')} alt="MyPet 로고" width={30} height={30} />
          <span className={styles.name}>MyPet</span>
        </button>
      </header>
      <article className={styles.doc}>{children}</article>
    </div>
  );
}
