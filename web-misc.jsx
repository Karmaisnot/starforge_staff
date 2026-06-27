// web-misc.jsx — Print, Surveys, Cards, Mgmt, Notifications, Materials pages

function PrintPage({ onNav }) {
  const printers = [
    { n: 'HP LaserJet · M404n', loc: 'Lobbi · 1-qavat', status: 'free', etaT: 'Hozir tayyor', q: 0, color: false, sizes: 'A4', acc: 'var(--sf-success)' },
    { n: 'Xerox WorkCentre · Pro', loc: '2-qavat dahliz', status: 'busy', etaT: '11:34 da bo‘shaydi', q: 2, color: true, sizes: 'A4 · A3 · color', acc: 'var(--sf-warn)' },
    { n: 'Brother · DCP-L', loc: 'Direktor xonasi', status: 'locked', etaT: 'Faqat ma‘muriyat', q: 0, color: false, sizes: 'A4', acc: 'var(--sf-muted)' },
  ];

  return (
    <>
      <WebPageHeader
        title="Print"
        subtitle="Yunusobod filiali · 3 printer · 2 ta sizning navbatda"
        right={<button className="web-btn web-btn-primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi chop etish</button>}
      />

      <div className="web-print-grid">
        <div>
          <h3 className="web-section-h">Mening navbatim · 2 ta</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { doc: 'Kvadrat tenglamalar · slayd', copies: 24, size: 'A4 · B/W', printer: 'HP LaserJet', pct: 64, eta: 'Tugaydi · 11:24', state: 'now' },
              { doc: 'Yulduz karta · 6 nusxa', copies: 6, size: 'A5 · rang', printer: 'Xerox WorkCentre', pct: 0, eta: 'Boshlanadi · 11:38', state: 'queued' },
            ].map((j, i) => (
              <WebCard key={i} padded={false}>
                <div style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'center' }}>
                  <div className="web-doc-thumb-lg">
                    {React.cloneElement(j.doc.includes('karta') ? Icons.brand : Icons.doc, { size: 22 })}
                    <div className="web-doc-mult-lg">×{j.copies}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{j.doc}</div>
                      <WebChip tone={j.state === 'now' ? 'primary' : 'accent'}>
                        {j.state === 'now' ? 'Chop bo‘lmoqda' : 'Navbatda'}
                      </WebChip>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--sf-muted)' }}>
                      {j.size} · {j.printer}
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 4, background: 'var(--sf-surface-2)', overflow: 'hidden' }}>
                        <div style={{ width: `${j.pct}%`, height: '100%', background: j.state === 'now' ? 'var(--sf-primary)' : 'var(--sf-accent)' }} />
                      </div>
                      <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                        {j.state === 'now' ? `${j.pct}%` : j.eta.split(' · ')[1]}
                      </span>
                    </div>
                    <div className="sf-mono" style={{ marginTop: 4, fontSize: 10, color: 'var(--sf-muted)' }}>{j.eta}</div>
                  </div>
                  <button className="web-icon-btn">{Icons.more}</button>
                </div>
              </WebCard>
            ))}
          </div>

          <h3 className="web-section-h" style={{ marginTop: 28 }}>Printerlar · 3 ta</h3>
          <div className="web-printers-grid">
            {printers.map((p, i) => (
              <WebCard key={i} padded={false}>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="web-printer-icon" style={{ color: p.acc }}>
                      {React.cloneElement(Icons.print, { size: 26 })}
                      <span style={{ position: 'absolute', bottom: 4, right: 4, width: 10, height: 10,
                                      borderRadius: '50%', background: p.acc,
                                      border: '2px solid var(--sf-surface)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</span>
                        {p.color && <WebChip tone="accent">Rangli</WebChip>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 1 }}>{p.loc} · {p.sizes}</div>
                    </div>
                    <WebChip tone={p.status === 'free' ? 'success' : p.status === 'busy' ? 'accent' : 'neutral'}>
                      {p.status === 'free' ? 'Bo‘sh' : p.status === 'busy' ? `${p.q} navbat` : 'Yopiq'}
                    </WebChip>
                  </div>
                  <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: 'var(--sf-surface-2)',
                                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                    {React.cloneElement(Icons.clock, { size: 14, style: { color: p.acc } })}
                    <span style={{ flex: 1 }}>{p.etaT}</span>
                    {p.status !== 'locked' && (
                      <button className="web-btn web-btn-soft" style={{ padding: '4px 10px', fontSize: 11 }}>
                        Yuborish
                      </button>
                    )}
                  </div>
                </div>
              </WebCard>
            ))}
          </div>
        </div>

        {/* SIDE — New job form */}
        <WebCard title="Tezkor chop etish">
          <div className="web-quick-print">
            <div className="web-quick-print-source">
              <button className="web-source-btn on">
                {React.cloneElement(Icons.folder, { size: 18 })}
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>Kutubxonadan</div>
                  <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>84 fayl</div>
                </div>
              </button>
              <button className="web-source-btn">
                {React.cloneElement(Icons.upload, { size: 18 })}
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>Yuklash</div>
                  <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>PDF · DOCX · JPG</div>
                </div>
              </button>
            </div>

            {/* Form rows */}
            <div className="web-form-row">
              <span className="web-form-l">Nusxa</span>
              <div className="web-stepper">
                <button>−</button>
                <span className="sf-mono">24</span>
                <button>+</button>
              </div>
            </div>
            <div className="web-form-row">
              <span className="web-form-l">Format</span>
              <div className="web-seg">
                <button className="on">A4</button>
                <button>A5</button>
                <button>A3</button>
              </div>
            </div>
            <div className="web-form-row">
              <span className="web-form-l">Rang</span>
              <div className="web-seg">
                <button className="on">B/W</button>
                <button>Rangli</button>
              </div>
            </div>
            <div className="web-form-row">
              <span className="web-form-l">Tomon</span>
              <div className="web-seg">
                <button>1 ↕</button>
                <button className="on">2 ↔</button>
              </div>
            </div>
            <div className="web-form-row">
              <span className="web-form-l">Vaqt</span>
              <span style={{ fontSize: 12, color: 'var(--sf-primary)', fontWeight: 600 }}>Bugun · 08:45</span>
            </div>
            <div className="web-form-sum">
              <div className="web-form-sum-row">
                <span style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.06em',
                                textTransform: 'uppercase', fontWeight: 600 }}>Yakuniy</span>
                <SfStar size={20} color="var(--sf-accent)" />
              </div>
              <div className="sf-mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                24 × 8 = 192 sahifa
              </div>
              <div style={{ marginTop: 2, fontSize: 11, opacity: 0.7 }}>
                A4 · B/W · 2 tomonlama · HP LaserJet
              </div>
            </div>
            <button className="web-btn web-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Navbatga qo‘shish {React.cloneElement(Icons.arrowR, { size: 14 })}
            </button>
          </div>
        </WebCard>
      </div>

      <style>{`
        .web-section-h {
          margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: -0.005em;
        }
        .web-print-grid {
          display: grid; grid-template-columns: 1fr 380px; gap: 20px;
        }
        @media (max-width: 1024px) { .web-print-grid { grid-template-columns: 1fr; } }
        .web-printers-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px;
        }
        .web-printer-icon {
          width: 50px; height: 50px; border-radius: 12px;
          background: var(--sf-surface-2);
          display: flex; align-items: center; justify-content: center;
          position: relative; flex-shrink: 0;
        }
        .web-doc-thumb-lg {
          width: 50px; height: 64px; border-radius: 8px;
          background: var(--sf-surface-2); border: 1px solid var(--sf-border);
          display: flex; align-items: center; justify-content: center;
          position: relative; flex-shrink: 0;
        }
        .web-doc-mult-lg {
          position: absolute; bottom: -6px; right: -6px;
          padding: 2px 6px; border-radius: 5px; font-size: 10px; font-weight: 700;
          background: var(--sf-ink); color: var(--sf-bg); font-family: var(--sf-font-mono);
        }
        .web-quick-print { display: flex; flex-direction: column; gap: 10px; }
        .web-quick-print-source { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .web-source-btn {
          padding: 12px; border-radius: 12px; cursor: pointer; font-family: inherit;
          background: var(--sf-surface); border: 1px solid var(--sf-border);
          display: flex; gap: 10px; align-items: center; text-align: left;
          color: var(--sf-ink);
        }
        .web-source-btn.on { background: var(--sf-primary-soft); border-color: var(--sf-primary); color: var(--sf-primary); }
        .web-form-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed var(--sf-border);
        }
        .web-form-l { font-size: 12px; color: var(--sf-muted); font-weight: 600;
                       letter-spacing: 0.04em; text-transform: uppercase; }
        .web-stepper { display: flex; align-items: center; gap: 8px; }
        .web-stepper button {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--sf-surface-2); border: none; cursor: pointer;
          font-family: inherit; font-weight: 700;
        }
        .web-stepper button:last-child { background: var(--sf-primary); color: #FFFCF5; }
        .web-stepper span { font-size: 18px; font-weight: 700; min-width: 32px; text-align: center; }
        .web-seg { display: flex; gap: 3px; padding: 3px; background: var(--sf-surface-2); border-radius: 8px; }
        .web-seg button {
          padding: 4px 10px; border-radius: 6px; background: transparent;
          border: none; cursor: pointer; font-family: inherit;
          font-size: 11px; font-weight: 700; color: var(--sf-muted);
        }
        .web-seg button.on { background: var(--sf-surface); color: var(--sf-ink); }
        .web-form-sum {
          margin-top: 8px; padding: 14px; border-radius: 12px;
          background: var(--sf-ink); color: var(--sf-bg);
        }
        .web-form-sum-row { display: flex; justify-content: space-between; align-items: center; }
      `}</style>
    </>
  );
}

function SurveysPage({ onNav }) {
  return (
    <>
      <WebPageHeader
        title="So‘rovnomalar"
        subtitle="Markaz tomonidan yuboriladi · anonim"
        right={<><WebChip tone="danger">2 ta topshirilmagan</WebChip></>}
      />

      <div className="web-surveys-grid">
        {[
          { t: 'Oylik o‘qituvchi qoniqishi', issuer: 'Karimova R. · Direktor', dl: '22.05 · 23:59', rem: '2 kun 14 soat', q: 12, est: '~4 daq', progress: 33, urgent: true },
          { t: 'Karta tizimi · taklif va e‘tirozlar', issuer: 'Ahmedov B. · O‘quv ishlari', dl: '26.05 · 18:00', rem: '6 kun', q: 8, est: '~3 daq', progress: 0 },
        ].map((s, i) => (
          <div key={i} className={`web-survey-card ${s.urgent ? 'urgent' : ''}`}>
            {s.urgent && <div className="web-survey-glow" />}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {s.urgent && <span className="web-pulse-dot" />}
                  <WebChip tone={s.urgent ? 'ink' : 'neutral'}>
                    {s.urgent ? '⏰ Shoshilinch' : 'Yangi'}
                  </WebChip>
                </div>
                <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                  <span className="sf-mono" style={{ fontWeight: 700, color: s.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)' }}>{s.rem}</span> qoldi
                </span>
              </div>
              <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {s.t}
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--sf-ink-2)' }}>
                {s.issuer} · <span className="sf-mono">{s.dl}</span>
              </div>
              <div style={{ marginTop: 16, padding: 14, borderRadius: 10,
                              background: 'rgba(255,252,245,0.7)',
                              display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)' }}>
                    <strong>{s.q}</strong> savol · {s.est}
                  </div>
                  {s.progress > 0 && (
                    <div style={{ marginTop: 6, height: 4, borderRadius: 4, background: 'var(--sf-surface-3)', overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: 'var(--sf-accent)' }} />
                    </div>
                  )}
                </div>
                <button className="web-btn web-btn-ink">
                  {s.progress > 0 ? 'Davom' : 'Boshlash'} {React.cloneElement(Icons.arrowR, { size: 12 })}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="web-section-h" style={{ marginTop: 28 }}>Tarix · 3 ta</h3>
      <WebCard padded={false}>
        {[
          { t: 'Aprel · iss-prosess', i: 'Direktor', s: 'Topshirildi', d: '30.04' },
          { t: 'Yangi platforma qulayligi', i: 'Markaz', s: 'Topshirildi', d: '15.04' },
          { t: 'AI tavsiyalarining sifati', i: 'Metodist', s: 'O‘tkazib yuborilgan', skipped: true, d: '01.04' },
        ].map((p, i, a) => (
          <div key={i} className="web-table-row" style={{ gridTemplateColumns: '40px 2fr 1.5fr 1fr 100px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: p.skipped ? 'var(--sf-surface-2)' : 'var(--sf-success-soft)',
              color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{p.skipped ? React.cloneElement(Icons.x, { size: 16 }) : React.cloneElement(Icons.check, { size: 16, stroke: 2.6 })}</div>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.t}</span>
            <span style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{p.i}</span>
            <span style={{ fontSize: 12, color: p.skipped ? 'var(--sf-muted)' : 'var(--sf-success)' }}>{p.s}</span>
            <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{p.d}</span>
          </div>
        ))}
      </WebCard>

      <style>{`
        .web-surveys-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 16px; }
        .web-survey-card {
          position: relative; padding: 18px 20px; border-radius: 18px;
          background: var(--sf-surface); border: 1px solid var(--sf-border);
          overflow: hidden;
        }
        .web-survey-card.urgent {
          background: linear-gradient(135deg, #FCEFD0 0%, #F6E0AC 100%);
          border: 1.5px solid var(--sf-accent);
          box-shadow: 0 0 0 4px rgba(216,154,46,0.16), 0 8px 24px rgba(216,154,46,0.16);
        }
        .web-survey-glow {
          position: absolute; inset: 0; border-radius: 18px;
          border: 2px solid var(--sf-accent); opacity: 0.4;
          animation: webSPulse 1.8s ease-in-out infinite; pointer-events: none;
        }
      `}</style>
    </>
  );
}

Object.assign(window, { PrintPage, SurveysPage });
