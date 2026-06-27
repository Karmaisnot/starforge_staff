// admin-common.jsx — Shared primitives for CEO/Manager/Audit consoles
// Currency context, dense tables, filter bars, SVG charts, drawers, KPI tiles.

// ── Currency ───────────────────────────────────────────────────
const SF_RATES = { UZS: 1, USD: 1 / 12650, EUR: 1 / 13700, RUB: 1 / 138 };
const SF_SYM = { UZS: "so'm", USD: '$', EUR: '€', RUB: '₽' };
const CurrencyCtx = React.createContext({ cur: 'UZS', setCur: () => {} });

function fmtMoney(uzs, cur) {
  const v = uzs * SF_RATES[cur];
  if (cur === 'UZS') {
    if (Math.abs(uzs) >= 1e9) return (uzs / 1e9).toFixed(2) + ' mlrd';
    if (Math.abs(uzs) >= 1e6) return (uzs / 1e6).toFixed(1) + ' mln';
    if (Math.abs(uzs) >= 1e3) return Math.round(uzs / 1e3) + 'k';
    return Math.round(uzs).toLocaleString('ru-RU');
  }
  const sym = SF_SYM[cur];
  if (Math.abs(v) >= 1e6) return sym + (v / 1e6).toFixed(2) + 'M';
  if (Math.abs(v) >= 1e3) return sym + (v / 1e3).toFixed(1) + 'k';
  return sym + v.toFixed(cur === 'RUB' ? 0 : 1);
}
function Money({ uzs, className, style }) {
  const { cur } = React.useContext(CurrencyCtx);
  return <span className={'sf-mono ' + (className || '')} style={style}>{fmtMoney(uzs, cur)}{cur === 'UZS' ? '' : ''}</span>;
}

// ── KPI tile ───────────────────────────────────────────────────
function Kpi({ label, value, money, spark, trend, accent, icon, sub }) {
  const { cur } = React.useContext(CurrencyCtx);
  const display = money != null ? fmtMoney(money, cur) : value;
  return (
    <div className="ad-kpi">
      <div className="ad-kpi-top">
        <span className="ad-kpi-label">{label}</span>
        {icon && <span className="ad-kpi-icon" style={{ color: accent || 'var(--sf-muted)' }}>{React.cloneElement(icon, { size: 15 })}</span>}
      </div>
      <div className="ad-kpi-row">
        <span className="sf-mono ad-kpi-v" style={{ color: accent || 'var(--sf-ink)' }}>{display}</span>
        {trend && (
          <span className="ad-kpi-trend" style={{ color: trend.up ? 'var(--sf-success)' : 'var(--sf-danger)' }}>
            {trend.up ? '↑' : '↓'} {trend.v}
          </span>
        )}
      </div>
      {sub && <div className="ad-kpi-sub">{sub}</div>}
      {spark && <Sparkline data={spark} color={accent || 'var(--sf-primary)'} />}
    </div>
  );
}

// ── Charts (pure SVG) ──────────────────────────────────────────
function Sparkline({ data, color = 'var(--sf-primary)', h = 32, fill = true }) {
  const w = 200, max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * w, h - ((d - min) / rng) * (h - 4) - 2]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = 'sg' + Math.random().toString(36).slice(2, 7);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="ad-spark" preserveAspectRatio="none">
      {fill && <>
        <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient></defs>
        <path d={area} fill={`url(#${gid})`} />
      </>}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AreaChart({ data, labels, color = 'var(--sf-primary)', h = 200, money }) {
  const { cur } = React.useContext(CurrencyCtx);
  const w = 600, pad = 8;
  const max = Math.max(...data) * 1.1, min = 0, rng = max - min || 1;
  const pts = data.map((d, i) => [pad + (i / (data.length - 1)) * (w - pad * 2), h - 24 - ((d - min) / rng) * (h - 40)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length - 1][0]} ${h - 24} L${pts[0][0]} ${h - 24} Z`;
  const gid = 'ac' + Math.random().toString(36).slice(2, 7);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="ad-areachart" preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.28" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      {[0.25, 0.5, 0.75].map(g => (
        <line key={g} x1={pad} y1={(h - 24) * g + 4} x2={w - pad} y2={(h - 24) * g + 4}
              stroke="var(--sf-border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--sf-surface)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
      {labels && labels.map((l, i) => (
        <text key={i} x={pts[i][0]} y={h - 6} fontSize="11" fill="var(--sf-muted)" textAnchor="middle" fontFamily="var(--sf-font-mono)">{l}</text>
      ))}
    </svg>
  );
}

function BarChart({ series, labels, h = 200, colors = ['var(--sf-primary)', 'var(--sf-accent)'] }) {
  const w = 600, pad = 8, n = labels.length;
  const groups = series.length;
  const all = series.flat();
  const max = Math.max(...all) * 1.1 || 1;
  const slot = (w - pad * 2) / n;
  const bw = Math.min(slot * 0.6 / groups, 26);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="ad-barchart" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map(g => (
        <line key={g} x1={pad} y1={(h - 24) * (1 - g) + 4} x2={w - pad} y2={(h - 24) * (1 - g) + 4}
              stroke="var(--sf-border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      ))}
      {labels.map((l, i) => {
        const cx = pad + slot * i + slot / 2;
        return (
          <g key={i}>
            {series.map((s, j) => {
              const bh = (s[i] / max) * (h - 32);
              const x = cx - (bw * groups) / 2 + j * bw;
              return <rect key={j} x={x} y={h - 24 - bh} width={bw - 2} height={bh} rx="3" fill={colors[j]} />;
            })}
            <text x={cx} y={h - 6} fontSize="11" fill="var(--sf-muted)" textAnchor="middle" fontFamily="var(--sf-font-mono)">{l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Donut({ segments, size = 140, thickness = 18, center }) {
  const r = (size - thickness) / 2, c = size / 2, circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.v, 0) || 1;
  let off = 0;
  return (
    <div className="ad-donut" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--sf-surface-2)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.v / total) * circ;
          const el = <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.c} strokeWidth={thickness}
            strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-off}
            transform={`rotate(-90 ${c} ${c})`} strokeLinecap="butt" />;
          off += len;
          return el;
        })}
      </svg>
      {center && <div className="ad-donut-c">{center}</div>}
    </div>
  );
}

function HBars({ rows, max, money }) {
  const { cur } = React.useContext(CurrencyCtx);
  const mx = max || Math.max(...rows.map(r => r.v)) || 1;
  return (
    <div className="ad-hbars">
      {rows.map((r, i) => (
        <div key={i} className="ad-hbar">
          <span className="ad-hbar-rank">{i + 1}</span>
          {r.avatar && <SfAvatar name={r.label} size={24} />}
          {r.mark && <div className="ad-hbar-mark" style={{ background: r.color || 'var(--sf-primary)' }}><SfStar size={12} color="#FFFCF5" /></div>}
          <span className="ad-hbar-label">{r.label}</span>
          <div className="ad-hbar-track">
            <div className="ad-hbar-fill" style={{ width: `${(r.v / mx) * 100}%`, background: r.color || 'var(--sf-primary)' }} />
          </div>
          <span className="ad-hbar-v sf-mono">{money ? fmtMoney(r.v, cur) : (r.display || r.v)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Dense table ────────────────────────────────────────────────
function Table({ cols, children, onRow }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead><tr>{cols.map((c, i) => (
          <th key={i} style={{ textAlign: c.align || 'left', width: c.w }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {c.label}{c.sort && React.cloneElement(Icons.chevD, { size: 11, style: { opacity: 0.5 } })}
            </span>
          </th>
        ))}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function FilterBar({ chips, onSearch, searchPlaceholder, right }) {
  return (
    <div className="ad-filterbar">
      <div className="ad-search">
        {React.cloneElement(Icons.search, { size: 15, style: { color: 'var(--sf-muted)' } })}
        <input placeholder={searchPlaceholder || 'Izlash...'} readOnly />
      </div>
      <div className="ad-filter-chips">
        {chips && chips.map((c, i) => (
          <button key={i} className={'ad-fchip' + (c.on ? ' on' : '')}>
            {c.icon && React.cloneElement(c.icon, { size: 12 })}
            {c.l}{c.n != null && <span className="ad-fchip-n">{c.n}</span>}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// ── Status pill, segment, mini progress ───────────────────────
function Pill({ tone = 'neutral', children, dot }) {
  return <span className={'ad-pill ad-pill-' + tone}>{dot && <span className="ad-pill-dot" />}{children}</span>;
}
function Bar({ pct, color = 'var(--sf-primary)', h = 6 }) {
  return <div className="ad-bar" style={{ height: h }}><div style={{ width: `${pct}%`, background: color }} /></div>;
}
function Avatar2({ name, size }) { return <SfAvatar name={name} size={size} />; }

// ── Section header ─────────────────────────────────────────────
function SecH({ children, action }) {
  return <div className="ad-sech"><h3>{children}</h3>{action}</div>;
}

const adminCommonStyles = `
.ad-kpi { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; padding: 14px 16px; min-width: 0; }
.ad-kpi-top { display: flex; justify-content: space-between; align-items: center; }
.ad-kpi-label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sf-muted); }
.ad-kpi-row { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
.ad-kpi-v { font-size: 26px; font-weight: 700; line-height: 1; letter-spacing: -0.01em; }
.ad-kpi-trend { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 5px; background: var(--sf-surface-2); }
.ad-kpi-sub { margin-top: 5px; font-size: 11px; color: var(--sf-muted); }
.ad-spark { width: 100%; height: 32px; margin-top: 8px; display: block; }
.ad-areachart, .ad-barchart { width: 100%; display: block; }

.ad-donut { position: relative; }
.ad-donut svg { width: 100%; height: 100%; }
.ad-donut-c { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }

.ad-hbars { display: flex; flex-direction: column; gap: 10px; }
.ad-hbar { display: flex; align-items: center; gap: 10px; }
.ad-hbar-rank { width: 16px; font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-muted); text-align: center; }
.ad-hbar-mark { width: 24px; height: 24px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-hbar-label { font-size: 12.5px; font-weight: 600; min-width: 96px; max-width: 96px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ad-hbar-track { flex: 1; height: 8px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
.ad-hbar-fill { height: 100%; border-radius: 4px; }
.ad-hbar-v { font-size: 12px; font-weight: 700; min-width: 56px; text-align: right; }

.ad-table-wrap { overflow-x: auto; }
.ad-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ad-table th { padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-muted); border-bottom: 1px solid var(--sf-border); white-space: nowrap; position: sticky; top: 0; background: var(--sf-surface); z-index: 1; }
.ad-table td { padding: 11px 14px; border-bottom: 1px solid var(--sf-border); vertical-align: middle; }
.ad-table tbody tr { transition: background 0.1s; cursor: pointer; }
.ad-table tbody tr:hover { background: var(--sf-surface-2); }
.ad-table tbody tr:last-child td { border-bottom: none; }

.ad-filterbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.ad-search { display: flex; align-items: center; gap: 8px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 10px; padding: 8px 12px; min-width: 220px; }
.ad-search input { border: none; background: transparent; outline: none; font-family: inherit; font-size: 13px; color: var(--sf-ink); width: 100%; }
.ad-filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.ad-fchip { display: inline-flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 999px; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-muted); background: transparent; border: 1px solid var(--sf-border); cursor: pointer; white-space: nowrap; transition: all 0.12s; }
.ad-fchip:hover { color: var(--sf-ink); border-color: var(--sf-border-strong); }
.ad-fchip.on { background: var(--sf-ink); color: var(--sf-bg); border-color: transparent; }
.ad-fchip-n { font-family: var(--sf-font-mono); font-size: 10px; opacity: 0.7; font-weight: 700; }

.ad-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; background: var(--sf-surface-2); color: var(--sf-ink-2); }
.ad-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ad-pill-primary { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
.ad-pill-success { background: var(--sf-success-soft); color: var(--sf-success); }
.ad-pill-warn { background: var(--sf-warn-soft); color: var(--sf-warn); }
.ad-pill-danger { background: var(--sf-danger-soft); color: var(--sf-danger); }
.ad-pill-accent { background: var(--sf-accent-soft); color: var(--sf-accent-ink); }
.ad-pill-ink { background: var(--sf-ink); color: var(--sf-bg); }
.ad-pill-ai { background: var(--sf-ai-bg); color: var(--sf-ai); border: 1px solid var(--sf-ai-border); }

.ad-bar { width: 100%; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
.ad-bar > div { height: 100%; border-radius: 4px; }

.ad-sech { display: flex; justify-content: space-between; align-items: center; margin: 0 0 12px; }
.ad-sech h3 { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
`;

Object.assign(window, {
  CurrencyCtx, SF_RATES, SF_SYM, fmtMoney, Money, Kpi,
  Sparkline, AreaChart, BarChart, Donut, HBars,
  Table, FilterBar, Pill, Bar, SecH, adminCommonStyles,
});
