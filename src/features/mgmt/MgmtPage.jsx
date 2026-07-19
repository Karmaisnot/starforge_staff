import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Avatar, Button, Card, Chip, Icon, Modal, StarMark } from '@/ui';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import { isApiMode } from '@/data/http/apiConfig.js';
import styles from './mgmt.module.css';

function ChatPanel({ thread, sent, onSend, transcriptReloadKey }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { t: tt, locale } = useT();
  const { mgmt } = useServices();
  // Direct service+useAsync (mirrors TasksPage) so the parent can force a
  // transcript refetch by bumping transcriptReloadKey after a persisted send.
  const { data: transcript } = useAsync(
    () => mgmt.getTranscript(thread.id),
    [thread.id, locale, transcriptReloadKey],
  );
  const [draft, setDraft] = useState('');
  const fileRef = useRef(null);

  const onAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) setDraft((d) => `${d}${d ? ' ' : ''}📎 ${file.name}`.trim());
    e.target.value = '';
  };

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
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
            <div
              style={{
                fontSize: 11,
                color: thread.online ? 'var(--sf-success)' : 'var(--sf-muted)',
              }}
            >
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
                  <div style={{ marginTop: 2, fontSize: 14, fontWeight: 700 }}>
                    {m.taskCard.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                    {tt('tasks.cDeadline')}:{' '}
                    <span
                      className="sf-mono"
                      style={{ color: 'var(--sf-danger)', fontWeight: 700 }}
                    >
                      {m.taskCard.deadline}
                    </span>
                  </div>
                </div>
                <Button
                  variant="soft"
                  icon="arrowR"
                  iconRight
                  iconSize={12}
                  onClick={() => navigate('/tasks')}
                >
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
                <div
                  className={styles.msgTime}
                  style={out ? { textAlign: 'right', opacity: 0.8 } : {}}
                >
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
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => fileRef.current?.click()}
          aria-label={tt('mgmt.attach')}
        >
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

  // Reset both fields whenever the modal opens so a cancelled draft never lingers.
  const close = () => {
    setName('');
    setMessage('');
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    onCreate({ name: name.trim(), message: message.trim() });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={tt('common.newMessage')}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
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
          <input
            className={styles.composeInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
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
  const { t: tt, locale } = useT();
  const { mgmt } = useServices();
  const [openId, setOpenId] = useState(1);
  const [extraThreads, setExtraThreads] = useState([]);
  // Messages sent this session, kept per-thread so switching conversations and
  // coming back preserves them (and a newly composed thread shows its first line).
  const [sentByThread, setSentByThread] = useState({});
  const [composeOpen, setComposeOpen] = useState(false);
  const canCreateThread = !isApiMode();
  // Bumping these forces useAsync to re-run after a persisted mutation so the
  // server truth (transcript / thread preview / unread counts) reconciles.
  const [threadsReloadKey, setThreadsReloadKey] = useState(0);
  const [transcriptReloadKey, setTranscriptReloadKey] = useState(0);
  // Direct service+useAsync (mirrors TasksPage) instead of useMgmtThreads so we
  // own a refetch handle via threadsReloadKey while keeping identical behavior.
  const state = useAsync(() => mgmt.getThreads(), [locale, threadsReloadKey]);

  const reloadThreads = () => setThreadsReloadKey((k) => k + 1);
  const reloadTranscript = () => setTranscriptReloadKey((k) => k + 1);

  const sendMessage = async (threadId, text) => {
    // Optimistic: show the outgoing bubble instantly (e2e checks this).
    setSentByThread((s) => ({ ...s, [threadId]: [...(s[threadId] ?? []), text] }));
    try {
      await mgmt.sendMessage(threadId, text);
      // Server now holds the message: refetch transcript (it renders the real
      // bubble) and threads (preview/unread update), then drop the scratch copy
      // for this thread so it isn't duplicated alongside the refetched message.
      reloadTranscript();
      reloadThreads();
      setSentByThread((s) => {
        const next = { ...s };
        delete next[threadId];
        return next;
      });
    } catch {
      // Roll back the optimistic bubble and surface the failure.
      setSentByThread((s) => {
        const arr = s[threadId] ?? [];
        const idx = arr.lastIndexOf(text);
        if (idx === -1) return s;
        const trimmed = [...arr.slice(0, idx), ...arr.slice(idx + 1)];
        return { ...s, [threadId]: trimmed };
      });
      toast(tt('common.error'), 'danger');
    }
  };

  const createThread = async ({ name, message }) => {
    const tempId = `t-${Date.now()}`;
    // Optimistic: show the new thread + its first line immediately.
    setExtraThreads((list) => [
      {
        id: tempId,
        name,
        role: tt('mgmt.newThreadRole'),
        lastMessage: message,
        time: tt('mgmt.now'),
        unread: 0,
        online: false,
      },
      ...list,
    ]);
    // Seed the new conversation with the typed message so it actually appears
    // in the chat instead of being thrown away as a preview-only string.
    setSentByThread((s) => ({ ...s, [tempId]: [message] }));
    setOpenId(tempId);
    toast(tt('mgmt.sent'), 'success');
    try {
      const created = await mgmt.createThread({ name, message });
      // Server now owns the thread: refetch the list and switch the open id /
      // scratch message over to the real id, dropping the optimistic temp copy.
      reloadThreads();
      const realId = created?.id;
      setExtraThreads((list) => list.filter((t) => t.id !== tempId));
      setSentByThread((s) => {
        const next = { ...s };
        delete next[tempId];
        return next;
      });
      if (realId != null) setOpenId(realId);
    } catch {
      // Roll back the optimistic thread + seeded message and report failure.
      setExtraThreads((list) => list.filter((t) => t.id !== tempId));
      setSentByThread((s) => {
        const next = { ...s };
        delete next[tempId];
        return next;
      });
      toast(tt('common.error'), 'danger');
    }
  };

  // Opening a thread clears its unread badge server-side, then refetches threads.
  const openThread = async (threadId) => {
    setOpenId(threadId);
    // Only persist for real (server) threads; temp optimistic ids have no row.
    if (typeof threadId === 'string' && threadId.startsWith('t-')) return;
    try {
      await mgmt.markRead(threadId);
      reloadThreads();
    } catch {
      // Non-fatal: leave the unread badge as-is rather than crash the page.
    }
  };

  return (
    <AsyncBoundary state={state}>
      {(loaded) => {
        const threads = [...extraThreads, ...(Array.isArray(loaded) ? loaded : [])];
        const cur = threads.find((t) => t.id === openId) ?? threads[0];

        if (!cur) {
          return (
            <>
              <PageHeader
                title={tt('mgmt.title')}
                subtitle={tt('mgmt.emptyBody')}
                right={
                  canCreateThread ? (
                    <Button variant="primary" icon="edit" onClick={() => setComposeOpen(true)}>
                      {tt('common.newMessage')}
                    </Button>
                  ) : null
                }
              />
              <Card className={styles.emptyPage}>
                <div className={styles.emptyPageInner}>
                  <div className={styles.emptyMark} aria-hidden="true">
                    <StarMark size={28} color="#fffcf5" />
                  </div>
                  <h2 className={styles.emptyTitle}>{tt('mgmt.emptyTitle')}</h2>
                  <p className={styles.emptyCopy}>{tt('mgmt.emptyBody')}</p>
                  {canCreateThread && (
                    <Button variant="soft" icon="edit" onClick={() => setComposeOpen(true)}>
                      {tt('common.newMessage')}
                    </Button>
                  )}
                </div>
              </Card>
              {canCreateThread && (
                <ComposeModal
                  open={composeOpen}
                  onClose={() => setComposeOpen(false)}
                  onCreate={createThread}
                />
              )}
            </>
          );
        }

        return (
          <>
            <PageHeader
              title={tt('mgmt.title')}
              subtitle={tt('mgmt.subtitle')}
              right={
                canCreateThread ? (
                  <Button variant="primary" icon="edit" onClick={() => setComposeOpen(true)}>
                    {tt('common.newMessage')}
                  </Button>
                ) : null
              }
            />

            <div className={styles.layout}>
              <Card padded={false} className={styles.list}>
                {threads.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.thread} ${openId === t.id ? styles.on : ''}`}
                    onClick={() => openThread(t.id)}
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: t.unread > 0 ? 700 : 600 }}>
                          {t.name}
                        </span>
                        <span
                          className="sf-mono"
                          style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}
                        >
                          {t.time}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 4,
                          alignItems: 'center',
                          margin: '1px 0 4px',
                        }}
                      >
                        {t.pinned && (
                          <Icon name="pin" size={9} style={{ color: 'var(--sf-accent)' }} />
                        )}
                        {t.lead && <Chip tone="primary">{t.role}</Chip>}
                        <span style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{t.role}</span>
                      </div>
                      <div
                        className={styles.threadLast}
                        style={{
                          color: t.unread > 0 ? 'var(--sf-ink-2)' : 'var(--sf-muted)',
                          fontWeight: t.unread > 0 ? 600 : 400,
                        }}
                      >
                        {t.lastMessage}
                      </div>
                    </div>
                    {t.unread > 0 && <div className={styles.unread}>{t.unread}</div>}
                  </button>
                ))}
              </Card>

              <ChatPanel
                key={cur.id}
                thread={cur}
                sent={sentByThread[cur.id] ?? []}
                onSend={(text) => sendMessage(cur.id, text)}
                transcriptReloadKey={transcriptReloadKey}
              />
            </div>

            {canCreateThread && (
              <ComposeModal
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                onCreate={createThread}
              />
            )}
          </>
        );
      }}
    </AsyncBoundary>
  );
}
