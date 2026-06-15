import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Modal, Segmented, Stat, StarMark } from '@/ui';
import { useCardsPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './cards.module.css';

function GiveCardModal({ open, onClose, types }) {
  const toast = useToast();
  const { t: tr } = useT();
  const [kind, setKind] = useState('up');
  const [type, setType] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');

  const kindTypes = types?.[kind] ?? [];

  // Reset every field so reopening the modal always starts clean — covers
  // submit, Cancel, backdrop click, Escape and the X button.
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
    toast(`${recipient} · ${type || kindTypes[0]?.name}`, 'success');
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
  const [modal, setModal] = useState(false);
  const state = useCardsPage();

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={tr('cards.title')}
            subtitle={tr('cards.subtitle')}
            right={
              <Button variant="primary" icon="plus" onClick={() => setModal(true)}>
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
                {d.recent.map((c) => (
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
                    <div key={t.name} className={styles.type}>
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <GiveCardModal open={modal} onClose={() => setModal(false)} types={d.types} />
        </>
      )}
    </AsyncBoundary>
  );
}
