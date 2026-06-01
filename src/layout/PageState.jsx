import { useT } from '@/hooks/useT.js';
import styles from './PageState.module.css';

/** Lightweight loading spinner shown while a page's data resolves. */
export function PageLoading({ label }) {
  const { t } = useT();
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <span>{label ?? t('common.loading')}</span>
    </div>
  );
}

/** Error panel for failed loads. */
export function PageError({ error }) {
  const { t } = useT();
  return (
    <div className={styles.wrap}>
      <strong>{t('common.error')}</strong>
      <span>{error?.message ?? t('common.errorBody')}</span>
    </div>
  );
}

/**
 * Convenience wrapper: render loading/error states, else children(data).
 * @param {{ state: {data:any,loading:boolean,error:Error|null}, children: (data:any)=>any }} props
 */
export function AsyncBoundary({ state, children }) {
  if (state.loading) return <PageLoading />;
  if (state.error) return <PageError error={state.error} />;
  return children(state.data);
}
