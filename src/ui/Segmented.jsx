import styles from './Segmented.module.css';

/**
 * Compact segmented control (form-style).
 * @param {{ options: {value:string,label:string}[], value: string, onChange?: (v:string)=>void }} props
 */
export function Segmented({ options, value, onChange }) {
  return (
    <div className={styles.seg}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={value === opt.value ? styles.on : undefined}
          onClick={() => onChange?.(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
