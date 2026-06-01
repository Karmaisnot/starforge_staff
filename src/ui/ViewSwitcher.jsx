import { Icon } from './icons/Icon.jsx';
import styles from './ViewSwitcher.module.css';

/**
 * Labelled icon switcher (e.g. List / Board / Calendar).
 * @param {{ options: {value:string,label:string,icon?:string}[], value: string, onChange?: (v:string)=>void }} props
 */
export function ViewSwitcher({ options, value, onChange }) {
  return (
    <div className={styles.switcher}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-on={value === opt.value ? '1' : '0'}
          onClick={() => onChange?.(opt.value)}
        >
          {opt.icon && <Icon name={opt.icon} size={13} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
