import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Chip, Icon, ProgressBar } from '@/ui';
import { useSurveysPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './surveys.module.css';

export function SurveysPage() {
  const toast = useToast();
  const { t } = useT();
  const state = useSurveysPage();

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={t('surveys.title')}
            subtitle={t('surveys.subtitle')}
            right={<Chip tone="danger">{t('surveys.unsubmitted')}</Chip>}
          />

          <div className={styles.grid}>
            {d.active.map((s) => (
              <div key={s.id} className={`${styles.card} ${s.urgent ? styles.urgent : ''}`}>
                {s.urgent && <div className={styles.glow} />}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {s.urgent && <span className={styles.pulseDot} />}
                      <Chip tone={s.urgent ? 'ink' : 'neutral'}>{s.urgent ? t('surveys.urgent') : t('surveys.new')}</Chip>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                      <span className="sf-mono" style={{ fontWeight: 700, color: s.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)' }}>
                        {s.remaining}
                      </span>{' '}
                      {t('surveys.remainingSuffix')}
                    </span>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    {s.title}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: 'var(--sf-ink-2)' }}>
                    {s.issuer} · <span className="sf-mono">{s.deadline}</span>
                  </div>
                  <div className={styles.meta}>
                    <div style={{ flex: 1 }}>
                      <div className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)' }}>
                        <strong>{s.questions}</strong> {t('surveys.question')} · {s.estimate}
                      </div>
                      {s.progress > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <ProgressBar value={s.progress} color="var(--sf-accent)" track="var(--sf-surface-3)" />
                        </div>
                      )}
                    </div>
                    <Button variant="ink" icon="arrowR" iconRight iconSize={12} onClick={() => toast(s.title)}>
                      {s.progress > 0 ? t('surveys.continue') : t('surveys.start')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionH}>{t('surveys.historyTitle')}</h3>
          <Card padded={false}>
            {d.history.map((p, i) => (
              <button key={i} className={styles.historyRow} onClick={() => toast(p.title)}>
                <div
                  className={styles.historyIcon}
                  style={{
                    background: p.skipped ? 'var(--sf-surface-2)' : 'var(--sf-success-soft)',
                    color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)',
                  }}
                >
                  <Icon name={p.skipped ? 'x' : 'check'} size={16} stroke={p.skipped ? 2.4 : 2.6} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.title}</span>
                <span style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{p.issuer}</span>
                <span style={{ fontSize: 12, color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)' }}>{p.status}</span>
                <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{p.date}</span>
              </button>
            ))}
          </Card>
        </>
      )}
    </AsyncBoundary>
  );
}
