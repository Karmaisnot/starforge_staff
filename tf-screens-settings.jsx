// tf-screens-settings.jsx — Comprehensive Settings (replaces SettingsScreen)
// 18 sections · ~100 controls · sliders, colour swatches, radios, steppers,
// progress meters, search, profile-sharing indicator.

// ─── Atoms ────────────────────────────────────────────────────────
function SetSection({ h, icon, children, accent }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ padding: '0 4px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: accent || 'var(--sf-surface-2)',
            color: accent ? '#FFFCF5' : 'var(--sf-ink-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{React.cloneElement(icon, { size: 13 })}</div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                       textTransform: 'uppercase', color: 'var(--sf-muted)' }}>{h}</div>
      </div>
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function SetRow({ children, last, onClick, danger }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : '1px solid var(--sf-border)',
      cursor: onClick ? 'pointer' : 'default',
      color: danger ? 'var(--sf-danger)' : 'var(--sf-ink)',
    }}>{children}</div>
  );
}

function SetIcon({ icon, color }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      background: color ? color + '22' : 'var(--sf-surface-2)',
      color: color || 'var(--sf-ink-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{React.cloneElement(icon, { size: 16 })}</div>
  );
}

function SetToggle({ on }) {
  return (
    <div style={{
      width: 42, height: 26, borderRadius: 999,
      background: on ? 'var(--sf-primary)' : 'var(--sf-surface-3)',
      padding: 3, transition: 'background 0.2s',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#FFFCF5',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transform: on ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }} />
    </div>
  );
}

function SetValue({ label, mono, dim }) {
  return (
    <span className={mono ? 'sf-mono' : ''} style={{
      fontSize: 12.5, color: dim ? 'var(--sf-muted)' : 'var(--sf-ink-2)',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function SetChev() { return <span style={{ color: 'var(--sf-muted)' }}>{React.cloneElement(Icons.chevR, { size: 14 })}</span>; }

function SetSlider({ value, min = 0, max = 100, unit = '', color = 'var(--sf-primary)' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 4,
                      background: 'var(--sf-surface-2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
                        background: color }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 9px)`, top: -6, width: 18, height: 18,
                        borderRadius: '50%', background: '#FFFCF5',
                        border: '1.5px solid var(--sf-border-strong)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
      </div>
      <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)',
                                            fontWeight: 600, minWidth: 36, textAlign: 'right' }}>
        {value}{unit}
      </span>
    </div>
  );
}

function SetSegment({ options, value }) {
  return (
    <div style={{ display: 'flex', gap: 3, padding: 3,
                    background: 'var(--sf-surface-2)', borderRadius: 8 }}>
      {options.map(o => (
        <div key={o} style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600,
          background: o === value ? 'var(--sf-surface)' : 'transparent',
          color: o === value ? 'var(--sf-ink)' : 'var(--sf-muted)',
          boxShadow: o === value ? 'var(--sf-shadow-sm)' : 'none',
          whiteSpace: 'nowrap',
        }}>{o}</div>
      ))}
    </div>
  );
}

function SetSwatches({ value, options }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((c, i) => (
        <div key={i} style={{
          width: 24, height: 24, borderRadius: '50%', background: c,
          border: c === value ? '2px solid var(--sf-ink)' : '1px solid var(--sf-border)',
          boxShadow: c === value ? '0 0 0 3px var(--sf-bg)' : 'none',
          outline: c === value ? '2px solid ' + c : 'none', outlineOffset: 0,
        }} />
      ))}
    </div>
  );
}

function SetRadioCol({ options, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {options.map((o, i, a) => (
        <div key={o.id} style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
          background: o.id === value ? 'var(--sf-primary-soft)' : 'transparent',
          borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none',
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: `2px solid ${o.id === value ? 'var(--sf-primary)' : 'var(--sf-border-strong)'}`,
            background: o.id === value ? 'var(--sf-primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{o.id === value && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFCF5' }} />}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: o.id === value ? 700 : 500 }}>{o.label}</div>
            {o.sub && <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{o.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────
function SettingsScreen({ platform = 'ios' }) {
  return (
    <SfFrame>
      {platform === 'ios' ? <SfStatusBarIOS /> : <SfStatusBarAndroid />}
      <SfNavBarIOS large title="Sozlamalar"
        subtitle="98 ta sozlama · barchasi tahrirlanadi"
        right={<>{Icons.search}</>} />

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--sf-bg)', padding: '4px 18px 100px' }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--sf-surface)', border: '1px solid var(--sf-border)',
          borderRadius: 12, padding: '10px 14px', marginTop: 4,
        }}>
          {React.cloneElement(Icons.search, { size: 16, style: { color: 'var(--sf-muted)' } })}
          <span style={{ color: 'var(--sf-muted)', fontSize: 13.5, flex: 1 }}>
            Sozlamalardan izlash...
          </span>
          <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)',
                                                padding: '2px 6px', borderRadius: 4,
                                                background: 'var(--sf-surface-2)' }}>⌘K</span>
        </div>

        {/* Profile card */}
        <div className="sf-card" style={{ marginTop: 16, padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, opacity: 0.08 }}>
            <SfStar size={140} color="var(--sf-primary)" />
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <SfAvatar name="Nigora Karimova" size={60} color="var(--sf-primary)" />
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--sf-ink)', color: 'var(--sf-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--sf-surface)',
              }}>{React.cloneElement(Icons.edit, { size: 11 })}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Nigora Karimova</div>
              <div style={{ fontSize: 11.5, color: 'var(--sf-muted)' }}>
                Matematika ustozi · Yunusobod filiali
              </div>
              <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 999,
                              background: 'var(--sf-success-soft)', color: 'var(--sf-success)',
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                              textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%',
                                background: 'var(--sf-success)',
                                animation: 'setBreathe 1.6s ease-in-out infinite' }} />
                Profil ulashilmoqda
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 14, display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[
              { v: '3', l: 'Guruh' },
              { v: '58', l: 'O‘quvchi' },
              { v: '12', l: 'Dars/hafta' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 8,
                                      background: 'var(--sf-surface-2)', borderRadius: 8 }}>
                <div className="sf-mono" style={{ fontSize: 16, fontWeight: 700,
                                                    color: 'var(--sf-ink)' }}>{s.v}</div>
                <div style={{ marginTop: 2, fontSize: 9.5, color: 'var(--sf-muted)',
                                letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ HISOB */}
        <SetSection h="Hisob" icon={Icons.user}>
          <SetRow>
            <SetIcon icon={Icons.user} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Shaxsiy ma‘lumotlar</span>
            <SetValue label="Nigora Karimova" /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Foydalanuvchi nomi</span>
            <SetValue label="nigora.karimova" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.bell} />
            <span style={{ flex: 1, fontSize: 13.5 }}>E-pochta</span>
            <SetValue label="qo‘shilmagan" dim /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.edit} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Parolni o‘zgartirish</span>
            <SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} color="var(--sf-success)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>2-bosqichli himoya</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-success)' }}>Yoqilgan · SMS</div>
            </div>
            <SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.x} color="var(--sf-warn)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Hisobni vaqtinchalik to‘xtatish</span>
            <SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ KO'RINISH */}
        <SetSection h="Ko‘rinish" icon={Icons.brand} accent="var(--sf-primary)">
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Rang palitrasi</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Saroy · Terracotta</div>
            </div>
            <SetSwatches value="#B85535" options={['#B85535', '#1F6B66', '#2A3D8F', '#4F6A3A']} />
          </SetRow>
          <div style={{ padding: '8px 14px 12px', borderBottom: '1px solid var(--sf-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13.5 }}>Mavzu rejimi</span>
            </div>
            <SetRadioCol value="auto" options={[
              { id: 'light', label: 'Och', sub: 'Doim yorug‘' },
              { id: 'dark', label: 'Qora', sub: 'Doim qoraytirilgan' },
              { id: 'auto', label: 'Avtomatik', sub: 'Tizim sozlamalariga ko‘ra' },
            ]} />
          </div>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--sf-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13.5 }}>Matn o‘lchami</span>
              <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)' }}>100%</span>
            </div>
            <SetSlider value={100} min={80} max={130} unit="%" />
          </div>
          <SetRow>
            <SetIcon icon={Icons.cohort} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Zichlik</span>
            <SetSegment value="O‘rtacha" options={['Bo‘sh', 'O‘rtacha', 'Zich']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Tugma shakli</span>
            <SetSegment value="Yumshoq" options={['Kvadrat', 'Yumshoq', 'Dumaloq']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Animatsiyalarni kamaytirish</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Yulduz motivi shaffofligi</span>
            <SetSlider value={18} min={0} max={50} unit="%" />
          </SetRow>
        </SetSection>

        {/* ═══════════════ BOSH SAHIFA · WIDGETLAR */}
        <SetSection h="Bosh sahifa · Widget‘lar" icon={Icons.home} accent="var(--sf-accent-ink)">
          <SetRow>
            <SetIcon icon={Icons.edit} color="var(--sf-primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--sf-primary)' }}>Bosh sahifani tahrirlash</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Widget‘larni qo‘shing, olib tashlang, o‘lchamini o‘zgartiring</div>
            </div>
            <SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Faol widget‘lar</span>
            <SetValue label="8 / 14" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.flag} color="var(--sf-danger)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>So‘rovnoma banneri</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>AI tavsiya widget‘i</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.print} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Print holati widget‘i</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.check} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Vazifalar widget‘i</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cohort} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Cohort spotlight</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Avto-tartibga keltirish (smart)</span>
            <SetToggle on={true} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ TAB BAR */}
        <SetSection h="Tab bar" icon={Icons.home}>
          <SetRow>
            <SetIcon icon={Icons.edit} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Tablar tartibi</span>
            <SetValue label="Bugun · Guruh · Vazifa · AI · Print" dim /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.plus} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Markaziy ”+” tugma</span>
            <SetSegment value="Karta" options={['Karta', 'Vazifa', 'Print']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.user} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Profilni tabsga qo‘shish</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Tab uslubi</span>
            <SetSegment value="Etiketli" options={['Etiketsiz', 'Etiketli']} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ BILDIRISHNOMALAR */}
        <SetSection h="Bildirishnomalar" icon={Icons.bell}>
          <SetRow>
            <SetIcon icon={Icons.bell} color="var(--sf-primary)" />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>Bildirishnomalar yoqilgan</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Dars boshlanishi</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Necha daqiqa oldin eslatish</div>
            </div>
            <SetSegment value="15" options={['5', '10', '15', '30']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Yangi karta berildi</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.print} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Print tugaganda</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.flag} color="var(--sf-danger)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>So‘rovnoma eslatmasi</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} color="var(--sf-primary)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Direktordan xabar</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.chat} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ota-onadan xabar</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>AI tavsiya</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Sokin soatlar</div>
              <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>22:00 — 07:00</div>
            </div>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ovoz</span>
            <SetValue label="Aurora · qisqa" /><SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Vibratsiya kuchi</span>
            <SetSlider value={70} unit="%" color="var(--sf-accent)" />
          </SetRow>
        </SetSection>

        {/* ═══════════════ DAVOMAT VA KARTALAR */}
        <SetSection h="Davomat va kartalar" icon={Icons.check} accent="var(--sf-success)">
          <SetRow>
            <SetIcon icon={Icons.check} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Davomat usul</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Asosiy gestura</div>
            </div>
            <SetSegment value="Swipe" options={['Tap', 'Swipe', 'Voice']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cal} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Avtomatik saqlash</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Karta nomlari</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Markaz tomonidan · 4 ta turi</div>
            </div>
            <SetValue label="Yulduz / Ogohl." /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} color="#7A4F0E" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Asosiy karta turi</span>
            <SetValue label="Yulduz karta" /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Sabab takliflari (AI)</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.edit} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Sabab andoza‘lari</span>
            <SetValue label="6 ta" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.chat} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ota-onaga avto-xabar (Down)</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.print} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Yangi kartani chop etish</span>
            <SetSegment value="So‘ralganda" options={['Hech', 'So‘ralganda', 'Doim']} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ CHOP ETISH */}
        <SetSection h="Chop etish" icon={Icons.print}>
          <SetRow>
            <SetIcon icon={Icons.print} color="var(--sf-primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Asosiy printer</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Lobbi · 1-qavat · A4 B/W</div>
            </div>
            <SetValue label="HP LaserJet" /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.doc} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Asosiy nusxa soni</span>
            <SetSlider value={24} min={1} max={100} color="var(--sf-primary)" />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.doc} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Asosiy format</span>
            <SetSegment value="A4" options={['A4', 'A5', 'A3']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Avto 2-tomonlama</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Rangli imkoniyat</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.bell} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Tugaganda eslatma</span>
            <SetSegment value="Push" options={['Yo‘q', 'Push', 'Push+SMS']} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ JADVAL */}
        <SetSection h="Jadval va dars" icon={Icons.cal}>
          <SetRow>
            <SetIcon icon={Icons.cal} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Hafta boshlanishi</span>
            <SetSegment value="Du" options={['Du', 'Ya']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Dars davomiyligi</span>
            <SetSegment value="45 daq" options={['45 daq', '60 daq', '90 daq']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Vaqt formati</span>
            <SetSegment value="24-soat" options={['12-soat', '24-soat']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cal} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Tanaffuslarni ko‘rsatish</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cal} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Asosiy ko‘rinish</span>
            <SetSegment value="Hafta" options={['Kun', 'Hafta', 'Oy']} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Dars rejasi AI-yordamchi</span>
            <SetToggle on={true} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ AI YORDAMCHI */}
        <SetSection h="AI yordamchi" icon={Icons.ai} accent="var(--sf-ai)">
          <SetRow>
            <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>AI yoqilgan</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.chat} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Guruh haqida suhbat</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Karta sabab taklifi</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.chat} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ota-ona javob taklifi</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.doc} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Hisobot generatori</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.globe} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Javob tili</span>
            <SetSegment value="UZ" options={['UZ', 'EN', 'RU']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Javob uslubi</span>
            <SetSegment value="O‘rta" options={['Qisqa', 'O‘rta', 'Batafsil']} />
          </SetRow>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--sf-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5 }}>Oylik token limiti</div>
                <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>4 320 / 50 000 · 8.6%</div>
              </div>
              <SetChev />
            </div>
            <div style={{ height: 5, borderRadius: 4, background: 'var(--sf-surface-2)', overflow: 'hidden' }}>
              <div style={{ width: '8.6%', height: '100%', background: 'var(--sf-ai)' }} />
            </div>
          </div>
          <SetRow>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Suhbat tarixi</span>
            <SetValue label="142 xabar" mono /><SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.x} color="var(--sf-danger)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Suhbatlarni tozalash</span>
            <SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ MAXFIYLIK */}
        <SetSection h="Maxfiylik · Profil ulashish" icon={Icons.shield}>
          <SetRow>
            <SetIcon icon={Icons.shield} color="var(--sf-success)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Profilim markaz uchun ko‘rinadi</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-success)' }}>
                <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                                background: 'var(--sf-success)', marginRight: 4,
                                animation: 'setBreathe 1.6s ease-in-out infinite' }} />
                Faol · ulashilmoqda
              </div>
            </div>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.user} />
            <span style={{ flex: 1, fontSize: 13.5 }}>O‘quvchilar profilimni ko‘radi</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ish vaqtim ko‘rinadi</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.flag} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Anonim so‘rovnomalarda ishtirok</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.ai} />
            <span style={{ flex: 1, fontSize: 13.5 }}>AI ma‘lumotlarimdan o‘rganadi</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Telemetriya</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.download} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Ma‘lumotlarimni eksport qilish</span>
            <SetChev />
          </SetRow>
          <SetRow last danger>
            <SetIcon icon={Icons.x} color="var(--sf-danger)" />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>Hisobni o‘chirish</span>
            <SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ XAVFSIZLIK */}
        <SetSection h="Xavfsizlik" icon={Icons.shield} accent="var(--sf-warn)">
          <SetRow>
            <SetIcon icon={Icons.shield} color="var(--sf-success)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Face ID</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-success)' }}>Yoqilgan</div>
            </div>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Avtomatik blok</span>
            <SetSegment value="5 daq" options={['1', '5', '15', 'Yo‘q']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Skrinshotda yashirish</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.globe} />
            <span style={{ flex: 1, fontSize: 13.5 }}>VPN orqali ulanish</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.print} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Faol qurilmalar</span>
            <SetValue label="2 ta" mono /><SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Login tarixi</span>
            <SetValue label="So‘nggi · 19.05 09:42" dim /><SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ TIL VA HUDUD */}
        <SetSection h="Til va hudud" icon={Icons.globe}>
          <SetRow>
            <SetIcon icon={Icons.globe} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Til</span>
            <SetValue label="O‘zbekcha · Lotin" /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Yozuv tizimi</span>
            <SetSegment value="Lotin" options={['Lotin', 'Kirill']} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cal} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Sana formati</span>
            <SetValue label="DD.MM.YYYY" mono /><SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Valyuta</span>
            <SetValue label="UZS · so‘m" /><SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ SAQLASH */}
        <SetSection h="Saqlash · 142 MB" icon={Icons.folder}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--sf-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <SetIcon icon={Icons.folder} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5 }}>Joriy ish hajmi</div>
                <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>142 / 500 MB</div>
              </div>
              <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-ink-2)', fontWeight: 700 }}>28%</span>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: 'var(--sf-surface-2)', overflow: 'hidden',
                            display: 'flex' }}>
              <div style={{ width: '12%', background: 'var(--sf-primary)' }} title="Materiallar" />
              <div style={{ width: '8%', background: 'var(--sf-accent)' }} title="Video" />
              <div style={{ width: '5%', background: 'var(--sf-success)' }} title="AI suhbatlari" />
              <div style={{ width: '3%', background: 'var(--sf-warn)' }} title="Kesh" />
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 10, fontSize: 10, color: 'var(--sf-muted)',
                            flexWrap: 'wrap' }}>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                                      background: 'var(--sf-primary)', marginRight: 4 }} />Materiallar · 60 MB</span>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                                      background: 'var(--sf-accent)', marginRight: 4 }} />Video · 42</span>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                                      background: 'var(--sf-success)', marginRight: 4 }} />AI · 24</span>
            </div>
          </div>
          <SetRow>
            <SetIcon icon={Icons.x} color="var(--sf-warn)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Keshni tozalash</span>
            <SetValue label="14 MB" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.folder} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Offline materiallar</span>
            <SetValue label="240 MB" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.upload} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Bulutda zaxira</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.clock} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Avto-tozalash</span>
            <SetSegment value="30 kun" options={['7', '30', '90', 'Yo‘q']} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ BOG'LANGAN HISOBLAR */}
        <SetSection h="Bog‘langan hisoblar" icon={Icons.globe}>
          <SetRow>
            <SetIcon icon={Icons.send} color="#0088CC" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Telegram</div>
              <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-success)' }}>@nigora_uz · ulangan</div>
            </div>
            <SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.bell} color="var(--sf-accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Eskiz SMS</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Markaz tomonidan boshqariladi</div>
            </div>
            <SetValue label="Faol" dim />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} color="var(--sf-primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Click to‘lov</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-success)' }}>Ulangan · 5414 ** 8842</div>
            </div>
            <SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.cal} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>Apple Calendar</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Ulanmagan</div>
            </div>
            <span style={{ color: 'var(--sf-primary)', fontSize: 12, fontWeight: 600 }}>Ulanish</span>
          </SetRow>
        </SetSection>

        {/* ═══════════════ MARKAZ */}
        <SetSection h="O‘quv markaz" icon={Icons.shield} accent="var(--sf-primary)">
          <SetRow>
            <SetIcon icon={Icons.brand} color="var(--sf-primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Demo Akademiya</div>
              <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>Yunusobod filiali</div>
            </div>
            <SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.cohort} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Filialni o‘zgartirish</span>
            <SetValue label="1 filial" /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Karta sozlamalari</span>
            <SetValue label="Markaz · v2.3" mono /><SetChev />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.shield} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Qoidalar va siyosat</span>
            <SetChev />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.flag} color="var(--sf-danger)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>Markazga shikoyat</span>
            <SetChev />
          </SetRow>
        </SetSection>

        {/* ═══════════════ BETA */}
        <SetSection h="Beta xususiyatlar" icon={Icons.ai} accent="var(--sf-accent)">
          <div style={{ padding: '12px 14px', background: 'var(--sf-accent-soft)',
                          borderBottom: '1px solid var(--sf-border)',
                          display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--sf-accent-ink)' }}>{React.cloneElement(Icons.flag, { size: 14 })}</span>
            <div style={{ flex: 1, fontSize: 11.5, color: 'var(--sf-accent-ink)', lineHeight: 1.4 }}>
              Beta xususiyatlar barqaror emas. Yo‘l-yo‘riq uchun yordam markaziga murojaat qiling.
            </div>
          </div>
          <SetRow>
            <SetIcon icon={Icons.ai} color="var(--sf-ai)" />
            <span style={{ flex: 1, fontSize: 13.5 }}>AI ovozli suhbat</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Karta dizayni v2 (3D)</span>
            <SetToggle on={true} />
          </SetRow>
          <SetRow>
            <SetIcon icon={Icons.print} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Wi-Fi printer kashfiyoti</span>
            <SetToggle on={false} />
          </SetRow>
          <SetRow last>
            <SetIcon icon={Icons.flag} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Beta dasturda qatnashish</span>
            <SetToggle on={true} />
          </SetRow>
        </SetSection>

        {/* ═══════════════ YORDAM */}
        <SetSection h="Yordam va qo‘llab-quvvatlash" icon={Icons.chat}>
          <SetRow><SetIcon icon={Icons.search} /><span style={{ flex: 1, fontSize: 13.5 }}>Yordam markazi</span><SetChev /></SetRow>
          <SetRow><SetIcon icon={Icons.video} /><span style={{ flex: 1, fontSize: 13.5 }}>Video yo‘riqnoma</span><SetChev /></SetRow>
          <SetRow><SetIcon icon={Icons.chat} /><span style={{ flex: 1, fontSize: 13.5 }}>Texnik qo‘llab-quvvatlash</span><SetValue label="onlayn" dim /><SetChev /></SetRow>
          <SetRow last><SetIcon icon={Icons.edit} /><span style={{ flex: 1, fontSize: 13.5 }}>Fikr bildirish</span><SetChev /></SetRow>
        </SetSection>

        {/* ═══════════════ HAQIDA */}
        <SetSection h="Haqida" icon={Icons.brand}>
          <SetRow>
            <SetIcon icon={Icons.brand} />
            <span style={{ flex: 1, fontSize: 13.5 }}>Versiya</span>
            <SetValue label="1.2.0 · build 2026.05.19" mono /><SetChev />
          </SetRow>
          <SetRow><SetIcon icon={Icons.doc} /><span style={{ flex: 1, fontSize: 13.5 }}>Yangiliklar</span><SetValue label="3 ta yangi" /><SetChev /></SetRow>
          <SetRow><SetIcon icon={Icons.shield} /><span style={{ flex: 1, fontSize: 13.5 }}>Foydalanish shartlari</span><SetChev /></SetRow>
          <SetRow><SetIcon icon={Icons.shield} /><span style={{ flex: 1, fontSize: 13.5 }}>Maxfiylik siyosati</span><SetChev /></SetRow>
          <SetRow last><SetIcon icon={Icons.doc} /><span style={{ flex: 1, fontSize: 13.5 }}>Litsenziyalar</span><SetChev /></SetRow>
        </SetSection>

        {/* Logout */}
        <button className="sf-btn sf-btn--ghost sf-btn--block" style={{
          marginTop: 22, height: 50, color: 'var(--sf-danger)',
          borderColor: 'var(--sf-border)',
        }}>
          {React.cloneElement(Icons.logout, { size: 18 })} Hisobdan chiqish
        </button>

        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <SfWordmark size={12} />
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--sf-muted)',
                          fontFamily: 'var(--sf-font-mono)' }}>
            v1.2.0 · build 2026.05.19 · UZ-Lat
          </div>
          <div style={{ marginTop: 4, fontSize: 10, color: 'var(--sf-muted)' }}>
            Demo Akademiya · Yunusobod · 98 sozlama
          </div>
        </div>
      </div>

      <SfTabBar active="home" platform={platform} />
      {platform === 'ios' ? <SfHomeIndicatorIOS /> : <SfNavBarAndroid />}
      <style>{`
        @keyframes setBreathe { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.6); } }
      `}</style>
    </SfFrame>
  );
}

Object.assign(window, { SettingsScreen });
