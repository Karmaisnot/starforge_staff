// web-tasks.jsx — Tasks page with List + Kanban Board views

function TasksPage({ onNav }) {
  const [view, setView] = React.useState('board');
  const tasks = [
    { id: 1, t: 'May oyi yakuniy hisobotini topshirish', pri: 'P1', state: 'doing', proj: 'Hisobot', projColor: 'var(--sf-primary)', dl: 'Erta · 18:00', urgent: true, mgmt: true, subs: { d: 2, t: 4 }, assigner: 'Karimova R.' },
    { id: 2, t: 'Slaydlarni yangilash · Kvadrat tenglamalar', pri: 'P2', state: 'todo', proj: 'Materiallar', projColor: 'var(--sf-accent)', dl: 'Pen · 23:59', subs: { d: 0, t: 3 }, assigner: 'Men' },
    { id: 3, t: 'So‘rovnoma · AI sifat baholash', pri: 'P2', state: 'doing', proj: 'So‘rovnoma', projColor: 'var(--sf-ai)', dl: '22.05', mgmt: true, subs: { d: 1, t: 1 }, assigner: 'Metodist' },
    { id: 4, t: 'Olimpiada tayyorgarligi · 11-B', pri: 'P3', state: 'review', proj: 'Tayyorlov', projColor: 'var(--sf-ink-2)', dl: '25.05', mgmt: true, assigner: 'Yusupova N.' },
    { id: 5, t: 'Yangi karta nomlarini ko‘rib chiqish', pri: 'P3', state: 'done', proj: 'Markaz', projColor: 'var(--sf-success)', dl: '18.05', mgmt: true, assigner: 'Direktor' },
    { id: 6, t: 'Ota-onaga · Eshmatov O. holati', pri: 'P2', state: 'todo', proj: 'O‘quvchilar', projColor: 'var(--sf-danger)', dl: 'Pen', assigner: 'Men' },
    { id: 7, t: 'Dars rejasi · Logarifmlar', pri: 'P3', state: 'doing', proj: 'Materiallar', projColor: 'var(--sf-accent)', dl: '23.05', assigner: 'Men', subs: { d: 1, t: 5 } },
    { id: 8, t: '9-B uchun konsultatsiya rejasi', pri: 'P3', state: 'review', proj: 'Konsult.', projColor: 'var(--sf-primary)', dl: '24.05', assigner: 'Men' },
  ];

  const columns = [
    { id: 'todo', l: 'Boshlanmagan', c: 'var(--sf-muted)' },
    { id: 'doing', l: 'Bajarilmoqda', c: 'var(--sf-primary)' },
    { id: 'review', l: 'Tekshirishda', c: 'var(--sf-accent)' },
    { id: 'done', l: 'Tugatildi', c: 'var(--sf-success)' },
  ];

  return (
    <>
      <WebPageHeader
        title="Vazifalar"
        subtitle="3 bugun · 4 ta boshqaruvdan · 12 ta umumiy"
        right={
          <>
            <div className="web-view-switcher">
              <button data-on={view === 'list' ? '1' : '0'} onClick={() => setView('list')}>
                {React.cloneElement(Icons.filter, { size: 13 })} Ro‘yxat
              </button>
              <button data-on={view === 'board' ? '1' : '0'} onClick={() => setView('board')}>
                {React.cloneElement(Icons.cohort, { size: 13 })} Doska
              </button>
              <button>
                {React.cloneElement(Icons.cal, { size: 13 })} Taqvim
              </button>
            </div>
            <button className="web-btn web-btn-primary">{React.cloneElement(Icons.plus, { size: 14 })} Yangi vazifa</button>
          </>
        }
      />

      {/* Filter strip */}
      <div className="web-filter-strip">
        {[
          { l: 'Hammasi', n: 12, on: true },
          { l: 'Mening', n: 7 },
          { l: 'Boshqaruvdan', n: 5 },
          { l: 'Shoshilinch', n: 1 },
          { l: 'Tugatildi', n: 8 },
        ].map((f, i) => (
          <div key={i} className={`web-filter-chip ${f.on ? 'on' : ''}`}>
            {f.l} <span className="web-filter-n">{f.n}</span>
          </div>
        ))}
        <span style={{ flex: 1 }} />
        <div className="web-filter-chip">{React.cloneElement(Icons.filter, { size: 12 })} Loyiha</div>
        <div className="web-filter-chip">{React.cloneElement(Icons.filter, { size: 12 })} Prioritet</div>
      </div>

      {view === 'board' && <KanbanBoard tasks={tasks} columns={columns} />}
      {view === 'list' && <TaskList tasks={tasks} columns={columns} />}

      <style>{tasksStyles}</style>
    </>
  );
}

function KanbanBoard({ tasks, columns }) {
  return (
    <div className="web-kanban">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.state === col.id);
        return (
          <div key={col.id} className="web-kanban-col">
            <div className="web-kanban-h">
              <span className="web-kanban-dot" style={{ background: col.c }} />
              <span className="web-kanban-name">{col.l}</span>
              <span className="web-kanban-count">{colTasks.length}</span>
              <span style={{ flex: 1 }} />
              <button className="web-icon-btn">{React.cloneElement(Icons.plus, { size: 14 })}</button>
            </div>
            <div className="web-kanban-cards">
              {colTasks.map(task => (
                <div key={task.id} className="web-task-card">
                  <div className="web-task-rail-v" style={{ background: task.urgent ? 'var(--sf-danger)' : task.projColor }} />
                  <div className="web-task-card-inner">
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {task.mgmt && <WebChip tone="ink">BOSHQ.</WebChip>}
                      <WebChip>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: task.projColor,
                                        display: 'inline-block', marginRight: 4 }} />
                        {task.proj}
                      </WebChip>
                      <span style={{ flex: 1 }} />
                      <span className="sf-mono" style={{ fontSize: 10, fontWeight: 700,
                        color: task.pri === 'P1' ? 'var(--sf-danger)' :
                               task.pri === 'P2' ? 'var(--sf-warn)' : 'var(--sf-muted)' }}>
                        {task.pri}
                      </span>
                    </div>
                    <div className={`web-task-card-t ${task.state === 'done' ? 'done' : ''}`}>{task.t}</div>
                    <div className="web-task-card-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <SfAvatar name={task.assigner} size={18} />
                        <span>{task.assigner}</span>
                      </span>
                      <span style={{ flex: 1 }} />
                      {task.subs && (
                        <span className="sf-mono web-task-subs">
                          ✓ {task.subs.d}/{task.subs.t}
                        </span>
                      )}
                      <span className="sf-mono" style={{
                        color: task.urgent ? 'var(--sf-danger)' :
                                task.state === 'done' ? 'var(--sf-muted)' :
                                'var(--sf-ink-2)',
                        fontWeight: task.urgent ? 700 : 500,
                      }}>{task.dl}</span>
                    </div>
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="web-kanban-empty">
                  Vazifa yo‘q
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskList({ tasks, columns }) {
  return (
    <WebCard padded={false}>
      <div className="web-table-h" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.6fr 0.8fr' }}>
        <div>Vazifa</div>
        <div>Loyiha</div>
        <div>Bergan</div>
        <div>Muddat</div>
        <div>Pri</div>
        <div>Holat</div>
      </div>
      {tasks.map(task => {
        const col = columns.find(c => c.id === task.state);
        return (
          <div key={task.id} className="web-table-row" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.6fr 0.8fr' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
              <div className="web-task-check" style={{
                background: task.state === 'done' ? 'var(--sf-success)' : 'transparent',
                borderColor: task.state === 'done' ? 'var(--sf-success)' : 'var(--sf-border-strong)',
              }}>
                {task.state === 'done' && React.cloneElement(Icons.check, { size: 12, stroke: 3, style: { color: '#FFFCF5' } })}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {task.mgmt && <WebChip tone="ink">BOSHQ.</WebChip>}
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    textDecoration: task.state === 'done' ? 'line-through' : 'none',
                    color: task.state === 'done' ? 'var(--sf-muted)' : 'var(--sf-ink)',
                  }}>{task.t}</span>
                </div>
              </div>
            </div>
            <div>
              <WebChip>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: task.projColor,
                                display: 'inline-block', marginRight: 4 }} />
                {task.proj}
              </WebChip>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <SfAvatar name={task.assigner} size={20} />
              <span>{task.assigner}</span>
            </div>
            <div>
              <span className="sf-mono" style={{
                fontSize: 12, color: task.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)',
                fontWeight: task.urgent ? 700 : 500,
              }}>{task.dl}</span>
            </div>
            <div>
              <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700,
                color: task.pri === 'P1' ? 'var(--sf-danger)' :
                       task.pri === 'P2' ? 'var(--sf-warn)' : 'var(--sf-muted)' }}>
                {task.pri}
              </span>
            </div>
            <div>
              <WebChip tone={
                task.state === 'doing' ? 'primary' :
                task.state === 'review' ? 'accent' :
                task.state === 'done' ? 'success' : 'neutral'
              }>{col.l}</WebChip>
            </div>
          </div>
        );
      })}
    </WebCard>
  );
}

const tasksStyles = `
.web-view-switcher {
  display: inline-flex; padding: 3px;
  background: var(--sf-surface-2); border-radius: 10px;
}
.web-view-switcher button {
  background: transparent; border: none; cursor: pointer;
  padding: 6px 12px; border-radius: 8px;
  font-family: inherit; font-size: 12px; font-weight: 600;
  color: var(--sf-muted);
  display: inline-flex; align-items: center; gap: 5px;
}
.web-view-switcher button[data-on="1"] {
  background: var(--sf-surface); color: var(--sf-ink);
  box-shadow: var(--sf-shadow-sm);
}

.web-filter-strip {
  display: flex; gap: 6px; padding: 0 0 14px;
  overflow-x: auto;
  align-items: center;
}
.web-filter-chip {
  padding: 6px 12px; border-radius: 999px; cursor: pointer;
  font-size: 12px; font-weight: 600; color: var(--sf-muted);
  background: transparent; border: 1px solid var(--sf-border);
  display: inline-flex; align-items: center; gap: 5px;
  white-space: nowrap;
  transition: all 0.15s;
}
.web-filter-chip:hover { color: var(--sf-ink); border-color: var(--sf-border-strong); }
.web-filter-chip.on { background: var(--sf-ink); color: var(--sf-bg); border-color: transparent; }
.web-filter-n {
  font-family: var(--sf-font-mono); font-size: 10px; opacity: 0.7; font-weight: 700;
}

/* Kanban */
.web-kanban {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
@media (max-width: 1100px) { .web-kanban { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .web-kanban { grid-template-columns: 1fr; } }

.web-kanban-col {
  background: var(--sf-surface-2);
  border-radius: 14px;
  padding: 12px;
  min-height: 200px;
}
.web-kanban-h {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 6px 12px;
}
.web-kanban-dot { width: 8px; height: 8px; border-radius: 50%; }
.web-kanban-name { font-size: 12.5px; font-weight: 700; letter-spacing: -0.005em; }
.web-kanban-count {
  font-family: var(--sf-font-mono); font-size: 11px; font-weight: 700;
  color: var(--sf-muted);
  padding: 2px 6px; border-radius: 5px; background: var(--sf-surface);
}

.web-kanban-cards { display: flex; flex-direction: column; gap: 8px; }
.web-task-card {
  position: relative; display: flex;
  background: var(--sf-surface); border: 1px solid var(--sf-border);
  border-radius: 10px; overflow: hidden;
  transition: transform 0.1s, box-shadow 0.15s;
  cursor: pointer;
}
.web-task-card:hover { transform: translateY(-1px); box-shadow: var(--sf-shadow-md); }
.web-task-rail-v { width: 3px; flex-shrink: 0; }
.web-task-card-inner { flex: 1; padding: 10px 12px; }
.web-task-card-t {
  margin-top: 8px; font-size: 13px; font-weight: 600; line-height: 1.3;
}
.web-task-card-t.done { text-decoration: line-through; color: var(--sf-muted); }
.web-task-card-meta {
  margin-top: 10px; display: flex; gap: 8px; align-items: center;
  font-size: 10.5px; color: var(--sf-muted);
}
.web-task-subs {
  padding: 1px 6px; border-radius: 4px;
  background: var(--sf-success-soft); color: var(--sf-success);
  font-weight: 700;
}
.web-kanban-empty {
  padding: 16px; text-align: center;
  font-size: 11px; color: var(--sf-muted);
  background: var(--sf-surface);
  border: 1px dashed var(--sf-border);
  border-radius: 10px;
}
.web-task-check {
  width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
  border: 1.5px solid var(--sf-border-strong);
  display: flex; align-items: center; justify-content: center;
}
`;

Object.assign(window, { TasksPage });
