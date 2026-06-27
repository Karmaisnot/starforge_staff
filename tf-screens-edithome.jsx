// tf-screens-edithome.jsx — Bosh sahifani tahrirlash
// Widget management: drag handles, visibility toggles, size selectors,
// and a gallery of available widgets to add.

function EditHomeScreen({ platform = 'ios' }) {
  const active = [
    { id: 'survey', n: 'So‘rovnoma banneri', d: 'Topshirilmagan so‘rovnomalar', icon: Icons.flag, color: 'var(--sf-danger)', size: 'L', on: true, pinned: true },
    { id: 'next', n: 'Keyingi dars', d: 'Davomat va xona ma‘lumoti', icon: Icons.cal, color: 'var(--sf-primary)', size: 'L', on: true },
    { id: 'stats', n: 'Tezkor statistika', d: 'Dars · Davomat · Kartalar', icon: Icons.trend, color: 'var(--sf-success)', size: 'M', on: true },
    { id: 'ai', n: 'AI tavsiya', d: 'Diqqat talab qilingan o‘quvchilar', icon: Icons.ai, color: 'var(--sf-ai)', size: 'L', on: true },
    { id: 'schedule', n: 'Bugungi jadval', d: '5 ta dars · ro‘yxat', icon: Icons.clock, color: 'var(--sf-ink-2)', size: 'L', on: true },
    { id: 'cards', n: 'So‘nggi kartalar', d: 'Strip · 5 ta karta', icon: Icons.brand, color: 'var(--sf-accent)', size: 'M', on: true },
    { id: 'print', n: 'Print holati', d: 'Joriy navbat va progress', icon: Icons.print, color: 'var(--sf-primary)', size: 'S', on: true },
    { id: 'tasks', n: 'Vazifalar', d: 'Bugungi 2 ta', icon: Icons.check, color: 'var(--sf-success)', size: 'M', on: true },
  ];
  const available = [
    { id: 'cohort', n: 'Cohort spotlight', d: 'Tanlangan guruh statistika', icon: Icons.cohort, color: 'var(--sf-primary)' },
    { id: 'mgmt', n: 'Boshqaruv xabarlari', d: 'Direktor + metodist', icon: Icons.shield, color: 'var(--sf-ink)' },
    { id: 'student', n: 'Spotlight o‘quvchi', d: 'Diqqat talab qilingan', icon: Icons.user, color: 'var(--sf-warn)' },
    { id: 'inspo', n: 'Ilhom · kun iqtibosi', d: 'AI tomonidan tanlanadi', icon: Icons.brand, color: 'var(--sf-accent)' },
    { id: 'weather', n: 'Ob-havo · Toshkent', d: 'Bugungi va ertangi', icon: Icons.globe, color: '#3D7BFF' },
    { id: 'note', n: 'Yopishtirilgan eslatma', d: 'Shaxsiy yozuv', icon: Icons.edit, color: 'var(--sf-accent-ink)' },
  ];

  const sizeColor = { S: 'var(--sf-surface-3)', M: 'var(--sf-accent-soft)', L: 'var(--sf-primary-soft)' };
  const sizeFg    = { S: 'var(--sf-muted)', M: 'var(--sf-accent-ink)', L: 'var(--sf-primary-ink)' };

  return (
    <SfFrame>
      {platform === 'ios' ? <SfStatusBarIOS /> : <SfStatusBarAndroid />}
      <div style={{ background: 'var(--sf-surface)', padding: '4px 18px',
                     borderBottom: '1px solid var(--sf-border)' }}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--sf-primary)', fontSize: 16, fontWeight: 600 }}>Bekor</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>8 / 14 widget yoqilgan</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Bosh sahifani tahrirlash</div>
          </div>
          <span style={{ color: 'var(--sf-primary)', fontWeight: 700, fontSize: 15 }}>Saqlash</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--sf-bg)', padding: '14px 18px 100px' }}>

        {/* Preview strip */}
        <div className="sf-card" style={{ padding: 12, position: 'relative', overflow: 'hidden',
                                            background: 'linear-gradient(180deg, var(--sf-surface) 0%, var(--sf-surface-2) 100%)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.06 }}>
            <SfStar size={100} color="var(--sf-primary)" />
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <div style={{
              width: 90, height: 168, borderRadius: 14, padding: 6,
              background: 'var(--sf-surface)', border: '1px solid var(--sf-border)',
              display: 'flex', flexDirection: 'column', gap: 4,
              boxShadow: '0 4px 12px rgba(54,30,14,0.08)',
            }}>
              {/* Mini banner */}
              <div style={{ height: 16, borderRadius: 4, background: '#F6E0AC',
                              border: '1px solid var(--sf-accent)' }} />
              {/* Mini hero */}
              <div style={{ height: 28, borderRadius: 4, background: 'var(--sf-primary)' }} />
              {/* Mini stats */}
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 16, borderRadius: 3,
                                                            background: 'var(--sf-surface-2)' }} />)}
              </div>
              {/* AI */}
              <div style={{ height: 22, borderRadius: 4, background: 'var(--sf-ai-bg)',
                              border: '1px solid var(--sf-ai-border)' }} />
              {/* Schedule */}
              <div style={{ height: 30, borderRadius: 4, background: 'var(--sf-surface-2)' }} />
              {/* Cards */}
              <div style={{ display: 'flex', gap: 2 }}>
                <div style={{ width: 16, height: 22, borderRadius: 2,
                                background: 'linear-gradient(135deg, #F6E0AC, #E9C272)' }} />
                <div style={{ width: 16, height: 22, borderRadius: 2,
                                background: 'linear-gradient(135deg, #F6E0AC, #E9C272)' }} />
                <div style={{ width: 16, height: 22, borderRadius: 2,
                                background: 'linear-gradient(135deg, #F0C9BE, #D88A75)' }} />
              </div>
              {/* Tasks */}
              <div style={{ flex: 1, borderRadius: 4, background: 'var(--sf-surface-2)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <SfAiBadge compact>Joriy ko‘rinish</SfAiBadge>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, lineHeight: 1.25 }}>
                Bosh sahifangizda <span style={{ color: 'var(--sf-primary)' }}>8 ta widget</span> faol
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--sf-muted)', lineHeight: 1.4 }}>
                Widget‘larni torting, o‘lchamini o‘zgartiring yoki yashiring. Pastdagi galereyadan yangilarini qo‘shing.
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button className="sf-btn" style={{ background: 'var(--sf-ink)', color: 'var(--sf-bg)',
                                                      fontSize: 11, padding: '6px 10px' }}>
                  Avto-tartib
                </button>
                <button className="sf-btn sf-btn--ghost" style={{ fontSize: 11, padding: '6px 10px' }}>
                  Asliga qaytarish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active widgets */}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between',
                       alignItems: 'baseline', padding: '0 4px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: 'var(--sf-muted)' }}>Faol widget‘lar · 8</div>
          <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>tortib joylashtirilg</span>
        </div>

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {active.map(w => (
            <div key={w.id} className="sf-card" style={{
              padding: 12, display: 'flex', alignItems: 'center', gap: 12,
              position: 'relative',
              boxShadow: 'var(--sf-shadow-sm)',
            }}>
              {/* Drag handle */}
              <div style={{
                width: 18, display: 'flex', flexDirection: 'column', gap: 3,
                color: 'var(--sf-muted-2)', flexShrink: 0, cursor: 'grab',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 3 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }} />
                  </div>
                ))}
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: w.color, color: '#FFFCF5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{React.cloneElement(w.icon, { size: 18 })}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{w.n}</span>
                  {w.pinned && <span style={{ color: 'var(--sf-accent)' }}>{React.cloneElement(Icons.pin, { size: 11 })}</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{w.d}</div>
              </div>
              {/* Size selector */}
              <div style={{ display: 'flex', gap: 2 }}>
                {['S', 'M', 'L'].map(s => (
                  <div key={s} style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: s === w.size ? sizeColor[s] : 'transparent',
                    color: s === w.size ? sizeFg[s] : 'var(--sf-muted)',
                    border: s === w.size ? 'none' : '1px solid var(--sf-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--sf-font-mono)', fontSize: 10, fontWeight: 700,
                  }}>{s}</div>
                ))}
              </div>
              <div style={{
                width: 36, height: 22, borderRadius: 999,
                background: w.on ? 'var(--sf-primary)' : 'var(--sf-surface-3)',
                padding: 3, flexShrink: 0,
              }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#FFFCF5',
                                transform: w.on ? 'translateX(14px)' : 'translateX(0)',
                                transition: 'transform 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Available widgets gallery */}
        <div style={{ marginTop: 24, padding: '0 4px 8px',
                       fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                       textTransform: 'uppercase', color: 'var(--sf-muted)' }}>
          Galereya · 6 ta qo‘shish mumkin
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {available.map(w => (
            <div key={w.id} className="sf-card" style={{ padding: 12, position: 'relative' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: w.color, color: '#FFFCF5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{React.cloneElement(w.icon, { size: 18 })}</div>
              <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>{w.n}</div>
              <div style={{ marginTop: 3, fontSize: 10, color: 'var(--sf-muted)' }}>{w.d}</div>
              <button style={{
                position: 'absolute', top: 8, right: 8,
                width: 22, height: 22, borderRadius: 7,
                background: 'var(--sf-primary)', color: '#FFFCF5',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{React.cloneElement(Icons.plus, { size: 14, stroke: 2.8 })}</button>
            </div>
          ))}
        </div>

        {/* Layout style */}
        <div style={{ marginTop: 22, padding: '0 4px 8px',
                       fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                       textTransform: 'uppercase', color: 'var(--sf-muted)' }}>
          Layout
        </div>
        <div className="sf-card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { id: 'grid', l: 'Grid', s: '2 ustun', on: true },
            { id: 'feed', l: 'Lenta', s: 'Yagona ustun' },
            { id: 'magazine', l: 'Magazine', s: 'Aralashtirilgan' },
          ].map((o, i, a) => (
            <div key={o.id} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
              background: o.on ? 'var(--sf-primary-soft)' : 'transparent',
              borderBottom: i < a.length - 1 ? '1px solid var(--sf-border)' : 'none',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: `2px solid ${o.on ? 'var(--sf-primary)' : 'var(--sf-border-strong)'}`,
                background: o.on ? 'var(--sf-primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{o.on && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFCF5' }} />}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: o.on ? 700 : 500 }}>{o.l}</div>
                <div style={{ fontSize: 10.5, color: 'var(--sf-muted)' }}>{o.s}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-arrange */}
        <div className="sf-ai-surface" style={{ marginTop: 18, padding: 14, borderRadius: 16 }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <SfAiBadge>Smart tartib</SfAiBadge>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--sf-ink-2)', lineHeight: 1.4 }}>
              Sizning kunlik foydalanish odatlaringizga ko‘ra widget‘larni avtomatik joylab beraman. Ertalab — Davomat va Karta, kechqurun — Vazifa va Hisobot.
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button className="sf-btn" style={{ background: 'var(--sf-ink)', color: 'var(--sf-bg)',
                                                    fontSize: 12, padding: '7px 12px' }}>
                Yoqish
              </button>
              <span style={{ fontSize: 11, color: 'var(--sf-muted)', alignSelf: 'center' }}>
                Faqat Pro tarifda
              </span>
            </div>
          </div>
        </div>
      </div>

      {platform === 'ios' ? <SfHomeIndicatorIOS /> : <SfNavBarAndroid />}
    </SfFrame>
  );
}

Object.assign(window, { EditHomeScreen });
