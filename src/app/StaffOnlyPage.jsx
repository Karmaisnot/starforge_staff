import { useNavigate } from 'react-router-dom';
import { logout } from '@/data/http/authToken.js';
import { Icon, StarMark } from '@/ui';
import { useT } from '@/hooks/useT.js';
import styles from './StaffOnlyPage.module.css';

export function StaffOnlyPage({ profile }) {
  const navigate = useNavigate();
  const { t } = useT();
  const signOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };
  return (
    <main className={styles.page}>
      <div className={styles.glow} />
      <section className={styles.card}>
        <div className={styles.mark}>
          <StarMark size={44} color="var(--sf-primary)" />
        </div>
        <span className={styles.eyebrow}>{t('access.staffOnly')}</span>
        <h1>{t('access.title')}</h1>
        <p>{t('access.body')}</p>
        <div className={styles.identity}>
          <span>
            <Icon name="shield" size={18} />
          </span>
          <div>
            <strong>{profile?.name}</strong>
            <small>{profile?.role}</small>
          </div>
        </div>
        <button type="button" onClick={signOut}>
          {t('access.signOut')}
          <Icon name="arrowR" size={15} />
        </button>
      </section>
    </main>
  );
}

export function RouteAccessPage({ profile }) {
  const navigate = useNavigate();
  const { t } = useT();
  return (
    <main className={styles.page}>
      <div className={styles.glow} />
      <section className={styles.card}>
        <div className={styles.mark}>
          <Icon name="shield" size={30} />
        </div>
        <span className={styles.eyebrow}>{t('access.routeEyebrow')}</span>
        <h1>{t('access.routeTitle')}</h1>
        <p>{t('access.routeBody')}</p>
        <div className={styles.identity}>
          <span>
            <Icon name="user" size={18} />
          </span>
          <div>
            <strong>{profile?.name}</strong>
            <small>{profile?.role}</small>
          </div>
        </div>
        <button type="button" onClick={() => navigate('/today', { replace: true })}>
          {t('access.returnHome')}
          <Icon name="arrowR" size={15} />
        </button>
      </section>
    </main>
  );
}
