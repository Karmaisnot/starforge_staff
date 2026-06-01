import styles from './PageHeader.module.css';

/**
 * Standard page title block.
 * @param {{ eyebrow?: any, title: any, subtitle?: any, right?: any }} props
 */
export function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className={styles.head}>
      <div>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
}
