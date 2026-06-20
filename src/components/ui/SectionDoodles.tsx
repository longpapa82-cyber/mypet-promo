/**
 * SectionDoodles — 섹션 배경 모서리에 깜찍 도들(발자국·하트·별·반짝임)을 흩뿌리는 장식 레이어.
 *
 * 각 색 밴드(sky/butter/mint/lav/peach)에 어울리는 도들 세트를 코너 여백에 배치한다.
 * 콘텐츠 위가 아니라 뒤(z-index 0, pointer 비활성)에 깔리며, 둥실(cute-float)·박동(cute-pulse)으로 살아 움직인다.
 * 장식 전용 → aria-hidden. reduced-motion 시 모션은 tokens.css에서 자동 정지.
 *
 * 사용: <Section> 안 최상단에 <SectionDoodles set="sky" /> 한 줄.
 */
import Doodle from './Doodle';
import styles from './SectionDoodles.module.css';

type DoodleSet = 'sky' | 'butter' | 'mint' | 'lav' | 'peach';

interface Placed {
  kind: 'paw' | 'heart' | 'star' | 'sparkle' | 'bone';
  color: string;
  size: number;
  /** 코너/위치 클래스 */
  pos: 'tl' | 'tr' | 'bl' | 'br';
  /** 둥실 vs 박동 */
  motion: 'float' | 'pulse';
  /** 살짝 기울여 손그림 느낌 */
  tilt?: number;
  delay?: number;
}

// 밴드별 도들 구성 — 색은 cute 액센트 토큰. 코너에 2~3개씩, 크기·딜레이 분산.
const SETS: Record<DoodleSet, Placed[]> = {
  sky: [
    { kind: 'paw', color: 'var(--secondary)', size: 30, pos: 'tr', motion: 'float', tilt: -12, delay: 0 },
    { kind: 'sparkle', color: 'var(--cute-butter)', size: 22, pos: 'bl', motion: 'pulse', tilt: 8, delay: 0.6 },
    { kind: 'paw', color: 'var(--cute-lav)', size: 20, pos: 'br', motion: 'float', tilt: 14, delay: 1.2 },
  ],
  butter: [
    { kind: 'star', color: 'var(--cute-butter)', size: 30, pos: 'tl', motion: 'pulse', tilt: -8, delay: 0.2 },
    { kind: 'heart', color: 'var(--cute-coral)', size: 22, pos: 'tr', motion: 'float', tilt: 10, delay: 0.8 },
    { kind: 'sparkle', color: 'var(--gold)', size: 20, pos: 'br', motion: 'pulse', tilt: 0, delay: 1.4 },
  ],
  mint: [
    { kind: 'paw', color: 'var(--tertiary)', size: 30, pos: 'tl', motion: 'float', tilt: 12, delay: 0 },
    { kind: 'bone', color: 'var(--cute-butter-ink)', size: 24, pos: 'br', motion: 'float', tilt: -8, delay: 0.7 },
    { kind: 'star', color: 'var(--cute-butter)', size: 22, pos: 'tr', motion: 'float', tilt: 6, delay: 1.3 },
  ],
  lav: [
    { kind: 'sparkle', color: 'var(--cute-lav)', size: 28, pos: 'tr', motion: 'pulse', tilt: 0, delay: 0.3 },
    { kind: 'bone', color: 'var(--gold)', size: 24, pos: 'bl', motion: 'float', tilt: -14, delay: 0.9 },
    { kind: 'paw', color: 'var(--cute-coral)', size: 20, pos: 'br', motion: 'float', tilt: 10, delay: 1.5 },
  ],
  peach: [
    { kind: 'heart', color: 'var(--cute-coral)', size: 30, pos: 'tl', motion: 'pulse', tilt: -10, delay: 0 },
    { kind: 'paw', color: 'var(--cute-butter-ink)', size: 20, pos: 'tr', motion: 'float', tilt: 12, delay: 0.6 },
    { kind: 'sparkle', color: 'var(--gold)', size: 22, pos: 'bl', motion: 'pulse', tilt: 0, delay: 1.2 },
  ],
};

export default function SectionDoodles({ set }: { set: DoodleSet }) {
  const items = SETS[set];
  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((d, i) => (
        // 바깥 .slot = 위치+기울기(정적), 안쪽 span = 모션(transform 충돌 방지로 분리).
        <span
          key={i}
          className={[styles.slot, styles[d.pos]].join(' ')}
          style={{ transform: `rotate(${d.tilt ?? 0}deg)` }}
        >
          <span
            className={d.motion === 'float' ? 'cute-float' : 'cute-pulse'}
            style={{ animationDelay: `${d.delay ?? 0}s`, display: 'inline-block' }}
          >
            <Doodle kind={d.kind} size={d.size} color={d.color} />
          </span>
        </span>
      ))}
    </div>
  );
}
