// web-today.jsx — Dashboard page for the StarForge EDU web app

function TodayPage({ onNav }) {
  return (
    <>
      <WebPageHeader
        eyebrow="Seshanba · 19 May 2026"
        title={<>Bugun, <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>Nigora opa</span></>}
        subtitle="3 guruh · 5 ta dars · 8 ta Up karta berildi"
        right={
          <>
            <button className="web-btn web-btn-soft">
              {React.cloneElement(Icons.edit, { size: 14 })} Widget‘larni sozlash
            </button>
            <button className="web-btn web-btn-primary" onClick={() => onNav('cards')}>
              {React.cloneElement(Icons.plus, { size: 14 })} Karta berish
            </button>
          </>
        }
      />

      {/* Urgent banner */}
      <div className="web-survey-banner" onClick={() => onNav('surveys')}>
        <div className="web-survey-glow" />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="web-pulse-dot" />
          <div style={{ flex: 1 }}>
            <div className="web-survey-eyebrow">
              So‘rovnoma · 2 kun 14 soat qoldi
            </div>
            <div className="web-survey-title">
              Oylik o‘qituvchi qoniqishi <span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}>· 4/12 javob berildi</span>
            </div>
          </div>
          <button className="web-btn web-btn-ink">
            Davom etish {React.cloneElement(Icons.arrowR, { size: 14 })}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="web-stat-grid">
        <WebStat v="4" sub="/ 5" l="Bugungi darslar" />
        <WebStat v="94" sub="%" l="O‘rta davomat" c="var(--sf-success)" trend={{ up: true, v: '+2%' }} />
        <WebStat v="↑8" l="Up kartalar" c="#7A4F0E" trend={{ up: true, v: 'bugun' }} />
        <WebStat v="↓2" l="Down kartalar" c="var(--sf-danger)" />
        <WebStat v="3" l="Vazifa kutmoqda" c="var(--sf-primary)" />
      </div>

      {/* Main 2-column grid */}
      <div className="web-grid-2">
        {/* LEFT — primary */}
        <div className="web-col-l">
          {/* Hero next lesson */}
          <div className="web-hero" onClick={() => onNav('cohorts')}>
            <SfStar size={220} color="#FFFCF5" className="web-hero-star" />
            <div style={{ position: 'relative', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="web-hero-eyebrow">Keyingi dars · 14 daqiqada boshlanadi</div>
                  <div className="web-hero-title">
                    Algebra · <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>Daraja II</span>
                  </div>
                  <div className="web-hero-sub">
                    9-B guruh · 24 o‘quvchi · Xona 304 · 2-qavat
                  </div>
                </div>
                <div className="web-hero-time">
                  <span className="sf-mono web-hero-clock">09:00</span>
                  <span className="web-hero-clock-sub">– 09:45</span>
                </div>
              </div>
              <div className="web-hero-actions">
                <button className="web-btn web-btn-cream">
                  {React.cloneElement(Icons.check, { size: 16 })} Davomat olish
                </button>
                <button className="web-btn web-btn-cream-ghost">
                  Materiallar
                </button>
                <button className="web-btn web-btn-cream-ghost">
                  Dars rejasi
                </button>
                <button className="web-icon-btn-cream">
                  {React.cloneElement(Icons.more, { size: 16 })}
                </button>
              </div>
            </div>
          </div>

          {/* Today's schedule */}
          <WebCard title="Bugungi jadval" padded={false}
                    action={<a className="web-link" onClick={() => onNav('cohorts')}>5 ta dars ›</a>}>
            {[
              { t: '09:00', l: 'Algebra · 9-B', r: '304', state: 'now', mins: '14m' },
              { t: '10:00', l: 'Algebra · Mid', r: '304', state: 'next' },
              { t: '11:30', l: 'Geometriya · 10-V', r: '301' },
              { t: '14:00', l: 'Tushlik tanaffus', r: '', state: 'gap' },
              { t: '15:00', l: 'Tayyorlov · 11', r: '210' },
            ].map((row, i, arr) => (
              <div key={i} className={`web-sched-row ${row.state || ''}`}>
                <span className="sf-mono web-sched-time">{row.t}</span>
                <span className="web-sched-rail" style={{
                  background: row.state === 'now' ? 'var(--sf-primary)' :
                              row.state === 'gap' ? 'var(--sf-border-strong)' :
                              'var(--sf-accent)',
                }} />
                <span className="web-sched-l">{row.l}</span>
                <span className="web-sched-r">{row.r}</span>
                <span className="web-sched-state">
                  {row.state === 'now' && <WebChip tone="primary">Hozir · {row.mins}</WebChip>}
                  {row.state === 'next' && <WebChip tone="accent">Keyingi</WebChip>}
                </span>
              </div>
            ))}
          </WebCard>

          {/* Recent cards strip */}
          <WebCard title="So‘nggi kartalar"
                    action={<a className="web-link" onClick={() => onNav('cards')}>10 ta ›</a>}>
            <div className="web-cards-strip">
              <SfCard kind="up" size="md" recipient="Akbarov A." reason="Mustaqil yechim · 3-misol"
                      issuer="N.K." when="09:42" typeName="Yulduz karta" />
              <SfCard kind="up" size="md" recipient="Halimova Z." reason="Aktivlik · yordam"
                      issuer="N.K." when="09:38" typeName="Aktivlik" />
              <SfCard kind="down" size="md" recipient="Eshmatov O." reason="Uy ishi tayyor emas"
                      issuer="N.K." when="09:12" typeName="Ogohlantirish" />
              <SfCard kind="up" size="md" recipient="Davronova S." reason="Toza daftar"
                      issuer="N.K." when="Du" typeName="Toza ish" />
              <SfCard kind="up" size="md" recipient="Azizova M." reason="Olimpiada 2-bosqich"
                      issuer="N.K." when="Yak" typeName="Yulduz karta" />
            </div>
          </WebCard>

          {/* Pending tasks */}
          <WebCard title="Vazifa kutmoqda · 3 ta"
                    action={<a className="web-link" onClick={() => onNav('tasks')}>Hammasi ›</a>}
                    padded={false}>
            {[
              { t: 'May oyi yakuniy hisoboti', pri: 'P1', dl: 'Erta · 18:00', urgent: true, mgmt: true, proj: 'Hisobot', projColor: 'var(--sf-primary)' },
              { t: 'Slaydlarni yangilash · Kvadrat tenglamalar', pri: 'P2', dl: 'Pen · 23:59', mgmt: false, proj: 'Materiallar', projColor: 'var(--sf-accent)' },
              { t: 'So‘rovnoma · AI sifat baholash', pri: 'P2', dl: '22.05', mgmt: true, proj: 'So‘rovnoma', projColor: 'var(--sf-ai)' },
            ].map((task, i, arr) => (
              <div key={i} className="web-task-row">
                <div className="web-task-rail" style={{ background: task.urgent ? 'var(--sf-danger)' : task.projColor }} />
                <div className="web-task-check" />
                <div className="web-task-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {task.mgmt && <WebChip tone="ink">BOSHQARUV</WebChip>}
                    <WebChip><span style={{ width: 8, height: 8, borderRadius: 2, background: task.projColor, display: 'inline-block', marginRight: 4 }} />{task.proj}</WebChip>
                  </div>
                  <div className="web-task-title">{task.t}</div>
                </div>
                <span className="sf-mono web-task-pri" style={{ color: task.pri === 'P1' ? 'var(--sf-danger)' : 'var(--sf-warn)' }}>
                  {task.pri}
                </span>
                <span className="sf-mono web-task-dl" style={{
                  color: task.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)',
                  fontWeight: task.urgent ? 700 : 500,
                }}>{task.dl}</span>
              </div>
            ))}
          </WebCard>
        </div>

        {/* RIGHT — secondary */}
        <div className="web-col-r">
          {/* AI insight */}
          <div className="web-ai-card" onClick={() => onNav('ai')}>
            <div className="web-ai-bg" />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <SfAiBadge>Bugungi tavsiya</SfAiBadge>
                <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>3 dona</span>
              </div>
              <div className="web-ai-quote">
                “Otabekka oxirgi haftada 2 ta Down karta berildi va davomati pasaymoqda. Ota bilan suhbat tavsiya etiladi.”
              </div>
              <div className="web-ai-chips">
                <WebChip tone="ai">Ota-onaga xat tayyor</WebChip>
                <WebChip tone="ai">Konsultatsiya rejasi</WebChip>
              </div>
              <button className="web-btn web-btn-ink" style={{ marginTop: 14 }}>
                Suhbatga o‘tish {React.cloneElement(Icons.arrowR, { size: 14 })}
              </button>
            </div>
          </div>

          {/* Print queue widget */}
          <WebCard title="Print navbatim" padded={false}
                    action={<a className="web-link" onClick={() => onNav('print')}>2 ta ›</a>}>
            <div className="web-print-row">
              <div className="web-doc-thumb">
                {React.cloneElement(Icons.doc, { size: 18 })}
                <div className="web-doc-mult">×24</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="web-print-t">Kvadrat tenglamalar</div>
                <div className="web-print-sub">HP LaserJet · A4 B/W</div>
                <div className="web-progress">
                  <div className="web-progress-fill" style={{ width: '64%' }} />
                </div>
                <div className="web-print-eta">Tugaydi · 11:24</div>
              </div>
              <WebChip tone="primary">Chop</WebChip>
            </div>
            <div className="web-print-divider" />
            <div className="web-print-row">
              <div className="web-doc-thumb">
                {React.cloneElement(Icons.brand, { size: 18 })}
                <div className="web-doc-mult">×6</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="web-print-t">Yulduz karta · 6 nusxa</div>
                <div className="web-print-sub">Xerox · A5 rang</div>
                <div className="web-print-eta">Boshlanadi · 11:38</div>
              </div>
              <WebChip tone="accent">Navbat</WebChip>
            </div>
          </WebCard>

          {/* Direktor mention */}
          <WebCard padded={false}>
            <div className="web-mgmt-row" onClick={() => onNav('mgmt')}>
              <SfAvatar name="Karimova Rano" size={40} color="var(--sf-primary)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>Karimova Rano</span>
                  <WebChip tone="primary">Direktor</WebChip>
                </div>
                <div className="web-mgmt-msg">
                  "Ertangi yig‘ilish 14:00 da o‘tadi. Hisobotni ham olib keling."
                </div>
              </div>
              <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>14:08</span>
              <span className="web-unread-dot" />
            </div>
          </WebCard>

          {/* Cohort spotlight */}
          <WebCard title="Guruh spotlight"
                    action={<a className="web-link" onClick={() => onNav('cohorts')}>O‘zgartirish</a>}>
            <div className="web-spotlight">
              <div className="web-spotlight-h">
                <div className="web-spotlight-mark">
                  <SfStar size={22} color="#FFFCF5" />
                </div>
                <div>
                  <div className="web-spotlight-name">9-B Algebra</div>
                  <div className="web-spotlight-sub">24 o‘quvchi · Daraja II</div>
                </div>
                <WebChip tone="success">Yaxshi</WebChip>
              </div>
              <div className="web-spotlight-stats">
                {[
                  { v: '94%', l: 'Davomat', c: 'var(--sf-success)' },
                  { v: '↑18', l: 'Up', c: '#7A4F0E' },
                  { v: '↓4', l: 'Down', c: 'var(--sf-danger)' },
                ].map((s, i) => (
                  <div key={i} className="web-spotlight-stat">
                    <div className="sf-mono" style={{ fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
                    <div className="web-spotlight-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </WebCard>

          {/* Activity feed */}
          <WebCard title="So‘nggi faollik">
            {[
              { who: 'Siz', what: 'Akbarov A. ga Yulduz karta berdingiz', t: '09:42', icon: Icons.brand, c: 'var(--sf-accent)' },
              { who: 'AI', what: 'haftalik xulosa tayyorladi · 9-B', t: '08:50' },
              { who: 'Siz', what: '10-V uchun davomatni saqladingiz', t: '08:48', icon: Icons.check, c: 'var(--sf-success)' },
              { who: 'Karimova R.', what: 'yangi vazifa biriktirdi', t: 'Du', icon: Icons.flag, c: 'var(--sf-primary)' },
            ].map((a, i) => (
              <div key={i} className="web-activity-row">
                {a.who === 'AI' ? (
                  <div className="web-ai-mini">Ai</div>
                ) : (
                  <div className="web-activity-icon" style={{ background: a.c + '22', color: a.c }}>
                    {a.icon && React.cloneElement(a.icon, { size: 12 })}
                  </div>
                )}
                <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>{a.who}</span>
                  <span style={{ color: 'var(--sf-muted)' }}> {a.what}</span>
                </div>
                <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{a.t}</span>
              </div>
            ))}
          </WebCard>
        </div>
      </div>
    </>
  );
}

// ─── styles ─────────────────────────────────────────────────
const todayStyles = `
.web-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px;
  font-family: inherit; font-weight: 600; font-size: 13px;
  border: 1px solid transparent; cursor: pointer;
  transition: transform 0.08s, background 0.15s, color 0.15s;
}
.web-btn:active { transform: scale(0.97); }
.web-btn-primary { background: var(--sf-primary); color: #FFFCF5; }
.web-btn-primary:hover { background: var(--sf-primary-hover); }
.web-btn-soft { background: var(--sf-surface-2); color: var(--sf-ink); border-color: var(--sf-border); }
.web-btn-ghost { background: transparent; color: var(--sf-ink); border-color: var(--sf-border-strong); }
.web-btn-ink { background: var(--sf-ink); color: var(--sf-bg); }
.web-btn-cream { background: #FFFCF5; color: var(--sf-primary); font-weight: 700; }
.web-btn-cream-ghost { background: transparent; color: #FFFCF5; border-color: rgba(255,252,245,0.35); }
.web-icon-btn-cream {
  width: 36px; height: 36px; border-radius: 999px;
  background: transparent; border: 1px solid rgba(255,252,245,0.35);
  color: #FFFCF5; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.web-link {
  font-size: 12px; color: var(--sf-primary); font-weight: 600; cursor: pointer;
}
.web-link:hover { text-decoration: underline; }

/* Survey banner */
.web-survey-banner {
  position: relative; padding: 16px 20px; border-radius: 16px;
  background: linear-gradient(135deg, #FCEFD0 0%, #F6E0AC 100%);
  border: 1.5px solid var(--sf-accent);
  box-shadow: 0 0 0 5px rgba(216,154,46,0.16), 0 8px 24px rgba(216,154,46,0.18);
  margin-bottom: 20px; cursor: pointer;
  overflow: hidden;
}
.web-survey-glow {
  position: absolute; inset: 0; border-radius: 16px;
  border: 2px solid var(--sf-accent); opacity: 0.4;
  animation: webSPulse 1.8s ease-in-out infinite; pointer-events: none;
}
@keyframes webSPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0; transform: scale(1.015); } }
.web-pulse-dot {
  width: 10px; height: 10px; border-radius: 50%; background: var(--sf-danger);
  animation: webBlink 1s steps(2) infinite; flex-shrink: 0;
}
@keyframes webBlink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }
.web-survey-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
                       text-transform: uppercase; color: var(--sf-danger); }
.web-survey-title { margin-top: 2px; font-size: 16px; font-weight: 700; }

/* Stat grid */
.web-stat-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;
  margin-bottom: 24px;
}
@media (max-width: 1023px) { .web-stat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .web-stat-grid { grid-template-columns: repeat(2, 1fr); } }

/* Main 2-col grid */
.web-grid-2 {
  display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 20px;
}
@media (max-width: 1200px) { .web-grid-2 { grid-template-columns: 1fr; } }
.web-col-l, .web-col-r { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

/* Hero */
.web-hero {
  position: relative; border-radius: 20px; overflow: hidden; cursor: pointer;
  background: linear-gradient(135deg, var(--sf-primary) 0%, var(--sf-primary-hover) 100%);
  color: #FFFCF5;
  transition: transform 0.12s;
}
.web-hero:hover { transform: translateY(-2px); }
.web-hero-star {
  position: absolute; right: -50px; top: -50px; opacity: 0.18;
}
.web-hero-eyebrow { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
                     font-weight: 700; opacity: 0.85; }
.web-hero-title {
  margin-top: 8px; font-size: 36px; font-weight: 800; letter-spacing: -0.025em; line-height: 1;
}
.web-hero-sub { margin-top: 6px; font-size: 14px; opacity: 0.9; }
.web-hero-time { text-align: right; }
.web-hero-clock { font-size: 32px; font-weight: 600; }
.web-hero-clock-sub { display: block; font-size: 13px; opacity: 0.85; }
.web-hero-actions { margin-top: 24px; display: flex; gap: 8px; flex-wrap: wrap; }

/* Schedule rows */
.web-sched-row {
  display: grid; grid-template-columns: 60px 3px 1fr auto auto;
  gap: 14px; padding: 12px 18px; align-items: center;
  border-top: 1px solid var(--sf-border);
}
.web-sched-row:first-child { border-top: none; }
.web-sched-row.gap { background: var(--sf-surface-2); opacity: 0.7; }
.web-sched-time { font-size: 13px; color: var(--sf-ink-2); font-weight: 600; }
.web-sched-rail { height: 18px; border-radius: 2px; }
.web-sched-l { font-size: 14px; font-weight: 600; }
.web-sched-r { font-size: 11px; color: var(--sf-muted); }

/* Cards strip */
.web-cards-strip {
  display: flex; gap: 12px; overflow-x: auto; padding: 4px 0;
}
.web-cards-strip::-webkit-scrollbar { height: 6px; }
.web-cards-strip::-webkit-scrollbar-thumb { background: var(--sf-border-strong); border-radius: 3px; }

/* Task rows */
.web-task-row {
  display: grid; grid-template-columns: 3px 18px 1fr auto auto;
  gap: 12px; padding: 12px 18px; align-items: center;
  border-top: 1px solid var(--sf-border);
}
.web-task-row:first-child { border-top: none; }
.web-task-rail { height: 30px; border-radius: 3px; }
.web-task-check { width: 16px; height: 16px; border-radius: 4px;
                   border: 1.5px solid var(--sf-border-strong); }
.web-task-body { min-width: 0; }
.web-task-title { margin-top: 4px; font-size: 13.5px; font-weight: 600; }
.web-task-pri { font-size: 11px; font-weight: 700; }
.web-task-dl { font-size: 11px; }

/* AI card */
.web-ai-card {
  position: relative; padding: 20px; border-radius: 18px;
  background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border);
  cursor: pointer;
  overflow: hidden;
}
.web-ai-bg {
  position: absolute; inset: -50%;
  background: radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--sf-accent) 18%, transparent) 0%, transparent 50%);
  pointer-events: none;
}
.web-ai-quote {
  font-family: var(--sf-font-display); font-style: italic;
  font-size: 17px; line-height: 1.35; color: var(--sf-ink);
}
.web-ai-chips { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; }

/* Print rows */
.web-print-row {
  display: flex; gap: 12px; padding: 14px 18px; align-items: center;
}
.web-print-divider { height: 1px; background: var(--sf-border); }
.web-doc-thumb {
  width: 38px; height: 48px; background: var(--sf-surface-2);
  border: 1px solid var(--sf-border); border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  position: relative; flex-shrink: 0;
}
.web-doc-mult {
  position: absolute; bottom: -5px; right: -5px;
  padding: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: 700;
  background: var(--sf-ink); color: var(--sf-bg); font-family: var(--sf-font-mono);
}
.web-print-t { font-size: 13px; font-weight: 700; overflow: hidden;
                 text-overflow: ellipsis; white-space: nowrap; }
.web-print-sub { font-size: 11px; color: var(--sf-muted); }
.web-progress { margin-top: 6px; height: 4px; border-radius: 4px;
                 background: var(--sf-surface-2); overflow: hidden; }
.web-progress-fill { height: 100%; background: var(--sf-primary); }
.web-print-eta { margin-top: 4px; font-size: 10px; color: var(--sf-muted); font-family: var(--sf-font-mono); }

/* Mgmt row */
.web-mgmt-row {
  display: flex; padding: 14px 18px; gap: 12px; align-items: center;
  cursor: pointer; position: relative;
  transition: background 0.15s;
}
.web-mgmt-row:hover { background: var(--sf-surface-2); }
.web-mgmt-msg { margin-top: 2px; font-size: 12px; color: var(--sf-muted); font-style: italic;
                 overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.web-unread-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--sf-primary);
}

/* Spotlight */
.web-spotlight-h { display: flex; align-items: center; gap: 10px; }
.web-spotlight-mark {
  width: 38px; height: 38px; border-radius: 12px;
  background: var(--sf-primary); color: #FFFCF5;
  display: flex; align-items: center; justify-content: center;
}
.web-spotlight-name { font-size: 14px; font-weight: 700; }
.web-spotlight-sub { font-size: 11px; color: var(--sf-muted); }
.web-spotlight-stats { margin-top: 14px; display: flex; gap: 8px; }
.web-spotlight-stat {
  flex: 1; padding: 10px 6px; text-align: center;
  background: var(--sf-surface-2); border-radius: 10px;
}
.web-spotlight-stat-l {
  margin-top: 4px; font-size: 9.5px; color: var(--sf-muted);
  letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600;
}

/* Activity */
.web-activity-row {
  display: flex; gap: 10px; padding: 8px 0; align-items: center;
  border-top: 1px dashed var(--sf-border);
}
.web-activity-row:first-child { border-top: none; padding-top: 0; }
.web-activity-icon {
  width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.web-ai-mini {
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border);
  color: var(--sf-ai); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--sf-font-display); font-style: italic; font-size: 11px; font-weight: 600;
}

/* Mobile tweaks */
@media (max-width: 767px) {
  .web-hero-title { font-size: 24px; }
  .web-hero-clock { font-size: 22px; }
  .web-hero-actions { gap: 6px; }
  .web-survey-banner { padding: 14px 16px; }
}
`;

Object.assign(window, { TodayPage, todayStyles });
