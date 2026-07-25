import type { ReactNode } from 'react';
import Header from '../components/ui/Header';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  /** 접근성: 페이지 전체 라벨 */
  ariaLabel: string;
  children: ReactNode;
}

// 법적 문서(약관·처리방침) 공통 레이아웃.
// GNB는 메인과 동일한 공용 <Header>(브랜드 클릭=홈, 네비, StoreCTA)를 사용한다.
// 외부 새 창(target=_blank) 대신 사이트 내부 화면 전환으로 표시한다.
export default function LegalPage({ ariaLabel, children }: LegalPageProps) {
  return (
    <div className={styles.page} aria-label={ariaLabel}>
      <Header />
      <article className={styles.doc}>{children}</article>
    </div>
  );
}
