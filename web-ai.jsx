// web-ai.jsx — AI Chat page (3-column layout on desktop)

function AiPage({ onNav }) {
  const groups = [
    { id: 1, n: '9-B Algebra', sub: '24 o‘quvchi', t: 'Bugun · 11:34', preview: 'Bu hafta sinf umuman barqaror. 2 ta o‘quvchi diqqat talab qiladi…', pinned: true, on: true, color: 'var(--sf-primary)' },
    { id: 2, n: 'Algebra Mid', sub: '21 o‘quvchi', t: 'Bugun · 09:12', preview: 'Davronova S. va Halimova Z. olimpiada darajasi…', color: 'var(--sf-primary)' },
    { id: 3, n: '10-V Geometriya', sub: '19 o‘quvchi', t: 'Kecha', preview: 'Trapetsiya mavzusi yaxshi tushunilgan…', color: 'var(--sf-accent)' },
    { id: 4, n: 'Umumiy savol', sub: 'barcha guruhlar', t: '3 kun', preview: '“Bu oy eng yaxshi 5 ustozni ko‘rsat”', color: 'var(--sf-ai)', isAll: true },
  ];

  return (
    <>
      <WebPageHeader
        title={<>AI <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>suhbat</span></>}
        subtitle="Guruhlaringiz haqida AI bilan suhbatlashing"
        right={
          <>
            <div className="web-ai-meter">
              <SfAiBadge compact>limit</SfAiBadge>
              <div className="web-ai-meter-bar">
                <div style={{ width: '8.6%' }} />
              </div>
              <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                4320 / 50000
              </span>
            </div>
          </>
        }
      />

      <div className="web-ai-layout">
        {/* LEFT — Group list */}
        <WebCard padded={false} className="web-ai-list">
          <div className="web-ai-search">
            {React.cloneElement(Icons.search, { size: 14, style: { color: 'var(--sf-muted)' } })}
            <span>Suhbat qidirish...</span>
          </div>
          {groups.map(g => (
            <div key={g.id} className={`web-ai-group ${g.on ? 'on' : ''}`}>
              <div className="web-ai-group-mark" style={{ background: g.color }}>
                {g.isAll ? React.cloneElement(Icons.ai, { size: 18, style: { color: '#FFFCF5' } })
                          : <SfStar size={18} color="#FFFCF5" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{g.n}</span>
                  {g.pinned && <span style={{ color: 'var(--sf-accent)' }}>{React.cloneElement(Icons.pin, { size: 10 })}</span>}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{g.sub}</div>
                <div className="web-ai-group-preview">{g.preview}</div>
              </div>
              <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{g.t}</span>
            </div>
          ))}
        </WebCard>

        {/* CENTER — Chat */}
        <div className="web-ai-chat">
          <div className="web-ai-chat-h">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="web-cohort-mark" style={{ background: 'var(--sf-primary)' }}>
                <SfStar size={16} color="#FFFCF5" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>9-B Algebra</span>
                  <SfAiBadge compact>guruh</SfAiBadge>
                </div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>24 o‘quvchi · sizning ma‘lumotlaringiz</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="web-icon-btn">{React.cloneElement(Icons.download, { size: 14 })}</button>
              <button className="web-icon-btn">{Icons.more}</button>
            </div>
          </div>

          {/* Prompts */}
          <div className="web-ai-prompts">
            {['Haftalik xulosa', 'Kim qiynalmoqda?', 'Up karta nomzodlari', 'Ota-onaga xat'].map(p => (
              <div key={p} className="web-ai-prompt">{p}</div>
            ))}
          </div>

          <div className="web-ai-body">
            <div className="web-chat-out">
              9-B kvadrat tenglamalar mavzusida qanday boryapti?
            </div>
            <div className="web-chat-in-wrap">
              <div className="web-ai-mini">Ai</div>
              <div className="web-chat-in">
                <div>
                  <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontSize: 16 }}>Umuman barqaror.</span>{' '}
                  24 o‘quvchidan 18 nafari mavzuni mustaqil yechmoqda. 4 nafari diskriminant formulasida xato.
                </div>
                <div className="web-stats-row">
                  {[
                    { v: '18', l: 'O‘zlashtirdi', c: 'var(--sf-success)' },
                    { v: '4', l: 'Qiynalmoqda', c: 'var(--sf-warn)' },
                    { v: '2', l: 'Tushunmagan', c: 'var(--sf-danger)' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="sf-mono" style={{ fontSize: 22, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
                      <div style={{ marginTop: 4, fontSize: 9.5, color: 'var(--sf-muted)',
                                      letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="web-stats-bar">
                  <div style={{ width: '75%', background: 'var(--sf-success)' }} />
                  <div style={{ width: '17%', background: 'var(--sf-warn)' }} />
                  <div style={{ width: '8%', background: 'var(--sf-danger)' }} />
                </div>

                <div style={{ marginTop: 14, fontSize: 14 }}>Diqqat qaratish kerak bo‘lganlar:</div>
                <div className="web-chat-students">
                  {[
                    { n: 'Eshmatov Otabek', r: 'Diskriminant ishorasi · 2 marta xato' },
                    { n: 'Bakirov Sherzod', r: 'Formulani eslamayotgan' },
                  ].map((s, i) => (
                    <div key={i} className="web-chat-student">
                      <SfAvatar name={s.n} size={26} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s.n}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--sf-warn)' }}>{s.r}</div>
                      </div>
                      <button className="web-btn web-btn-soft" style={{ padding: '4px 10px', fontSize: 11 }}>
                        Karta ber
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 12, fontSize: 14 }}>
                  <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic' }}>Tavsiya:</span>{' '}
                  ertangi darsda 5 daqiqalik takrorlash + Eshmatov va Bakirov bilan qisqa individual ish.
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="web-btn web-btn-soft">{React.cloneElement(Icons.doc, { size: 12 })} Takrorlash rejasi</button>
                  <button className="web-btn web-btn-soft">{React.cloneElement(Icons.chat, { size: 12 })} Otabekka xabar</button>
                  <button className="web-btn web-btn-soft">{React.cloneElement(Icons.print, { size: 12 })} Chop etish</button>
                </div>
                <div className="sf-mono" style={{ marginTop: 10, fontSize: 9.5, color: 'var(--sf-muted)' }}>
                  Davomat + kartalar · 14-19 May · 420 token
                </div>
              </div>
            </div>

            <div className="web-chat-out">Otabekka otasiga yoziladigan xabar tayyorla.</div>
            <div className="web-chat-in-wrap">
              <div className="web-ai-mini">Ai</div>
              <div className="web-chat-in" style={{ padding: '14px 18px' }}>
                <div className="web-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="web-ai-input">
            <span style={{ flex: 1, color: 'var(--sf-muted)' }}>9-B haqida savol bering...</span>
            <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>~120 token</span>
            <button className="web-icon-btn-primary">{React.cloneElement(Icons.send, { size: 16 })}</button>
          </div>
        </div>

        {/* RIGHT — Context panel */}
        <div className="web-ai-ctx">
          <WebCard title="Guruh konteksti">
            <div className="web-ctx-rows">
              {[
                { l: 'Guruh', v: '9-B Algebra' },
                { l: 'O‘quvchilar', v: '24' },
                { l: 'Daraja', v: 'II · o‘rta' },
                { l: 'Davomat (oy)', v: '94%', c: 'var(--sf-success)' },
                { l: 'Up kartalar', v: '↑18', c: '#7A4F0E' },
                { l: 'Down kartalar', v: '↓4', c: 'var(--sf-danger)' },
                { l: 'Topshiriqlar', v: '12' },
                { l: 'AI suhbatlar', v: '7 ta' },
              ].map((r, i) => (
                <div key={i} className="web-ctx-row">
                  <span>{r.l}</span>
                  <span className="sf-mono" style={{ color: r.c || 'var(--sf-ink-2)', fontWeight: 700 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </WebCard>

          <WebCard title="Diqqat o‘quvchilari">
            {[
              { n: 'Eshmatov Otabek', r: '4 Down · 72% davomat' },
              { n: 'Bakirov Sherzod', r: '2 Down · 88% davomat' },
            ].map((s, i, a) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '8px 0', alignItems: 'center',
                borderBottom: i < a.length - 1 ? '1px dashed var(--sf-border)' : 'none',
              }}>
                <SfAvatar name={s.n} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--sf-warn)' }}>{s.r}</div>
                </div>
              </div>
            ))}
          </WebCard>

          <WebCard title="Mavzular">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['Kvadrat teng.', 'Funksiyalar', 'Diskriminant', 'Viet form.', 'Logarifm', 'Tenglamalar'].map(t => (
                <WebChip key={t} tone="ai">{t}</WebChip>
              ))}
            </div>
          </WebCard>
        </div>
      </div>

      <style>{aiPageStyles}</style>
    </>
  );
}

const aiPageStyles = `
.web-ai-meter {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border);
  border-radius: 10px;
}
.web-ai-meter-bar {
  width: 100px; height: 4px; border-radius: 4px;
  background: rgba(255,252,245,0.5); overflow: hidden;
}
.web-ai-meter-bar > div { height: 100%; background: var(--sf-ai); }

.web-ai-layout {
  display: grid; grid-template-columns: 280px 1fr 280px; gap: 16px;
  height: calc(100vh - 230px); min-height: 600px;
}
@media (max-width: 1280px) { .web-ai-layout { grid-template-columns: 260px 1fr; }
                              .web-ai-ctx { display: none; } }
@media (max-width: 900px) { .web-ai-layout { grid-template-columns: 1fr; }
                            .web-ai-list { display: none; } }

.web-ai-list {
  overflow-y: auto;
}
.web-ai-search {
  padding: 10px 14px; display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid var(--sf-border);
  color: var(--sf-muted); font-size: 12px;
}
.web-ai-group {
  padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start;
  border-bottom: 1px solid var(--sf-border); cursor: pointer;
  transition: background 0.12s;
}
.web-ai-group:hover { background: var(--sf-surface-2); }
.web-ai-group.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
.web-ai-group-mark {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.web-ai-group-preview {
  margin-top: 6px; font-size: 11px; color: var(--sf-muted); font-style: italic;
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Chat */
.web-ai-chat {
  display: flex; flex-direction: column; min-width: 0;
  background: var(--sf-surface); border: 1px solid var(--sf-border);
  border-radius: 16px; overflow: hidden;
}
.web-ai-chat-h {
  padding: 14px 18px; border-bottom: 1px solid var(--sf-border);
  display: flex; justify-content: space-between; align-items: center;
}
.web-ai-prompts {
  display: flex; gap: 6px; padding: 12px 18px;
  background: var(--sf-bg);
  border-bottom: 1px solid var(--sf-border);
  overflow-x: auto;
}
.web-ai-prompt {
  padding: 6px 12px; border-radius: 999px;
  background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border);
  color: var(--sf-ai); font-size: 12px; font-weight: 600;
  cursor: pointer; white-space: nowrap;
}
.web-ai-prompt:hover { background: var(--sf-accent-soft); }

.web-ai-body {
  flex: 1; overflow-y: auto;
  padding: 18px;
  display: flex; flex-direction: column; gap: 12px;
  background: var(--sf-bg);
}

.web-chat-out {
  align-self: flex-end; max-width: 72%;
  padding: 10px 14px; border-radius: 18px 18px 4px 18px;
  background: var(--sf-ink); color: var(--sf-bg);
  font-size: 13.5px; line-height: 1.4;
}
.web-chat-in-wrap { display: flex; gap: 8px; align-items: flex-end; max-width: 88%; }
.web-chat-in {
  flex: 1; padding: 12px 16px; border-radius: 4px 18px 18px 18px;
  background: var(--sf-surface); border: 1px solid var(--sf-border);
  font-size: 13.5px; line-height: 1.5;
}
.web-stats-row {
  margin-top: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  padding: 12px; background: var(--sf-surface-2); border-radius: 10px;
}
.web-stats-bar {
  margin-top: 6px; height: 5px; border-radius: 4px; overflow: hidden;
  background: var(--sf-surface-2); display: flex;
}
.web-chat-students { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.web-chat-student {
  display: flex; gap: 8px; align-items: center;
  padding: 8px 10px; border-radius: 10px;
  background: var(--sf-warn-soft);
}

.web-typing { display: flex; gap: 4px; }
.web-typing span {
  width: 6px; height: 6px; border-radius: 50%; background: var(--sf-ai);
  opacity: 0.4;
  animation: webDot 1.2s infinite ease-in-out;
}
.web-typing span:nth-child(2) { animation-delay: 0.2s; }
.web-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes webDot {
  0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
}

.web-ai-input {
  padding: 12px 18px; display: flex; gap: 8px; align-items: center;
  border-top: 1px solid var(--sf-border);
}
.web-icon-btn-primary {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--sf-primary); color: #FFFCF5;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

/* Context */
.web-ai-ctx { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.web-ctx-rows { display: flex; flex-direction: column; gap: 6px; }
.web-ctx-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: var(--sf-muted);
  padding: 4px 0;
  border-bottom: 1px dashed var(--sf-border);
}
.web-ctx-row:last-child { border-bottom: none; }
`;

Object.assign(window, { AiPage });
