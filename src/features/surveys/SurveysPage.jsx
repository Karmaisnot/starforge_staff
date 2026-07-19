import { useEffect, useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Chip, Icon, Modal, ProgressBar, Segmented } from '@/ui';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import { plural } from '@/i18n/plural.js';
import { isApiMode } from '@/data/http/apiConfig.js';
import styles from './surveys.module.css';

function SurveyModal({ survey, onClose, onSubmit }) {
  const { t, locale } = useT();
  const [rating, setRating] = useState('4');
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (!survey) return;
    setRating('4');
    setComment('');
  }, [survey]);
  if (!survey) return null;
  return (
    <Modal
      open={Boolean(survey)}
      onClose={onClose}
      title={survey.title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            icon="check"
            onClick={() => onSubmit(survey, { rating, comment })}
          >
            {t('surveys.submit')}
          </Button>
        </>
      }
    >
      <div className={styles.modalMeta}>
        {survey.issuer} · {survey.questions} {plural(locale, 'questions', survey.questions)} ·{' '}
        {survey.estimate}
      </div>
      <div className={styles.modalField}>
        <span>{t('surveys.rateQ')}</span>
        <Segmented
          value={rating}
          onChange={setRating}
          options={['1', '2', '3', '4', '5'].map((v) => ({ value: v, label: v }))}
        />
      </div>
      <div className={styles.modalField}>
        <span>{t('surveys.commentQ')}</span>
        <textarea
          className={styles.modalTextarea}
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </Modal>
  );
}

export function SurveysPage() {
  const toast = useToast();
  const { t, locale } = useT();
  const { surveys } = useServices();
  const [reloadKey, setReloadKey] = useState(0);
  const state = useAsync(
    () =>
      Promise.all([surveys.getActive(), surveys.getHistory()]).then(([active, history]) => ({
        active,
        history,
      })),
    [locale, reloadKey],
  );
  // Pull fresh server truth; on success this clears the optimistic scratch state.
  const refetch = () => setReloadKey((k) => k + 1);
  const [open, setOpen] = useState(null);
  const [viewing, setViewing] = useState(null); // history item shown in read-only results modal
  const [done, setDone] = useState([]); // optimistically-removed active survey ids
  const [extraHistory, setExtraHistory] = useState([]);
  const writesEnabled = !isApiMode();

  const submit = async (survey, answers) => {
    // (a) optimistic local update — instant UI reaction
    setDone((ids) => [...ids, survey.id]);
    setExtraHistory((h) => [
      {
        title: survey.title,
        issuer: survey.issuer,
        status: t('surveys.submitted'),
        date: t('surveys.now'),
        skipped: false,
        rating: answers.rating,
        comment: answers.comment,
      },
      ...h,
    ]);
    setOpen(null);
    toast(`${survey.title} · ${answers.rating}/5`, 'success');
    // (b) persist + (c) reconcile with server truth
    try {
      await surveys.submit(survey.id, { rating: Number(answers.rating), comment: answers.comment });
      setDone([]);
      setExtraHistory([]);
      refetch();
    } catch {
      // (d) roll back the optimistic change and surface the error
      setDone((ids) => ids.filter((id) => id !== survey.id));
      setExtraHistory((h) =>
        h.filter((row) => !(row.title === survey.title && row.date === t('surveys.now'))),
      );
      toast(t('common.error'), 'danger');
    }
  };

  const skip = async (survey) => {
    // (a) optimistic local update
    setDone((ids) => [...ids, survey.id]);
    setExtraHistory((h) => [
      {
        title: survey.title,
        issuer: survey.issuer,
        status: t('surveys.skipped'),
        date: t('surveys.now'),
        skipped: true,
        rating: null,
        comment: null,
      },
      ...h,
    ]);
    toast(`${survey.title} · ${t('surveys.skipped')}`);
    // (b) persist + (c) reconcile
    try {
      await surveys.skip(survey.id);
      setDone([]);
      setExtraHistory([]);
      refetch();
    } catch {
      // (d) roll back
      setDone((ids) => ids.filter((id) => id !== survey.id));
      setExtraHistory((h) =>
        h.filter((row) => !(row.title === survey.title && row.date === t('surveys.now'))),
      );
      toast(t('common.error'), 'danger');
    }
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => {
        const active = d.active.filter((s) => !done.includes(s.id));
        const history = [...extraHistory, ...d.history];
        return (
          <>
            <PageHeader
              title={t('surveys.title')}
              subtitle={t('surveys.subtitle')}
              right={
                <Chip tone="danger">
                  {active.length} {t('surveys.unsubmitted')}
                </Chip>
              }
            />

            <div className={styles.grid}>
              {active.length === 0 && (
                <Card className={styles.emptyState}>{t('surveys.emptyActive')}</Card>
              )}
              {active.map((s) => (
                <div key={s.id} className={`${styles.card} ${s.urgent ? styles.urgent : ''}`}>
                  {s.urgent && <div className={styles.glow} />}
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {s.urgent && <span className={styles.pulseDot} />}
                        <Chip tone={s.urgent ? 'ink' : 'neutral'}>
                          {s.urgent ? t('surveys.urgent') : t('surveys.new')}
                        </Chip>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                        <span
                          className="sf-mono"
                          style={{
                            fontWeight: 700,
                            color: s.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)',
                          }}
                        >
                          {s.remaining}
                        </span>{' '}
                        {t('surveys.remainingSuffix')}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                      }}
                    >
                      {s.title}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13, color: 'var(--sf-ink-2)' }}>
                      {s.issuer} · <span className="sf-mono">{s.deadline}</span>
                    </div>
                    <div className={styles.meta}>
                      <div style={{ flex: 1 }}>
                        <div className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)' }}>
                          <strong>{s.questions}</strong> {plural(locale, 'questions', s.questions)}{' '}
                          · {s.estimate}
                        </div>
                        {s.progress > 0 && (
                          <div style={{ marginTop: 6 }}>
                            <ProgressBar
                              value={s.progress}
                              color="var(--sf-accent)"
                              track="var(--sf-surface-3)"
                            />
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Button
                          variant="ghost"
                          icon="x"
                          iconSize={12}
                          onClick={() => skip(s)}
                          disabled={!writesEnabled}
                          title={!writesEnabled ? t('common.actionUnavailable') : undefined}
                        >
                          {t('surveys.skip')}
                        </Button>
                        <Button
                          variant="ink"
                          icon="arrowR"
                          iconRight
                          iconSize={12}
                          onClick={() => setOpen(s)}
                          disabled={!writesEnabled}
                          title={!writesEnabled ? t('common.actionUnavailable') : undefined}
                        >
                          {s.progress > 0 ? t('surveys.continue') : t('surveys.start')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className={styles.sectionH}>
              {t('surveys.historyTitle')} · {history.length}
            </h3>
            <Card padded={false}>
              {history.length === 0 && (
                <div className={styles.emptyHistory}>{t('surveys.emptyHistory')}</div>
              )}
              {history.map((p, i) => (
                <button key={i} className={styles.historyRow} onClick={() => setViewing(p)}>
                  <div
                    className={styles.historyIcon}
                    style={{
                      background: p.skipped ? 'var(--sf-surface-2)' : 'var(--sf-success-soft)',
                      color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)',
                    }}
                  >
                    <Icon
                      name={p.skipped ? 'x' : 'check'}
                      size={16}
                      stroke={p.skipped ? 2.4 : 2.6}
                    />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.title}</span>
                  <span style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{p.issuer}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)',
                    }}
                  >
                    {p.status}
                  </span>
                  <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-muted)' }}>
                    {p.date}
                  </span>
                </button>
              ))}
            </Card>

            <SurveyModal survey={open} onClose={() => setOpen(null)} onSubmit={submit} />

            <Modal
              open={viewing !== null}
              onClose={() => setViewing(null)}
              title={t('surveys.resultTitle')}
              footer={
                <Button variant="ghost" onClick={() => setViewing(null)}>
                  {t('common.close')}
                </Button>
              }
            >
              {viewing && (
                <>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}
                  >
                    {viewing.title}
                  </div>
                  <div className={styles.modalMeta}>
                    {viewing.issuer} · {viewing.status} ·{' '}
                    <span className="sf-mono">{viewing.date}</span>
                  </div>
                  {viewing.rating == null && viewing.comment == null ? (
                    <div className={styles.modalField}>
                      <span style={{ color: 'var(--sf-muted)' }}>{t('surveys.noDetails')}</span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.modalField}>
                        <span>{t('surveys.yourRating')}</span>
                        <div className="sf-mono">{viewing.rating}/5</div>
                      </div>
                      <div className={styles.modalField}>
                        <span>{t('surveys.yourComment')}</span>
                        <div>
                          {viewing.comment ? (
                            viewing.comment
                          ) : (
                            <span style={{ color: 'var(--sf-muted)' }}>
                              {t('surveys.noComment')}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </Modal>
          </>
        );
      }}
    </AsyncBoundary>
  );
}
