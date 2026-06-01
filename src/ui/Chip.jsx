import { cx } from './cx.js';
import styles from './Chip.module.css';

/**
 * Status / category pill.
 * @param {{ tone?: 'neutral'|'primary'|'accent'|'success'|'warn'|'danger'|'ink'|'ai',
 *           className?: string, style?: object, children?: any }} props
 */
export function Chip({ tone = 'neutral', className, style, children }) {
  return (
    <span className={cx(styles.chip, styles[tone], className)} style={style}>
      {children}
    </span>
  );
}
