// staff-pages.jsx — Working, role-aware pages for the Staff app.
// Reuses admin-common primitives (Kpi, Table, AreaChart, Donut, Pill, Money, SecH).
// Every actionable control calls window.sfToast — no dead buttons.

const T = (m, o) => window.sfToast && window.sfToast(m, o);

const staffPageStyles = (window.staffPageStyles = `
.sp-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px; }
.sp-grid2 { display: grid; grid-template-columns: minmax(0,1.5fr) minmax(0,1fr); gap: 16px; }
@media (max-width: 1100px) { .sp-grid2 { grid-template-columns: 1fr; } }
.sp-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sp-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.sp-card-h { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; border-bottom: 1px solid var(--sf-border); }
.sp-card-h h3 { margin: 0; font-size: 13.5px; font-weight: 700; }
.sp-link { font-size: 12px; color: var(--sf-primary); font-weight: 600; cursor: pointer; }
.sp-hero { position: relative; border-radius: 18px; padding: 22px; overflow: hidden; color: #fff; }
.sp-hero-eye { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; opacity: 0.85; }
.sp-hero-t { font-size: 28px; font-weight: 800; letter-spacing: -0.025em; margin-top: 8px; }
.sp-hero-s { font-size: 13px; opacity: 0.9; margin-top: 5px; }
.sp-hero-acts { display: flex; gap: 8px; margin-top: 18px; }
.sp-hero-btn { padding: 9px 16px; border-radius: 999px; border: none; background: #FFFCF5; color: var(--sf-ink); font-family: inherit; font-weight: 700; font-size: 13px; cursor: pointer; }
.sp-hero-btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255,252,245,0.4); }
.sp-srow { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
.sp-time { width: 46px; font-size: 13px; font-weight: 600; color: var(--sf-ink-2); }
.sp-rail { width: 3px; height: 20px; border-radius: 2px; }
.sp-quick { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap: 10px; }
.sp-quick-b { display: flex; align-items: center; gap: 8px; padding: 13px 14px; border-radius: 12px; background: var(--sf-surface); border: 1px solid var(--sf-border); cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; color: var(--sf-ink); transition: transform 0.1s; }
.sp-quick-b:hover { transform: translateY(-2px); box-shadow: var(--sf-shadow-sm); }
.sp-quick-ic { display: flex; }
.sp-ai { background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 14px; padding: 16px; cursor: pointer; }
.sp-ai-q { font-family: var(--sf-font-display); font-style: italic; font-size: 16px; line-height: 1.35; color: var(--sf-ink); margin: 10px 0; }
.sp-ai-btn { padding: 7px 14px; border-radius: 9px; border: none; background: var(--sf-ink); color: var(--sf-bg); font-family: inherit; font-weight: 700; font-size: 12px; cursor: pointer; }
.sp-ev { display: flex; align-items: center; gap: 10px; padding: 11px 16px; }
.sp-ev-ic { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sp-ev-t { font-size: 12.5px; font-weight: 600; }
.sp-ev-s { font-size: 10.5px; color: var(--sf-muted); }
.sp-att-sum { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
.sp-att-stat { flex: 1; min-width: 80px; text-align: center; padding: 12px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; }
.sp-att-l { font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--sf-muted); font-weight: 600; margin-top: 3px; }
.sp-att-prog { flex: 2; min-width: 140px; display: flex; align-items: center; gap: 10px; }
.sp-att-prog-bar { flex: 1; height: 8px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
.sp-att-prog-bar > div { height: 100%; background: var(--sf-primary); transition: width 0.3s; }
.sp-att-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; transition: background 0.2s; }
.sp-att-btns { display: flex; gap: 6px; }
.sp-att-b { width: 38px; height: 38px; border-radius: 11px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-size: 17px; font-weight: 700; transition: all 0.14s; }
.sp-att-b.on { transform: scale(1.05); }
.sp-lbl { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sf-muted); margin-bottom: 8px; }
.sp-stu-pick { display: flex; gap: 8px; flex-wrap: wrap; }
.sp-stu { display: flex; align-items: center; gap: 7px; padding: 6px 12px 6px 6px; border-radius: 999px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600; }
.sp-stu.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
.sp-types { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sp-type { display: flex; align-items: center; gap: 9px; padding: 10px; border-radius: 11px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 700; color: var(--sf-ink); }
.sp-type-mark { width: 26px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
.sp-groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 14px; }
.sp-group { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; padding: 16px; cursor: pointer; transition: transform 0.1s, box-shadow 0.15s; }
.sp-group:hover { transform: translateY(-2px); box-shadow: var(--sf-shadow-md); }
.sp-group-h { display: flex; align-items: center; gap: 11px; }
.sp-group-mark { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sp-group-n { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
.sp-group-t { font-size: 11px; color: var(--sf-muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.sp-group-cap { display: flex; align-items: center; gap: 10px; margin: 14px 0 10px; }
.sp-group-cap-bar { flex: 1; height: 7px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
.sp-group-cap-bar > div { height: 100%; border-radius: 4px; }
.sp-group-foot { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--sf-muted); padding-top: 10px; border-top: 1px solid var(--sf-border); }
.sp-group-act { margin-left: auto; padding: 5px 10px; border-radius: 8px; border: none; background: var(--sf-surface-2); cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 700; color: var(--sf-primary); }
.sp-mat { display: flex; align-items: center; gap: 13px; padding: 13px 16px; }
.sp-mat-ic { width: 40px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sp-icon-b { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; }
.sp-icon-b:hover { background: var(--sf-surface-2); color: var(--sf-primary); }
.sp-msg { display: grid; grid-template-columns: 280px 1fr; gap: 14px; height: calc(100vh - 200px); min-height: 520px; }
@media (max-width: 860px) { .sp-msg { grid-template-columns: 1fr; } .sp-msg-chat { display: none; } }
.sp-msg-list { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow-y: auto; }
.sp-thread { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--sf-border); cursor: pointer; }
.sp-thread:hover { background: var(--sf-surface-2); }
.sp-thread.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
.sp-on { position: absolute; right: -1px; bottom: -1px; width: 11px; height: 11px; border-radius: 50%; background: var(--sf-success); border: 2px solid var(--sf-surface); }
.sp-msg-chat { display: flex; flex-direction: column; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.sp-chat-h { display: flex; align-items: center; gap: 11px; padding: 13px 16px; border-bottom: 1px solid var(--sf-border); }
.sp-chat-body { flex: 1; overflow-y: auto; padding: 16px; background: var(--sf-bg); display: flex; flex-direction: column; gap: 10px; }
.sp-bub { max-width: 74%; padding: 9px 13px; font-size: 13px; line-height: 1.4; border-radius: 14px; }
.sp-bub.in { align-self: flex-start; background: var(--sf-surface); border: 1px solid var(--sf-border); border-bottom-left-radius: 4px; }
.sp-bub.out { align-self: flex-end; background: var(--sf-primary); color: #fff; border-bottom-right-radius: 4px; }
.sp-chat-input { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--sf-border); }
.sp-chat-input input { flex: 1; border: 1px solid var(--sf-border); background: var(--sf-surface-2); border-radius: 22px; padding: 10px 14px; font-family: inherit; font-size: 13px; outline: none; color: var(--sf-ink); }
.sp-chat-input button, .sp-ai-input button { width: 40px; height: 40px; border-radius: 11px; border: none; background: var(--sf-primary); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sp-ai-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 12px; margin-bottom: 14px; }
.sp-ai-card { background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 14px; padding: 16px; }
.sp-ai-q2 { font-family: var(--sf-font-display); font-style: italic; font-size: 15px; line-height: 1.35; margin-top: 10px; color: var(--sf-ink); }
.sp-ai-input { display: flex; gap: 8px; }
.sp-ai-input input { flex: 1; border: 1px solid var(--sf-border); background: var(--sf-surface); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: 13.5px; outline: none; color: var(--sf-ink); }
.sp-table-foot { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid var(--sf-border); font-size: 12px; color: var(--sf-muted); }
.sp-kanban { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 12px; }
.sp-kcol { background: var(--sf-surface-2); border-radius: 13px; padding: 11px; }
.sp-kcol-h { display: flex; align-items: center; gap: 8px; padding: 4px 6px 11px; }
.sp-kdot { width: 8px; height: 8px; border-radius: 50%; }
.sp-kname { font-size: 12.5px; font-weight: 700; }
.sp-kcount { font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-muted); margin-left: auto; }
.sp-lead { display: flex; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 10px; overflow: hidden; margin-bottom: 8px; cursor: pointer; }
.sp-lead:hover { box-shadow: var(--sf-shadow-md); }
.sp-lead-rail { width: 3px; flex-shrink: 0; }
.sp-anom-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
.sp-score { display: inline-flex; align-items: center; gap: 7px; }
.sp-score-bar { width: 46px; height: 5px; border-radius: 3px; background: var(--sf-surface-2); overflow: hidden; }
.sp-score-bar > div { height: 100%; }
.sp-set-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 14px; }
.sp-set-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--sf-border); }
.sp-set-row:last-child { border-bottom: none; }
.sp-toggle { width: 42px; height: 24px; border-radius: 999px; background: var(--sf-surface-3); padding: 3px; cursor: pointer; }
.sp-toggle.on { background: var(--sf-primary); }
.sp-toggle > i { display: block; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.sp-toggle.on > i { transform: translateX(18px); }
`);

// ── TODAY (role-aware) ──────────────────────────────────────
function StaffToday({ role, onNav }) {
  const cfg = STAFF_ROLES[role];
  const isAud = role === 'auditor';
  const kpis = {
    teacher: [['Bugungi dars', '4', '/5', null], ['Davomat', '94%', '', 'var(--sf-success)'], ['Up karta', '↑8', '', '#7A4F0E'], ['Xabarlar', '4', 'yangi', 'var(--sf-primary)']],
    assistant: [['Yordam darslari', '3', '', null], ['Davomat kiritildi', '2/3', '', 'var(--sf-success)'], ['Materiallar', '12', '', null], ['Xabarlar', '1', '', 'var(--sf-primary)']],
    methodist: [['Nazoratdagi guruh', '28', '', null], ['O‘rtacha sifat', '4.6', '/5', 'var(--sf-accent)'], ['Karta signali', '3', '', 'var(--sf-warn)'], ['Hisobot', '2', 'tayyor', 'var(--sf-primary)']],
    reception: [['Bugungi lidlar', '6', '', 'var(--sf-accent)'], ['Qabul', '+3', 'bugun', 'var(--sf-success)'], ['Qarzdor', '38', 'oila', 'var(--sf-danger)'], ['Xabarlar', '6', '', 'var(--sf-primary)']],
  }[role] || [];
  return (
    <>
      <StaffH eyebrow={'Seshanba · 19 May · ' + cfg.sub} title={<>Assalomu alaykum, <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>{cfg.who.split(' ')[0]}</span></>}
        sub={cfg.label + ' paneli'} right={<><SBtn onClick={() => T('Hisobot yuklandi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 14 })} Hisobot</SBtn>
          {role === 'teacher' && <SBtn kind="primary" accent={cfg.accent} onClick={() => onNav('attendance')}>{React.cloneElement(Icons.check, { size: 14 })} Davomat olish</SBtn>}
          {role === 'reception' && <SBtn kind="primary" accent={cfg.accent} onClick={() => onNav('leads')}>{React.cloneElement(Icons.plus, { size: 14 })} Yangi lid</SBtn>}</>} />
      <div className="sp-kpis">{kpis.map((k, i) => <Kpi key={i} label={k[0]} value={k[1]} sub={k[2]} accent={k[3]} />)}</div>
      <div className="sp-grid2">
        <div className="sp-col">
          {!isAud && (
            <div className="sp-hero" style={{ background: `linear-gradient(135deg, ${cfg.accent} 0%, color-mix(in oklab, ${cfg.accent} 78%, black) 100%)` }}>
              <SfStar size={170} color="#fff" style={{ position: 'absolute', right: -36, top: -36, opacity: 0.16 }} />
              <div style={{ position: 'relative' }}>
                <div className="sp-hero-eye">{role === 'reception' ? 'Bugungi vazifa' : 'Keyingi dars · 14 daqiqada'}</div>
                <div className="sp-hero-t">{role === 'reception' ? '6 lid bilan bog‘lanish' : 'Algebra · 9-B'}</div>
                <div className="sp-hero-s">{role === 'reception' ? 'Instagram · Telegram · sayt' : '09:00–09:45 · Xona 304 · 24 o‘quvchi'}</div>
                <div className="sp-hero-acts">
                  <button className="sp-hero-btn" onClick={() => onNav(role === 'reception' ? 'leads' : 'attendance')}>{role === 'reception' ? 'Lidlarni ochish' : 'Davomat olish'}</button>
                  <button className="sp-hero-btn ghost" onClick={() => T(role === 'reception' ? 'Lidlar eksport qilindi' : 'Materiallar ochildi', { tone: 'info' })}>{role === 'reception' ? 'Eksport' : 'Materiallar'}</button>
                </div>
              </div>
            </div>
          )}
          <ACardLite title="Bugungi jadval" action={<a className="sp-link" onClick={() => T('To‘liq jadval', { tone: 'info' })}>Hammasi ›</a>}>
            {[['09:00', 'Algebra · 9-B', 'now'], ['10:00', 'Algebra · Mid', 'next'], ['11:30', 'Geometriya · 10-V', ''], ['14:00', 'Konsultatsiya', '']].map((r, i, a) => (
              <div key={i} className="sp-srow" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
                <span className="sf-mono sp-time">{r[0]}</span>
                <span className="sp-rail" style={{ background: r[2] === 'now' ? cfg.accent : r[2] === 'next' ? 'var(--sf-accent)' : 'var(--sf-border-strong)' }} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{r[1]}</span>
                {r[2] === 'now' && <Pill tone="primary">Hozir</Pill>}{r[2] === 'next' && <Pill tone="accent">Keyingi</Pill>}
              </div>
            ))}
          </ACardLite>
          <div className="sp-quick">
            {[['Davomat', Icons.check, 'attendance'], ['Karta berish', Icons.brand, role === 'teacher' || role === 'methodist' ? 'cards' : null], ['Materiallar', Icons.folder, 'materials'], ['Xabar', Icons.chat, 'messages']].filter(q => q[2]).map((q, i) => (
              <button key={i} className="sp-quick-b" onClick={() => onNav(q[2])}>
                <span className="sp-quick-ic" style={{ color: cfg.accent }}>{React.cloneElement(q[1], { size: 18 })}</span>{q[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="sp-col">
          <div className="sp-ai" onClick={() => onNav(cfg.nav.find(n => n.id === 'ai') ? 'ai' : 'today')}>
            <SfAiBadge>{isAud ? 'Audit AI' : 'Tavsiya'}</SfAiBadge>
            <div className="sp-ai-q">“{role === 'teacher' ? 'Otabekka 2 ta Down karta berildi — ota bilan suhbat tavsiya etiladi.' : role === 'methodist' ? 'Mirobod filialida bitta o‘qituvchi 48 karta berdi — adolatni tekshiring.' : role === 'reception' ? '12 oila 30 kundan oshiq qarzdor — eslatma yuboring.' : 'Sebzorda 3 ta yuqori signal to‘plandi.'}”</div>
            <button className="sp-ai-btn" onClick={(e) => { e.stopPropagation(); T('AI tahlili ochildi', { tone: 'info' }); }}>Ko‘rish</button>
          </div>
          <ACardLite title="So‘nggi faollik">
            {[['Davomat saqlandi', '9-B · 24/24', '09:48', 'var(--sf-success)', Icons.check], ['Karta berildi', 'Akbarov A.', '09:42', 'var(--sf-accent)', Icons.brand], ['Yangi xabar', 'Ota-ona · 9-B', '09:30', 'var(--sf-primary)', Icons.chat]].map((e, i, a) => (
              <div key={i} className="sp-ev" style={{ borderBottom: i < a.length - 1 ? '1px dashed var(--sf-border)' : 'none' }}>
                <span className="sp-ev-ic" style={{ background: e[3] + '22', color: e[3] }}>{React.cloneElement(e[4], { size: 13 })}</span>
                <div style={{ flex: 1 }}><div className="sp-ev-t">{e[0]}</div><div className="sp-ev-s">{e[1]}</div></div>
                <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{e[2]}</span>
              </div>
            ))}
          </ACardLite>
        </div>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function ACardLite({ title, action, children }) {
  return <div className="sp-card"><div className="sp-card-h"><h3>{title}</h3>{action}</div><div>{children}</div></div>;
}

// ── ATTENDANCE (interactive) ────────────────────────────────
const ATT_NAMES = ['Akbarov Akmal', 'Azizova Madina', 'Bakirov Sherzod', 'Davronova Sevinch', 'Eshmatov Otabek', 'Fayzullayev Diyor', 'G‘aniyev Jasur', 'Halimova Zilola', 'Ibragimov Sardor', 'Jo‘rayeva Nilufar'];
const CARD_TYPES = [['Yulduz', 'up'], ['Aktivlik', 'up'], ['Yordamchi', 'up'], ['Toza ish', 'up'], ['Ogohlantirish', 'down'], ['Mas‘uliyatsizlik', 'down']];

function StaffAttendance({ role }) {
  const [tab, setTab] = React.useState('mark');
  return (
    <>
      <StaffH eyebrow="9-B Algebra · Daraja II" title="Davomat va kartalar" sub="24 o‘quvchi · Nigora Karimova"
        right={<><SBtn onClick={() => T('Excel hisoboti yuklandi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 14 })} Eksport</SBtn></>} />
      <div className="att-tabs">
        {[['mark', 'Bugun · belgilash', Icons.check], ['history', 'Tarix', Icons.cal], ['cards', 'Kartalar tarixi', Icons.brand]].map(t => (
          <button key={t[0]} className={'att-tab' + (tab === t[0] ? ' on' : '')} onClick={() => setTab(t[0])}>{React.cloneElement(t[2], { size: 15 })} {t[1]}</button>
        ))}
      </div>
      {tab === 'mark' && <AttMark />}
      {tab === 'history' && <AttHistory />}
      {tab === 'cards' && <AttCards />}
      <style>{staffPageStyles}</style>
      <style>{attStyles}</style>
    </>
  );
}

// Mark attendance + give a card inline per student
function AttMark() {
  const [marks, setMarks] = React.useState({});
  const [cards, setCards] = React.useState({}); // i -> {type, kind}
  const [pop, setPop] = React.useState(null);    // student index with open card popover
  const set = (i, v) => setMarks(m => ({ ...m, [i]: m[i] === v ? undefined : v }));
  const giveCard = (i, t) => { setCards(c => ({ ...c, [i]: { type: t[0], kind: t[1] } })); setPop(null); T('Karta berildi', { tone: t[1] === 'up' ? 'success' : 'warn', sub: `${ATT_NAMES[i]} · ${t[0]}` }); };
  const c = { present: 0, absent: 0, late: 0 };
  Object.values(marks).forEach(v => { if (v) c[v]++; });
  const done = c.present + c.absent + c.late;
  const cardCount = Object.keys(cards).length;
  const markAll = () => { const m = {}; ATT_NAMES.forEach((_, i) => m[i] = 'present'); setMarks(m); T('Hammasi "bor" deb belgilandi', { tone: 'success' }); };
  const save = () => { if (done < ATT_NAMES.length) { T('Avval hammani belgilang', { tone: 'warn', sub: `${ATT_NAMES.length - done} ta qoldi` }); return; } T('Davomat saqlandi', { tone: 'success', sub: `Bor ${c.present} · Yo‘q ${c.absent} · Kech ${c.late} · ${cardCount} karta` }); };
  return (
    <>
      <div className="att-toolbar">
        <span className="sf-mono att-date">Seshanba · 19 May 2026 · 09:00</span>
        <span style={{ flex: 1 }} />
        <SBtn onClick={markAll}>{React.cloneElement(Icons.check, { size: 14 })} Hammasi bor</SBtn>
        <SBtn kind="primary" onClick={save}>Saqlash · {done}/{ATT_NAMES.length}</SBtn>
      </div>
      <div className="sp-att-sum">
        {[['Bor', c.present, 'var(--sf-success)'], ['Yo‘q', c.absent, 'var(--sf-danger)'], ['Kech', c.late, 'var(--sf-warn)'], ['Karta', cardCount, '#7A4F0E']].map((s, i) => (
          <div key={i} className="sp-att-stat"><div className="sf-mono" style={{ fontSize: 24, fontWeight: 700, color: s[2] }}>{s[1]}</div><div className="sp-att-l">{s[0]}</div></div>
        ))}
        <div className="sp-att-prog"><div className="sp-att-prog-bar"><div style={{ width: `${(done / ATT_NAMES.length) * 100}%` }} /></div><span className="sf-mono">{done}/{ATT_NAMES.length}</span></div>
      </div>
      <div className="sp-card" style={{ overflow: 'visible' }}>
        {ATT_NAMES.map((n, i) => {
          const m = marks[i], cd = cards[i];
          return (
            <div key={i} className="sp-att-row" style={{ position: 'relative', background: m === 'present' ? 'var(--sf-success-soft)' : m === 'absent' ? 'var(--sf-danger-soft)' : m === 'late' ? 'var(--sf-warn-soft)' : 'transparent', borderBottom: i < ATT_NAMES.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
              <SfAvatar name={n} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>DEMO-2026-000{42 + i}</span>
                  {cd && <span className="att-chip" style={{ background: cd.kind === 'up' ? 'var(--sf-success-soft)' : 'var(--sf-danger-soft)', color: cd.kind === 'up' ? '#7A4F0E' : 'var(--sf-danger)' }}>{cd.kind === 'up' ? '↑' : '↓'} {cd.type}</span>}
                </div>
              </div>
              <button className={'att-cardbtn' + (cd ? ' has' : '')} onClick={() => setPop(pop === i ? null : i)} title="Karta berish"><SfStar size={16} color={cd ? '#fff' : 'var(--sf-muted)'} /></button>
              <div className="sp-att-btns">
                {[['present', '✓', 'var(--sf-success)'], ['late', '◷', 'var(--sf-warn)'], ['absent', '✕', 'var(--sf-danger)']].map(b => (
                  <button key={b[0]} className={'sp-att-b' + (m === b[0] ? ' on' : '')} style={m === b[0] ? { background: b[2], borderColor: b[2], color: '#fff' } : { color: b[2] }} onClick={() => set(i, b[0])}>{b[1]}</button>
                ))}
              </div>
              {pop === i && (
                <div className="att-pop" onMouseLeave={() => setPop(null)}>
                  <div className="att-pop-h">Karta berish · {n.split(' ')[0]}</div>
                  <div className="att-pop-grid">
                    {CARD_TYPES.map((t, k) => (
                      <button key={k} className="att-pop-b" style={{ borderColor: t[1] === 'up' ? '#C49A3A' : '#A14026' }} onClick={() => giveCard(i, t)}>
                        <span className="att-pop-mark" style={{ background: t[1] === 'up' ? 'linear-gradient(135deg,#F6E0AC,#E9C272)' : 'linear-gradient(135deg,#F0C9BE,#D88A75)' }}><SfStar size={10} color={t[1] === 'up' ? '#7A4F0E' : '#5C1A0C'} /></span>
                        {t[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// History — detailed: expandable day → full per-student roster, + matrix view
function AttHistory() {
  const [range, setRange] = React.useState('30');
  const [view, setView] = React.useState('days');
  const [open, setOpen] = React.useState(0);
  const ranges = [['7', 'Hafta'], ['30', 'Oxirgi oy'], ['90', 'Chorak'], ['custom', 'Maxsus sana']];
  const days = [
    { d: '19 May', wd: 'Seshanba', time: '09:00' }, { d: '18 May', wd: 'Dushanba', time: '09:00' },
    { d: '15 May', wd: 'Juma', time: '09:00' }, { d: '14 May', wd: 'Payshanba', time: '09:00' },
    { d: '13 May', wd: 'Chorshanba', time: '09:00' }, { d: '12 May', wd: 'Seshanba', time: '09:00' },
    { d: '11 May', wd: 'Dushanba', time: '09:00' }, { d: '8 May', wd: 'Juma', time: '09:00' },
  ];
  // deterministic status grid: 0 present,1 late,2 absent-reason,3 absent
  const reasons = { '2-4': 'Kasal (spravka)', '4-1': 'Oilaviy', '6-7': 'Olimpiada', '1-2': 'Sababsiz', '5-4': 'Kechikdi · 12 daq' };
  const cardAt = { '0-0': ['Yulduz', 'up'], '0-7': ['Aktivlik', 'up'], '2-4': ['Ogohlantirish', 'down'], '4-1': ['Yulduz', 'up'], '1-2': ['Mas‘uliyatsizlik', 'down'] };
  const statusOf = (di, si) => {
    const h = (di * 7 + si * 3) % 17;
    if (h === 1 || (di === 4 && si === 1) || (di === 2 && si === 4)) return (di + si) % 2 ? 2 : 3;
    if (h === 2 || (di === 5 && si === 4)) return 1;
    return 0;
  };
  const META = { 0: ['Bor', 'var(--sf-success)', 'var(--sf-success-soft)'], 1: ['Kech', 'var(--sf-warn)', 'var(--sf-warn-soft)'], 2: ['Sababli', 'var(--sf-ink-2)', 'var(--sf-surface-3)'], 3: ['Yo‘q', 'var(--sf-danger)', 'var(--sf-danger-soft)'] };
  const dayCount = (di) => { const c = [0, 0, 0, 0]; ATT_NAMES.forEach((_, si) => c[statusOf(di, si)]++); return c; };

  return (
    <>
      <div className="att-toolbar">
        <div className="att-rangebar">{ranges.map(r => <button key={r[0]} className={'att-range' + (range === r[0] ? ' on' : '')} onClick={() => { setRange(r[0]); T(r[1] + ' ko‘rsatildi', { tone: 'info' }); }}>{r[1]}</button>)}</div>
        {range === 'custom' && <span className="att-customdate"><input type="date" defaultValue="2026-05-01" /><span style={{ color: 'var(--sf-muted)' }}>→</span><input type="date" defaultValue="2026-05-19" /></span>}
        <span style={{ flex: 1 }} />
        <div className="att-rangebar">
          <button className={'att-range' + (view === 'days' ? ' on' : '')} onClick={() => setView('days')}>Kunlar</button>
          <button className={'att-range' + (view === 'matrix' ? ' on' : '')} onClick={() => setView('matrix')}>Matritsa</button>
        </div>
      </div>
      <div className="sp-att-sum">
        {[['O‘rtacha', '94%', 'var(--sf-success)'], ['Darslar', '20', 'var(--sf-ink)'], ['Kechikish', '5', 'var(--sf-warn)'], ['Sababsiz', '3', 'var(--sf-danger)']].map((s, i) => (
          <div key={i} className="sp-att-stat"><div className="sf-mono" style={{ fontSize: 24, fontWeight: 700, color: s[2] }}>{s[1]}</div><div className="sp-att-l">{s[0]}</div></div>
        ))}
      </div>

      {view === 'days' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {days.map((day, di) => {
            const c = dayCount(di), pct = Math.round((c[0] / ATT_NAMES.length) * 100), isOpen = open === di;
            return (
              <div key={di} className="att-day">
                <button className="att-day-head" onClick={() => setOpen(isOpen ? -1 : di)}>
                  <span className={'att-day-chev' + (isOpen ? ' open' : '')}>{React.cloneElement(Icons.chevR, { size: 16 })}</span>
                  <div className="att-day-date"><b>{day.d}</b><span>{day.wd} · {day.time}</span></div>
                  <div className="att-day-mini">
                    {[[c[0], 'var(--sf-success)'], [c[1], 'var(--sf-warn)'], [c[2], 'var(--sf-ink-2)'], [c[3], 'var(--sf-danger)']].map((x, k) => <span key={k} className="sf-mono" style={{ color: x[1], fontWeight: 700, opacity: x[0] ? 1 : 0.3 }}>{['✓', '◷', '⊙', '✕'][k]}{x[0]}</span>)}
                  </div>
                  <div className="att-day-track"><div style={{ width: pct + '%', background: pct >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)' }} /></div>
                  <span className="sf-mono att-day-pct" style={{ color: pct >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)' }}>{pct}%</span>
                </button>
                {isOpen && (
                  <div className="att-day-body">
                    {ATT_NAMES.map((n, si) => {
                      const st = statusOf(di, si), m = META[st], reason = reasons[di + '-' + si], card = cardAt[di + '-' + si];
                      return (
                        <div key={si} className="att-droster" style={{ background: st === 0 ? 'transparent' : m[2] }}>
                          <SfAvatar name={n} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</div>
                            {reason && <div style={{ fontSize: 10.5, color: m[1], fontStyle: 'italic' }}>{reason}</div>}
                          </div>
                          {card && <span className="att-chip" style={{ background: card[1] === 'up' ? 'var(--sf-success-soft)' : 'var(--sf-danger-soft)', color: card[1] === 'up' ? '#7A4F0E' : 'var(--sf-danger)' }}>{card[1] === 'up' ? '↑' : '↓'} {card[0]}</span>}
                          <span className="att-status" style={{ color: m[1], background: 'var(--sf-surface)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: m[1], display: 'inline-block' }} />{m[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === 'matrix' && (
        <div className="sp-card" style={{ overflow: 'auto' }}>
          <table className="att-matrix">
            <thead><tr><th className="att-mx-name">O‘quvchi</th>{days.map((d, di) => <th key={di}>{d.d.split(' ')[0]}<span>{d.d.split(' ')[1]}</span></th>)}<th className="att-mx-pct">%</th></tr></thead>
            <tbody>
              {ATT_NAMES.map((n, si) => {
                let present = 0;
                const cells = days.map((_, di) => { const st = statusOf(di, si); if (st === 0) present++; return st; });
                const pct = Math.round((present / days.length) * 100);
                return (
                  <tr key={si}>
                    <td className="att-mx-name"><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SfAvatar name={n} size={24} /><span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{n}</span></div></td>
                    {cells.map((st, di) => <td key={di}><span className="att-mx-cell" style={{ background: META[st][1] }} title={META[st][0]}>{['✓', '◷', '⊙', '✕'][st]}</span></td>)}
                    <td className="att-mx-pct"><span className="sf-mono" style={{ fontWeight: 700, color: pct >= 92 ? 'var(--sf-success)' : pct >= 80 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>{pct}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <style>{attHistStyles}</style>
    </>
  );
}

const attHistStyles = `
.att-day { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 13px; overflow: hidden; }
.att-day-head { display: flex; align-items: center; gap: 13px; width: 100%; padding: 13px 16px; background: transparent; border: none; cursor: pointer; font-family: inherit; text-align: left; }
.att-day-head:hover { background: var(--sf-surface-2); }
.att-day-chev { color: var(--sf-muted); transition: transform .2s; display: flex; } .att-day-chev.open { transform: rotate(90deg); }
.att-day-date { display: flex; flex-direction: column; min-width: 130px; } .att-day-date b { font-size: 14px; } .att-day-date span { font-size: 11px; color: var(--sf-muted); }
.att-day-mini { display: flex; gap: 10px; font-size: 12.5px; } 
.att-day-track { flex: 1; max-width: 220px; height: 7px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; margin-left: auto; } .att-day-track > div { height: 100%; border-radius: 4px; }
.att-day-pct { font-size: 13px; font-weight: 700; width: 42px; text-align: right; }
.att-day-body { border-top: 1px solid var(--sf-border); padding: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
@media (max-width: 760px) { .att-day-body { grid-template-columns: 1fr; } .att-day-mini { display: none; } }
.att-droster { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; }
.att-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 7px; white-space: nowrap; }
.att-matrix { border-collapse: collapse; width: 100%; min-width: 640px; }
.att-matrix th { padding: 9px 6px; font-size: 10.5px; font-weight: 700; color: var(--sf-muted); text-align: center; border-bottom: 1px solid var(--sf-border); }
.att-matrix th span { display: block; font-weight: 500; opacity: 0.7; }
.att-mx-name { text-align: left !important; position: sticky; left: 0; background: var(--sf-surface); z-index: 1; }
.att-matrix td { padding: 5px 6px; text-align: center; border-bottom: 1px solid var(--sf-border); }
.att-mx-cell { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 7px; color: #fff; font-size: 12px; font-weight: 700; }
.att-mx-pct { text-align: right !important; }
`;

// Card history + stats
function AttCards() {
  const log = [
    ['Akbarov Akmal', 'Yulduz', 'up', 'Mustaqil yechim · 3-misol', '19 May 09:42'],
    ['Halimova Zilola', 'Aktivlik', 'up', 'Sinfdoshlarga yordam', '19 May 09:38'],
    ['Eshmatov Otabek', 'Ogohlantirish', 'down', 'Uy ishi tayyor emas', '18 May 09:12'],
    ['Davronova Sevinch', 'Toza ish', 'up', 'Namunaviy daftar', '15 May 10:20'],
    ['Azizova Madina', 'Yulduz', 'up', 'Olimpiada 2-bosqich', '14 May 11:05'],
    ['Bakirov Sherzod', 'Mas‘uliyatsizlik', 'down', 'Darsda telefon', '13 May 09:30'],
  ];
  const byType = [['Yulduz', 18, '#C49A3A'], ['Aktivlik', 9, '#C49A3A'], ['Toza ish', 6, '#C49A3A'], ['Ogohlantirish', 3, '#D88A75'], ['Mas‘uliyatsizlik', 1, '#D88A75']];
  const maxT = Math.max(...byType.map(t => t[1]));
  return (
    <>
      <div className="sp-att-sum">
        {[['Jami', '37', 'var(--sf-ink)'], ['Up karta', '↑33', '#7A4F0E'], ['Down karta', '↓4', 'var(--sf-danger)'], ['Bu hafta', '14', 'var(--sf-primary)']].map((s, i) => (
          <div key={i} className="sp-att-stat"><div className="sf-mono" style={{ fontSize: 24, fontWeight: 700, color: s[2] }}>{s[1]}</div><div className="sp-att-l">{s[0]}</div></div>
        ))}
      </div>
      <div className="att-cardgrid">
        <div className="sp-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Tur bo‘yicha taqsimot</div>
          {byType.map((t, i) => (
            <div key={i} className="att-bar"><span className="att-bar-l">{t[0]}</span><div className="att-bar-track"><div style={{ width: `${(t[1] / maxT) * 100}%`, background: t[2] }} /></div><span className="sf-mono att-bar-v">{t[1]}</span></div>
          ))}
        </div>
        <div className="sp-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--sf-border)', fontSize: 13, fontWeight: 700 }}>So‘nggi kartalar</div>
          {log.map((l, i) => (
            <div key={i} className="att-logrow" style={{ borderTop: i ? '1px solid var(--sf-border)' : 'none' }}>
              <span className="att-logmark" style={{ background: l[2] === 'up' ? 'linear-gradient(135deg,#F6E0AC,#E9C272)' : 'linear-gradient(135deg,#F0C9BE,#D88A75)' }}><SfStar size={11} color={l[2] === 'up' ? '#7A4F0E' : '#5C1A0C'} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{l[0]} <span style={{ color: l[2] === 'up' ? 'var(--sf-accent-ink)' : 'var(--sf-danger)', fontWeight: 600 }}>· {l[1]}</span></div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>“{l[3]}”</div>
              </div>
              <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)', whiteSpace: 'nowrap' }}>{l[4]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const attStyles = `
.att-tabs { display: flex; gap: 4px; padding: 4px; background: var(--sf-surface-2); border-radius: 11px; margin-bottom: 16px; width: fit-content; max-width: 100%; overflow-x: auto; }
.att-tab { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600; color: var(--sf-muted); white-space: nowrap; }
.att-tab.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }
.att-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.att-date { font-size: 12.5px; color: var(--sf-ink-2); font-weight: 600; background: var(--sf-surface-2); padding: 7px 12px; border-radius: 9px; }
.att-rangebar { display: flex; gap: 4px; padding: 3px; background: var(--sf-surface-2); border-radius: 9px; }
.att-range { padding: 7px 13px; border-radius: 7px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-muted); }
.att-range.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }
.att-customdate { display: inline-flex; align-items: center; gap: 8px; }
.att-customdate input { border: 1px solid var(--sf-border); background: var(--sf-surface); border-radius: 8px; padding: 6px 10px; font-family: var(--sf-font-mono); font-size: 12px; color: var(--sf-ink); }
.att-chip { font-size: 9.5px; font-weight: 700; padding: 1px 6px; border-radius: 5px; }
.att-cardbtn { width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .14s; }
.att-cardbtn:hover { border-color: var(--sf-accent); } .att-cardbtn.has { background: var(--sf-accent); border-color: var(--sf-accent); }
.att-pop { position: absolute; right: 16px; top: calc(100% - 6px); z-index: 30; width: 280px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 13px; box-shadow: var(--sf-shadow-lg); padding: 12px; }
.att-pop-h { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--sf-muted); margin-bottom: 9px; }
.att-pop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.att-pop-b { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 9px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 700; color: var(--sf-ink); }
.att-pop-mark { width: 22px; height: 28px; border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.att-hrow { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; gap: 8px; padding: 12px 16px; align-items: center; font-size: 13px; }
.att-hhead { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--sf-muted); background: var(--sf-surface-2); }
.att-cardgrid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 14px; }
@media (max-width: 900px) { .att-cardgrid { grid-template-columns: 1fr; } .att-hrow { grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr 0.8fr; font-size: 12px; } }
.att-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
.att-bar-l { width: 110px; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.att-bar-track { flex: 1; height: 9px; border-radius: 5px; background: var(--sf-surface-2); overflow: hidden; }
.att-bar-track > div { height: 100%; border-radius: 5px; }
.att-bar-v { font-size: 12px; font-weight: 700; width: 24px; text-align: right; }
.att-logrow { display: flex; align-items: center; gap: 11px; padding: 11px 16px; }
.att-logmark { width: 26px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
`;

// ── CARDS (interactive give) ────────────────────────────────
function StaffCards({ role }) {
  const types = [['Yulduz', 'up'], ['Aktivlik', 'up'], ['Yordamchi', 'up'], ['Toza ish', 'up'], ['Ogohlantirish', 'down'], ['Mas‘uliyatsizlik', 'down']];
  const [pick, setPick] = React.useState(0);
  const [stu, setStu] = React.useState('Akbarov Akmal');
  const give = () => T('Karta berildi', { tone: types[pick][1] === 'up' ? 'success' : 'warn', sub: `${stu} · ${types[pick][0]}` });
  const isUp = types[pick][1] === 'up';
  const recent = [['Akbarov Akmal', 'Yulduz', 'up', '09:42'], ['Halimova Zilola', 'Aktivlik', 'up', '09:38'], ['Eshmatov Otabek', 'Ogohlantirish', 'down', '09:12']];
  return (
    <>
      <StaffH eyebrow="9-B Algebra" title="Kartalar" sub={role === 'methodist' ? 'Nazorat · adolatni kuzating' : 'Up / Down karta bering'}
        right={<SBtn kind="primary" onClick={give}>{React.cloneElement(Icons.plus, { size: 14 })} Karta berish</SBtn>} />
      <div className="sp-grid2">
        <div className="sp-card" style={{ padding: 18 }}>
          <div className="sp-lbl">O‘quvchi</div>
          <div className="sp-stu-pick">
            {['Akbarov Akmal', 'Halimova Zilola', 'Eshmatov Otabek'].map(s => (
              <button key={s} className={'sp-stu' + (stu === s ? ' on' : '')} onClick={() => setStu(s)}><SfAvatar name={s} size={24} />{s.split(' ')[0]}</button>
            ))}
          </div>
          <div className="sp-lbl" style={{ marginTop: 16 }}>Karta turi</div>
          <div className="sp-types">
            {types.map((t, i) => (
              <button key={i} className={'sp-type' + (pick === i ? ' on' : '')} onClick={() => setPick(i)}
                style={pick === i ? { borderColor: t[1] === 'up' ? '#C49A3A' : '#A14026', background: t[1] === 'up' ? '#F6E0AC' : '#F0C9BE' } : {}}>
                <span className="sp-type-mark" style={{ background: t[1] === 'up' ? 'linear-gradient(135deg,#F6E0AC,#E9C272)' : 'linear-gradient(135deg,#F0C9BE,#D88A75)' }}><SfStar size={11} color={t[1] === 'up' ? '#7A4F0E' : '#5C1A0C'} /></span>
                {t[0]}
              </button>
            ))}
          </div>
          <button className="st-btn st-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={give}>Karta berish</button>
        </div>
        <div className="sp-col">
          <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
            <SfCard kind={isUp ? 'up' : 'down'} size="lg" recipient={stu} reason="Sinfdagi faollik uchun" issuer={STAFF_ROLES[role].who.split(' ')[0]} when="hozir" typeName={types[pick][0]} />
          </div>
          <ACardLite title="So‘nggi kartalar">
            {recent.map((r, i, a) => (
              <div key={i} className="sp-ev" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
                <span className="sp-type-mark" style={{ width: 24, height: 32, borderRadius: 5, background: r[2] === 'up' ? 'linear-gradient(135deg,#F6E0AC,#E9C272)' : 'linear-gradient(135deg,#F0C9BE,#D88A75)' }}><SfStar size={11} color={r[2] === 'up' ? '#7A4F0E' : '#5C1A0C'} /></span>
                <div style={{ flex: 1 }}><div className="sp-ev-t">{r[0]}</div><div className="sp-ev-s" style={{ color: r[2] === 'up' ? 'var(--sf-accent-ink)' : 'var(--sf-danger)' }}>{r[1]}</div></div>
                <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{r[3]}</span>
              </div>
            ))}
          </ACardLite>
        </div>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

// ── GROUPS ──────────────────────────────────────────────────
function StaffGroups({ role, onNav }) {
  const all = [
    { n: '9-B Algebra', t: 'Nigora Karimova', st: 24, cap: 26, att: 94, tone: 'var(--sf-primary)' },
    { n: 'Algebra Mid', t: 'Nigora Karimova', st: 21, cap: 24, att: 96, tone: 'var(--sf-primary)' },
    { n: '10-V Geometriya', t: 'Bobur Aliyev', st: 19, cap: 22, att: 88, tone: 'var(--sf-accent)' },
    { n: 'Ingliz B2', t: 'Aziz Tursunov', st: 16, cap: 18, att: 92, tone: 'var(--sf-success)' },
  ];
  const groups = role === 'teacher' || role === 'assistant' ? all.slice(0, role === 'assistant' ? 2 : 3) : all;
  return (
    <>
      <StaffH eyebrow={STAFF_ROLES[role].sub} title={role === 'methodist' ? 'Barcha guruhlar' : 'Guruhlarim'} sub={groups.length + ' ta guruh'}
        right={role === 'methodist' ? <SBtn kind="primary" onClick={() => T('Yangi guruh formasi', { tone: 'info' })}>{React.cloneElement(Icons.plus, { size: 14 })} Guruh</SBtn> : null} />
      <div className="sp-groups">
        {groups.map((g, i) => (
          <div key={i} className="sp-group" onClick={() => T(g.n + ' ochildi', { tone: 'info' })}>
            <div className="sp-group-h"><div className="sp-group-mark" style={{ background: g.tone }}><SfStar size={17} color="#fff" /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="sp-group-n">{g.n}</div><div className="sp-group-t"><SfAvatar name={g.t} size={15} /> {g.t}</div></div></div>
            <div className="sp-group-cap"><div className="sp-group-cap-bar"><div style={{ width: `${(g.st / g.cap) * 100}%`, background: g.st / g.cap > 0.9 ? 'var(--sf-warn)' : 'var(--sf-success)' }} /></div><span className="sf-mono">{g.st}/{g.cap}</span></div>
            <div className="sp-group-foot"><span className="sf-mono" style={{ color: g.att >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)', fontWeight: 700 }}>{g.att}%</span> davomat
              <button className="sp-group-act" onClick={(e) => { e.stopPropagation(); onNav('attendance'); }}>Davomat ›</button></div>
          </div>
        ))}
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

// ── MATERIALS ───────────────────────────────────────────────
function StaffMaterials() {
  const files = [['Kvadrat tenglama.pdf', 'PDF · 2.1 MB', Icons.pdf, 'var(--sf-danger)'], ['Funksiyalar.mp4', 'Video · 6:42', Icons.video, 'var(--sf-primary)'], ['Mashqlar.docx', 'DOCX · 12 bet', Icons.doc, 'var(--sf-accent)'], ['Diskriminant.pptx', 'Slayd · 16', Icons.doc, 'var(--sf-success)']];
  return (
    <>
      <StaffH eyebrow="Kutubxona" title="Materiallar" sub="84 fayl · 2.1 GB"
        right={<SBtn kind="primary" onClick={() => T('Fayl yuklash', { tone: 'info' })}>{React.cloneElement(Icons.upload, { size: 14 })} Yuklash</SBtn>} />
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        {files.map((f, i) => (
          <div key={i} className="sp-mat" style={{ borderBottom: i < files.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
            <div className="sp-mat-ic" style={{ background: f[3] }}>{React.cloneElement(f[2], { size: 20, style: { color: '#fff' } })}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{f[0]}</div><div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{f[1]}</div></div>
            <button className="sp-icon-b" onClick={() => T('Yuklab olindi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 16 })}</button>
            <button className="sp-icon-b" onClick={() => T('Chop etishga yuborildi', { tone: 'info' })}>{React.cloneElement(Icons.print, { size: 16 })}</button>
          </div>
        ))}
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

// ── MESSAGES ────────────────────────────────────────────────
function StaffMessages() {
  const [sel, setSel] = React.useState(0);
  const [txt, setTxt] = React.useState('');
  const threads = [['Akbarova Dilnoza', 'Ota-ona · 9-B', true], ['Matematika bo‘limi', 'Guruh · 12', false], ['Aziz Tursunov', 'Hamkasb', true], ['Halimova Zilola', 'O‘quvchi', false]];
  const send = () => { if (!txt.trim()) { T('Xabar bo‘sh', { tone: 'warn' }); return; } T('Yuborildi', { tone: 'success', sub: threads[sel][0] }); setTxt(''); };
  return (
    <>
      <StaffH eyebrow="Aloqa" title="Xabarlar" sub="Ota-ona, hamkasb, o‘quvchi" />
      <div className="sp-msg">
        <div className="sp-msg-list">
          {threads.map((t, i) => (
            <div key={i} className={'sp-thread' + (sel === i ? ' on' : '')} onClick={() => setSel(i)}>
              <div style={{ position: 'relative' }}><SfAvatar name={t[0]} size={38} />{t[2] && <span className="sp-on" />}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{t[0]}</div><div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{t[1]}</div></div>
            </div>
          ))}
        </div>
        <div className="sp-msg-chat">
          <div className="sp-chat-h"><SfAvatar name={threads[sel][0]} size={34} /><div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{threads[sel][0]}</div><div style={{ fontSize: 11, color: threads[sel][2] ? 'var(--sf-success)' : 'var(--sf-muted)' }}>{threads[sel][2] ? '● onlayn' : threads[sel][1]}</div></div></div>
          <div className="sp-chat-body">
            <div className="sp-bub in">Assalomu alaykum! Savol bor edi.</div>
            <div className="sp-bub out">Va alaykum assalom! Eshitaman.</div>
          </div>
          <div className="sp-chat-input">
            <input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Xabar yozing..." />
            <button onClick={send}>{React.cloneElement(Icons.send, { size: 16 })}</button>
          </div>
        </div>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

// ── AI ──────────────────────────────────────────────────────
function StaffAI({ role }) {
  const [q, setQ] = React.useState('');
  const ask = () => { if (!q.trim()) { T('Savol yozing', { tone: 'warn' }); return; } T('AI javob bermoqda...', { tone: 'info' }); setQ(''); };
  return (
    <>
      <StaffH eyebrow="AI yordamchi" title={<>AI <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>tahlil</span></>} sub="Guruhlaringiz haqida suhbatlashing" />
      <div className="sp-ai-list">
        {[['Diqqat', 'danger', 'Eshmatov Otabek davomati pasaymoqda + 2 Down karta.'], ['Yutuq', 'success', 'Akmal va Madina olimpiada darajasiga yetdi.'], ['Tavsiya', 'warn', 'Kvadrat tenglamalar mavzusini qaytaring — 4 o‘quvchi qiynaldi.']].map((x, i) => (
          <div key={i} className="sp-ai-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><SfAiBadge>{x[0]}</SfAiBadge><Pill tone={x[1]}>{x[1] === 'danger' ? 'Yuqori' : x[1] === 'warn' ? 'O‘rta' : 'Ijobiy'}</Pill></div>
            <div className="sp-ai-q2">“{x[2]}”</div>
          </div>
        ))}
      </div>
      <div className="sp-ai-input"><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="9-B haqida savol bering..." /><button onClick={ask}>{React.cloneElement(Icons.send, { size: 16 })}</button></div>
      <style>{staffPageStyles}</style>
    </>
  );
}

Object.assign(window, { StaffToday, StaffAttendance, StaffCards, StaffGroups, StaffMaterials, StaffMessages, StaffAI, ACardLite });
