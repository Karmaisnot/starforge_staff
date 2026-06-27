// family-app.jsx — Unified Parent / Student app (web). One app, two roles,
// permission-driven. Uses sf-control (10 themes, 5 layouts, reorder, toasts)
// + admin-common primitives + tf-components. Every control is live.

const FAM_T = (m, o) => window.sfToast && window.sfToast(m, o);

const FAM_ROLES = {
  parent: {
    label: 'Ota-ona', who: 'Akbarova Dilnoza', sub: 'Akmal · 9-B ona', accent: 'var(--sf-primary)',
    nav: [
      { id: 'home', l: 'Bosh sahifa', icon: Icons.home },
      { id: 'child', l: 'Farzandim', icon: Icons.user },
      { id: 'attendance', l: 'Davomat', icon: Icons.check },
      { id: 'cards', l: 'Kartalar', icon: Icons.brand },
      { id: 'schedule', l: 'Jadval', icon: Icons.cal },
      { id: 'payments', l: 'To‘lovlar', icon: Icons.trend, n: 1 },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 2 },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
  student: {
    label: 'O‘quvchi', who: 'Akbarov Akmal', sub: '9-B · 14 yosh', accent: 'var(--sf-accent)',
    nav: [
      { id: 'home', l: 'Bugun', icon: Icons.home },
      { id: 'groups', l: 'Guruhlarim', icon: Icons.cohort, n: 3 },
      { id: 'attendance', l: 'Davomatim', icon: Icons.check },
      { id: 'cards', l: 'Kartalarim', icon: Icons.brand },
      { id: 'materials', l: 'Materiallar', icon: Icons.folder },
      { id: 'schedule', l: 'Jadval', icon: Icons.cal },
      { id: 'messages', l: 'Xabarlar', icon: Icons.chat, n: 1 },
      { id: 'ai', l: 'AI repetitor', icon: Icons.ai },
      { id: 'settings', l: 'Sozlamalar', icon: Icons.settings },
    ],
  },
};
const FAM_ORDER = ['parent', 'student'];

// ── HOME ────────────────────────────────────────────────────
function FamHome({ role, onNav }) {
  const cfg = FAM_ROLES[role];
  const isP = role === 'parent';
  return (
    <>
      <FamH eyebrow={'Seshanba · 19 May'} title={<>Assalomu alaykum, <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>{cfg.who.split(' ')[0]}</span></>}
        sub={isP ? 'Farzandingiz · Akmal bugun maktabda' : 'Bugun 3 ta darsing bor'}
        right={<FamBtn kind="primary" accent={cfg.accent} onClick={() => onNav('messages')}>{React.cloneElement(Icons.chat, { size: 14 })} {isP ? 'Ustozga yozish' : 'Ustozga'}</FamBtn>} />
      <div className="fam-kpis">
        <FamKpi l="Davomat" v="96%" c="var(--sf-success)" ic={Icons.check} />
        <FamKpi l={isP ? 'Up kartalar' : 'Mening kartalarim'} v="↑12" c="#7A4F0E" ic={Icons.brand} />
        <FamKpi l="Down" v="↓1" c="var(--sf-danger)" />
        {isP ? <FamKpi l="Keyingi to‘lov" v="25 May" c="var(--sf-warn)" ic={Icons.trend} /> : <FamKpi l="O‘rin · sinf" v="#2" c="var(--sf-accent)" />}
      </div>
      <div className="fam-grid2">
        <div className="fam-col">
          <div className="fam-hero" style={{ background: `linear-gradient(135deg, ${cfg.accent} 0%, color-mix(in oklab, ${cfg.accent} 78%, black) 100%)` }}>
            <SfStar size={150} color="#fff" style={{ position: 'absolute', right: -34, top: -34, opacity: 0.16 }} />
            <div style={{ position: 'relative' }}>
              <div className="fam-hero-eye">{isP ? 'Farzandingiz · hozir' : 'Keyingi dars · 14 daqiqada'}</div>
              <div className="fam-hero-t">Algebra · 9-B</div>
              <div className="fam-hero-s">09:00–09:45 · Xona 304 · Nigora Karimova</div>
              <div className="fam-hero-acts">
                <button className="fam-hero-btn" onClick={() => onNav('schedule')}>To‘liq jadval</button>
                <button className="fam-hero-btn ghost" onClick={() => onNav(isP ? 'attendance' : 'materials')}>{isP ? 'Davomat tarixi' : 'Materiallar'}</button>
              </div>
            </div>
          </div>
          <FamCard title={isP ? 'Akmalning so‘nggi kartalari' : 'So‘nggi kartalarim'} action={<a className="fam-link" onClick={() => onNav('cards')}>Hammasi ›</a>}>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px' }}>
              <SfCard kind="up" size="sm" recipient="Akbarov A." reason="Mustaqil yechim" issuer="N.K." when="09:42" typeName="Yulduz" />
              <SfCard kind="up" size="sm" recipient="Akbarov A." reason="Aktivlik" issuer="N.K." when="Du" typeName="Aktivlik" />
              <SfCard kind="down" size="sm" recipient="Akbarov A." reason="Uy ishi" issuer="N.K." when="8 May" typeName="Ogohl." />
            </div>
          </FamCard>
        </div>
        <div className="fam-col">
          {isP && (
            <div className="fam-pay" onClick={() => onNav('payments')}>
              <div className="fam-pay-top"><span className="fam-pay-l">Keyingi to‘lov</span><Pill tone="warn">5 kun qoldi</Pill></div>
              <div className="fam-pay-amt"><Money uzs={600000} /></div>
              <div className="fam-pay-sub">Iyun oyi · 9-B Algebra · 25.05 gacha</div>
              <button className="fam-pay-btn" onClick={(e) => { e.stopPropagation(); FAM_T('To‘lovga yo‘naltirilmoqda...', { tone: 'info', sub: 'Click / Payme' }); }}>To‘lash</button>
            </div>
          )}
          <FamCard title={isP ? 'Ustozdan xabar' : 'AI repetitor'}>
            {isP ? (
              <div className="fam-msg-prev" onClick={() => onNav('messages')}>
                <SfAvatar name="Nigora Karimova" size={36} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 700 }}>Nigora Karimova</div><div style={{ fontSize: 11.5, color: 'var(--sf-muted)' }}>"Akmal bugun a'lo ishladi!"</div></div>
                <span className="fam-unread">2</span>
              </div>
            ) : (
              <div className="fam-ai-prev" onClick={() => onNav('ai')}>
                <SfAiBadge>Repetitor</SfAiBadge>
                <div className="fam-ai-q">“Kvadrat tenglamalarni mashq qilaylik. 3 ta misol tayyorladim — boshlaymizmi?”</div>
                <button className="fam-ai-btn" onClick={(e) => { e.stopPropagation(); onNav('ai'); }}>Boshlash</button>
              </div>
            )}
          </FamCard>
          <FamCard title="Bugungi jadval">
            {[['09:00', 'Algebra', 'now'], ['10:00', 'Geometriya', ''], ['11:30', 'Ingliz tili', '']].map((r, i, a) => (
              <div key={i} className="fam-srow" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
                <span className="sf-mono" style={{ width: 44, fontSize: 12.5, fontWeight: 600, color: 'var(--sf-ink-2)' }}>{r[0]}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r[1]}</span>
                {r[2] === 'now' && <Pill tone="primary">Hozir</Pill>}
              </div>
            ))}
          </FamCard>
        </div>
      </div>
      <style>{famStyles}</style>
    </>
  );
}

// ── ATTENDANCE (view) ───────────────────────────────────────
function FamAttendance({ role }) {
  const days = [['19 May', 'Se', 'present'], ['18 May', 'Du', 'present'], ['15 May', 'Ju', 'late'], ['14 May', 'Pa', 'present'], ['13 May', 'Ch', 'present'], ['12 May', 'Se', 'absent'], ['11 May', 'Du', 'present']];
  const tone = { present: ['success', 'Bor'], late: ['warn', 'Kechikdi'], absent: ['danger', 'Yo‘q'] };
  return (
    <>
      <FamH eyebrow={role === 'parent' ? 'Akmal · 9-B' : 'Mening davomatim'} title="Davomat" sub="Oxirgi 30 kun · 96% ishtirok" />
      <div className="fam-kpis"><FamKpi l="Ishtirok" v="96%" c="var(--sf-success)" /><FamKpi l="Kechikish" v="2" c="var(--sf-warn)" /><FamKpi l="Sababsiz" v="1" c="var(--sf-danger)" /><FamKpi l="Jami dars" v="48" /></div>
      <FamCard title="Kunlik tarix">
        {days.map((d, i, a) => (
          <div key={i} className="fam-att-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
            <span className="sf-mono" style={{ width: 70, fontSize: 12.5, color: 'var(--sf-muted)' }}>{d[0]}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>Algebra · 9-B</span>
            <Pill tone={tone[d[2]][0]} dot>{tone[d[2]][1]}</Pill>
          </div>
        ))}
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}

// ── CARDS ───────────────────────────────────────────────────
function FamCards({ role }) {
  const cards = [['Yulduz karta', 'up', 'Mustaqil yechim · 3-misol', '19 May'], ['Aktivlik', 'up', 'Sinfdoshlarga yordam', '17 May'], ['Yulduz karta', 'up', 'Toza daftar', '12 May'], ['Ogohlantirish', 'down', 'Uy ishi tayyor emas', '8 May'], ['Yulduz karta', 'up', 'Olimpiada 2-bosqich', '5 May']];
  return (
    <>
      <FamH eyebrow={role === 'parent' ? 'Akmal · 9-B' : 'Mening yutuqlarim'} title="Kartalar" sub="12 Up · 1 Down · bu oy"
        right={<Pill tone="success">↑ 12 Up karta</Pill>} />
      <div className="fam-cards-hero">
        <SfCard kind="up" size="lg" recipient="Akbarov Akmal" reason="Mustaqil yechim · 3-misol" issuer="N. Karimova" when="19.05 · 09:42" typeName="Yulduz karta" />
        <div className="fam-cards-stats">
          <div className="fam-cs"><span className="sf-mono" style={{ fontSize: 28, fontWeight: 700, color: '#7A4F0E' }}>↑12</span><span className="fam-cs-l">Up karta</span></div>
          <div className="fam-cs"><span className="sf-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--sf-danger)' }}>↓1</span><span className="fam-cs-l">Down karta</span></div>
          <div className="fam-cs"><span className="sf-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--sf-accent)' }}>#2</span><span className="fam-cs-l">Sinfda o‘rin</span></div>
        </div>
      </div>
      <FamCard title="Karta tarixi">
        {cards.map((c, i, a) => (
          <div key={i} className="fam-att-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
            <span className="fam-cmark" style={{ background: c[1] === 'up' ? 'linear-gradient(135deg,#F6E0AC,#E9C272)' : 'linear-gradient(135deg,#F0C9BE,#D88A75)' }}><SfStar size={11} color={c[1] === 'up' ? '#7A4F0E' : '#5C1A0C'} /></span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: c[1] === 'up' ? 'var(--sf-ink)' : 'var(--sf-danger)' }}>{c[0]}</div><div style={{ fontSize: 11.5, color: 'var(--sf-muted)', fontStyle: 'italic' }}>“{c[2]}”</div></div>
            <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{c[3]}</span>
          </div>
        ))}
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}

// ── PAYMENTS (parent) ───────────────────────────────────────
function FamPayments() {
  const hist = [['May', 600000, 'Click', 'paid', '7 May'], ['Aprel', 600000, 'Payme', 'paid', '4 Apr'], ['Mart', 600000, 'Naqd', 'paid', '6 Mar'], ['Iyun', 600000, '—', 'due', '25 May']];
  const st = { paid: ['success', 'To‘langan'], due: ['warn', 'Kutilmoqda'] };
  return (
    <>
      <FamH eyebrow="Akmal · 9-B Algebra" title="To‘lovlar" sub="To‘lov tarixi va keyingi to‘lov"
        right={<FamBtn kind="primary" onClick={() => FAM_T('To‘lov oynasi ochildi', { tone: 'info', sub: 'Click / Payme / Uzcard' })}>{React.cloneElement(Icons.trend, { size: 14 })} To‘lash</FamBtn>} />
      <div className="fam-pay-big">
        <div className="fam-pay-big-l">
          <div className="fam-pay-l">Keyingi to‘lov · Iyun</div>
          <div className="fam-pay-big-amt"><Money uzs={600000} /></div>
          <div className="fam-pay-sub">25.05.2026 gacha · 5 kun qoldi</div>
        </div>
        <div className="fam-pay-methods">
          {['Click', 'Payme', 'Uzcard'].map(m => <button key={m} className="fam-pay-method" onClick={() => FAM_T(m + ' orqali to‘lov', { tone: 'info' })}>{m}</button>)}
        </div>
      </div>
      <FamCard title="To‘lov tarixi">
        {hist.map((h, i, a) => (
          <div key={i} className="fam-att-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
            <span style={{ width: 60, fontSize: 13, fontWeight: 700 }}>{h[0]}</span>
            <div style={{ flex: 1 }}><Money uzs={h[1]} style={{ fontWeight: 700 }} /><span style={{ fontSize: 11, color: 'var(--sf-muted)', marginLeft: 8 }}>{h[2]}</span></div>
            <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)', marginRight: 10 }}>{h[4]}</span>
            <Pill tone={st[h[3]][0]} dot>{st[h[3]][1]}</Pill>
          </div>
        ))}
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}

// ── GROUPS / MATERIALS / SCHEDULE / MESSAGES / AI ───────────
function FamGroups() {
  const g = [['9-B Algebra', 'Nigora Karimova', 94, 'var(--sf-primary)'], ['10-V Geometriya', 'Bobur Aliyev', 88, 'var(--sf-accent)'], ['Ingliz B2', 'Aziz Tursunov', 92, 'var(--sf-success)']];
  return (
    <>
      <FamH eyebrow="9-B · 14 yosh" title="Guruhlarim" sub="3 ta guruh" />
      <div className="fam-groups">
        {g.map((x, i) => (
          <div key={i} className="fam-group" onClick={() => FAM_T(x[0], { tone: 'info' })}>
            <div className="fam-group-mark" style={{ background: x[3] }}><SfStar size={18} color="#fff" /></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 800 }}>{x[0]}</div><div style={{ fontSize: 11.5, color: 'var(--sf-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}><SfAvatar name={x[1]} size={15} /> {x[1]}</div></div>
            <div style={{ textAlign: 'right' }}><div className="sf-mono" style={{ fontSize: 15, fontWeight: 700, color: x[2] >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)' }}>{x[2]}%</div><div style={{ fontSize: 9, color: 'var(--sf-muted)', textTransform: 'uppercase' }}>davomat</div></div>
          </div>
        ))}
      </div>
      <style>{famStyles}</style>
    </>
  );
}
function FamMaterials() {
  const f = [['Kvadrat tenglama.pdf', 'PDF · 8 bet', Icons.pdf, 'var(--sf-danger)'], ['Funksiyalar.mp4', 'Video · 6:42', Icons.video, 'var(--sf-primary)'], ['Mashqlar.docx', '12 bet', Icons.doc, 'var(--sf-accent)']];
  return (
    <>
      <FamH eyebrow="9-B Algebra" title="Materiallar" sub="Ustoz yuklagan fayllar" />
      <FamCard title="Fayllar">
        {f.map((x, i, a) => (
          <div key={i} className="fam-mat" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
            <div className="fam-mat-ic" style={{ background: x[3] }}>{React.cloneElement(x[2], { size: 19, style: { color: '#fff' } })}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{x[0]}</div><div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{x[1]}</div></div>
            <button className="fam-icon-b" onClick={() => FAM_T('Yuklab olindi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 16 })}</button>
          </div>
        ))}
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}
function FamSchedule() {
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju'];
  const lessons = { 'Du-0': ['Algebra', 'var(--sf-primary)'], 'Se-0': ['Algebra', 'var(--sf-primary)'], 'Se-1': ['Geom', 'var(--sf-accent)'], 'Ch-0': ['Ingliz', 'var(--sf-success)'], 'Pa-0': ['Algebra', 'var(--sf-primary)'], 'Ju-1': ['Geom', 'var(--sf-accent)'] };
  return (
    <>
      <FamH eyebrow="Bu hafta" title="Jadval" sub="9-B · haftalik dars jadvali" />
      <FamCard title="Haftalik">
        <div className="fam-sched">
          {days.map(d => (
            <div key={d} className="fam-sched-day">
              <div className="fam-sched-dh">{d}</div>
              {[0, 1, 2].map(slot => {
                const l = lessons[d + '-' + slot];
                return <div key={slot} className="fam-sched-cell">{l && <div className="fam-sched-l" style={{ background: l[1] }}>{l[0]}</div>}</div>;
              })}
            </div>
          ))}
        </div>
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}
function FamMessages({ role }) {
  const [txt, setTxt] = React.useState('');
  const send = () => { if (!txt.trim()) { FAM_T('Xabar bo‘sh', { tone: 'warn' }); return; } FAM_T('Yuborildi', { tone: 'success', sub: 'Nigora Karimova' }); setTxt(''); };
  return (
    <>
      <FamH eyebrow={role === 'parent' ? 'Ota-ona' : 'O‘quvchi'} title="Xabarlar" sub="Ustoz bilan to‘g‘ridan-to‘g‘ri" />
      <div className="fam-chat">
        <div className="fam-chat-h"><SfAvatar name="Nigora Karimova" size={38} /><div><div style={{ fontSize: 14, fontWeight: 700 }}>Nigora Karimova</div><div style={{ fontSize: 11, color: 'var(--sf-success)' }}>● onlayn · Matematika</div></div></div>
        <div className="fam-chat-body">
          <div className="fam-bub in">Assalomu alaykum! Akmal bugun a'lo ishladi 🌟<div className="fam-bt">09:48</div></div>
          <div className="fam-bub out">Rahmat ustoz! Juda xursandmiz.<div className="fam-bt" style={{ color: 'rgba(255,252,245,.7)' }}>10:02</div></div>
          <div className="fam-bub in">Uy ishini ertaga tekshiramiz.<div className="fam-bt">10:05</div></div>
        </div>
        <div className="fam-chat-input">
          <input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Xabar yozing..." />
          <button onClick={send}>{React.cloneElement(Icons.send, { size: 16 })}</button>
        </div>
      </div>
      <style>{famStyles}</style>
    </>
  );
}
function FamAI() {
  const [q, setQ] = React.useState('');
  const ask = () => { if (!q.trim()) { FAM_T('Savol yozing', { tone: 'warn' }); return; } FAM_T('AI javob bermoqda...', { tone: 'info' }); setQ(''); };
  return (
    <>
      <FamH eyebrow="AI repetitor" title={<>AI <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>repetitor</span></>} sub="Darslaringizda yordam beradi" />
      <div className="fam-chat" style={{ minHeight: 440 }}>
        <div className="fam-chat-body" style={{ flex: 1 }}>
          <div className="fam-bub out">Kvadrat tenglamani qanday yechaman?</div>
          <div className="fam-bub in"><span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontSize: 15 }}>Oson!</span> Diskriminant formulasidan boshlaymiz: D = b² − 4ac. Keling, birga misol yechamiz: x² − 5x + 6 = 0</div>
          <div className="fam-bub out">D = 25 − 24 = 1</div>
          <div className="fam-bub in">Aynan to‘g‘ri! 🎯 Endi ildizlarni toping: x = (5 ± 1) / 2</div>
        </div>
        <div className="fam-ai-chips">{['Yana misol', 'Tushuntir', 'Test qil'].map(p => <button key={p} onClick={() => FAM_T(p, { tone: 'info' })}>{p}</button>)}</div>
        <div className="fam-chat-input">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Savolingni yoz..." />
          <button onClick={ask}>{React.cloneElement(Icons.send, { size: 16 })}</button>
        </div>
      </div>
      <style>{famStyles}</style>
    </>
  );
}
function FamChild() {
  return (
    <>
      <FamH eyebrow="Farzandim" title="Akbarov Akmal" sub="9-B · 14 yosh · DEMO-2026-00042"
        right={<FamBtn kind="primary" onClick={() => FAM_T('Ustozga xabar', { tone: 'info' })}>{React.cloneElement(Icons.chat, { size: 14 })} Ustozga</FamBtn>} />
      <div className="fam-child-hero">
        <SfAvatar name="Akbarov Akmal" size={72} color="var(--sf-primary)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Akbarov Akmal</div>
          <div style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>9-B Algebra · Nigora Karimova</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}><Pill tone="success">96% davomat</Pill><Pill tone="accent">#2 sinfda</Pill></div>
        </div>
      </div>
      <div className="fam-kpis" style={{ marginTop: 14 }}>
        <FamKpi l="Davomat" v="96%" c="var(--sf-success)" /><FamKpi l="Up karta" v="↑12" c="#7A4F0E" /><FamKpi l="Down" v="↓1" c="var(--sf-danger)" /><FamKpi l="Guruh" v="3" />
      </div>
      <FamCard title="Ustozning izohi">
        <div style={{ padding: '4px 2px', fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.4, color: 'var(--sf-ink)' }}>
          “Akmal — sinfning eng kuchli o‘quvchilaridan. Kvadrat tenglamalarni tez o‘zlashtirdi. Olimpiadaga tayyorlamoqchiman.”
        </div>
      </FamCard>
      <style>{famStyles}</style>
    </>
  );
}

function FamSettings({ role }) {
  const ctl = useControl();
  const [tg, setTg] = React.useState({ push: true, att: true, card: true, pay: true });
  const tog = (k) => { setTg(s => ({ ...s, [k]: !s[k] })); FAM_T(tg[k] ? 'O‘chirildi' : 'Yoqildi', { tone: tg[k] ? 'default' : 'success' }); };
  return (
    <>
      <FamH eyebrow={FAM_ROLES[role].label} title="Sozlamalar" sub={FAM_ROLES[role].who}
        right={<FamBtn kind="primary" onClick={() => ctl.setPanel(true)}>{React.cloneElement(Icons.brand, { size: 14 })} Ko‘rinish</FamBtn>} />
      <div className="fam-set-grid">
        <FamCard title="Profil">
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 2px' }}>
            <SfAvatar name={FAM_ROLES[role].who} size={52} color={FAM_ROLES[role].accent} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800 }}>{FAM_ROLES[role].who}</div><div style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{FAM_ROLES[role].sub}</div></div>
            <FamBtn onClick={() => FAM_T('Profil tahriri', { tone: 'info' })}>Tahrir</FamBtn>
          </div>
        </FamCard>
        <FamCard title="Bildirishnomalar">
          {[['push', 'Push xabarlar'], ['att', 'Davomat'], ['card', 'Yangi kartalar'], ['pay', 'To‘lov eslatmasi']].map((r, i, a) => (
            <div key={r[0]} className="fam-set-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
              <span style={{ fontSize: 13 }}>{r[1]}</span>
              <div className={'sp-toggle' + (tg[r[0]] ? ' on' : '')} onClick={() => tog(r[0])}><i /></div>
            </div>
          ))}
        </FamCard>
        <FamCard title="Ko‘rinish">
          {[['Rang', SF_PALETTES.find(p => p.id === ctl.st.palette)?.n], ['Layout', SF_LAYOUTS.find(l => l.id === ctl.st.layout)?.n], ['Rejim', ctl.st.dark ? 'Qorong‘i' : 'Yorug‘'], ['Til', 'O‘zbekcha']].map((r, i, a) => (
            <div key={i} className="fam-set-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none', cursor: 'pointer' }} onClick={() => ctl.setPanel(true)}>
              <span style={{ fontSize: 13 }}>{r[0]}</span><span style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{r[1]} ›</span>
            </div>
          ))}
        </FamCard>
      </div>
      <button className="fam-btn fam-btn-ghost" style={{ marginTop: 16, color: 'var(--sf-danger)' }} onClick={() => FAM_T('Chiqildi', { tone: 'default' })}>{React.cloneElement(Icons.logout, { size: 14 })} Chiqish</button>
      <style>{famStyles}</style>
    </>
  );
}

// ── atoms ───────────────────────────────────────────────────
function FamH({ eyebrow, title, sub, right }) {
  return <div className="fam-page-h"><div>{eyebrow && <div className="fam-eyebrow">{eyebrow}</div>}<h1 className="fam-title">{title}</h1>{sub && <div className="fam-sub">{sub}</div>}</div>{right && <div className="fam-right">{right}</div>}</div>;
}
function FamBtn({ children, kind = 'soft', onClick, accent }) {
  return <button className={'fam-btn fam-btn-' + kind} onClick={onClick} style={accent && kind === 'primary' ? { background: accent } : {}}>{children}</button>;
}
function FamKpi({ l, v, c, ic }) {
  return <div className="fam-kpi"><div className="fam-kpi-top"><span className="fam-kpi-l">{l}</span>{ic && <span style={{ color: c || 'var(--sf-muted)' }}>{React.cloneElement(ic, { size: 14 })}</span>}</div><div className="sf-mono fam-kpi-v" style={{ color: c || 'var(--sf-ink)' }}>{v}</div></div>;
}
function FamCard({ title, action, children }) {
  return <div className="fam-card"><div className="fam-card-h"><h3>{title}</h3>{action}</div><div className="fam-card-b">{children}</div></div>;
}

const FAM_PAGES = {
  home: (r, nav) => <FamHome role={r} onNav={nav} />, child: () => <FamChild />,
  attendance: (r) => <FamAttendance role={r} />, cards: (r) => <FamCards role={r} />,
  payments: () => <FamPayments />, groups: () => <FamGroups />, materials: () => <FamMaterials />,
  schedule: () => <FamSchedule />, messages: (r) => <FamMessages role={r} />, ai: () => <FamAI />,
  settings: (r) => <FamSettings role={r} />,
};

function FamApp() {
  const [role, setRole] = React.useState('parent');
  const [active, setActive] = React.useState('home');
  const onNav = (id) => { setActive(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const renderPage = (r, a, nav) => (FAM_PAGES[a] || FAM_PAGES.home)(r, nav);
  const [cur, setCur] = React.useState('UZS');
  return (
    <CurrencyCtx.Provider value={{ cur, setCur }}>
      <style>{adminCommonStyles}</style>
      <style>{staffShellStyles}</style>
      <FamShell role={role} setRole={setRole} active={active} onNav={onNav} renderPage={renderPage} />
    </CurrencyCtx.Provider>
  );
}

// Reuse the staff shell mechanics by mapping FAM_ROLES into the same structure
function FamShell(props) {
  return <StaffShell roles={FAM_ROLES} order={FAM_ORDER} {...props} />;
}

function famUnionNav() {
  const seen = {}, out = [];
  FAM_ORDER.forEach(r => FAM_ROLES[r].nav.forEach(n => { if (!seen[n.id]) { seen[n.id] = 1; out.push(n); } }));
  return out;
}
function mountFamily() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <SfControlProvider appId="family" defaultNav={famUnionNav()} defaults={{ palette: 'saroy', layout: 'sidebar' }}>
      <FamApp />
    </SfControlProvider>
  );
}
window.mountFamily = mountFamily;
Object.assign(window, { FAM_ROLES, FAM_ORDER, FAM_PAGES });

const famStyles = (window.famStyles = `
.fam-page-h { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 20px; }
.fam-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-muted); margin-bottom: 7px; }
.fam-title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
.fam-sub { margin-top: 5px; font-size: 13.5px; color: var(--sf-muted); }
.fam-right { display: flex; gap: 8px; flex-wrap: wrap; }
.fam-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 15px; border-radius: 10px; font-family: inherit; font-weight: 600; font-size: 13px; border: 1px solid transparent; cursor: pointer; transition: transform 0.08s; }
.fam-btn:active { transform: scale(0.96); }
.fam-btn-primary { background: var(--sf-primary); color: #fff; }
.fam-btn-soft { background: var(--sf-surface-2); color: var(--sf-ink); border-color: var(--sf-border); }
.fam-btn-ghost { background: transparent; color: var(--sf-ink-2); border-color: var(--sf-border-strong); }
.fam-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap: 12px; margin-bottom: 18px; }
.fam-kpi { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; padding: 14px 16px; }
.fam-kpi-top { display: flex; justify-content: space-between; align-items: center; }
.fam-kpi-l { font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--sf-muted); }
.fam-kpi-v { font-size: 26px; font-weight: 700; line-height: 1; margin-top: 8px; }
.fam-grid2 { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr); gap: 16px; }
@media (max-width: 1100px) { .fam-grid2 { grid-template-columns: 1fr; } }
.fam-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.fam-hero { position: relative; border-radius: 18px; padding: 22px; overflow: hidden; color: #fff; }
.fam-hero-eye { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; opacity: 0.85; }
.fam-hero-t { font-size: 26px; font-weight: 800; letter-spacing: -0.025em; margin-top: 8px; }
.fam-hero-s { font-size: 13px; opacity: 0.9; margin-top: 5px; }
.fam-hero-acts { display: flex; gap: 8px; margin-top: 18px; }
.fam-hero-btn { padding: 9px 16px; border-radius: 999px; border: none; background: #fff; color: var(--sf-ink); font-family: inherit; font-weight: 700; font-size: 13px; cursor: pointer; }
.fam-hero-btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); }
.fam-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.fam-card-h { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; border-bottom: 1px solid var(--sf-border); }
.fam-card-h h3 { margin: 0; font-size: 13.5px; font-weight: 700; }
.fam-card-b { padding: 8px 16px; }
.fam-link { font-size: 12px; color: var(--sf-primary); font-weight: 600; cursor: pointer; }
.fam-srow, .fam-att-row, .fam-mat { display: flex; align-items: center; gap: 12px; padding: 11px 0; }
.fam-cmark { width: 26px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
.fam-pay { background: linear-gradient(135deg, var(--sf-warn) 0%, color-mix(in oklab, var(--sf-warn) 76%, black) 100%); color: #fff; border-radius: 16px; padding: 18px; cursor: pointer; }
.fam-pay-top { display: flex; justify-content: space-between; align-items: center; }
.fam-pay-l { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; opacity: 0.9; }
.fam-pay-amt { font-size: 30px; font-weight: 800; margin: 10px 0 3px; font-family: var(--sf-font-mono); }
.fam-pay-sub { font-size: 12px; opacity: 0.9; }
.fam-pay-btn { margin-top: 14px; width: 100%; padding: 11px; border-radius: 11px; border: none; background: #fff; color: var(--sf-warn); font-family: inherit; font-weight: 800; font-size: 14px; cursor: pointer; }
.fam-pay-big { display: flex; gap: 18px; align-items: center; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; padding: 20px; margin-bottom: 16px; flex-wrap: wrap; }
.fam-pay-big-l { flex: 1; min-width: 180px; }
.fam-pay-big-amt { font-size: 34px; font-weight: 800; font-family: var(--sf-font-mono); color: var(--sf-ink); margin: 6px 0 3px; }
.fam-pay-methods { display: flex; gap: 8px; }
.fam-pay-method { padding: 11px 18px; border-radius: 11px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-weight: 700; font-size: 13px; color: var(--sf-ink); }
.fam-pay-method:hover { border-color: var(--sf-primary); color: var(--sf-primary); }
.fam-msg-prev, .fam-ai-prev { cursor: pointer; }
.fam-msg-prev { display: flex; align-items: center; gap: 11px; padding: 4px 2px; }
.fam-unread { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: var(--sf-primary); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.fam-ai-q { font-family: var(--sf-font-display); font-style: italic; font-size: 15px; line-height: 1.35; color: var(--sf-ink); margin: 10px 0; }
.fam-ai-btn { padding: 7px 14px; border-radius: 9px; border: none; background: var(--sf-ink); color: var(--sf-bg); font-family: inherit; font-weight: 700; font-size: 12px; cursor: pointer; }
.fam-cards-hero { display: flex; gap: 18px; align-items: center; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; padding: 20px; margin-bottom: 16px; flex-wrap: wrap; justify-content: center; }
.fam-cards-stats { display: flex; gap: 22px; }
.fam-cs { text-align: center; }
.fam-cs-l { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--sf-muted); font-weight: 600; margin-top: 3px; }
.fam-groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 12px; }
.fam-group { display: flex; align-items: center; gap: 12px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; padding: 16px; cursor: pointer; transition: transform 0.1s; }
.fam-group:hover { transform: translateY(-2px); box-shadow: var(--sf-shadow-md); }
.fam-group-mark { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fam-mat-ic { width: 38px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fam-icon-b { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; }
.fam-icon-b:hover { background: var(--sf-primary-soft); color: var(--sf-primary); }
.fam-sched { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.fam-sched-dh { text-align: center; font-size: 11px; font-weight: 700; color: var(--sf-muted); padding-bottom: 8px; }
.fam-sched-cell { min-height: 44px; margin-bottom: 6px; }
.fam-sched-l { padding: 8px 6px; border-radius: 8px; color: #fff; font-size: 11px; font-weight: 700; text-align: center; }
.fam-chat { display: flex; flex-direction: column; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; overflow: hidden; height: calc(100vh - 220px); min-height: 440px; }
.fam-chat-h { display: flex; align-items: center; gap: 11px; padding: 14px 16px; border-bottom: 1px solid var(--sf-border); }
.fam-chat-body { flex: 1; overflow-y: auto; padding: 16px; background: var(--sf-bg); display: flex; flex-direction: column; gap: 10px; }
.fam-bub { max-width: 76%; padding: 10px 14px; font-size: 13.5px; line-height: 1.4; border-radius: 16px; }
.fam-bub.in { align-self: flex-start; background: var(--sf-surface); border: 1px solid var(--sf-border); border-bottom-left-radius: 4px; }
.fam-bub.out { align-self: flex-end; background: var(--sf-primary); color: #fff; border-bottom-right-radius: 4px; }
.fam-bt { font-size: 9px; opacity: 0.7; margin-top: 4px; }
.fam-chat-input { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--sf-border); }
.fam-chat-input input { flex: 1; border: 1px solid var(--sf-border); background: var(--sf-surface-2); border-radius: 22px; padding: 11px 15px; font-family: inherit; font-size: 13.5px; outline: none; color: var(--sf-ink); }
.fam-chat-input button { width: 42px; height: 42px; border-radius: 12px; border: none; background: var(--sf-primary); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.fam-ai-chips { display: flex; gap: 6px; padding: 10px 14px 0; }
.fam-ai-chips button { padding: 7px 13px; border-radius: 999px; border: 1px solid var(--sf-ai-border); background: var(--sf-ai-bg); color: var(--sf-ai); font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
.fam-child-hero { display: flex; align-items: center; gap: 16px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; padding: 20px; }
.fam-set-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 14px; }
.fam-set-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 2px; }
`);
