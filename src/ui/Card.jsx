import { cx } from './cx.js';
import styles from './Card.module.css';

/**
 * Surface card with an optional titled header + action slot.
 * @param {{ title?: any, action?: any, padded?: boolean, className?: string,
 *           bodyClassName?: string, style?: object, children?: any }} props
 */
export function Card({ title, action, padded = true, className, bodyClassName, style, children }) {
  return (
    <div className={cx(styles.card, className)} style={style}>
      {title != null && (
        <div className={styles.head}>
          <h3 className={styles.title}>{title}</h3>
          {action}
        </div>
      )}
      <div className={cx(padded && styles.body, bodyClassName)}>{children}</div>
    </div>
  );
}
