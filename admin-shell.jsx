// admin-shell.jsx — Role-aware responsive shell for CEO / Manager / Audit
// Reads window.SF_ROLE ('ceo' | 'manager' | 'audit'). Permission-gated nav.

const ROLE_CFG = {
  ceo: {
    label: 'CEO', title: 'Boshqaruv markazi', who: 'Sardor Rashidov', whoRole: 'Bosh direktor',
    scope: 'Barcha filiallar · 4 ta', accent: 'var(--sf-primary)',
    nav: [
      { id: 'dash', l: 'Boshqaruv paneli', icon: Icons.home, grp: 'Asosiy' },
      { id: 'branches', l: 'Filiallar', icon: Icons.globe, grp: 'Asosiy' },
      { id: 'students', l: 'O‘quvchilar', icon: Icons.cohort, grp: 'Odamlar', n: 1842 },
      { id: 'groups', l: 'Guruhlar', icon: Icons.brand, grp: 'Odamlar', n: 96 },
      { id: 'teachers', l: 'O‘qituvchilar', icon: Icons.user, grp: 'Odamlar', n: 54 },
      { id: 'parents', l: 'Ota-onalar', icon: Icons.chat, grp: 'Odamlar' },
      { id: 'departments', l: 'Bo‘limlar', icon: Icons.folder, grp: 'Tashkilot' },
      { id: 'hr', l: 'HR · Xodimlar', icon: Icons.user, grp: 'Tashkilot' },
      { id: 'meetings', l: 'Yig‘ilishlar', icon: Icons.cal, grp: 'Tashkilot', n: 3 },
      { id: 'payments', l: 'To‘lovlar', icon: Icons.trend, grp: 'Moliya', accent: 'var(--sf-success)' },
      { id: 'payroll', l: 'Oyliklar', icon: Icons.doc, grp: 'Moliya' },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, grp: 'Aloqa', n: 5 },
      { id: 'chats', l: 'Suhbat nazorati', icon: Icons.shield, grp: 'Aloqa' },
      { id: 'ai', l: 'AI tahlil', icon: Icons.ai, grp: 'Aloqa' },
      { id: 'permissions', l: 'Ruxsatlar · RBAC', icon: Icons.shield, grp: 'Tizim' },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings, grp: 'Tizim' },
    ],
  },
  manager: {
    label: 'Manager', title: 'Filial boshqaruvi', who: 'Dilnoza Yo‘ldosheva', whoRole: 'Filial menejeri',
    scope: 'Yunusobod filiali', accent: 'var(--sf-primary)',
    nav: [
      { id: 'dash', l: 'Boshqaruv paneli', icon: Icons.home, grp: 'Asosiy' },
      { id: 'students', l: 'O‘quvchilar', icon: Icons.cohort, grp: 'Odamlar', n: 512 },
      { id: 'groups', l: 'Guruhlar', icon: Icons.brand, grp: 'Odamlar', n: 28 },
      { id: 'teachers', l: 'Xodimlar', icon: Icons.user, grp: 'Odamlar', n: 16 },
      { id: 'parents', l: 'Ota-onalar', icon: Icons.chat, grp: 'Odamlar' },
      { id: 'leads', l: 'Lidlar · Qabul', icon: Icons.flag, grp: 'Odamlar', n: 34, accent: 'var(--sf-accent)' },
      { id: 'enroll', l: 'Qabul · Test', icon: Icons.check, grp: 'Odamlar', accent: 'var(--sf-accent)' },
      { id: 'departments', l: 'Bo‘limlar', icon: Icons.folder, grp: 'Tashkilot' },
      { id: 'hr', l: 'HR · Xodimlar', icon: Icons.user, grp: 'Tashkilot' },
      { id: 'meetings', l: 'Yig‘ilishlar', icon: Icons.cal, grp: 'Tashkilot', n: 2 },
      { id: 'payments', l: 'To‘lovlar', icon: Icons.trend, grp: 'Moliya', accent: 'var(--sf-success)' },
      { id: 'payroll', l: 'Oyliklar', icon: Icons.doc, grp: 'Moliya' },
      { id: 'approvals', l: 'Tasdiqlash', icon: Icons.check, grp: 'Operatsiya', n: 7, accent: 'var(--sf-warn)' },
      { id: 'schedule', l: 'Jadval · Xonalar', icon: Icons.cal, grp: 'Operatsiya' },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, grp: 'Aloqa', n: 5 },
      { id: 'chats', l: 'Suhbat nazorati', icon: Icons.shield, grp: 'Aloqa' },
      { id: 'ai', l: 'AI tahlil', icon: Icons.ai, grp: 'Aloqa' },
      { id: 'permissions', l: 'Ruxsatlar · RBAC', icon: Icons.shield, grp: 'Tizim' },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings, grp: 'Tizim' },
    ],
  },
  audit: {
    label: 'Audit', title: 'Audit va nazorat', who: 'Jamshid Qodirov', whoRole: 'Bosh auditor',
    scope: 'Barcha filiallar · nazorat', accent: '#7A4A82',
    nav: [
      { id: 'dash', l: 'Audit paneli', icon: Icons.shield, grp: 'Asosiy' },
      { id: 'anomalies', l: 'Anomaliyalar', icon: Icons.flag, grp: 'Nazorat', n: 12, accent: 'var(--sf-danger)' },
      { id: 'fairness', l: 'Karta adolati', icon: Icons.brand, grp: 'Nazorat', n: 5, accent: 'var(--sf-warn)' },
      { id: 'finance', l: 'Moliyaviy tekshir', icon: Icons.trend, grp: 'Nazorat', accent: 'var(--sf-success)' },
      { id: 'logs', l: 'Kirish jurnali', icon: Icons.doc, grp: 'Jurnal' },
      { id: 'aiusage', l: 'AI monitoring', icon: Icons.ai, grp: 'Jurnal' },
      { id: 'surveys', l: 'So‘rovnoma yaxlitligi', icon: Icons.check, grp: 'Jurnal' },
      { id: 'cases', l: 'Holatlar · Flaglar', icon: Icons.pin, grp: 'Boshqaruv', n: 8, accent: 'var(--sf-danger)' },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings, grp: 'Tizim' },
    ],
  },
};

const BRANCHES = [
  { id: 'all', n: 'Barcha filiallar', sub: '4 ta · 1842 o‘quvchi' },
  { id: 'yun', n: 'Yunusobod', sub: '512 o‘quvchi' },
  { id: 'chl', n: 'Chilonzor', sub: '486 o‘quvchi' },
  { id: 'mir', n: 'Mirobod', sub: '478 o‘quvchi' },
  { id: 'seb', n: 'Sebzor', sub: '366 o‘quvchi' },
];

function AdminShell({ role, active, onNav, children }) {
  const cfg = ROLE_CFG[role];
  const { cur, setCur } = React.useContext(CurrencyCtx);
  const [drawer, setDrawer] = React.useState(false);
  const [branch, setBranch] = React.useState(role === 'manager' ? 'yun' : 'all');
  const [bOpen, setBOpen] = React.useState(false);
  const [cOpen, setCOpen] = React.useState(false);

  const groups = [];
  cfg.nav.forEach(item => {
    let g = groups.find(x => x.grp === item.grp);
    if (!g) { g = { grp: item.grp, items: [] }; groups.push(g); }
    g.items.push(item);
  });
  const current = cfg.nav.find(n => n.id === active);
  const curBranch = BRANCHES.find(b => b.id === branch) || BRANCHES[0];

  return (
    <div className="ad-root" data-role={role}>
      <style>{adminShellStyles}</style>
      <style>{adminCommonStyles}</style>

      {/* Sidebar */}
      <aside className={'ad-side' + (drawer ? ' open' : '')}>
        <div className="ad-side-top">
          <div className="ad-brand">
            <SfStar size={26} color={cfg.accent} />
            <div className="ad-brand-tx">
              <div className="ad-brand-n">StarForge<span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}> · EDU</span></div>
              <div className="ad-brand-role" style={{ color: cfg.accent }}>{cfg.label} konsoli</div>
            </div>
          </div>
          <button className="ad-side-x" onClick={() => setDrawer(false)}>{React.cloneElement(Icons.x, { size: 18 })}</button>
        </div>

        {/* Branch switcher */}
        <div className="ad-branch" onClick={() => setBOpen(!bOpen)}>
          <div className="ad-branch-mark" style={{ background: cfg.accent }}>
            {React.cloneElement(role === 'audit' ? Icons.shield : Icons.globe, { size: 15, style: { color: '#FFFCF5' } })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ad-branch-n">{curBranch.n}</div>
            <div className="ad-branch-sub">{curBranch.sub}</div>
          </div>
          {React.cloneElement(Icons.chevD, { size: 14, style: { color: 'var(--sf-muted)' } })}
          {bOpen && (
            <div className="ad-branch-menu" onClick={e => e.stopPropagation()}>
              {(role === 'manager' ? BRANCHES.slice(1, 2) : BRANCHES).map(b => (
                <div key={b.id} className={'ad-branch-opt' + (b.id === branch ? ' on' : '')}
                     onClick={() => { setBranch(b.id); setBOpen(false); }}>
                  <div>
                    <div className="ad-branch-opt-n">{b.n}</div>
                    <div className="ad-branch-opt-s">{b.sub}</div>
                  </div>
                  {b.id === branch && React.cloneElement(Icons.check, { size: 14, style: { color: cfg.accent } })}
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="ad-nav">
          {groups.map(g => (
            <div key={g.grp} className="ad-nav-grp">
              <div className="ad-nav-grp-l">{g.grp}</div>
              {g.items.map(item => (
                <button key={item.id} className={'ad-nav-i' + (active === item.id ? ' on' : '')}
                        onClick={() => { onNav(item.id); setDrawer(false); }}
                        style={active === item.id ? { '--on-accent': item.accent || cfg.accent } : {}}>
                  <span className="ad-nav-ic" style={{ color: active === item.id ? '#FFFCF5' : (item.accent || 'var(--sf-muted)') }}>
                    {React.cloneElement(item.icon, { size: 17 })}
                  </span>
                  <span className="ad-nav-l">{item.l}</span>
                  {item.n != null && <span className={'ad-nav-n' + (item.accent ? ' acc' : '')}
                    style={item.accent ? { background: item.accent } : {}}>{item.n > 999 ? (item.n/1000).toFixed(1)+'k' : item.n}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ad-side-user" onClick={() => onNav('settings')}>
          <SfAvatar name={cfg.who} size={36} color={cfg.accent} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ad-user-n">{cfg.who}</div>
            <div className="ad-user-r">{cfg.whoRole}</div>
          </div>
          {React.cloneElement(Icons.logout, { size: 15, style: { color: 'var(--sf-muted)' } })}
        </div>
      </aside>
      {drawer && <div className="ad-scrim" onClick={() => setDrawer(false)} />}

      {/* Main column */}
      <div className="ad-col">
        <header className="ad-top">
          <button className="ad-burger" onClick={() => setDrawer(true)}>{React.cloneElement(Icons.filter, { size: 20 })}</button>
          <div className="ad-crumb">
            <span className="ad-crumb-scope" style={{ color: cfg.accent }}>{cfg.label}</span>
            {React.cloneElement(Icons.chevR, { size: 12, style: { color: 'var(--sf-muted)' } })}
            <span className="ad-crumb-cur">{current?.l}</span>
          </div>
          <div className="ad-search ad-top-search">
            {React.cloneElement(Icons.search, { size: 15, style: { color: 'var(--sf-muted)' } })}
            <input placeholder="Hamma narsa bo‘yicha izlash..." readOnly />
            <span className="ad-kbd">⌘K</span>
          </div>
          {/* Currency switcher */}
          <div className="ad-cur" onClick={() => setCOpen(!cOpen)}>
            <span className="sf-mono">{cur}</span>
            {React.cloneElement(Icons.chevD, { size: 13 })}
            {cOpen && (
              <div className="ad-cur-menu" onClick={e => e.stopPropagation()}>
                {Object.keys(SF_RATES).map(c => (
                  <div key={c} className={'ad-cur-opt' + (c === cur ? ' on' : '')}
                       onClick={() => { setCur(c); setCOpen(false); }}>
                    <span className="sf-mono" style={{ fontWeight: 700 }}>{c}</span>
                    <span className="ad-cur-sym">{SF_SYM[c]}</span>
                    {c === cur && React.cloneElement(Icons.check, { size: 13, style: { color: cfg.accent } })}
                  </div>
                ))}
                <div className="ad-cur-note">Kurs · 19.05.2026 · CBU</div>
              </div>
            )}
          </div>
          <button className="ad-top-ic">{React.cloneElement(Icons.bell, { size: 18 })}<span className="ad-top-dot" /></button>
          <div className="ad-top-av" onClick={() => onNav('settings')}><SfAvatar name={cfg.who} size={32} color={cfg.accent} /></div>
        </header>

        <main className="ad-main">{children}</main>
      </div>
    </div>
  );
}

function AdminPageH({ title, sub, right, eyebrow }) {
  return (
    <div className="ad-page-h">
      <div>
        {eyebrow && <div className="ad-page-eyebrow">{eyebrow}</div>}
        <h1 className="ad-page-title">{title}</h1>
        {sub && <div className="ad-page-sub">{sub}</div>}
      </div>
      {right && <div className="ad-page-right">{right}</div>}
    </div>
  );
}

function ABtn({ children, kind = 'soft', onClick, accent }) {
  return <button className={'ad-btn ad-btn-' + kind} onClick={onClick}
                 style={accent && kind === 'primary' ? { background: accent } : {}}>{children}</button>;
}
function ACard({ title, action, children, pad = true, className = '', style }) {
  return (
    <div className={'ad-card ' + className} style={style}>
      {title && <div className="ad-card-h"><h3>{title}</h3>{action}</div>}
      <div className={pad ? 'ad-card-b' : ''}>{children}</div>
    </div>
  );
}

const adminShellStyles = `
.ad-root { display: grid; grid-template-columns: 256px 1fr; min-height: 100vh; background: var(--sf-bg); font-family: var(--sf-font-ui); color: var(--sf-ink); }
.ad-root * { box-sizing: border-box; }

.ad-side { background: var(--sf-surface); border-right: 1px solid var(--sf-border); position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; }
.ad-side-top { display: flex; align-items: center; padding: 16px 14px 10px; }
.ad-brand { display: flex; align-items: center; gap: 9px; flex: 1; min-width: 0; }
.ad-brand-n { font-size: 14.5px; font-weight: 700; letter-spacing: -0.02em; }
.ad-brand-role { font-size: 10.5px; font-weight: 700; letter-spacing: 0.02em; margin-top: 1px; }
.ad-side-x { display: none; background: transparent; border: none; cursor: pointer; color: var(--sf-muted); }

.ad-branch { margin: 4px 12px 8px; padding: 9px 11px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); border-radius: 11px; display: flex; align-items: center; gap: 9px; cursor: pointer; position: relative; }
.ad-branch:hover { border-color: var(--sf-border-strong); }
.ad-branch-mark { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-branch-n { font-size: 12.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ad-branch-sub { font-size: 10px; color: var(--sf-muted); }
.ad-branch-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; box-shadow: var(--sf-shadow-lg); z-index: 30; padding: 6px; }
.ad-branch-opt { display: flex; align-items: center; justify-content: space-between; padding: 9px 10px; border-radius: 8px; cursor: pointer; }
.ad-branch-opt:hover { background: var(--sf-surface-2); }
.ad-branch-opt.on { background: var(--sf-primary-soft); }
.ad-branch-opt-n { font-size: 12.5px; font-weight: 600; }
.ad-branch-opt-s { font-size: 10px; color: var(--sf-muted); }

.ad-nav { flex: 1; overflow-y: auto; padding: 4px 12px 12px; }
.ad-nav::-webkit-scrollbar { width: 0; }
.ad-nav-grp { margin-bottom: 4px; }
.ad-nav-grp-l { padding: 12px 10px 5px; font-size: 9.5px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--sf-muted-2); }
.ad-nav-i { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; margin-bottom: 1px; background: transparent; border: none; border-radius: 9px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--sf-ink-2); text-align: left; transition: background 0.12s; }
.ad-nav-i:hover { background: var(--sf-surface-2); color: var(--sf-ink); }
.ad-nav-i.on { background: var(--on-accent); color: #FFFCF5; font-weight: 700; }
.ad-nav-ic { width: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-nav-l { flex: 1; }
.ad-nav-n { font-family: var(--sf-font-mono); min-width: 18px; height: 17px; padding: 0 5px; border-radius: 8px; background: var(--sf-surface-3); color: var(--sf-ink-2); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.ad-nav-n.acc { color: #FFFCF5; }
.ad-nav-i.on .ad-nav-n { background: rgba(255,252,245,0.25); color: #FFFCF5; }

.ad-side-user { display: flex; align-items: center; gap: 10px; padding: 10px; margin: 8px 12px 12px; background: var(--sf-surface-2); border-radius: 11px; cursor: pointer; }
.ad-side-user:hover { background: var(--sf-surface-3); }
.ad-user-n { font-size: 12.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ad-user-r { font-size: 10px; color: var(--sf-muted); }

.ad-col { display: flex; flex-direction: column; min-width: 0; }
.ad-top { position: sticky; top: 0; z-index: 20; background: var(--sf-surface); border-bottom: 1px solid var(--sf-border); padding: 11px 22px; display: flex; align-items: center; gap: 14px; height: 60px; }
.ad-burger { display: none; background: var(--sf-surface-2); border: none; cursor: pointer; width: 36px; height: 36px; border-radius: 9px; align-items: center; justify-content: center; color: var(--sf-ink-2); }
.ad-crumb { display: flex; align-items: center; gap: 7px; }
.ad-crumb-scope { font-size: 13px; font-weight: 700; }
.ad-crumb-cur { font-size: 13px; font-weight: 600; }
.ad-top-search { flex: 1; max-width: 420px; margin-left: auto; }
.ad-kbd { font-family: var(--sf-font-mono); font-size: 10px; color: var(--sf-muted); padding: 2px 6px; border-radius: 4px; background: var(--sf-surface-2); }
.ad-cur { position: relative; display: flex; align-items: center; gap: 5px; padding: 7px 11px; border-radius: 9px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); cursor: pointer; font-size: 12px; font-weight: 700; }
.ad-cur:hover { border-color: var(--sf-border-strong); }
.ad-cur-menu { position: absolute; top: calc(100% + 6px); right: 0; width: 160px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; box-shadow: var(--sf-shadow-lg); z-index: 40; padding: 6px; }
.ad-cur-opt { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; cursor: pointer; }
.ad-cur-opt:hover { background: var(--sf-surface-2); }
.ad-cur-opt.on { background: var(--sf-surface-2); }
.ad-cur-sym { flex: 1; color: var(--sf-muted); font-size: 12px; }
.ad-cur-note { padding: 8px 10px 4px; font-size: 9.5px; color: var(--sf-muted); border-top: 1px solid var(--sf-border); margin-top: 4px; }
.ad-top-ic { width: 36px; height: 36px; border-radius: 9px; background: transparent; border: none; cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; position: relative; }
.ad-top-ic:hover { background: var(--sf-surface-2); }
.ad-top-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--sf-danger); border: 2px solid var(--sf-surface); }
.ad-top-av { cursor: pointer; }

.ad-main { flex: 1; padding: 24px 28px 60px; max-width: 1680px; width: 100%; margin: 0 auto; }
.ad-page-h { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 20px; }
.ad-page-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-muted); margin-bottom: 7px; }
.ad-page-title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
.ad-page-sub { margin-top: 5px; font-size: 13.5px; color: var(--sf-muted); }
.ad-page-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.ad-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; font-family: inherit; font-weight: 600; font-size: 12.5px; border: 1px solid transparent; cursor: pointer; transition: transform 0.08s; white-space: nowrap; }
.ad-btn:active { transform: scale(0.97); }
.ad-btn-primary { background: var(--sf-primary); color: #FFFCF5; }
.ad-btn-soft { background: var(--sf-surface-2); color: var(--sf-ink); border-color: var(--sf-border); }
.ad-btn-ghost { background: transparent; color: var(--sf-ink-2); border-color: var(--sf-border-strong); }
.ad-btn-ink { background: var(--sf-ink); color: var(--sf-bg); }

.ad-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.ad-card-h { padding: 13px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--sf-border); gap: 8px; }
.ad-card-h h3 { margin: 0; font-size: 13.5px; font-weight: 700; letter-spacing: -0.005em; }
.ad-card-b { padding: 16px; }
.ad-link { font-size: 12px; color: var(--sf-primary); font-weight: 600; cursor: pointer; }
.ad-link:hover { text-decoration: underline; }

/* Grids */
.ad-grid { display: grid; gap: 14px; }
.ad-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px; }

@media (max-width: 1100px) {
  .ad-root { grid-template-columns: 1fr; }
  .ad-side { position: fixed; top: 0; left: 0; bottom: 0; width: 272px; z-index: 60; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.32,0.72,0,1); }
  .ad-side.open { transform: translateX(0); }
  .ad-side-x { display: block; margin-left: auto; }
  .ad-scrim { position: fixed; inset: 0; background: rgba(20,16,11,0.55); z-index: 50; }
  .ad-burger { display: flex; }
  .ad-top-search { display: none; }
  .ad-main { padding: 16px 14px 80px; }
  .ad-page-title { font-size: 24px; }
}
@media (max-width: 600px) {
  .ad-crumb-scope { display: none; }
  .ad-page-h { flex-direction: column; align-items: stretch; }
}
`;

Object.assign(window, { ROLE_CFG, BRANCHES, AdminShell, AdminPageH, ABtn, ACard });
