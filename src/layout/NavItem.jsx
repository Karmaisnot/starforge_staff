import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { Icon, cx } from '@/ui';
import { useT } from '@/hooks/useT.js';
import styles from './AppShell.module.css';

/**
 * Sidebar navigation row. Active state drives the `data-on` attribute the
 * stylesheet keys off (kept as an attribute so descendant selectors work).
 * @param {{ item: object, badge?: number, onNavigate?: Function }} props
 */
export function NavItem({ item, badge = 0, onNavigate }) {
  const { t } = useT();
  const resolved = useResolvedPath(item.path);
  const active = Boolean(useMatch({ path: resolved.pathname, end: true }));

  return (
    <Link to={item.path} className={styles.nav} data-on={active ? '1' : '0'} onClick={onNavigate}>
      <span className={styles.navIcon}>
        {item.urgent && badge > 0 && <span className={styles.navPulse} />}
        <Icon name={item.icon} size={18} />
      </span>
      <span className={styles.navLabel}>{t(`nav.${item.id}`)}</span>
      {badge > 0 && (
        <span className={cx(styles.navBadge, item.urgent && styles.navBadgeUrgent)}>{badge}</span>
      )}
    </Link>
  );
}
