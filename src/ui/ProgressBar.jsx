import styles from './ProgressBar.module.css';

/**
 * Thin progress track.
 * @param {{ value: number, color?: string, track?: string, height?: number, className?: string }} props
 */
export function ProgressBar({ value, color = 'var(--sf-primary)', track, height = 4, className }) {
  return (
    <div
      className={`${styles.track} ${className || ''}`}
      style={{ height, background: track || 'var(--sf-surface-2)' }}
    >
      <div
        className={styles.fill}
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}
