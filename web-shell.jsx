// web-shell.jsx — Responsive shell for StarForge EDU web app
// Desktop ≥1024px: 264px sidebar + topbar + main
// Tablet 768-1024px: 72px icon sidebar
// Mobile <768px: drawer + bottom tab bar

function WebShell({ active, onNav, children, badges = {} }) {
  const [drawer, setDrawer] = React.useState(false);

  const primary = [
    { id: 'today',   l: 'Bugun',         icon: Icons.home },
    { id: 'cohorts', l: 'Guruhlar',      icon: Icons.cohort },
    { id: 'tasks',   l: 'Vazifalar',     icon: Icons.check, badge: badges.tasks },
    { id: 'ai',      l: 'AI Suhbat',     icon: Icons.ai },
    { id: 'print',   l: 'Print',         icon: Icons.print, badge: badges.print },
  ];
  const secondary = [
    { id: 'cards',     l: 'Kartalar',          icon: Icons.brand },
    { id: 'surveys',   l: 'So‘rovnomalar',     icon: Icons.flag,   badge: badges.surveys, urgent: true },
    { id: 'mgmt',      l: 'Boshqaruv',         icon: Icons.shield, badge: badges.mgmt },
    { id: 'materials', l: 'Materiallar',       icon: Icons.folder },
    { id: 'notif',     l: 'Bildirishnomalar',  icon: Icons.bell,   badge: badges.notif },
  ];
  const allPages = [...primary, ...secondary,
                     { id: 'settings', l: 'Sozlamalar', icon: Icons.settings }];
  const current = allPages.find(p => p.id === active);

  return (
    <div className="web-root">
      <style>{webShellStyles}</style>

      {/* Sidebar (desktop) / Drawer (mobile when open) */}
      <aside className={`web-side ${drawer ? 'open' : ''}`}>
        <div className="web-side-inner">
          <div className="web-brand" onClick={() => onNav('today')}>
            <SfStar size={28} color="var(--sf-primary)" />
            <div className="web-brand-text">
              <div className="web-brand-name">StarForge<span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}> · EDU</span></div>
              <div className="web-brand-sub">Demo Akademiya · Yunusobod</div>
            </div>
            <button className="web-side-close" onClick={() => setDrawer(false)}>
              {React.cloneElement(Icons.x, { size: 18 })}
            </button>
          </div>

          <div className="web-side-section">Asosiy</div>
          {primary.map(p => (
            <NavItem key={p.id} item={p} active={active === p.id}
                     onClick={() => { onNav(p.id); setDrawer(false); }} />
          ))}

          <div className="web-side-section">Hujjatlar</div>
          {secondary.map(p => (
            <NavItem key={p.id} item={p} active={active === p.id}
                     onClick={() => { onNav(p.id); setDrawer(false); }} />
          ))}

          {/* AI token meter */}
          <div className="web-side-ai">
            <div className="web-side-ai-h">
              <SfAiBadge compact>limit</SfAiBadge>
              <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>8.6%</span>
            </div>
            <div className="web-side-ai-bar">
              <div style={{ width: '8.6%', height: '100%', background: 'var(--sf-ai)' }} />
            </div>
            <div className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)', marginTop: 4 }}>
              4 320 / 50 000 token
            </div>
          </div>

          {/* Profile card */}
          <div className="web-side-profile" onClick={() => { onNav('settings'); setDrawer(false); }}>
            <SfAvatar name="Nigora Karimova" size={36} color="var(--sf-primary)" />
            <div className="web-profile-text">
              <div className="web-profile-name">Nigora Karimova</div>
              <div className="web-profile-role">
                <span className="web-share-dot" />
                Profil ulashilmoqda
              </div>
            </div>
            {React.cloneElement(Icons.settings, { size: 16, style: { color: 'var(--sf-muted)' } })}
          </div>
        </div>
      </aside>

      {drawer && <div className="web-scrim" onClick={() => setDrawer(false)} />}

      {/* Main column */}
      <div className="web-col">
        {/* Top bar */}
        <header className="web-top">
          <button className="web-hamburger" onClick={() => setDrawer(true)}>
            {React.cloneElement(Icons.filter, { size: 20 })}
          </button>
          <div className="web-crumb">
            <SfStar size={18} color="var(--sf-primary)" />
            {React.cloneElement(Icons.chevR, { size: 12, style: { color: 'var(--sf-muted)' } })}
            <span style={{ fontSize: 14, fontWeight: 700 }}>{current?.l || 'StarForge'}</span>
          </div>
          <div className="web-search">
            {React.cloneElement(Icons.search, { size: 16, style: { color: 'var(--sf-muted)' } })}
            <span>Hammasi bo‘yicha izlash...</span>
            <span className="web-search-kbd">⌘K</span>
          </div>
          <div className="web-top-actions">
            <button className="web-top-btn" title="AI suhbat" onClick={() => onNav('ai')}>
              {React.cloneElement(Icons.ai, { size: 18 })}
            </button>
            <button className="web-top-btn" title="Bildirishnomalar" onClick={() => onNav('notif')}>
              {React.cloneElement(Icons.bell, { size: 18 })}
              <span className="web-top-dot" />
            </button>
            <div className="web-top-avatar" onClick={() => onNav('settings')}>
              <SfAvatar name="Nigora Karimova" size={32} color="var(--sf-primary)" />
            </div>
          </div>
        </header>

        <main className="web-main">{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="web-tabs">
        {primary.map(p => (
          <button key={p.id} className="web-tab" data-on={active === p.id ? '1' : '0'}
                  onClick={() => onNav(p.id)}>
            <div className="web-tab-icon-wrap">
              {active === p.id && <div className="web-tab-bg" />}
              <div className="web-tab-icon">{React.cloneElement(p.icon, { size: 20 })}</div>
              {p.badge > 0 && <span className="web-tab-badge">{p.badge}</span>}
            </div>
            <span>{p.l}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  return (
    <button className="web-nav" data-on={active ? '1' : '0'} data-urgent={item.urgent ? '1' : '0'} onClick={onClick}>
      <div className="web-nav-icon">
        {item.urgent && item.badge > 0 && <span className="web-nav-pulse" />}
        {React.cloneElement(item.icon, { size: 18 })}
      </div>
      <span className="web-nav-label">{item.l}</span>
      {item.badge > 0 && (
        <span className={`web-nav-badge ${item.urgent ? 'urgent' : ''}`}>{item.badge}</span>
      )}
    </button>
  );
}

// ─── Layout primitives reused across pages ───────────────────

function WebPageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="web-page-h">
      <div>
        {eyebrow && <div className="web-eyebrow">{eyebrow}</div>}
        <h1 className="web-title">
          {typeof title === 'string' ? title : title}
        </h1>
        {subtitle && <div className="web-page-sub">{subtitle}</div>}
      </div>
      {right && <div className="web-page-right">{right}</div>}
    </div>
  );
}

function WebStat({ v, sub, l, c, trend }) {
  return (
    <div className="web-stat">
      <div className="web-stat-row">
        <span className="sf-mono web-stat-v" style={{ color: c || 'var(--sf-ink)' }}>{v}</span>
        {sub && <span className="web-stat-sub">{sub}</span>}
        {trend && (
          <span className="web-stat-trend" style={{ color: trend.up ? 'var(--sf-success)' : 'var(--sf-danger)' }}>
            {trend.up ? '↑' : '↓'} {trend.v}
          </span>
        )}
      </div>
      <div className="web-stat-l">{l}</div>
    </div>
  );
}

function WebCard({ title, action, children, padded = true, className = '' }) {
  return (
    <div className={`web-card ${className}`}>
      {title && (
        <div className="web-card-h">
          <h3 className="web-card-t">{title}</h3>
          {action}
        </div>
      )}
      <div className={padded ? 'web-card-b' : ''}>{children}</div>
    </div>
  );
}

function WebChip({ tone = 'neutral', children, style }) {
  return <span className={`web-chip web-chip-${tone}`} style={style}>{children}</span>;
}

const webShellStyles = `
.web-root {
  display: grid;
  grid-template-columns: 264px 1fr;
  min-height: 100vh;
  background: var(--sf-bg);
  font-family: var(--sf-font-ui);
  color: var(--sf-ink);
}
* { box-sizing: border-box; }

/* ─── SIDEBAR ──────────────────────────────────────────────── */
.web-side {
  background: var(--sf-surface);
  border-right: 1px solid var(--sf-border);
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto;
}
.web-side-inner {
  padding: 18px 14px 18px;
  display: flex; flex-direction: column;
  min-height: 100%;
}
.web-side-close {
  display: none;
  background: transparent; border: none; cursor: pointer;
  margin-left: auto; color: var(--sf-muted);
}

.web-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 8px 12px;
  cursor: pointer;
}
.web-brand-text { flex: 1; min-width: 0; }
.web-brand-name {
  font-size: 15px; font-weight: 700; letter-spacing: -0.02em;
}
.web-brand-sub {
  font-size: 10.5px; color: var(--sf-muted); margin-top: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.web-side-section {
  padding: 14px 10px 6px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--sf-muted);
}

.web-nav {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; margin-bottom: 1px;
  background: transparent; border: none; cursor: pointer;
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  color: var(--sf-ink-2);
  border-radius: 10px;
  width: 100%; text-align: left;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.web-nav:hover { background: var(--sf-surface-2); color: var(--sf-ink); }
.web-nav[data-on="1"] {
  background: var(--sf-primary);
  color: #FFFCF5;
  font-weight: 700;
}
.web-nav[data-on="1"] .web-nav-icon { color: #FFFCF5; }
.web-nav-icon {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  color: var(--sf-muted);
  position: relative;
  flex-shrink: 0;
}
.web-nav-label { flex: 1; }
.web-nav-badge {
  min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 9px;
  background: var(--sf-surface-3);
  color: var(--sf-ink-2);
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.web-nav[data-on="1"] .web-nav-badge {
  background: rgba(255,252,245,0.25); color: #FFFCF5;
}
.web-nav-badge.urgent {
  background: var(--sf-danger); color: #FFFCF5;
  animation: webPulse 1.8s ease-in-out infinite;
}
.web-nav[data-urgent="1"] .web-nav-pulse {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 2px solid var(--sf-danger);
  animation: webPulseRing 1.8s ease-in-out infinite;
}
@keyframes webPulseRing { 0%, 100% { opacity: 0.45; transform: scale(1); } 50% { opacity: 0; transform: scale(1.4); } }
@keyframes webPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }

/* Sidebar AI meter */
.web-side-ai {
  margin: auto 10px 10px;
  padding: 10px;
  background: var(--sf-ai-bg);
  border: 1px solid var(--sf-ai-border);
  border-radius: 10px;
}
.web-side-ai-h { display: flex; justify-content: space-between; align-items: center; }
.web-side-ai-bar { margin-top: 6px; height: 4px; border-radius: 4px; background: rgba(255,252,245,0.5); overflow: hidden; }

/* Sidebar profile */
.web-side-profile {
  display: flex; align-items: center; gap: 10px;
  padding: 10px;
  background: var(--sf-surface-2);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.web-side-profile:hover { background: var(--sf-surface-3); }
.web-profile-text { flex: 1; min-width: 0; }
.web-profile-name { font-size: 12.5px; font-weight: 700; }
.web-profile-role {
  font-size: 10px; color: var(--sf-success); font-weight: 600;
  display: flex; align-items: center; gap: 4px; margin-top: 1px;
}
.web-share-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--sf-success);
  animation: webBreathe 1.6s ease-in-out infinite;
}
@keyframes webBreathe { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } }

/* ─── TOP BAR ──────────────────────────────────────────────── */
.web-top {
  position: sticky; top: 0; z-index: 10;
  background: var(--sf-surface);
  border-bottom: 1px solid var(--sf-border);
  padding: 12px 24px;
  display: flex; align-items: center; gap: 16px;
  height: 64px;
}
.web-hamburger {
  display: none;
  background: var(--sf-surface-2); border: none; cursor: pointer;
  width: 36px; height: 36px; border-radius: 10px;
  align-items: center; justify-content: center;
  color: var(--sf-ink-2);
}
.web-crumb {
  display: flex; align-items: center; gap: 8px;
}
.web-search {
  flex: 1; max-width: 480px; margin-left: auto;
  display: flex; align-items: center; gap: 8px;
  background: var(--sf-bg); border: 1px solid var(--sf-border);
  border-radius: 10px; padding: 8px 12px;
  color: var(--sf-muted); font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.web-search:hover { border-color: var(--sf-border-strong); }
.web-search > span:nth-child(2) { flex: 1; }
.web-search-kbd {
  font-family: var(--sf-font-mono);
  font-size: 10px; color: var(--sf-muted);
  padding: 2px 6px; border-radius: 4px;
  background: var(--sf-surface-2);
}

.web-top-actions {
  display: flex; gap: 6px; align-items: center;
}
.web-top-btn {
  width: 36px; height: 36px; border-radius: 10px;
  background: transparent; border: none; cursor: pointer;
  color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center;
  position: relative; transition: background 0.15s;
}
.web-top-btn:hover { background: var(--sf-surface-2); }
.web-top-dot {
  position: absolute; top: 8px; right: 9px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--sf-primary); border: 2px solid var(--sf-surface);
}
.web-top-avatar { cursor: pointer; padding: 2px; }

/* ─── MAIN ─────────────────────────────────────────────────── */
.web-col {
  display: flex; flex-direction: column;
  min-width: 0;
}
.web-main {
  flex: 1;
  padding: 28px 32px 80px;
  max-width: 1440px; width: 100%; margin: 0 auto;
}

/* ─── PAGE HEADERS ─────────────────────────────────────────── */
.web-page-h {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 16px; margin-bottom: 24px; padding-bottom: 14px;
  border-bottom: 1px solid var(--sf-border);
}
.web-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--sf-muted); margin-bottom: 8px;
}
.web-title {
  margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.05;
}
.web-page-sub {
  margin-top: 6px; font-size: 14px; color: var(--sf-muted);
}
.web-page-right { display: flex; gap: 8px; align-items: center; }

/* ─── STATS ─────────────────────────────────────────────────── */
.web-stat {
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: 14px;
  padding: 16px 18px;
}
.web-stat-row { display: flex; align-items: baseline; gap: 6px; }
.web-stat-v { font-size: 32px; font-weight: 700; line-height: 1; }
.web-stat-sub { font-size: 12px; color: var(--sf-muted); font-weight: 600; }
.web-stat-trend {
  margin-left: auto; font-size: 11px; font-weight: 700;
  padding: 2px 6px; border-radius: 4px;
  background: var(--sf-surface-2);
}
.web-stat-l {
  margin-top: 6px; font-size: 11.5px; color: var(--sf-muted);
  letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600;
}

/* ─── CARDS ─────────────────────────────────────────────────── */
.web-card {
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: 16px;
  overflow: hidden;
}
.web-card-h {
  padding: 14px 18px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid var(--sf-border);
}
.web-card-t { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: -0.005em; }
.web-card-b { padding: 18px; }

/* ─── CHIPS ─────────────────────────────────────────────────── */
.web-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 999px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.04em; text-transform: uppercase;
  background: var(--sf-surface-2);
  color: var(--sf-ink-2);
}
.web-chip-primary { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
.web-chip-accent  { background: var(--sf-accent-soft);  color: var(--sf-accent-ink); }
.web-chip-success { background: var(--sf-success-soft); color: var(--sf-success); }
.web-chip-warn    { background: var(--sf-warn-soft);    color: var(--sf-warn); }
.web-chip-danger  { background: var(--sf-danger-soft);  color: var(--sf-danger); }
.web-chip-ink     { background: var(--sf-ink);          color: var(--sf-bg); }
.web-chip-ai      { background: var(--sf-ai-bg); color: var(--sf-ai); border: 1px solid var(--sf-ai-border); }

/* ─── MOBILE TAB BAR ───────────────────────────────────────── */
.web-tabs { display: none; }
.web-scrim { display: none; }

/* ─── RESPONSIVE ───────────────────────────────────────────── */
@media (max-width: 1023px) {
  .web-root { grid-template-columns: 72px 1fr; }
  .web-side-inner { padding: 14px 8px; }
  .web-brand-text, .web-side-section,
  .web-nav-label, .web-nav-badge,
  .web-side-ai, .web-profile-text { display: none; }
  .web-nav { justify-content: center; padding: 10px; }
  .web-side-profile { padding: 8px; justify-content: center; }
  .web-search { display: none; }
  .web-crumb span { font-size: 18px; }
}

@media (max-width: 767px) {
  .web-root { grid-template-columns: 1fr; }
  .web-side {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 280px; z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .web-side.open { transform: translateX(0); }
  .web-side-inner { padding: 18px 14px; }
  .web-brand-text, .web-side-section,
  .web-nav-label, .web-nav-badge,
  .web-side-ai, .web-profile-text { display: block; }
  .web-nav { justify-content: flex-start; padding: 10px 12px; }
  .web-side-profile { padding: 10px; justify-content: flex-start; }
  .web-side-close { display: flex; }
  .web-scrim {
    display: block; position: fixed; inset: 0;
    background: rgba(20, 16, 11, 0.5); z-index: 40;
    animation: webFade 0.2s;
  }
  @keyframes webFade { from { opacity: 0 } to { opacity: 1 } }
  .web-hamburger { display: flex; }
  .web-top { padding: 10px 14px; height: 56px; }
  .web-main { padding: 18px 14px 80px; }
  .web-title { font-size: 26px; }
  .web-tabs {
    display: flex; position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--sf-surface); border-top: 1px solid var(--sf-border);
    padding: 8px 4px 14px; z-index: 30;
  }
  .web-tab {
    flex: 1; background: transparent; border: none; cursor: pointer;
    font-family: inherit; padding: 4px 0;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    color: var(--sf-muted); font-size: 10px; font-weight: 500;
  }
  .web-tab[data-on="1"] { color: var(--sf-primary); font-weight: 700; }
  .web-tab-icon-wrap { position: relative; }
  .web-tab-bg {
    position: absolute; inset: -6px; border-radius: 12px;
    background: var(--sf-primary-soft);
  }
  .web-tab-icon { position: relative; }
  .web-tab-badge {
    position: absolute; top: -8px; right: -8px;
    min-width: 16px; padding: 0 4px; border-radius: 8px;
    background: var(--sf-primary); color: #FFFCF5;
    font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
}
`;

Object.assign(window, {
  WebShell, WebPageHeader, WebStat, WebCard, WebChip, NavItem,
});
