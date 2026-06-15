import { useNavigate } from 'react-router-dom';
import { Avatar, Icon, StarMark } from '@/ui';
import { useT } from '@/hooks/useT.js';
import styles from './AppShell.module.css';

/**
 * @param {{ title: string, teacher: object|null, onOpenDrawer: Function }} props
 */
export function TopBar({ title, teacher, onOpenDrawer }) {
  const navigate = useNavigate();
  const { t } = useT();
  return (
    <header className={styles.top}>
      <button className={styles.hamburger} onClick={onOpenDrawer} aria-label={t('shell.menu')}>
        <Icon name="filter" size={20} />
      </button>
      <div className={styles.crumb}>
        <StarMark size={18} color="var(--sf-primary)" />
        <Icon name="chevR" size={12} style={{ color: 'var(--sf-muted)' }} />
        <span className={styles.crumbLabel}>{title}</span>
      </div>
      <div className={styles.search}>
        <Icon name="search" size={16} style={{ color: 'var(--sf-muted)' }} />
        <span>{t('shell.searchAll')}</span>
        <span className={styles.searchKbd}>⌘K</span>
      </div>
      <div className={styles.topActions}>
        <button className={styles.topBtn} title={t('nav.ai')} onClick={() => navigate('/ai')}>
          <Icon name="ai" size={18} />
        </button>
        <button
          className={styles.topBtn}
          title={t('nav.notifications')}
          onClick={() => navigate('/notifications')}
        >
          <Icon name="bell" size={18} />
          <span className={styles.topDot} />
        </button>
        <button className={styles.topAvatar} onClick={() => navigate('/settings')} aria-label={t('settings.profile')}>
          <Avatar name={teacher?.name ?? 'A'} size={32} color="var(--sf-primary)" />
        </button>
      </div>
    </header>
  );
}
