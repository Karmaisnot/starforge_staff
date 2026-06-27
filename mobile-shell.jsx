// mobile-shell.jsx — Generic phone-framed mobile app. Reuses the SAME page
// components as the web apps (they're responsive) inside iOS/Android frames
// on a canvas, with a bottom tab bar + role switcher. Fully interactive.

function MobilePhone({ roles, order, pages, platform, role, setRole, active, setActive }) {
  const cfg = roles[role];
  const w = platform === 'ios' ? 390 : 402, h = platform === 'ios' ? 844 : 860;
  const [roleOpen, setRoleOpen] = React.useState(false);
  const tabs = cfg.nav.filter(n => n.id !== 'settings').slice(0, 5);
  const onNav = (id) => { setActive(id); const el = document.getElementById('mb-' + platform); if (el) el.scrollTop = 0; };

  return (
    <div style={{ width: w + 26, height: h + 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="mob-phone" style={{ width: w, height: h, borderRadius: platform === 'ios' ? 50 : 42 }}>
        {/* status bar */}
        <div className="mob-status">
          <span>9:41</span>
          {platform === 'ios' && <span className="mob-notch" />}
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ fontSize: 11 }}>5G</span><span className="mob-batt" /></span>
        </div>
        {/* header */}
        <div className="mob-head">
          <div className="mob-role" onClick={() => setRoleOpen(!roleOpen)}>
            <SfAvatar name={cfg.who} size={30} color={cfg.accent} />
            <div style={{ minWidth: 0 }}><div className="mob-role-w">{cfg.who.split(' ')[0]}</div><div className="mob-role-r" style={{ color: cfg.accent }}>{cfg.label}</div></div>
            {React.cloneElement(Icons.chevD, { size: 13, style: { color: 'var(--sf-muted)' } })}
            {roleOpen && (
              <div className="mob-role-menu" onClick={e => e.stopPropagation()}>
                {order.map(r => (
                  <button key={r} className={'mob-role-opt' + (r === role ? ' on' : '')} onClick={() => { setRole(r); setActive(roles[r].nav[0].id); setRoleOpen(false); window.sfToast && window.sfToast(roles[r].label + ' sifatida', { tone: 'info', sub: roles[r].who }); }}>
                    <SfAvatar name={roles[r].who} size={24} color={roles[r].accent} />
                    <span style={{ flex: 1, textAlign: 'left', fontSize: 12.5, fontWeight: 600 }}>{roles[r].who}</span>
                    {r === role && React.cloneElement(Icons.check, { size: 14, style: { color: roles[r].accent } })}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="mob-bell" onClick={() => window.sfToast && window.sfToast('Bildirishnomalar', { tone: 'info' })}>{React.cloneElement(Icons.bell, { size: 18 })}<span className="mob-bell-dot" /></button>
        </div>
        {/* body */}
        <div className="mob-body" id={'mb-' + platform} style={sfPatternBg(useControl().st.pattern)}>
          {(pages[active] || pages[cfg.nav[0].id])(role, onNav)}
        </div>
        {/* tab bar */}
        <div className="mob-tabs" style={{ paddingBottom: platform === 'ios' ? 18 : 10 }}>
          {tabs.map(t => (
            <button key={t.id} className={'mob-tab' + (active === t.id ? ' on' : '')} onClick={() => onNav(t.id)} style={active === t.id ? { '--acc': cfg.accent } : {}}>
              <span className="mob-tab-ic">{active === t.id && <span className="mob-tab-bg" style={{ background: cfg.accent }} />}<span style={{ position: 'relative', color: active === t.id ? '#fff' : 'var(--sf-muted)' }}>{React.cloneElement(t.icon, { size: 20 })}</span></span>
              <span style={{ color: active === t.id ? cfg.accent : 'var(--sf-muted)' }}>{t.l.split(' ')[0]}</span>
            </button>
          ))}
        </div>
        {platform === 'ios' ? <div className="mob-home" /> : <div className="mob-anav"><div /></div>}
      </div>
    </div>
  );
}

function MobileApp({ roles, order, pages, defaultRole }) {
  const [role, setRole] = React.useState(defaultRole);
  const [active, setActive] = React.useState(roles[defaultRole].nav[0].id);
  const [cur, setCur] = React.useState('UZS');
  return (
    <CurrencyCtx.Provider value={{ cur, setCur }}>
      <style>{adminCommonStyles}</style>
      <style>{window.staffPageStyles || ''}</style>
      <style>{window.famStyles || ''}</style>
      <style>{mobileShellStyles}</style>
      <DesignCanvas>
        <DCSection id="m" title={roles[defaultRole].label + ' · mobil ilova'} subtitle="Bosing va sinab ko‘ring · tablar, rollar, tugmalar — barchasi ishlaydi">
          <DCArtboard id="ios" label="iOS" width={w_ios()} height={884}><MobilePhone roles={roles} order={order} pages={pages} platform="ios" role={role} setRole={setRole} active={active} setActive={setActive} /></DCArtboard>
          <DCArtboard id="and" label="Android" width={w_and()} height={900}><MobilePhone roles={roles} order={order} pages={pages} platform="android" role={role} setRole={setRole} active={active} setActive={setActive} /></DCArtboard>
        </DCSection>
      </DesignCanvas>
    </CurrencyCtx.Provider>
  );
}
function w_ios() { return 416; }
function w_and() { return 428; }

function mountMobile(kind) {
  const cfg = kind === 'family'
    ? { roles: FAM_ROLES, order: FAM_ORDER, pages: FAM_PAGES, def: 'parent', palette: 'saroy' }
    : { roles: STAFF_ROLES, order: STAFF_ORDER, pages: STAFF_PAGES, def: 'teacher', palette: 'marvarid' };
  const nav = []; const seen = {};
  cfg.order.forEach(r => cfg.roles[r].nav.forEach(n => { if (!seen[n.id]) { seen[n.id] = 1; nav.push(n); } }));
  ReactDOM.createRoot(document.getElementById('root')).render(
    <SfControlProvider appId={'mob-' + kind} defaultNav={nav} defaults={{ palette: cfg.palette, layout: 'dock' }}>
      <MobileApp roles={cfg.roles} order={cfg.order} pages={cfg.pages} defaultRole={cfg.def} />
    </SfControlProvider>
  );
}
window.mountMobile = mountMobile;

const mobileShellStyles = `
.mob-phone { background: var(--sf-bg); overflow: hidden; position: relative; display: flex; flex-direction: column; box-shadow: 0 30px 80px rgba(54,30,14,0.20), 0 0 0 11px #161310, 0 0 0 13px #2A2620; }
.mob-phone * { box-sizing: border-box; }
.mob-status { height: 44px; padding: 14px 24px 4px; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 600; color: var(--sf-ink); position: relative; flex-shrink: 0; }
.mob-notch { position: absolute; left: 50%; top: 10px; transform: translateX(-50%); width: 100px; height: 26px; background: #000; border-radius: 100px; }
.mob-batt { width: 22px; height: 11px; border: 1px solid currentColor; border-radius: 3px; position: relative; opacity: 0.8; }
.mob-batt::after { content: ''; position: absolute; inset: 1.5px; right: 30%; background: currentColor; border-radius: 1px; }
.mob-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 16px 10px; flex-shrink: 0; }
.mob-role { display: flex; align-items: center; gap: 8px; padding: 4px 8px 4px 4px; border-radius: 11px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); cursor: pointer; position: relative; }
.mob-role-w { font-size: 12.5px; font-weight: 700; line-height: 1.1; }
.mob-role-r { font-size: 9.5px; font-weight: 700; }
.mob-role-menu { position: absolute; top: calc(100% + 6px); left: 0; width: 210px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; box-shadow: var(--sf-shadow-lg); z-index: 80; padding: 6px; }
.mob-role-opt { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px; border-radius: 9px; border: none; background: transparent; cursor: pointer; font-family: inherit; }
.mob-role-opt:hover, .mob-role-opt.on { background: var(--sf-surface-2); }
.mob-bell { width: 36px; height: 36px; border-radius: 10px; background: var(--sf-surface-2); border: none; cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; position: relative; }
.mob-bell-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--sf-danger); border: 2px solid var(--sf-surface-2); }
.mob-body { flex: 1; overflow-y: auto; padding: 8px 16px 16px; }
.mob-body::-webkit-scrollbar { width: 0; }
/* compact the reused page headers/grids for phone */
.mob-body .st-page-h, .mob-body .fam-page-h { margin-bottom: 14px; }
.mob-body .st-title, .mob-body .fam-title { font-size: 23px; }
.mob-body .st-page-right, .mob-body .fam-right { display: none; }
.mob-body .sp-grid2, .mob-body .fam-grid2 { grid-template-columns: 1fr; gap: 12px; }
.mob-body .sp-kpis, .mob-body .fam-kpis { grid-template-columns: 1fr 1fr; gap: 8px; }
.mob-body .sp-msg, .mob-body .fam-chat { height: 420px; }
.mob-body .sp-msg { grid-template-columns: 1fr; } .mob-body .sp-msg-chat { display: none; }
.mob-tabs { display: flex; padding: 8px 4px; background: var(--sf-surface); border-top: 1px solid var(--sf-border); flex-shrink: 0; }
.mob-tab { flex: 1; background: transparent; border: none; cursor: pointer; font-family: inherit; padding: 4px 0; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 600; }
.mob-tab-ic { position: relative; display: flex; align-items: center; justify-content: center; }
.mob-tab-bg { position: absolute; inset: -6px -10px; border-radius: 11px; }
.mob-home { position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%); width: 128px; height: 5px; border-radius: 3px; background: var(--sf-ink); opacity: 0.5; }
.mob-anav { height: 20px; display: flex; align-items: center; justify-content: center; background: var(--sf-surface); flex-shrink: 0; }
.mob-anav > div { width: 104px; height: 4px; border-radius: 3px; background: var(--sf-ink); opacity: 0.5; }
`;
