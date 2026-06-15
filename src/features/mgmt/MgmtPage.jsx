import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Avatar, Button, Card, Chip, Icon, Modal, StarMark } from '@/ui';
import { useMgmtThreads, useMgmtTranscript } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './mgmt.module.css';

function ChatPanel({ thread }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { t: tt } = useT();
  const { data: transcript } = useMgmtTranscript(thread.id);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState([]);
  const fileRef = useRef(null);

  const onAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) setDraft((d) => `${d}${d ? ' ' : ''}📎 ${file.name}`.trim());
    e.target.value = '';
  };

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setSent((s) => [...s, draft.trim()]);
    setDraft('');
    toast(tt('mgmt.sent'), 'success');
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chatHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={thread.name} size={42} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{thread.name}</span>
              {thread.lead && <Chip tone="primary">{thread.role}</Chip>}
            </div>
            <div style={{ fontSize: 11, color: thread.online ? 'var(--sf-success)' : 'var(--sf-muted)' }}>
              {thread.online ? `● ${tt('mgmt.online')} · ${thread.role}` : thread.role}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {(transcript ?? []).map((m) => {
          if (m.dir === 'card') {
            return (
              <div key={m.id} className={styles.cardCall}>
                <div className={styles.cardIcon}>
                  <Icon name="flag" size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.cardEyebrow}>{m.taskCard.eyebrow}</div>
                  <div style={{ marginTop: 2, fontSize: 14, fontWeight: 700 }}>{m.taskCard.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                    {tt('tasks.cDeadline')}:{' '}
                    <span className="sf-mono" style={{ color: 'var(--sf-danger)', fontWeight: 700 }}>
                      {m.taskCard.deadline}
                    </span>
                  </div>
                </div>
                <Button variant="soft" icon="arrowR" iconRight iconSize={12} onClick={() => navigate('/tasks')}>
                  {tt('mgmt.toTask')}
                </Button>
              </div>
            );
          }
          const out = m.dir === 'out';
          return (
            <div key={m.id} className={out ? styles.outWrap : styles.inWrap}>
              {!out && <Avatar name={thread.name} size={28} />}
              <div className={out ? styles.out : styles.in}>
                {m.text}
                <div className={styles.msgTime} style={out ? { textAlign: 'right', opacity: 0.8 } : {}}>
                  {m.time}
                  {out && m.read ? ' ✓✓' : ''}
                </div>
              </div>
            </div>
          );
        })}
        {sent.map((m, i) => (
          <div key={`s${i}`} className={styles.outWrap}>
            <div className={styles.out}>
              {m}
              <div className={styles.msgTime} style={{ textAlign: 'right', opacity: 0.8 }}>
                {tt('mgmt.now')} ✓
              </div>
            </div>
          </div>
        ))}
        {(transcript ?? []).length === 0 && sent.length === 0 && (
          <div className={styles.empty}>{tt('mgmt.empty')}</div>
        )}
      </div>

      <form className={styles.input} onSubmit={send}>
        <input ref={fileRef} type="file" hidden onChange={onAttach} />
        <button type="button" className={styles.iconBtn} onClick={() => fileRef.current?.click()} aria-label={tt('mgmt.attach')}>
          <Icon name="attach" size={16} />
        </button>
        <input
          className={styles.inputField}
          aria-label={tt('mgmt.writeTo').replace('{name}', thread.name)}
          placeholder={tt('mgmt.writeTo').replace('{name}', thread.name)}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className={styles.send} aria-label={tt('mgmt.send')}>
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
}

function ComposeModal({ open, onClose, onCreate }) {
  const { t: tt } = useT();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    onCreate({ name: name.trim(), message: message.trim() });
    setName('');
    setMessage('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tt('common.newMessage')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {tt('common.cancel')}
          </Button>
          <Button variant="primary" icon="send" onClick={submit}>
            {tt('mgmt.send')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className={styles.composeForm}>
        <label className={styles.composeField}>
          <span>{tt('mgmt.recipient')}</span>
          <input className={styles.composeInput} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <label className={styles.composeField}>
          <span>{tt('mgmt.message')}</span>
          <textarea
            className={styles.composeInput}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </form>
    </Modal>
  );
}

export function MgmtPage() {
  const toast = useToast();
  const { t: tt } = useT();
  const [openId, setOpenId] = useState(1);
  const [extraThreads, setExtraThreads] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const state = useMgmtThreads();

  const createThread = ({ name, message }) => {
    const id = `t-${Date.now()}`;
    setExtraThreads((list) => [
      { id, name, role: tt('mgmt.newThreadRole'), lastMessage: message, time: tt('mgmt.now'), unread: 0, online: false },
      ...list,
    ]);
    setOpenId(id);
    toast(tt('mgmt.sent'), 'success');
  };

  return (
    <AsyncBoundary state={state}>
      {(loaded) => {
        const threads = [...extraThreads, ...loaded];
        const cur = threads.find((t) => t.id === openId) ?? threads[0];
        return (
          <>
            <PageHeader
              title={tt('mgmt.title')}
              subtitle={tt('mgmt.subtitle')}
              right={
                <Button variant="primary" icon="edit" onClick={() => setComposeOpen(true)}>
                  {tt('common.newMessage')}
                </Button>
              }
            />

            <div className={styles.layout}>
              <Card padded={false} className={styles.list}>
                {threads.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.thread} ${openId === t.id ? styles.on : ''}`}
                    onClick={() => setOpenId(t.id)}
                  >
                    <div style={{ position: 'relative' }}>
                      {t.channel ? (
                        <div className={styles.channelMark}>
                          <StarMark size={20} color="var(--sf-accent)" />
                        </div>
                      ) : (
                        <Avatar name={t.name} size={44} />
                      )}
                      {t.online && <span className={styles.onlineDot} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: t.unread > 0 ? 700 : 600 }}>{t.name}</span>
                        <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{t.time}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', margin: '1px 0 4px' }}>
                        {t.pinned && <Icon name="pin" size={9} style={{ color: 'var(--sf-accent)' }} />}
                        {t.lead && <Chip tone="primary">{t.role}</Chip>}
                        <span style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{t.role}</span>
                      </div>
                      <div className={styles.threadLast} style={{ color: t.unread > 0 ? 'var(--sf-ink-2)' : 'var(--sf-muted)', fontWeight: t.unread > 0 ? 600 : 400 }}>
                        {t.lastMessage}
                      </div>
                    </div>
                    {t.unread > 0 && <div className={styles.unread}>{t.unread}</div>}
                  </button>
                ))}
              </Card>

              <ChatPanel key={cur.id} thread={cur} />
            </div>

            <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onCreate={createThread} />
          </>
        );
      }}
    </AsyncBoundary>
  );
}
