import { BUSINESS_INFO, CONTACT_EMAIL } from '../../constants/stores';
import styles from './Footer.module.css';

// 처리방침/이용약관(사이트 내부 화면 전환 #/privacy·#/terms) · 문의(이메일)
// · copyright · 사업자정보(AI Soft) 한 줄.
// 법적 문서는 새 창(target=_blank)이 아닌 해시 라우팅으로 사이트 내에서 표시한다.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={['container', styles.inner].join(' ')}>
        <nav className={styles.links} aria-label="법적 고지 및 문의">
          <a href="#/privacy">개인정보 처리방침</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="#/terms">이용약관</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href={`mailto:${CONTACT_EMAIL}`}>문의 {CONTACT_EMAIL}</a>
        </nav>

        <p className={styles.business}>{BUSINESS_INFO}</p>
        <p className={styles.copyright}>© {year} MyPet. All rights reserved.</p>
      </div>
    </footer>
  );
}
