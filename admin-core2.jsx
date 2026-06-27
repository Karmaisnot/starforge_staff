// admin-core2.jsx — Payments, Parents, Chats, AI, Leads, Approvals, Schedule, Settings

// ═══ PAYMENTS ════════════════════════════════════════════════
function PaymentsPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const { cur } = React.useContext(CurrencyCtx);
  const txns = [
    { st: 'Akbarov Akmal', g: '9-B Algebra', b: 'Yunusobod', amt: 600000, m: 'Click', d: '19.05 09:42', st2: 'ok' },
    { st: 'Halimova Zilola', g: '9-B Algebra', b: 'Chilonzor', amt: 600000, m: 'Payme', d: '19.05 08:10', st2: 'ok' },
    { st: 'Bakirov Sherzod', g: 'Algebra Mid', b: 'Chilonzor', amt: 600000, m: '—', d: 'Muddat 15.05', st2: 'debt' },
    { st: 'Ibragimov Sardor', g: 'Algebra Mid', b: 'Yunusobod', amt: 850000, m: 'Naqd', d: '18.05 16:30', st2: 'ok' },
    { st: 'G‘aniyev Jasur', g: '10-V Geom', b: 'Sebzor', amt: 300000, m: 'Uzcard', d: '18.05 14:05', st2: 'partial' },
    { st: 'Eshmatov Otabek', g: '9-B Algebra', b: 'Mirobod', amt: 1200000, m: '—', d: 'Muddat 10.05', st2: 'debt' },
    { st: 'Davronova Sevinch', g: 'Algebra Mid', b: 'Yunusobod', amt: 600000, m: 'Click', d: '17.05 11:20', st2: 'ok' },
  ];
  const stTone = { ok: ['success', 'To‘landi'], debt: ['danger', 'Qarz'], partial: ['warn', 'Qisman'] };
  return (
    <>
      <AdminPageH eyebrow={ceo ? 'Barcha filiallar' : 'Yunusobod filiali'} title="To‘lovlar"
        sub={<>Valyuta: <b style={{ color: 'var(--sf-ink)' }}>{cur}</b> · yuqori o‘ngdagi tugmadan o‘zgartiring</>}
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} To‘lov qayd etish</ABtn></>} />
      <div className="ad-kpi-grid">
        <Kpi label="Oylik tushum" money={ceo ? 1284000000 : 342000000} accent="var(--sf-success)" trend={{ up: true, v: '12.4%' }}
             spark={[60,68,64,72,70,78,82,80,88,92,96,100]} />
        <Kpi label="Yig‘ilishi kerak" money={ceo ? 1420000000 : 380000000} sub="rejalashtirilgan" />
        <Kpi label="Qarzdorlik" money={ceo ? 84000000 : 22400000} accent="var(--sf-danger)" sub={ceo ? '142 oila' : '38 oila'} icon={Icons.flag} />
        <Kpi label="To‘lov darajasi" value="94.2%" accent="var(--sf-primary)" trend={{ up: true, v: '1.1%' }} />
        <Kpi label="O‘rtacha chek" money={680000} />
      </div>
      <div className="ad-dash-grid" style={{ marginBottom: 14 }}>
        <ACard title="Tushum dinamikasi · 12 oy" action={<div className="ad-seg-sm"><button className="on">Tushum</button><button>Qarz</button></div>}>
          <AreaChart color="var(--sf-success)" money
            data={[820,860,910,890,960,1020,1080,1040,1140,1180,1220,1284].map(x => x*1e6)}
            labels={['Iyn','Iyl','Avg','Sen','Okt','Noy','Dek','Yan','Fev','Mar','Apr','May']} />
        </ACard>
        <ACard title="To‘lov usullari">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Donut size={120} segments={[
              { v: 42, c: 'var(--sf-primary)' }, { v: 28, c: 'var(--sf-accent)' }, { v: 18, c: 'var(--sf-success)' }, { v: 12, c: 'var(--sf-ink-2)' },
            ]} center={<><div className="sf-mono" style={{ fontSize: 18, fontWeight: 700 }}>94%</div><div style={{ fontSize: 8, color: 'var(--sf-muted)', textTransform: 'uppercase' }}>onlayn</div></>} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Legend c="var(--sf-primary)" l="Click" v="42%" />
              <Legend c="var(--sf-accent)" l="Payme" v="28%" />
              <Legend c="var(--sf-success)" l="Uzcard" v="18%" />
              <Legend c="var(--sf-ink-2)" l="Naqd" v="12%" />
            </div>
          </div>
        </ACard>
      </div>
      <FilterBar searchPlaceholder="O‘quvchi yoki ota-ona..."
        chips={[{ l: 'Hammasi', on: true }, { l: 'To‘langan', n: 1842, icon: Icons.check }, { l: 'Qarz', n: 142, icon: Icons.flag }, { l: 'Qisman', n: 24 }, { l: 'Bu oy', icon: Icons.cal }]} />
      <ACard pad={false}>
        <Table cols={[
          { label: 'O‘quvchi' }, { label: 'Guruh' }, ...(ceo ? [{ label: 'Filial' }] : []),
          { label: 'Summa', align: 'right' }, { label: 'Usul' }, { label: 'Sana' }, { label: 'Holat', align: 'center' },
        ]}>
          {txns.map((t, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u"><SfAvatar name={t.st} size={28} /><span style={{ fontWeight: 600 }}>{t.st}</span></div></td>
              <td><span style={{ fontSize: 12.5 }}>{t.g}</span></td>
              {ceo && <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{t.b}</td>}
              <td align="right"><Money uzs={t.amt} style={{ fontWeight: 700, color: t.st2 === 'debt' ? 'var(--sf-danger)' : 'var(--sf-ink)' }} /></td>
              <td><span style={{ fontSize: 12 }}>{t.m}</span></td>
              <td><span className="sf-mono" style={{ fontSize: 11.5, color: t.st2 === 'debt' ? 'var(--sf-danger)' : 'var(--sf-muted)' }}>{t.d}</span></td>
              <td align="center"><Pill tone={stTone[t.st2][0]}>{stTone[t.st2][1]}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

// ═══ PARENTS ═════════════════════════════════════════════════
function ParentsPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const parents = [
    { n: 'Akbarova Dilnoza', ch: 'Akbarov Akmal', rel: 'Ona', ph: '+998 90 222 11 33', b: 'Yunusobod', tel: true, debt: 0, msgs: 12 },
    { n: 'Bakirova Zarnigor', ch: 'Bakirov Sherzod', rel: 'Ona', ph: '+998 91 444 55 66', b: 'Chilonzor', tel: true, debt: 600000, msgs: 4 },
    { n: 'Eshmatova Gulnora', ch: 'Eshmatov Otabek', rel: 'Ona', ph: '+998 93 111 22 44', b: 'Mirobod', tel: false, debt: 1200000, msgs: 8, esc: true },
    { n: 'Davronov Temur', ch: 'Davronova Sevinch', rel: 'Ota', ph: '+998 90 555 66 77', b: 'Yunusobod', tel: true, debt: 0, msgs: 2 },
    { n: 'Halimov Rustam', ch: 'Halimova Zilola', rel: 'Ota', ph: '+998 94 888 99 00', b: 'Chilonzor', tel: true, debt: 0, msgs: 6 },
  ];
  return (
    <>
      <AdminPageH eyebrow={ceo ? 'Barcha filiallar' : 'Yunusobod filiali'} title="Ota-onalar"
        sub="Aloqa, qarzdorlik va eskalatsiyalar"
        right={<ABtn kind="primary">{React.cloneElement(Icons.send, { size: 14 })} Ommaviy xabar</ABtn>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="Jami ota-ona" value={ceo ? '1 624' : '448'} icon={Icons.chat} />
        <Kpi label="Telegram ulangan" value="82%" accent="var(--sf-primary)" />
        <Kpi label="Eskalatsiya" value={ceo ? '8' : '3'} accent="var(--sf-danger)" sub="hal qilinmagan" icon={Icons.flag} />
        <Kpi label="O‘rt. javob vaqti" value="14 daq" accent="var(--sf-success)" />
      </div>
      <FilterBar searchPlaceholder="Ota-ona yoki o‘quvchi..."
        chips={[{ l: 'Hammasi', on: true }, { l: 'Eskalatsiya', n: 3, icon: Icons.flag }, { l: 'Qarzdor', n: 38 }, { l: 'Telegramsiz', n: 64 }, ...(ceo ? [{ l: 'Filial', icon: Icons.globe }] : [])]} />
      <ACard pad={false}>
        <Table cols={[
          { label: 'Ota-ona' }, { label: 'O‘quvchi' }, { label: 'Aloqa' }, ...(ceo ? [{ label: 'Filial' }] : []),
          { label: 'Telegram', align: 'center' }, { label: 'Qarz', align: 'right' }, { label: 'Suhbat', align: 'center' }, { label: '', align: 'right', w: 40 },
        ]}>
          {parents.map((p, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u"><SfAvatar name={p.n} size={30} /><div><div style={{ fontWeight: 600, display: 'flex', gap: 5, alignItems: 'center' }}>{p.n}{p.esc && <Pill tone="danger">eskal.</Pill>}</div><div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{p.rel}</div></div></div></td>
              <td><span style={{ fontSize: 12.5 }}>{p.ch}</span></td>
              <td><span className="sf-mono" style={{ fontSize: 11.5, color: 'var(--sf-muted)' }}>{p.ph}</span></td>
              {ceo && <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{p.b}</td>}
              <td align="center">{p.tel ? <Pill tone="primary" dot>Ulangan</Pill> : <Pill>Yo‘q</Pill>}</td>
              <td align="right">{p.debt ? <Money uzs={p.debt} style={{ color: 'var(--sf-danger)', fontWeight: 700 }} /> : <span style={{ color: 'var(--sf-muted)' }}>—</span>}</td>
              <td align="center"><button className="ad-chat-btn" onClick={() => onNav('chats')}>{React.cloneElement(Icons.chat, { size: 14 })} {p.msgs}</button></td>
              <td align="right">{React.cloneElement(Icons.chevR, { size: 14, style: { color: 'var(--sf-muted)' } })}</td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

// ═══ CHATS (read teacher↔parent) ═════════════════════════════
function ChatsPage({ role, onNav }) {
  const [sel, setSel] = React.useState(0);
  const threads = [
    { t: 'Nigora Karimova', p: 'Akbarova Dilnoza', sub: '9-B · Akmal', last: 'Rahmat, ustoz! Ertaga albatta...', tm: '14:42', flag: false },
    { t: 'Nigora Karimova', p: 'Eshmatova Gulnora', sub: '9-B · Otabek', last: 'Bolam bugun darsga kela olmaydi', tm: '12:18', flag: true },
    { t: 'Bobur Aliyev', p: 'Halimov Rustam', sub: '10-V · Zilola', last: 'Yaxshi, biz keldik', tm: 'Du', flag: false },
    { t: 'Aziz Tursunov', p: 'Davronov Temur', sub: 'Ingliz · Sevinch', last: 'To‘lov haqida savol bor edi', tm: 'Du', flag: false },
  ];
  const cur = threads[sel];
  return (
    <>
      <AdminPageH eyebrow="Nazorat ko‘rinishi" title="Suhbatlar"
        sub="O‘qituvchi ↔ ota-ona yozishmalari · faqat o‘qish"
        right={<Pill tone="ai">{React.cloneElement(Icons.shield, { size: 11 })} Audit rejimi</Pill>} />
      <div className="ad-chats-layout">
        <ACard pad={false} className="ad-chats-list">
          <FilterBarMini />
          {threads.map((th, i) => (
            <div key={i} className={'ad-chat-thread' + (sel === i ? ' on' : '')} onClick={() => setSel(i)}>
              <div className="ad-chat-avatars">
                <SfAvatar name={th.t} size={32} />
                <SfAvatar name={th.p} size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{th.t.split(' ')[0]} ↔ {th.p.split(' ')[0]}</span>
                  {th.flag && <span style={{ color: 'var(--sf-danger)' }}>{React.cloneElement(Icons.flag, { size: 11 })}</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{th.sub}</div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{th.last}</div>
              </div>
              <span className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{th.tm}</span>
            </div>
          ))}
        </ACard>
        <ACard pad={false} className="ad-chat-view">
          <div className="ad-chatv-head">
            <div className="ad-cell-u">
              <SfAvatar name={cur.t} size={36} />
              <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{cur.t} <span style={{ color: 'var(--sf-muted)', fontWeight: 400 }}>↔ {cur.p}</span></div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{cur.sub} · o‘qituvchi ↔ ota-ona</div></div>
            </div>
            <Pill tone="ai">{React.cloneElement(Icons.shield, { size: 11 })} Faqat o‘qish</Pill>
          </div>
          <div className="ad-chatv-body">
            <div className="ad-cmsg in"><SfAvatar name={cur.p} size={24} /><div className="ad-cbub in">Assalomu alaykum, Nigora opa. Akmal bugun darsda nima yangilik qildi?<div className="ad-cbub-t">09:42</div></div></div>
            <div className="ad-cmsg out"><div className="ad-cbub out">Va alaykum assalom! Akmal bugun yaxshi ishladi — kvadrat tenglamani mustaqil yechib berdi.<div className="ad-cbub-t" style={{ color: 'rgba(255,252,245,0.7)' }}>09:48 · o‘qituvchi</div></div></div>
            <div className="ad-cmsg in"><SfAvatar name={cur.p} size={24} /><div className="ad-cbub in">{cur.last}<div className="ad-cbub-t">{cur.tm}</div></div></div>
          </div>
          <div className="ad-chatv-foot">
            {React.cloneElement(Icons.shield, { size: 14, style: { color: 'var(--sf-muted)' } })}
            <span>Nazorat rejimi — bu suhbatga yozib bo‘lmaydi. {cur.flag && <b style={{ color: 'var(--sf-danger)' }}>Flag qo‘yilgan.</b>}</span>
            <button className="ad-btn ad-btn-soft" style={{ marginLeft: 'auto' }}>{React.cloneElement(Icons.flag, { size: 13 })} Flag</button>
          </div>
        </ACard>
      </div>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}
function FilterBarMini() {
  return <div className="ad-chatlist-search">{React.cloneElement(Icons.search, { size: 14, style: { color: 'var(--sf-muted)' } })}<input placeholder="Suhbat izlash..." readOnly /></div>;
}

// ═══ AI STRATEGIC ════════════════════════════════════════════
function AiPage({ role, onNav }) {
  const ceo = role === 'ceo';
  return (
    <>
      <AdminPageH eyebrow="AI yordamchi" title={<>AI <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontWeight: 400 }}>strategik tahlil</span></>}
        sub={ceo ? 'Barcha filiallar bo‘yicha biznes tahlili' : 'Filial operatsiyalari tahlili'}
        right={<div className="ad-ai-meter"><SfAiBadge compact>limit</SfAiBadge><div className="ad-ai-meter-bar"><div style={{ width: '14%' }} /></div><span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>14k/100k</span></div>} />
      <div className="ad-ai-layout">
        <div className="ad-ai-insights">
          {[
            { tone: 'danger', tag: 'Churn riski', q: ceo ? 'Sebzor filialida churn 6.2% — boshqalardan 2x. Oxirgi 3 oyda 3 o‘qituvchi almashdi, bu asosiy sabab bo‘lishi mumkin.' : '6 o‘quvchi ketish belgilarini ko‘rsatmoqda: davomat pasaygan + 2+ Down karta.', acts: ['Sabab tahlili', 'O‘qituvchi barqarorligi', 'Harakat rejasi'] },
            { tone: 'success', tag: 'O‘sish imkoniyati', q: ceo ? 'Yunusobod va Chilonzorda Ingliz B2 guruhlari 90%+ to‘lgan. Yangi guruh ochish $4.2k qo‘shimcha oylik daromad keltiradi.' : 'Ingliz B2 guruhi to‘lgan. Kutish ro‘yxatida 14 o‘quvchi bor — yangi guruh ochish vaqti keldi.', acts: ['Talab tahlili', 'O‘qituvchi tanlash'] },
            { tone: 'warn', tag: 'Moliya', q: ceo ? '142 oila qarzdor (84 mln). 38 tasi 30 kundan oshgan. Avtomatik eslatma to‘lov darajasini ~6% oshirishi mumkin.' : '38 oila qarzdor (22.4 mln). 12 tasi 30 kundan oshgan.', acts: ['Eslatma yuborish', 'To‘lov rejasi'] },
          ].map((ins, i) => (
            <div key={i} className="ad-ai-insight">
              <div className="ad-ai-insight-head">
                <SfAiBadge>{ins.tag}</SfAiBadge>
                <Pill tone={ins.tone} dot>{ins.tone === 'danger' ? 'Yuqori' : ins.tone === 'warn' ? 'O‘rta' : 'Imkoniyat'}</Pill>
              </div>
              <div className="ad-ai-insight-q">“{ins.q}”</div>
              <div className="ad-ai-insight-acts">
                {ins.acts.map(a => <Pill key={a} tone="ai">{a}</Pill>)}
              </div>
            </div>
          ))}
        </div>
        <ACard title="AI bilan suhbat" pad={false} className="ad-ai-chatbox">
          <div className="ad-ai-cb-body">
            <div className="ad-cmsg out"><div className="ad-cbub out">{ceo ? 'Qaysi filial eng tez o‘smoqda va nega?' : 'Bu oy qaysi guruhlar to‘lib qoldi?'}</div></div>
            <div className="ad-cmsg in"><div className="ad-ai-mini2">Ai</div><div className="ad-cbub in">
              <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic', fontSize: 15 }}>{ceo ? 'Yunusobod' : '3 ta guruh'} yetakchi.</span> {ceo ? 'Bu oy +5.2% o‘sish — asosan Ingliz B2 va matematika yo‘nalishlari hisobiga.' : 'Ingliz B2, 9-B Algebra va Algebra Mid 90%+ to‘lgan.'}
              <div className="ad-ai-cb-chips"><Pill tone="ai">Batafsil hisobot</Pill><Pill tone="ai">Grafik</Pill></div>
            </div></div>
          </div>
          <div className="ad-ai-cb-prompts">
            {['Churn sabablari', 'Daromad prognozi', 'O‘qituvchi reytingi', 'Filiallarni solishtir'].map(p => <button key={p}>{p}</button>)}
          </div>
          <div className="ad-ai-cb-input"><span style={{ flex: 1, color: 'var(--sf-muted)' }}>Biznes savolingizni yozing...</span><button className="ad-ai-send">{React.cloneElement(Icons.send, { size: 15 })}</button></div>
        </ACard>
      </div>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

// ═══ LEADS (Manager) ═════════════════════════════════════════
function LeadsPage() {
  const cols = [
    { id: 'new', l: 'Yangi', c: 'var(--sf-primary)', leads: [{ n: 'Olimov Aziz', src: 'Instagram', int: 'Matematika', tm: '2 soat' }, { n: 'Sobirova Nilufar', src: 'Tavsiya', int: 'Ingliz B2', tm: '5 soat' }] },
    { id: 'contact', l: 'Bog‘lanildi', c: 'var(--sf-accent)', leads: [{ n: 'Karimov Bek', src: 'Telegram', int: 'Fizika', tm: 'Kecha' }, { n: 'Yusupova Dilfuza', src: 'Sayt', int: 'Matematika', tm: 'Kecha' }, { n: 'Rashidov Temur', src: 'Instagram', int: 'Kimyo', tm: '2 kun' }] },
    { id: 'trial', l: 'Sinov darsi', c: 'var(--sf-warn)', leads: [{ n: 'Aliyeva Sevara', src: 'Tavsiya', int: 'Ingliz B2', tm: '24 May' }] },
    { id: 'won', l: 'Qabul qilindi', c: 'var(--sf-success)', leads: [{ n: 'Tosheva Madina', src: 'Sayt', int: 'Matematika', tm: 'Bugun' }, { n: 'Norov Jasur', src: 'Telegram', int: 'Fizika', tm: 'Kecha' }] },
  ];
  return (
    <>
      <AdminPageH eyebrow="Yunusobod filiali" title="Lidlar · Qabul" sub="34 ta faol lid · konversiya 28%"
        right={<ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi lid</ABtn>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Kpi label="Faol lidlar" value="34" icon={Icons.flag} />
        <Kpi label="Bu oy qabul" value="+86" accent="var(--sf-success)" trend={{ up: true, v: '18%' }} />
        <Kpi label="Konversiya" value="28%" accent="var(--sf-primary)" />
        <Kpi label="O‘rt. qabul vaqti" value="4.2 kun" />
      </div>
      <div className="ad-kanban">
        {cols.map(col => (
          <div key={col.id} className="ad-kcol">
            <div className="ad-kcol-h"><span className="ad-kdot" style={{ background: col.c }} /><span className="ad-kname">{col.l}</span><span className="ad-kcount">{col.leads.length}</span></div>
            <div className="ad-kcards">
              {col.leads.map((l, i) => (
                <div key={i} className="ad-lcard">
                  <div className="ad-lcard-rail" style={{ background: col.c }} />
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SfAvatar name={l.n} size={26} /><span style={{ fontSize: 13, fontWeight: 700 }}>{l.n}</span></div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}><Pill tone="primary">{l.int}</Pill><Pill>{l.src}</Pill></div>
                    <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--sf-muted)' }} className="sf-mono">{l.tm}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

// ═══ APPROVALS (Manager) ═════════════════════════════════════
function ApprovalsPage() {
  const items = [
    { t: 'To‘lov qaytarish', who: 'Akbarov Akmal', sub: 'Ortiqcha to‘lov · iyun', amt: 600000, by: 'Nigora Karimova', kind: 'refund', tone: 'var(--sf-success)' },
    { t: 'Ta‘til so‘rovi', who: 'Yusupova Nargiza', sub: '24–26 May · 3 kun · oilaviy', by: 'O‘zi', kind: 'leave', tone: 'var(--sf-primary)' },
    { t: 'Yangi guruh ochish', who: 'Ingliz B2 · Intensiv', sub: 'Aziz Tursunov · 18 o‘rin', by: 'Aziz Tursunov', kind: 'group', tone: 'var(--sf-accent)' },
    { t: 'Guruhdan chiqarish', who: 'Eshmatov Otabek', sub: '3+ oy qarz · 9-B', amt: 1200000, by: 'Nigora Karimova', kind: 'remove', tone: 'var(--sf-danger)' },
    { t: 'Maosh oshirish', who: 'Sevara Olimova', sub: 'Assistent → O‘qituvchi', amt: 7200000, by: 'HR', kind: 'salary', tone: 'var(--sf-warn)' },
    { t: 'Chegirma', who: 'Halimova Zilola', sub: 'Aka-uka · 15% · doimiy', by: 'Nigora Karimova', kind: 'discount', tone: 'var(--sf-primary)' },
    { t: 'Material xarid', who: 'Printer kartrij ×4', sub: 'Yunusobod · ofis', amt: 1800000, by: 'Ofis', kind: 'buy', tone: 'var(--sf-ink-2)' },
  ];
  return (
    <>
      <AdminPageH eyebrow="Yunusobod filiali" title="Tasdiqlash" sub="7 ta so‘rov kutmoqda"
        right={<><ABtn kind="soft">Hammasini ko‘rish</ABtn><ABtn kind="primary">Tarix</ABtn></>} />
      <div className="ad-approvals">
        {items.map((it, i) => (
          <ACard key={i} pad={false} className="ad-appr-card">
            <div className="ad-apc-rail" style={{ background: it.tone }} />
            <div className="ad-apc-body">
              <div className="ad-apc-top">
                <div className="ad-apc-ic" style={{ background: it.tone + '22', color: it.tone }}>
                  {React.cloneElement(it.kind === 'refund' || it.kind === 'salary' || it.kind === 'buy' ? Icons.trend : it.kind === 'leave' ? Icons.cal : it.kind === 'group' ? Icons.brand : it.kind === 'remove' ? Icons.x : Icons.flag, { size: 16 })}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ad-apc-t">{it.t}</div>
                  <div className="ad-apc-who">{it.who}</div>
                </div>
                {it.amt && <Money uzs={it.amt} style={{ fontWeight: 700, fontSize: 14 }} />}
              </div>
              <div className="ad-apc-sub">{it.sub}</div>
              <div className="ad-apc-foot">
                <span className="ad-apc-by">So‘rovchi: <b>{it.by}</b></span>
                <div className="ad-apc-acts">
                  <button className="ad-btn ad-btn-soft">{React.cloneElement(Icons.x, { size: 13 })} Rad</button>
                  <button className="ad-btn ad-btn-primary">{React.cloneElement(Icons.check, { size: 13 })} Tasdiqlash</button>
                </div>
              </div>
            </div>
          </ACard>
        ))}
      </div>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

// ═══ SCHEDULE (Manager) ══════════════════════════════════════
function SchedulePage() {
  const rooms = ['301', '302', '304', '305', '210'];
  const slots = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];
  const lessons = {
    '301-08:00': { n: 'Fizika', t: 'Malika Y.', c: 'var(--sf-accent)' },
    '304-09:30': { n: '9-B Alg', t: 'Nigora K.', c: 'var(--sf-primary)' },
    '304-14:00': { n: 'Alg Mid', t: 'Nigora K.', c: 'var(--sf-primary)' },
    '302-11:00': { n: 'Ingliz B2', t: 'Aziz T.', c: 'var(--sf-success)' },
    '305-15:30': { n: 'Geom', t: 'Bobur A.', c: 'var(--sf-ink-2)' },
    '210-17:00': { n: 'Kimyo', t: 'Jasur R.', c: 'var(--sf-warn)' },
    '301-15:30': { n: 'DTM', t: 'Malika Y.', c: 'var(--sf-accent)' },
  };
  return (
    <>
      <AdminPageH eyebrow="Yunusobod filiali · Seshanba" title="Jadval · Xonalar" sub="5 xona · 28 guruh · bandlik 68%"
        right={<><div className="ad-seg-sm"><button className="on">Kun</button><button>Hafta</button></div><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Dars</ABtn></>} />
      <ACard pad={false}>
        <div className="ad-sched-grid" style={{ gridTemplateColumns: `64px repeat(${rooms.length}, 1fr)` }}>
          <div className="ad-sched-corner" />
          {rooms.map(r => <div key={r} className="ad-sched-room">Xona {r}</div>)}
          {slots.map(slot => (
            <React.Fragment key={slot}>
              <div className="ad-sched-time sf-mono">{slot}</div>
              {rooms.map(r => {
                const l = lessons[`${r}-${slot}`];
                return <div key={r} className="ad-sched-cell">
                  {l && <div className="ad-sched-lesson" style={{ background: l.c }}><div className="ad-sl-n">{l.n}</div><div className="ad-sl-t">{l.t}</div></div>}
                </div>;
              })}
            </React.Fragment>
          ))}
        </div>
      </ACard>
      <style>{coreStyles}</style>
      <style>{core2Styles}</style>
    </>
  );
}

const core2Styles = `
.ad-chat-btn { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 7px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); cursor: pointer; font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-ink-2); }
.ad-chat-btn:hover { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }

.ad-chats-layout { display: grid; grid-template-columns: 320px 1fr; gap: 16px; height: calc(100vh - 200px); min-height: 560px; }
@media (max-width: 900px) { .ad-chats-layout { grid-template-columns: 1fr; } .ad-chat-view { display: none; } }
.ad-chats-list { display: flex; flex-direction: column; overflow-y: auto; }
.ad-chatlist-search { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--sf-border); }
.ad-chatlist-search input { border: none; background: transparent; outline: none; font-family: inherit; font-size: 12.5px; width: 100%; color: var(--sf-ink); }
.ad-chat-thread { display: flex; gap: 10px; padding: 12px 14px; align-items: center; border-bottom: 1px solid var(--sf-border); cursor: pointer; }
.ad-chat-thread:hover { background: var(--sf-surface-2); }
.ad-chat-thread.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
.ad-chat-avatars { position: relative; width: 40px; flex-shrink: 0; }
.ad-chat-avatars > :last-child { position: absolute; bottom: -4px; right: -2px; border: 2px solid var(--sf-surface); border-radius: 50%; }

.ad-chat-view { display: flex; flex-direction: column; }
.ad-chatv-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--sf-border); }
.ad-chatv-body { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 12px; background: var(--sf-bg); }
.ad-cmsg { display: flex; gap: 8px; align-items: flex-end; max-width: 78%; }
.ad-cmsg.out { align-self: flex-end; }
.ad-cmsg.in { align-self: flex-start; }
.ad-cbub { padding: 10px 13px; font-size: 13px; line-height: 1.4; border-radius: 14px; }
.ad-cbub.in { background: var(--sf-surface); border: 1px solid var(--sf-border); border-bottom-left-radius: 4px; }
.ad-cbub.out { background: var(--sf-primary); color: #FFFCF5; border-bottom-right-radius: 4px; }
.ad-cbub-t { font-size: 9px; color: var(--sf-muted); margin-top: 4px; }
.ad-chatv-foot { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-top: 1px solid var(--sf-border); font-size: 11.5px; color: var(--sf-muted); }

.ad-ai-meter { display: flex; align-items: center; gap: 10px; padding: 7px 12px; background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 9px; }
.ad-ai-meter-bar { width: 90px; height: 4px; border-radius: 4px; background: rgba(255,252,245,0.5); overflow: hidden; }
.ad-ai-meter-bar > div { height: 100%; background: var(--sf-ai); }
.ad-ai-layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }
@media (max-width: 1100px) { .ad-ai-layout { grid-template-columns: 1fr; } }
.ad-ai-insights { display: flex; flex-direction: column; gap: 12px; }
.ad-ai-insight { background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 14px; padding: 16px; position: relative; overflow: hidden; }
.ad-ai-insight-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.ad-ai-insight-q { font-family: var(--sf-font-display); font-style: italic; font-size: 16px; line-height: 1.4; color: var(--sf-ink); }
.ad-ai-insight-acts { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
.ad-ai-chatbox { display: flex; flex-direction: column; height: fit-content; }
.ad-ai-cb-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 200px; }
.ad-ai-mini2 { width: 26px; height: 26px; border-radius: 7px; background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); color: var(--sf-ai); display: flex; align-items: center; justify-content: center; font-family: var(--sf-font-display); font-style: italic; font-weight: 600; font-size: 12px; flex-shrink: 0; }
.ad-ai-cb-chips { margin-top: 10px; display: flex; gap: 6px; }
.ad-ai-cb-prompts { display: flex; gap: 6px; padding: 10px 16px; border-top: 1px solid var(--sf-border); overflow-x: auto; }
.ad-ai-cb-prompts button { padding: 6px 11px; border-radius: 999px; background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); color: var(--sf-ai); font-family: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.ad-ai-cb-input { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--sf-border); }
.ad-ai-send { width: 34px; height: 34px; border-radius: 9px; background: var(--sf-primary); color: #FFFCF5; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.ad-kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 1000px) { .ad-kanban { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .ad-kanban { grid-template-columns: 1fr; } }
.ad-kcol { background: var(--sf-surface-2); border-radius: 12px; padding: 10px; }
.ad-kcol-h { display: flex; align-items: center; gap: 8px; padding: 4px 6px 10px; }
.ad-kdot { width: 8px; height: 8px; border-radius: 50%; }
.ad-kname { font-size: 12px; font-weight: 700; }
.ad-kcount { font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-muted); padding: 1px 7px; border-radius: 5px; background: var(--sf-surface); }
.ad-kcards { display: flex; flex-direction: column; gap: 8px; }
.ad-lcard { display: flex; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 10px; overflow: hidden; cursor: pointer; }
.ad-lcard:hover { box-shadow: var(--sf-shadow-md); }
.ad-lcard-rail { width: 3px; flex-shrink: 0; }

.ad-approvals { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 12px; }
.ad-appr-card { display: flex; }
.ad-apc-rail { width: 4px; flex-shrink: 0; }
.ad-apc-body { flex: 1; padding: 14px 16px; }
.ad-apc-top { display: flex; align-items: center; gap: 11px; }
.ad-apc-ic { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-apc-t { font-size: 13.5px; font-weight: 700; }
.ad-apc-who { font-size: 12px; color: var(--sf-muted); }
.ad-apc-sub { margin-top: 8px; font-size: 12px; color: var(--sf-ink-2); padding: 8px 10px; background: var(--sf-surface-2); border-radius: 8px; }
.ad-apc-foot { margin-top: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ad-apc-by { font-size: 11px; color: var(--sf-muted); }
.ad-apc-acts { display: flex; gap: 6px; }

.ad-sched-grid { display: grid; }
.ad-sched-corner { border-bottom: 1px solid var(--sf-border); border-right: 1px solid var(--sf-border); }
.ad-sched-room { padding: 11px 8px; text-align: center; font-size: 12px; font-weight: 700; border-bottom: 1px solid var(--sf-border); border-right: 1px solid var(--sf-border); background: var(--sf-surface-2); }
.ad-sched-room:last-child { border-right: none; }
.ad-sched-time { padding: 8px; font-size: 11px; color: var(--sf-muted); border-bottom: 1px solid var(--sf-border); border-right: 1px solid var(--sf-border); display: flex; align-items: center; }
.ad-sched-cell { min-height: 56px; border-bottom: 1px solid var(--sf-border); border-right: 1px solid var(--sf-border); padding: 4px; }
.ad-sched-cell:nth-child(6n+1) { border-right: 1px solid var(--sf-border); }
.ad-sched-lesson { height: 100%; min-height: 48px; border-radius: 8px; padding: 7px 9px; color: #FFFCF5; }
.ad-sl-n { font-size: 12px; font-weight: 700; }
.ad-sl-t { font-size: 10px; opacity: 0.85; margin-top: 2px; }
`;

Object.assign(window, { PaymentsPage, ParentsPage, ChatsPage, AiPage, LeadsPage, ApprovalsPage, SchedulePage });
