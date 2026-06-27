// staff-pages2.jsx — Remaining role pages: teachers, reports, students,
// leads, payments, audit (dash/anomalies/logs/cases), settings.
const staffPageStyles = window.staffPageStyles || '';
const T2 = (m, o) => window.sfToast && window.sfToast(m, o);

function StaffTeachers() {
  const rows = [
    ['Nigora Karimova', 'Matematika', 3, 58, 94, 18, 4, 4.9, 'active'],
    ['Aziz Tursunov', 'Ingliz tili', 4, 64, 92, 22, 2, 4.8, 'active'],
    ['Malika Yusupova', 'Fizika', 3, 42, 88, 12, 6, 4.5, 'active'],
    ['Bobur Aliyev', 'Geometriya', 4, 56, 90, 15, 3, 4.6, 'active'],
    ['Jasur Rahimov', 'Kimyo', 3, 38, 82, 6, 8, 3.9, 'review'],
  ];
  return (
    <>
      <StaffH eyebrow="O‘quv sifat nazorati" title="O‘qituvchilar" sub="16 xodim · reyting va sifat"
        right={<SBtn kind="primary" onClick={() => T2('Hisobot tayyorlandi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 14 })} Sifat hisoboti</SBtn>} />
      <div className="sp-kpis"><Kpi label="O‘qituvchi" value="16" /><Kpi label="O‘rtacha reyting" value="4.6" accent="var(--sf-accent)" /><Kpi label="Tekshiruvda" value="1" accent="var(--sf-warn)" /><Kpi label="Karta signali" value="2" accent="var(--sf-danger)" /></div>
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        <Table cols={[{ label: 'O‘qituvchi' }, { label: 'Fan' }, { label: 'Guruh', align: 'right' }, { label: 'O‘quvchi', align: 'right' }, { label: 'Davomat', align: 'right' }, { label: 'Kartalar', align: 'center' }, { label: 'Reyting', align: 'center' }, { label: 'Holat', align: 'center' }]}>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => T2(r[0] + ' profili', { tone: 'info' })}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><SfAvatar name={r[0]} size={28} /><span style={{ fontWeight: 600 }}>{r[0]}</span></div></td>
              <td style={{ fontSize: 12.5 }}>{r[1]}</td>
              <td align="right" className="sf-mono">{r[2]}</td>
              <td align="right" className="sf-mono">{r[3]}</td>
              <td align="right"><span className="sf-mono" style={{ fontWeight: 700, color: r[4] >= 92 ? 'var(--sf-success)' : r[4] >= 85 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>{r[4]}%</span></td>
              <td align="center"><span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700 }}>↑{r[5]}</span> <span className="sf-mono" style={{ color: r[6] > 4 ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700 }}>↓{r[6]}</span></td>
              <td align="center"><Pill tone={r[7] >= 4.5 ? 'success' : r[7] >= 4 ? 'warn' : 'danger'}>★ {r[7]}</Pill></td>
              <td align="center"><Pill tone={r[8] === 'active' ? 'success' : 'warn'} dot>{r[8] === 'active' ? 'Faol' : 'Tekshir'}</Pill></td>
            </tr>
          ))}
        </Table>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffReports() {
  return (
    <>
      <StaffH eyebrow="O‘quv sifat" title="Hisobotlar" sub="Sifat ko‘rsatkichlari · 12 oy"
        right={<><SBtn onClick={() => T2('PDF yuklandi', { tone: 'success' })}>{React.cloneElement(Icons.pdf, { size: 14 })} PDF</SBtn><SBtn kind="primary" onClick={() => T2('Hisobot ulashildi', { tone: 'success' })}>Ulashish</SBtn></>} />
      <div className="sp-grid2">
        <div className="sp-card" style={{ padding: 16 }}><div className="sp-card-h" style={{ padding: '0 0 12px' }}><h3>O‘rtacha davomat</h3></div><AreaChart color="var(--sf-success)" data={[88, 90, 87, 91, 89, 92, 90, 93, 91, 92, 90, 94]} labels={['', '', '', '', '', '', '', '', '', '', '', '']} /></div>
        <div className="sp-card" style={{ padding: 16 }}><div className="sp-card-h" style={{ padding: '0 0 12px' }}><h3>Karta taqsimoti</h3></div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Donut size={120} segments={[{ v: 72, c: 'var(--sf-success)' }, { v: 19, c: 'var(--sf-warn)' }, { v: 9, c: 'var(--sf-danger)' }]} center={<div className="sf-mono" style={{ fontSize: 18, fontWeight: 700 }}>248</div>} />
            <div style={{ flex: 1 }}><HBars rows={[{ label: 'Up karta', v: 248, display: '248', color: '#C49A3A' }, { label: 'Down karta', v: 42, display: '42', color: '#D88A75' }]} /></div>
          </div>
        </div>
      </div>
      <div className="sp-card" style={{ padding: 16, marginTop: 14 }}><div className="sp-card-h" style={{ padding: '0 0 12px' }}><h3>Guruhlar bo‘yicha sifat</h3></div>
        <HBars rows={[{ label: '9-B Algebra', v: 94, display: '94%', color: 'var(--sf-success)' }, { label: 'Algebra Mid', v: 96, display: '96%', color: 'var(--sf-success)' }, { label: '10-V Geom', v: 88, display: '88%', color: 'var(--sf-warn)' }, { label: 'Ingliz B2', v: 92, display: '92%', color: 'var(--sf-success)' }]} max={100} />
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffStudents() {
  const rows = [
    ['Akbarov Akmal', '9-B Algebra', 96, 'paid'], ['Azizova Madina', '9-B Algebra', 98, 'paid'],
    ['Bakirov Sherzod', 'Algebra Mid', 88, 'debt'], ['Davronova Sevinch', 'Algebra Mid', 92, 'paid'],
    ['Eshmatov Otabek', '9-B Algebra', 72, 'debt'], ['Halimova Zilola', '9-B Algebra', 95, 'paid'],
    ['Fayzullayev Diyor', '10-V Geom', 94, 'paid'], ['G‘aniyev Jasur', '10-V Geom', 89, 'partial'],
  ];
  const pt = { paid: ['success', 'To‘langan'], debt: ['danger', 'Qarz'], partial: ['warn', 'Qisman'] };
  return (
    <>
      <StaffH eyebrow="Yunusobod filiali" title="O‘quvchilar" sub="512 o‘quvchi"
        right={<SBtn kind="primary" onClick={() => T2('Qabul formasi ochildi', { tone: 'info' })}>{React.cloneElement(Icons.plus, { size: 14 })} Qabul</SBtn>} />
      <FilterBar searchPlaceholder="Ism yoki ID..." chips={[{ l: 'Hammasi', n: 512, on: true }, { l: 'Qarzdor', n: 38, icon: Icons.flag }, { l: 'Yangi', n: 86 }, { l: 'Guruh', icon: Icons.cohort }]} />
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        <Table cols={[{ label: 'O‘quvchi' }, { label: 'Guruh' }, { label: 'Davomat', align: 'right' }, { label: 'To‘lov', align: 'center' }, { label: '', align: 'right', w: 40 }]}>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => T2(r[0] + ' profili', { tone: 'info' })}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><SfAvatar name={r[0]} size={28} /><span style={{ fontWeight: 600 }}>{r[0]}</span></div></td>
              <td style={{ fontSize: 12.5 }}>{r[1]}</td>
              <td align="right"><span className="sf-mono" style={{ fontWeight: 700, color: r[2] >= 92 ? 'var(--sf-success)' : r[2] >= 85 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>{r[2]}%</span></td>
              <td align="center"><Pill tone={pt[r[3]][0]}>{pt[r[3]][1]}</Pill></td>
              <td align="right">{React.cloneElement(Icons.chevR, { size: 14, style: { color: 'var(--sf-muted)' } })}</td>
            </tr>
          ))}
        </Table>
        <div className="sp-table-foot"><span>1–8 / 512</span><span style={{ color: 'var(--sf-primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => T2('Keyingi sahifa', { tone: 'info' })}>Keyingisi ›</span></div>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffLeads() {
  const cols = [
    ['Yangi', 'var(--sf-primary)', [['Olimov Aziz', 'Instagram', 'Matem.'], ['Sobirova N.', 'Tavsiya', 'Ingliz']]],
    ['Bog‘lanildi', 'var(--sf-accent)', [['Karimov Bek', 'Telegram', 'Fizika'], ['Yusupova D.', 'Sayt', 'Matem.']]],
    ['Sinov darsi', 'var(--sf-warn)', [['Aliyeva S.', 'Tavsiya', 'Ingliz']]],
    ['Qabul', 'var(--sf-success)', [['Tosheva M.', 'Sayt', 'Matem.'], ['Norov J.', 'Telegram', 'Fizika']]],
  ];
  return (
    <>
      <StaffH eyebrow="Yunusobod filiali" title="Lidlar" sub="34 ta faol · konversiya 28%"
        right={<SBtn kind="primary" onClick={() => T2('Yangi lid qo‘shildi', { tone: 'success' })}>{React.cloneElement(Icons.plus, { size: 14 })} Lid</SBtn>} />
      <div className="sp-kanban">
        {cols.map((c, i) => (
          <div key={i} className="sp-kcol">
            <div className="sp-kcol-h"><span className="sp-kdot" style={{ background: c[1] }} /><span className="sp-kname">{c[0]}</span><span className="sp-kcount">{c[2].length}</span></div>
            {c[2].map((l, j) => (
              <div key={j} className="sp-lead" onClick={() => T2(l[0] + ' · ' + c[0], { tone: 'info' })}>
                <div className="sp-lead-rail" style={{ background: c[1] }} />
                <div style={{ flex: 1, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SfAvatar name={l[0]} size={24} /><span style={{ fontSize: 12.5, fontWeight: 700 }}>{l[0]}</span></div>
                  <div style={{ marginTop: 7, display: 'flex', gap: 6 }}><Pill tone="primary">{l[2]}</Pill><Pill>{l[1]}</Pill></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffPayments() {
  const rows = [['Akbarov Akmal', '9-B', 600000, 'Click', 'ok'], ['Halimova Zilola', '9-B', 600000, 'Payme', 'ok'], ['Bakirov Sherzod', 'Mid', 600000, '—', 'debt'], ['G‘aniyev Jasur', '10-V', 300000, 'Uzcard', 'partial']];
  const st = { ok: ['success', 'To‘landi'], debt: ['danger', 'Qarz'], partial: ['warn', 'Qisman'] };
  return (
    <>
      <StaffH eyebrow="Yunusobod · faqat ko‘rish" title="To‘lovlar" sub="Reception · qarzdorlik nazorati"
        right={<SBtn onClick={() => T2('Eslatma 12 oilaga yuborildi', { tone: 'success' })}>{React.cloneElement(Icons.bell, { size: 14 })} Qarz eslatmasi</SBtn>} />
      <div className="sp-kpis"><Kpi label="Bugungi tushum" money={18600000} accent="var(--sf-success)" /><Kpi label="Qarzdorlik" money={22400000} accent="var(--sf-danger)" sub="38 oila" /><Kpi label="To‘lov darajasi" value="94%" accent="var(--sf-primary)" /></div>
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        <Table cols={[{ label: 'O‘quvchi' }, { label: 'Guruh' }, { label: 'Summa', align: 'right' }, { label: 'Usul' }, { label: 'Holat', align: 'center' }]}>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><SfAvatar name={r[0]} size={28} /><span style={{ fontWeight: 600 }}>{r[0]}</span></div></td>
              <td style={{ fontSize: 12.5 }}>{r[1]}</td>
              <td align="right"><Money uzs={r[2]} style={{ fontWeight: 700, color: r[4] === 'debt' ? 'var(--sf-danger)' : 'var(--sf-ink)' }} /></td>
              <td style={{ fontSize: 12 }}>{r[3]}</td>
              <td align="center"><Pill tone={st[r[4]][0]}>{st[r[4]][1]}</Pill></td>
            </tr>
          ))}
        </Table>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

// ── AUDITOR ─────────────────────────────────────────────────
function StaffAuditDash({ onNav }) {
  return (
    <>
      <StaffH eyebrow="Nazorat · 19 May" title="Audit paneli" sub="Anomaliyalar va muvofiqlik"
        right={<SBtn kind="primary" accent="#7A4A82" onClick={() => T2('Audit hisoboti tayyorlandi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 14 })} Hisobot</SBtn>} />
      <div className="sp-kpis">
        <Kpi label="Ochiq flaglar" value="12" accent="var(--sf-danger)" sub="3 yuqori" />
        <Kpi label="Holatlar" value="8" accent="#7A4A82" />
        <Kpi label="Anomaliya" value="2.4%" accent="var(--sf-warn)" />
        <Kpi label="Muvofiqlik" value="96.8%" accent="var(--sf-success)" />
      </div>
      <div className="sp-grid2">
        <div className="sp-card" style={{ padding: 16 }}><div className="sp-card-h" style={{ padding: '0 0 12px' }}><h3>Anomaliya signallari · 30 kun</h3></div><AreaChart color="var(--sf-danger)" data={[4, 6, 3, 8, 5, 12, 7, 9, 6, 11, 8, 12]} labels={['', '', '', '', '', '', '', '', '', '', '', '']} /></div>
        <div className="sp-card" style={{ padding: 16 }}><div className="sp-card-h" style={{ padding: '0 0 12px' }}><h3>Filiallar muvofiqligi</h3></div>
          <HBars max={100} rows={[{ label: 'Yunusobod', v: 98, display: '98%', color: 'var(--sf-success)' }, { label: 'Chilonzor', v: 97, display: '97%', color: 'var(--sf-success)' }, { label: 'Mirobod', v: 95, display: '95%', color: 'var(--sf-warn)' }, { label: 'Sebzor', v: 89, display: '89%', color: 'var(--sf-danger)' }]} />
        </div>
      </div>
      <div className="sp-ai" style={{ marginTop: 14, cursor: 'pointer' }} onClick={() => onNav('anomalies')}>
        <SfAiBadge>Audit AI</SfAiBadge>
        <div className="sp-ai-q">“Sebzor filialida 3 ta yuqori signal: 100% davomat, kvitansiyasiz naqd, karta nomutanosibligi. Holat ochish tavsiya etiladi.”</div>
        <button className="sp-ai-btn" onClick={(e) => { e.stopPropagation(); onNav('cases'); T2('Yangi holat ochildi', { tone: 'warn' }); }}>Holat ochish</button>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffAnomalies() {
  const rows = [['Davomat 100% · 21 kun', 'Davomat', 'Sebzor', 94, 'high'], ['48 Up karta/hafta', 'Karta', 'Mirobod', 72, 'med'], ['Naqd · kvitansiyasiz', 'Moliya', 'Sebzor', 88, 'high'], ['Tungi profil o‘zgarishi', 'Kirish', 'Chilonzor', 34, 'low'], ['So‘rovnoma · 30s', 'So‘rovnoma', 'Yunusobod', 61, 'med']];
  return (
    <>
      <StaffH eyebrow="12 ochiq signal" title="Anomaliyalar" sub="AI aniqlagan g‘ayritabiiy naqshlar"
        right={<SBtn kind="primary" accent="#7A4A82" onClick={() => T2('Holat ochildi', { tone: 'warn' })}>Holat ochish</SBtn>} />
      <FilterBar searchPlaceholder="Signal..." chips={[{ l: 'Hammasi', n: 12, on: true }, { l: 'Yuqori', n: 3, icon: Icons.flag }, { l: 'Davomat', n: 5 }, { l: 'Moliya', n: 2 }]} />
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        <Table cols={[{ label: 'Signal' }, { label: 'Tur' }, { label: 'Obyekt' }, { label: 'AI skor', align: 'center' }, { label: 'Jiddiylik', align: 'center' }, { label: '', align: 'right', w: 80 }]}>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="sp-anom-dot" style={{ background: r[4] === 'high' ? 'var(--sf-danger)' : r[4] === 'med' ? 'var(--sf-warn)' : 'var(--sf-muted)' }} /><span style={{ fontWeight: 600, fontSize: 12.5 }}>{r[0]}</span></div></td>
              <td><Pill>{r[1]}</Pill></td>
              <td style={{ color: 'var(--sf-muted)', fontSize: 12 }}>{r[2]}</td>
              <td align="center"><div className="sp-score"><div className="sp-score-bar"><div style={{ width: r[3] + '%', background: r[3] >= 80 ? 'var(--sf-danger)' : r[3] >= 60 ? 'var(--sf-warn)' : 'var(--sf-muted)' }} /></div><span className="sf-mono" style={{ fontSize: 11, fontWeight: 700 }}>{r[3]}</span></div></td>
              <td align="center"><Pill tone={r[4] === 'high' ? 'danger' : r[4] === 'med' ? 'warn' : 'neutral'} dot>{r[4] === 'high' ? 'Yuqori' : r[4] === 'med' ? 'O‘rta' : 'Past'}</Pill></td>
              <td align="right"><button className="sp-icon-b" onClick={() => T2('Tekshirishga olindi', { tone: 'info' })}>{React.cloneElement(Icons.check, { size: 15 })}</button></td>
            </tr>
          ))}
        </Table>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffLogs() {
  const logs = [['Dilnoza Yo‘ldosheva', 'Manager', 'To‘lov o‘zgartirdi', '09:42', false], ['admin_yun', 'Admin', 'Profil 02:14 da o‘zgartirdi', '02:14', true], ['Sardor Rashidov', 'CEO', 'Moliya eksport qildi', '08:30', false], ['Malika Yusupova', 'O‘qituvchi', '48 karta berdi', 'Kecha', true], ['office_seb', 'Ofis', 'Kvitansiyasiz naqd', '2 kun', true]];
  return (
    <>
      <StaffH eyebrow="Kirish jurnali" title="Kirish jurnali" sub="O‘zgarmas yozuv · barcha harakatlar"
        right={<SBtn onClick={() => T2('Jurnal eksport qilindi', { tone: 'success' })}>{React.cloneElement(Icons.download, { size: 14 })} Eksport</SBtn>} />
      <div className="sp-card" style={{ overflow: 'hidden' }}>
        <Table cols={[{ label: 'Foydalanuvchi' }, { label: 'Rol' }, { label: 'Harakat' }, { label: 'Vaqt', align: 'right' }]}>
          {logs.map((l, i) => (
            <tr key={i} style={l[4] ? { background: 'color-mix(in oklab, var(--sf-danger) 5%, transparent)' } : {}}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{l[4] && <span className="sp-anom-dot" style={{ background: 'var(--sf-danger)' }} />}<span style={{ fontWeight: 600, fontSize: 12.5 }} className={l[0].includes('_') ? 'sf-mono' : ''}>{l[0]}</span></div></td>
              <td><Pill>{l[1]}</Pill></td>
              <td style={{ fontSize: 12.5 }}>{l[2]}</td>
              <td align="right"><span className="sf-mono" style={{ fontSize: 11, color: l[4] ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: l[4] ? 700 : 400 }}>{l[3]}</span></td>
            </tr>
          ))}
        </Table>
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffCases() {
  const cases = [['C-0042', 'Sebzor · kvitansiyasiz naqd', 'high', 'open'], ['C-0041', 'Mirobod · karta nomutanosibligi', 'med', 'review'], ['C-0040', 'Davomat anomaliyasi', 'high', 'open'], ['C-0039', 'So‘rovnoma yaxlitligi', 'med', 'review'], ['C-0038', 'Tungi profil o‘zgarishi', 'low', 'closed']];
  const st = { open: ['danger', 'Ochiq'], review: ['warn', 'Tekshir'], closed: ['success', 'Yopilgan'] };
  return (
    <>
      <StaffH eyebrow="8 faol holat" title="Holatlar" sub="Audit tergovlari"
        right={<SBtn kind="primary" accent="#7A4A82" onClick={() => T2('Yangi holat yaratildi', { tone: 'success' })}>{React.cloneElement(Icons.plus, { size: 14 })} Holat</SBtn>} />
      <div className="sp-groups">
        {cases.map((c, i) => (
          <div key={i} className="sp-group" onClick={() => T2(c[0] + ' ochildi', { tone: 'info' })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--sf-muted)', marginRight: 'auto' }}>{c[0]}</span>
              <Pill tone={st[c[3]][0]} dot>{st[c[3]][1]}</Pill>
              <Pill tone={c[2] === 'high' ? 'danger' : c[2] === 'med' ? 'warn' : 'neutral'}>{c[2] === 'high' ? 'Yuqori' : c[2] === 'med' ? 'O‘rta' : 'Past'}</Pill>
            </div>
            <div style={{ marginTop: 9, fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>{c[1]}</div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--sf-border)', display: 'flex', gap: 6 }}>
              <button className="sp-group-act" style={{ marginLeft: 0 }} onClick={(e) => { e.stopPropagation(); T2('Tergovga olindi', { tone: 'info' }); }}>Tergov</button>
              <button className="sp-group-act" onClick={(e) => { e.stopPropagation(); T2('Holat yopildi', { tone: 'success' }); }}>Yopish</button>
            </div>
          </div>
        ))}
      </div>
      <style>{staffPageStyles}</style>
    </>
  );
}

function StaffSettings({ role }) {
  const ctl = useControl();
  const [tg, setTg] = React.useState({ push: true, dars: true, karta: true, ai: false });
  const toggle = (k) => { setTg(s => ({ ...s, [k]: !s[k] })); T2(tg[k] ? 'O‘chirildi' : 'Yoqildi', { tone: tg[k] ? 'default' : 'success' }); };
  return (
    <>
      <StaffH eyebrow={STAFF_ROLES[role].label + ' konsoli'} title="Sozlamalar" sub={STAFF_ROLES[role].who}
        right={<SBtn kind="primary" onClick={() => ctl.setPanel(true)}>{React.cloneElement(Icons.brand, { size: 14 })} Ko‘rinishni sozlash</SBtn>} />
      <div className="sp-set-grid">
        <div className="sp-card">
          <div className="sp-card-h"><h3>Profil</h3></div>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
            <SfAvatar name={STAFF_ROLES[role].who} size={54} color={STAFF_ROLES[role].accent} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800 }}>{STAFF_ROLES[role].who}</div><div style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{STAFF_ROLES[role].sub}</div></div>
            <SBtn onClick={() => T2('Profil tahriri', { tone: 'info' })}>Tahrirlash</SBtn>
          </div>
        </div>
        <div className="sp-card">
          <div className="sp-card-h"><h3>Bildirishnomalar</h3></div>
          {[['push', 'Push xabarlar'], ['dars', 'Dars eslatmasi'], ['karta', 'Karta xabari'], ['ai', 'AI tavsiyalari']].map((r, i, a) => (
            <div key={r[0]} className="sp-set-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none' }}>
              <span style={{ fontSize: 13 }}>{r[1]}</span>
              <div className={'sp-toggle' + (tg[r[0]] ? ' on' : '')} onClick={() => toggle(r[0])}><i /></div>
            </div>
          ))}
        </div>
        <div className="sp-card">
          <div className="sp-card-h"><h3>Ko‘rinish</h3></div>
          {[['Rang mavzusi', SF_PALETTES.find(p => p.id === ctl.st.palette)?.n], ['Layout', SF_LAYOUTS.find(l => l.id === ctl.st.layout)?.n], ['Rejim', ctl.st.dark ? 'Qorong‘i' : 'Yorug‘'], ['Zichlik', ctl.st.density]].map((r, i, a) => (
            <div key={i} className="sp-set-row" style={{ borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none', cursor: 'pointer' }} onClick={() => ctl.setPanel(true)}>
              <span style={{ fontSize: 13 }}>{r[0]}</span><span style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{r[1]} ›</span>
            </div>
          ))}
        </div>
      </div>
      <button className="st-btn st-btn-ghost" style={{ marginTop: 16, color: 'var(--sf-danger)' }} onClick={() => T2('Tizimdan chiqildi', { tone: 'default' })}>{React.cloneElement(Icons.logout, { size: 14 })} Chiqish</button>
      <style>{staffPageStyles}</style>
    </>
  );
}

Object.assign(window, { StaffTeachers, StaffReports, StaffStudents, StaffLeads, StaffPayments, StaffAuditDash, StaffAnomalies, StaffLogs, StaffCases, StaffSettings });
