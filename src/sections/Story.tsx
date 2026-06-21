import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import DuotonePhoto from '../components/ui/DuotonePhoto';
import Doodle from '../components/ui/Doodle';
import styles from './Story.module.css';

/**
 * Story — 감성 스토리 섹션 (V4).
 *
 * 풀블리드 펫 실사(jewel green 듀오톤) + 오버레이 짧은 카피로 "가족·사랑" 감정을 전한다.
 * maximalist 사진 hero 트렌드. FAQ와 FinalCTA 사이에 배치해 마지막 설치 결심 직전 감정을 끌어올린다.
 * 텍스트 가독은 DuotonePhoto 스크림(bottom)이 담당. 신뢰 브랜드라 카피는 감성적이되 과장 없이.
 */
export default function Story() {
  return (
    <Section id="story" background="cream" fullBleed className={styles.story}>
      <DuotonePhoto
        name="hero-tip"
        className={styles.photo}
        intensity={0.55}
        scrimDir="bottom"
        position="center"
        decorative
      />
      <Reveal className={styles.inner}>
        <span className={`${styles.eyebrow} t-label-md`}>
          <Doodle kind="heart" size={16} color="var(--cute-coral)" />
          반려동물은 가족이니까
        </span>
        <h2 className={`${styles.heading} t-headline-lg`}>
          가족의 모든 순간,
          <br />
          MyPet이 함께합니다
        </h2>
        <p className={`${styles.body} t-body-lg`}>
          산책길의 병원 찾기부터 늦은 밤 건강 걱정까지 — 반려동물과의 하루하루를 더 안심하고
          따뜻하게.
        </p>
      </Reveal>
    </Section>
  );
}
