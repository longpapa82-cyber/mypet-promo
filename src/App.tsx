// MyPet 홍보/설치유도 정적 사이트 — 전체 조립
// (서비스 직접 이용 불가: 스토어 설치 버튼만 제공)
//
// 라우팅: react-router 없이 useHashRoute(해시 + hashchange)로 home/privacy/terms 전환.
//   - 'home'  = 랜딩 섹션 전체
//   - 'privacy'/'terms' = 법적 문서 페이지(상단 이전/홈 버튼, 사이트 내부 화면 전환)
//   라이브 GitHub Pages(스토어 심사 URL)는 그대로 유지하고, 사이트 내 표시만 내부 전환한다.
//
// 섹션 순서 + 배경/Aurora 리듬(인접 섹션 분위기 교차로 깊이):
//   Hero(warm) → Value(skySoft) → Features(butterSoft) → HowTo(mintSoft)
//   → Premium(lavSoft) → FAQ(peachSoft) → FinalCTA(jewel·클라이맥스 다크)
//   각 인접 섹션이 서로 다른 hue 패밀리(하늘/버터/민트/라벤더/피치)라 경계가 또렷하다.
// 각 Section은 자체 id 앵커를 가진다(hero/services/features/how-to/premium/faq/download).

import { useEffect } from 'react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import SectionDivider from './components/ui/SectionDivider';
import Hero from './sections/Hero';
import Value from './sections/Value';
import Features from './sections/Features';
import HowTo from './sections/HowTo';
import Premium from './sections/Premium';
import FAQ from './sections/FAQ';
import FinalCTA from './sections/FinalCTA';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const route = useHashRoute();

  // 라우트 전환 시 본문 최상단으로 스크롤(법적 페이지 진입·홈 복귀 모두).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route === 'privacy') return <PrivacyPage />;
  if (route === 'terms') return <TermsPage />;

  return (
    <>
      {/* 키보드/스크린리더 사용자용 본문 바로가기 — 평소 숨김, 포커스 시 노출 */}
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      {/* Header의 로고 링크(#top)와 스킵 타깃 앵커 */}
      <span id="top" />
      <Header />
      <main id="main">
        {/* 섹션 사이 곡선 디바이더 — color=다음 섹션 배경색. 투명 top이 위 섹션 배경을 비춰 매끄럽게 연결.
            배경 톤: warm→sky→butter→mint→lav→peach→jewel(클라이맥스 다크). 인접 모두 다른 hue. */}
        <Hero />
        <SectionDivider variant="wave" color="var(--tint-sky)" />
        <Value />
        <SectionDivider variant="hill" color="var(--tint-butter)" />
        <Features />
        <SectionDivider variant="wave" color="var(--tint-mint)" />
        <HowTo />
        <SectionDivider variant="blob" color="var(--tint-lav)" />
        <Premium />
        <SectionDivider variant="wave" color="var(--tint-peach)" />
        <FAQ />
        <SectionDivider variant="hill" color="#1c3d30" />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
