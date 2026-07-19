import { useNavigate, useRouteError } from 'react-router-dom';
import { Button, StarMark } from '@/ui';
import { useT } from '@/hooks/useT.js';
import styles from './RouteErrorPage.module.css';

/** Branded last-resort route boundary: never expose a React stack to teachers. */
export function RouteErrorPage() {
  // Read the route error so React Router marks it as handled, while deliberately
  // keeping implementation details out of the teacher-facing screen.
  useRouteError();
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <main className={styles.page} aria-labelledby="route-error-title">
      <div className={styles.orbit} aria-hidden="true" />
      <section className={styles.panel}>
        <div className={styles.mark} aria-hidden="true">
          <StarMark size={31} color="#fffcf5" />
        </div>
        <p className={styles.eyebrow}>StarForge EDU</p>
        <h1 id="route-error-title" className={styles.title}>
          {t('common.errorTitle')}
        </h1>
        <p className={styles.copy}>{t('common.errorPageBody')}</p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            icon="arrowR"
            iconRight
            onClick={() => window.location.reload()}
          >
            {t('common.retry')}
          </Button>
          <Button variant="soft" onClick={() => navigate('/today', { replace: true })}>
            {t('common.backToToday')}
          </Button>
        </div>
      </section>
    </main>
  );
}
