// admin-mobile.jsx — Mobile consoles for CEO / Manager / Audit
// Interactive phone (tabs switch screens). iOS + Android framed in a canvas.

const MROLE = {
  ceo: { label: 'CEO', who: 'Sardor Rashidov', role: 'Bosh direktor', scope: 'Barcha filiallar', accent: 'var(--sf-primary)',
    tabs: [['dash','Panel',Icons.home],['students','O‘quvchi',Icons.cohort],['messages','Xabar',Icons.chat],['ai','AI',Icons.ai],['me','Profil',Icons.user]] },
  manager: { label: 'Manager', who: 'Dilnoza Yo‘ldosheva', role: 'Filial menejeri', scope: 'Yunusobod', accent: 'var(--sf-primary)',
    tabs: [['dash','Panel',Icons.home],['students','O‘quvchi',Icons.cohort],['messages','Xabar',Icons.chat],['approvals','Tasdiq',Icons.check],['me','Profil',Icons.user]] },
  audit: { label: 'Audit', who: 'Jamshid Qodirov', role: 'Bosh auditor', scope: 'Nazorat', accent: '#7A4A82',
    tabs: [['dash','Panel',Icons.shield],['anomalies','Signal',Icons.flag],['messages','Xabar',Icons.chat],['cases','Holat',Icons.pin],['me','Profil',Icons.user]] },
};

function MM({ uzs }) { return <span className="sf-mono">{fmtMoney(uzs, 'UZS')}</span>; }
function Legend({ c, l, v }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c, flexShrink: 0 }} /><span style={{ fontSize: 11.5, color: 'var(--sf-ink-2)', flex: 1 }}>{l}</span><span className="sf-mono" style={{ fontSize: 11.5, fontWeight: 700 }}>{v}</span></div>;
}

function AMPhone({ role, platform }) {
  const cfg = MROLE[role];
  const [tab, setTab] = React.useState('dash');
  const w = platform === 'ios' ? 390 : 400, h = platform === 'ios' ? 844 : 860;
  return (
    <div style={{ width: w + 24, height: h + 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="sf-app am-phone" data-theme={role === 'audit' ? 'dark' : 'light'} data-palette="saroy"
        style={{ width: w, height: h, borderRadius: platform === 'ios' ? 50 : 42, overflow: 'hidden', position: 'relative',
          background: 'var(--sf-bg)', boxShadow: '0 30px 80px rgba(54,30,14,0.20), 0 0 0 11px #161310, 0 0 0 13px #2A2620', display: 'flex', flexDirection: 'column' }}>
        <CurrencyCtx.Provider value={{ cur: 'UZS', setCur: () => {} }}>
          {platform === 'ios' ? <SfStatusBarIOS /> : <SfStatusBarAndroid />}
          <div className="am-body">
            {tab === 'dash' && <AMDash role={role} cfg={cfg} go={setTab} />}
            {tab === 'students' && <AMStudents />}
            {tab === 'anomalies' && <AMAnomalies />}
            {tab === 'approvals' && <AMApprovals />}
            {tab === 'branches' && <AMBranches />}
            {tab === 'cases' && <AMCases />}
            {tab === 'ai' && <AMAi role={role} />}
            {tab === 'messages' && <AMMessages role={role} />}
            {tab === 'me' && <AMProfile cfg={cfg} />}
          </div>
          <div className="am-tabs" style={{ paddingBottom: platform === 'ios' ? 20 : 12 }}>
            {cfg.tabs.map(([id, l, ic]) => (
              <button key={id} className="am-tab" data-on={tab === id ? '1' : '0'} onClick={() => setTab(id)}
                style={tab === id ? { '--acc': cfg.accent } : {}}>
                <div className="am-tab-ic">{tab === id && <div className="am-tab-bg" style={{ background: cfg.accent }} />}<span style={{ position: 'relative', color: tab === id ? '#fff' : 'var(--sf-muted)' }}>{React.cloneElement(ic, { size: 21 })}</span></div>
                <span style={{ color: tab === id ? cfg.accent : 'var(--sf-muted)' }}>{l}</span>
              </button>
            ))}
          </div>
          {platform === 'ios'
            ? <div className="am-home" />
            : <div className="am-anav"><div /></div>}
        </CurrencyCtx.Provider>
      </div>
    </div>
  );
}

function AMHead({ eyebrow, title, sub, accent }) {
  return (
    <div className="am-head">
      <div>
        <div className="am-eyebrow">{eyebrow}</div>
        <div className="am-title">{title}</div>
        {sub && <div className="am-sub">{sub}</div>}
      </div>
    </div>
  );
}
function AMKpi({ l, v, money, c, trend, spark }) {
  return (
    <div className="am-kpi">
      <div className="am-kpi-l">{l}</div>
      <div className="am-kpi-row">
        <span className="sf-mono am-kpi-v" style={{ color: c || 'var(--sf-ink)' }}>{money != null ? fmtMoney(money, 'UZS') : v}</span>
        {trend && <span className="am-kpi-tr" style={{ color: trend.up ? 'var(--sf-success)' : 'var(--sf-danger)' }}>{trend.up ? '↑' : '↓'}{trend.v}</span>}
      </div>
      {spark && <Sparkline data={spark} color={c || 'var(--sf-primary)'} h={24} />}
    </div>
  );
}

// ── Dashboards
function AMDash({ role, cfg, go }) {
  if (role === 'audit') return <AMAuditDash cfg={cfg} go={go} />;
  const ceo = role === 'ceo';
  return (
    <div className="am-scroll">
      <div className="am-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <SfAvatar name={cfg.who} size={36} color={cfg.accent} />
          <div><div className="am-hello">{ceo ? 'Boshqaruv' : 'Filial paneli'}</div><div className="am-hello-sub">{cfg.scope}</div></div>
        </div>
        <div className="am-bell">{React.cloneElement(Icons.bell, { size: 19 })}<span className="am-bell-dot" /></div>
      </div>
      <div className="am-pad">
        <div className="am-kpi-grid">
          <AMKpi l="Oylik daromad" money={ceo ? 1284000000 : 342000000} c="var(--sf-success)" trend={{ up: true, v: '12%' }} spark={[60,66,63,72,70,78,82,80,88,94,98,100]} />
          <AMKpi l="O‘quvchilar" v={ceo ? '1 842' : '512'} trend={{ up: true, v: '4%' }} spark={[70,73,72,78,82,85,88,92,96,100]} />
          <AMKpi l="Davomat" v="91.2%" c="var(--sf-primary)" />
          <AMKpi l="Qarzdorlik" money={ceo ? 84000000 : 22400000} c="var(--sf-warn)" />
        </div>

        <div className="am-card">
          <div className="am-card-h"><span>Daromad · 12 oy</span><span className="am-link">Batafsil</span></div>
          <AreaChart color="var(--sf-success)" money data={[820,860,910,890,960,1020,1080,1040,1140,1180,1220,1284].map(x=>x*1e6)} labels={['','','','','','','','','','','','']} h={130} />
        </div>

        <div className="am-ai" onClick={() => go('ai')}>
          <SfAiBadge>Strategik</SfAiBadge>
          <div className="am-ai-q">“{ceo ? 'Sebzorda churn 6.2% — 2x yuqori. Tekshiring.' : '38 oila qarzdor. 12 tasi 30 kundan oshgan.'}”</div>
        </div>

        {ceo ? (
          <div className="am-card">
            <div className="am-card-h"><span>Filiallar reytingi</span><span className="am-link" onClick={() => go('branches')}>Hammasi</span></div>
            <div className="am-pad2"><HBars money rows={[
              { label: 'Yunusobod', v: 342000000, mark: true, color: 'var(--sf-primary)' },
              { label: 'Chilonzor', v: 318000000, mark: true, color: 'var(--sf-primary)' },
              { label: 'Mirobod', v: 308000000, mark: true, color: 'var(--sf-accent)' },
              { label: 'Sebzor', v: 216000000, mark: true, color: 'var(--sf-ink-2)' },
            ]} /></div>
          </div>
        ) : (
          <div className="am-card">
            <div className="am-card-h"><span>Tasdiqlash · 7</span><span className="am-link" onClick={() => go('approvals')}>Hammasi</span></div>
            {[['To‘lov qaytarish','Akbarov A.',600000],['Ta‘til','Yusupova N.',0],['Yangi guruh','Ingliz B2',0]].map((a,i,arr)=>(
              <div key={i} className="am-row" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }}>
                <div className="am-row-ic" style={{ background: 'var(--sf-warn-soft)', color: 'var(--sf-warn)' }}>{React.cloneElement(Icons.check,{size:15})}</div>
                <div style={{ flex: 1 }}><div className="am-row-t">{a[0]}</div><div className="am-row-s">{a[1]}{a[2]?<> · <MM uzs={a[2]} /></>:null}</div></div>
                <div style={{ display: 'flex', gap: 4 }}><button className="am-mini ok">✓</button><button className="am-mini no">✕</button></div>
              </div>
            ))}
          </div>
        )}

        <div className="am-card">
          <div className="am-card-h"><span>Davomat salomatligi</span></div>
          <div className="am-pad2" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Donut size={92} thickness={14} segments={[{v:72,c:'var(--sf-success)'},{v:19,c:'var(--sf-warn)'},{v:9,c:'var(--sf-danger)'}]} center={<div className="sf-mono" style={{ fontSize: 17, fontWeight: 700 }}>91%</div>} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Legend c="var(--sf-success)" l="Yaxshi" v="72%" /><Legend c="var(--sf-warn)" l="O‘rta" v="19%" /><Legend c="var(--sf-danger)" l="Past" v="9%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AMAuditDash({ cfg, go }) {
  return (
    <div className="am-scroll">
      <div className="am-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <SfAvatar name={cfg.who} size={36} color={cfg.accent} />
          <div><div className="am-hello">Audit paneli</div><div className="am-hello-sub">Barcha filiallar · nazorat</div></div>
        </div>
        <div className="am-bell">{React.cloneElement(Icons.bell, { size: 19 })}<span className="am-bell-dot" /></div>
      </div>
      <div className="am-pad">
        <div className="am-kpi-grid">
          <AMKpi l="Ochiq flaglar" v="12" c="var(--sf-danger)" trend={{ up: false, v: '3' }} />
          <AMKpi l="Faol holatlar" v="8" c="#B48BC0" />
          <AMKpi l="Anomaliya" v="2.4%" c="var(--sf-warn)" />
          <AMKpi l="Muvofiqlik" v="96.8%" c="var(--sf-success)" trend={{ up: true, v: '1%' }} />
        </div>
        <div className="am-card">
          <div className="am-card-h"><span>Anomaliya · 30 kun</span></div>
          <AreaChart color="var(--sf-danger)" data={[4,6,3,8,5,12,7,9,6,11,8,12]} labels={['','','','','','','','','','','','']} h={120} />
        </div>
        <div className="am-ai" onClick={() => go('anomalies')}>
          <SfAiBadge>Audit AI</SfAiBadge>
          <div className="am-ai-q">“Sebzorda 3 ta yuqori signal: 100% davomat, kvitansiyasiz naqd, karta nomutanosibligi.”</div>
        </div>
        <div className="am-card">
          <div className="am-card-h"><span>So‘nggi flaglar</span><span className="am-link" onClick={() => go('anomalies')}>Hammasi</span></div>
          {[['Davomat 100% · 21 kun','Sebzor','high'],['48 Up karta/hafta','Mirobod','med'],['Naqd · kvitansiyasiz','Sebzor','high']].map((f,i,arr)=>(
            <div key={i} className="am-row" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }}>
              <span className="am-dot" style={{ background: f[2]==='high'?'var(--sf-danger)':'var(--sf-warn)' }} />
              <div style={{ flex: 1 }}><div className="am-row-t">{f[0]}</div><div className="am-row-s">{f[1]}</div></div>
              <Pill tone={f[2]==='high'?'danger':'warn'}>{f[2]==='high'?'Yuqori':'O‘rta'}</Pill>
            </div>
          ))}
        </div>
        <div className="am-card">
          <div className="am-card-h"><span>Filiallar muvofiqligi</span></div>
          <div className="am-pad2"><HBars max={100} rows={[
            { label: 'Yunusobod', v: 98, display: '98%', color: 'var(--sf-success)' },
            { label: 'Chilonzor', v: 97, display: '97%', color: 'var(--sf-success)' },
            { label: 'Mirobod', v: 95, display: '95%', color: 'var(--sf-warn)' },
            { label: 'Sebzor', v: 89, display: '89%', color: 'var(--sf-danger)' },
          ]} /></div>
        </div>
      </div>
    </div>
  );
}

// ── Lists
function AMStudents() {
  const students = [
    ['Akbarov Akmal','9-B Algebra',96,'paid',0],['Azizova Madina','9-B Algebra',98,'paid',0],
    ['Bakirov Sherzod','Algebra Mid',88,'debt',600000],['Eshmatov Otabek','9-B Algebra',72,'debt',1200000],
    ['Halimova Zilola','9-B Algebra',95,'paid',0],['Davronova Sevinch','Algebra Mid',92,'paid',0],
    ['G‘aniyev Jasur','10-V Geom',89,'partial',300000],['Ibragimov Sardor','Algebra Mid',91,'paid',0],
  ];
  const pt = { paid: ['success', 'To‘langan'], debt: ['danger', 'Qarz'], partial: ['warn', 'Qisman'] };
  return (
    <div className="am-scroll">
      <AMHead eyebrow="512 o‘quvchi" title="O‘quvchilar" />
      <div className="am-pad">
        <div className="am-chips">{['Hammasi','Qarzdor','Riskli','Guruh'].map((c,i)=><span key={c} className={'am-chip'+(i===0?' on':'')}>{c}</span>)}</div>
        <div className="am-card am-list">
          {students.map((s,i,arr)=>(
            <div key={i} className="am-srow" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }}>
              <SfAvatar name={s[0]} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="am-srow-n">{s[0]}</div>
                <div className="am-srow-s">{s[1]} · <span className="sf-mono" style={{ color: s[2]>=92?'var(--sf-success)':s[2]>=85?'var(--sf-warn)':'var(--sf-danger)' }}>{s[2]}%</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Pill tone={pt[s[3]][0]}>{pt[s[3]][1]}</Pill>
                {s[4]>0 && <div style={{ marginTop: 3, fontSize: 10 }}><MM uzs={s[4]} /></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function AMAnomalies() {
  const rows = [['Davomat 100% · 21 kun','Davomat','Sebzor',94,'high'],['48 Up karta/hafta','Karta','Mirobod',72,'med'],['Naqd · kvitansiyasiz','Moliya','Sebzor',88,'high'],['Tungi profil o‘zgarishi','Kirish','Chilonzor',34,'low'],['So‘rovnoma · 30s','So‘rovnoma','Yunusobod',61,'med']];
  return (
    <div className="am-scroll">
      <AMHead eyebrow="12 ochiq signal" title="Anomaliyalar" />
      <div className="am-pad">
        <div className="am-chips">{['Hammasi','Yuqori','Davomat','Karta','Moliya'].map((c,i)=><span key={c} className={'am-chip'+(i===0?' on':'')}>{c}</span>)}</div>
        <div className="am-card am-list">
          {rows.map((r,i,arr)=>(
            <div key={i} className="am-srow" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }}>
              <span className="am-dot" style={{ background: r[4]==='high'?'var(--sf-danger)':r[4]==='med'?'var(--sf-warn)':'var(--sf-muted)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="am-srow-n">{r[0]}</div>
                <div className="am-srow-s">{r[2]} · <span className="am-tag">{r[1]}</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="sf-mono" style={{ fontSize: 14, fontWeight: 700, color: r[3]>=80?'var(--sf-danger)':r[3]>=60?'var(--sf-warn)':'var(--sf-muted)' }}>{r[3]}</div>
                <div style={{ fontSize: 9, color: 'var(--sf-muted)' }}>AI skor</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function AMApprovals() {
  const items = [['To‘lov qaytarish','Akbarov Akmal','Ortiqcha · iyun',600000,'var(--sf-success)'],['Ta‘til','Yusupova N.','24–26 May',0,'var(--sf-primary)'],['Yangi guruh','Ingliz B2','18 o‘rin',0,'var(--sf-accent)'],['Chiqarish','Eshmatov O.','3+ oy qarz',1200000,'var(--sf-danger)']];
  return (
    <div className="am-scroll">
      <AMHead eyebrow="7 so‘rov" title="Tasdiqlash" />
      <div className="am-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it,i)=>(
          <div key={i} className="am-appr">
            <div className="am-appr-rail" style={{ background: it[4] }} />
            <div style={{ flex: 1, padding: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><div className="am-row-t">{it[0]}</div><div className="am-row-s">{it[1]}</div></div>
                {it[3]>0 && <MM uzs={it[3]} />}
              </div>
              <div className="am-appr-sub">{it[2]}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button className="am-btn ghost">Rad</button>
                <button className="am-btn primary">Tasdiqlash</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AMBranches() {
  const b = [['Yunusobod',342000000,512,94,5.2,'var(--sf-success)'],['Chilonzor',318000000,486,92,4.6,'var(--sf-success)'],['Mirobod',308000000,478,90,3.1,'var(--sf-warn)'],['Sebzor',216000000,366,87,-1.2,'var(--sf-danger)']];
  return (
    <div className="am-scroll">
      <AMHead eyebrow="4 filial" title="Filiallar" />
      <div className="am-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {b.map((x,i)=>(
          <div key={i} className="am-card" style={{ padding: 0 }}>
            <div className="am-bc-h">
              <div className="am-bc-rank">#{i+1}</div>
              <div className="am-bc-mark" style={{ background: x[5] }}><SfStar size={17} color="#fff" /></div>
              <div style={{ flex: 1 }}><div className="am-bc-n">{x[0]}</div><div className="am-row-s"><MM uzs={x[1]} />/oy</div></div>
              <Pill tone={x[4]>=4?'success':x[4]>=0?'warn':'danger'}>{x[4]>=0?'↑':'↓'}{Math.abs(x[4])}%</Pill>
            </div>
            <div className="am-bc-stats">
              <div><span className="sf-mono am-bc-v">{x[2]}</span><span className="am-bc-l">o‘quvchi</span></div>
              <div><span className="sf-mono am-bc-v" style={{ color: x[3]>=92?'var(--sf-success)':'var(--sf-warn)' }}>{x[3]}%</span><span className="am-bc-l">davomat</span></div>
              <div><span className="sf-mono am-bc-v">{(x[1]/1e6).toFixed(0)}m</span><span className="am-bc-l">daromad</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AMCases() {
  const cases = [['C-0042','Sebzor · kvitansiyasiz naqd','high','open'],['C-0041','Mirobod · karta nomutanosibligi','med','review'],['C-0040','Davomat anomaliyasi · Fizika','high','open'],['C-0039','So‘rovnoma yaxlitligi','med','review'],['C-0038','Tungi profil o‘zgarishi','low','closed']];
  const st = { open: ['danger','Ochiq'], review: ['warn','Tekshir'], closed: ['success','Yopilgan'] };
  return (
    <div className="am-scroll">
      <AMHead eyebrow="8 faol holat" title="Holatlar" />
      <div className="am-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cases.map((c,i)=>(
          <div key={i} className="am-appr">
            <div className="am-appr-rail" style={{ background: c[2]==='high'?'var(--sf-danger)':c[2]==='med'?'var(--sf-warn)':'var(--sf-muted)' }} />
            <div style={{ flex: 1, padding: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--sf-muted)', marginRight: 'auto' }}>{c[0]}</span>
                <Pill tone={st[c[3]][0]} >{st[c[3]][1]}</Pill>
                <Pill tone={c[2]==='high'?'danger':c[2]==='med'?'warn':'neutral'}>{c[2]==='high'?'Yuqori':c[2]==='med'?'O‘rta':'Past'}</Pill>
              </div>
              <div className="am-row-t" style={{ marginTop: 8 }}>{c[1]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AMAi({ role }) {
  const ceo = role === 'ceo';
  return (
    <div className="am-scroll">
      <AMHead eyebrow="AI yordamchi" title="Strategik tahlil" />
      <div className="am-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Churn riski','danger', role==='audit'?'Sebzorda 3 yuqori signal to‘plandi.':ceo?'Sebzorda churn 2x yuqori. 3 o‘qituvchi almashgan.':'6 o‘quvchi ketish belgisini ko‘rsatmoqda.'],['O‘sish','success',ceo?'Ingliz B2 to‘lgan — yangi guruh $4.2k/oy.':'Kutish ro‘yxatida 14 o‘quvchi bor.'],['Moliya','warn',ceo?'142 oila qarzdor. 38 tasi 30+ kun.':'38 oila qarzdor (22.4 mln).']].map((ins,i)=>(
          <div key={i} className="am-ai" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><SfAiBadge>{ins[0]}</SfAiBadge><Pill tone={ins[1]} dot>{ins[1]==='danger'?'Yuqori':ins[1]==='warn'?'O‘rta':'Imkon'}</Pill></div>
            <div className="am-ai-q">“{ins[2]}”</div>
          </div>
        ))}
        <div className="am-card" style={{ padding: 12 }}>
          <div className="am-chips" style={{ marginBottom: 0 }}>{['Churn sabablari','Daromad prognozi','Reyting'].map(p=><span key={p} className="am-chip ai">{p}</span>)}</div>
        </div>
        <div className="am-aiinput"><span style={{ flex: 1, color: 'var(--sf-muted)' }}>Savol yozing...</span><div className="am-aisend">{React.cloneElement(Icons.send,{size:16})}</div></div>
      </div>
    </div>
  );
}

function AMMessages({ role }) {
  const [sel, setSel] = React.useState(0);
  const threads = [
    { n: 'Nigora Karimova', g: 'O‘qituvchi · Matematika', last: 'Ertangi yig‘ilishga tayyorman', tm: '14:42', un: 0, on: true },
    { n: 'Matematika bo‘limi', g: 'Guruh · 12 a‘zo', last: 'Siz: Yangi mavzular...', tm: '13:20', un: 0, grp: true },
    { n: 'Akbarova Dilnoza', g: 'Ota-ona · 9-B', last: 'Rahmat ustoz!', tm: '12:18', un: 2 },
    { n: 'Aziz Tursunov', g: 'O‘qituvchi · Ingliz', last: 'Yangi guruh ochsak?', tm: '11:05', un: 1, on: true },
    { n: 'Qabul bo‘limi', g: 'Guruh · 8 a‘zo', last: 'Bugun 6 ta yangi lid', tm: 'Du', un: 3, grp: true },
  ];
  const cur = threads[sel];
  return (
    <div className="am-scroll">
      <AMHead eyebrow="Aloqa markazi" title="Xabarlar" />
      <div className="am-pad">
        <div className="am-chips">{['Hammasi','Xodimlar','O‘qituvchi','Ota-ona','O‘quvchi'].map((c,i)=><span key={c} className={'am-chip'+(i===0?' on':'')}>{c}</span>)}</div>
        <div className="am-card am-list">
          {threads.map((th,i,arr)=>(
            <div key={i} className="am-srow" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }} onClick={()=>setSel(i)}>
              {th.grp ? <div style={{ width:34,height:34,borderRadius:10,background:'var(--sf-primary)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><SfStar size={16} color="#fff" /></div> : <SfAvatar name={th.n} size={34} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="am-srow-n">{th.n}</div>
                <div className="am-srow-s" style={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{th.last}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="sf-mono" style={{ fontSize: 9.5, color: 'var(--sf-muted)' }}>{th.tm}</div>
                {th.un>0 && <div style={{ marginTop:3, minWidth:18,height:18,borderRadius:9,background:'var(--sf-primary)',color:'#fff',fontSize:10,fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'0 5px' }}>{th.un}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="am-card" style={{ overflow:'hidden' }}>
          <div className="am-card-h" style={{ alignItems:'center' }}>
            <span style={{ display:'flex',alignItems:'center',gap:8 }}>{cur.grp?<div style={{ width:28,height:28,borderRadius:8,background:'var(--sf-primary)',display:'flex',alignItems:'center',justifyContent:'center' }}><SfStar size={13} color="#fff" /></div>:<SfAvatar name={cur.n} size={28} />}{cur.n}</span>
            <span className="am-link" style={{ color: cur.on?'var(--sf-success)':'var(--sf-muted)' }}>{cur.on?'onlayn':''}</span>
          </div>
          <div style={{ padding: 14, background: 'var(--sf-bg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ alignSelf:'flex-start', maxWidth:'78%', padding:'9px 12px', borderRadius:'12px 12px 12px 4px', background:'var(--sf-surface)', border:'1px solid var(--sf-border)', fontSize:12.5 }}>{cur.last}</div>
            <div style={{ alignSelf:'flex-end', maxWidth:'78%', padding:'9px 12px', borderRadius:'12px 12px 4px 12px', background:'var(--sf-primary)', color:'#fff', fontSize:12.5 }}>Albatta, ko‘rib chiqaman 👍</div>
          </div>
          <div style={{ display:'flex',gap:8,alignItems:'center',padding:10,borderTop:'1px solid var(--sf-border)' }}>
            <div style={{ flex:1,background:'var(--sf-surface-2)',borderRadius:20,padding:'9px 13px',fontSize:12.5,color:'var(--sf-muted)' }}>Xabar yoki vazifa...</div>
            <div className="am-aisend">{React.cloneElement(Icons.send,{size:16})}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AMProfile({ cfg }) {
  return (
    <div className="am-scroll">
      <AMHead eyebrow={cfg.label + ' konsoli'} title="Profil" />
      <div className="am-pad">
        <div className="am-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
          <SfAvatar name={cfg.who} size={56} color={cfg.accent} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 800 }}>{cfg.who}</div><div className="am-row-s">{cfg.role} · {cfg.scope}</div></div>
        </div>
        <div className="am-card am-list" style={{ marginTop: 12 }}>
          {[['Rol va ruxsatlar',cfg.label],['Valyuta','UZS'],['Til','O‘zbekcha'],['Mavzu',cfg.label==='Audit'?'Qora':'Tizim'],['Bildirishnomalar','Yoniq'],['Xavfsizlik · 2FA','Yoqilgan']].map((r,i,arr)=>(
            <div key={i} className="am-setrow" style={{ borderBottom: i<arr.length-1?'1px solid var(--sf-border)':'none' }}>
              <span style={{ fontSize: 13 }}>{r[0]}</span><span style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{r[1]} ›</span>
            </div>
          ))}
        </div>
        <button className="am-btn ghost" style={{ width: '100%', marginTop: 14, color: 'var(--sf-danger)' }}>Chiqish</button>
      </div>
    </div>
  );
}

const adminMobileStyles = `
.am-phone * { box-sizing: border-box; }
.am-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.am-scroll { flex: 1; overflow-y: auto; }
.am-scroll::-webkit-scrollbar { width: 0; }
.am-pad { padding: 4px 16px 20px; }
.am-pad2 { padding: 14px 16px; }
.am-topbar { display: flex; justify-content: space-between; align-items: center; padding: 6px 16px 12px; }
.am-hello { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; }
.am-hello-sub { font-size: 11px; color: var(--sf-muted); }
.am-bell { width: 38px; height: 38px; border-radius: 11px; background: var(--sf-surface-2); display: flex; align-items: center; justify-content: center; color: var(--sf-ink-2); position: relative; }
.am-bell-dot { position: absolute; top: 9px; right: 10px; width: 7px; height: 7px; border-radius: 50%; background: var(--sf-danger); border: 2px solid var(--sf-surface-2); }
.am-head { padding: 8px 16px 12px; }
.am-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-muted); }
.am-title { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin-top: 3px; }
.am-sub { font-size: 12px; color: var(--sf-muted); margin-top: 2px; }

.am-kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 12px; }
.am-kpi { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 13px; padding: 12px; }
.am-kpi-l { font-size: 10px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--sf-muted); }
.am-kpi-row { display: flex; align-items: baseline; gap: 6px; margin-top: 6px; }
.am-kpi-v { font-size: 21px; font-weight: 700; line-height: 1; }
.am-kpi-tr { font-size: 10px; font-weight: 700; }

.am-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; margin-bottom: 12px; }
.am-card-h { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px 10px; font-size: 12.5px; font-weight: 700; }
.am-link { font-size: 11px; color: var(--sf-primary); font-weight: 600; }
.am-list { padding: 0; }

.am-ai { background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 14px; padding: 14px; margin-bottom: 12px; }
.am-ai-q { font-family: var(--sf-font-display); font-style: italic; font-size: 15px; line-height: 1.35; color: var(--sf-ink); margin-top: 8px; }

.am-row { display: flex; align-items: center; gap: 10px; padding: 11px 14px; }
.am-row-ic { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.am-row-t { font-size: 12.5px; font-weight: 600; }
.am-row-s { font-size: 10.5px; color: var(--sf-muted); margin-top: 1px; }
.am-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.am-mini { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-size: 13px; }
.am-mini.ok { color: var(--sf-success); } .am-mini.no { color: var(--sf-danger); }
.am-tag { background: var(--sf-surface-2); padding: 1px 6px; border-radius: 5px; font-size: 9.5px; font-weight: 700; }

.am-chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 12px; }
.am-chips::-webkit-scrollbar { height: 0; }
.am-chip { padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; background: transparent; border: 1px solid var(--sf-border); color: var(--sf-muted); }
.am-chip.on { background: var(--sf-ink); color: var(--sf-bg); border-color: transparent; }
.am-chip.ai { background: var(--sf-ai-bg); border-color: var(--sf-ai-border); color: var(--sf-ai); }

.am-srow { display: flex; align-items: center; gap: 11px; padding: 11px 14px; }
.am-srow-n { font-size: 13px; font-weight: 600; }
.am-srow-s { font-size: 10.5px; color: var(--sf-muted); margin-top: 1px; }

.am-appr { display: flex; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 13px; overflow: hidden; }
.am-appr-rail { width: 4px; flex-shrink: 0; }
.am-appr-sub { margin-top: 8px; font-size: 11.5px; color: var(--sf-ink-2); padding: 7px 9px; background: var(--sf-surface-2); border-radius: 8px; }
.am-btn { flex: 1; padding: 9px; border-radius: 9px; border: none; font-family: inherit; font-weight: 700; font-size: 12.5px; cursor: pointer; }
.am-btn.primary { background: var(--sf-primary); color: #FFFCF5; }
.am-btn.ghost { background: var(--sf-surface-2); color: var(--sf-ink-2); border: 1px solid var(--sf-border); }

.am-bc-h { display: flex; align-items: center; gap: 10px; padding: 13px 14px; position: relative; }
.am-bc-rank { position: absolute; top: 8px; right: 12px; font-family: var(--sf-font-mono); font-size: 10px; font-weight: 700; color: var(--sf-muted-2); }
.am-bc-mark { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.am-bc-n { font-size: 14px; font-weight: 800; }
.am-bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--sf-border); }
.am-bc-stats > div { padding: 9px 4px; text-align: center; border-right: 1px solid var(--sf-border); }
.am-bc-stats > div:last-child { border-right: none; }
.am-bc-v { font-size: 14px; font-weight: 700; display: block; }
.am-bc-l { font-size: 8px; text-transform: uppercase; color: var(--sf-muted); font-weight: 600; margin-top: 1px; display: block; }

.am-setrow { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; }
.am-aiinput { display: flex; align-items: center; gap: 8px; background: var(--sf-surface-2); border-radius: 22px; padding: 10px 14px; font-size: 13px; }
.am-aisend { width: 34px; height: 34px; border-radius: 10px; background: var(--sf-primary); color: #fff; display: flex; align-items: center; justify-content: center; }

.am-tabs { display: flex; padding: 8px 4px; background: var(--sf-surface); border-top: 1px solid var(--sf-border); }
.am-tab { flex: 1; background: transparent; border: none; cursor: pointer; font-family: inherit; padding: 4px 0; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 600; }
.am-tab-ic { position: relative; display: flex; align-items: center; justify-content: center; }
.am-tab-bg { position: absolute; inset: -6px -10px; border-radius: 11px; }
.am-home { position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%); width: 130px; height: 5px; border-radius: 3px; background: var(--sf-ink); opacity: 0.55; }
.am-anav { height: 22px; display: flex; align-items: center; justify-content: center; background: var(--sf-surface); }
.am-anav > div { width: 108px; height: 4px; border-radius: 3px; background: var(--sf-ink); opacity: 0.5; }
`;

function mountAdminMobile(role) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <>
      <style>{adminCommonStyles}</style>
      <style>{adminMobileStyles}</style>
      <DesignCanvas>
        <DCSection id="m" title={MROLE[role].label + ' · mobil ilova'} subtitle="Bosing va sinab ko‘ring · tablar ishlaydi · iOS va Android">
          <DCArtboard id="ios" label="iOS" width={414} height={868}><AMPhone role={role} platform="ios" /></DCArtboard>
          <DCArtboard id="and" label="Android" width={424} height={884}><AMPhone role={role} platform="android" /></DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}
window.mountAdminMobile = mountAdminMobile;
