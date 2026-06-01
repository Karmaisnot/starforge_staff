import { cx } from './cx.js';
import styles from './AiBadge.module.css';

/**
 * Signature AI badge — saffron halo pill with an italic "Ai" mark.
 * @param {{ compact?: boolean, className?: string, children?: any }} props
 */
export function AiBadge({ compact = false, className, children }) {
  return (
    <span className={cx(styles.badge, compact && styles.compact, className)}>
      <span className={styles.mark}>Ai</span>
      {children}
    </span>
  );
}
