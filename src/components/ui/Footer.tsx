import { BUSINESS_INFO, COMPANY_URL, CONTACT_EMAIL } from '../../constants/stores';
import styles from './Footer.module.css';

// 인기 지역 바로가기 — 전 페이지 푸터에서 깊은 지역 index로 크롤 경로 보강(SEO).
// 시설 페이지가 많은 순(경기 91·서울 75·부산 47 …)으로 수도권+주요 광역시 선정.
const POPULAR_REGIONS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/near/seoul/', label: '서울' },
  { href: '/near/gyeonggi/', label: '경기' },
  { href: '/near/busan/', label: '부산' },
  { href: '/near/incheon/', label: '인천' },
  { href: '/near/daegu/', label: '대구' },
  { href: '/near/daejeon/', label: '대전' },
];

// 처리방침/이용약관(사이트 내부 화면 전환 #/privacy·#/terms) · 문의(이메일)
// · 회사소개(에이아이소프트 외부 사이트, 새 창) · copyright · 사업자정보(에이아이소프트) 한 줄.
// 법적 문서는 새 창(target=_blank)이 아닌 해시 라우팅으로 사이트 내에서 표시하고,
// 외부 회사 사이트만 새 창(rel=noopener)으로 연다.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={['container', styles.inner].join(' ')}>
        <nav className={styles.regions} aria-label="지역별 반려동물 시설 바로가기">
          <span className={styles.regionsLabel}>지역별 시설 찾기</span>
          {POPULAR_REGIONS.map((r) => (
            <a key={r.href} href={r.href}>
              {r.label}
            </a>
          ))}
        </nav>
        <nav className={styles.links} aria-label="법적 고지 및 문의">
          <a href="/blog/">블로그</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="/near/">지역별 시설 찾기</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="#/privacy">개인정보 처리방침</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="#/terms">이용약관</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href={`mailto:${CONTACT_EMAIL}`}>문의 {CONTACT_EMAIL}</a>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
            회사소개
          </a>
        </nav>

        <p className={styles.business}>{BUSINESS_INFO}</p>
        <p className={styles.copyright}>© {year} MyPet. All rights reserved.</p>
      </div>
    </footer>
  );
}
