import { asset } from '../../constants/stores';
import styles from './PhotoBackdrop.module.css';

type Side = 'left' | 'right';

interface PhotoBackdropProps {
  /** public/assets 내 파일명(확장자 제외). webp + png 폴백. */
  name: string;
  /** 사진이 붙는 쪽(반대쪽으로 크림 페이드). */
  side?: Side;
  /** alt(장식이면 생략 — aria-hidden). */
  alt?: string;
  className?: string;
}

/**
 * 섹션 배경 실사 레이어 — 단색 크림 탈피·진짜 사이트 느낌(v7.1).
 * 실사 동물 사진을 섹션 한쪽에 깔고, 반대쪽으로 크림 그라디언트 페이드 + 따뜻한 톤 오버레이로
 * 텍스트 가독을 지킨다. 콘텐츠 뒤(z-index 0), pointer-events none.
 */
export default function PhotoBackdrop({ name, side = 'right', alt, className }: PhotoBackdropProps) {
  return (
    <div
      className={[styles.wrap, styles[side], className].filter(Boolean).join(' ')}
      aria-hidden={alt ? undefined : true}
    >
      <picture>
        <source srcSet={asset(`assets/${name}.webp`)} type="image/webp" />
        <img className={styles.img} src={asset(`assets/${name}.jpg`)} alt={alt ?? ''} loading="lazy" decoding="async" />
      </picture>
      <span className={styles.fade} />
    </div>
  );
}
