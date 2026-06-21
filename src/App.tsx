// MyPet 홍보/설치유도 정적 사이트 — 전체 조립
// (서비스 직접 이용 불가: 스토어 설치 버튼만 제공)
//
// 라우팅: react-router 없이 useHashRoute(해시 + hashchange)로 home/privacy/terms 전환.
//   - 'home'  = 랜딩 섹션 전체
//   - 'privacy'/'terms' = 법적 문서 페이지(상단 이전/홈 버튼, 사이트 내부 화면 전환)
//   라이브 GitHub Pages(스토어 심사 URL)는 그대로 유지하고, 사이트 내 표시만 내부 전환한다.
//
// 섹션 순서 + 배경/Aurora 리듬(인접 섹션 분위기 교차로 깊이):
//   Hero(warm) → Value(skySoft) → Features(surface·폰목업 주인공이라 중립) → HowTo(mintSoft)
//   → Premium(lavSoft) → FAQ(peachSoft) → FinalCTA(jewel·클라이맥스 다크)
//   각 인접 섹션이 서로 다른 hue 패밀리(하늘/버터/민트/라벤더/피치)라 경계가 또렷하다.
// 각 Section은 자체 id 앵커를 가진다(hero/services/features/how-to/premium/faq/download).

import { useEffect } from 'react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Hero from './sections/Hero';
import Value from './sections/Value';
import Features from './sections/Features';
import HowTo from './sections/HowTo';
import Premium from './sections/Premium';
import FAQ from './sections/FAQ';
import Story from './sections/Story';
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
        {/* v7.1: SectionDivider 제거 — 단일 크림 톤 + 발자국 패턴이 연속되므로 디바이더(96px 빈 띠)가
            오히려 패턴을 끊어 '중간 끊김'을 만들었다(사용자 지적). 섹션들이 패턴·톤으로 자연 연결. */}
        <Hero />
        <Value />
        <Features />
        <HowTo />
        <Premium />
        <FAQ />
        {/* 감성 스토리 → FinalCTA 자연 연결(크림 톤 유지). */}
        <Story />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
