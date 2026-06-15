import { cx } from './cx.js';
import { Icon } from './icons/Icon.jsx';
import styles from './FilterChip.module.css';

/**
 * Toggleable filter chip with an optional count.
 * @param {{ label: string, count?: number, active?: boolean, icon?: string,
 *           onClick?: Function }} props
 */
export function FilterChip({ label, count, active = false, icon, onClick }) {
  return (
    <button type="button" className={cx(styles.chip, active && styles.on)} aria-pressed={active} onClick={onClick}>
      {icon && <Icon name={icon} size={12} />}
      {label}
      {count != null && <span className={styles.count}>{count}</span>}
    </button>
  );
}
