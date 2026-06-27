// sf-control.jsx — Shared control engine for all StarForge apps
// Provides: live theming (10 palettes), dark mode, 5 nav layouts, density,
// 5 background patterns, font pairing, REORDERABLE nav, and a smooth toast system.
// State persists to localStorage per appId. Requires React + (optional) Icons/SfStar.

const SF_PALETTES = [
  { id: 'saroy',     n: 'Saroy',     sub: 'Terracotta', c: ['#B85535', '#D89A2E', '#FBF6EC'] },
  { id: 'marvarid',  n: 'Marvarid',  sub: 'Pearl',      c: ['#1F6B66', '#C4892F', '#F2F1ED'] },
  { id: 'samarqand', n: 'Samarqand', sub: 'Indigo',     c: ['#2A3D8F', '#D8A22A', '#F4F1E8'] },
  { id: 'daryo',     n: 'Daryo',     sub: 'Sage',       c: ['#4F6A3A', '#BA8C2C', '#F1EFE6'] },
  { id: 'shafaq',    n: 'Shafaq',    sub: 'Sunset',     c: ['#C2410C', '#D6608A', '#FBF1EC'] },
  { id: 'zumrad',    n: 'Zumrad',    sub: 'Emerald',    c: ['#0E7C5A', '#C08A2E', '#EEF4EF'] },
  { id: 'lola',      n: 'Lola',      sub: 'Tulip',      c: ['#B3122F', '#C28A1E', '#FAF1EF'] },
  { id: 'tong',      n: 'Tong',      sub: 'Dawn',       c: ['#2563A8', '#D98A4E', '#EEF2F7'] },
  { id: 'qahrabo',   n: 'Qahrabo',   sub: 'Amber',      c: ['#B8791C', '#3F7A6A', '#F8F2E8'] },
  { id: 'siyoh',     n: 'Siyoh',     sub: 'Ink mono',   c: ['#2B2A26', '#9A7B3F', '#F2F1EE'] },
];
const SF_LAYOUTS = [
  { id: 'sidebar', n: 'Sidebar',  d: 'Klassik chap panel' },
  { id: 'rail',    n: 'Rail',     d: 'Ixcham ikonka' },
  { id: 'topbar',  n: 'Top nav',  d: 'Yuqori panel' },
  { id: 'dock',    n: 'Dock',     d: 'Suzuvchi dok' },
  { id: 'zen',     n: 'Zen',      d: 'Minimal · yashirin' },
];
const SF_DENSITIES = [['compact', 'Ixcham'], ['cozy', 'O‘rta'], ['comfortable', 'Bo‘sh']];
const SF_PATTERNS = [['none', 'Yo‘q'], ['dots', 'Nuqta'], ['grid', 'To‘r'], ['tile', 'Naqsh'], ['topo', 'Chiziq']];
const SF_FONTS = [
  { id: 'manrope', n: 'Manrope', v: "'Manrope', system-ui, sans-serif" },
  { id: 'inter', n: 'Inter', v: "'Inter', 'Manrope', system-ui, sans-serif" },
  { id: 'mono', n: 'Mono mix', v: "'Manrope', system-ui, sans-serif" },
];

const SfCtl = React.createContext(null);
const useControl = () => React.useContext(SfCtl);

function sfLoad(appId, defaults) {
  try { const r = JSON.parse(localStorage.getItem('sfctl_' + appId) || '{}'); return { ...defaults, ...r }; }
  catch (e) { return defaults; }
}

function SfControlProvider({ appId, defaultNav, defaults, features, children }) {
  const feat = { palette: true, dark: true, layout: true, density: true, pattern: true, font: true, reorder: true, ...(features || {}) };
  const base = { palette: 'saroy', dark: false, layout: 'sidebar', density: 'cozy', pattern: 'dots', font: 'manrope', navOrder: defaultNav.map(n => n.id), ...defaults };
  const [st, setSt] = React.useState(() => sfLoad(appId, base));
  const [panel, setPanel] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const tid = React.useRef(0);

  React.useEffect(() => { try { localStorage.setItem('sfctl_' + appId, JSON.stringify(st)); } catch (e) {} }, [st]);
  React.useEffect(() => {
    document.body.setAttribute('data-palette', st.palette);
    document.body.setAttribute('data-theme', st.dark ? 'dark' : 'light');
    document.body.setAttribute('data-density', st.density);
    document.documentElement.style.setProperty('--sf-font-ui', SF_FONTS.find(f => f.id === st.font)?.v || SF_FONTS[0].v);
  }, [st.palette, st.dark, st.density, st.font]);

  const set = (k, v) => setSt(s => ({ ...s, [k]: v }));
  const toast = (msg, opts = {}) => {
    const id = ++tid.current;
    const t = { id, msg, tone: opts.tone || 'default', icon: opts.icon, sub: opts.sub, leaving: false };
    setToasts(x => [...x, t]);
    const dur = opts.duration || 3200;
    setTimeout(() => setToasts(x => x.map(z => z.id === id ? { ...z, leaving: true } : z)), dur);
    setTimeout(() => setToasts(x => x.filter(z => z.id !== id)), dur + 360);
  };
  React.useEffect(() => { window.sfToast = toast; }, []);

  // ordered nav
  const navMap = Object.fromEntries(defaultNav.map(n => [n.id, n]));
  const orderedNav = (st.navOrder || []).map(id => navMap[id]).filter(Boolean)
    .concat(defaultNav.filter(n => !(st.navOrder || []).includes(n.id)));

  const moveNav = (id, dir) => setSt(s => {
    const arr = orderedNav.map(n => n.id);
    const i = arr.indexOf(id), j = i + dir;
    if (j < 0 || j >= arr.length) return s;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...s, navOrder: arr };
  });
  const resetAll = () => { setSt(base); toast('Sozlamalar tiklandi', { tone: 'success' }); };

  return (
    <SfCtl.Provider value={{ st, set, toast, panel, setPanel, orderedNav, moveNav, resetAll, defaultNav, feat }}>
      <style>{sfControlStyles}</style>
      {children}
      <SfToastHost toasts={toasts} />
      <SfControlPanel />
    </SfCtl.Provider>
  );
}

// ── Toasts ──────────────────────────────────────────────────
function SfToastHost({ toasts }) {
  const tones = {
    default: { ic: (Icons && Icons.brand), c: 'var(--sf-ink)' },
    success: { ic: (Icons && Icons.check), c: 'var(--sf-success)' },
    info: { ic: (Icons && Icons.bell), c: 'var(--sf-primary)' },
    warn: { ic: (Icons && Icons.flag), c: 'var(--sf-warn)' },
    danger: { ic: (Icons && Icons.x), c: 'var(--sf-danger)' },
  };
  return (
    <div className="sft-host">
      {toasts.map(t => {
        const tn = tones[t.tone] || tones.default;
        return (
          <div key={t.id} className={'sft' + (t.leaving ? ' leaving' : '')}>
            <span className="sft-ic" style={{ background: tn.c + '22', color: tn.c }}>
              {(t.icon || tn.ic) && React.cloneElement(t.icon || tn.ic, { size: 16 })}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sft-msg">{t.msg}</div>
              {t.sub && <div className="sft-sub">{t.sub}</div>}
            </div>
            <span className="sft-bar" style={{ background: tn.c }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Control panel (drawer) ──────────────────────────────────
function SfControlPanel() {
  const ctl = useControl();
  if (!ctl) return null;
  const { st, set, panel, setPanel, orderedNav, moveNav, resetAll, feat } = ctl;
  return (
    <>
      <button className="sfcp-fab" onClick={() => setPanel(!panel)} title="Sozlash">
        {SfStar ? <SfStar size={22} color="#FFFCF5" /> : '✦'}
      </button>
      <div className={'sfcp-scrim' + (panel ? ' on' : '')} onClick={() => setPanel(false)} />
      <aside className={'sfcp' + (panel ? ' on' : '')}>
        <div className="sfcp-head">
          <div>
            <div className="sfcp-title">Ko‘rinishni sozlash</div>
            <div className="sfcp-sub">Rang, layout, tartib — jonli</div>
          </div>
          <button className="sfcp-x" onClick={() => setPanel(false)}>{Icons && React.cloneElement(Icons.x, { size: 18 })}</button>
        </div>
        <div className="sfcp-body">
          <div className="sfcp-sec">Rang mavzusi · 10</div>
          <div className="sfcp-palettes">
            {SF_PALETTES.map(p => (
              <button key={p.id} className={'sfcp-pal' + (st.palette === p.id ? ' on' : '')} onClick={() => set('palette', p.id)}>
                <span className="sfcp-pal-sw">{p.c.map((c, i) => <i key={i} style={{ background: c }} />)}</span>
                <span className="sfcp-pal-n">{p.n}</span>
              </button>
            ))}
          </div>

          <div className="sfcp-sec">Rejim</div>
          <div className="sfcp-seg">
            <button className={!st.dark ? 'on' : ''} onClick={() => set('dark', false)}>☀ Yorug‘</button>
            <button className={st.dark ? 'on' : ''} onClick={() => set('dark', true)}>☾ Qorong‘i</button>
          </div>

          {feat.layout && <><div className="sfcp-sec">Layout · 5</div>
          <div className="sfcp-layouts">
            {SF_LAYOUTS.map(l => (
              <button key={l.id} className={'sfcp-lay' + (st.layout === l.id ? ' on' : '')} onClick={() => set('layout', l.id)}>
                <span className={'sfcp-lay-mini lay-' + l.id}><i /><i /><i /></span>
                <span className="sfcp-lay-n">{l.n}</span>
                <span className="sfcp-lay-d">{l.d}</span>
              </button>
            ))}
          </div></>}

          <div className="sfcp-sec">Zichlik</div>
          <div className="sfcp-seg">
            {SF_DENSITIES.map(([id, n]) => <button key={id} className={st.density === id ? 'on' : ''} onClick={() => set('density', id)}>{n}</button>)}
          </div>

          <div className="sfcp-sec">Fon naqshi · 5</div>
          <div className="sfcp-seg wrap">
            {SF_PATTERNS.map(([id, n]) => <button key={id} className={st.pattern === id ? 'on' : ''} onClick={() => set('pattern', id)}>{n}</button>)}
          </div>

          <div className="sfcp-sec">Shrift</div>
          <div className="sfcp-seg">
            {SF_FONTS.map(f => <button key={f.id} className={st.font === f.id ? 'on' : ''} onClick={() => set('font', f.id)} style={{ fontFamily: f.v }}>{f.n}</button>)}
          </div>

          {feat.reorder && <><div className="sfcp-sec">Menyu tartibi · suring yoki ↑↓</div>
          <div className="sfcp-nav">
            {orderedNav.filter(n => n.id !== 'settings').map((n, i, arr) => (
              <div key={n.id} className="sfcp-navrow" draggable
                   onDragStart={e => { e.dataTransfer.setData('id', n.id); }}
                   onDragOver={e => e.preventDefault()}
                   onDrop={e => { const from = e.dataTransfer.getData('id'); const fi = arr.findIndex(x => x.id === from); const diff = i - fi; if (diff) moveNav(from, diff > 0 ? 1 : -1); }}>
                <span className="sfcp-grip">⠿</span>
                {n.icon && <span className="sfcp-navrow-ic">{React.cloneElement(n.icon, { size: 15 })}</span>}
                <span className="sfcp-navrow-l">{n.l}</span>
                <span className="sfcp-navrow-btns">
                  <button onClick={() => moveNav(n.id, -1)} disabled={i === 0}>↑</button>
                  <button onClick={() => moveNav(n.id, 1)} disabled={i === arr.length - 1}>↓</button>
                </span>
              </div>
            ))}
          </div></>}
        </div>
        <div className="sfcp-foot">
          <button className="sfcp-reset" onClick={resetAll}>Asliga qaytarish</button>
          <button className="sfcp-done" onClick={() => { setPanel(false); window.sfToast && window.sfToast('Saqlandi', { tone: 'success' }); }}>Tayyor</button>
        </div>
      </aside>
    </>
  );
}

// pattern background helper for app roots
function sfPatternBg(pattern) {
  if (pattern === 'dots') return { backgroundImage: 'radial-gradient(circle at 1px 1px, var(--sf-border-strong) 1px, transparent 0)', backgroundSize: '22px 22px' };
  if (pattern === 'grid') return { backgroundImage: 'linear-gradient(var(--sf-border) 1px, transparent 1px), linear-gradient(90deg, var(--sf-border) 1px, transparent 1px)', backgroundSize: '28px 28px' };
  if (pattern === 'tile') return { backgroundImage: 'repeating-linear-gradient(45deg, var(--sf-border) 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, var(--sf-border) 0 1px, transparent 1px 14px)' };
  if (pattern === 'topo') return { backgroundImage: 'repeating-linear-gradient(0deg, var(--sf-border) 0 1px, transparent 1px 18px)' };
  return {};
}

const sfControlStyles = `
:root { --sf-dens: 1; }
body[data-density="compact"] { --sf-dens: 0.82; }
body[data-density="comfortable"] { --sf-dens: 1.16; }

/* Toasts */
.sft-host { position: fixed; bottom: 20px; right: 20px; z-index: 2147483600; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.sft { pointer-events: auto; display: flex; align-items: center; gap: 11px; min-width: 270px; max-width: 380px; padding: 13px 15px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; box-shadow: 0 12px 40px rgba(54,30,14,0.18), 0 3px 10px rgba(54,30,14,0.08); position: relative; overflow: hidden; transform: translateX(0); animation: sftIn 0.42s cubic-bezier(0.22, 1, 0.36, 1); }
.sft.leaving { animation: sftOut 0.34s cubic-bezier(0.5, 0, 0.75, 0) forwards; }
@keyframes sftIn { from { transform: translateX(120%) scale(0.92); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
@keyframes sftOut { to { transform: translateX(120%) scale(0.92); opacity: 0; } }
.sft-ic { width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sft-msg { font-size: 13px; font-weight: 700; color: var(--sf-ink); font-family: var(--sf-font-ui); }
.sft-sub { font-size: 11px; color: var(--sf-muted); margin-top: 1px; font-family: var(--sf-font-ui); }
.sft-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }

/* FAB */
.sfcp-fab { position: fixed; right: 20px; bottom: 20px; z-index: 2147483400; width: 50px; height: 50px; border-radius: 16px; border: none; cursor: pointer; background: var(--sf-primary); box-shadow: 0 8px 24px rgba(54,30,14,0.28); display: flex; align-items: center; justify-content: center; transition: transform 0.2s cubic-bezier(0.22,1,0.36,1); }
.sfcp-fab:hover { transform: scale(1.08) rotate(8deg); }
.sfcp-fab:active { transform: scale(0.95); }

.sfcp-scrim { position: fixed; inset: 0; background: rgba(20,16,11,0.4); z-index: 2147483450; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
.sfcp-scrim.on { opacity: 1; pointer-events: auto; }
.sfcp { position: fixed; top: 0; right: 0; bottom: 0; width: 340px; max-width: 90vw; background: var(--sf-surface); border-left: 1px solid var(--sf-border); z-index: 2147483500; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); display: flex; flex-direction: column; font-family: var(--sf-font-ui); box-shadow: -16px 0 50px rgba(54,30,14,0.16); }
.sfcp.on { transform: translateX(0); }
.sfcp-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 18px 18px 14px; border-bottom: 1px solid var(--sf-border); }
.sfcp-title { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: var(--sf-ink); }
.sfcp-sub { font-size: 11.5px; color: var(--sf-muted); margin-top: 2px; }
.sfcp-x { background: var(--sf-surface-2); border: none; width: 32px; height: 32px; border-radius: 9px; cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; }
.sfcp-body { flex: 1; overflow-y: auto; padding: 16px 18px 20px; }
.sfcp-body::-webkit-scrollbar { width: 0; }
.sfcp-sec { font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-muted); margin: 18px 0 9px; }
.sfcp-sec:first-child { margin-top: 0; }
.sfcp-palettes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sfcp-pal { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 11px; background: var(--sf-surface); border: 1.5px solid var(--sf-border); cursor: pointer; font-family: inherit; transition: all 0.15s; }
.sfcp-pal:hover { border-color: var(--sf-border-strong); }
.sfcp-pal.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
.sfcp-pal-sw { display: flex; flex-shrink: 0; }
.sfcp-pal-sw i { width: 14px; height: 22px; }
.sfcp-pal-sw i:first-child { border-radius: 5px 0 0 5px; }
.sfcp-pal-sw i:last-child { border-radius: 0 5px 5px 0; }
.sfcp-pal-n { font-size: 12px; font-weight: 700; color: var(--sf-ink); }
.sfcp-seg { display: flex; gap: 4px; padding: 4px; background: var(--sf-surface-2); border-radius: 11px; }
.sfcp-seg.wrap { flex-wrap: wrap; }
.sfcp-seg button { flex: 1; min-width: 56px; padding: 8px 6px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-muted); transition: all 0.15s; }
.sfcp-seg button.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }
.sfcp-layouts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sfcp-lay { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 10px; border-radius: 11px; background: var(--sf-surface); border: 1.5px solid var(--sf-border); cursor: pointer; font-family: inherit; transition: all 0.15s; }
.sfcp-lay.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
.sfcp-lay-mini { width: 100%; height: 26px; border-radius: 5px; background: var(--sf-surface-2); position: relative; display: flex; overflow: hidden; margin-bottom: 3px; }
.sfcp-lay-mini i { background: var(--sf-primary); opacity: 0.5; }
.lay-sidebar i:first-child { width: 22%; height: 100%; opacity: 0.7; } .lay-sidebar i:nth-child(2),.lay-sidebar i:nth-child(3){ display:none; }
.lay-rail i:first-child { width: 10%; height: 100%; opacity: 0.7; } .lay-rail i:nth-child(2),.lay-rail i:nth-child(3){ display:none; }
.lay-topbar { flex-direction: column; } .lay-topbar i:first-child { width: 100%; height: 28%; opacity: 0.7; } .lay-topbar i:nth-child(2),.lay-topbar i:nth-child(3){ display:none; }
.lay-dock i:first-child { position: absolute; left: 50%; transform: translateX(-50%); bottom: 2px; width: 50%; height: 22%; border-radius: 6px; opacity: 0.8; } .lay-dock i:nth-child(2),.lay-dock i:nth-child(3){ display:none; }
.lay-zen i { display: none; }
.sfcp-lay-n { font-size: 12px; font-weight: 700; color: var(--sf-ink); }
.sfcp-lay-d { font-size: 9.5px; color: var(--sf-muted); }
.sfcp-nav { display: flex; flex-direction: column; gap: 5px; }
.sfcp-navrow { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 9px; background: var(--sf-surface); border: 1px solid var(--sf-border); cursor: grab; }
.sfcp-navrow:active { cursor: grabbing; }
.sfcp-grip { color: var(--sf-muted-2); font-size: 13px; }
.sfcp-navrow-ic { color: var(--sf-muted); display: flex; }
.sfcp-navrow-l { flex: 1; font-size: 12.5px; font-weight: 600; color: var(--sf-ink); }
.sfcp-navrow-btns { display: flex; gap: 3px; }
.sfcp-navrow-btns button { width: 24px; height: 24px; border-radius: 7px; border: 1px solid var(--sf-border); background: var(--sf-surface-2); cursor: pointer; font-size: 11px; color: var(--sf-ink-2); }
.sfcp-navrow-btns button:disabled { opacity: 0.3; cursor: default; }
.sfcp-foot { display: flex; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--sf-border); }
.sfcp-reset { flex: 1; padding: 11px; border-radius: 10px; border: 1px solid var(--sf-border-strong); background: transparent; cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600; color: var(--sf-ink-2); }
.sfcp-done { flex: 1; padding: 11px; border-radius: 10px; border: none; background: var(--sf-primary); color: #FFFCF5; cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 700; }
`;

Object.assign(window, { SF_PALETTES, SF_LAYOUTS, SF_DENSITIES, SF_PATTERNS, SF_FONTS, SfControlProvider, useControl, sfPatternBg });
