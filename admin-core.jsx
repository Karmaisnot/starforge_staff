// admin-core.jsx — Dashboard, Branches, Students, Groups, Teachers

// ═══ DASHBOARD (CEO + Manager) ═══════════════════════════════
function DashboardPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const rev = ceo ? 1284000000 : 342000000;
  return (
    <>
      <AdminPageH
        eyebrow={ceo ? 'Seshanba · 19 May 2026 · 4 filial' : 'Yunusobod filiali · 19 May 2026'}
        title={ceo ? 'Boshqaruv paneli' : 'Filial paneli'}
        sub={ceo ? 'Barcha filiallar bo‘yicha jonli ko‘rsatkichlar' : '512 o‘quvchi · 28 guruh · 16 xodim'}
        right={<>
          <ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Hisobot</ABtn>
          <ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} {ceo ? 'Yangi filial' : 'Yangi guruh'}</ABtn>
        </>}
      />

      <div className="ad-kpi-grid">
        <Kpi label="Oylik daromad" money={rev} accent="var(--sf-success)" trend={{ up: true, v: '12.4%' }}
             spark={[60,64,62,70,68,76,80,78,86,90,94,100].map(x => x * (rev/100))} icon={Icons.trend} />
        <Kpi label={ceo ? 'O‘quvchilar' : 'Faol o‘quvchi'} value={ceo ? '1 842' : '512'} trend={{ up: true, v: '4.1%' }}
             spark={[70,72,74,73,78,82,85,88,90,92,96,100]} icon={Icons.cohort} />
        <Kpi label="O‘rtacha davomat" value="91.2%" accent="var(--sf-primary)" trend={{ up: true, v: '0.8%' }}
             spark={[88,90,87,91,89,92,90,93,91,92,90,91]} icon={Icons.check} />
        <Kpi label="Churn (ketish)" value="3.4%" accent="var(--sf-danger)" trend={{ up: false, v: '0.6%' }}
             sub="Maqsad: < 4%" icon={Icons.trend} />
        <Kpi label="Qarzdorlik" money={ceo ? 84000000 : 22400000} accent="var(--sf-warn)"
             sub={ceo ? '142 oila' : '38 oila'} icon={Icons.flag} />
        {ceo && <Kpi label="NPS · qoniqish" value="72" accent="var(--sf-accent)" trend={{ up: true, v: '5' }} sub="Ota-onalar" icon={Icons.star} />}
        {!ceo && <Kpi label="Tasdiq kutmoqda" value="7" accent="var(--sf-warn)" sub="To‘lov · ta‘til · qaytarish" icon={Icons.check} />}
      </div>

      <div className="ad-dash-grid">
        <div className="ad-dash-l">
          <ACard title={ceo ? 'Daromad dinamikasi · 12 oy' : 'Filial daromadi · 12 oy'}
                 action={<div className="ad-seg-sm"><button className="on">12 oy</button><button>6 oy</button><button>YTD</button></div>}>
            <AreaChart color="var(--sf-success)"
              data={[820,860,910,890,960,1020,1080,1040,1140,1180,1220,1284].map(x => x*1e6)}
              labels={['Iyn','Iyl','Avg','Sen','Okt','Noy','Dek','Yan','Fev','Mar','Apr','May']} money />
            <div className="ad-chart-foot">
              <div><span className="ad-cf-l">Yillik prognoz</span><Money uzs={rev*12.4} className="ad-cf-v" /></div>
              <div><span className="ad-cf-l">O‘rtacha chek</span><Money uzs={680000} className="ad-cf-v" /></div>
              <div><span className="ad-cf-l">To‘lov darajasi</span><span className="ad-cf-v sf-mono">94.2%</span></div>
            </div>
          </ACard>

          {ceo ? (
            <ACard title="Filiallar reytingi" action={<a className="ad-link" onClick={() => onNav('branches')}>Batafsil ›</a>}>
              <HBars money rows={[
                { label: 'Yunusobod', v: 342000000, mark: true, color: 'var(--sf-primary)' },
                { label: 'Chilonzor', v: 318000000, mark: true, color: 'var(--sf-primary)' },
                { label: 'Mirobod', v: 308000000, mark: true, color: 'var(--sf-accent)' },
                { label: 'Sebzor', v: 216000000, mark: true, color: 'var(--sf-ink-2)' },
              ]} />
            </ACard>
          ) : (
            <ACard title="Bugungi tasdiqlash" action={<a className="ad-link" onClick={() => onNav('approvals')}>7 ta ›</a>} pad={false}>
              {[
                { t: 'To‘lov qaytarish · Akbarov A.', sub: 'Ortiqcha to‘lov', amt: 600000, kind: 'refund' },
                { t: 'Ta‘til · Yusupova N.', sub: '24–26 May · 3 kun', kind: 'leave' },
                { t: 'Yangi guruh · Ingliz B2', sub: 'Tursunov S.', kind: 'group' },
              ].map((a, i, arr) => (
                <div key={i} className="ad-appr-row" style={{ borderBottom: i < arr.length-1 ? '1px solid var(--sf-border)' : 'none' }}>
                  <div className="ad-appr-ic" style={{ background: 'var(--sf-warn-soft)', color: 'var(--sf-warn)' }}>
                    {React.cloneElement(a.kind === 'refund' ? Icons.trend : a.kind === 'leave' ? Icons.cal : Icons.brand, { size: 16 })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ad-appr-t">{a.t}</div>
                    <div className="ad-appr-s">{a.sub}{a.amt ? <> · <Money uzs={a.amt} /></> : null}</div>
                  </div>
                  <div className="ad-appr-acts">
                    <button className="ad-mini-btn ok">{React.cloneElement(Icons.check, { size: 15 })}</button>
                    <button className="ad-mini-btn no">{React.cloneElement(Icons.x, { size: 15 })}</button>
                  </div>
                </div>
              ))}
            </ACard>
          )}

          <ACard title={ceo ? 'O‘qituvchilar reytingi · top' : 'Xodimlar faolligi'} action={<a className="ad-link" onClick={() => onNav('teachers')}>Hammasi ›</a>} pad={false}>
            <Table cols={[
              { label: 'O‘qituvchi' }, { label: 'Filial' }, { label: 'Guruh', align: 'right' },
              { label: 'Davomat', align: 'right' }, { label: 'Kartalar', align: 'right' }, { label: 'Reyting', align: 'right' },
            ]}>
              {[
                { n: 'Nigora Karimova', b: 'Yunusobod', g: 3, att: 94, up: 18, down: 4, r: 4.9 },
                { n: 'Aziz Tursunov', b: 'Chilonzor', g: 4, att: 92, up: 22, down: 2, r: 4.8 },
                { n: 'Malika Yusupova', b: 'Mirobod', g: 3, att: 88, up: 12, down: 6, r: 4.5 },
                { n: 'Bobur Aliyev', b: 'Yunusobod', g: 4, att: 90, up: 15, down: 3, r: 4.6 },
              ].map((t, i) => (
                <tr key={i}>
                  <td><div className="ad-cell-u"><SfAvatar name={t.n} size={28} /><span style={{ fontWeight: 600 }}>{t.n}</span></div></td>
                  <td style={{ color: 'var(--sf-muted)' }}>{t.b}</td>
                  <td align="right" className="sf-mono">{t.g}</td>
                  <td align="right"><span className="sf-mono" style={{ fontWeight: 700, color: t.att >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)' }}>{t.att}%</span></td>
                  <td align="right"><span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700 }}>↑{t.up}</span> <span className="sf-mono" style={{ color: 'var(--sf-danger)', fontWeight: 700 }}>↓{t.down}</span></td>
                  <td align="right"><Pill tone="success">★ {t.r}</Pill></td>
                </tr>
              ))}
            </Table>
          </ACard>
        </div>

        <div className="ad-dash-r">
          {/* AI strategic */}
          <div className="ad-ai-card" onClick={() => onNav('ai')}>
            <div className="ad-ai-glow" />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SfAiBadge>Strategik tahlil</SfAiBadge>
                <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>3 ta</span>
              </div>
              <div className="ad-ai-quote">“{ceo ? 'Sebzor filialida churn 6.2% — boshqa filiallardan 2x yuqori. Marketing va o‘qituvchi sifatini ko‘rib chiqing.' : 'Bu oy 38 oila qarzdor. 12 tasi 30 kundan oshgan — eslatma yuborish tavsiya etiladi.'}”</div>
              <div className="ad-ai-chips">
                <Pill tone="ai">Sabab tahlili</Pill>
                <Pill tone="ai">Harakat rejasi</Pill>
              </div>
            </div>
          </div>

          <ACard title="O‘quvchilar oqimi" pad={true}>
            <div className="ad-flow">
              <div className="ad-flow-row"><span className="ad-flow-l" style={{ color: 'var(--sf-success)' }}>+ Yangi</span><span className="sf-mono">86</span><Bar pct={86} color="var(--sf-success)" /></div>
              <div className="ad-flow-row"><span className="ad-flow-l" style={{ color: 'var(--sf-primary)' }}>↻ Davom</span><span className="sf-mono">1 698</span><Bar pct={96} color="var(--sf-primary)" /></div>
              <div className="ad-flow-row"><span className="ad-flow-l" style={{ color: 'var(--sf-danger)' }}>− Ketgan</span><span className="sf-mono">58</span><Bar pct={28} color="var(--sf-danger)" /></div>
            </div>
            <div className="ad-flow-net">Sof o‘sish <span className="sf-mono" style={{ color: 'var(--sf-success)', fontWeight: 700 }}>+28</span> · bu oy</div>
          </ACard>

          <ACard title="Davomat / Kartalar salomatligi" pad={true}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Donut size={120} segments={[
                { v: 72, c: 'var(--sf-success)' }, { v: 19, c: 'var(--sf-warn)' }, { v: 9, c: 'var(--sf-danger)' },
              ]} center={<><div className="sf-mono" style={{ fontSize: 22, fontWeight: 700 }}>91%</div><div style={{ fontSize: 9, color: 'var(--sf-muted)', textTransform: 'uppercase' }}>davomat</div></>} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Legend c="var(--sf-success)" l="Yaxshi (>90%)" v="72%" />
                <Legend c="var(--sf-warn)" l="O‘rta (80-90%)" v="19%" />
                <Legend c="var(--sf-danger)" l="Past (<80%)" v="9%" />
                <div className="ad-card-mini-row">
                  <span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700 }}>↑ 248</span>
                  <span className="sf-mono" style={{ color: 'var(--sf-danger)', fontWeight: 700 }}>↓ 42</span>
                  <span style={{ fontSize: 10, color: 'var(--sf-muted)' }}>kartalar · bu hafta</span>
                </div>
              </div>
            </div>
          </ACard>

          <ACard title="So‘nggi hodisalar" pad={false}>
            {[
              { t: 'Yangi to‘lov · 1.2 mln', who: 'Chilonzor', icon: Icons.trend, c: 'var(--sf-success)', tm: '2 daq' },
              { t: 'Qarz eslatmasi yuborildi', who: '12 oila', icon: Icons.bell, c: 'var(--sf-warn)', tm: '14 daq' },
              { t: 'Yangi o‘quvchi qabul', who: 'Yunusobod', icon: Icons.cohort, c: 'var(--sf-primary)', tm: '1 soat' },
              { t: 'Audit flagi · davomat', who: 'Mirobod', icon: Icons.flag, c: 'var(--sf-danger)', tm: '2 soat' },
            ].map((e, i, a) => (
              <div key={i} className="ad-event" style={{ borderBottom: i < a.length-1 ? '1px solid var(--sf-border)' : 'none' }}>
                <div className="ad-event-ic" style={{ background: e.c + '22', color: e.c }}>{React.cloneElement(e.icon, { size: 13 })}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div className="ad-event-t">{e.t}</div><div className="ad-event-w">{e.who}</div></div>
                <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{e.tm}</span>
              </div>
            ))}
          </ACard>
        </div>
      </div>
      <style>{coreStyles}</style>
    </>
  );
}

function Legend({ c, l, v }) {
  return <div className="ad-legend"><span className="ad-legend-dot" style={{ background: c }} /><span className="ad-legend-l">{l}</span><span className="sf-mono ad-legend-v">{v}</span></div>;
}

// ═══ BRANCHES (CEO) ══════════════════════════════════════════
function BranchesPage({ onNav }) {
  const branches = [
    { n: 'Yunusobod', mgr: 'Dilnoza Yo‘ldosheva', st: 512, t: 16, rev: 342000000, att: 94, churn: 2.8, growth: 5.2, tone: 'var(--sf-success)', status: 'active' },
    { n: 'Chilonzor', mgr: 'Rustam Olimov', st: 486, t: 15, rev: 318000000, att: 92, churn: 3.1, growth: 4.6, tone: 'var(--sf-success)', status: 'active' },
    { n: 'Mirobod', mgr: 'Gulnora Saidova', st: 478, t: 14, rev: 308000000, att: 90, churn: 3.4, growth: 3.1, tone: 'var(--sf-warn)', status: 'active' },
    { n: 'Sebzor', mgr: 'Akmal Yusupov', st: 366, t: 9, rev: 216000000, att: 87, churn: 6.2, growth: -1.2, tone: 'var(--sf-danger)', status: 'review' },
    { n: 'Olmazor', mgr: 'Tayinlanmagan', st: 0, t: 0, rev: 0, att: 0, churn: 0, growth: 0, tone: 'var(--sf-muted)', status: 'opening' },
  ];
  const statusPill = { active: ['success', 'Faol'], review: ['warn', 'Nazoratda'], opening: ['primary', 'Ochilmoqda'], paused: ['danger', 'To‘xtatilgan'] };
  return (
    <>
      <AdminPageH eyebrow="5 filial · 1842 o‘quvchi" title="Filiallar" sub="Boshqaruv, taqqoslama va yangi filial ochish"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi filial ochish</ABtn></>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="Faol filiallar" value="4" accent="var(--sf-success)" icon={Icons.globe} />
        <Kpi label="Ochilmoqda" value="1" accent="var(--sf-primary)" sub="Olmazor · iyun" />
        <Kpi label="Jami daromad" money={1184000000} accent="var(--sf-success)" trend={{ up: true, v: '8.2%' }} />
        <Kpi label="Nazoratda" value="1" accent="var(--sf-warn)" sub="Sebzor · churn" />
      </div>
      <div className="ad-branch-cards">
        {branches.map((b, i) => (
          <ACard key={i} pad={false} className="ad-branch-card">
            <div className="ad-bc-head">
              <div className="ad-bc-rank">{b.status === 'opening' ? '—' : '#' + (i + 1)}</div>
              <div className="ad-bc-mark" style={{ background: b.tone }}><SfStar size={20} color="#FFFCF5" /></div>
              <div style={{ flex: 1 }}>
                <div className="ad-bc-n">{b.n}</div>
                <div className="ad-bc-mgr"><SfAvatar name={b.mgr} size={16} /> {b.mgr}</div>
              </div>
              <Pill tone={statusPill[b.status][0]} dot>{statusPill[b.status][1]}</Pill>
            </div>
            {b.status === 'opening' ? (
              <div className="ad-bc-opening">
                <div className="ad-bc-open-bar"><div style={{ width: '65%' }} /></div>
                <div className="ad-bc-open-t">Tayyorlik 65% · menejer tayinlash kerak</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="ad-btn ad-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Menejer tayinlash</button>
                  <button className="ad-btn ad-btn-ghost">Sozlash</button>
                </div>
              </div>
            ) : (
              <>
                <div className="ad-bc-stats">
                  <div><Money uzs={b.rev} className="ad-bc-v" /><span className="ad-bc-l">daromad/oy</span></div>
                  <div><span className="ad-bc-v sf-mono">{b.st}</span><span className="ad-bc-l">o‘quvchi</span></div>
                  <div><span className="ad-bc-v sf-mono">{b.t}</span><span className="ad-bc-l">xodim</span></div>
                  <div><span className="ad-bc-v sf-mono" style={{ color: b.att >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)' }}>{b.att}%</span><span className="ad-bc-l">davomat</span></div>
                  <div><span className="ad-bc-v sf-mono" style={{ color: b.churn <= 3.5 ? 'var(--sf-success)' : 'var(--sf-danger)' }}>{b.churn}%</span><span className="ad-bc-l">churn</span></div>
                </div>
                <div className="ad-bc-actions">
                  <button className="ad-bc-act">{React.cloneElement(Icons.trend, { size: 13 })} Hisobot</button>
                  <button className="ad-bc-act">{React.cloneElement(Icons.settings, { size: 13 })} Sozlash</button>
                  <button className="ad-bc-act" style={{ color: 'var(--sf-warn)' }}>{React.cloneElement(Icons.clock, { size: 13 })} To‘xtatish</button>
                </div>
              </>
            )}
          </ACard>
        ))}
        <button className="ad-bc-new">
          <div className="ad-bc-new-ic">{React.cloneElement(Icons.plus, { size: 24 })}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Yangi filial ochish</div>
          <div style={{ fontSize: 11, color: 'var(--sf-muted)', textAlign: 'center', maxWidth: 200 }}>Manzil, menejer, xonalar va guruhlarni sozlang</div>
        </button>
      </div>
      <ACard title="Filiallar taqqoslamasi" style={{ marginTop: 14 }}>
        <BarChart labels={['Yunus.', 'Chilon.', 'Mirobod', 'Sebzor']}
          series={[[512, 486, 478, 366], [342, 318, 308, 216]]}
          colors={['var(--sf-primary)', 'var(--sf-accent)']} />
        <div className="ad-chart-legend">
          <Legend c="var(--sf-primary)" l="O‘quvchilar" v="" />
          <Legend c="var(--sf-accent)" l="Daromad (mln)" v="" />
        </div>
      </ACard>
      <style>{coreStyles}</style>
      <style>{`
        .ad-bc-actions { display: flex; border-top: 1px solid var(--sf-border); }
        .ad-bc-act { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 10px 4px; background: transparent; border: none; border-right: 1px solid var(--sf-border); cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 600; color: var(--sf-ink-2); }
        .ad-bc-act:last-child { border-right: none; }
        .ad-bc-act:hover { background: var(--sf-surface-2); }
        .ad-bc-opening { padding: 14px 16px; }
        .ad-bc-open-bar { height: 6px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
        .ad-bc-open-bar > div { height: 100%; background: var(--sf-primary); border-radius: 4px; }
        .ad-bc-open-t { margin-top: 7px; font-size: 11px; color: var(--sf-muted); }
        .ad-bc-new { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 240px; border-radius: 14px; border: 1.5px dashed var(--sf-border-strong); background: var(--sf-surface); cursor: pointer; font-family: inherit; }
        .ad-bc-new:hover { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
        .ad-bc-new-ic { width: 48px; height: 48px; border-radius: 13px; background: var(--sf-primary-soft); color: var(--sf-primary); display: flex; align-items: center; justify-content: center; }
      `}</style>
    </>
  );
}

// ═══ STUDENTS ════════════════════════════════════════════════
function StudentsPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const students = [
    { n: 'Akbarov Akmal', id: '00042', g: '9-B Algebra', b: 'Yunusobod', att: 96, up: 12, down: 1, pay: 'paid', debt: 0, par: 'Akbarova D.' },
    { n: 'Azizova Madina', id: '00043', g: '9-B Algebra', b: 'Yunusobod', att: 98, up: 8, down: 0, pay: 'paid', debt: 0, par: 'Azizov B.' },
    { n: 'Bakirov Sherzod', id: '00044', g: 'Algebra Mid', b: 'Chilonzor', att: 88, up: 2, down: 2, pay: 'debt', debt: 600000, par: 'Bakirova Z.' },
    { n: 'Davronova Sevinch', id: '00045', g: 'Algebra Mid', b: 'Yunusobod', att: 92, up: 4, down: 0, pay: 'paid', debt: 0, par: 'Davronov T.' },
    { n: 'Eshmatov Otabek', id: '00046', g: '9-B Algebra', b: 'Mirobod', att: 72, up: 1, down: 4, pay: 'debt', debt: 1200000, par: 'Eshmatova G.', risk: true },
    { n: 'Fayzullayev Diyor', id: '00047', g: '10-V Geom', b: 'Yunusobod', att: 94, up: 5, down: 1, pay: 'paid', debt: 0, par: 'Fayzullayev N.' },
    { n: 'G‘aniyev Jasur', id: '00048', g: '10-V Geom', b: 'Sebzor', att: 89, up: 3, down: 1, pay: 'partial', debt: 300000, par: 'G‘aniyeva M.' },
    { n: 'Halimova Zilola', id: '00049', g: '9-B Algebra', b: 'Chilonzor', att: 95, up: 7, down: 0, pay: 'paid', debt: 0, par: 'Halimov R.' },
    { n: 'Ibragimov Sardor', id: '00050', g: 'Algebra Mid', b: 'Yunusobod', att: 91, up: 4, down: 1, pay: 'paid', debt: 0, par: 'Ibragimova S.' },
    { n: 'Karimov Rustam', id: '00052', g: '10-V Geom', b: 'Mirobod', att: 84, up: 2, down: 2, pay: 'debt', debt: 600000, par: 'Karimova D.' },
  ];
  const payTone = { paid: ['success', 'To‘langan'], debt: ['danger', 'Qarz'], partial: ['warn', 'Qisman'] };
  return (
    <>
      <AdminPageH eyebrow={ceo ? '4 filial' : 'Yunusobod filiali'} title="O‘quvchilar"
        sub={ceo ? '1 842 o‘quvchi · 96 guruh' : '512 o‘quvchi · 28 guruh'}
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Qabul</ABtn></>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Kpi label="Jami" value={ceo ? '1 842' : '512'} icon={Icons.cohort} />
        <Kpi label="Faol" value={ceo ? '1 784' : '496'} accent="var(--sf-success)" />
        <Kpi label="Qarzdor" value={ceo ? '142' : '38'} accent="var(--sf-danger)" sub="oila" />
        <Kpi label="Riskli" value={ceo ? '24' : '6'} accent="var(--sf-warn)" sub="ketish ehtimoli" />
        <Kpi label="Bu oy qabul" value="+86" accent="var(--sf-primary)" />
      </div>
      <FilterBar searchPlaceholder="Ism, ID yoki ota-ona bo‘yicha..."
        chips={[
          { l: 'Hammasi', n: ceo ? 1842 : 512, on: true }, { l: 'Faol', icon: Icons.check }, { l: 'Qarzdor', n: 38, icon: Icons.flag },
          { l: 'Riskli', n: 6 }, ...(ceo ? [{ l: 'Filial', icon: Icons.globe }] : []), { l: 'Guruh', icon: Icons.brand }, { l: 'Davomat', icon: Icons.trend },
        ]}
        right={<div className="ad-seg-sm"><button className="on">Jadval</button><button>Karta</button></div>} />
      <ACard pad={false}>
        <Table cols={[
          { label: 'O‘quvchi' }, { label: 'Guruh' }, ...(ceo ? [{ label: 'Filial' }] : []),
          { label: 'Davomat', align: 'right' }, { label: 'Kartalar', align: 'center' },
          { label: 'To‘lov', align: 'center' }, { label: 'Qarz', align: 'right' }, { label: 'Ota-ona' }, { label: '', align: 'right', w: 40 },
        ]}>
          {students.map((s, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u">
                <SfAvatar name={s.n} size={30} />
                <div><div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>{s.n}{s.risk && <Pill tone="danger">risk</Pill>}</div>
                  <div className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>DEMO-2026-{s.id}</div></div>
              </div></td>
              <td><span style={{ fontSize: 12.5 }}>{s.g}</span></td>
              {ceo && <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{s.b}</td>}
              <td align="right"><span className="sf-mono" style={{ fontWeight: 700, color: s.att >= 92 ? 'var(--sf-success)' : s.att >= 85 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>{s.att}%</span></td>
              <td align="center"><span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700, fontSize: 12 }}>↑{s.up}</span> <span className="sf-mono" style={{ color: s.down ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700, fontSize: 12 }}>↓{s.down}</span></td>
              <td align="center"><Pill tone={payTone[s.pay][0]}>{payTone[s.pay][1]}</Pill></td>
              <td align="right">{s.debt ? <Money uzs={s.debt} style={{ color: 'var(--sf-danger)', fontWeight: 700 }} /> : <span style={{ color: 'var(--sf-muted)' }}>—</span>}</td>
              <td><span style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{s.par}</span></td>
              <td align="right">{React.cloneElement(Icons.chevR, { size: 14, style: { color: 'var(--sf-muted)' } })}</td>
            </tr>
          ))}
        </Table>
        <div className="ad-table-foot">
          <span>{ceo ? '1–10 / 1 842' : '1–10 / 512'}</span>
          <div className="ad-pager"><button>‹</button><button className="on">1</button><button>2</button><button>3</button><span>…</span><button>{ceo ? 185 : 52}</button><button>›</button></div>
        </div>
      </ACard>
      <style>{coreStyles}</style>
    </>
  );
}

// ═══ GROUPS ══════════════════════════════════════════════════
function GroupsPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const groups = [
    { n: '9-B Algebra', t: 'Nigora Karimova', b: 'Yunusobod', st: 24, cap: 26, att: 94, sch: 'Du/Se/Pa · 09:00', fee: 600000, tone: 'var(--sf-primary)' },
    { n: 'Algebra Mid', t: 'Nigora Karimova', b: 'Yunusobod', st: 21, cap: 24, att: 96, sch: 'Cho/Pa · 14:00', fee: 600000, tone: 'var(--sf-primary)' },
    { n: '10-V Geometriya', t: 'Bobur Aliyev', b: 'Chilonzor', st: 19, cap: 22, att: 88, sch: 'Du/Pa · 11:30', fee: 650000, tone: 'var(--sf-accent)' },
    { n: 'Ingliz B2 · Intensiv', t: 'Aziz Tursunov', b: 'Mirobod', st: 16, cap: 18, att: 92, sch: 'Har kuni · 16:00', fee: 850000, tone: 'var(--sf-success)' },
    { n: 'Fizika · DTM', t: 'Malika Yusupova', b: 'Sebzor', st: 14, cap: 20, att: 85, sch: 'Se/Pa/Sh · 10:00', fee: 700000, tone: 'var(--sf-ink-2)' },
  ];
  return (
    <>
      <AdminPageH eyebrow={ceo ? '96 guruh' : '28 guruh'} title="Guruhlar" sub={ceo ? 'Barcha filiallar bo‘yicha' : 'Yunusobod filiali'}
        right={<ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi guruh</ABtn>} />
      <FilterBar searchPlaceholder="Guruh yoki o‘qituvchi..."
        chips={[{ l: 'Hammasi', n: ceo ? 96 : 28, on: true }, { l: 'Faol', icon: Icons.check }, { l: 'To‘lgan', n: 12 }, { l: 'Bo‘sh joy bor', n: 18 }, { l: 'Fan', icon: Icons.brand }]} />
      <div className="ad-groups-grid">
        {groups.map((g, i) => (
          <ACard key={i} pad={false} className="ad-group-card">
            <div className="ad-gc-head">
              <div className="ad-gc-mark" style={{ background: g.tone }}><SfStar size={18} color="#FFFCF5" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ad-gc-n">{g.n}</div>
                <div className="ad-gc-t"><SfAvatar name={g.t} size={15} /> {g.t}</div>
              </div>
              {ceo && <Pill>{g.b}</Pill>}
            </div>
            <div className="ad-gc-cap">
              <div className="ad-gc-cap-bar">
                <div style={{ width: `${(g.st/g.cap)*100}%`, background: g.st/g.cap > 0.9 ? 'var(--sf-warn)' : 'var(--sf-success)' }} />
              </div>
              <span className="sf-mono ad-gc-cap-t">{g.st}/{g.cap}</span>
            </div>
            <div className="ad-gc-meta">
              <div className="ad-gc-meta-i">{React.cloneElement(Icons.clock, { size: 12 })} {g.sch}</div>
              <div className="ad-gc-meta-i"><span className="sf-mono" style={{ color: g.att >= 92 ? 'var(--sf-success)' : 'var(--sf-warn)', fontWeight: 700 }}>{g.att}%</span> davomat</div>
              <div className="ad-gc-meta-i">{React.cloneElement(Icons.trend, { size: 12 })} <Money uzs={g.fee} />/oy</div>
            </div>
          </ACard>
        ))}
      </div>
      <style>{coreStyles}</style>
    </>
  );
}

// ═══ TEACHERS / STAFF ════════════════════════════════════════
function TeachersPage({ role, onNav }) {
  const ceo = role === 'ceo';
  const teachers = [
    { n: 'Nigora Karimova', role: 'Katta o‘qituvchi', b: 'Yunusobod', sub: 'Matematika', g: 3, st: 58, att: 94, up: 18, down: 4, r: 4.9, sal: 8400000, st2: 'active' },
    { n: 'Aziz Tursunov', role: 'O‘qituvchi', b: 'Chilonzor', sub: 'Ingliz tili', g: 4, st: 64, att: 92, up: 22, down: 2, r: 4.8, sal: 7800000, st2: 'active' },
    { n: 'Malika Yusupova', role: 'O‘qituvchi', b: 'Mirobod', sub: 'Fizika', g: 3, st: 42, att: 88, up: 12, down: 6, r: 4.5, sal: 7200000, st2: 'active' },
    { n: 'Bobur Aliyev', role: 'O‘qituvchi', b: 'Yunusobod', sub: 'Geometriya', g: 4, st: 56, att: 90, up: 15, down: 3, r: 4.6, sal: 7600000, st2: 'active' },
    { n: 'Sevara Olimova', role: 'Assistent', b: 'Yunusobod', sub: 'Matematika', g: 2, st: 28, att: 96, up: 8, down: 0, r: 4.7, sal: 4200000, st2: 'active' },
    { n: 'Jasur Rahimov', role: 'O‘qituvchi', b: 'Sebzor', sub: 'Kimyo', g: 3, st: 38, att: 82, up: 6, down: 8, r: 3.9, sal: 7000000, st2: 'review' },
  ];
  return (
    <>
      <AdminPageH eyebrow={ceo ? '54 xodim · 4 filial' : '16 xodim'} title={ceo ? 'O‘qituvchilar' : 'Xodimlar'}
        sub="O‘qituvchilar, assistentlar va reyting"
        right={<>{!ceo && <ABtn kind="soft">{React.cloneElement(Icons.check, { size: 14 })} Vazifa biriktirish</ABtn>}<ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Xodim</ABtn></>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="Jami xodim" value={ceo ? '54' : '16'} icon={Icons.user} />
        <Kpi label="O‘rtacha reyting" value="4.6" accent="var(--sf-accent)" sub="5 dan" icon={Icons.star} />
        <Kpi label="Oylik fond" money={ceo ? 412000000 : 96000000} accent="var(--sf-success)" icon={Icons.trend} />
        <Kpi label="Ko‘rib chiqishda" value="2" accent="var(--sf-warn)" sub="past reyting" />
      </div>
      <FilterBar searchPlaceholder="Xodim ismi..."
        chips={[{ l: 'Hammasi', n: ceo ? 54 : 16, on: true }, { l: 'O‘qituvchi', n: 38 }, { l: 'Assistent', n: 12 }, { l: 'Faol', icon: Icons.check }, { l: 'Tekshiruv', n: 2, icon: Icons.flag }, { l: 'Fan', icon: Icons.brand }]} />
      <ACard pad={false}>
        <Table cols={[
          { label: 'Xodim' }, { label: 'Fan' }, ...(ceo ? [{ label: 'Filial' }] : []),
          { label: 'Guruh', align: 'right' }, { label: 'O‘quvchi', align: 'right' }, { label: 'Davomat', align: 'right' },
          { label: 'Kartalar', align: 'center' }, { label: 'Reyting', align: 'center' }, { label: 'Maosh', align: 'right' }, { label: 'Holat', align: 'center' },
        ]}>
          {teachers.map((t, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u"><SfAvatar name={t.n} size={30} /><div><div style={{ fontWeight: 600 }}>{t.n}</div><div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{t.role}</div></div></div></td>
              <td><span style={{ fontSize: 12.5 }}>{t.sub}</span></td>
              {ceo && <td style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{t.b}</td>}
              <td align="right" className="sf-mono">{t.g}</td>
              <td align="right" className="sf-mono">{t.st}</td>
              <td align="right"><span className="sf-mono" style={{ fontWeight: 700, color: t.att >= 92 ? 'var(--sf-success)' : t.att >= 85 ? 'var(--sf-warn)' : 'var(--sf-danger)' }}>{t.att}%</span></td>
              <td align="center"><span className="sf-mono" style={{ color: '#7A4F0E', fontWeight: 700, fontSize: 12 }}>↑{t.up}</span> <span className="sf-mono" style={{ color: t.down > 4 ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700, fontSize: 12 }}>↓{t.down}</span></td>
              <td align="center"><Pill tone={t.r >= 4.5 ? 'success' : t.r >= 4 ? 'warn' : 'danger'}>★ {t.r}</Pill></td>
              <td align="right"><Money uzs={t.sal} /></td>
              <td align="center"><Pill tone={t.st2 === 'active' ? 'success' : 'warn'} dot>{t.st2 === 'active' ? 'Faol' : 'Tekshir'}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{coreStyles}</style>
    </>
  );
}

const coreStyles = `
.ad-dash-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 16px; }
@media (max-width: 1280px) { .ad-dash-grid { grid-template-columns: 1fr; } }
.ad-dash-l, .ad-dash-r { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

.ad-seg-sm { display: inline-flex; padding: 2px; background: var(--sf-surface-2); border-radius: 8px; }
.ad-seg-sm button { background: transparent; border: none; cursor: pointer; padding: 4px 10px; border-radius: 6px; font-family: inherit; font-size: 11.5px; font-weight: 600; color: var(--sf-muted); }
.ad-seg-sm button.on { background: var(--sf-surface); color: var(--sf-ink); box-shadow: var(--sf-shadow-sm); }

.ad-chart-foot { display: flex; gap: 24px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--sf-border); }
.ad-cf-l { font-size: 11px; color: var(--sf-muted); display: block; }
.ad-cf-v { font-size: 15px; font-weight: 700; margin-top: 2px; display: block; }
.ad-chart-legend { display: flex; gap: 18px; margin-top: 10px; justify-content: center; }

.ad-cell-u { display: flex; align-items: center; gap: 9px; }

.ad-appr-row { display: flex; align-items: center; gap: 11px; padding: 11px 16px; }
.ad-appr-ic { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-appr-t { font-size: 13px; font-weight: 600; }
.ad-appr-s { font-size: 11px; color: var(--sf-muted); margin-top: 1px; }
.ad-appr-acts { display: flex; gap: 5px; }
.ad-mini-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ad-mini-btn.ok { color: var(--sf-success); } .ad-mini-btn.ok:hover { background: var(--sf-success); color: #fff; border-color: transparent; }
.ad-mini-btn.no { color: var(--sf-danger); } .ad-mini-btn.no:hover { background: var(--sf-danger); color: #fff; border-color: transparent; }

.ad-ai-card { position: relative; padding: 18px; border-radius: 14px; background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); cursor: pointer; overflow: hidden; }
.ad-ai-glow { position: absolute; inset: -50%; background: radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--sf-accent) 18%, transparent) 0%, transparent 50%); pointer-events: none; }
.ad-ai-quote { font-family: var(--sf-font-display); font-style: italic; font-size: 16px; line-height: 1.35; color: var(--sf-ink); }
.ad-ai-chips { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; }

.ad-flow { display: flex; flex-direction: column; gap: 10px; }
.ad-flow-row { display: grid; grid-template-columns: 70px 44px 1fr; gap: 10px; align-items: center; font-size: 12px; }
.ad-flow-l { font-weight: 700; }
.ad-flow-net { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--sf-border); font-size: 12px; color: var(--sf-muted); }

.ad-legend { display: flex; align-items: center; gap: 7px; }
.ad-legend-dot { width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0; }
.ad-legend-l { font-size: 11.5px; color: var(--sf-ink-2); flex: 1; }
.ad-legend-v { font-size: 11.5px; font-weight: 700; }
.ad-card-mini-row { display: flex; gap: 8px; align-items: center; margin-top: 6px; padding-top: 8px; border-top: 1px dashed var(--sf-border); font-size: 11px; }

.ad-event { display: flex; align-items: center; gap: 10px; padding: 10px 16px; }
.ad-event-ic { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-event-t { font-size: 12.5px; font-weight: 600; }
.ad-event-w { font-size: 10.5px; color: var(--sf-muted); }

.ad-table-foot { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid var(--sf-border); font-size: 12px; color: var(--sf-muted); }
.ad-pager { display: flex; gap: 3px; }
.ad-pager button { min-width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: var(--sf-font-mono); font-size: 12px; color: var(--sf-ink-2); }
.ad-pager button.on { background: var(--sf-ink); color: var(--sf-bg); border-color: transparent; }

.ad-branch-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
.ad-branch-card { padding: 0; }
.ad-bc-head { display: flex; align-items: center; gap: 10px; padding: 16px 16px 12px; position: relative; }
.ad-bc-rank { position: absolute; top: 10px; right: 14px; font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-muted-2); }
.ad-bc-mark { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-bc-n { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; }
.ad-bc-mgr { font-size: 11px; color: var(--sf-muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ad-bc-stats { display: grid; grid-template-columns: repeat(5, 1fr); border-top: 1px solid var(--sf-border); }
.ad-bc-stats > div { padding: 10px 6px; text-align: center; border-right: 1px solid var(--sf-border); }
.ad-bc-stats > div:last-child { border-right: none; }
.ad-bc-v { font-size: 14px; font-weight: 700; display: block; }
.ad-bc-l { font-size: 8.5px; color: var(--sf-muted); text-transform: uppercase; letter-spacing: 0.03em; font-weight: 600; margin-top: 2px; display: block; }
.ad-bc-spark { padding: 8px 12px 12px; }

.ad-groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.ad-gc-head { display: flex; align-items: center; gap: 11px; padding: 14px 16px; }
.ad-gc-mark { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ad-gc-n { font-size: 14.5px; font-weight: 700; }
.ad-gc-t { font-size: 11px; color: var(--sf-muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ad-gc-cap { display: flex; align-items: center; gap: 10px; padding: 0 16px 12px; }
.ad-gc-cap-bar { flex: 1; height: 7px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; }
.ad-gc-cap-bar > div { height: 100%; border-radius: 4px; }
.ad-gc-cap-t { font-size: 11px; font-weight: 700; color: var(--sf-muted); }
.ad-gc-meta { border-top: 1px solid var(--sf-border); padding: 10px 16px; display: flex; flex-direction: column; gap: 6px; }
.ad-gc-meta-i { font-size: 11.5px; color: var(--sf-ink-2); display: flex; align-items: center; gap: 6px; }
`;

Object.assign(window, { DashboardPage, BranchesPage, StudentsPage, GroupsPage, TeachersPage });
