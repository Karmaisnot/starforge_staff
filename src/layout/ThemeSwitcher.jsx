import { useState } from 'react';
import { Icon } from '@/ui';
import { Palette } from '@/domain/enums.js';
import { useTheme } from '@/hooks/useTheme.js';
import { useT } from '@/hooks/useT.js';
import styles from './ThemeSwitcher.module.css';

const PALETTES = [
  { id: Palette.SAROY, label: 'Saroy · Terracotta', colors: ['#b85535', '#d89a2e', '#fbf6ec'] },
  { id: Palette.MARVARID, label: 'Marvarid · Pearl', colors: ['#1f6b66', '#c4892f', '#f2f1ed'] },
  { id: Palette.SAMARQAND, label: 'Samarqand · Indigo', colors: ['#2a3d8f', '#d8a22a', '#f4f1e8'] },
  { id: Palette.DARYO, label: 'Daryo · Sage', colors: ['#4f6a3a', '#ba8c2c', '#f1efe6'] },
];

/** The palette/dark controls — reusable inline (e.g. in Settings). */
export function ThemeControls() {
  const { palette, dark, setPalette, toggleDark } = useTheme();
  const { t } = useT();
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.darkRow}
        onClick={toggleDark}
        aria-pressed={dark}
      >
        <Icon name={dark ? 'moon' : 'sun'} size={16} />
        <span>{t('settings.dark')}</span>
        <span className={`${styles.toggle} ${dark ? styles.toggleOn : ''}`}>
          <span className={styles.knob} />
        </span>
      </button>
      <div className={styles.swatches}>
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.swatch} ${palette === p.id ? styles.swatchOn : ''}`}
            onClick={() => setPalette(p.id)}
          >
            <span className={styles.dots}>
              {p.colors.map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className={styles.swatchLabel}>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Floating tweaks button + popover. */
export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.fabWrap}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHead}>StarForge tweaks</div>
          <ThemeControls />
        </div>
      )}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label="Mavzu sozlamalari"
      >
        <Icon name={open ? 'x' : 'settings'} size={20} />
      </button>
    </div>
  );
}
