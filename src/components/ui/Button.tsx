import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary';
type Size = 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'href'> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | 'href'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// squishy CTA. 연두(primary 토큰) 배경 금지 규칙 준수:
// primary 변형은 green 배경 + 흰 텍스트, secondary는 윤곽선.
export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children, className } = props;

  const cls = [
    'squishy',
    variant === 'primary' ? 'btn-primary' : 'btn-secondary',
    styles.button,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (props.href !== undefined) {
    const { variant: _v, size: _s, children: _c, className: _cn, href, ...rest } = props;
    return (
      <a className={cls} href={href} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, children: _c, className: _cn, href: _h, ...rest } = props;
  return (
    <button className={cls} type={rest.type ?? 'button'} {...rest}>
      {children}
    </button>
  );
}
