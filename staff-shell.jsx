// staff-shell.jsx — Permission-driven shell for the unified Staff app.
// One app, 5 roles. Nav + accessible pages change by role. Honors the
// sf-control layout presets (sidebar / rail / topbar / dock / zen) and
// reorderable nav. Includes a role switcher so you can preview each user.

const STAFF_ROLES = {
  teacher: {
    label: 'O‘qituvchi', who: 'Nigora Karimova', sub: 'Matematika · Yunusobod', accent: 'var(--sf-primary)',
    nav: [
      { id: 'today', l: 'Bugun', icon: Icons.home },
      { id: 'groups', l: 'Guruhlarim', icon: Icons.cohort, n: 3 },
      { id: 'attendance', l: 'Davomat', icon: Icons.check },
      { id: 'cards', l: 'Kartalar', icon: Icons.brand },
      { id: 'materials', l: 'Materiallar', icon: Icons.folder },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 4 },
      { id: 'ai', l: 'AI yordamchi', icon: Icons.ai },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
  assistant: {
    label: 'Assistent', who: 'Sevara Olimova', sub: 'Matematika · yordamchi', accent: 'var(--sf-success)',
    nav: [
      { id: 'today', l: 'Bugun', icon: Icons.home },
      { id: 'groups', l: 'Guruhlar', icon: Icons.cohort, n: 2 },
      { id: 'attendance', l: 'Davomat', icon: Icons.check },
      { id: 'materials', l: 'Materiallar', icon: Icons.folder },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 1 },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
  methodist: {
    label: 'Metodist', who: 'Malika Yusupova', sub: 'O‘quv sifat nazorati', accent: 'var(--sf-accent)',
    nav: [
      { id: 'today', l: 'Bugun', icon: Icons.home },
      { id: 'groups', l: 'Barcha guruhlar', icon: Icons.cohort, n: 28 },
      { id: 'enroll', l: 'Qabul · Test', icon: Icons.check },
      { id: 'teachers', l: 'O‘qituvchilar', icon: Icons.user, n: 16 },
      { id: 'cards', l: 'Kartalar nazorati', icon: Icons.brand },
      { id: 'materials', l: 'Materiallar', icon: Icons.folder },
      { id: 'reports', l: 'Hisobotlar', icon: Icons.trend },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 2 },
      { id: 'ai', l: 'AI tahlil', icon: Icons.ai },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
  reception: {
    label: 'Qabul', who: 'Gulnora Saidova', sub: 'Reception · Yunusobod', accent: 'var(--sf-ink-2)',
    nav: [
      { id: 'today', l: 'Bugun', icon: Icons.home },
      { id: 'students', l: 'O‘quvchilar', icon: Icons.cohort, n: 512 },
      { id: 'leads', l: 'Lidlar', icon: Icons.flag, n: 34 },
      { id: 'enroll', l: 'Qabul · Test', icon: Icons.check },
      { id: 'payments', l: 'To‘lovlar', icon: Icons.trend },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 6 },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
  auditor: {
    label: 'Auditor', who: 'Jamshid Qodirov', sub: 'Nazorat · faqat o‘qish', accent: '#7A4A82',
    nav: [
      { id: 'auditdash', l: 'Audit paneli', icon: Icons.shield },
      { id: 'anomalies', l: 'Anomaliyalar', icon: Icons.flag, n: 12 },
      { id: 'logs', l: 'Kirish jurnali', icon: Icons.doc },
      { id: 'cases', l: 'Holatlar', icon: Icons.pin, n: 8 },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
};
const STAFF_ORDER = ['teacher', 'assistant', 'methodist', 'reception', 'auditor'];

function StaffShell({ role, setRole, active, onNav, renderPage, roles, order }) {
  roles = roles || STAFF_ROLES; order = order || STAFF_ORDER;
  const cfg = roles[role];
  const ctl = useControl();
  const layout = ctl.st.layout;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [roleOpen, setRoleOpen] = React.useState(false);
  // nav ordered by control, filtered to this role
  const roleIds = cfg.nav.map(n => n.id);
  const ordered = ctl.orderedNav.filter(n => roleIds.includes(n.id));
  const cur = cfg.nav.find(n => n.id === active) || cfg.nav[0];

  const NavBtn = ({ n, mode }) => (
    <button className={'st-nav st-nav-' + mode + (active === n.id ? ' on' : '')}
      onClick={() => { onNav(n.id); setMenuOpen(false); }}
      style={active === n.id ? { '--acc': cfg.accent } : {}} title={n.l}>
      <span className="st-nav-ic">{React.cloneElement(n.icon, { size: mode === 'rail' ? 21 : 18 })}</span>
      {mode !== 'rail' && <span className="st-nav-l">{n.l}</span>}
      {n.n != null && mode !== 'rail' && <span className="st-nav-n">{n.n > 999 ? (n.n/1000).toFixed(1)+'k' : n.n}</span>}
      {n.n != null && mode === 'rail' && <span className="st-nav-dot" />}
    </button>
  );

  const RoleSwitcher = () => (
    <div className="st-roles" onClick={() => setRoleOpen(!roleOpen)}>
      <SfAvatar name={cfg.who} size={30} color={cfg.accent} />
      <div className="st-roles-tx">
        <div className="st-roles-who">{cfg.who}</div>
        <div className="st-roles-role" style={{ color: cfg.accent }}>{cfg.label}</div>
      </div>
      {React.cloneElement(Icons.chevD, { size: 14, style: { color: 'var(--sf-muted)' } })}
      {roleOpen && (
        <div className="st-roles-menu" onClick={e => e.stopPropagation()}>
          <div className="st-roles-menu-h">Rolni almashtirish · demo</div>
          {order.map(r => {
            const rc = roles[r];
            return (
              <button key={r} className={'st-roles-opt' + (r === role ? ' on' : '')}
                onClick={() => { setRole(r); setRoleOpen(false); onNav(rc.nav[0].id); window.sfToast && window.sfToast(rc.label + ' sifatida kirildi', { tone: 'info', sub: rc.who }); }}>
                <SfAvatar name={rc.who} size={28} color={rc.accent} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div className="st-roles-opt-n">{rc.who}</div>
                  <div className="st-roles-opt-r">{rc.label} · {rc.nav.length - 1} sahifa</div>
                </div>
                {r === role && React.cloneElement(Icons.check, { size: 15, style: { color: rc.accent } })}
              </button>
            );
          })}
          <div className="st-roles-note">Har rol turli sahifa va ruxsatlarni ko‘radi</div>
        </div>
      )}
    </div>
  );

  const Brand = ({ compact }) => (
    <div className="st-brand">
      <SfStar size={compact ? 24 : 26} color={cfg.accent} />
      {!compact && <div className="st-brand-tx"><div className="st-brand-n">StarForge<span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}> · EDU</span></div><div className="st-brand-s" style={{ color: cfg.accent }}>{cfg.label}</div></div>}
    </div>
  );

  const Drawer = () => (
    <>
      <div className={'st-zen-scrim' + (menuOpen ? ' on' : '')} onClick={() => setMenuOpen(false)} />
      <aside className={'st-zen-menu' + (menuOpen ? ' on' : '')}>
        <div className="st-side-top"><Brand /><button className="st-zen-x" onClick={() => setMenuOpen(false)}>{React.cloneElement(Icons.x, { size: 18 })}</button></div>
        <nav className="st-side-nav">{ordered.map(n => <NavBtn key={n.id} n={n} mode="side" />)}</nav>
      </aside>
    </>
  );

  const Topbar = ({ showMenu }) => (
    <header className="st-top">
      <button className="st-burger" onClick={() => setMenuOpen(true)}>{React.cloneElement(Icons.filter, { size: 19 })}</button>
      <div className="st-crumb">{cur && React.cloneElement(cur.icon, { size: 16, style: { color: cfg.accent } })}<span>{cur && cur.l}</span></div>
      <div className="st-search"><span>{React.cloneElement(Icons.search, { size: 15, style: { color: 'var(--sf-muted)' } })}</span><input placeholder="Izlash..." readOnly onClick={() => window.sfToast && window.sfToast('Qidiruv ochildi', { tone: 'info' })} /></div>
      <button className="st-top-ic" onClick={() => window.sfToast && window.sfToast('3 ta yangi bildirishnoma', { tone: 'info' })}>{React.cloneElement(Icons.bell, { size: 18 })}<span className="st-top-dot" /></button>
      <RoleSwitcher />
    </header>
  );

  // ── LAYOUT VARIANTS ──
  const main = <main className="st-main" style={sfPatternBg(ctl.st.pattern)}>{renderPage(role, active, onNav)}</main>;

  if (layout === 'sidebar') {
    return (
      <div className="st-root lay-sidebar">
        <aside className="st-side">
          <div className="st-side-top"><Brand /></div>
          <nav className="st-side-nav">{ordered.map(n => <NavBtn key={n.id} n={n} mode="side" />)}</nav>
        </aside>
        <div className="st-col"><Topbar />{main}</div>
        <Drawer />
      </div>
    );
  }
  if (layout === 'rail') {
    return (
      <div className="st-root lay-rail">
        <aside className="st-rail">
          <div className="st-rail-top"><SfStar size={24} color={cfg.accent} /></div>
          <nav className="st-rail-nav">{ordered.map(n => <NavBtn key={n.id} n={n} mode="rail" />)}</nav>
        </aside>
        <div className="st-col"><Topbar />{main}</div>
        <Drawer />
      </div>
    );
  }
  if (layout === 'topbar') {
    return (
      <div className="st-root lay-topbar">
        <header className="st-topnav">
          <Brand />
          <nav className="st-topnav-nav">{ordered.map(n => <NavBtn key={n.id} n={n} mode="top" />)}</nav>
          <div className="st-topnav-r"><button className="st-burger" onClick={() => setMenuOpen(true)}>{React.cloneElement(Icons.filter, { size: 19 })}</button><button className="st-top-ic" onClick={() => window.sfToast && window.sfToast('3 ta bildirishnoma', { tone: 'info' })}>{React.cloneElement(Icons.bell, { size: 18 })}<span className="st-top-dot" /></button><RoleSwitcher /></div>
        </header>
        {main}
        <Drawer />
      </div>
    );
  }
  if (layout === 'dock') {
    return (
      <div className="st-root lay-dock">
        <div className="st-col"><Topbar />{main}</div>
        <Drawer />
        <nav className="st-dock">{ordered.map(n => (
          <button key={n.id} className={'st-dock-b' + (active === n.id ? ' on' : '')} onClick={() => onNav(n.id)} title={n.l} style={active === n.id ? { '--acc': cfg.accent } : {}}>
            {React.cloneElement(n.icon, { size: 20 })}{n.n != null && <span className="st-dock-dot" />}
          </button>
        ))}</nav>
      </div>
    );
  }
  // zen
  return (
    <div className="st-root lay-zen">
      <div className="st-col"><Topbar showMenu={true} />{main}</div>
      <div className={'st-zen-scrim' + (menuOpen ? ' on' : '')} onClick={() => setMenuOpen(false)} />
      <aside className={'st-zen-menu' + (menuOpen ? ' on' : '')}>
        <div className="st-side-top"><Brand /><button className="st-zen-x" onClick={() => setMenuOpen(false)}>{React.cloneElement(Icons.x, { size: 18 })}</button></div>
        <nav className="st-side-nav">{ordered.map(n => <NavBtn key={n.id} n={n} mode="side" />)}</nav>
      </aside>
    </div>
  );
}

// shared page header + atoms used by staff pages
function StaffH({ eyebrow, title, sub, right }) {
  return <div className="st-page-h"><div>{eyebrow && <div className="st-eyebrow">{eyebrow}</div>}<h1 className="st-title">{title}</h1>{sub && <div className="st-page-sub">{sub}</div>}</div>{right && <div className="st-page-right">{right}</div>}</div>;
}
function SBtn({ children, kind = 'soft', onClick, accent }) {
  return <button className={'st-btn st-btn-' + kind} onClick={onClick} style={accent && kind === 'primary' ? { background: accent } : {}}>{children}</button>;
}

const staffShellStyles = `
.st-root { min-height: 100vh; background: var(--sf-bg); font-family: var(--sf-font-ui); color: var(--sf-ink); }
.st-root * { box-sizing: border-box; }
.lay-sidebar, .lay-rail, .lay-dock, .lay-zen { display: grid; }
.lay-sidebar { grid-template-columns: 244px 1fr; }
.lay-rail { grid-template-columns: 68px 1fr; }
.st-col { display: flex; flex-direction: column; min-width: 0; }

.st-brand { display: flex; align-items: center; gap: 9px; }
.st-brand-n { font-size: 14.5px; font-weight: 700; letter-spacing: -0.02em; }
.st-brand-s { font-size: 10.5px; font-weight: 700; margin-top: 1px; }

.st-side { background: var(--sf-surface); border-right: 1px solid var(--sf-border); position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; }
.st-side-top { padding: 17px 16px 12px; display: flex; align-items: center; justify-content: space-between; }
.st-side-nav { flex: 1; overflow-y: auto; padding: 6px 12px; display: flex; flex-direction: column; gap: 2px; }
.st-side-nav::-webkit-scrollbar { width: 0; }

.st-nav { display: flex; align-items: center; gap: 11px; width: 100%; padding: calc(9px * var(--sf-dens)) 11px; border: none; background: transparent; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--sf-ink-2); text-align: left; transition: background 0.14s, color 0.14s; }
.st-nav:hover { background: var(--sf-surface-2); color: var(--sf-ink); }
.st-nav.on { background: var(--acc); color: #FFFCF5; font-weight: 700; }
.st-nav-ic { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.st-nav.on .st-nav-ic { color: #FFFCF5; }
.st-nav:not(.on) .st-nav-ic { color: var(--sf-muted); }
.st-nav-l { flex: 1; }
.st-nav-n { font-family: var(--sf-font-mono); min-width: 18px; height: 17px; padding: 0 5px; border-radius: 8px; background: var(--sf-surface-3); color: var(--sf-ink-2); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.st-nav.on .st-nav-n { background: rgba(255,252,245,0.25); color: #FFFCF5; }

.st-rail { background: var(--sf-surface); border-right: 1px solid var(--sf-border); position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; align-items: center; }
.st-rail-top { padding: 17px 0 12px; }
.st-rail-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 6px; align-items: center; }
.st-nav-rail { width: 46px; height: 46px; justify-content: center; padding: 0; position: relative; border-radius: 13px; }
.st-nav-rail .st-nav-dot { position: absolute; top: 9px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--sf-primary); }
.st-nav-rail.on .st-nav-dot { background: #FFFCF5; }

.st-topnav { display: flex; align-items: center; gap: 18px; padding: 10px 22px; background: var(--sf-surface); border-bottom: 1px solid var(--sf-border); position: sticky; top: 0; z-index: 20; }
.st-topnav-nav { flex: 1; display: flex; gap: 3px; overflow-x: auto; }
.st-topnav-nav::-webkit-scrollbar { height: 0; }
.st-nav-top { width: auto; padding: 8px 13px; white-space: nowrap; }
.st-topnav-r { display: flex; align-items: center; gap: 10px; }

.st-top { display: flex; align-items: center; gap: 14px; padding: 11px 22px; background: var(--sf-surface); border-bottom: 1px solid var(--sf-border); position: sticky; top: 0; z-index: 20; height: 60px; }
.st-burger { display: none; background: var(--sf-surface-2); border: none; width: 36px; height: 36px; border-radius: 9px; cursor: pointer; color: var(--sf-ink-2); align-items: center; justify-content: center; }
.lay-zen .st-burger { display: flex; }
.st-crumb { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
.st-search { flex: 1; max-width: 360px; margin-left: auto; display: flex; align-items: center; gap: 8px; background: var(--sf-bg); border: 1px solid var(--sf-border); border-radius: 10px; padding: 8px 12px; }
.st-search input { border: none; background: transparent; outline: none; font-family: inherit; font-size: 13px; color: var(--sf-ink); width: 100%; cursor: pointer; }
.st-top-ic { width: 36px; height: 36px; border-radius: 10px; background: transparent; border: none; cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; position: relative; }
.st-top-ic:hover { background: var(--sf-surface-2); }
.st-top-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--sf-danger); border: 2px solid var(--sf-surface); }

.st-roles { display: flex; align-items: center; gap: 9px; padding: 5px 9px 5px 5px; border-radius: 12px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); cursor: pointer; position: relative; }
.st-roles:hover { border-color: var(--sf-border-strong); }
.st-roles-who { font-size: 12.5px; font-weight: 700; line-height: 1.1; }
.st-roles-role { font-size: 10px; font-weight: 700; }
.st-roles-menu { position: absolute; top: calc(100% + 6px); right: 0; width: 280px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; box-shadow: var(--sf-shadow-lg); z-index: 60; padding: 8px; }
.st-roles-menu-h { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-muted); padding: 6px 8px; }
.st-roles-opt { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px; border-radius: 10px; border: none; background: transparent; cursor: pointer; font-family: inherit; }
.st-roles-opt:hover { background: var(--sf-surface-2); }
.st-roles-opt.on { background: var(--sf-surface-2); }
.st-roles-opt-n { font-size: 12.5px; font-weight: 700; }
.st-roles-opt-r { font-size: 10.5px; color: var(--sf-muted); }
.st-roles-note { font-size: 10px; color: var(--sf-muted); padding: 8px 8px 4px; border-top: 1px solid var(--sf-border); margin-top: 4px; }

.st-main { flex: 1; padding: calc(24px * var(--sf-dens)) 28px 90px; max-width: 1560px; width: 100%; margin: 0 auto; }
.lay-topbar .st-main, .lay-zen .st-main, .lay-dock .st-main { margin: 0 auto; }

.st-dock { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 40; display: flex; gap: 5px; padding: 7px; background: color-mix(in oklab, var(--sf-surface) 86%, transparent); backdrop-filter: blur(14px); border: 1px solid var(--sf-border); border-radius: 18px; box-shadow: var(--sf-shadow-lg); }
.st-dock-b { width: 46px; height: 46px; border-radius: 13px; border: none; background: transparent; cursor: pointer; color: var(--sf-muted); display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.18s cubic-bezier(0.22,1,0.36,1); }
.st-dock-b:hover { background: var(--sf-surface-2); transform: translateY(-3px); }
.st-dock-b.on { background: var(--acc); color: #FFFCF5; }
.st-dock-dot { position: absolute; top: 8px; right: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--sf-danger); }

.st-zen-scrim { position: fixed; inset: 0; background: rgba(20,16,11,0.45); z-index: 45; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
.st-zen-scrim.on { opacity: 1; pointer-events: auto; }
.st-zen-menu { position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: var(--sf-surface); border-right: 1px solid var(--sf-border); z-index: 46; transform: translateX(-100%); transition: transform 0.36s cubic-bezier(0.22,1,0.36,1); display: flex; flex-direction: column; }
.st-zen-menu.on { transform: translateX(0); }
.st-zen-x { background: var(--sf-surface-2); border: none; width: 32px; height: 32px; border-radius: 9px; cursor: pointer; color: var(--sf-ink-2); }

.st-page-h { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 20px; }
.st-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-muted); margin-bottom: 7px; }
.st-title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
.st-page-sub { margin-top: 5px; font-size: 13.5px; color: var(--sf-muted); }
.st-page-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.st-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 15px; border-radius: 10px; font-family: inherit; font-weight: 600; font-size: 13px; border: 1px solid transparent; cursor: pointer; transition: transform 0.08s, background 0.15s; white-space: nowrap; }
.st-btn:active { transform: scale(0.96); }
.st-btn-primary { background: var(--sf-primary); color: #FFFCF5; }
.st-btn-soft { background: var(--sf-surface-2); color: var(--sf-ink); border-color: var(--sf-border); }
.st-btn-ghost { background: transparent; color: var(--sf-ink-2); border-color: var(--sf-border-strong); }

@media (max-width: 980px) {
  .lay-sidebar, .lay-rail { grid-template-columns: 1fr; }
  .lay-sidebar .st-side, .lay-rail .st-rail { display: none; }
  .lay-sidebar .st-top, .lay-rail .st-top { } 
  .st-topnav-nav { display: none; }
  .st-burger { display: flex; }
  .st-main { padding: 16px 14px 90px; }
  .st-title { font-size: 24px; }
  .st-search { display: none; }
}
`;

Object.assign(window, { STAFF_ROLES, STAFF_ORDER, StaffShell, StaffH, SBtn, staffShellStyles });
