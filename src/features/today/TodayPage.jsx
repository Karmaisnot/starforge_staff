import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import {
  Avatar,
  AiBadge,
  Button,
  Card,
  Chip,
  Icon,
  Modal,
  ProgressBar,
  Stat,
  StarMark,
  StudentCard,
} from '@/ui';
import { slotRailColor } from '@/domain/models/lesson.js';
import { priorityColor } from '@/domain/models/task.js';
import { useToday } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './today.module.css';

const WIDGET_KEYS = [
  'schedule',
  'recentCards',
  'pendingTasks',
  'printQueue',
  'spotlight',
  'activity',
];

export function TodayPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const toast = useToast();
  const state = useToday();
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [hidden, setHidden] = useState({});
  const [doneTasks, setDoneTasks] = useState({});
  const show = (key) => !hidden[key];
  const toggleWidget = (key) => setHidden((h) => ({ ...h, [key]: !h[key] }));
  const toggleTask = (key) => {
    setDoneTasks((d) => ({ ...d, [key]: !d[key] }));
    toast(doneTasks[key] ? t('today.taskUndone') : t('today.taskDone'));
  };
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            eyebrow={d.meta.dateLabel}
            title={
              <>
                {t('today.greeting')} <span className="sf-serif">{d.meta.greetingName}</span>
              </>
            }
            subtitle={d.meta.summary}
            right={
              <>
                <Button variant="soft" icon="edit" onClick={() => setWidgetsOpen(true)}>
                  {t('today.widgets')}
                </Button>
                <Button variant="primary" icon="plus" onClick={() => navigate('/cards')}>
                  {t('common.giveCard')}
                </Button>
              </>
            }
          />

          {/* Urgent survey banner */}
          {d.surveyBanner && (
            <div className={styles.surveyBanner} onClick={() => navigate('/surveys')}>
              <div className={styles.surveyGlow} />
              <div className={styles.surveyInner}>
                <span className={styles.pulseDot} />
                <div style={{ flex: 1 }}>
                  <div className={styles.surveyEyebrow}>
                    {t('today.surveyWord')} · {d.surveyBanner.remaining}
                  </div>
                  <div className={styles.surveyTitle}>
                    {d.surveyBanner.title}{' '}
                    <span style={{ color: 'var(--sf-muted)', fontWeight: 500 }}>
                      · {d.surveyBanner.meta}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ink"
                  icon="arrowR"
                  iconRight
                  onClick={stop(() => navigate('/surveys'))}
                >
                  {t('common.continue')}
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className={styles.statGrid}>
            {d.stats.map((s, i) => (
              <Stat
                key={i}
                value={s.value}
                unit={s.unit}
                label={s.label}
                color={s.color}
                trend={s.trend}
              />
            ))}
          </div>

          {/* Main grid */}
          <div className={styles.grid2}>
            <div className={styles.col}>
              {/* Hero */}
              <div className={styles.hero} onClick={() => navigate('/cohorts')}>
                <StarMark size={220} color="#fffcf5" className={styles.heroStar} />
                <div className={styles.heroInner}>
                  <div className={styles.heroTop}>
                    <div>
                      <div className={styles.heroEyebrow}>{d.heroLesson.eyebrow}</div>
                      <div className={styles.heroTitle}>
                        {d.heroLesson.title} ·{' '}
                        <span className="sf-serif" style={{ fontWeight: 400 }}>
                          {d.heroLesson.titleAccent}
                        </span>
                      </div>
                      <div className={styles.heroSub}>{d.heroLesson.sub}</div>
                    </div>
                    <div className={styles.heroTime}>
                      <span className={`sf-mono ${styles.heroClock}`}>{d.heroLesson.start}</span>
                      <span className={styles.heroClockSub}>{d.heroLesson.end}</span>
                    </div>
                  </div>
                  <div className={styles.heroActions}>
                    <Button variant="cream" icon="check" onClick={stop(() => navigate('/cohorts'))}>
                      {t('today.takeAttendance')}
                    </Button>
                    <Button variant="cream-ghost" onClick={stop(() => navigate('/materials'))}>
                      {t('today.materials')}
                    </Button>
                    <Button variant="cream-ghost" onClick={stop(() => navigate('/materials'))}>
                      {t('today.lessonPlan')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <Card
                style={{ display: show('schedule') ? undefined : 'none' }}
                title={t('today.scheduleTitle')}
                padded={false}
                action={
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => navigate('/cohorts')}
                  >
                    {d.schedule.length} {t('today.lessonsLink')}
                  </button>
                }
              >
                {d.schedule.map((row, i) => (
                  <div
                    key={i}
                    className={`${styles.schedRow} ${row.state === 'gap' ? styles.schedGap : ''}`}
                  >
                    <span className={`sf-mono ${styles.schedTime}`}>{row.time}</span>
                    <span
                      className={styles.schedRail}
                      style={{ background: slotRailColor(row.state) }}
                    />
                    <span className={styles.schedL}>{row.label}</span>
                    <span className={styles.schedR}>{row.room}</span>
                    <span>
                      {row.state === 'now' && (
                        <Chip tone="primary">
                          {t('today.now')} · {row.mins}
                        </Chip>
                      )}
                      {row.state === 'next' && <Chip tone="accent">{t('today.next')}</Chip>}
                    </span>
                  </div>
                ))}
              </Card>

              {/* Recent cards */}
              <Card
                style={{ display: show('recentCards') ? undefined : 'none' }}
                title={t('today.recentCards')}
                action={
                  <button type="button" className={styles.link} onClick={() => navigate('/cards')}>
                    {d.recentCards.length} {t('today.tenLink')}
                  </button>
                }
              >
                <div className={styles.cardsStrip}>
                  {d.recentCards.map((c) => (
                    <StudentCard
                      key={c.id}
                      kind={c.kind}
                      recipient={c.recipient}
                      reason={c.reason}
                      issuer={c.issuer}
                      when={c.when}
                      typeName={c.typeName}
                      onClick={() => navigate('/cards')}
                    />
                  ))}
                </div>
              </Card>

              {/* Pending tasks */}
              <Card
                style={{ display: show('pendingTasks') ? undefined : 'none' }}
                title={`${t('today.pendingTitle')} · ${d.pendingTasks.length}`}
                padded={false}
                action={
                  <button type="button" className={styles.link} onClick={() => navigate('/tasks')}>
                    {t('today.allLink')}
                  </button>
                }
              >
                {d.pendingTasks.map((task, i) => (
                  <div key={i} className={styles.taskRow}>
                    <div
                      className={styles.taskRail}
                      style={{ background: task.urgent ? 'var(--sf-danger)' : task.projectColor }}
                    />
                    <button
                      type="button"
                      className={styles.taskCheck}
                      aria-label={t('tasks.toggleState')}
                      aria-pressed={Boolean(doneTasks[i])}
                      onClick={() => toggleTask(i)}
                      style={{
                        background: doneTasks[i] ? 'var(--sf-success)' : 'transparent',
                        borderColor: doneTasks[i] ? 'var(--sf-success)' : 'var(--sf-border-strong)',
                      }}
                    >
                      {doneTasks[i] && (
                        <Icon name="check" size={11} stroke={3} style={{ color: '#fffcf5' }} />
                      )}
                    </button>
                    <div className={styles.taskBody}>
                      <div className={styles.taskChips}>
                        {task.fromMgmt && <Chip tone="ink">{t('common.mgmtFull')}</Chip>}
                        <Chip>
                          <span
                            className={styles.projDot}
                            style={{ background: task.projectColor }}
                          />
                          {task.project}
                        </Chip>
                      </div>
                      <div
                        className={styles.taskTitle}
                        style={{
                          textDecoration: doneTasks[i] ? 'line-through' : 'none',
                          color: doneTasks[i] ? 'var(--sf-muted)' : undefined,
                        }}
                      >
                        {task.title}
                      </div>
                    </div>
                    <span
                      className={`sf-mono ${styles.taskPri}`}
                      style={{ color: priorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`sf-mono ${styles.taskDl}`}
                      style={{
                        color: task.urgent ? 'var(--sf-danger)' : 'var(--sf-ink-2)',
                        fontWeight: task.urgent ? 700 : 500,
                      }}
                    >
                      {task.deadline}
                    </span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Right column */}
            <div className={styles.col}>
              {/* AI insight */}
              <div className={styles.aiCard} onClick={() => navigate('/ai')}>
                <div className={styles.aiBg} />
                <div style={{ position: 'relative' }}>
                  <div className={styles.aiHead}>
                    <AiBadge>{d.aiInsight.eyebrow}</AiBadge>
                    <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>
                      {d.aiInsight.count}
                    </span>
                  </div>
                  <div className={styles.aiQuote}>{d.aiInsight.quote}</div>
                  <div className={styles.aiChips}>
                    {d.aiInsight.chips.map((c) => (
                      <Chip key={c} tone="ai">
                        {c}
                      </Chip>
                    ))}
                  </div>
                  <Button
                    variant="ink"
                    icon="arrowR"
                    iconRight
                    style={{ marginTop: 14 }}
                    onClick={stop(() => navigate('/ai'))}
                  >
                    {t('today.goToChat')}
                  </Button>
                </div>
              </div>

              {/* Print queue */}
              <Card
                style={{ display: show('printQueue') ? undefined : 'none' }}
                title={t('today.printQueue')}
                padded={false}
                action={
                  <button type="button" className={styles.link} onClick={() => navigate('/print')}>
                    {d.printQueue.length} {t('today.twoLink')}
                  </button>
                }
              >
                {d.printQueue.map((j, i) => (
                  <div key={j.id}>
                    {i > 0 && <div className={styles.printDivider} />}
                    <div className={styles.printRow}>
                      <div className={styles.docThumb}>
                        <Icon name={j.icon} size={18} />
                        <div className={styles.docMult}>×{j.copies}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.printT}>{j.doc}</div>
                        <div className={styles.printSub}>{j.sub}</div>
                        {j.progress != null && (
                          <ProgressBar value={j.progress} color="var(--sf-primary)" />
                        )}
                        <div className={styles.printEta}>{j.eta}</div>
                      </div>
                      <Chip tone={j.tone}>{j.label}</Chip>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Mgmt mention */}
              <Card padded={false}>
                <div
                  className={styles.mgmtRow}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/mgmt')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/mgmt');
                    }
                  }}
                >
                  <Avatar name={d.mgmtMention.name} size={40} color="var(--sf-primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700 }}>{d.mgmtMention.name}</span>
                      <Chip tone="primary">{d.mgmtMention.role}</Chip>
                    </div>
                    <div className={styles.mgmtMsg}>{d.mgmtMention.message}</div>
                  </div>
                  <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>
                    {d.mgmtMention.time}
                  </span>
                  <span className={styles.unreadDot} />
                </div>
              </Card>

              {/* Spotlight */}
              <Card
                style={{ display: show('spotlight') ? undefined : 'none' }}
                title={t('today.spotlight')}
                action={
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => navigate('/cohorts')}
                  >
                    {t('today.change')}
                  </button>
                }
              >
                <div className={styles.spotlightHead}>
                  <div className={styles.spotlightMark}>
                    <StarMark size={22} color="#fffcf5" />
                  </div>
                  <div>
                    <div className={styles.spotlightName}>{d.spotlight.name}</div>
                    <div className={styles.spotlightSub}>{d.spotlight.sub}</div>
                  </div>
                  <Chip tone={d.spotlight.tone}>{d.spotlight.toneLabel}</Chip>
                </div>
                <div className={styles.spotlightStats}>
                  {d.spotlight.stats.map((s, i) => (
                    <div key={i} className={styles.spotlightStat}>
                      <div
                        className="sf-mono"
                        style={{ fontSize: 18, fontWeight: 700, color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className={styles.spotlightStatL}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity */}
              <Card
                style={{ display: show('activity') ? undefined : 'none' }}
                title={t('today.activity')}
              >
                {d.activity.map((a, i) => (
                  <div key={i} className={styles.activityRow}>
                    {a.who === 'AI' ? (
                      <div className={styles.aiMini}>Ai</div>
                    ) : (
                      <div
                        className={styles.activityIcon}
                        style={{ background: `${a.color}22`, color: a.color }}
                      >
                        {a.icon && <Icon name={a.icon} size={12} />}
                      </div>
                    )}
                    <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700 }}>{a.who}</span>
                      <span style={{ color: 'var(--sf-muted)' }}> {a.what}</span>
                    </div>
                    <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)' }}>
                      {a.time}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          <Modal
            open={widgetsOpen}
            onClose={() => setWidgetsOpen(false)}
            title={t('today.widgets')}
            footer={
              <Button variant="primary" icon="check" onClick={() => setWidgetsOpen(false)}>
                {t('common.continue')}
              </Button>
            }
          >
            <div className={styles.widgetList}>
              {WIDGET_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={styles.widgetRow}
                  aria-pressed={show(key)}
                  onClick={() => toggleWidget(key)}
                >
                  <span>{t(`today.w_${key}`)}</span>
                  <span
                    className={styles.widgetToggle}
                    style={{
                      background: show(key) ? 'var(--sf-primary)' : 'var(--sf-surface-3)',
                    }}
                    data-on={show(key) ? '1' : '0'}
                  >
                    <span className={styles.widgetKnob} />
                  </span>
                </button>
              ))}
            </div>
          </Modal>
        </>
      )}
    </AsyncBoundary>
  );
}
