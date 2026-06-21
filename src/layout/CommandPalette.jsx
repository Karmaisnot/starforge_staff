import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/ui';
import { useT } from '@/hooks/useT.js';
import { ALL_NAV } from './navConfig.js';
import styles from './CommandPalette.module.css';

/**
 * App-wide command palette / global search. Opens via the top-bar search box or
 * ⌘K / Ctrl+K (the listener lives in AppShell). Lets the user jump to any page;
 * full keyboard support (arrows to move, Enter to go, Escape to close).
 *
 * @param {{ open: boolean, onClose: Function }} props
 */
export function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const { t } = useT();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  // Build the searchable page list once per language. Each entry keeps its
  // stable id/path and a localized label so filtering matches what users read.
  const pages = useMemo(
    () => ALL_NAV.map((n) => ({ id: n.id, path: n.path, icon: n.icon, label: t(`nav.${n.id}`) })),
    [t],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) => p.label.toLowerCase().includes(q) || p.id.includes(q) || p.path.includes(q),
    );
  }, [pages, query]);

  // Reset transient state every time the palette opens, then focus the input.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Keep the active index in range as the result set shrinks while typing.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!open) return null;

  const go = (path) => {
    navigate(path);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[active];
      if (sel) go(sel.path);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t('shell.searchAll')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.searchRow}>
          <Icon name="search" size={16} style={{ color: 'var(--sf-muted)' }} />
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('shell.commandPlaceholder')}
            aria-label={t('shell.searchAll')}
          />
          <span className={styles.kbd}>ESC</span>
        </div>

        <div className={styles.group}>{t('shell.pagesGroup')}</div>
        {results.length === 0 ? (
          <div className={styles.empty}>{t('shell.noResults')}</div>
        ) : (
          <ul className={styles.list} role="listbox" aria-label={t('shell.pagesGroup')}>
            {results.map((p, i) => (
              <li key={p.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className={`${styles.item} ${i === active ? styles.itemActive : ''}`}
                  onClick={() => go(p.path)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className={styles.itemIcon}>
                    <Icon name={p.icon} size={16} />
                  </span>
                  <span className={styles.itemLabel}>{p.label}</span>
                  <span className={styles.itemPath}>{p.path}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
