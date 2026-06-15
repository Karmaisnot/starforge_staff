import { useNavigate } from 'react-router-dom';
import { Avatar, Icon, StarMark, AiBadge } from '@/ui';
import { useT } from '@/hooks/useT.js';
import { PRIMARY_NAV, SECONDARY_NAV } from './navConfig.js';
import { NavItem } from './NavItem.jsx';
import styles from './AppShell.module.css';

/**
 * @param {{ teacher: object|null, badges: object, aiUsage: object|null,
 *           open: boolean, onClose: Function }} props
 */
export function Sidebar({ teacher, badges = {}, aiUsage, open, onClose }) {
  const navigate = useNavigate();
  const { t } = useT();
  const pct = aiUsage?.percent ?? 0;

  return (
    <aside
      className={`${styles.side} ${open ? styles.open : ''}`}
      role={open ? 'dialog' : undefined}
      aria-modal={open ? true : undefined}
      aria-label={open ? t('shell.menu') : undefined}
    >
      <div className={styles.sideInner}>
        <div
          className={styles.brand}
          onClick={() => {
            navigate('/today');
            onClose();
          }}
        >
          <StarMark size={28} color="var(--sf-primary)" />
          <div className={styles.brandText}>
            <div className={styles.brandName}>
              StarForge<span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}> · EDU</span>
            </div>
            <div className={styles.brandSub}>{teacher?.branch ?? t('cohorts.branch')}</div>
          </div>
          <button
            className={styles.sideClose}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label={t('common.close')}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className={styles.sideSection}>{t('shell.primary')}</div>
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.id} item={item} badge={badges[item.badge]} onNavigate={onClose} />
        ))}

        <div className={styles.sideSection}>{t('shell.documents')}</div>
        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.id} item={item} badge={badges[item.badge]} onNavigate={onClose} />
        ))}

        <div className={styles.sideAi}>
          <div className={styles.sideAiHead}>
            <AiBadge compact>{t('shell.limit')}</AiBadge>
            <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>
              {pct}%
            </span>
          </div>
          <div className={styles.sideAiBar}>
            <div style={{ width: `${pct}%` }} />
          </div>
          <div className={`sf-mono ${styles.sideAiMeta}`}>
            {(aiUsage?.used ?? 0).toLocaleString('ru-RU')} /{' '}
            {(aiUsage?.limit ?? 0).toLocaleString('ru-RU')} {t('shell.token')}
          </div>
        </div>

        <button
          className={styles.sideProfile}
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
        >
          <Avatar name={teacher?.name ?? 'A'} size={36} color="var(--sf-primary)" />
          <div className={styles.profileText}>
            <div className={styles.profileName}>{teacher?.name ?? '—'}</div>
            <div className={styles.profileRole}>
              <span className={styles.shareDot} />
              {t('shell.profileShared')}
            </div>
          </div>
          <Icon name="settings" size={16} style={{ color: 'var(--sf-muted)' }} />
        </button>
      </div>
    </aside>
  );
}
