// biz-enroll.jsx — Enrollment funnel + Placement Test studio (vision §1, §8).
// Fully interactive: build/assign a test, run it timed+locked, AI auto-score →
// level result → AI group suggestion → place (with toggleable manager-approval
// gate). Registers page id 'enroll'. Uses admin-common primitives + sfToast.

const EZ = (m, o) => window.sfToast && window.sfToast(m, o);

function EnrollPage({ role }) {
  // stage: funnel | build | test | result
  const [stage, setStage] = React.useState('funnel');
  const [gate, setGate] = React.useState(true); // manager-approval gate (dynamic)
  const [candidate, setCandidate] = React.useState(null);
  // CEO oversees only — cannot personally run a placement test (vision §8:
  // test-taking is a Reception/Manager action, on mobile the phone is handed
  // to the student). CEO sees the funnel + results read-only.
  const canRun = role !== 'ceo';
  const startTest = (c) => {
    if (!canRun) { EZ('CEO joylashuv testini o‘tkaza olmaydi', { tone: 'warn', sub: 'Bu qabul / manager huquqi' }); return; }
    setCandidate(c); setStage('test');
  };

  return (
    <>
      <SecH eyebrow="Qabul · Joylashuv testi" title={
        stage === 'funnel' ? 'Yangi o‘quvchi qabuli' :
        stage === 'build' ? 'Test konstruktori' :
        stage === 'test' ? 'Joylashuv testi · jonli' : 'Natija va joylashtirish'
      } sub={stage === 'funnel' ? 'Lid → test → AI baho → guruh tavsiyasi → joylashtirish' : candidate ? candidate.name : 'Demo Akademiya'}
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="ez-gate" onClick={() => { setGate(!gate); EZ(gate ? 'Avtomatik joylashtirish yoqildi' : 'Manager tasdig‘i talab qilinadi', { tone: gate ? 'warn' : 'success' }); }}>
              <span style={{ fontSize: 11.5, fontWeight: 600 }}>Manager tasdig‘i</span>
              <div className={'sp-toggle' + (gate ? ' on' : '')}><i /></div>
            </div>
            {stage !== 'funnel' && <button className="ez-btn ghost" onClick={() => setStage('funnel')}>← Voronka</button>}
            {stage === 'funnel' && <button className="ez-btn primary" onClick={() => setStage('build')}>{React.cloneElement(Icons.plus, { size: 14 })} Test yaratish</button>}
          </div>
        } />

      {stage === 'funnel' && <EnrollFunnel canRun={canRun} onStart={startTest} onBuild={() => setStage('build')} />}
      {stage === 'build' && <TestBuilder onAssign={() => { EZ('Test qabulchiga biriktirildi', { tone: 'success', sub: 'Mobil ilovada ochiladi' }); setStage('funnel'); }} />}
      {stage === 'test' && <TestRunner candidate={candidate} onDone={() => setStage('result')} />}
      {stage === 'result' && <TestResult candidate={candidate} gate={gate} onPlace={() => { EZ(gate ? 'Joylashtirish manager tasdig‘iga yuborildi' : 'O‘quvchi guruhga joylashtirildi', { tone: 'success' }); setStage('funnel'); }} />}
      <style>{enrollStyles}</style>
    </>
  );
}

// ── Funnel board ────────────────────────────────────────────
function EnrollFunnel({ onStart, onBuild, canRun }) {
  const cols = [
    { id: 'lead', l: 'Yangi lid', c: 'var(--sf-primary)', items: [{ name: 'Olimov Aziz', src: 'Instagram', age: 14 }, { name: 'Sobirova Nigina', src: 'Tavsiya', age: 16 }] },
    { id: 'test', l: 'Test kutilmoqda', c: 'var(--sf-accent)', items: [{ name: 'Karimov Bek', src: 'Telegram', age: 15, ready: true }] },
    { id: 'scored', l: 'Baholandi', c: 'var(--sf-warn)', items: [{ name: 'Yusupova Dilnoza', src: 'Sayt', age: 13, level: 'B1', score: 72 }] },
    { id: 'placed', l: 'Joylashtirildi', c: 'var(--sf-success)', items: [{ name: 'Tosheva Madina', src: 'Sayt', age: 17, level: 'B2', group: '9-B' }] },
  ];
  const stats = [['Bu oy lidlar', '34', 'var(--sf-primary)'], ['Test topshirgan', '21', 'var(--sf-accent)'], ['Joylashtirildi', '12', 'var(--sf-success)'], ['Konversiya', '35%', 'var(--sf-ink)']];
  return (
    <>
      <div className="ez-stats">{stats.map((s, i) => <div key={i} className="ez-stat"><div className="sf-mono ez-stat-v" style={{ color: s[2] }}>{s[1]}</div><div className="ez-stat-l">{s[0]}</div></div>)}</div>
      <div className="ez-board">
        {cols.map(col => (
          <div key={col.id} className="ez-col">
            <div className="ez-col-h"><span className="ez-dot" style={{ background: col.c }} /><span className="ez-col-l">{col.l}</span><span className="ez-col-n">{col.items.length}</span></div>
            {col.items.map((it, j) => (
              <div key={j} className="ez-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SfAvatar name={it.name} size={26} /><div style={{ flex: 1, minWidth: 0 }}><div className="ez-card-n">{it.name}</div><div className="ez-card-s">{it.age} yosh · {it.src}</div></div></div>
                {it.level && <div style={{ marginTop: 8, display: 'flex', gap: 5 }}><Pill tone="primary">{it.level}</Pill>{it.score && <Pill tone="accent">{it.score} ball</Pill>}{it.group && <Pill tone="success">{it.group}</Pill>}</div>}
                <div className="ez-card-acts">
                  {col.id === 'lead' && <button className="ez-mini" onClick={() => onStart(it)}>{canRun ? 'Test berish ›' : 'Mobil · qabul'}</button>}
                  {col.id === 'test' && it.ready && <button className={'ez-mini' + (canRun ? ' hot' : '')} onClick={() => onStart(it)}>{canRun ? 'Testni boshlash ›' : 'Mobil · qabul'}</button>}
                  {col.id === 'scored' && <button className="ez-mini" onClick={() => onStart(it)}>Natijani ko‘rish ›</button>}
                  {col.id === 'placed' && <span className="ez-done">✓ {it.group} guruhida</span>}
                </div>
              </div>
            ))}
            {col.id === 'lead' && <button className="ez-add" onClick={() => EZ('Yangi lid formasi', { tone: 'info' })}>+ Lid qo‘shish</button>}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Test builder ────────────────────────────────────────────
function TestBuilder({ onAssign }) {
  const QTYPES = [['truefalse', 'To‘g‘ri / Noto‘g‘ri', 'default'], ['multiple', 'Ko‘p tanlov'], ['writing', 'Yozma'], ['reading', 'O‘qish'], ['listening', 'Tinglash'], ['speaking', 'Gapirish'], ['vocab', 'Lug‘at']];
  const [qs, setQs] = React.useState([
    { t: 'I ___ to school every day.', type: 'multiple', opts: ['go', 'goes', 'going'], a: 0 },
    { t: '"She have a car." — gramatik to‘g‘rimi?', type: 'truefalse', a: 1 },
  ]);
  const [scorer, setScorer] = React.useState('ai'); // ai | manager
  const addQ = (type) => { setQs(q => [...q, { t: 'Yangi savol...', type, opts: type === 'multiple' ? ['', '', ''] : null, a: 0 }]); EZ('Savol qo‘shildi · ' + (QTYPES.find(x => x[0] === type)?.[1] || type), { tone: 'success' }); };
  const aiGen = () => EZ('AI 10 ta savol tayyorladi', { tone: 'info', sub: 'Manager tasdig‘ini kutmoqda' });
  return (
    <div className="ez-build">
      <div className="ez-build-main">
        <ACard title={'Savollar · ' + qs.length} action={<button className="ez-mini" onClick={aiGen}>{React.cloneElement(Icons.ai, { size: 12 })} AI yaratsin</button>}>
          {qs.map((q, i) => (
            <div key={i} className="ez-q">
              <div className="ez-q-top"><span className="ez-q-n">{i + 1}</span><Pill tone="neutral">{QTYPES.find(x => x[0] === q.type)?.[1]}</Pill><span style={{ flex: 1 }} /><button className="ez-x" onClick={() => { setQs(qs.filter((_, j) => j !== i)); EZ('Savol o‘chirildi'); }}>{React.cloneElement(Icons.x, { size: 13 })}</button></div>
              <div className="ez-q-t">{q.t}</div>
              {q.type === 'multiple' && <div className="ez-q-opts">{q.opts.map((o, k) => <span key={k} className={'ez-opt' + (k === q.a ? ' ok' : '')}>{o || '—'}{k === q.a && ' ✓'}</span>)}</div>}
              {q.type === 'truefalse' && <div className="ez-q-opts"><span className={'ez-opt' + (q.a === 0 ? ' ok' : '')}>To‘g‘ri</span><span className={'ez-opt' + (q.a === 1 ? ' ok' : '')}>Noto‘g‘ri</span></div>}
            </div>
          ))}
        </ACard>
        <div className="ez-addbar">
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--sf-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Savol turi qo‘shish</span>
          <div className="ez-types">{QTYPES.map(t => <button key={t[0]} className="ez-type" onClick={() => addQ(t[0])}>{t[1]}{t[2] === 'default' && <span className="ez-def">default</span>}</button>)}</div>
        </div>
      </div>
      <div className="ez-build-side">
        <ACard title="Test sozlamalari">
          <Field l="Nomi" v="Ingliz tili · joylashuv" />
          <Field l="Vaqt limiti" v="30 daqiqa" />
          <Field l="O‘tish bali" v="50%" />
          <div className="ez-set-row"><span>Telefon bloklanadi</span><div className="sp-toggle on"><i /></div></div>
          <div className="ez-set-row"><span>Faqat mobil ilova</span><div className="sp-toggle on"><i /></div></div>
        </ACard>
        <ACard title="Kim baholaydi">
          <div className="ez-scorer">
            {[['ai', 'AI avto-baho', 'Soniyalarda · band score'], ['manager', 'Manager', 'Qo‘lda tekshirish']].map(s => (
              <button key={s[0]} className={'ez-scorer-b' + (scorer === s[0] ? ' on' : '')} onClick={() => setScorer(s[0])}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s[1]}</div><div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{s[2]}</div>
                {scorer === s[0] && <span className="ez-scorer-ck">{React.cloneElement(Icons.check, { size: 14 })}</span>}
              </button>
            ))}
          </div>
        </ACard>
        <button className="ez-btn primary block" onClick={onAssign}>{React.cloneElement(Icons.send, { size: 14 })} Qabulchiga biriktirish</button>
        <div className="ez-note">{React.cloneElement(Icons.shield, { size: 13 })} Test tenant qoidasi bo‘yicha faqat mobil ilovada ochiladi.</div>
      </div>
    </div>
  );
}

// ── Test runner (timed, locked) ─────────────────────────────
function TestRunner({ candidate, onDone }) {
  const Qs = [
    { t: 'Choose the correct form: "I ___ to school every day."', type: 'multiple', opts: ['go', 'goes', 'going', 'gone'] },
    { t: '"She have a car." — is this grammatically correct?', type: 'truefalse', opts: ['Correct', 'Incorrect'] },
    { t: 'Choose the synonym of "happy".', type: 'multiple', opts: ['sad', 'joyful', 'angry', 'tired'] },
    { t: 'Listen and choose what you heard.', type: 'multiple', opts: ['market', 'marker', 'marble', 'martyr'] },
  ];
  const [i, setI] = React.useState(0);
  const [ans, setAns] = React.useState({});
  const [t, setT] = React.useState(28 * 60 + 14);
  React.useEffect(() => { const id = setInterval(() => setT(x => Math.max(0, x - 1)), 1000); return () => clearInterval(id); }, []);
  const mm = String(Math.floor(t / 60)).padStart(2, '0'), ss = String(t % 60).padStart(2, '0');
  const pick = (k) => { setAns(a => ({ ...a, [i]: k })); };
  const next = () => { if (i < Qs.length - 1) setI(i + 1); else { EZ('Test topshirildi · AI baholamoqda...', { tone: 'info' }); setTimeout(onDone, 600); } };
  const q = Qs[i];
  return (
    <div className="ez-runner">
      <div className="ez-run-bar">
        <div className="ez-run-prog"><div style={{ width: `${((i + 1) / Qs.length) * 100}%` }} /></div>
        <div className="ez-run-meta"><span className="sf-mono">{i + 1} / {Qs.length}</span><span className="ez-timer"><span className="ez-timer-dot" />{mm}:{ss}</span></div>
      </div>
      <div className="ez-run-lock">{React.cloneElement(Icons.shield, { size: 13 })} Qulflangan rejim · telefon boshqa ilovalarni ochmaydi</div>
      <div className="ez-run-card">
        <div className="ez-run-qn">Savol {i + 1}</div>
        <div className="ez-run-q">{q.t}</div>
        <div className="ez-run-opts">
          {q.opts.map((o, k) => (
            <button key={k} className={'ez-run-opt' + (ans[i] === k ? ' on' : '')} onClick={() => pick(k)}>
              <span className="ez-run-key">{String.fromCharCode(65 + k)}</span>{o}
              {ans[i] === k && <span className="ez-run-ck">{React.cloneElement(Icons.check, { size: 15 })}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="ez-run-foot">
        <button className="ez-btn ghost" disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>← Oldingi</button>
        <button className="ez-btn primary" onClick={next}>{i < Qs.length - 1 ? 'Keyingi →' : 'Yakunlash'}</button>
      </div>
    </div>
  );
}

// ── Result + AI placement ───────────────────────────────────
function TestResult({ candidate, gate, onPlace }) {
  const [grp, setGrp] = React.useState(0);
  const sugg = [
    { n: 'Pre-Intermediate · B1', t: 'Aziz Tursunov', fit: 94, slots: '3 bo‘sh', best: true },
    { n: 'Intermediate · B1+', t: 'Malika Yusupova', fit: 81, slots: '1 bo‘sh' },
    { n: 'Elementary · A2', t: 'Bobur Aliyev', fit: 62, slots: '5 bo‘sh' },
  ];
  return (
    <div className="ez-result">
      <div className="ez-res-main">
        <div className="ez-res-hero">
          <div className="ez-res-score"><div className="sf-mono ez-res-num">72</div><div className="ez-res-num-l">/ 100 ball</div></div>
          <div style={{ flex: 1 }}>
            <div className="ez-res-lvl">Daraja: <span style={{ fontFamily: 'var(--sf-font-display)', fontStyle: 'italic' }}>B1 · Pre-Intermediate</span></div>
            <div className="ez-res-sub">{candidate ? candidate.name : 'O‘quvchi'} · AI avtomatik baholadi · 4 savol</div>
            <div className="ez-res-bands">
              {[['Grammar', 78], ['Vocabulary', 71], ['Reading', 80], ['Listening', 58]].map((b, i) => (
                <div key={i} className="ez-band"><div className="ez-band-h"><span>{b[0]}</span><span className="sf-mono">{b[1]}%</span></div><div className="ez-band-bar"><div style={{ width: b[1] + '%', background: b[1] >= 75 ? 'var(--sf-success)' : b[1] >= 60 ? 'var(--sf-warn)' : 'var(--sf-danger)' }} /></div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="ez-ai">
          <SfAiBadge>AI tavsiya</SfAiBadge>
          <div className="ez-ai-q">“Listening 58% — eng zaif tomoni. B1 guruhi mos, lekin tinglash mashqlariga e'tibor bering. A2 ga tushirish shart emas.”</div>
        </div>
      </div>
      <div className="ez-res-side">
        <ACard title="AI guruh tavsiyasi">
          {sugg.map((g, i) => (
            <button key={i} className={'ez-grp' + (grp === i ? ' on' : '')} onClick={() => setGrp(i)}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 13, fontWeight: 700 }}>{g.n}</span>{g.best && <Pill tone="success">Eng mos</Pill>}</div>
                <div style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{g.t} · {g.slots}</div>
              </div>
              <div className="ez-fit"><div className="sf-mono" style={{ fontSize: 15, fontWeight: 700, color: g.fit >= 90 ? 'var(--sf-success)' : g.fit >= 75 ? 'var(--sf-warn)' : 'var(--sf-muted)' }}>{g.fit}%</div><div style={{ fontSize: 8.5, color: 'var(--sf-muted)', textTransform: 'uppercase' }}>moslik</div></div>
            </button>
          ))}
        </ACard>
        <div className="ez-place-opts">
          <button className="ez-btn primary block" onClick={onPlace}>{React.cloneElement(Icons.check, { size: 14 })} {gate ? 'Tasdiqqa yuborish' : 'Guruhga joylashtirish'}</button>
          <button className="ez-btn soft block" onClick={() => EZ('Guruhsiz saqlandi · keyinroq joylashtiriladi', { tone: 'info' })}>Guruhsiz qoldirish</button>
          <button className="ez-btn ghost block" onClick={() => EZ('O‘quvchi ketdi deb belgilandi', { tone: 'default' })}>Ro‘yxatdan o‘tmadi</button>
        </div>
        {gate && <div className="ez-note">{React.cloneElement(Icons.shield, { size: 13 })} Tasdiq talab qilinadi — manager joylashtirishni ko‘rib chiqadi.</div>}
      </div>
    </div>
  );
}

// ── tiny atoms ──────────────────────────────────────────────
function ACard({ title, action, children }) {
  return <div className="ez-acard"><div className="ez-acard-h"><h3>{title}</h3>{action}</div><div className="ez-acard-b">{children}</div></div>;
}
function Field({ l, v }) {
  return <div className="ez-field"><span className="ez-field-l">{l}</span><span className="ez-field-v">{v} <span style={{ color: 'var(--sf-muted)' }}>✎</span></span></div>;
}

const enrollStyles = `
.ez-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 15px; border-radius: 10px; font-family: inherit; font-weight: 600; font-size: 13px; border: 1px solid transparent; cursor: pointer; transition: transform .08s; }
.ez-btn:active { transform: scale(.96); } .ez-btn:disabled { opacity: .4; cursor: default; }
.ez-btn.primary { background: var(--sf-primary); color: #fff; } .ez-btn.soft { background: var(--sf-surface-2); color: var(--sf-ink); border-color: var(--sf-border); }
.ez-btn.ghost { background: transparent; color: var(--sf-ink-2); border-color: var(--sf-border-strong); } .ez-btn.block { width: 100%; justify-content: center; }
.ez-gate { display: flex; align-items: center; gap: 8px; padding: 6px 11px; background: var(--sf-surface-2); border: 1px solid var(--sf-border); border-radius: 10px; cursor: pointer; }
.ez-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
@media (max-width: 700px) { .ez-stats { grid-template-columns: 1fr 1fr; } }
.ez-stat { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; padding: 14px 16px; }
.ez-stat-v { font-size: 26px; font-weight: 700; line-height: 1; } .ez-stat-l { font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--sf-muted); font-weight: 600; margin-top: 6px; }
.ez-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 1000px) { .ez-board { grid-template-columns: 1fr 1fr; } }
.ez-col { background: var(--sf-surface-2); border-radius: 13px; padding: 11px; }
.ez-col-h { display: flex; align-items: center; gap: 8px; padding: 4px 6px 11px; }
.ez-dot { width: 8px; height: 8px; border-radius: 50%; } .ez-col-l { font-size: 12.5px; font-weight: 700; } .ez-col-n { margin-left: auto; font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700; color: var(--sf-muted); }
.ez-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 11px; padding: 11px; margin-bottom: 8px; }
.ez-card-n { font-size: 12.5px; font-weight: 700; } .ez-card-s { font-size: 10.5px; color: var(--sf-muted); }
.ez-card-acts { margin-top: 9px; }
.ez-mini { padding: 5px 11px; border-radius: 8px; border: 1px solid var(--sf-border); background: var(--sf-surface-2); cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 700; color: var(--sf-primary); }
.ez-mini.hot { background: var(--sf-primary); color: #fff; border-color: transparent; }
.ez-done { font-size: 11px; font-weight: 700; color: var(--sf-success); } .ez-add { width: 100%; padding: 9px; border-radius: 9px; border: 1px dashed var(--sf-border-strong); background: transparent; color: var(--sf-muted); font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
.ez-build { display: grid; grid-template-columns: 1fr 320px; gap: 16px; } @media (max-width: 1000px) { .ez-build { grid-template-columns: 1fr; } }
.ez-build-side { display: flex; flex-direction: column; gap: 12px; }
.ez-acard { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 14px; overflow: hidden; }
.ez-acard-h { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; border-bottom: 1px solid var(--sf-border); } .ez-acard-h h3 { margin: 0; font-size: 13.5px; font-weight: 700; }
.ez-acard-b { padding: 14px 16px; }
.ez-q { padding: 12px; border: 1px solid var(--sf-border); border-radius: 11px; margin-bottom: 9px; }
.ez-q-top { display: flex; align-items: center; gap: 8px; } .ez-q-n { width: 22px; height: 22px; border-radius: 7px; background: var(--sf-primary); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.ez-x { margin-left: auto; width: 24px; height: 24px; border-radius: 7px; border: none; background: var(--sf-surface-2); color: var(--sf-muted); cursor: pointer; }
.ez-q-t { font-size: 13px; font-weight: 600; margin: 9px 0; } .ez-q-opts { display: flex; flex-wrap: wrap; gap: 6px; }
.ez-opt { padding: 4px 11px; border-radius: 8px; background: var(--sf-surface-2); font-size: 11.5px; font-weight: 600; color: var(--sf-ink-2); } .ez-opt.ok { background: var(--sf-success-soft); color: var(--sf-success); }
.ez-addbar { margin-top: 12px; } .ez-types { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 9px; }
.ez-type { position: relative; padding: 9px 14px; border-radius: 10px; border: 1px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--sf-ink); }
.ez-type:hover { border-color: var(--sf-primary); color: var(--sf-primary); }
.ez-def { margin-left: 6px; font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: var(--sf-success); background: var(--sf-success-soft); padding: 1px 5px; border-radius: 4px; }
.ez-field { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed var(--sf-border); }
.ez-field-l { font-size: 12px; color: var(--sf-muted); } .ez-field-v { font-size: 12.5px; font-weight: 600; cursor: pointer; }
.ez-set-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 12.5px; }
.ez-scorer { display: flex; flex-direction: column; gap: 8px; } .ez-scorer-b { position: relative; text-align: left; padding: 11px 13px; border-radius: 11px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; }
.ez-scorer-b.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); } .ez-scorer-ck { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: var(--sf-primary); }
.ez-note { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--sf-muted); padding: 4px 2px; }
.ez-runner { max-width: 720px; margin: 0 auto; }
.ez-run-bar { margin-bottom: 10px; } .ez-run-prog { height: 6px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; } .ez-run-prog > div { height: 100%; background: var(--sf-primary); transition: width .3s; }
.ez-run-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.ez-timer { display: inline-flex; align-items: center; gap: 6px; font-family: var(--sf-font-mono); font-size: 15px; font-weight: 700; color: var(--sf-danger); }
.ez-timer-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sf-danger); animation: ezBlink 1s steps(2) infinite; } @keyframes ezBlink { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }
.ez-run-lock { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--sf-muted); background: var(--sf-surface-2); padding: 8px 12px; border-radius: 9px; margin-bottom: 14px; }
.ez-run-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; padding: 22px; }
.ez-run-qn { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--sf-muted); }
.ez-run-q { font-size: 19px; font-weight: 700; line-height: 1.35; margin: 8px 0 18px; }
.ez-run-opts { display: flex; flex-direction: column; gap: 9px; }
.ez-run-opt { position: relative; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 600; color: var(--sf-ink); text-align: left; transition: all .12s; }
.ez-run-opt:hover { border-color: var(--sf-border-strong); } .ez-run-opt.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); }
.ez-run-key { width: 26px; height: 26px; border-radius: 8px; background: var(--sf-surface-2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; } .ez-run-opt.on .ez-run-key { background: var(--sf-primary); color: #fff; }
.ez-run-ck { position: absolute; right: 16px; color: var(--sf-primary); } .ez-run-foot { display: flex; justify-content: space-between; margin-top: 16px; }
.ez-result { display: grid; grid-template-columns: 1fr 340px; gap: 16px; } @media (max-width: 1000px) { .ez-result { grid-template-columns: 1fr; } }
.ez-res-main { display: flex; flex-direction: column; gap: 14px; }
.ez-res-hero { display: flex; gap: 20px; background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 16px; padding: 20px; align-items: center; flex-wrap: wrap; }
.ez-res-score { text-align: center; flex-shrink: 0; } .ez-res-num { font-size: 52px; font-weight: 800; line-height: 1; color: var(--sf-primary); } .ez-res-num-l { font-size: 11px; color: var(--sf-muted); font-weight: 600; }
.ez-res-lvl { font-size: 19px; font-weight: 800; } .ez-res-sub { font-size: 12px; color: var(--sf-muted); margin-top: 2px; }
.ez-res-bands { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 14px; }
.ez-band-h { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 4px; } .ez-band-bar { height: 6px; border-radius: 4px; background: var(--sf-surface-2); overflow: hidden; } .ez-band-bar > div { height: 100%; }
.ez-ai { background: var(--sf-ai-bg); border: 1px solid var(--sf-ai-border); border-radius: 14px; padding: 16px; } .ez-ai-q { font-family: var(--sf-font-display); font-style: italic; font-size: 15.5px; line-height: 1.4; margin-top: 9px; color: var(--sf-ink); }
.ez-res-side { display: flex; flex-direction: column; gap: 12px; }
.ez-grp { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px; border-radius: 11px; border: 1.5px solid var(--sf-border); background: var(--sf-surface); cursor: pointer; margin-bottom: 8px; }
.ez-grp.on { border-color: var(--sf-primary); background: var(--sf-primary-soft); } .ez-fit { text-align: center; flex-shrink: 0; }
.ez-place-opts { display: flex; flex-direction: column; gap: 8px; }
`;

Object.assign(window, { EnrollPage });
