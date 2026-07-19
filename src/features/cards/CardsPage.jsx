import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Modal, Segmented, Stat, StarMark } from '@/ui';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './cards.module.css';

function GiveCardModal({ open, onClose, types, onIssue, preset }) {
  const toast = useToast();
  const { t: tr } = useT();
  const [kind, setKind] = useState('up');
  const [type, setType] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');

  // Re-seed every field whenever the modal opens, honouring any preset passed in
  // (a card-type row, or a "give a card to X" deep-link from AI / cohorts).
  useEffect(() => {
    if (!open) return;
    setKind(preset?.kind ?? 'up');
    setType(preset?.type ?? '');
    setRecipient(preset?.recipient ?? '');
    setReason('');
  }, [open, preset]);

  const kindTypes = types?.[kind] ?? [];
  const hasTypes = (types?.all ?? []).length > 0;

  const close = () => {
    setKind('up');
    setType('');
    setRecipient('');
    setReason('');
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!hasTypes) return;
    if (!recipient.trim()) {
      toast(tr('cards.needName'), 'danger');
      return;
    }
    onIssue({
      kind,
      typeName: type || kindTypes[0]?.name || '',
      recipient: recipient.trim(),
      reason: reason.trim(),
    });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={tr('cards.modalTitle')}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            {tr('common.cancel')}
          </Button>
          <Button variant="primary" icon="brand" onClick={submit} disabled={!hasTypes}>
            {tr('cards.give')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className={styles.form}>
        {!hasTypes && <p className={styles.emptyCopy}>{tr('cards.noTypes')}</p>}
        <label className={styles.field}>
          <span>{tr('cards.fKind')}</span>
          <Segmented
            value={kind}
            onChange={(v) => {
              setKind(v);
              setType('');
            }}
            options={[
              { value: 'up', label: tr('cards.upCard') },
              { value: 'down', label: tr('cards.downCard') },
            ]}
          />
        </label>
        <label className={styles.field}>
          <span>{tr('cards.fType')}</span>
          <select
            className={styles.select}
            value={type || kindTypes[0]?.name || ''}
            onChange={(e) => setType(e.target.value)}
            disabled={!hasTypes}
          >
            {kindTypes.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} · {t.subtitle}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{tr('cards.fStudent')}</span>
          <input
            className={styles.inputCtl}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={tr('cards.fStudentPh')}
          />
        </label>
        <label className={styles.field}>
          <span>{tr('cards.fReason')}</span>
          <input
            className={styles.inputCtl}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={tr('cards.fReasonPh')}
          />
        </label>
      </form>
    </Modal>
  );
}

export function CardsPage() {
  const { cards: cardService } = useServices();
  const toast = useToast();
  const { t: tr, locale } = useT();
  const navigate = useNavigate();
  const location = useLocation();
  // null = closed; an object = open (optionally carrying a preset for the form).
  const [modal, setModal] = useState(null);
  // Cards issued this session, prepended to the loaded recent list (optimistic).
  const [issued, setIssued] = useState([]);
  // Bumping this key re-runs the loader so the server truth reconciles after a write.
  const [reloadKey, setReloadKey] = useState(0);
  const state = useAsync(
    () =>
      Promise.all([
        cardService.getRecent(),
        cardService.getTypesByKind(),
        cardService.getStats(),
      ]).then(([recent, types, stats]) => ({ recent, types, stats })),
    [locale, reloadKey],
  );

  // Honour a "give a card to <name>" deep-link (from AI focus students / cohorts),
  // then clear the router state so the modal doesn't re-open on every re-render.
  useEffect(() => {
    const issueTo = location.state?.issueTo;
    if (issueTo) {
      setModal({ recipient: issueTo });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const issueCard = async ({ kind, typeName, recipient, reason }) => {
    // Optimistic: prepend the card so the recent list reacts instantly.
    const optimisticId = `c-${Date.now()}`;
    setIssued((list) => [
      {
        id: optimisticId,
        kind,
        recipient,
        cohort: '',
        typeName,
        reason: reason || tr('cards.fReasonPh'),
        when: tr('mgmt.now'),
      },
      ...list,
    ]);
    toast(`${recipient} · ${typeName}`, 'success');

    // Persist, then refetch so server truth (recent + stats + types counts)
    // reconciles. The optimistic prepend is dropped once the refetch covers it.
    try {
      await cardService.issue({ typeName, kind, recipient, reason });
      setIssued((list) => list.filter((c) => c.id !== optimisticId));
      setReloadKey((k) => k + 1);
    } catch {
      // Roll back the optimistic prepend and surface the failure.
      setIssued((list) => list.filter((c) => c.id !== optimisticId));
      toast(tr('common.error'), 'danger');
    }
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => {
        const recent = [...issued, ...d.recent];
        const stats = {
          upThisWeek: 0,
          downThisWeek: 0,
          recipients: 0,
          typeCount: 0,
          upTrend: '',
          ...(d.stats ?? {}),
        };
        const totalIssued = Number(stats.upThisWeek) + Number(stats.downThisWeek);
        const hasTypes = d.types.all.length > 0;
        return (
          <>
            <PageHeader
              title={tr('cards.title')}
              subtitle={`${totalIssued} ${tr('cards.issuedThisWeek')}`}
              right={
                <Button
                  variant="primary"
                  icon="plus"
                  disabled={!hasTypes}
                  title={!hasTypes ? tr('cards.noTypes') : undefined}
                  onClick={() => setModal({})}
                >
                  {tr('common.giveCard')}
                </Button>
              }
            />

            <div className={styles.statGrid}>
              <Stat
                value={`↑${stats.upThisWeek}`}
                label={tr('cards.statUp')}
                color="#7a4f0e"
                trend={stats.upTrend ? { up: true, value: stats.upTrend } : undefined}
              />
              <Stat
                value={`↓${stats.downThisWeek}`}
                label={tr('cards.statDown')}
                color="var(--sf-danger)"
              />
              <Stat value={stats.recipients} label={tr('cards.recipients')} />
              <Stat value={stats.typeCount} label={tr('cards.typeCount')} />
            </div>

            <div className={styles.grid}>
              <div>
                <h3 className={styles.sectionH}>
                  {tr('cards.recentTitle')} · {recent.length}
                </h3>
                <Card padded={false}>
                  {recent.length === 0 && (
                    <div className={styles.emptyCopy}>{tr('cards.emptyRecent')}</div>
                  )}
                  {recent.map((c) => (
                    <button
                      key={c.id}
                      className={styles.row}
                      onClick={() => toast(`${c.recipient} · ${c.typeName}`)}
                    >
                      <div
                        className={styles.miniCard}
                        style={{
                          background:
                            c.kind === 'up'
                              ? 'linear-gradient(135deg, #f6e0ac, #e9c272)'
                              : 'linear-gradient(135deg, #f0c9be, #d88a75)',
                          borderColor: c.kind === 'up' ? '#c49a3a' : '#a14026',
                        }}
                      >
                        <StarMark size={16} color={c.kind === 'up' ? '#7a4f0e' : '#5c1a0c'} />
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 800,
                            color: c.kind === 'up' ? '#7a4f0e' : '#5c1a0c',
                          }}
                        >
                          {c.kind === 'up' ? '↑ UP' : '↓ DOWN'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.recipient}</span>
                          <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{c.cohort}</span>
                        </div>
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 12,
                            color: c.kind === 'up' ? 'var(--sf-accent-ink)' : 'var(--sf-danger)',
                            fontWeight: 600,
                          }}
                        >
                          {c.typeName}
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 11.5,
                            color: 'var(--sf-ink-2)',
                            fontStyle: 'italic',
                          }}
                        >
                          “{c.reason}”
                        </div>
                      </div>
                      <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>
                        {c.when}
                      </span>
                    </button>
                  ))}
                </Card>
              </div>

              <div>
                <h3 className={styles.sectionH}>
                  {tr('cards.typesTitle')} · {d.types.all.length}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {!hasTypes && <div className={styles.emptyCopy}>{tr('cards.noTypes')}</div>}
                  {d.types.all.map((t) => {
                    const isUp = t.kind === 'up';
                    return (
                      <button
                        key={t.name}
                        type="button"
                        className={styles.type}
                        onClick={() => setModal({ kind: t.kind, type: t.name })}
                      >
                        <div
                          className={styles.miniCard}
                          style={{
                            background: isUp
                              ? 'linear-gradient(135deg, #f6e0ac, #e9c272)'
                              : 'linear-gradient(135deg, #f0c9be, #d88a75)',
                            borderColor: isUp ? '#c49a3a' : '#a14026',
                          }}
                        >
                          <StarMark size={14} color={isUp ? '#7a4f0e' : '#5c1a0c'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>
                            {t.subtitle}
                          </div>
                        </div>
                        <span
                          className="sf-mono"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: isUp ? '#7a4f0e' : 'var(--sf-danger)',
                          }}
                        >
                          {isUp ? '↑' : '↓'}
                          {t.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <GiveCardModal
              open={modal !== null}
              onClose={() => setModal(null)}
              types={d.types}
              preset={modal}
              onIssue={issueCard}
            />
          </>
        );
      }}
    </AsyncBoundary>
  );
}
