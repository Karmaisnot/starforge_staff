import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Modal, Segmented, Stat, StarMark } from '@/ui';
import { useCardsPage } from '@/hooks/data.js';
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

  const close = () => {
    setKind('up');
    setType('');
    setRecipient('');
    setReason('');
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
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
          <Button variant="primary" icon="brand" onClick={submit}>
            {tr('cards.give')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className={styles.form}>
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
  const toast = useToast();
  const { t: tr } = useT();
  const navigate = useNavigate();
  const location = useLocation();
  // null = closed; an object = open (optionally carrying a preset for the form).
  const [modal, setModal] = useState(null);
  // Cards issued this session, prepended to the loaded recent list (optimistic).
  const [issued, setIssued] = useState([]);
  const state = useCardsPage();

  // Honour a "give a card to <name>" deep-link (from AI focus students / cohorts),
  // then clear the router state so the modal doesn't re-open on every re-render.
  useEffect(() => {
    const issueTo = location.state?.issueTo;
    if (issueTo) {
      setModal({ recipient: issueTo });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const issueCard = ({ kind, typeName, recipient, reason }) => {
    setIssued((list) => [
      {
        id: `c-${Date.now()}`,
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
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => {
        const recent = [...issued, ...d.recent];
        return (
          <>
            <PageHeader
              title={tr('cards.title')}
              subtitle={tr('cards.subtitle')}
              right={
                <Button variant="primary" icon="plus" onClick={() => setModal({})}>
                  {tr('common.giveCard')}
                </Button>
              }
            />

            <div className={styles.statGrid}>
              <Stat value="↑11" label={tr('cards.statUp')} color="#7a4f0e" trend={{ up: true, value: '+3' }} />
              <Stat value="↓3" label={tr('cards.statDown')} color="var(--sf-danger)" />
              <Stat value="58" label={tr('cards.recipients')} />
              <Stat value="6" unit="v2.3" label={tr('cards.typeCount')} />
            </div>

            <div className={styles.grid}>
              <div>
                <h3 className={styles.sectionH}>{tr('cards.recentTitle')}</h3>
                <Card padded={false}>
                  {recent.map((c) => (
                    <button key={c.id} className={styles.row} onClick={() => toast(`${c.recipient} · ${c.typeName}`)}>
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
                        <span style={{ fontSize: 8, fontWeight: 800, color: c.kind === 'up' ? '#7a4f0e' : '#5c1a0c' }}>
                          {c.kind === 'up' ? '↑ UP' : '↓ DOWN'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.recipient}</span>
                          <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{c.cohort}</span>
                        </div>
                        <div style={{ marginTop: 2, fontSize: 12, color: c.kind === 'up' ? 'var(--sf-accent-ink)' : 'var(--sf-danger)', fontWeight: 600 }}>
                          {c.typeName}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--sf-ink-2)', fontStyle: 'italic' }}>
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
                <h3 className={styles.sectionH}>{tr('cards.typesTitle')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                          <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{t.subtitle}</div>
                        </div>
                        <span className="sf-mono" style={{ fontSize: 13, fontWeight: 700, color: isUp ? '#7a4f0e' : 'var(--sf-danger)' }}>
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
