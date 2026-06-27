// web-cohorts.jsx — Cohorts page (table + detail panel)

function CohortsPage({ onNav }) {
  const [selected, setSelected] = React.useState(0);
  const cohorts = [
    { n: '9-B Algebra', l: 'Daraja II', cnt: 24, att: 94, up: 18, down: 4, next: 'Bugun · 09:00', color: 'var(--sf-primary)' },
    { n: 'Algebra Mid', l: 'Daraja II', cnt: 21, att: 96, up: 14, down: 0, next: 'Bugun · 10:00', color: 'var(--sf-primary)' },
    { n: '10-V Geometriya', l: 'Daraja III', cnt: 19, att: 88, up: 9, down: 3, next: 'Bugun · 11:30', color: 'var(--sf-accent)' },
  ];
  const cur = cohorts[selected];

  return (
    <>
      <WebPageHeader
        title="Guruhlar"
        subtitle="3 ta faol · 58 o‘quvchi · 2 fan"
        right={
          <>
            <button className="web-btn web-btn-soft">{React.cloneElement(Icons.filter, { size: 14 })} Filtr</button>
            <button className="web-btn web-btn-primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi guruh</button>
          </>
        }
      />

      <div className="web-cohorts-layout">
        {/* Table */}
        <WebCard padded={false}>
          <div className="web-table-h">
            <div>Guruh</div>
            <div>Fan</div>
            <div style={{ textAlign: 'right' }}>O‘quvchi</div>
            <div style={{ textAlign: 'right' }}>Davomat</div>
            <div style={{ textAlign: 'right' }}>Kartalar</div>
            <div>Keyingi</div>
          </div>
          {cohorts.map((c, i) => (
            <div key={i} className={`web-table-row ${selected === i ? 'on' : ''}`}
                 onClick={() => setSelected(i)}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="web-cohort-mark" style={{ background: c.color }}>
                  <SfStar size={16} color="#FFFCF5" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{c.n}</span>
              </div>
              <div style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{c.l}</div>
              <div className="sf-mono" style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{c.cnt}</div>
              <div style={{ textAlign: 'right' }}>
                <span className="sf-mono" style={{
                  fontSize: 13, fontWeight: 700,
                  color: c.att >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)',
                }}>{c.att}%</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700, fontSize: 12 }}>↑{c.up}</span>
                <span className="sf-mono" style={{ color: c.down > 0 ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700, fontSize: 12 }}>↓{c.down}</span>
              </div>
              <div className="sf-mono" style={{ color: 'var(--sf-ink-2)', fontSize: 12 }}>{c.next}</div>
            </div>
          ))}
        </WebCard>

        {/* Detail panel */}
        <div className="web-cohort-detail">
          <div className="web-cohort-hero" style={{ background: `linear-gradient(135deg, ${cur.color} 0%, color-mix(in oklab, ${cur.color} 80%, black) 100%)` }}>
            <SfStar size={140} color="#FFFCF5" className="web-cohort-hero-star" />
            <div style={{ position: 'relative' }}>
              <WebChip tone="ink" style={{ background: 'rgba(255,252,245,0.2)', color: '#FFFCF5' }}>
                {cur.l}
              </WebChip>
              <div className="web-cohort-hero-n">
                {cur.n.split(' ')[0]} <span style={{ opacity: 0.7 }}>{cur.n.split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="web-cohort-hero-sub">
                {cur.cnt} o‘quvchi · Yunusobod filiali · Xona 304
              </div>
              <div className="web-cohort-hero-stats">
                {[
                  { v: `${cur.att}%`, l: 'Davomat' },
                  { v: `↑${cur.up}`, l: 'Up karta' },
                  { v: `↓${cur.down}`, l: 'Down karta' },
                  { v: '12', l: 'Topshiriq' },
                ].map((s, i) => (
                  <div key={i} className="web-cohort-hero-stat">
                    <div className="sf-mono web-cohort-stat-v">{s.v}</div>
                    <div className="web-cohort-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="web-btn web-btn-cream">
                  {React.cloneElement(Icons.check, { size: 14 })} Davomat olish
                </button>
                <button className="web-btn web-btn-cream-ghost">Karta berish</button>
                <button className="web-btn web-btn-cream-ghost">{cur.cnt} o‘quvchi</button>
              </div>
            </div>
          </div>

          {/* Roster */}
          <WebCard title="O‘quvchilar · 6 / 24" padded={false}
                    action={<a className="web-link">Saralash: Familiya ›</a>}>
            {[
              { n: 'Akbarov Akmal', up: 8, down: 0, att: 96, t: 'top' },
              { n: 'Azizova Madina', up: 6, down: 0, att: 98, t: 'top' },
              { n: 'Bakirov Sherzod', up: 2, down: 2, att: 88 },
              { n: 'Davronova Sevinch', up: 4, down: 0, att: 92 },
              { n: 'Eshmatov Otabek', up: 1, down: 4, att: 72, t: 'warn' },
              { n: 'Halimova Zilola', up: 7, down: 0, att: 95, t: 'top' },
            ].map((s, i) => (
              <div key={i} className="web-roster-row">
                <SfAvatar name={s.n} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s.n}</span>
                    {s.t === 'top' && <SfStar size={12} color="var(--sf-accent)" />}
                    {s.t === 'warn' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sf-danger)' }} />}
                  </div>
                  <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)', marginTop: 1 }}>
                    DEMO-2026-000{42 + i}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sf-mono" style={{ fontSize: 13, fontWeight: 700,
                      color: s.att >= 92 ? 'var(--sf-success)' : s.att >= 85 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>
                      {s.att}%
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--sf-muted)', letterSpacing: '0.04em',
                                    textTransform: 'uppercase', fontWeight: 600 }}>davomat</div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div className="web-card-mini" style={{
                      background: 'linear-gradient(135deg, #F6E0AC, #E9C272)', borderColor: '#C49A3A',
                    }}>
                      <SfStar size={10} color="#7A4F0E" />
                      <span className="sf-mono">{s.up}</span>
                    </div>
                    {s.down > 0 && (
                      <div className="web-card-mini" style={{
                        background: 'linear-gradient(135deg, #F0C9BE, #D88A75)', borderColor: '#A14026',
                      }}>
                        <SfStar size={10} color="#5C1A0C" />
                        <span className="sf-mono">{s.down}</span>
                      </div>
                    )}
                  </div>
                  <button className="web-icon-btn">
                    {React.cloneElement(Icons.chevR, { size: 14 })}
                  </button>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 18px', textAlign: 'center',
                            borderTop: '1px solid var(--sf-border)', fontSize: 12,
                            color: 'var(--sf-primary)', fontWeight: 600, cursor: 'pointer' }}>
              Hammasini ko‘rsatish · 18 ta yana
            </div>
          </WebCard>

          {/* AI insight */}
          <div className="web-ai-card">
            <div className="web-ai-bg" />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <SfAiBadge>Sinf hisoboti</SfAiBadge>
                <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>Bu hafta</span>
              </div>
              <div className="web-ai-quote">
                “Sinf umuman barqaror. Otabek va Sherzod oxirgi 2 haftada Down karta olgan — qisqa suhbat tavsiya etiladi.”
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{cohortsStyles}</style>
    </>
  );
}

const cohortsStyles = `
.web-cohorts-layout {
  display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px;
}
@media (max-width: 1100px) { .web-cohorts-layout { grid-template-columns: 1fr; } }
.web-cohort-detail { display: flex; flex-direction: column; gap: 16px; }

.web-table-h {
  display: grid; grid-template-columns: 2fr 1.4fr 0.8fr 0.8fr 1fr 1.2fr;
  gap: 12px; padding: 12px 18px;
  background: var(--sf-surface-2); border-bottom: 1px solid var(--sf-border);
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--sf-muted);
}
.web-table-row {
  display: grid; grid-template-columns: 2fr 1.4fr 0.8fr 0.8fr 1fr 1.2fr;
  gap: 12px; padding: 14px 18px;
  align-items: center;
  border-bottom: 1px solid var(--sf-border);
  cursor: pointer; transition: background 0.12s;
}
.web-table-row:last-child { border-bottom: none; }
.web-table-row:hover { background: var(--sf-surface-2); }
.web-table-row.on {
  background: var(--sf-primary-soft);
  box-shadow: inset 3px 0 0 var(--sf-primary);
}

.web-cohort-mark {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.web-cohort-hero {
  position: relative; border-radius: 18px; padding: 22px; overflow: hidden;
  color: #FFFCF5;
}
.web-cohort-hero-star {
  position: absolute; right: -40px; top: -40px; opacity: 0.16;
}
.web-cohort-hero-n {
  margin-top: 12px;
  font-family: var(--sf-font-display); font-style: italic;
  font-size: 36px; line-height: 1; font-weight: 400;
}
.web-cohort-hero-sub { margin-top: 6px; font-size: 13px; opacity: 0.85; }
.web-cohort-hero-stats {
  margin-top: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
}
.web-cohort-hero-stat {
  padding: 10px 8px; text-align: center;
  background: rgba(255,252,245,0.12); border-radius: 10px;
}
.web-cohort-stat-v { font-size: 18px; font-weight: 700; }
.web-cohort-stat-l {
  margin-top: 3px; font-size: 9.5px; letter-spacing: 0.04em;
  text-transform: uppercase; opacity: 0.85; font-weight: 600;
}

/* Roster */
.web-roster-row {
  display: flex; gap: 12px; padding: 12px 18px; align-items: center;
  border-bottom: 1px solid var(--sf-border);
  transition: background 0.12s;
}
.web-roster-row:hover { background: var(--sf-surface-2); }
.web-card-mini {
  width: 28px; height: 38px; border-radius: 5px; padding: 4px 0;
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  font-size: 10px; color: #5C3E08; font-weight: 700; border: 1px solid;
}
.web-icon-btn {
  width: 28px; height: 28px; border-radius: 8px;
  background: transparent; border: none; cursor: pointer;
  color: var(--sf-muted);
  display: flex; align-items: center; justify-content: center;
}
.web-icon-btn:hover { background: var(--sf-surface-3); color: var(--sf-ink); }
`;

Object.assign(window, { CohortsPage });
