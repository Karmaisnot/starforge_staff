import styles from './Stepper.module.css';

/**
 * Numeric stepper (−/value/+).
 * @param {{ value: number, onChange?: (n:number)=>void, min?: number, max?: number }} props
 */
export function Stepper({ value, onChange, min = 0, max = Infinity }) {
  const set = (next) => onChange?.(Math.min(max, Math.max(min, next)));
  return (
    <div className={styles.stepper}>
      <button type="button" onClick={() => set(value - 1)} aria-label="Kamaytirish">
        −
      </button>
      <span className="sf-mono">{value}</span>
      <button type="button" className={styles.plus} onClick={() => set(value + 1)} aria-label="Oshirish">
        +
      </button>
    </div>
  );
}
