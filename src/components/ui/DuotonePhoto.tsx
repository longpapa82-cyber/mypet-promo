import styles from './DuotonePhoto.module.css';

/**
 * DuotonePhoto — 실사 사진 위에 jewel green 듀오톤 wash + 크림 하이라이트 + (선택) 스크림을 합성.
 *
 * 어떤 펫 사진이 와도 **한 브랜드 톤(jewel green)**으로 묶어, claymorphism 일러스트와 충돌 없이
 * 통일된 화려한 깊이를 만든다. (앱 duotone-photo.tsx의 웹 CSS 버전 — expo 대신 순수 CSS 그라데이션.)
 *
 * 레이어(아래→위): ① 사진(webp+jpg 폴백, cover) ② green 듀오톤 wash(intensity) ③ 크림 하이라이트
 * ④ 스크림(텍스트 가독용, scrim·scrimDir). 장식 배경이면 alt="" + aria-hidden.
 */
type ScrimDir = 'bottom' | 'left' | 'top' | 'none';

interface DuotonePhotoProps {
  /** assets/ 기준 파일명(확장자 제외). 예: 'hero-pet' → hero-pet.webp + hero-pet.jpg 폴백 */
  name: string;
  alt?: string;
  /** 듀오톤 wash 세기 0~1. 낮을수록 원본 사진이 비침. 기본 0.5(절제된 화려함). */
  intensity?: number;
  /** 텍스트 가독용 스크림 방향. 기본 'bottom'. */
  scrimDir?: ScrimDir;
  className?: string;
  /** object-position (사진 초점). 기본 'center'. */
  position?: string;
  /** 배경 장식이면 true → aria-hidden(스크린리더 무시). */
  decorative?: boolean;
}

const asset = (file: string): string => `${import.meta.env.BASE_URL}assets/${file}`;

export default function DuotonePhoto({
  name,
  alt = '',
  intensity = 0.5,
  scrimDir = 'bottom',
  className,
  position = 'center',
  decorative = false,
}: DuotonePhotoProps) {
  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <picture>
        <source srcSet={asset(`${name}.webp`)} type="image/webp" />
        <img
          className={styles.img}
          src={asset(`${name}.jpg`)}
          alt={decorative ? '' : alt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: position }}
        />
      </picture>
      {/* green 듀오톤 wash — 사진 hue를 브랜드 톤으로 통일 */}
      <span className={styles.wash} style={{ opacity: intensity }} aria-hidden="true" />
      {/* 크림 하이라이트 — 상단에서 따뜻한 빛 */}
      <span className={styles.highlight} aria-hidden="true" />
      {/* 스크림 — 텍스트 가독(방향별) */}
      {scrimDir !== 'none' && (
        <span className={[styles.scrim, styles[`scrim_${scrimDir}`]].join(' ')} aria-hidden="true" />
      )}
    </div>
  );
}
