import { asset } from '../../constants/stores';
import StoreCTA from './StoreCTA';
import styles from './Header.module.css';

// sticky 상단바: 로고(logo.png, 작은 헤더용) + "MyPet" + 우측 작은 StoreCTA. glass/blur 배경.
// 헤더는 경량 logo.png(수 KB)만 사용한다(무거운 1024px 스토어 아이콘은 스토어 콘솔에만 보관, 웹 번들 제외).
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={[styles.inner, 'container'].join(' ')}>
        <a className={styles.brand} href="#top" aria-label="MyPet 홈">
          <img className={styles.logo} src={asset('assets/logo.png')} alt="MyPet 로고" width={36} height={36} />
          <span className={styles.name}>MyPet</span>
        </a>
        <div className={styles.actions}>
          <StoreCTA className={styles.cta} />
        </div>
      </div>
    </header>
  );
}
