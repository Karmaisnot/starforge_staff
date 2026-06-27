// web-stubs.jsx — Mgmt inbox, Notifications, Cards, Materials pages

function MgmtPage({ onNav }) {
  const [openId, setOpen] = React.useState(1);
  const threads = [
    { id: 1, n: 'Karimova Rano', r: 'Direktor', last: 'Ertangi yig‘ilish 14:00 da o‘tadi. Hisobotni ham olib keling.', t: '14:08', unread: 1, online: true, pin: true },
    { id: 2, n: 'Ahmedov Botir', r: 'O‘quv ishlari bo‘yicha', last: 'Yangi karta sozlamalari haqida o‘qib chiqing.', t: '12:42' },
    { id: 3, n: 'Yusupova Nargiza', r: 'Metodist · Matematika', last: 'Mavzular ro‘yxati yangilandi.', t: 'Du · 16:20', unread: 2 },
    { id: 4, n: 'Markaz e‘lonlari', r: 'Avtomatik · barchaga', last: 'May oyi xulosalari · 23.05 gacha topshiring.', t: 'Du · 10:00', channel: true },
    { id: 5, n: 'Tursunov Sherzod', r: 'Filial menejeri', last: 'Yunusobod filialida printer almashtirildi.', t: '17 May' },
  ];
  const cur = threads.find(t => t.id === openId);

  return (
    <>
      <WebPageHeader
        title="Boshqaruv"
        subtitle="Direktor, metodist va filial menejeri bilan to‘g‘ridan-to‘g‘ri"
        right={<button className="web-btn web-btn-primary">{React.cloneElement(Icons.edit, { size: 14 })} Yangi xabar</button>}
      />

      <div className="web-mgmt-layout">
        <WebCard padded={false} className="web-mgmt-list">
          {threads.map(t => (
            <div key={t.id} className={`web-mgmt-thread ${openId === t.id ? 'on' : ''}`}
                 onClick={() => setOpen(t.id)}>
              <div style={{ position: 'relative' }}>
                {t.channel ? (
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--sf-ink)',
                                  color: 'var(--sf-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SfStar size={20} color="var(--sf-accent)" />
                  </div>
                ) : <SfAvatar name={t.n} size={44} />}
                {t.online && <span className="web-online-dot" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: t.unread > 0 ? 700 : 600 }}>{t.n}</span>
                  <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{t.t}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', margin: '1px 0 4px' }}>
                  {t.pin && <span style={{ color: 'var(--sf-accent)' }}>{React.cloneElement(Icons.pin, { size: 9 })}</span>}
                  {t.r === 'Direktor' && <WebChip tone="primary">Direktor</WebChip>}
                  <span style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{t.r}</span>
                </div>
                <div style={{ fontSize: 11.5, color: t.unread > 0 ? 'var(--sf-ink-2)' : 'var(--sf-muted)',
                                fontWeight: t.unread > 0 ? 600 : 400,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.last}</div>
              </div>
              {t.unread > 0 && (
                <div style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
                                background: 'var(--sf-primary)', color: '#FFFCF5', alignSelf: 'center',
                                fontSize: 11, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</div>
              )}
            </div>
          ))}
        </WebCard>

        <div className="web-mgmt-chat">
          <div className="web-ai-chat-h">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SfAvatar name={cur.n} size={42} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{cur.n}</span>
                  {cur.r === 'Direktor' && <WebChip tone="primary">Direktor</WebChip>}
                </div>
                <div style={{ fontSize: 11, color: cur.online ? 'var(--sf-success)' : 'var(--sf-muted)' }}>
                  {cur.online ? <>● onlayn · {cur.r}</> : cur.r}
                </div>
              </div>
            </div>
          </div>

          <div className="web-ai-body">
            <div className="web-chat-in-wrap">
              <SfAvatar name={cur.n} size={28} />
              <div className="web-chat-in" style={{ background: 'var(--sf-surface)', maxWidth: 480 }}>
                Salom Nigora opa. May oyi yakuniy hisobotini 23 gacha topshirsangiz bo‘ladimi?
                <div style={{ marginTop: 6, fontSize: 9.5, color: 'var(--sf-muted)' }}>11:08</div>
              </div>
            </div>

            <div className="web-chat-out" style={{ maxWidth: 480 }}>
              Albatta. Bugun ertalab Up/Down kartalar va davomatni tahlil qilib, yopiq hisobotni jo‘nataman.
              <div style={{ marginTop: 6, fontSize: 9.5, opacity: 0.8, textAlign: 'right' }}>11:14 ✓✓</div>
            </div>

            <div className="web-mgmt-card-call">
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--sf-accent-soft)',
                color: 'var(--sf-accent-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{React.cloneElement(Icons.flag, { size: 16 })}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--sf-muted)', letterSpacing: '0.06em',
                                textTransform: 'uppercase', fontWeight: 700 }}>Topshiriq · direktordan</div>
                <div style={{ marginTop: 2, fontSize: 14, fontWeight: 700 }}>May hisoboti</div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                  Muddat: <span className="sf-mono" style={{ color: 'var(--sf-danger)', fontWeight: 700 }}>23.05 · 18:00</span>
                </div>
              </div>
              <button className="web-btn web-btn-soft" onClick={() => onNav('tasks')}>
                Vazifaga {React.cloneElement(Icons.arrowR, { size: 12 })}
              </button>
            </div>

            <div className="web-chat-in-wrap">
              <SfAvatar name={cur.n} size={28} />
              <div className="web-chat-in" style={{ background: 'var(--sf-surface)', maxWidth: 480 }}>
                Rahmat. Yana bitta — ertaga 14:00 da yig‘ilish, oddiy holat bo‘yicha.
                <div style={{ marginTop: 6, fontSize: 9.5, color: 'var(--sf-muted)' }}>14:08</div>
              </div>
            </div>
          </div>

          <div className="web-ai-input">
            <button className="web-icon-btn">{React.cloneElement(Icons.attach, { size: 16 })}</button>
            <span style={{ flex: 1, color: 'var(--sf-muted)' }}>{cur.n} ga yozish...</span>
            <button className="web-icon-btn-primary">{React.cloneElement(Icons.send, { size: 16 })}</button>
          </div>
        </div>
      </div>

      <style>{`
        .web-mgmt-layout { display: grid; grid-template-columns: 320px 1fr; gap: 16px;
                            height: calc(100vh - 230px); min-height: 600px; }
        @media (max-width: 900px) { .web-mgmt-layout { grid-template-columns: 1fr; } .web-mgmt-chat { display: none; } }
        .web-mgmt-list { overflow-y: auto; }
        .web-mgmt-thread {
          display: flex; gap: 10px; padding: 12px 14px; align-items: flex-start;
          border-bottom: 1px solid var(--sf-border); cursor: pointer;
          transition: background 0.12s;
        }
        .web-mgmt-thread:hover { background: var(--sf-surface-2); }
        .web-mgmt-thread.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
        .web-online-dot {
          position: absolute; right: -2px; bottom: -2px; width: 12px; height: 12px;
          border-radius: 50%; background: var(--sf-success); border: 2.5px solid var(--sf-surface);
        }
        .web-mgmt-chat {
          display: flex; flex-direction: column; min-width: 0;
          background: var(--sf-surface); border: 1px solid var(--sf-border);
          border-radius: 16px; overflow: hidden;
        }
        .web-mgmt-card-call {
          align-self: flex-start; max-width: 480px; padding: 12px;
          background: var(--sf-surface); border: 1px solid var(--sf-accent);
          border-radius: 12px; display: flex; gap: 10px; align-items: center;
        }
      `}</style>
    </>
  );
}

function NotifPage({ onNav }) {
  const groups = [
    {
      label: 'Bugun', items: [
        { tone: 'ai', icon: 'AI', title: 'AI tavsiyasi', body: '9-B uchun ertangi darsda kvadrat tenglamalarni qisqa qaytarish tavsiya etiladi.', t: '08:42' },
        { tone: 'primary', icon: Icons.check, title: 'Davomat saqlandi', body: 'Algebra Mid · 21/22 belgilandi.', t: '10:05' },
        { tone: 'success', icon: Icons.print, title: 'Print tayyor', body: 'Kvadrat tenglamalar · 24 nusxa · HP LaserJet · lobbi', t: '11:24' },
        { tone: 'accent', icon: Icons.chat, title: 'Ota-onadan xabar', body: 'Akbarova D. (Akmal ona) sizga yozdi · 9-B', t: '11:14' },
        { tone: 'warn', icon: Icons.flag, title: 'Eshmatov Otabek · 3-Down karta', body: '9-B Algebra · ota-onaga avtomatik xabar yuborildi.', t: '11:42' },
      ]
    },
    {
      label: 'Kecha', items: [
        { tone: 'success', icon: Icons.print, title: 'Print tugadi', body: 'Yulduz karta · 12 nusxa · A5 rangli · Xerox WC Pro', t: 'Du · 16:50' },
        { tone: 'ai', icon: 'AI', title: 'Suhbat · 10-V', body: '“Trapetsiya mavzusi yaxshi tushunilgan. 11-misol uchun ekstra…”', t: 'Du · 15:20' },
        { tone: 'primary', icon: Icons.chat, title: 'O‘quvchidan savol', body: 'Halimova Zilola sizga yozdi · uy ishi', t: 'Du · 14:08' },
        { tone: 'neutral', icon: Icons.upload, title: 'Haftalik hisobot', body: '14 May – 19 May · yuklab olishga tayyor.', t: 'Du · 09:00' },
      ]
    },
  ];
  const tones = {
    ai:      { bg: 'var(--sf-ai-bg)', fg: 'var(--sf-ai)', border: 'var(--sf-ai-border)' },
    primary: { bg: 'var(--sf-primary-soft)', fg: 'var(--sf-primary-ink)', border: 'transparent' },
    accent:  { bg: 'var(--sf-accent-soft)', fg: 'var(--sf-accent-ink)', border: 'transparent' },
    success: { bg: 'var(--sf-success-soft)', fg: 'var(--sf-success)', border: 'transparent' },
    warn:    { bg: 'var(--sf-warn-soft)', fg: 'var(--sf-warn)', border: 'transparent' },
    neutral: { bg: 'var(--sf-surface-2)', fg: 'var(--sf-ink-2)', border: 'transparent' },
  };

  return (
    <>
      <WebPageHeader
        title="Bildirishnomalar"
        subtitle="9 ta · 4 ta yangi"
        right={
          <div className="web-filter-strip" style={{ padding: 0 }}>
            {[
              { l: 'Hammasi', n: 9, on: true }, { l: 'AI', n: 2 }, { l: 'Print', n: 2 }, { l: 'Xabar', n: 2 },
            ].map(f => (
              <div key={f.l} className={`web-filter-chip ${f.on ? 'on' : ''}`}>{f.l} · {f.n}</div>
            ))}
          </div>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760, margin: '0 auto' }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            <div className="web-section-h" style={{ marginBottom: 10 }}>{g.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map((it, i) => {
                const c = tones[it.tone];
                return (
                  <div key={i} className="web-notif-row">
                    <div className="web-notif-icon" style={{ background: c.bg, color: c.fg, borderColor: c.border }}>
                      {it.icon === 'AI' ? <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 600, fontSize: 14 }}>Ai</span>
                                          : React.cloneElement(it.icon, { size: 18 })}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</span>
                        <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)', whiteSpace: 'nowrap' }}>{it.t}</span>
                      </div>
                      <div style={{ marginTop: 3, fontSize: 13, color: 'var(--sf-muted)', lineHeight: 1.45 }}>{it.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .web-notif-row {
          display: flex; gap: 14px; padding: 14px 18px;
          background: var(--sf-surface); border: 1px solid var(--sf-border);
          border-radius: 14px;
          transition: background 0.12s;
        }
        .web-notif-row:hover { background: var(--sf-surface-2); }
        .web-notif-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid transparent; flex-shrink: 0;
        }
      `}</style>
    </>
  );
}

function CardsPage({ onNav }) {
  const recent = [
    { st: 'Akbarov Akmal', cohort: '9-B Algebra', type: 'Yulduz karta', kind: 'up', reason: 'Mustaqil yechim · 3-misol', t: '09:42' },
    { st: 'Halimova Zilola', cohort: '9-B Algebra', type: 'Aktivlik', kind: 'up', reason: 'Sinfdoshlariga yordam berdi', t: '09:38' },
    { st: 'Eshmatov Otabek', cohort: '9-B Algebra', type: 'Ogohlantirish', kind: 'down', reason: 'Uy ishi tayyor emas (2-marta)', t: '09:12' },
    { st: 'Davronova Sevinch', cohort: 'Algebra · Mid', type: 'Yulduz karta', kind: 'up', reason: 'Toza daftar', t: 'Dush · 14:20' },
    { st: 'Bakirov Sherzod', cohort: 'Algebra · Mid', type: 'Ogohlantirish', kind: 'down', reason: 'Darsda telefon bilan', t: 'Dush · 11:05' },
    { st: 'Azizova Madina', cohort: '9-B Algebra', type: 'Yulduz karta', kind: 'up', reason: 'Olimpiada 2-bosqich', t: 'Yak · 18:40' },
  ];
  return (
    <>
      <WebPageHeader
        title="Kartalar"
        subtitle="Bu hafta · 14 ta berildi · markaz qoidasiga ko‘ra"
        right={<button className="web-btn web-btn-primary">{React.cloneElement(Icons.plus, { size: 14 })} Karta berish</button>}
      />

      <div className="web-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <WebStat v="↑11" l="Up kartalar · bu hafta" c="#7A4F0E" trend={{ up: true, v: '+3' }} />
        <WebStat v="↓3" l="Down kartalar · bu hafta" c="var(--sf-danger)" />
        <WebStat v="58" l="Olgan o‘quvchi" />
        <WebStat v="6" l="Karta turi · markaz" sub="v2.3" />
      </div>

      <div className="web-cards-page-grid">
        <div>
          <h3 className="web-section-h">So‘nggi faollik · 14 ta</h3>
          <WebCard padded={false}>
            {recent.map((c, i, a) => (
              <div key={i} className="web-card-row">
                <div className="web-mini-card" style={{
                  background: c.kind === 'up' ? 'linear-gradient(135deg, #F6E0AC, #E9C272)'
                                                : 'linear-gradient(135deg, #F0C9BE, #D88A75)',
                  borderColor: c.kind === 'up' ? '#C49A3A' : '#A14026',
                }}>
                  <SfStar size={16} color={c.kind === 'up' ? '#7A4F0E' : '#5C1A0C'} />
                  <span style={{ fontSize: 8, fontWeight: 800, color: c.kind === 'up' ? '#7A4F0E' : '#5C1A0C' }}>
                    {c.kind === 'up' ? '↑ UP' : '↓ DOWN'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.st}</span>
                    <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{c.cohort}</span>
                  </div>
                  <div style={{ marginTop: 2, fontSize: 12, color: c.kind === 'up' ? 'var(--sf-accent-ink)' : 'var(--sf-danger)', fontWeight: 600 }}>
                    {c.type}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--sf-ink-2)', fontStyle: 'italic' }}>
                    “{c.reason}”
                  </div>
                </div>
                <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{c.t}</span>
              </div>
            ))}
          </WebCard>
        </div>

        <div>
          <h3 className="web-section-h">Karta turlari · markaz sozlamasi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: 'Yulduz karta', s: 'Asosiy +', kind: 'up', cnt: 5 },
              { n: 'Aktivlik', s: 'Darsda ishtirok', kind: 'up', cnt: 3 },
              { n: 'Yordamchi', s: 'Sinfdosh yordami', kind: 'up', cnt: 2 },
              { n: 'Toza ish', s: 'Daftar / vazifa', kind: 'up', cnt: 1 },
              { n: 'Ogohlantirish', s: 'Asosiy −', kind: 'down', cnt: 2 },
              { n: 'Mas‘uliyatsizlik', s: 'Uy ishi · kechikish', kind: 'down', cnt: 1 },
            ].map((t, i) => {
              const isUp = t.kind === 'up';
              return (
                <div key={i} className="web-card-type">
                  <div className="web-mini-card" style={{
                    background: isUp ? 'linear-gradient(135deg, #F6E0AC, #E9C272)'
                                       : 'linear-gradient(135deg, #F0C9BE, #D88A75)',
                    borderColor: isUp ? '#C49A3A' : '#A14026',
                  }}>
                    <SfStar size={14} color={isUp ? '#7A4F0E' : '#5C1A0C'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.n}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{t.s}</div>
                  </div>
                  <span className="sf-mono" style={{ fontSize: 13, fontWeight: 700,
                                                       color: isUp ? '#7A4F0E' : 'var(--sf-danger)' }}>
                    {isUp ? '↑' : '↓'}{t.cnt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .web-cards-page-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .web-cards-page-grid { grid-template-columns: 1fr; } }
        .web-card-row {
          display: flex; gap: 12px; padding: 14px 18px; align-items: flex-start;
          border-bottom: 1px solid var(--sf-border);
        }
        .web-card-row:last-child { border-bottom: none; }
        .web-mini-card {
          width: 36px; height: 48px; border-radius: 5px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          flex-shrink: 0; border: 1px solid; padding: 2px;
        }
        .web-card-type {
          display: flex; gap: 12px; padding: 12px 14px; align-items: center;
          background: var(--sf-surface); border: 1px solid var(--sf-border);
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}

function MaterialsPage({ onNav }) {
  return (
    <>
      <WebPageHeader title="Materiallar" subtitle="84 fayl · 2.1 GB / 12.5 GB"
        right={<button className="web-btn web-btn-primary">{React.cloneElement(Icons.upload, { size: 14 })} Yuklash</button>} />
      <div className="web-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <WebStat v="42" l="PDF" c="var(--sf-danger)" />
        <WebStat v="18" l="Video" c="var(--sf-primary)" />
        <WebStat v="24" l="Mashq" c="var(--sf-accent)" />
        <WebStat v="12" l="Test" c="var(--sf-success)" />
      </div>
      <WebCard title="So‘nggi yuklangan" padded={false}>
        {[
          { t: 'Kvadrat tenglama · slayd.pdf', m: '2.1 MB · 8 bet', icon: Icons.pdf, c: 'var(--sf-danger)', v: 142, d: '14 May', ai: true },
          { t: 'Funksiyalar grafigi.mp4', m: '24 MB · 6:42', icon: Icons.video, c: 'var(--sf-primary)', v: 89, d: '12 May' },
          { t: 'Mashqlar to‘plami.docx', m: '340 KB · 12 bet', icon: Icons.doc, c: 'var(--sf-accent)', v: 256, d: '8 May' },
          { t: 'Olimpiada masalalari.pdf', m: '1.8 MB', icon: Icons.pdf, c: 'var(--sf-danger)', v: 24, d: '2 May' },
        ].map((f, i, a) => (
          <div key={i} className="web-mat-row">
            <div style={{ width: 44, height: 56, background: f.c, color: '#FFFCF5', borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {React.cloneElement(f.icon, { size: 22 })}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>{f.t}</span>
                {f.ai && <WebChip tone="ai">AI xulosa</WebChip>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 2 }}>
                <span className="sf-mono">{f.m}</span> · {f.v} ko‘rildi · {f.d}
              </div>
            </div>
            <button className="web-icon-btn">{React.cloneElement(Icons.download, { size: 16 })}</button>
            <button className="web-icon-btn" onClick={() => onNav('print')}>{React.cloneElement(Icons.print, { size: 16 })}</button>
            <button className="web-icon-btn">{Icons.more}</button>
          </div>
        ))}
      </WebCard>
      <style>{`
        .web-mat-row {
          display: flex; gap: 14px; padding: 14px 18px; align-items: center;
          border-bottom: 1px solid var(--sf-border);
        }
        .web-mat-row:last-child { border-bottom: none; }
      `}</style>
    </>
  );
}

Object.assign(window, { MgmtPage, NotifPage, CardsPage, MaterialsPage });
