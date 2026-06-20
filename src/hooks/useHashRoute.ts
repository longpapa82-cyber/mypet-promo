import { useEffect, useState } from 'react';

// 라우팅 라이브러리 없이(번들 최소) 해시 기반 뷰 전환.
// 'home' = 랜딩(해시 없음/앵커), 'privacy'·'terms' = 법적 문서 페이지.
// 딥링크(#/privacy 직접 접속)·브라우저 뒤로가기는 hashchange 이벤트로 동작.
export type Route = 'home' | 'privacy' | 'terms';

function parseHash(): Route {
  if (typeof window === 'undefined') return 'home';
  // '#/privacy' · '#privacy' 모두 허용, 앞쪽 '#'와 '/' 제거 후 판별.
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (raw === 'privacy') return 'privacy';
  if (raw === 'terms') return 'terms';
  return 'home';
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
