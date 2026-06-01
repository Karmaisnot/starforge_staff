import styles from './Stat.module.css';

/**
 * Headline metric tile.
 * @param {{ value: any, unit?: string, label: string, color?: string,
 *           trend?: { up: boolean, value: string } }} props
 */
export function Stat({ value, unit, label, color, trend }) {
  return (
    <div className={styles.stat}>
      <div className={styles.row}>
        <span className={`sf-mono ${styles.value}`} style={{ color: color || 'var(--sf-ink)' }}>
          {value}
        </span>
        {unit && <span className={styles.unit}>{unit}</span>}
        {trend && (
          <span
            className={styles.trend}
            style={{ color: trend.up ? 'var(--sf-success)' : 'var(--sf-danger)' }}
          >
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
