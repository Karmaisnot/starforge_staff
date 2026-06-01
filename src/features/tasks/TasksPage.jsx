import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Avatar, Button, Card, Chip, FilterChip, Icon, Modal, Segmented, ViewSwitcher } from '@/ui';
import { priorityColor, stateTone } from '@/domain/models/task.js';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './tasks.module.css';

// Filter predicates key off stable, non-localized fields (never display strings).
const PREDICATES = {
  all: () => true,
  mine: (t) => t.mine === true,
  mgmt: (t) => t.fromMgmt,
  urgent: (t) => t.urgent,
  done: (t) => t.state === 'done',
};

function TaskCard({ task, onToggle }) {
  const { t } = useT();
  return (
    <div className={styles.taskCard} onClick={() => onToggle(task)}>
      <div
        className={styles.taskRailV}
        style={{ background: task.urgent ? 'var(--sf-danger)' : task.projectColor }}
      />
      <div className={styles.taskCardInner}>
        <div className={styles.taskCardTop}>
          {task.fromMgmt && <Chip tone="ink">{t('common.mgmtShort')}</Chip>}
          <Chip>
            <span className={styles.projDot} style={{ background: task.projectColor }} />
            {task.project}
          </Chip>
          <span style={{ flex: 1 }} />
          <span className="sf-mono" style={{ fontSize: 10, fontWeight: 700, color: priorityColor(task.priority) }}>
            {task.priority}
          </span>
        </div>
        <div className={`${styles.taskCardT} ${task.state === 'done' ? styles.done : ''}`}>
          {task.title}
        </div>
        <div className={styles.taskCardMeta}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Avatar name={task.assigner} size={18} />
            <span>{task.assigner}</span>
          </span>
          <span style={{ flex: 1 }} />
          {task.subtasks && (
            <span className={`sf-mono ${styles.subs}`}>
              ✓ {task.subtasks.done}/{task.subtasks.total}
            </span>
          )}
          <span
            className="sf-mono"
            style={{
              color: task.urgent ? 'var(--sf-danger)' : task.state === 'done' ? 'var(--sf-muted)' : 'var(--sf-ink-2)',
              fontWeight: task.urgent ? 700 : 500,
            }}
          >
            {task.deadline}
          </span>
        </div>
      </div>
    </div>
  );
}

function KanbanBoard({ columns, tasks, onToggle, onAdd }) {
  const { t } = useT();
  return (
    <div className={styles.kanban}>
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.state === col.id);
        return (
          <div key={col.id} className={styles.kanbanCol}>
            <div className={styles.kanbanHead}>
              <span className={styles.kanbanDot} style={{ background: col.color }} />
              <span className={styles.kanbanName}>{col.label}</span>
              <span className={styles.kanbanCount}>{colTasks.length}</span>
              <span style={{ flex: 1 }} />
              <button className={styles.iconBtn} aria-label="Qo‘shish" onClick={() => onAdd?.(col.id)}>
                <Icon name="plus" size={14} />
              </button>
            </div>
            <div className={styles.kanbanCards}>
              {colTasks.map((t) => (
                <TaskCard key={t.id} task={t} onToggle={onToggle} />
              ))}
              {colTasks.length === 0 && <div className={styles.kanbanEmpty}>{t('tasks.empty')}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskListView({ columns, tasks, onToggle }) {
  const { t } = useT();
  return (
    <Card padded={false}>
      <div className={styles.listHead}>
        <div>{t('tasks.cTask')}</div>
        <div>{t('tasks.cProject')}</div>
        <div>{t('tasks.cAssigner')}</div>
        <div>{t('tasks.cDeadline')}</div>
        <div>{t('tasks.cPriority')}</div>
        <div>{t('tasks.cStatus')}</div>
      </div>
      {tasks.map((task) => {
        const col = columns.find((c) => c.id === task.state);
        return (
          <div key={task.id} className={styles.listRow}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
              <button
                className={styles.check}
                onClick={() => onToggle(task)}
                aria-label="Holatni almashtirish"
                style={{
                  background: task.state === 'done' ? 'var(--sf-success)' : 'transparent',
                  borderColor: task.state === 'done' ? 'var(--sf-success)' : 'var(--sf-border-strong)',
                }}
              >
                {task.state === 'done' && <Icon name="check" size={12} stroke={3} style={{ color: '#fffcf5' }} />}
              </button>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {task.fromMgmt && <Chip tone="ink">{t('common.mgmtShort')}</Chip>}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: task.state === 'done' ? 'line-through' : 'none',
                    color: task.state === 'done' ? 'var(--sf-muted)' : 'var(--sf-ink)',
                  }}
                >
                  {task.title}
                </span>
              </div>
            </div>
            <div>
              <Chip>
                <span className={styles.projDot} style={{ background: task.projectColor }} />
                {task.project}
              </Chip>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <Avatar name={task.assigner} size={20} />
              <span>{task.assigner}</span>
            </div>
            <div>
              <span className="sf-mono" style={{ fontSize: 12, color: task.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)', fontWeight: task.urgent ? 700 : 500 }}>
                {task.deadline}
              </span>
            </div>
            <div>
              <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700, color: priorityColor(task.priority) }}>
                {task.priority}
              </span>
            </div>
            <div>
              <Chip tone={stateTone(task.state)}>{col?.label}</Chip>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// Deadlines in fixtures are fuzzy display strings; we only place the ones that
// carry an explicit "DD.MM" into the grid, everything else lands in "Unscheduled".
function parseDeadline(deadline) {
  const m = typeof deadline === 'string' && deadline.match(/(\d{2})\.(\d{2})/);
  if (!m) return null;
  return { day: Number(m[1]), month: Number(m[2]) };
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function CalendarView({ tasks, onToggle }) {
  const { t } = useT();
  // Anchor the calendar on the month that actually holds the most dated tasks,
  // so the view is useful on first render instead of landing on an empty month.
  const dated = tasks.map((task) => ({ task, d: parseDeadline(task.deadline) })).filter((x) => x.d);
  const initial = useMemo(() => {
    if (dated.length === 0) {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
    const counts = {};
    for (const { d } of dated) counts[d.month] = (counts[d.month] ?? 0) + 1;
    const month = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
    return { year: new Date().getFullYear(), month };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [cursor, setCursor] = useState(initial);

  const { year, month } = cursor;
  const first = new Date(year, month - 1, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthLabel = first.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const byDay = {};
  const unscheduled = [];
  for (const task of tasks) {
    const d = parseDeadline(task.deadline);
    if (d && d.month === month) (byDay[d.day] ??= []).push(task);
    else if (!d) unscheduled.push(task);
  }

  const cells = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  const step = (delta) => {
    setCursor((c) => {
      const next = new Date(c.year, c.month - 1 + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });
  };

  return (
    <Card padded={false}>
      <div className={styles.calHead}>
        <button className={styles.iconBtn} onClick={() => step(-1)} aria-label="Prev">
          <Icon name="chevR" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <span className={styles.calMonth}>{monthLabel}</span>
        <button className={styles.iconBtn} onClick={() => step(1)} aria-label="Next">
          <Icon name="chevR" size={16} />
        </button>
      </div>
      <div className={styles.calWeekdays}>
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className={styles.calGrid}>
        {cells.map((day, i) => (
          <div key={i} className={`${styles.calCell} ${day ? '' : styles.calEmpty}`}>
            {day && <div className={styles.calDay}>{day}</div>}
            {(byDay[day] ?? []).map((task) => (
              <button
                key={task.id}
                className={styles.calTask}
                style={{ borderLeftColor: task.urgent ? 'var(--sf-danger)' : task.projectColor }}
                onClick={() => onToggle(task)}
                title={task.title}
              >
                <span className="sf-mono" style={{ color: priorityColor(task.priority), fontWeight: 700 }}>
                  {task.priority}
                </span>{' '}
                {task.title}
              </button>
            ))}
          </div>
        ))}
      </div>
      {unscheduled.length > 0 && (
        <div className={styles.calUnsched}>
          <div className={styles.calUnschedHead}>{t('tasks.unscheduled')}</div>
          <div className={styles.calUnschedList}>
            {unscheduled.map((task) => (
              <button
                key={task.id}
                className={styles.calTask}
                style={{ borderLeftColor: task.urgent ? 'var(--sf-danger)' : task.projectColor }}
                onClick={() => onToggle(task)}
              >
                <span className="sf-mono" style={{ color: priorityColor(task.priority), fontWeight: 700 }}>
                  {task.priority}
                </span>{' '}
                {task.title}
                <span className="sf-mono" style={{ marginLeft: 'auto', color: 'var(--sf-muted)' }}>
                  {task.deadline}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function NewTaskModal({ open, onClose, columns, projects, onCreate, presetState }) {
  const { t } = useT();
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [priority, setPriority] = useState('P2');
  const [state, setState] = useState(presetState ?? 'todo');
  const [deadline, setDeadline] = useState('');

  // Re-seed the column when the modal is opened from a specific Kanban lane.
  useEffect(() => {
    if (open) setState(presetState ?? 'todo');
  }, [open, presetState]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      project: project || projects[0] || t('tasks.project'),
      priority,
      state,
      deadline: deadline.trim() || '—',
    });
    setTitle('');
    setProject('');
    setPriority('P2');
    setDeadline('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('common.newTask')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" icon="plus" onClick={submit}>
            {t('common.newTask')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className={styles.form}>
        <label className={styles.field}>
          <span>{t('tasks.cTask')}</span>
          <input
            className={styles.inputCtl}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </label>
        <label className={styles.field}>
          <span>{t('tasks.cProject')}</span>
          <select className={styles.inputCtl} value={project} onChange={(e) => setProject(e.target.value)}>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{t('tasks.cPriority')}</span>
          <Segmented
            value={priority}
            onChange={setPriority}
            options={[
              { value: 'P1', label: 'P1' },
              { value: 'P2', label: 'P2' },
              { value: 'P3', label: 'P3' },
            ]}
          />
        </label>
        <label className={styles.field}>
          <span>{t('tasks.cStatus')}</span>
          <Segmented
            value={state}
            onChange={setState}
            options={columns.map((c) => ({ value: c.id, label: c.label }))}
          />
        </label>
        <label className={styles.field}>
          <span>{t('tasks.cDeadline')}</span>
          <input
            className={styles.inputCtl}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="22.05 · 18:00"
          />
        </label>
      </form>
    </Modal>
  );
}

export function TasksPage() {
  const { tasks: taskService } = useServices();
  const toast = useToast();
  const { t } = useT();
  const viewOptions = [
    { value: 'list', label: t('tasks.viewList'), icon: 'filter' },
    { value: 'board', label: t('tasks.viewBoard'), icon: 'cohort' },
    { value: 'calendar', label: t('tasks.viewCalendar'), icon: 'cal' },
  ];
  const [view, setView] = useState('board');
  const [filter, setFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [added, setAdded] = useState([]);
  const [modal, setModal] = useState(null); // null | { presetState }

  const listState = useAsync(() => taskService.getList(), []);
  const filtersState = useAsync(() => taskService.getFilters(), []);

  const baseTasks = useMemo(
    () => [...added, ...(listState.data?.tasks ?? [])],
    [listState.data, added],
  );
  const projects = useMemo(
    () => [...new Set(baseTasks.map((t) => t.project))],
    [baseTasks],
  );

  const tasks = useMemo(() => {
    return baseTasks
      .map((t) => (overrides[t.id] ? { ...t, state: overrides[t.id] } : t))
      .filter(PREDICATES[filter] ?? PREDICATES.all)
      .filter((t) => !projectFilter || t.project === projectFilter)
      .filter((t) => !priorityFilter || t.priority === priorityFilter);
  }, [baseTasks, overrides, filter, projectFilter, priorityFilter]);

  // Click cycles a task through the workflow states — a real, persisted-feeling action.
  const cycle = (task) => {
    const order = ['todo', 'doing', 'review', 'done'];
    const next = order[(order.indexOf(task.state) + 1) % order.length];
    setOverrides((o) => ({ ...o, [task.id]: next }));
    taskService.setState(task.id, next);
    toast(`“${String(task.title).slice(0, 22)}…” → ${next}`);
  };

  const createTask = (draft) => {
    setAdded((list) => [{ id: `new-${Date.now()}`, urgent: false, fromMgmt: false, subtasks: null, assigner: t('common.me'), mine: true, projectColor: 'var(--sf-primary)', ...draft }, ...list]);
    toast(`+ ${draft.title}`, 'success');
  };

  // Cycle the priority filter P1 → P2 → P3 → off.
  const cyclePriority = () => {
    const order = [null, 'P1', 'P2', 'P3'];
    setPriorityFilter((p) => order[(order.indexOf(p) + 1) % order.length]);
  };
  // Cycle the project filter through known projects → off.
  const cycleProject = () => {
    const order = [null, ...projects];
    setProjectFilter((p) => order[(order.indexOf(p) + 1) % order.length]);
  };

  return (
    <>
      <PageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        right={
          <>
            <ViewSwitcher options={viewOptions} value={view} onChange={setView} />
            <Button variant="primary" icon="plus" onClick={() => setModal({ presetState: 'todo' })}>
              {t('common.newTask')}
            </Button>
          </>
        }
      />

      <div className={styles.filterStrip}>
        {(filtersState.data ?? []).map((f) => (
          <FilterChip
            key={f.key}
            label={f.label}
            count={f.count}
            active={filter === f.key}
            onClick={() => setFilter(f.key)}
          />
        ))}
        <span style={{ flex: 1 }} />
        <FilterChip
          label={projectFilter || t('tasks.project')}
          icon="filter"
          active={Boolean(projectFilter)}
          onClick={cycleProject}
        />
        <FilterChip
          label={priorityFilter || t('tasks.priority')}
          icon="filter"
          active={Boolean(priorityFilter)}
          onClick={cyclePriority}
        />
      </div>

      <AsyncBoundary state={listState}>
        {(d) =>
          view === 'board' ? (
            <KanbanBoard columns={d.columns} tasks={tasks} onToggle={cycle} onAdd={(colId) => setModal({ presetState: colId })} />
          ) : view === 'list' ? (
            <TaskListView columns={d.columns} tasks={tasks} onToggle={cycle} />
          ) : (
            <CalendarView tasks={tasks} onToggle={cycle} />
          )
        }
      </AsyncBoundary>

      <NewTaskModal
        open={modal !== null}
        onClose={() => setModal(null)}
        columns={listState.data?.columns ?? []}
        projects={projects}
        presetState={modal?.presetState}
        onCreate={createTask}
      />
    </>
  );
}
