import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { Icon } from '@/ui';
import { useT } from '@/hooks/useT.js';
import { PRIMARY_NAV, visibleNav } from './navConfig.js';
import styles from './AppShell.module.css';

function Tab({ item, badge }) {
  const { t } = useT();
  const resolved = useResolvedPath(item.path);
  const active = Boolean(useMatch({ path: resolved.pathname, end: true }));
  return (
    <Link to={item.path} className={styles.tab} data-on={active ? '1' : '0'}>
      <span className={styles.tabIconWrap}>
        {active && <span className={styles.tabBg} />}
        <span className={styles.tabIcon}>
          <Icon name={item.icon} size={20} />
        </span>
        {badge > 0 && <span className={styles.tabBadge}>{badge}</span>}
      </span>
      <span>{t(`nav.${item.id}`)}</span>
    </Link>
  );
}

/** @param {{ badges: object, profile?: object }} props */
export function MobileTabs({ badges = {}, profile }) {
  return (
    <nav className={styles.tabs}>
      {visibleNav(PRIMARY_NAV, profile).map((item) => (
        <Tab key={item.id} item={item} badge={badges[item.badge]} />
      ))}
    </nav>
  );
}
