import { useMemo, useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Avatar, Button, Card, Chip, FilterChip, Icon, ViewSwitcher } from '@/ui';
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

function KanbanBoard({ columns, tasks, onToggle }) {
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
              <button className={styles.iconBtn} aria-label="Qo‘shish">
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
  const [overrides, setOverrides] = useState({});

  const listState = useAsync(() => taskService.getList(), []);
  const filtersState = useAsync(() => taskService.getFilters(), []);

  const tasks = useMemo(() => {
    const base = listState.data?.tasks ?? [];
    const withOverrides = base.map((t) => (overrides[t.id] ? { ...t, state: overrides[t.id] } : t));
    return withOverrides.filter(PREDICATES[filter] ?? PREDICATES.all);
  }, [listState.data, overrides, filter]);

  // Click cycles a task through the workflow states — a real, persisted-feeling action.
  const cycle = (task) => {
    const order = ['todo', 'doing', 'review', 'done'];
    const next = order[(order.indexOf(task.state) + 1) % order.length];
    setOverrides((o) => ({ ...o, [task.id]: next }));
    taskService.setState(task.id, next);
    toast(`“${task.title.slice(0, 22)}…” → ${next}`);
  };

  return (
    <>
      <PageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        right={
          <>
            <ViewSwitcher options={viewOptions} value={view} onChange={setView} />
            <Button variant="primary" icon="plus" onClick={() => toast(t('tasks.newFormToast'))}>
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
        <FilterChip label={t('tasks.project')} icon="filter" onClick={() => toast(t('tasks.project'))} />
        <FilterChip label={t('tasks.priority')} icon="filter" onClick={() => toast(t('tasks.priority'))} />
      </div>

      <AsyncBoundary state={listState}>
        {(d) =>
          view === 'board' ? (
            <KanbanBoard columns={d.columns} tasks={tasks} onToggle={cycle} />
          ) : view === 'list' ? (
            <TaskListView columns={d.columns} tasks={tasks} onToggle={cycle} />
          ) : (
            <Card>
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--sf-muted)' }}>
                {t('tasks.calendarSoon')}
              </div>
            </Card>
          )
        }
      </AsyncBoundary>
    </>
  );
}
