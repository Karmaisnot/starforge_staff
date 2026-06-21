import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { AiBadge, Avatar, Button, Card, Chip, Icon, StarMark } from '@/ui';
import { useAiPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './ai.module.css';

export function AiPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t: tt } = useT();
  const state = useAiPage();

  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');
  // Messages typed this session, kept per-conversation so switching threads
  // (and coming back) preserves what you sent. Each item is { role, text }.
  const [convMsgs, setConvMsgs] = useState({});
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AsyncBoundary state={state}>
      {(d) => {
        const activeId = selectedId ?? d.active?.id;
        const t = d.workspace.transcript;
        // The loaded workspace (transcript + analysis) belongs to one conversation.
        // Other conversations have no transcript yet, so we show a clean start state
        // instead of mislabeling this conversation's data under their name.
        const activeConv = d.conversations.find((c) => c.id === activeId);
        const isWorkspaceConv = activeId === d.active?.id;
        const msgs = convMsgs[activeId] ?? [];
        const filteredConvs = d.conversations.filter((g) =>
          String(g.name).toLowerCase().includes(query.toLowerCase()),
        );

        // Append the user's message, then a (mock) AI reply shortly after — scoped
        // to the conversation it was sent from so a late reply can't land elsewhere.
        const send = (text) => {
          const value = (text ?? draft).trim();
          if (!value || !activeId) return;
          setDraft('');
          setConvMsgs((m) => ({ ...m, [activeId]: [...(m[activeId] ?? []), { role: 'user', text: value }] }));
          toast(tt('ai.writing'));
          const targetId = activeId;
          const reply = tt('ai.reply');
          setTimeout(() => {
            setConvMsgs((m) => ({ ...m, [targetId]: [...(m[targetId] ?? []), { role: 'ai', text: reply }] }));
          }, 600);
        };

        const clearChat = () => {
          setConvMsgs((m) => ({ ...m, [activeId]: [] }));
          setMenuOpen(false);
          toast(tt('ai.cleared'));
        };

        const downloadChat = () => {
          const text = [
            String(activeConv?.name ?? ''),
            '',
            // Only the workspace conversation renders the canned transcript; for the
            // rest, export just the session messages so the file matches the screen.
            ...(isWorkspaceConv
              ? [t.outgoing1, `${t.reply.leadItalic}${t.reply.leadRest}`, t.outgoing2]
              : []),
            ...msgs.map((mm) => `${mm.role === 'ai' ? 'AI: ' : ''}${mm.text}`),
          ].join('\n');
          const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
          const a = document.createElement('a');
          a.href = url;
          a.download = `${String(activeConv?.name ?? 'chat')}.txt`;
          a.click();
          URL.revokeObjectURL(url);
          setMenuOpen(false);
          toast(tt('ai.downloaded'));
        };
        return (
          <>
            <PageHeader
              title={
                <>
                  {tt('ai.titleA')} <span className="sf-serif" style={{ fontWeight: 400 }}>{tt('ai.titleB')}</span>
                </>
              }
              subtitle={tt('ai.subtitle')}
              right={
                <div className={styles.meter}>
                  <AiBadge compact>{tt('ai.limit')}</AiBadge>
                  <div className={styles.meterBar}>
                    <div style={{ width: `${d.usage.percent}%` }} />
                  </div>
                  <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                    {d.usage.used} / {d.usage.limit}
                  </span>
                </div>
              }
            />

            <div className={styles.layout}>
              {/* List */}
              <Card padded={false} className={styles.list}>
                <div className={styles.search}>
                  <Icon name="search" size={14} style={{ color: 'var(--sf-muted)' }} />
                  <input
                    className={styles.searchInput}
                    aria-label={tt('ai.searchConv')}
                    placeholder={tt('ai.searchConv')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {filteredConvs.map((g) => (
                  <button
                    key={g.id}
                    className={`${styles.group} ${activeId === g.id ? styles.on : ''}`}
                    onClick={() => {
                      setSelectedId(g.id);
                      setDraft('');
                      setMenuOpen(false);
                    }}
                  >
                    <div className={styles.groupMark} style={{ background: g.color }}>
                      {g.isAll ? (
                        <Icon name="ai" size={18} style={{ color: '#fffcf5' }} />
                      ) : (
                        <StarMark size={18} color="#fffcf5" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{g.name}</span>
                        {g.pinned && <Icon name="pin" size={10} style={{ color: 'var(--sf-accent)' }} />}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{g.sub}</div>
                      <div className={styles.groupPreview}>{g.preview}</div>
                    </div>
                    <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>
                      {g.time}
                    </span>
                  </button>
                ))}
              </Card>

              {/* Chat */}
              <div className={styles.chat}>
                <div className={styles.chatHead}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className={styles.chatMark}>
                      <StarMark size={16} color="#fffcf5" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>
                          {activeConv?.name ?? tt('nav.ai')}
                        </span>
                        <AiBadge compact>{tt('ai.group')}</AiBadge>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                        {activeConv?.sub ?? tt('ai.studentsCtx')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className={styles.iconBtn} onClick={downloadChat} aria-label={tt('ai.menuDownload')}>
                      <Icon name="download" size={14} />
                    </button>
                    <div className={styles.menuWrap}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label={tt('ai.menu')}
                      >
                        <Icon name="more" size={14} />
                      </button>
                      {menuOpen && (
                        <>
                          <div className={styles.menuScrim} onClick={() => setMenuOpen(false)} />
                          <div className={styles.menu} role="menu">
                            <button className={styles.menuItem} role="menuitem" onClick={downloadChat}>
                              <Icon name="download" size={14} />
                              {tt('ai.menuDownload')}
                            </button>
                            <button className={styles.menuItem} role="menuitem" onClick={clearChat}>
                              <Icon name="x" size={14} />
                              {tt('ai.menuClear')}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.prompts}>
                  {d.workspace.prompts.map((p) => (
                    <button key={p} className={styles.prompt} onClick={() => setDraft(p)}>
                      {p}
                    </button>
                  ))}
                </div>

                <div className={styles.body}>
                  {isWorkspaceConv && (
                    <>
                  <div className={styles.out}>{t.outgoing1}</div>

                  <div className={styles.inWrap}>
                    <div className={styles.aiMini}>Ai</div>
                    <div className={styles.in}>
                      <div>
                        <span className="sf-serif" style={{ fontSize: 16 }}>{t.reply.leadItalic}</span>
                        {t.reply.leadRest}
                      </div>
                      <div className={styles.statsRow}>
                        {t.reply.stats.map((s, i) => (
                          <div key={i}>
                            <div className="sf-mono" style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                              {s.value}
                            </div>
                            <div className={styles.statL}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.statsBar}>
                        {t.reply.bar.map((b, i) => (
                          <div key={i} style={{ width: b.width, background: b.color }} />
                        ))}
                      </div>

                      <div style={{ marginTop: 14, fontSize: 14 }}>{tt('ai.focusTitle')}</div>
                      <div className={styles.focus}>
                        {t.reply.focusStudents.map((s, i) => (
                          <div key={i} className={styles.focusRow}>
                            <Avatar name={s.name} size={26} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s.name}</div>
                              <div style={{ fontSize: 10.5, color: 'var(--sf-warn)' }}>{s.reason}</div>
                            </div>
                            <Button
                              variant="soft"
                              style={{ padding: '4px 10px', fontSize: 11 }}
                              onClick={() => navigate('/cards', { state: { issueTo: s.name } })}
                            >
                              {tt('ai.giveCard')}
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: 12, fontSize: 14 }}>
                        <span className="sf-serif">{t.reply.recommendationItalic}</span>
                        {t.reply.recommendationRest}
                      </div>

                      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {t.reply.actions.map((a) => (
                          <Button key={a.label} variant="soft" icon={a.icon} iconSize={12} onClick={() => send(a.label)}>
                            {a.label}
                          </Button>
                        ))}
                      </div>
                      <div className="sf-mono" style={{ marginTop: 10, fontSize: 9.5, color: 'var(--sf-muted)' }}>
                        {t.reply.meta}
                      </div>
                    </div>
                  </div>

                  <div className={styles.out}>{t.outgoing2}</div>
                    </>
                  )}

                  {!isWorkspaceConv && msgs.length === 0 && (
                    <div
                      style={{
                        padding: '48px 24px',
                        textAlign: 'center',
                        color: 'var(--sf-muted)',
                        fontSize: 13,
                      }}
                    >
                      {tt('ai.emptyHint')}
                    </div>
                  )}

                  {msgs.map((mm, i) =>
                    mm.role === 'ai' ? (
                      <div key={i} className={styles.inWrap}>
                        <div className={styles.aiMini}>Ai</div>
                        <div className={styles.in}>{mm.text}</div>
                      </div>
                    ) : (
                      <div key={i} className={styles.out}>
                        {mm.text}
                      </div>
                    ),
                  )}
                </div>

                <form
                  className={styles.input}
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                >
                  <input
                    className={styles.inputField}
                    aria-label={tt('ai.placeholder')}
                    placeholder={tt('ai.placeholder')}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                    {tt('ai.tokenEst')}
                  </span>
                  <button type="submit" className={styles.send} aria-label={tt('common.send')}>
                    <Icon name="send" size={16} />
                  </button>
                </form>
              </div>

              {/* Context */}
              <div className={styles.ctx}>
                <Card title={tt('ai.ctxTitle')}>
                  <div className={styles.ctxRows}>
                    {d.workspace.context.map((r, i) => (
                      <div key={i} className={styles.ctxRow}>
                        <span>{r.label}</span>
                        <span className="sf-mono" style={{ color: r.color || 'var(--sf-ink-2)', fontWeight: 700 }}>
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title={tt('ai.attentionTitle')}>
                  {d.workspace.attention.map((s, i, a) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: '8px 0',
                        alignItems: 'center',
                        borderBottom: i < a.length - 1 ? '1px dashed var(--sf-border)' : 'none',
                      }}
                    >
                      <Avatar name={s.name} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--sf-warn)' }}>{s.reason}</div>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card title={tt('ai.topicsTitle')}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {d.workspace.topics.map((topic) => (
                      <Chip key={topic} tone="ai">
                        {topic}
                      </Chip>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>
        );
      }}
    </AsyncBoundary>
  );
}
