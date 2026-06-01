import { cx } from './cx.js';
import { Icon } from './icons/Icon.jsx';
import styles from './Button.module.css';

/**
 * Pill button. Visual variants map 1:1 to the design system.
 *
 * @param {{
 *   variant?: 'primary'|'soft'|'ghost'|'ink'|'cream'|'cream-ghost',
 *   block?: boolean, icon?: string, iconSize?: number, iconRight?: boolean,
 *   type?: string, onClick?: Function, className?: string, style?: object, children?: any
 * }} props
 */
export function Button({
  variant = 'soft',
  block = false,
  icon,
  iconSize = 14,
  iconRight = false,
  type = 'button',
  onClick,
  className,
  style,
  children,
  ...rest
}) {
  const glyph = icon ? <Icon name={icon} size={iconSize} /> : null;
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(styles.btn, styles[variant], block && styles.block, className)}
      style={style}
      {...rest}
    >
      {!iconRight && glyph}
      {children}
      {iconRight && glyph}
    </button>
  );
}
