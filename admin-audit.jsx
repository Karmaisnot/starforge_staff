// admin-audit.jsx — Audit console pages + shared admin Settings

// ═══ AUDIT DASHBOARD ═════════════════════════════════════════
function AuditDashPage({ onNav }) {
  return (
    <>
      <AdminPageH eyebrow="Barcha filiallar · nazorat · 19 May 2026"
        title="Audit paneli" sub="Anomaliyalar, adolat va muvofiqlik monitoringi"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Audit hisoboti</ABtn><ABtn kind="primary" accent="#7A4A82">{React.cloneElement(Icons.flag, { size: 14 })} Yangi holat</ABtn></>} />
      <div className="ad-kpi-grid">
        <Kpi label="Ochiq flaglar" value="12" accent="var(--sf-danger)" trend={{ up: false, v: '3' }} icon={Icons.flag} sub="3 ta yuqori" />
        <Kpi label="Faol holatlar" value="8" accent="#7A4A82" sub="2 ta jiddiy" icon={Icons.pin} />
        <Kpi label="Anomaliya skori" value="2.4%" accent="var(--sf-warn)" sub="tranzaksiyalar" />
        <Kpi label="Muvofiqlik" value="96.8%" accent="var(--sf-success)" trend={{ up: true, v: '1.2%' }} icon={Icons.shield} />
        <Kpi label="Tekshirilgan" value="1 842" sub="o‘quvchi yozuvi" />
      </div>
      <div className="ad-dash-grid">
        <div className="ad-dash-l">
          <ACard title="Anomaliya signallari · 30 kun" action={<a className="ad-link" onClick={() => onNav('anomalies')}>Hammasi ›</a>}>
            <AreaChart color="var(--sf-danger)"
              data={[4,6,3,8,5,12,7,9,6,11,8,12]} labels={['','','','','','','','','','','','']} />
            <div className="ad-chart-foot">
              <div><span className="ad-cf-l">Davomat anomaliyasi</span><span className="ad-cf-v sf-mono" style={{ color: 'var(--sf-danger)' }}>5</span></div>
              <div><span className="ad-cf-l">Karta nomutanosibligi</span><span className="ad-cf-v sf-mono" style={{ color: 'var(--sf-warn)' }}>5</span></div>
              <div><span className="ad-cf-l">Moliya</span><span className="ad-cf-v sf-mono" style={{ color: 'var(--sf-danger)' }}>2</span></div>
            </div>
          </ACard>
          <ACard title="So‘nggi flaglar" action={<a className="ad-link" onClick={() => onNav('anomalies')}>Batafsil ›</a>} pad={false}>
            <Table cols={[{ label: 'Signal' }, { label: 'Tur' }, { label: 'Filial' }, { label: 'Jiddiylik', align: 'center' }, { label: 'Vaqt', align: 'right' }]}>
              {[
                { s: 'Davomat 100% · 21 kun ketma-ket', ty: 'Davomat', b: 'Sebzor', sev: 'high', t: '2 soat' },
                { s: 'Bir o‘qituvchi · 48 Up karta/hafta', ty: 'Karta', b: 'Mirobod', sev: 'med', t: '5 soat' },
                { s: 'Naqd to‘lov · kvitansiyasiz', ty: 'Moliya', b: 'Sebzor', sev: 'high', t: 'Kecha' },
                { s: 'Profil 02:14 da o‘zgartirilgan', ty: 'Kirish', b: 'Chilonzor', sev: 'low', t: 'Kecha' },
                { s: 'So‘rovnoma · 30s ichida to‘ldirilgan', ty: 'So‘rovnoma', b: 'Yunusobod', sev: 'med', t: '2 kun' },
              ].map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: 12.5 }}>{f.s}</td>
                  <td><Pill>{f.ty}</Pill></td>
                  <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{f.b}</td>
                  <td align="center"><Pill tone={f.sev === 'high' ? 'danger' : f.sev === 'med' ? 'warn' : 'neutral'} dot>{f.sev === 'high' ? 'Yuqori' : f.sev === 'med' ? 'O‘rta' : 'Past'}</Pill></td>
                  <td align="right"><span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{f.t}</span></td>
                </tr>
              ))}
            </Table>
          </ACard>
        </div>
        <div className="ad-dash-r">
          <div className="ad-ai-card" onClick={() => onNav('anomalies')}>
            <div className="ad-ai-glow" />
            <div style={{ position: 'relative' }}>
              <SfAiBadge>Audit AI</SfAiBadge>
              <div className="ad-ai-quote" style={{ marginTop: 10 }}>“Sebzor filialida 3 ta yuqori darajali signal to‘plandi: 100% davomat, kvitansiyasiz naqd va karta nomutanosibligi. Tekshiruv tavsiya etiladi.”</div>
              <div className="ad-ai-chips"><Pill tone="ai">Holat ochish</Pill><Pill tone="ai">Filialga so‘rov</Pill></div>
            </div>
          </div>
          <ACard title="Filiallar muvofiqligi">
            <HBars rows={[
              { label: 'Yunusobod', v: 98, display: '98%', color: 'var(--sf-success)' },
              { label: 'Chilonzor', v: 97, display: '97%', color: 'var(--sf-success)' },
              { label: 'Mirobod', v: 95, display: '95%', color: 'var(--sf-warn)' },
              { label: 'Sebzor', v: 89, display: '89%', color: 'var(--sf-danger)' },
            ]} max={100} />
          </ACard>
          <ACard title="Holatlar holati">
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Donut size={110} segments={[{ v: 3, c: 'var(--sf-danger)' }, { v: 5, c: 'var(--sf-warn)' }, { v: 14, c: 'var(--sf-success)' }]}
                center={<><div className="sf-mono" style={{ fontSize: 18, fontWeight: 700 }}>22</div><div style={{ fontSize: 8, color: 'var(--sf-muted)' }}>JAMI</div></>} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Legend c="var(--sf-danger)" l="Ochiq · jiddiy" v="3" />
                <Legend c="var(--sf-warn)" l="Tekshirilmoqda" v="5" />
                <Legend c="var(--sf-success)" l="Yopilgan" v="14" />
              </div>
            </div>
          </ACard>
        </div>
      </div>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ ANOMALIES ═══════════════════════════════════════════════
function AnomaliesPage() {
  const rows = [
    { s: 'Davomat 100% · 21 kun ketma-ket', ty: 'Davomat', who: 'Sebzor · Fizika DTM', sev: 'high', sc: 94, t: '2 soat', st: 'open' },
    { s: 'Bir o‘qituvchi · 48 Up karta/hafta', ty: 'Karta', who: 'Mirobod · M. Yusupova', sev: 'med', sc: 72, t: '5 soat', st: 'open' },
    { s: 'Naqd to‘lov · kvitansiyasiz · 3.2 mln', ty: 'Moliya', who: 'Sebzor · ofis', sev: 'high', sc: 88, t: 'Kecha', st: 'review' },
    { s: 'Profil 02:14 da o‘zgartirilgan', ty: 'Kirish', who: 'Chilonzor · admin', sev: 'low', sc: 34, t: 'Kecha', st: 'open' },
    { s: 'So‘rovnoma · 30s ichida to‘ldirilgan', ty: 'So‘rovnoma', who: 'Yunusobod · 8 ta', sev: 'med', sc: 61, t: '2 kun', st: 'review' },
    { s: 'Down karta 0 · 3 oy davomida', ty: 'Karta', who: 'Sebzor · J. Rahimov', sev: 'med', sc: 58, t: '3 kun', st: 'open' },
    { s: 'To‘lov qaytarish · ketma-ket 4 ta', ty: 'Moliya', who: 'Mirobod · ofis', sev: 'high', sc: 81, t: '4 kun', st: 'open' },
  ];
  return (
    <>
      <AdminPageH eyebrow="12 ta ochiq signal" title="Anomaliyalar" sub="AI tomonidan aniqlangan g‘ayritabiiy naqshlar"
        right={<><div className="ad-seg-sm"><button className="on">Hammasi</button><button>Yuqori</button><button>Ochiq</button></div><ABtn kind="primary" accent="#7A4A82">Holat ochish</ABtn></>} />
      <FilterBar searchPlaceholder="Signal yoki obyekt..."
        chips={[{ l: 'Hammasi', n: 12, on: true }, { l: 'Davomat', n: 5, icon: Icons.check }, { l: 'Karta', n: 4, icon: Icons.brand }, { l: 'Moliya', n: 2, icon: Icons.trend }, { l: 'Kirish', n: 1 }, { l: 'Yuqori', n: 3, icon: Icons.flag }]} />
      <ACard pad={false}>
        <Table cols={[{ label: 'Anomaliya signali' }, { label: 'Tur' }, { label: 'Obyekt' }, { label: 'AI skori', align: 'center' }, { label: 'Jiddiylik', align: 'center' }, { label: 'Holat', align: 'center' }, { label: 'Vaqt', align: 'right' }]}>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ad-anom-dot" style={{ background: r.sev === 'high' ? 'var(--sf-danger)' : r.sev === 'med' ? 'var(--sf-warn)' : 'var(--sf-muted)' }} />
                <span style={{ fontWeight: 600, fontSize: 12.5 }}>{r.s}</span></div></td>
              <td><Pill>{r.ty}</Pill></td>
              <td style={{ color: 'var(--sf-muted)', fontSize: 12 }}>{r.who}</td>
              <td align="center"><div className="ad-score"><div className="ad-score-bar"><div style={{ width: `${r.sc}%`, background: r.sc >= 80 ? 'var(--sf-danger)' : r.sc >= 60 ? 'var(--sf-warn)' : 'var(--sf-muted)' }} /></div><span className="sf-mono">{r.sc}</span></div></td>
              <td align="center"><Pill tone={r.sev === 'high' ? 'danger' : r.sev === 'med' ? 'warn' : 'neutral'} dot>{r.sev === 'high' ? 'Yuqori' : r.sev === 'med' ? 'O‘rta' : 'Past'}</Pill></td>
              <td align="center"><Pill tone={r.st === 'open' ? 'danger' : 'warn'}>{r.st === 'open' ? 'Ochiq' : 'Tekshir'}</Pill></td>
              <td align="right"><span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{r.t}</span></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ CARD FAIRNESS ═══════════════════════════════════════════
function FairnessPage() {
  const teachers = [
    { n: 'Aziz Tursunov', b: 'Chilonzor', up: 22, down: 2, ratio: 11, flag: 'high-up', st: 'O‘ta saxiy' },
    { n: 'Malika Yusupova', b: 'Mirobod', up: 48, down: 6, ratio: 8, flag: 'volume', st: 'Juda ko‘p' },
    { n: 'Nigora Karimova', b: 'Yunusobod', up: 18, down: 4, ratio: 4.5, flag: null, st: 'Muvozanatli' },
    { n: 'Jasur Rahimov', b: 'Sebzor', up: 6, down: 0, ratio: null, flag: 'no-down', st: 'Down yo‘q' },
    { n: 'Bobur Aliyev', b: 'Yunusobod', up: 15, down: 3, ratio: 5, flag: null, st: 'Muvozanatli' },
  ];
  return (
    <>
      <AdminPageH eyebrow="5 ta signal" title="Karta adolati" sub="O‘qituvchilar Up/Down kartalarni adolatli taqsimlayaptimi?"
        right={<ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="O‘rt. Up/Down nisbat" value="6.2 : 1" accent="var(--sf-primary)" sub="me‘yor: 4-5:1" />
        <Kpi label="O‘ta saxiy" value="2" accent="var(--sf-warn)" sub="o‘qituvchi" icon={Icons.flag} />
        <Kpi label="Down bermaganlar" value="1" accent="var(--sf-danger)" sub="3+ oy" />
        <Kpi label="Tekshirilgan" value="54" sub="o‘qituvchi" />
      </div>
      <ACard pad={false}>
        <Table cols={[{ label: 'O‘qituvchi' }, { label: 'Filial' }, { label: 'Up', align: 'right' }, { label: 'Down', align: 'right' }, { label: 'Nisbat', align: 'right' }, { label: 'Taqsimot' }, { label: 'Baho', align: 'center' }]}>
          {teachers.map((t, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u"><SfAvatar name={t.n} size={28} /><span style={{ fontWeight: 600 }}>{t.n}</span></div></td>
              <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{t.b}</td>
              <td align="right"><span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700 }}>{t.up}</span></td>
              <td align="right"><span className="sf-mono" style={{ color: t.down ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700 }}>{t.down}</span></td>
              <td align="right"><span className="sf-mono" style={{ fontWeight: 700 }}>{t.ratio ? t.ratio + ':1' : '∞'}</span></td>
              <td><div className="ad-ratio-bar"><div style={{ width: `${(t.up/(t.up+t.down||1))*100}%`, background: '#E9C272' }} /><div style={{ width: `${(t.down/(t.up+t.down||1))*100}%`, background: '#D88A75' }} /></div></td>
              <td align="center"><Pill tone={!t.flag ? 'success' : t.flag === 'volume' ? 'danger' : 'warn'}>{t.st}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ FINANCE RECONCILIATION ══════════════════════════════════
function FinanceAuditPage() {
  return (
    <>
      <AdminPageH eyebrow="Moliyaviy tekshiruv" title="Moliyaviy reconciliation" sub="Tizim yozuvlari ↔ haqiqiy tushum solishtiruvi"
        right={<><div className="ad-seg-sm"><button className="on">May</button><button>Aprel</button></div><ABtn kind="primary" accent="#7A4A82">{React.cloneElement(Icons.check, { size: 14 })} Tasdiqlash</ABtn></>} />
      <div className="ad-kpi-grid">
        <Kpi label="Tizim yozuvi" money={1284000000} icon={Icons.doc} />
        <Kpi label="Bank/kassa" money={1281600000} accent="var(--sf-success)" />
        <Kpi label="Farq" money={2400000} accent="var(--sf-danger)" sub="0.19% · 3 ta yozuv" icon={Icons.flag} />
        <Kpi label="Tasdiqlangan" value="98.4%" accent="var(--sf-success)" />
      </div>
      <ACard title="Mos kelmagan yozuvlar · 3 ta" pad={false}>
        <Table cols={[{ label: 'Sana' }, { label: 'Tavsif' }, { label: 'Tizim', align: 'right' }, { label: 'Haqiqiy', align: 'right' }, { label: 'Farq', align: 'right' }, { label: 'Holat', align: 'center' }]}>
          {[
            { d: '15.05', t: 'Naqd to‘lov · Sebzor · kvitansiyasiz', sys: 3200000, act: 2000000, st: 'flag' },
            { d: '12.05', t: 'Click qaytarish · Mirobod', sys: 600000, act: 0, st: 'review' },
            { d: '08.05', t: 'Bank komissiyasi · hisobga olinmagan', sys: 0, act: 600000, st: 'minor' },
          ].map((r, i) => (
            <tr key={i}>
              <td className="sf-mono" style={{ fontSize: 12 }}>{r.d}</td>
              <td style={{ fontSize: 12.5, fontWeight: 600 }}>{r.t}</td>
              <td align="right"><Money uzs={r.sys} /></td>
              <td align="right"><Money uzs={r.act} /></td>
              <td align="right"><Money uzs={Math.abs(r.sys - r.act)} style={{ color: 'var(--sf-danger)', fontWeight: 700 }} /></td>
              <td align="center"><Pill tone={r.st === 'flag' ? 'danger' : r.st === 'review' ? 'warn' : 'neutral'}>{r.st === 'flag' ? 'Jiddiy' : r.st === 'review' ? 'Tekshir' : 'Kichik'}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ ACCESS LOGS ═════════════════════════════════════════════
function LogsPage() {
  const logs = [
    { u: 'Dilnoza Yo‘ldosheva', r: 'Manager', act: 'To‘lov yozuvini o‘zgartirdi', obj: 'Akbarov A. · iyun', ip: '84.54.12.x', t: '09:42:18', risk: false },
    { u: 'admin_yun', r: 'Admin', act: 'Profilni 02:14 da o‘zgartirdi', obj: 'O‘quvchi 00231', ip: '178.218.x.x', t: '02:14:55', risk: true },
    { u: 'Sardor Rashidov', r: 'CEO', act: 'Moliya hisobotini eksport qildi', obj: 'May · barcha filial', ip: '84.54.12.x', t: '08:30:02', risk: false },
    { u: 'Malika Yusupova', r: 'O‘qituvchi', act: '48 ta karta berdi', obj: 'Mirobod · hafta', ip: '213.230.x.x', t: 'Kecha', risk: true },
    { u: 'Jamshid Qodirov', r: 'Audit', act: 'Suhbatni ko‘rdi', obj: 'N.Karimova ↔ ota-ona', ip: '84.54.12.x', t: 'Kecha', risk: false },
    { u: 'office_seb', r: 'Ofis', act: 'Kvitansiyasiz naqd qabul', obj: 'Sebzor · 3.2 mln', ip: '195.158.x.x', t: '2 kun', risk: true },
  ];
  return (
    <>
      <AdminPageH eyebrow="Kirish va harakatlar jurnali" title="Kirish jurnali" sub="Barcha foydalanuvchi harakatlari · o‘zgarmas yozuv"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn><div className="ad-seg-sm"><button className="on">Hammasi</button><button>Riskli</button></div></>} />
      <FilterBar searchPlaceholder="Foydalanuvchi, harakat yoki IP..."
        chips={[{ l: 'Hammasi', on: true }, { l: 'Riskli', n: 3, icon: Icons.flag }, { l: 'Moliya' }, { l: 'Profil' }, { l: 'Kartalar' }, { l: 'Tungi soat', icon: Icons.clock }]} />
      <ACard pad={false}>
        <Table cols={[{ label: 'Foydalanuvchi' }, { label: 'Rol' }, { label: 'Harakat' }, { label: 'Obyekt' }, { label: 'IP' }, { label: 'Vaqt', align: 'right' }]}>
          {logs.map((l, i) => (
            <tr key={i} style={l.risk ? { background: 'color-mix(in oklab, var(--sf-danger) 5%, transparent)' } : {}}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{l.risk && <span className="ad-anom-dot" style={{ background: 'var(--sf-danger)' }} />}<span style={{ fontWeight: 600, fontSize: 12.5 }} className={l.u.includes('_') ? 'sf-mono' : ''}>{l.u}</span></div></td>
              <td><Pill>{l.r}</Pill></td>
              <td style={{ fontSize: 12.5 }}>{l.act}</td>
              <td style={{ color: 'var(--sf-muted)', fontSize: 12 }}>{l.obj}</td>
              <td className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{l.ip}</td>
              <td align="right"><span className="sf-mono" style={{ fontSize: 11, color: l.risk ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: l.risk ? 700 : 400 }}>{l.t}</span></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ AI USAGE ════════════════════════════════════════════════
function AiUsagePage() {
  return (
    <>
      <AdminPageH eyebrow="AI monitoring" title="AI ishlatilishi" sub="Token sarfi, narx va g‘ayritabiiy foydalanish nazorati"
        right={<div className="ad-seg-sm"><button className="on">Oy</button><button>Hafta</button></div>} />
      <div className="ad-kpi-grid">
        <Kpi label="Jami token" value="284k" accent="var(--sf-ai)" sub="/ 1M limit" icon={Icons.ai} />
        <Kpi label="AI xarajati" money={3400000} sub="bu oy" />
        <Kpi label="Faol foydalanuvchi" value="48" sub="54 dan" />
        <Kpi label="Anomaliya" value="2" accent="var(--sf-warn)" sub="ortiqcha sarf" icon={Icons.flag} />
      </div>
      <div className="ad-dash-grid">
        <ACard title="Token sarfi · 30 kun">
          <AreaChart color="var(--sf-ai)" data={[6,8,7,10,9,12,11,14,13,16,15,18].map(x=>x*1000)} labels={['','','','','','','','','','','','']} />
        </ACard>
        <ACard title="Eng faol foydalanuvchilar">
          <HBars rows={[
            { label: 'N. Karimova', v: 42000, display: '42k', avatar: true },
            { label: 'A. Tursunov', v: 38000, display: '38k', avatar: true },
            { label: 'B. Aliyev', v: 31000, display: '31k', avatar: true },
            { label: 'D. Yo‘ldosheva', v: 28000, display: '28k', avatar: true, color: 'var(--sf-warn)' },
          ]} />
        </ACard>
      </div>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ SURVEY INTEGRITY ════════════════════════════════════════
function SurveyAuditPage() {
  return (
    <>
      <AdminPageH eyebrow="So‘rovnoma yaxlitligi" title="So‘rovnoma nazorati" sub="Soxta yoki shoshma javoblarni aniqlash"
        right={<ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="Jami javob" value="412" icon={Icons.check} />
        <Kpi label="Shubhali" value="8" accent="var(--sf-warn)" sub="30s dan tez" icon={Icons.flag} />
        <Kpi label="Bir xil naqsh" value="3" accent="var(--sf-danger)" sub="bir IP" />
        <Kpi label="Yaxlitlik" value="97.3%" accent="var(--sf-success)" />
      </div>
      <ACard title="Shubhali javoblar" pad={false}>
        <Table cols={[{ label: 'So‘rovnoma' }, { label: 'Filial' }, { label: 'Belgi' }, { label: 'To‘ldirish vaqti', align: 'right' }, { label: 'Holat', align: 'center' }]}>
          {[
            { s: 'Oylik qoniqish', b: 'Yunusobod', fl: '8 ta · 30s ichida', t: '18s', st: 'high' },
            { s: 'Karta tizimi', b: 'Mirobod', fl: 'Bir IP · 3 javob', t: '45s', st: 'high' },
            { s: 'AI sifati', b: 'Chilonzor', fl: 'Bir xil javoblar', t: '1m 12s', st: 'med' },
          ].map((r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontSize: 12.5 }}>{r.s}</td>
              <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{r.b}</td>
              <td><Pill tone={r.st === 'high' ? 'danger' : 'warn'}>{r.fl}</Pill></td>
              <td align="right" className="sf-mono" style={{ fontSize: 12 }}>{r.t}</td>
              <td align="center"><Pill tone={r.st === 'high' ? 'danger' : 'warn'} dot>{r.st === 'high' ? 'Yuqori' : 'O‘rta'}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ CASES / FLAGS ═══════════════════════════════════════════
function CasesPage() {
  const cases = [
    { id: 'C-0042', t: 'Sebzor · kvitansiyasiz naqd', sev: 'high', st: 'open', owner: 'J. Qodirov', age: '2 kun', items: 3 },
    { id: 'C-0041', t: 'Mirobod · karta nomutanosibligi', sev: 'med', st: 'review', owner: 'J. Qodirov', age: '4 kun', items: 2 },
    { id: 'C-0040', t: 'Davomat anomaliyasi · Fizika DTM', sev: 'high', st: 'open', owner: 'Tayinlanmagan', age: '2 soat', items: 1 },
    { id: 'C-0039', t: 'So‘rovnoma yaxlitligi · Yunusobod', sev: 'med', st: 'review', owner: 'J. Qodirov', age: '1 hafta', items: 8 },
    { id: 'C-0038', t: 'Tungi profil o‘zgarishi', sev: 'low', st: 'closed', owner: 'J. Qodirov', age: '2 hafta', items: 1 },
  ];
  const stTone = { open: ['danger', 'Ochiq'], review: ['warn', 'Tekshirilmoqda'], closed: ['success', 'Yopilgan'] };
  return (
    <>
      <AdminPageH eyebrow="8 ta faol holat" title="Holatlar · Flaglar" sub="Audit tergovlari va ularning holati"
        right={<ABtn kind="primary" accent="#7A4A82">{React.cloneElement(Icons.plus, { size: 14 })} Yangi holat</ABtn>} />
      <FilterBar searchPlaceholder="Holat ID yoki tavsif..."
        chips={[{ l: 'Hammasi', n: 22, on: true }, { l: 'Ochiq', n: 3, icon: Icons.flag }, { l: 'Tekshiruvda', n: 5 }, { l: 'Jiddiy', n: 2 }, { l: 'Mening', n: 6 }]} />
      <div className="ad-cases">
        {cases.map((c, i) => (
          <ACard key={i} pad={false} className="ad-case-card">
            <div className="ad-case-rail" style={{ background: c.sev === 'high' ? 'var(--sf-danger)' : c.sev === 'med' ? 'var(--sf-warn)' : 'var(--sf-muted)' }} />
            <div className="ad-case-body">
              <div className="ad-case-top">
                <span className="sf-mono ad-case-id">{c.id}</span>
                <Pill tone={stTone[c.st][0]} dot>{stTone[c.st][1]}</Pill>
                <Pill tone={c.sev === 'high' ? 'danger' : c.sev === 'med' ? 'warn' : 'neutral'}>{c.sev === 'high' ? 'Yuqori' : c.sev === 'med' ? 'O‘rta' : 'Past'}</Pill>
              </div>
              <div className="ad-case-t">{c.t}</div>
              <div className="ad-case-foot">
                <span className="ad-case-meta"><SfAvatar name={c.owner === 'Tayinlanmagan' ? 'NA' : c.owner} size={18} /> {c.owner}</span>
                <span className="ad-case-meta">{React.cloneElement(Icons.doc, { size: 12 })} {c.items} dalil</span>
                <span className="ad-case-meta sf-mono">{c.age}</span>
              </div>
            </div>
          </ACard>
        ))}
      </div>
      <style>{coreStyles}</style>
      <style>{auditStyles}</style>
    </>
  );
}

// ═══ SHARED ADMIN SETTINGS ═══════════════════════════════════
function AdminSettingsPage({ role }) {
  const cfg = ROLE_CFG[role];
  return (
    <>
      <AdminPageH title="Sozlamalar" sub={`${cfg.label} konsoli · ${cfg.who}`} />
      <div className="ad-set-grid">
        <ACard title="Profil" pad={false}>
          <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <SfAvatar name={cfg.who} size={56} color={cfg.accent} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 800 }}>{cfg.who}</div><div style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{cfg.whoRole} · {cfg.scope}</div></div>
            <ABtn kind="soft">Tahrirlash</ABtn>
          </div>
        </ACard>
        {[
          { h: 'Rol va ruxsatlar', rows: [['Rol', cfg.label], ['Ko‘rish doirasi', cfg.scope], ['Ma‘lumot eksporti', role === 'audit' ? 'To‘liq' : role === 'ceo' ? 'To‘liq' : 'Cheklangan'], ['Suhbatlarni o‘qish', role === 'audit' || role === 'ceo' || role === 'manager' ? 'Ha' : 'Yo‘q']] },
          { h: 'Ko‘rinish', rows: [['Mavzu', 'Tizim'], ['Til', 'O‘zbekcha'], ['Valyuta', 'UZS · almashtiriladi'], ['Zichlik', 'Zich']] },
          { h: 'Bildirishnomalar', rows: [['Email hisobotlar', 'Har kuni'], ['Kritik signallar', 'Darhol'], ['Haftalik xulosa', 'Dushanba']] },
          { h: 'Xavfsizlik', rows: [['2FA', 'Yoqilgan · SMS'], ['Sessiya muddati', '8 soat'], ['Kirish jurnali', 'Saqlanadi']] },
        ].map((sec, i) => (
          <ACard key={i} title={sec.h} pad={false}>
            {sec.rows.map((r, j) => (
              <div key={j} className="ad-set-row" style={{ borderBottom: j < sec.rows.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
                <span style={{ fontSize: 13 }}>{r[0]}</span>
                <span style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{r[1]} {React.cloneElement(Icons.chevR, { size: 13 })}</span>
              </div>
            ))}
          </ACard>
        ))}
      </div>
      <style>{auditStyles}</style>
    </>
  );
}

const auditStyles = `
.ad-anom-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ad-score { display: flex; align-items: center; gap: 7px; justify-content: center; }
.ad-score-bar { width: 50px; height: 5px; border-radius: 3px; background: var(--sf-surface-2); overflow: hidden; }
.ad-score-bar > div { height: 100%; border-radius: 3px; }
.ad-score span { font-size: 11px; font-weight: 700; min-width: 20px; }
.ad-ratio-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; min-width: 80px; background: var(--sf-surface-2); }
.ad-cases { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 12px; }
.ad-case-card { display: flex; }
.ad-case-rail { width: 4px; flex-shrink: 0; }
.ad-case-body { flex: 1; padding: 14px 16px; }
.ad-case-top { display: flex; align-items: center; gap: 7px; }
.ad-case-id { font-size: 12px; font-weight: 700; color: var(--sf-muted); margin-right: auto; }
.ad-case-t { margin-top: 9px; font-size: 13.5px; font-weight: 700; line-height: 1.3; }
.ad-case-foot { margin-top: 12px; display: flex; gap: 14px; align-items: center; }
.ad-case-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--sf-muted); }
.ad-set-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.ad-set-grid > :first-child { grid-column: 1 / -1; }
.ad-set-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
`;

Object.assign(window, {
  AuditDashPage, AnomaliesPage, FairnessPage, FinanceAuditPage,
  LogsPage, AiUsagePage, SurveyAuditPage, CasesPage, AdminSettingsPage,
});
