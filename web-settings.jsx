// web-settings.jsx — Settings page with sticky side-nav of sections

function SettingsPage({ onNav }) {
  const [active, setActive] = React.useState('account');
  const sections = [
    { id: 'account',  l: 'Hisob',                       icon: Icons.user },
    { id: 'appear',   l: 'Ko‘rinish',                   icon: Icons.brand, accent: 'var(--sf-primary)' },
    { id: 'home',     l: 'Bosh sahifa · Widget‘lar',    icon: Icons.home },
    { id: 'notif',    l: 'Bildirishnomalar',            icon: Icons.bell },
    { id: 'cards',    l: 'Davomat va kartalar',         icon: Icons.check, accent: 'var(--sf-success)' },
    { id: 'print',    l: 'Chop etish',                  icon: Icons.print },
    { id: 'sched',    l: 'Jadval',                      icon: Icons.cal },
    { id: 'ai',       l: 'AI yordamchi',                icon: Icons.ai, accent: 'var(--sf-ai)' },
    { id: 'privacy',  l: 'Maxfiylik · Profil ulashish', icon: Icons.shield },
    { id: 'sec',      l: 'Xavfsizlik',                  icon: Icons.shield, accent: 'var(--sf-warn)' },
    { id: 'lang',     l: 'Til va hudud',                icon: Icons.globe },
    { id: 'storage',  l: 'Saqlash · 142 MB',            icon: Icons.folder },
    { id: 'conn',     l: 'Bog‘langan hisoblar',         icon: Icons.globe },
    { id: 'center',   l: 'O‘quv markaz',                icon: Icons.shield, accent: 'var(--sf-primary)' },
    { id: 'beta',     l: 'Beta xususiyatlar',           icon: Icons.flag, accent: 'var(--sf-accent)' },
    { id: 'about',    l: 'Haqida',                      icon: Icons.brand },
  ];

  return (
    <>
      <WebPageHeader
        title="Sozlamalar"
        subtitle="98 ta sozlama · barchasi tahrirlanadi"
        right={
          <div className="web-search" style={{ width: 280, maxWidth: 280 }}>
            {React.cloneElement(Icons.search, { size: 14, style: { color: 'var(--sf-muted)' } })}
            <span>Sozlamalardan izlash...</span>
            <span className="web-search-kbd">⌘K</span>
          </div>
        }
      />

      <div className="web-settings-layout">
        {/* Side nav */}
        <nav className="web-settings-side">
          {sections.map(s => (
            <button key={s.id} className="web-set-side-btn" data-on={active === s.id ? '1' : '0'}
                    onClick={() => setActive(s.id)}>
              <div className="web-set-side-icon" style={{
                background: active === s.id ? 'var(--sf-primary)' : 'var(--sf-surface-2)',
                color: active === s.id ? '#FFFCF5' : (s.accent || 'var(--sf-ink-2)'),
              }}>
                {React.cloneElement(s.icon, { size: 14 })}
              </div>
              <span>{s.l}</span>
            </button>
          ))}
        </nav>

        {/* Main panel */}
        <div className="web-settings-main">
          {/* Profile hero */}
          <WebCard padded={false} className="web-settings-profile">
            <div style={{ padding: 22, position: 'relative', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', gap: 16 }}>
              <SfStar size={140} color="var(--sf-primary)" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.08 }} />
              <div style={{ position: 'relative' }}>
                <SfAvatar name="Nigora Karimova" size={80} color="var(--sf-primary)" />
                <button className="web-avatar-edit">
                  {React.cloneElement(Icons.edit, { size: 12 })}
                </button>
              </div>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em' }}>Nigora Karimova</div>
                <div style={{ fontSize: 13, color: 'var(--sf-muted)', marginTop: 2 }}>
                  Matematika ustozi · Yunusobod filiali
                </div>
                <div style={{ marginTop: 10, padding: '5px 12px', borderRadius: 999,
                                background: 'var(--sf-success-soft)', color: 'var(--sf-success)',
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em',
                                textTransform: 'uppercase' }}>
                  <span className="web-share-dot" />
                  Profil ulashilmoqda
                </div>
              </div>
              <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                <button className="web-btn web-btn-soft">Profilni ko‘rish</button>
                <button className="web-btn web-btn-primary">Saqlash</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--sf-border)' }}>
              {[
                { v: '3', l: 'Guruh' },
                { v: '58', l: 'O‘quvchi' },
                { v: '12', l: 'Dars / hafta' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 14, textAlign: 'center',
                                        borderRight: i < 2 ? '1px solid var(--sf-border)' : 'none' }}>
                  <div className="sf-mono" style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</div>
                  <div style={{ marginTop: 2, fontSize: 10.5, color: 'var(--sf-muted)',
                                  letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </WebCard>

          {/* Section panels */}
          {active === 'account' && <AccountPanel />}
          {active === 'appear' && <AppearancePanel />}
          {active === 'home' && <HomeWidgetsPanel />}
          {active === 'notif' && <NotifPanel />}
          {active === 'cards' && <CardsPanel />}
          {active === 'print' && <PrintPanel />}
          {active === 'sched' && <SchedPanel />}
          {active === 'ai' && <AIPanel />}
          {active === 'privacy' && <PrivacyPanel />}
          {active === 'sec' && <SecPanel />}
          {active === 'lang' && <LangPanel />}
          {active === 'storage' && <StoragePanel />}
          {active === 'conn' && <ConnPanel />}
          {active === 'center' && <CenterPanel />}
          {active === 'beta' && <BetaPanel />}
          {active === 'about' && <AboutPanel />}

          {/* Footer */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button className="web-btn web-btn-ghost" style={{ color: 'var(--sf-danger)' }}>
              {React.cloneElement(Icons.logout, { size: 14 })} Hisobdan chiqish
            </button>
            <div className="sf-mono" style={{ marginTop: 10, fontSize: 10, color: 'var(--sf-muted)' }}>
              v1.2.0 · build 2026.05.19 · 98 sozlama
            </div>
          </div>
        </div>
      </div>

      <style>{settingsStyles}</style>
    </>
  );
}

// ─── Settings atoms ───────────────────────────────────────────
function Panel({ h, sub, children }) {
  return (
    <WebCard padded={false} className="web-panel">
      <div className="web-panel-h">
        <h2>{h}</h2>
        {sub && <div className="web-panel-sub">{sub}</div>}
      </div>
      <div>{children}</div>
    </WebCard>
  );
}

function SetRow({ l, sub, right, last, danger }) {
  return (
    <div className={`web-setrow ${last ? 'last' : ''} ${danger ? 'danger' : ''}`}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="web-setrow-l">{l}</div>
        {sub && <div className="web-setrow-sub">{sub}</div>}
      </div>
      <div className="web-setrow-right">{right}</div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div className="web-toggle" data-on={on ? '1' : '0'}>
      <div className="web-toggle-knob" />
    </div>
  );
}

function Seg({ value, options }) {
  return (
    <div className="web-seg">
      {options.map(o => (
        <button key={o} className={value === o ? 'on' : ''}>{o}</button>
      ))}
    </div>
  );
}

function Swatches({ value, options }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((c, i) => (
        <div key={i} style={{
          width: 26, height: 26, borderRadius: '50%', background: c,
          border: c === value ? '2px solid var(--sf-ink)' : '1px solid var(--sf-border)',
          boxShadow: c === value ? `0 0 0 3px var(--sf-bg), 0 0 0 4px ${c}` : 'none',
        }} />
      ))}
    </div>
  );
}

function Slider({ value, min = 0, max = 100, unit = '%' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 200 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 4,
                      background: 'var(--sf-surface-2)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
                        background: 'var(--sf-primary)', borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 9px)`, top: -6, width: 18, height: 18,
                        borderRadius: '50%', background: '#FFFCF5',
                        border: '1.5px solid var(--sf-border-strong)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
      </div>
      <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)',
                                            fontWeight: 600, minWidth: 38, textAlign: 'right' }}>
        {value}{unit}
      </span>
    </div>
  );
}

function Chev() { return <span style={{ color: 'var(--sf-muted)' }}>{React.cloneElement(Icons.chevR, { size: 14 })}</span>; }
function Val({ v, mono, dim }) {
  return <span className={mono ? 'sf-mono' : ''} style={{ fontSize: 12.5, color: dim ? 'var(--sf-muted)' : 'var(--sf-ink-2)' }}>{v}</span>;
}

// ─── Panels ──────────────────────────────────────────────────
function AccountPanel() {
  return (
    <Panel h="Hisob" sub="Shaxsiy ma‘lumotlar va autentifikatsiya">
      <SetRow l="To‘liq ism" right={<><Val v="Nigora Karimova" /><Chev /></>} />
      <SetRow l="Foydalanuvchi nomi" right={<><Val v="nigora.karimova" mono /><Chev /></>} />
      <SetRow l="E-pochta" right={<><Val v="qo‘shilmagan" dim /><Chev /></>} />
      <SetRow l="Telefon" right={<><Val v="+998 90 *** ** 67" mono /><Chev /></>} />
      <SetRow l="Parolni o‘zgartirish" right={<Chev />} />
      <SetRow l="2-bosqichli himoya" sub="SMS · faol" right={<Toggle on={true} />} />
      <SetRow l="Hisobni vaqtinchalik to‘xtatish" last danger right={<Chev />} />
    </Panel>
  );
}

function AppearancePanel() {
  return (
    <>
      <Panel h="Rang va mavzu" sub="Brendning umumiy ko‘rinishi">
        <SetRow l="Rang palitrasi" sub="Saroy · Terracotta"
                right={<Swatches value="#B85535" options={['#B85535', '#1F6B66', '#2A3D8F', '#4F6A3A']} />} />
        <div className="web-setrow last" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div className="web-setrow-l">Mavzu rejimi</div>
          <div className="web-setrow-sub" style={{ marginBottom: 8 }}>Och, qora yoki tizim sozlamalariga ko‘ra</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'light', l: 'Och' },
              { id: 'dark', l: 'Qora' },
              { id: 'auto', l: 'Avtomatik', on: true },
            ].map(o => (
              <div key={o.id} className={`web-theme-card ${o.on ? 'on' : ''}`}>
                <div className={`web-theme-prev ${o.id}`} />
                <div style={{ fontSize: 12, fontWeight: o.on ? 700 : 500 }}>{o.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel h="Tipografika va o‘lcham">
        <SetRow l="Matn o‘lchami" right={<Slider value={100} min={80} max={130} unit="%" />} />
        <SetRow l="Zichlik" right={<Seg value="O‘rtacha" options={['Bo‘sh', 'O‘rtacha', 'Zich']} />} />
        <SetRow l="Tugma shakli" right={<Seg value="Yumshoq" options={['Kvadrat', 'Yumshoq', 'Dumaloq']} />} />
        <SetRow l="Animatsiyalarni kamaytirish" sub="Harakatga sezgir bo‘lganlar uchun" right={<Toggle on={false} />} />
        <SetRow l="Yulduz motivi shaffofligi" last right={<Slider value={18} min={0} max={50} />} />
      </Panel>
    </>
  );
}

function HomeWidgetsPanel() {
  return (
    <Panel h="Bosh sahifa · Widget‘lar" sub="8 ta faol · 14 ta mavjud">
      <div style={{ padding: '16px 20px',
                      background: 'var(--sf-primary-soft)',
                      borderBottom: '1px solid var(--sf-border)',
                      display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--sf-primary-ink)' }}>Bosh sahifa konstruktori</div>
          <div style={{ fontSize: 11, color: 'var(--sf-primary-ink)', opacity: 0.7 }}>
            Widget‘larni torting, o‘lchamini o‘zgartiring, qo‘shing
          </div>
        </div>
        <button className="web-btn web-btn-primary">Konstruktorni ochish</button>
      </div>
      {[
        { l: 'So‘rovnoma banneri', sub: 'Topshirilmaganlar', on: true },
        { l: 'Keyingi dars hero', sub: 'Asosiy ko‘rsatma', on: true },
        { l: 'AI tavsiya', sub: 'Kunlik xulosa', on: true },
        { l: 'Tezkor statistika', sub: '5 ta ko‘rsatkich', on: true },
        { l: 'Bugungi jadval', sub: 'Vaqt jadvali', on: true },
        { l: 'So‘nggi kartalar', sub: 'Karta strip', on: true },
        { l: 'Print holati', sub: 'Joriy navbat', on: true },
        { l: 'Vazifa kutmoqda', sub: 'Top 3', on: true },
        { l: 'Cohort spotlight', sub: 'Tanlangan guruh', on: false },
        { l: 'Boshqaruv xabarlari', sub: 'Direktor + metodist', on: false },
        { l: 'Ilhom · iqtibos', sub: 'AI tomonidan', on: false },
        { l: 'Ob-havo', sub: 'Toshkent · 2 kun', on: false },
        { l: 'Yopishtirilgan eslatma', sub: 'Shaxsiy yozuv', on: false, last: true },
      ].map((w, i, a) => (
        <SetRow key={i} l={w.l} sub={w.sub} last={i === a.length - 1} right={<Toggle on={w.on} />} />
      ))}
    </Panel>
  );
}

function NotifPanel() {
  return (
    <>
      <Panel h="Bildirishnomalar">
        <SetRow l="Bildirishnomalar yoqilgan" right={<Toggle on={true} />} />
        <SetRow l="Dars boshlanishi · necha daq oldin" right={<Seg value="15" options={['5', '10', '15', '30']} />} />
        <SetRow l="Yangi karta berildi" right={<Toggle on={true} />} />
        <SetRow l="Print tugaganda" right={<Toggle on={true} />} />
        <SetRow l="So‘rovnoma eslatmasi" right={<Toggle on={true} />} />
        <SetRow l="Direktordan xabar" right={<Toggle on={true} />} />
        <SetRow l="Ota-onadan xabar" right={<Toggle on={true} />} />
        <SetRow l="AI tavsiya" right={<Toggle on={true} />} />
        <SetRow l="Sokin soatlar" sub="22:00 — 07:00" last right={<Toggle on={true} />} />
      </Panel>
      <Panel h="Ovoz va vibratsiya">
        <SetRow l="Ovoz" right={<><Val v="Aurora · qisqa" /><Chev /></>} />
        <SetRow l="Vibratsiya kuchi" right={<Slider value={70} />} />
        <SetRow l="Banner uslubi" last right={<Seg value="Yuqorida" options={['Markaz', 'Yuqorida']} />} />
      </Panel>
    </>
  );
}

function CardsPanel() {
  return (
    <Panel h="Davomat va kartalar" sub="Bahоlar yo‘q — markaz qoidasiga ko‘ra Up / Down kartalar">
      <SetRow l="Davomat usul" sub="Asosiy gestura" right={<Seg value="Swipe" options={['Tap', 'Swipe', 'Voice']} />} />
      <SetRow l="Avtomatik saqlash" right={<Toggle on={true} />} />
      <SetRow l="Karta nomlari" sub="Markaz tomonidan · 4 ta turi"
               right={<><Val v="Yulduz / Ogohl." /><Chev /></>} />
      <SetRow l="Asosiy karta turi" right={<><Val v="Yulduz karta" /><Chev /></>} />
      <SetRow l="Sabab takliflari (AI)" right={<Toggle on={true} />} />
      <SetRow l="Sabab andoza‘lari" right={<><Val v="6 ta" mono /><Chev /></>} />
      <SetRow l="Ota-onaga avto-xabar (Down karta)" right={<Toggle on={true} />} />
      <SetRow l="Yangi kartani chop etish" last
               right={<Seg value="So‘ralganda" options={['Hech', 'So‘ralganda', 'Doim']} />} />
    </Panel>
  );
}

function PrintPanel() {
  return (
    <Panel h="Chop etish">
      <SetRow l="Asosiy printer" sub="Lobbi · 1-qavat · A4 B/W"
               right={<><Val v="HP LaserJet" /><Chev /></>} />
      <SetRow l="Asosiy nusxa soni" right={<Slider value={24} min={1} max={100} unit="" />} />
      <SetRow l="Asosiy format" right={<Seg value="A4" options={['A4', 'A5', 'A3']} />} />
      <SetRow l="Avto 2-tomonlama" right={<Toggle on={true} />} />
      <SetRow l="Rangli imkoniyat" right={<Toggle on={false} />} />
      <SetRow l="Tugaganda eslatma" last right={<Seg value="Push" options={['Yo‘q', 'Push', 'Push+SMS']} />} />
    </Panel>
  );
}

function SchedPanel() {
  return (
    <Panel h="Jadval va dars">
      <SetRow l="Hafta boshlanishi" right={<Seg value="Du" options={['Du', 'Ya']} />} />
      <SetRow l="Dars davomiyligi" right={<Seg value="45 daq" options={['45 daq', '60 daq', '90 daq']} />} />
      <SetRow l="Vaqt formati" right={<Seg value="24-soat" options={['12-soat', '24-soat']} />} />
      <SetRow l="Tanaffuslarni ko‘rsatish" right={<Toggle on={true} />} />
      <SetRow l="Asosiy ko‘rinish" right={<Seg value="Hafta" options={['Kun', 'Hafta', 'Oy']} />} />
      <SetRow l="Dars rejasi · AI yordamchi" last right={<Toggle on={true} />} />
    </Panel>
  );
}

function AIPanel() {
  return (
    <>
      <Panel h="AI yordamchi">
        <SetRow l="AI yoqilgan" right={<Toggle on={true} />} />
        <SetRow l="Guruh haqida suhbat" right={<Toggle on={true} />} />
        <SetRow l="Karta sabab taklifi" right={<Toggle on={true} />} />
        <SetRow l="Ota-ona javob taklifi" right={<Toggle on={false} />} />
        <SetRow l="Hisobot generatori" right={<Toggle on={true} />} />
        <SetRow l="Javob tili" right={<Seg value="UZ" options={['UZ', 'EN', 'RU']} />} />
        <SetRow l="Javob uslubi" last right={<Seg value="O‘rta" options={['Qisqa', 'O‘rta', 'Batafsil']} />} />
      </Panel>
      <Panel h="Token limiti" sub="Markaz tomonidan boshqariladi">
        <div className="web-setrow last" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>Oylik foydalanish</span>
            <span className="sf-mono" style={{ fontSize: 12, fontWeight: 700 }}>8.6%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--sf-surface-2)', overflow: 'hidden' }}>
            <div style={{ width: '8.6%', height: '100%', background: 'var(--sf-ai)' }} />
          </div>
          <div className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
            4 320 token ishlatildi · 50 000 dan
          </div>
        </div>
      </Panel>
    </>
  );
}

function PrivacyPanel() {
  return (
    <Panel h="Maxfiylik · Profil ulashish" sub="Sizning ma‘lumotlaringiz qaerga va kimga ko‘rinishini boshqaring">
      <SetRow l="Profilim markaz uchun ko‘rinadi"
               sub={<span style={{ color: 'var(--sf-success)' }}>
                  <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                                  background: 'var(--sf-success)', marginRight: 4,
                                  animation: 'webBreathe 1.6s ease-in-out infinite' }} />
                  Faol · ulashilmoqda
                </span>}
               right={<Toggle on={true} />} />
      <SetRow l="O‘quvchilar profilimni ko‘radi" right={<Toggle on={true} />} />
      <SetRow l="Ish vaqtim ko‘rinadi" right={<Toggle on={false} />} />
      <SetRow l="Anonim so‘rovnomalarda ishtirok" right={<Toggle on={true} />} />
      <SetRow l="AI ma‘lumotlarimdan o‘rganadi" right={<Toggle on={false} />} />
      <SetRow l="Telemetriya" right={<Toggle on={false} />} />
      <SetRow l="Ma‘lumotlarimni eksport qilish" right={<Chev />} />
      <SetRow l="Hisobni o‘chirish" last danger right={<Chev />} />
    </Panel>
  );
}

function SecPanel() {
  return (
    <Panel h="Xavfsizlik">
      <SetRow l="Face ID" sub="Yoqilgan" right={<Toggle on={true} />} />
      <SetRow l="Avtomatik blok" right={<Seg value="5 daq" options={['1', '5', '15', 'Yo‘q']} />} />
      <SetRow l="Skrinshotda yashirish" right={<Toggle on={false} />} />
      <SetRow l="VPN orqali ulanish" right={<Toggle on={false} />} />
      <SetRow l="Faol qurilmalar" right={<><Val v="2 ta" mono /><Chev /></>} />
      <SetRow l="Login tarixi" last right={<><Val v="19.05 09:42" dim /><Chev /></>} />
    </Panel>
  );
}

function LangPanel() {
  return (
    <Panel h="Til va hudud">
      <SetRow l="Til" right={<><Val v="O‘zbekcha · Lotin" /><Chev /></>} />
      <SetRow l="Yozuv tizimi" right={<Seg value="Lotin" options={['Lotin', 'Kirill']} />} />
      <SetRow l="Sana formati" right={<><Val v="DD.MM.YYYY" mono /><Chev /></>} />
      <SetRow l="Valyuta" last right={<><Val v="UZS · so‘m" /><Chev /></>} />
    </Panel>
  );
}

function StoragePanel() {
  return (
    <Panel h="Saqlash">
      <div className="web-setrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Joriy ish hajmi</div>
            <div className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>142 / 500 MB</div>
          </div>
          <span className="sf-mono" style={{ fontSize: 14, fontWeight: 700 }}>28%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--sf-surface-2)', overflow: 'hidden',
                        display: 'flex' }}>
          <div style={{ width: '12%', background: 'var(--sf-primary)' }} />
          <div style={{ width: '8%', background: 'var(--sf-accent)' }} />
          <div style={{ width: '5%', background: 'var(--sf-success)' }} />
          <div style={{ width: '3%', background: 'var(--sf-warn)' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--sf-muted)', flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--sf-primary)', marginRight: 4 }} />Materiallar · 60 MB</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--sf-accent)', marginRight: 4 }} />Video · 42 MB</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--sf-success)', marginRight: 4 }} />AI · 24 MB</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--sf-warn)', marginRight: 4 }} />Kesh · 14 MB</span>
        </div>
      </div>
      <SetRow l="Keshni tozalash" right={<><Val v="14 MB" mono /><Chev /></>} />
      <SetRow l="Offline materiallar" right={<><Val v="240 MB" mono /><Chev /></>} />
      <SetRow l="Bulutda zaxira" right={<Toggle on={true} />} />
      <SetRow l="Avto-tozalash" last right={<Seg value="30 kun" options={['7', '30', '90', 'Yo‘q']} />} />
    </Panel>
  );
}

function ConnPanel() {
  return (
    <Panel h="Bog‘langan hisoblar">
      <SetRow l="Telegram · @nigora_uz" sub="Ulangan" right={<Chev />} />
      <SetRow l="Eskiz SMS" sub="Markaz tomonidan" right={<Val v="Faol" dim />} />
      <SetRow l="Click to‘lov · 5414 ** 8842" sub="Ulangan" right={<Chev />} />
      <SetRow l="Apple Calendar" sub="Ulanmagan" last
               right={<span style={{ color: 'var(--sf-primary)', fontSize: 12, fontWeight: 600 }}>Ulanish</span>} />
    </Panel>
  );
}

function CenterPanel() {
  return (
    <Panel h="O‘quv markaz">
      <SetRow l="Demo Akademiya" sub="Yunusobod filiali" right={<Chev />} />
      <SetRow l="Filialni o‘zgartirish" right={<><Val v="1 filial" /><Chev /></>} />
      <SetRow l="Karta sozlamalari" right={<><Val v="v2.3" mono /><Chev /></>} />
      <SetRow l="Qoidalar va siyosat" right={<Chev />} />
      <SetRow l="Markazga shikoyat" last right={<Chev />} />
    </Panel>
  );
}

function BetaPanel() {
  return (
    <Panel h="Beta xususiyatlar" sub="⚠ Beta xususiyatlar barqaror emas">
      <SetRow l="AI ovozli suhbat" right={<Toggle on={false} />} />
      <SetRow l="Karta dizayni v2 (3D)" right={<Toggle on={true} />} />
      <SetRow l="Wi-Fi printer kashfiyoti" right={<Toggle on={false} />} />
      <SetRow l="Beta dasturda qatnashish" last right={<Toggle on={true} />} />
    </Panel>
  );
}

function AboutPanel() {
  return (
    <Panel h="Haqida">
      <SetRow l="Versiya" right={<Val v="1.2.0 · build 2026.05.19" mono />} />
      <SetRow l="Yangiliklar" right={<><Val v="3 ta yangi" /><Chev /></>} />
      <SetRow l="Foydalanish shartlari" right={<Chev />} />
      <SetRow l="Maxfiylik siyosati" right={<Chev />} />
      <SetRow l="Litsenziyalar" last right={<Chev />} />
    </Panel>
  );
}

const settingsStyles = `
.web-settings-layout {
  display: grid; grid-template-columns: 260px 1fr; gap: 20px;
}
@media (max-width: 1024px) { .web-settings-layout { grid-template-columns: 1fr; } }
.web-settings-side {
  display: flex; flex-direction: column; gap: 1px;
  position: sticky; top: 84px; align-self: flex-start;
  background: var(--sf-surface); border: 1px solid var(--sf-border);
  border-radius: 14px; padding: 8px;
  max-height: calc(100vh - 110px); overflow-y: auto;
}
@media (max-width: 1024px) {
  .web-settings-side {
    position: relative; top: auto; flex-direction: row; flex-wrap: wrap; gap: 6px; padding: 10px;
    max-height: none; overflow: visible;
  }
}
.web-set-side-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 10px;
  background: transparent; border: none; cursor: pointer;
  font-family: inherit; font-size: 13px; font-weight: 500;
  color: var(--sf-ink-2); text-align: left;
  transition: background 0.12s;
}
.web-set-side-btn:hover { background: var(--sf-surface-2); }
.web-set-side-btn[data-on="1"] {
  background: var(--sf-primary-soft); color: var(--sf-primary-ink); font-weight: 700;
}
.web-set-side-icon {
  width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

.web-settings-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.web-panel { }
.web-panel-h { padding: 18px 22px 14px; border-bottom: 1px solid var(--sf-border); }
.web-panel-h h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
.web-panel-sub { margin-top: 4px; font-size: 12.5px; color: var(--sf-muted); }

.web-setrow {
  display: flex; padding: 14px 22px; gap: 16px; align-items: center;
  border-bottom: 1px solid var(--sf-border);
}
.web-setrow.last { border-bottom: none; }
.web-setrow.danger .web-setrow-l { color: var(--sf-danger); font-weight: 600; }
.web-setrow-l { font-size: 13.5px; }
.web-setrow-sub { margin-top: 2px; font-size: 11px; color: var(--sf-muted); }
.web-setrow-right { display: flex; align-items: center; gap: 8px; }

.web-toggle {
  width: 42px; height: 26px; border-radius: 999px;
  background: var(--sf-surface-3); padding: 3px;
  transition: background 0.2s;
}
.web-toggle[data-on="1"] { background: var(--sf-primary); }
.web-toggle-knob {
  width: 20px; height: 20px; border-radius: 50%; background: #FFFCF5;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.web-toggle[data-on="1"] .web-toggle-knob { transform: translateX(16px); }

.web-settings-profile {
  background: linear-gradient(180deg, var(--sf-surface) 0%, var(--sf-bg) 100%);
}
.web-avatar-edit {
  position: absolute; bottom: 0; right: 0;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--sf-ink); color: var(--sf-bg);
  border: 3px solid var(--sf-surface);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

.web-theme-card {
  padding: 12px; border-radius: 10px;
  background: var(--sf-surface); border: 1px solid var(--sf-border);
  cursor: pointer;
}
.web-theme-card.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
.web-theme-prev {
  height: 60px; border-radius: 6px; margin-bottom: 8px;
}
.web-theme-prev.light { background: linear-gradient(180deg, #FFFCF5 0%, #F4EBD8 100%); border: 1px solid var(--sf-border); }
.web-theme-prev.dark { background: linear-gradient(180deg, #1D1914 0%, #14110D 100%); }
.web-theme-prev.auto { background: linear-gradient(90deg, #FFFCF5 50%, #1D1914 50%); border: 1px solid var(--sf-border); }
`;

Object.assign(window, { SettingsPage });
