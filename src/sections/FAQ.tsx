import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Aurora from '../components/ui/Aurora';
import SectionDoodles from '../components/ui/SectionDoodles';
import PhotoBackdrop from '../components/ui/PhotoBackdrop';
import styles from './FAQ.module.css';

interface FaqItem {
  q: string;
  a: string;
}

// 정적 홍보 사이트: 자주 묻는 질문 5개. 시맨틱 details/summary 아코디언.
const FAQ_ITEMS: readonly FaqItem[] = [
  {
    q: '무료로 쓸 수 있나요?',
    a: 'MyPet의 핵심 기능은 무료입니다. 내 주변 펫 시설 검색과 AI 건강·법률 상담을 무료로 이용할 수 있어요. 광고를 제거하고 AI 상담을 더 자유롭게(개인 이용 범위 내 무제한, 공정사용 정책 적용) 쓰고 싶다면 월 구독 프리미엄을 선택할 수 있습니다.',
  },
  {
    q: 'AI 상담 답변을 믿어도 되나요?',
    a: 'AI 상담은 일반적인 정보 제공과 참고 용도입니다. 진단이 아니며 의료·법률 행위를 대체하지 않습니다. 반려동물의 건강이 걱정된다면 반드시 수의사에게, 법률 문제는 전문가에게 상담하세요. MyPet은 정확한 정보를 돕되 최종 판단은 전문가와 함께하시길 권합니다.',
  },
  {
    q: '어떤 시설을 찾을 수 있나요?',
    a: '동물병원, 미용실, 호텔, 용품점 등 다양한 반려동물 시설을 찾을 수 있으며, 카테고리는 계속 확대 중입니다. 등록된 3만여 곳을 현재 위치 기준 거리순으로 보여주고, 확인된 시설은 운영 시간 정보도 함께 제공합니다.',
  },
  {
    q: '구독은 어떻게 해지하나요?',
    a: '프리미엄 구독은 월 자동 갱신 상품으로, 해지하기 전까지 매월 자동으로 결제됩니다. 언제든지 스토어 설정에서 해지할 수 있어요. iOS는 App Store의 구독 관리, Android는 Google Play의 정기 결제 관리에서 직접 해지하면 됩니다. 해지 후에도 이미 결제한 기간이 끝날 때까지 프리미엄 혜택은 유지됩니다.',
  },
  {
    q: '어떤 기기에서 지원되나요?',
    a: 'iOS는 App Store, Android는 Google Play에서 무료로 내려받을 수 있습니다. 아래 설치 버튼으로 사용하시는 기기의 스토어로 바로 이동할 수 있어요.',
  },
];

export default function FAQ() {
  return (
    <Section id="faq" background="creamAlt">
      {/* v7.1: 실사 고양이 배경(우측) — 단색 탈피. 좌측 크림 페이드로 텍스트 보호. */}
      <PhotoBackdrop name="hero-cat" side="right" />
      <Aurora variant="cream" />
      <SectionDoodles set="peach" />
      <Reveal>
        <div className={styles.heading}>
          <p className={`t-label-md ${styles.eyebrow}`}>자주 묻는 질문</p>
          <h2 className="t-headline-lg"><span style={{ color: 'var(--accent-deep)' }}>궁금한 점</span>이 있으신가요?</h2>
          <p className={`t-body-lg ${styles.lead}`}>
            설치 전에 가장 많이 묻는 질문을 모았어요.
          </p>
        </div>
      </Reveal>

      <div className={styles.list}>
        {/* v10: 아이템별 stagger 등장(착착 안무) — 각 Reveal에 순차 delay. */}
        {FAQ_ITEMS.map((item, index) => (
          <Reveal key={item.q} delay={index * 80}>
            <details className={styles.item} open={index === 0}>
              <summary className={styles.summary}>
                <span className={`t-body-lg ${styles.question}`}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={`t-body-md ${styles.answer}`}>{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
