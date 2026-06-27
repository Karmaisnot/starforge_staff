// admin-org.jsx — Permissions (RBAC), Departments, HR, Payroll

// ═══ PERMISSIONS · RBAC ══════════════════════════════════════
function PermissionsPage({ role }) {
  const roles = [
    { id: 'director', n: 'Direktor', who: 4, accent: 'var(--sf-primary)', sys: true },
    { id: 'manager', n: 'Filial menejeri', who: 4, accent: 'var(--sf-primary)' },
    { id: 'methodist', n: 'Metodist', who: 6, accent: 'var(--sf-accent)' },
    { id: 'teacher', n: 'O‘qituvchi', who: 38, accent: 'var(--sf-success)' },
    { id: 'assistant', n: 'Assistent', who: 12, accent: 'var(--sf-success)' },
    { id: 'reception', n: 'Qabul · Reception', who: 8, accent: 'var(--sf-ink-2)' },
    { id: 'sales', n: 'Sotuv · Marketing', who: 5, accent: 'var(--sf-warn)' },
    { id: 'accountant', n: 'Buxgalter', who: 3, accent: 'var(--sf-success)' },
    { id: 'auditor', n: 'Auditor', who: 2, accent: '#7A4A82' },
  ];
  const [sel, setSel] = React.useState('methodist');
  // perm levels: none, view, edit, full
  const modules = [
    { m: 'O‘quvchilar', perms: { director: 'full', manager: 'full', methodist: 'edit', teacher: 'view', assistant: 'view', reception: 'edit', sales: 'view', accountant: 'view', auditor: 'view' } },
    { m: 'Guruhlar', perms: { director: 'full', manager: 'full', methodist: 'edit', teacher: 'edit', assistant: 'view', reception: 'view', sales: 'none', accountant: 'none', auditor: 'view' } },
    { m: 'Xodimlar · HR', perms: { director: 'full', manager: 'edit', methodist: 'view', teacher: 'none', assistant: 'none', reception: 'none', sales: 'none', accountant: 'view', auditor: 'view' } },
    { m: 'To‘lovlar', perms: { director: 'full', manager: 'full', methodist: 'none', teacher: 'none', assistant: 'none', reception: 'edit', sales: 'view', accountant: 'full', auditor: 'view' } },
    { m: 'Oyliklar', perms: { director: 'full', manager: 'edit', methodist: 'none', teacher: 'none', assistant: 'none', reception: 'none', sales: 'none', accountant: 'full', auditor: 'view' } },
    { m: 'Kartalar', perms: { director: 'full', manager: 'full', methodist: 'edit', teacher: 'edit', assistant: 'edit', reception: 'none', sales: 'none', accountant: 'none', auditor: 'view' } },
    { m: 'Xabarlar', perms: { director: 'full', manager: 'full', methodist: 'edit', teacher: 'edit', assistant: 'edit', reception: 'edit', sales: 'edit', accountant: 'view', auditor: 'view' } },
    { m: 'Hisobotlar', perms: { director: 'full', manager: 'edit', methodist: 'view', teacher: 'view', assistant: 'none', reception: 'view', sales: 'edit', accountant: 'edit', auditor: 'full' } },
    { m: 'Filiallar', perms: { director: 'full', manager: 'view', methodist: 'none', teacher: 'none', assistant: 'none', reception: 'none', sales: 'none', accountant: 'view', auditor: 'view' } },
    { m: 'Sozlamalar', perms: { director: 'full', manager: 'edit', methodist: 'none', teacher: 'none', assistant: 'none', reception: 'none', sales: 'none', accountant: 'none', auditor: 'view' } },
    { m: 'Audit · Loglar', perms: { director: 'view', manager: 'none', methodist: 'none', teacher: 'none', assistant: 'none', reception: 'none', sales: 'none', accountant: 'none', auditor: 'full' } },
  ];
  const lvl = { none: ['Yo‘q', 'var(--sf-muted-2)', 'var(--sf-surface-2)'], view: ['Ko‘rish', 'var(--sf-primary)', 'var(--sf-primary-soft)'], edit: ['Tahrir', 'var(--sf-accent-ink)', 'var(--sf-accent-soft)'], full: ['To‘liq', 'var(--sf-success)', 'var(--sf-success-soft)'] };
  const cur = roles.find(r => r.id === sel);
  return (
    <>
      <AdminPageH eyebrow="Rol va ruxsatlar" title="Ruxsatlar · RBAC" sub="9 ta rol · 82 xodim · modul bo‘yicha kirish darajasi"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.doc, { size: 14 })} Shablon</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi rol</ABtn></>} />
      <div className="og-perm-layout">
        <ACard pad={false} className="og-roles">
          <div className="og-roles-h">Rollar</div>
          {roles.map(r => (
            <button key={r.id} className={'og-role' + (sel === r.id ? ' on' : '')} onClick={() => setSel(r.id)}>
              <span className="og-role-dot" style={{ background: r.accent }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="og-role-n">{r.n}{r.sys && <span className="og-role-sys">tizim</span>}</div>
                <div className="og-role-w">{r.who} xodim</div>
              </div>
              {React.cloneElement(Icons.chevR, { size: 14, style: { color: 'var(--sf-muted)' } })}
            </button>
          ))}
        </ACard>
        <div className="og-perm-main">
          <ACard pad={false}>
            <div className="og-perm-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div className="og-perm-mark" style={{ background: cur.accent }}>{React.cloneElement(Icons.shield, { size: 18, style: { color: '#fff' } })}</div>
                <div><div className="og-perm-n">{cur.n}</div><div className="og-perm-s">{cur.who} xodim · {modules.filter(m => cur && m.perms[sel] !== 'none').length} modulga kirish</div></div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <ABtn kind="ghost">Nusxa</ABtn>
                <ABtn kind="primary">{React.cloneElement(Icons.check, { size: 13 })} Saqlash</ABtn>
              </div>
            </div>
            <div className="og-legend">
              {Object.entries(lvl).map(([k, v]) => <span key={k} className="og-legend-i"><span className="og-legend-sw" style={{ background: v[2], borderColor: v[1] }} />{v[0]}</span>)}
            </div>
            <Table cols={[{ label: 'Modul' }, { label: 'Ko‘rish', align: 'center' }, { label: 'Tahrir', align: 'center' }, { label: 'Yaratish', align: 'center' }, { label: 'O‘chirish', align: 'center' }, { label: 'Daraja', align: 'center' }]}>
              {modules.map((mod, i) => {
                const p = mod.perms[sel];
                const has = { view: p !== 'none', edit: p === 'edit' || p === 'full', create: p === 'full', del: p === 'full' };
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: 12.5 }}>{mod.m}</td>
                    {['view', 'edit', 'create', 'del'].map(a => (
                      <td key={a} align="center"><span className={'og-cell' + (has[a] ? ' on' : '')} style={has[a] ? { background: lvl[p][1] } : {}}>{has[a] && React.cloneElement(Icons.check, { size: 12, stroke: 3, style: { color: '#fff' } })}</span></td>
                    ))}
                    <td align="center"><span className="og-lvl" style={{ background: lvl[p][2], color: lvl[p][1] }}>{lvl[p][0]}</span></td>
                  </tr>
                );
              })}
            </Table>
          </ACard>
        </div>
      </div>
      <style>{orgStyles}</style>
    </>
  );
}

// ═══ DEPARTMENTS ═════════════════════════════════════════════
function DepartmentsPage({ role }) {
  const depts = [
    { n: 'Matematika', head: 'Nigora Karimova', cnt: 12, groups: 18, color: 'var(--sf-primary)', members: ['Nigora Karimova', 'Bobur Aliyev', 'Sevara Olimova', 'Diyor F.'] },
    { n: 'Ingliz tili', head: 'Aziz Tursunov', cnt: 14, groups: 22, color: 'var(--sf-success)', members: ['Aziz Tursunov', 'Madina A.', 'Jasur G.', 'Nilufar J.'] },
    { n: 'Tabiiy fanlar', head: 'Malika Yusupova', cnt: 9, groups: 12, color: 'var(--sf-accent)', members: ['Malika Yusupova', 'Jasur Rahimov', 'Otabek E.'] },
    { n: 'Qabul · Reception', head: 'Gulnora Saidova', cnt: 8, groups: 0, color: 'var(--sf-ink-2)', members: ['Gulnora Saidova', 'Dilfuza Y.', 'Sardor I.'] },
    { n: 'Sotuv · Marketing', head: 'Rustam Olimov', cnt: 5, groups: 0, color: 'var(--sf-warn)', members: ['Rustam Olimov', 'Nodira K.'] },
    { n: 'Moliya · Buxgalteriya', head: 'Akmal Yusupov', cnt: 3, groups: 0, color: 'var(--sf-success)', members: ['Akmal Yusupov', 'Sevinch D.'] },
  ];
  return (
    <>
      <AdminPageH eyebrow={role === 'ceo' ? 'Barcha filiallar' : 'Yunusobod filiali'} title="Bo‘limlar"
        sub="6 bo‘lim · 51 xodim · tashkiliy tuzilma"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.cohort, { size: 14 })} Tuzilma sxemasi</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi bo‘lim</ABtn></>} />
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Kpi label="Bo‘limlar" value="6" icon={Icons.folder} />
        <Kpi label="Jami xodim" value="51" accent="var(--sf-primary)" />
        <Kpi label="O‘qit. bo‘limlar" value="3" sub="35 o‘qituvchi" />
        <Kpi label="Ma‘muriy" value="3" sub="16 xodim" />
      </div>
      <div className="og-dept-grid">
        {depts.map((d, i) => (
          <ACard key={i} pad={false} className="og-dept">
            <div className="og-dept-bar" style={{ background: d.color }} />
            <div className="og-dept-body">
              <div className="og-dept-head">
                <div className="og-dept-mark" style={{ background: d.color }}>{React.cloneElement(Icons.folder, { size: 18, style: { color: '#fff' } })}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div className="og-dept-n">{d.n}</div><div className="og-dept-meta">{d.cnt} xodim{d.groups > 0 ? ` · ${d.groups} guruh` : ''}</div></div>
                <button className="ad-mini-btn" style={{ color: 'var(--sf-muted)' }}>{Icons.more}</button>
              </div>
              <div className="og-dept-head-row">
                <SfAvatar name={d.head} size={26} />
                <div><span className="og-dept-headlbl">Bo‘lim boshlig‘i</span><div className="og-dept-headn">{d.head}</div></div>
              </div>
              <div className="og-dept-members">
                <div className="og-avatars">
                  {d.members.slice(0, 4).map((m, j) => <div key={j} className="og-av-wrap" style={{ zIndex: 4 - j }}><SfAvatar name={m} size={28} /></div>)}
                  {d.cnt > 4 && <div className="og-av-more">+{d.cnt - 4}</div>}
                </div>
                <button className="og-add-member">{React.cloneElement(Icons.plus, { size: 13 })} Qo‘shish</button>
              </div>
            </div>
          </ACard>
        ))}
        <button className="og-dept-new">
          <div className="og-dept-new-ic">{React.cloneElement(Icons.plus, { size: 22 })}</div>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>Yangi bo‘lim yaratish</div>
          <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>Boshliq tayinlang, xodim qo‘shing</div>
        </button>
      </div>
      <style>{orgStyles}</style>
    </>
  );
}

// ═══ HR ══════════════════════════════════════════════════════
function HRPage({ role }) {
  const ceo = role === 'ceo';
  const pipeline = [
    { id: 'applied', l: 'Arizalar', c: 'var(--sf-primary)', cands: [{ n: 'Olimjon Rashidov', pos: 'Matematika o‘qit.', tm: '2 soat' }, { n: 'Dilnoza Aliyeva', pos: 'Assistent', tm: '5 soat' }, { n: 'Sherzod Karimov', pos: 'Reception', tm: '1 kun' }] },
    { id: 'interview', l: 'Suhbat', c: 'var(--sf-accent)', cands: [{ n: 'Madina Tosheva', pos: 'Ingliz o‘qit.', tm: 'Ertaga 14:00' }, { n: 'Jasur Nazarov', pos: 'Marketing', tm: '23 May' }] },
    { id: 'trial', l: 'Sinov darsi', c: 'var(--sf-warn)', cands: [{ n: 'Nilufar Yusupova', pos: 'Matematika o‘qit.', tm: '24 May' }] },
    { id: 'offer', l: 'Taklif', c: 'var(--sf-success)', cands: [{ n: 'Bekzod Aliyev', pos: 'Fizika o‘qit.', tm: 'Yuborildi' }] },
  ];
  const employees = [
    { n: 'Nigora Karimova', pos: 'Katta o‘qituvchi', dept: 'Matematika', b: 'Yunusobod', type: 'To‘liq', sal: 8400000, since: '2021', st: 'active' },
    { n: 'Aziz Tursunov', pos: 'O‘qituvchi', dept: 'Ingliz tili', b: 'Chilonzor', type: 'To‘liq', sal: 7800000, since: '2022', st: 'active' },
    { n: 'Sevara Olimova', pos: 'Assistent', dept: 'Matematika', b: 'Yunusobod', type: 'Yarim', sal: 4200000, since: '2024', st: 'active' },
    { n: 'Gulnora Saidova', pos: 'Reception boshlig‘i', dept: 'Qabul', b: 'Mirobod', type: 'To‘liq', sal: 5600000, since: '2023', st: 'active' },
    { n: 'Jasur Rahimov', pos: 'O‘qituvchi', dept: 'Tabiiy fanlar', b: 'Sebzor', type: 'To‘liq', sal: 7000000, since: '2023', st: 'leave' },
    { n: 'Nodira Karimova', pos: 'SMM menejer', dept: 'Marketing', b: 'Yunusobod', type: 'Soatbay', sal: 3800000, since: '2025', st: 'active' },
  ];
  return (
    <>
      <AdminPageH eyebrow={ceo ? '82 xodim · 4 filial' : '16 xodim · Yunusobod'} title="HR · Xodimlar"
        sub="Ishga qabul, shartnomalar va lavozimlar"
        right={<><ABtn kind="soft">{React.cloneElement(Icons.download, { size: 14 })} Eksport</ABtn><ABtn kind="primary">{React.cloneElement(Icons.plus, { size: 14 })} Xodim yaratish</ABtn></>} />
      <div className="ad-kpi-grid">
        <Kpi label="Jami xodim" value={ceo ? '82' : '16'} icon={Icons.user} trend={{ up: true, v: '4' }} />
        <Kpi label="Ochiq vakansiya" value="7" accent="var(--sf-warn)" sub="3 ta shoshilinch" icon={Icons.flag} />
        <Kpi label="Oylik fond" money={ceo ? 512000000 : 96000000} accent="var(--sf-success)" />
        <Kpi label="O‘rt. ish staji" value="2.4 yil" />
        <Kpi label="Ta‘tilda" value="3" accent="var(--sf-primary)" />
      </div>
      <SecH action={<a className="ad-link">Barcha nomzodlar ›</a>}>Ishga qabul · 7 nomzod</SecH>
      <div className="ad-kanban" style={{ marginBottom: 18 }}>
        {pipeline.map(col => (
          <div key={col.id} className="ad-kcol">
            <div className="ad-kcol-h"><span className="ad-kdot" style={{ background: col.c }} /><span className="ad-kname">{col.l}</span><span className="ad-kcount">{col.cands.length}</span></div>
            <div className="ad-kcards">
              {col.cands.map((c, i) => (
                <div key={i} className="og-cand">
                  <div className="og-cand-rail" style={{ background: col.c }} />
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SfAvatar name={c.n} size={26} /><span style={{ fontSize: 12.5, fontWeight: 700 }}>{c.n}</span></div>
                    <div style={{ marginTop: 7 }}><Pill tone="primary">{c.pos}</Pill></div>
                    <div className="sf-mono" style={{ marginTop: 7, fontSize: 10.5, color: 'var(--sf-muted)' }}>{c.tm}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SecH action={<div className="ad-seg-sm"><button className="on">Hammasi</button><button>O‘qituvchi</button><button>Ma‘muriy</button></div>}>Xodimlar · {ceo ? 82 : 16}</SecH>
      <ACard pad={false}>
        <Table cols={[{ label: 'Xodim' }, { label: 'Lavozim' }, { label: 'Bo‘lim' }, ...(ceo ? [{ label: 'Filial' }] : []), { label: 'Shartnoma' }, { label: 'Ish staji', align: 'center' }, { label: 'Maosh', align: 'right' }, { label: 'Holat', align: 'center' }]}>
          {employees.map((e, i) => (
            <tr key={i}>
              <td><div className="ad-cell-u"><SfAvatar name={e.n} size={30} /><span style={{ fontWeight: 600 }}>{e.n}</span></div></td>
              <td style={{ fontSize: 12.5 }}>{e.pos}</td>
              <td style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{e.dept}</td>
              {ceo && <td style={{ fontSize: 12.5, color: 'var(--sf-muted)' }}>{e.b}</td>}
              <td><Pill tone={e.type === 'To‘liq' ? 'success' : e.type === 'Yarim' ? 'warn' : 'neutral'}>{e.type}</Pill></td>
              <td align="center" className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{e.since}</td>
              <td align="right"><Money uzs={e.sal} /></td>
              <td align="center"><Pill tone={e.st === 'active' ? 'success' : 'primary'} dot>{e.st === 'active' ? 'Faol' : 'Ta‘tilda'}</Pill></td>
            </tr>
          ))}
        </Table>
      </ACard>
      <style>{orgStyles}</style>
    </>
  );
}

// ═══ PAYROLL ═════════════════════════════════════════════════
function PayrollPage({ role }) {
  const ceo = role === 'ceo';
  const rows = [
    { n: 'Nigora Karimova', dept: 'Matematika', base: 6000000, cards: 900000, att: 600000, ret: 900000 },
    { n: 'Aziz Tursunov', dept: 'Ingliz tili', base: 5500000, cards: 1100000, att: 600000, ret: 600000 },
    { n: 'Bobur Aliyev', dept: 'Matematika', base: 5500000, cards: 750000, att: 500000, ret: 850000 },
    { n: 'Sevara Olimova', dept: 'Matematika', base: 3500000, cards: 400000, att: 300000, ret: 0 },
    { n: 'Malika Yusupova', dept: 'Tabiiy fanlar', base: 5500000, cards: 600000, att: 400000, ret: 700000 },
    { n: 'Gulnora Saidova', dept: 'Qabul', base: 5000000, cards: 0, att: 400000, ret: 200000 },
  ];
  const { cur } = React.useContext(CurrencyCtx);
  const tot = rows.reduce((a, r) => a + r.base + r.cards + r.att + r.ret, 0);
  return (
    <>
      <AdminPageH eyebrow="May 2026 · hisoblanmoqda" title="Oyliklar"
        sub="Asos + bonuslar (kartalar, davomat, ushlab qolish) avtomatik hisoblanadi"
        right={<><div className="ad-seg-sm"><button className="on">May</button><button>Aprel</button><button>Mart</button></div><ABtn kind="primary">{React.cloneElement(Icons.check, { size: 14 })} Tasdiqlash · to‘lash</ABtn></>} />
      <div className="ad-kpi-grid">
        <Kpi label="Jami oylik fond" money={tot} accent="var(--sf-success)" icon={Icons.trend} />
        <Kpi label="Asosiy maosh" money={rows.reduce((a, r) => a + r.base, 0)} />
        <Kpi label="Bonuslar" money={rows.reduce((a, r) => a + r.cards + r.att + r.ret, 0)} accent="var(--sf-accent)" sub="karta+davomat+retention" />
        <Kpi label="Xodimlar" value={ceo ? '82' : '16'} />
        <Kpi label="Holat" value="Qoralama" accent="var(--sf-warn)" sub="tasdiq kutmoqda" />
      </div>
      <div className="og-payroll-note">
        <SfAiBadge compact>Avto-hisob</SfAiBadge>
        <span>Bonuslar formulasi: <b>Kartalar</b> (har Up karta uchun bonus) · <b>Davomat</b> ({'>'}90% uchun) · <b>Ushlab qolish</b> (guruh saqlanishi). Markaz sozlamalaridan o‘zgartiriladi.</span>
      </div>
      <ACard pad={false}>
        <Table cols={[{ label: 'Xodim' }, { label: 'Bo‘lim' }, { label: 'Asos', align: 'right' }, { label: 'Karta bonus', align: 'right' }, { label: 'Davomat', align: 'right' }, { label: 'Ushlab qolish', align: 'right' }, { label: 'Jami', align: 'right' }, { label: '', align: 'center', w: 90 }]}>
          {rows.map((r, i) => {
            const total = r.base + r.cards + r.att + r.ret;
            return (
              <tr key={i}>
                <td><div className="ad-cell-u"><SfAvatar name={r.n} size={28} /><span style={{ fontWeight: 600 }}>{r.n}</span></div></td>
                <td style={{ fontSize: 12, color: 'var(--sf-muted)' }}>{r.dept}</td>
                <td align="right"><Money uzs={r.base} /></td>
                <td align="right"><Money uzs={r.cards} style={{ color: r.cards ? '#7A4F0E' : 'var(--sf-muted)' }} /></td>
                <td align="right"><Money uzs={r.att} style={{ color: 'var(--sf-success)' }} /></td>
                <td align="right"><Money uzs={r.ret} style={{ color: r.ret ? 'var(--sf-primary)' : 'var(--sf-muted)' }} /></td>
                <td align="right"><Money uzs={total} style={{ fontWeight: 800, fontSize: 13 }} /></td>
                <td align="center"><Pill tone="success" dot>Tayyor</Pill></td>
              </tr>
            );
          })}
          <tr style={{ background: 'var(--sf-surface-2)', fontWeight: 700 }}>
            <td colSpan={2} style={{ fontWeight: 800 }}>JAMI · {rows.length} xodim</td>
            <td align="right"><Money uzs={rows.reduce((a, r) => a + r.base, 0)} /></td>
            <td align="right"><Money uzs={rows.reduce((a, r) => a + r.cards, 0)} /></td>
            <td align="right"><Money uzs={rows.reduce((a, r) => a + r.att, 0)} /></td>
            <td align="right"><Money uzs={rows.reduce((a, r) => a + r.ret, 0)} /></td>
            <td align="right"><Money uzs={tot} style={{ fontWeight: 800, fontSize: 14, color: 'var(--sf-success)' }} /></td>
            <td />
          </tr>
        </Table>
      </ACard>
      <style>{orgStyles}</style>
    </>
  );
}

const orgStyles = `
.og-perm-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; }
@media (max-width: 1000px) { .og-perm-layout { grid-template-columns: 1fr; } }
.og-roles { align-self: flex-start; }
.og-roles-h { padding: 12px 16px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-muted); border-bottom: 1px solid var(--sf-border); }
.og-role { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; background: transparent; border: none; border-bottom: 1px solid var(--sf-border); cursor: pointer; font-family: inherit; }
.og-role:last-child { border-bottom: none; }
.og-role:hover { background: var(--sf-surface-2); }
.og-role.on { background: var(--sf-primary-soft); box-shadow: inset 3px 0 0 var(--sf-primary); }
.og-role-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.og-role-n { font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.og-role-sys { font-size: 8.5px; font-weight: 700; text-transform: uppercase; padding: 1px 5px; border-radius: 4px; background: var(--sf-ink); color: var(--sf-bg); letter-spacing: 0.04em; }
.og-role-w { font-size: 11px; color: var(--sf-muted); }
.og-perm-head { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--sf-border); gap: 10px; flex-wrap: wrap; }
.og-perm-mark { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
.og-perm-n { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
.og-perm-s { font-size: 12px; color: var(--sf-muted); }
.og-legend { display: flex; gap: 16px; padding: 10px 16px; border-bottom: 1px solid var(--sf-border); flex-wrap: wrap; }
.og-legend-i { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--sf-ink-2); }
.og-legend-sw { width: 14px; height: 14px; border-radius: 4px; border: 1px solid; }
.og-cell { width: 22px; height: 22px; border-radius: 6px; background: var(--sf-surface-2); display: inline-flex; align-items: center; justify-content: center; }
.og-lvl { padding: 3px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 700; }

.og-dept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.og-dept { display: flex; padding: 0; }
.og-dept-bar { width: 4px; flex-shrink: 0; }
.og-dept-body { flex: 1; padding: 16px; }
.og-dept-head { display: flex; align-items: center; gap: 11px; }
.og-dept-mark { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.og-dept-n { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
.og-dept-meta { font-size: 11px; color: var(--sf-muted); }
.og-dept-head-row { display: flex; align-items: center; gap: 9px; margin-top: 14px; padding: 9px 11px; background: var(--sf-surface-2); border-radius: 10px; }
.og-dept-headlbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sf-muted); font-weight: 700; }
.og-dept-headn { font-size: 12.5px; font-weight: 700; }
.og-dept-members { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; }
.og-avatars { display: flex; align-items: center; }
.og-av-wrap { margin-right: -8px; border: 2px solid var(--sf-surface); border-radius: 50%; position: relative; }
.og-av-more { width: 28px; height: 28px; border-radius: 50%; background: var(--sf-surface-3); color: var(--sf-ink-2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-left: 2px; border: 2px solid var(--sf-surface); }
.og-add-member { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; border-radius: 8px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); cursor: pointer; font-family: inherit; font-size: 11.5px; font-weight: 600; color: var(--sf-ink-2); }
.og-add-member:hover { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
.og-dept-new { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: 180px; border-radius: 14px; border: 1.5px dashed var(--sf-border-strong); background: var(--sf-surface); cursor: pointer; font-family: inherit; }
.og-dept-new:hover { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
.og-dept-new-ic { width: 44px; height: 44px; border-radius: 12px; background: var(--sf-primary-soft); color: var(--sf-primary); display: flex; align-items: center; justify-content: center; }

.og-cand { display: flex; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 10px; overflow: hidden; cursor: pointer; }
.og-cand:hover { box-shadow: var(--sf-shadow-md); }
.og-cand-rail { width: 3px; flex-shrink: 0; }

.og-payroll-note { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 12px; margin-bottom: 16px; font-size: 12px; color: var(--sf-ink-2); line-height: 1.4; }
`;

Object.assign(window, { PermissionsPage, DepartmentsPage, HRPage, PayrollPage });
