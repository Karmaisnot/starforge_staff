// admin-org2.jsx — Meetings + Messages hub (chat + assign work)

// ═══ MEETINGS ════════════════════════════════════════════════
function MeetingsPage({ role }) {
  const meetings = [
    { t: 'Haftalik filial yig‘ilishi', aud: 'Butun filial', cnt: 16, d: 'Bugun', tm: '17:00–18:00', loc: 'Konferens zal', who: 'Dilnoza Yo‘ldosheva', tone: 'var(--sf-primary)', soon: true },
    { t: 'Matematika bo‘limi · metodik', aud: 'Matematika bo‘limi', cnt: 12, d: 'Ertaga', tm: '14:00–15:00', loc: 'Onlayn · Zoom', who: 'Nigora Karimova', tone: 'var(--sf-accent)' },
    { t: 'Sotuv natijalari · oylik', aud: 'Sotuv · Marketing', cnt: 5, d: '23 May', tm: '11:00', loc: '301-xona', who: 'Rustam Olimov', tone: 'var(--sf-warn)' },
    { t: 'Yangi o‘qituvchilar treningi', aud: 'Tanlangan · 6 kishi', cnt: 6, d: '24 May', tm: '10:00–13:00', loc: 'O‘quv zal', who: 'Malika Yusupova', tone: 'var(--sf-success)' },
  ];
  return (
    <>
      <AdminPageH eyebrow={role === 'ceo' ? 'Barcha filiallar' : 'Yunusobod filiali'} title="Yig‘ilishlar"
        sub="Bo‘lim yoki butun jamoa uchun yig‘ilish tayinlang"
        right={<><div className="ad-seg-sm"><button className="on">Ro‘yxat</button><button>Taqvim</button></div><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yig‘ilish tayinlash</ABtn></>} />
      <div className="og2-meet-layout">
        <div>
          <SecH>Yaqin yig‘ilishlar · 4</SecH>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meetings.map((m, i) => (
              <ACard key={i} pad={false} className="og2-meet">
                <div className="og2-meet-date" style={{ background: m.tone }}>
                  <div className="og2-meet-d">{m.d === 'Bugun' ? '19' : m.d === 'Ertaga' ? '20' : m.d.split(' ')[0]}</div>
                  <div className="og2-meet-mon">{m.d === 'Bugun' || m.d === 'Ertaga' ? 'May' : 'May'}</div>
                </div>
                <div className="og2-meet-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="og2-meet-t">{m.t}</span>
                    {m.soon && <Pill tone="primary" dot>Bugun</Pill>}
                  </div>
                  <div className="og2-meet-meta">
                    <span>{React.cloneElement(Icons.clock, { size: 12 })} {m.tm}</span>
                    <span>{React.cloneElement(m.loc.includes('Onlayn') ? Icons.video : Icons.pin, { size: 12 })} {m.loc}</span>
                  </div>
                  <div className="og2-meet-foot">
                    <span className="og2-meet-aud">{React.cloneElement(Icons.cohort, { size: 13 })} {m.aud} · {m.cnt} kishi</span>
                    <div className="og2-avatars-sm">{[0, 1, 2].map(j => <div key={j} className="og-av-wrap"><SfAvatar name={m.who + j} size={22} /></div>)}{m.cnt > 3 && <div className="og2-av-more-sm">+{m.cnt - 3}</div>}</div>
                  </div>
                </div>
              </ACard>
            ))}
          </div>
        </div>
        <div>
          <ACard title="Tezkor yig‘ilish">
            <div className="og2-form">
              <label className="og2-label">Mavzu</label>
              <div className="og2-input">Yig‘ilish nomi...</div>
              <label className="og2-label">Ishtirokchilar</label>
              <div className="og2-aud-grid">
                {[['Butun filial', Icons.globe, true], ['Bo‘lim', Icons.folder], ['Tanlangan', Icons.user], ['Boshqa filial', Icons.cohort]].map((a, i) => (
                  <button key={i} className={'og2-aud' + (a[2] ? ' on' : '')}>{React.cloneElement(a[1], { size: 16 })}<span>{a[0]}</span></button>
                ))}
              </div>
              <div className="og2-form-row">
                <div style={{ flex: 1 }}><label className="og2-label">Sana</label><div className="og2-input sf-mono">20.05.2026</div></div>
                <div style={{ flex: 1 }}><label className="og2-label">Vaqt</label><div className="og2-input sf-mono">17:00</div></div>
              </div>
              <label className="og2-label">Joy</label>
              <div className="og2-seg2"><button className="on">Zal</button><button>Onlayn</button><button>Xona</button></div>
              <button className="ad-btn ad-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>{React.cloneElement(Icons.bell, { size: 14 })} Tayinlash va xabar berish</button>
              <div className="og2-form-note">16 ishtirokchiga push + Telegram xabar yuboriladi</div>
            </div>
          </ACard>
        </div>
      </div>
      <style>{orgStyles}</style>
      <style>{org2Styles}</style>
    </>
  );
}

// ═══ MESSAGES HUB (chat + assign work) ═══════════════════════
function MessagesPage({ role }) {
  const [tab, setTab] = React.useState('all');
  const [sel, setSel] = React.useState(0);
  const [mode, setMode] = React.useState('msg'); // msg | task
  const tabs = [['all', 'Hammasi', 92], ['staff', 'Xodimlar', 24], ['teachers', 'O‘qituvchilar', 16], ['parents', 'Ota-onalar', 38], ['students', 'O‘quvchilar', 14]];
  const threads = [
    { n: 'Nigora Karimova', g: 'O‘qituvchi · Matematika', last: 'Ertangi yig‘ilishga tayyorman', tm: '14:42', un: 0, on: true, cat: 'teachers' },
    { n: 'Matematika bo‘limi', g: 'Guruh · 12 a‘zo', last: 'Siz: Yangi mavzular ro‘yxati...', tm: '13:20', un: 0, grp: true, cat: 'staff' },
    { n: 'Akbarova Dilnoza', g: 'Ota-ona · Akmal · 9-B', last: 'Rahmat ustoz!', tm: '12:18', un: 2, cat: 'parents' },
    { n: 'Aziz Tursunov', g: 'O‘qituvchi · Ingliz', last: 'Yangi guruh ochsak bo‘ladimi?', tm: '11:05', un: 1, on: true, cat: 'teachers' },
    { n: 'Halimova Zilola', g: 'O‘quvchi · 9-B', last: 'Uy ishini yubordim', tm: 'Du', un: 0, cat: 'students' },
    { n: 'Qabul bo‘limi', g: 'Guruh · 8 a‘zo', last: 'Bugun 6 ta yangi lid', tm: 'Du', un: 3, grp: true, cat: 'staff' },
    { n: 'Eshmatova Gulnora', g: 'Ota-ona · Otabek', last: 'To‘lov haqida savol', tm: 'Du', un: 0, cat: 'parents', flag: true },
  ];
  const filtered = tab === 'all' ? threads : threads.filter(t => t.cat === tab);
  const cur = filtered[sel] || filtered[0] || threads[0];
  return (
    <>
      <AdminPageH eyebrow="Aloqa markazi" title="Xabarlar"
        sub="O‘qituvchilar, ota-onalar, o‘quvchilar va xodimlar bilan yozishing"
        right={<ABtn kind="primary">{React.cloneElement(Icons.edit, { size: 14 })} Yangi suhbat</ABtn>} />
      <div className="og2-msg-layout">
        {/* threads */}
        <ACard pad={false} className="og2-threads">
          <div className="og2-tabs">{tabs.map(([id, l, n]) => (
            <button key={id} className={'og2-tab' + (tab === id ? ' on' : '')} onClick={() => { setTab(id); setSel(0); }}>{l}<span className="og2-tab-n">{n}</span></button>
          ))}</div>
          <div className="og2-thread-list">
            {filtered.map((th, i) => (
              <div key={i} className={'og2-thread' + (cur === th ? ' on' : '')} onClick={() => setSel(i)}>
                <div style={{ position: 'relative' }}>
                  {th.grp ? <div className="og2-grp-av" style={{ background: 'var(--sf-primary)' }}><SfStar size={18} color="#fff" /></div> : <SfAvatar name={th.n} size={40} />}
                  {th.on && <span className="og2-on-dot" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: th.un ? 700 : 600, display: 'flex', alignItems: 'center', gap: 5 }}>{th.n}{th.flag && React.cloneElement(Icons.flag, { size: 11, style: { color: 'var(--sf-danger)' } })}</span>
                    <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{th.tm}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{th.g}</div>
                  <div style={{ fontSize: 11.5, color: th.un ? 'var(--sf-ink-2)' : 'var(--sf-muted)', fontWeight: th.un ? 600 : 400, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{th.last}</div>
                </div>
                {th.un > 0 && <span className="og2-un">{th.un}</span>}
              </div>
            ))}
          </div>
        </ACard>
        {/* chat */}
        <div className="og2-chat">
          <div className="og2-chat-h">
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {cur.grp ? <div className="og2-grp-av" style={{ background: 'var(--sf-primary)', width: 38, height: 38 }}><SfStar size={17} color="#fff" /></div> : <SfAvatar name={cur.n} size={38} />}
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>{cur.n}</div><div style={{ fontSize: 11, color: cur.on ? 'var(--sf-success)' : 'var(--sf-muted)' }}>{cur.on ? '● onlayn' : cur.g}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}><button className="ad-mini-btn" style={{ color: 'var(--sf-muted)' }}>{React.cloneElement(Icons.search, { size: 15 })}</button><button className="ad-mini-btn" style={{ color: 'var(--sf-muted)' }}>{Icons.more}</button></div>
          </div>
          <div className="og2-chat-body">
            <div className="og2-day">Bugun</div>
            <div className="og2-m in"><div className="og2-b in">Assalomu alaykum! {cur.grp ? 'Guruhga xush kelibsiz.' : 'Sizga bir savol bor edi.'}<div className="og2-bt">13:40</div></div></div>
            <div className="og2-m out"><div className="og2-b out">Va alaykum assalom! Albatta, eshitaman.<div className="og2-bt" style={{ color: 'rgba(255,252,245,0.7)' }}>13:42</div></div></div>
            <div className="og2-m in"><div className="og2-b in">{cur.last}<div className="og2-bt">{cur.tm}</div></div></div>
          </div>
          {/* composer */}
          <div className="og2-composer">
            <div className="og2-mode">
              <button className={mode === 'msg' ? 'on' : ''} onClick={() => setMode('msg')}>{React.cloneElement(Icons.chat, { size: 13 })} Xabar</button>
              <button className={mode === 'task' ? 'on' : ''} onClick={() => setMode('task')}>{React.cloneElement(Icons.check, { size: 13 })} Vazifa berish</button>
            </div>
            {mode === 'task' && (
              <div className="og2-task-fields">
                <div className="og2-tf"><span className="og2-tf-l">Kimga</span><span className="og2-tf-v">{cur.grp ? cur.n + ' (bo‘lim)' : cur.n}</span></div>
                <div className="og2-tf"><span className="og2-tf-l">Muddat</span><span className="og2-tf-v sf-mono">22.05 · 18:00</span></div>
                <div className="og2-tf"><span className="og2-tf-l">Prioritet</span><span className="og2-tf-v" style={{ color: 'var(--sf-danger)' }}>P1 ●</span></div>
              </div>
            )}
            <div className="og2-input-row">
              <button className="ad-mini-btn" style={{ color: 'var(--sf-muted)' }}>{React.cloneElement(Icons.attach, { size: 16 })}</button>
              <div className="og2-text">{mode === 'task' ? 'Vazifa tavsifini yozing...' : 'Xabar yozing...'}</div>
              <button className="og2-send" style={{ background: mode === 'task' ? 'var(--sf-ink)' : 'var(--sf-primary)' }}>{React.cloneElement(mode === 'task' ? Icons.check : Icons.send, { size: 16 })}</button>
            </div>
          </div>
        </div>
        {/* context */}
        <div className="og2-ctx">
          <ACard title="Tezkor amallar" pad={false}>
            {[['Vazifa biriktirish', Icons.check, 'var(--sf-primary)'], ['Yig‘ilishga chaqirish', Icons.cal, 'var(--sf-accent)'], ['Ommaviy e‘lon', Icons.bell, 'var(--sf-warn)'], ['Bo‘limga xabar', Icons.folder, 'var(--sf-success)']].map((a, i, arr) => (
              <div key={i} className="og2-action" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
                <div className="og2-action-ic" style={{ background: a[2] + '22', color: a[2] }}>{React.cloneElement(a[1], { size: 15 })}</div>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{a[0]}</span>
                {React.cloneElement(Icons.chevR, { size: 14, style: { color: 'var(--sf-muted)' } })}
              </div>
            ))}
          </ACard>
          <ACard title="Profil" style={{ marginTop: 14 }}>
            <div style={{ textAlign: 'center', padding: '4px 0' }}>
              {cur.grp ? <div className="og2-grp-av" style={{ background: 'var(--sf-primary)', width: 56, height: 56, margin: '0 auto' }}><SfStar size={26} color="#fff" /></div> : <SfAvatar name={cur.n} size={56} />}
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{cur.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--sf-muted)' }}>{cur.g}</div>
              {!cur.grp && <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}><Pill tone="primary">Profil</Pill><Pill tone="success">Tarix</Pill></div>}
            </div>
          </ACard>
        </div>
      </div>
      <style>{orgStyles}</style>
      <style>{org2Styles}</style>
    </>
  );
}

const org2Styles = `
.og2-meet-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px; align-items: start; }
@media (max-width: 1000px) { .og2-meet-layout { grid-template-columns: 1fr; } }
.og2-meet { display: flex; }
.og2-meet-date { width: 64px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; }
.og2-meet-d { font-size: 24px; font-weight: 800; font-family: var(--sf-font-mono); }
.og2-meet-mon { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; }
.og2-meet-body { flex: 1; padding: 14px 16px; }
.og2-meet-t { font-size: 14.5px; font-weight: 700; }
.og2-meet-meta { display: flex; gap: 16px; margin-top: 7px; font-size: 11.5px; color: var(--sf-muted); }
.og2-meet-meta span { display: flex; align-items: center; gap: 5px; }
.og2-meet-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 11px; padding-top: 11px; border-top: 1px solid var(--sf-border); }
.og2-meet-aud { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--sf-ink-2); }
.og2-avatars-sm { display: flex; align-items: center; }
.og2-av-more-sm { width: 22px; height: 22px; border-radius: 50%; background: var(--sf-surface-3); color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; border: 2px solid var(--sf-surface); }

.og2-form { display: flex; flex-direction: column; }
.og2-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sf-muted); margin-bottom: 6px; margin-top: 12px; }
.og2-label:first-child { margin-top: 0; }
.og2-input { padding: 10px 12px; border-radius: 9px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); font-size: 13px; color: var(--sf-muted); }
.og2-aud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.og2-aud { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 9px; background: var(--sf-surface); border: 1px solid var(--sf-border); cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-ink-2); }
.og2-aud.on { background: var(--sf-primary-soft); border-color: var(--sf-primary); color: var(--sf-primary-ink); }
.og2-form-row { display: flex; gap: 10px; }
.og2-seg2 { display: flex; gap: 4px; padding: 4px; background: var(--sf-surface-2); border-radius: 9px; }
.og2-seg2 button { flex: 1; padding: 7px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-muted); }
.og2-seg2 button.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }
.og2-form-note { margin-top: 10px; font-size: 10.5px; color: var(--sf-muted); text-align: center; }

.og2-msg-layout { display: grid; grid-template-columns: 300px 1fr 240px; gap: 14px; height: calc(100vh - 200px); min-height: 580px; }
@media (max-width: 1280px) { .og2-msg-layout { grid-template-columns: 280px 1fr; } .og2-ctx { display: none; } }
@media (max-width: 860px) { .og2-msg-layout { grid-template-columns: 1fr; } .og2-chat { display: none; } }
.og2-threads { display: flex; flex-direction: column; overflow: hidden; }
.og2-tabs { display: flex; gap: 2px; padding: 8px; border-bottom: 1px solid var(--sf-border); overflow-x: auto; }
.og2-tab { display: flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 11.5px; font-weight: 600; color: var(--sf-muted); white-space: nowrap; }
.og2-tab.on { background: var(--sf-ink); color: var(--sf-bg); }
.og2-tab-n { font-family: var(--sf-font-mono); font-size: 9px; opacity: 0.7; }
.og2-thread-list { flex: 1; overflow-y: auto; }
.og2-thread { display: flex; gap: 10px; padding: 11px 13px; align-items: center; border-bottom: 1px solid var(--sf-border); cursor: pointer; }
.og2-thread:hover { background: var(--sf-surface-2); }
.og2-thread.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
.og2-grp-av { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.og2-on-dot { position: absolute; right: -1px; bottom: -1px; width: 12px; height: 12px; border-radius: 50%; background: var(--sf-success); border: 2.5px solid var(--sf-surface); }
.og2-un { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: var(--sf-primary); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

.og2-chat { display: flex; flex-direction: column; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.og2-chat-h { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; border-bottom: 1px solid var(--sf-border); }
.og2-chat-body { flex: 1; overflow-y: auto; padding: 16px; background: var(--sf-bg); display: flex; flex-direction: column; gap: 10px; }
.og2-day { text-align: center; font-size: 10px; color: var(--sf-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin: 4px 0; }
.og2-m { display: flex; max-width: 74%; }
.og2-m.out { align-self: flex-end; }
.og2-b { padding: 9px 13px; font-size: 13px; line-height: 1.4; border-radius: 14px; }
.og2-b.in { background: var(--sf-surface); border: 1px solid var(--sf-border); border-bottom-left-radius: 4px; }
.og2-b.out { background: var(--sf-primary); color: #fff; border-bottom-right-radius: 4px; }
.og2-bt { font-size: 9px; color: var(--sf-muted); margin-top: 4px; }
.og2-composer { border-top: 1px solid var(--sf-border); padding: 10px 14px; }
.og2-mode { display: inline-flex; gap: 3px; padding: 3px; background: var(--sf-surface-2); border-radius: 8px; margin-bottom: 9px; }
.og2-mode button { display: flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 11.5px; font-weight: 700; color: var(--sf-muted); }
.og2-mode button.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }
.og2-task-fields { display: flex; gap: 8px; margin-bottom: 9px; flex-wrap: wrap; }
.og2-tf { display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: var(--sf-surface-2); border-radius: 8px; }
.og2-tf-l { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--sf-muted); font-weight: 700; }
.og2-tf-v { font-size: 11.5px; font-weight: 700; }
.og2-input-row { display: flex; align-items: center; gap: 8px; }
.og2-text { flex: 1; padding: 10px 14px; border-radius: 22px; background: var(--sf-surface-2); font-size: 13px; color: var(--sf-muted); }
.og2-send { width: 36px; height: 36px; border-radius: 10px; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.og2-ctx { display: flex; flex-direction: column; }
.og2-action { display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer; }
.og2-action:hover { background: var(--sf-surface-2); }
.og2-action-ic { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
`;

Object.assign(window, { MeetingsPage, MessagesPage });
