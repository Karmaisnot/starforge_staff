import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { AiBadge, Avatar, Button, Card, Chip, Icon, Modal, StarMark } from '@/ui';
import { attendanceTone } from '@/domain/models/cohort.js';
import { useCohorts, useRoster } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './cohorts.module.css';

function NewGroupModal({ open, onClose, onCreate }) {
  const { t } = useT();
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [room, setRoom] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), level: level.trim() || '—', room: room.trim() || '—' });
    setName('');
    setLevel('');
    setRoom('');
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('common.newGroup')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" icon="plus" onClick={submit}>
            {t('common.newGroup')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className={styles.gForm}>
        <label className={styles.gField}>
          <span>{t('cohorts.tGroup')}</span>
          <input className={styles.gInput} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <label className={styles.gField}>
          <span>{t('cohorts.tSubject')}</span>
          <input className={styles.gInput} value={level} onChange={(e) => setLevel(e.target.value)} />
        </label>
        <label className={styles.gField}>
          <span>{t('cohorts.branch')}</span>
          <input className={styles.gInput} value={room} onChange={(e) => setRoom(e.target.value)} />
        </label>
      </form>
    </Modal>
  );
}

function AttendanceModal({ open, onClose, cohort }) {
  const { t } = useT();
  const toast = useToast();
  const { data: roster } = useRoster(open ? cohort?.id : undefined);
  const [present, setPresent] = useState({});
  const list = roster ?? [];
  const presentCount = list.filter((s) => present[s.id] !== false).length;
  const save = () => {
    toast(`${cohort?.name} · ${presentCount}/${list.length} ${t('common.attendance')}`, 'success');
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${cohort?.name ?? ''} · ${t('cohorts.takeAttendance')}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" icon="check" onClick={save}>
            {presentCount}/{list.length}
          </Button>
        </>
      }
    >
      <div className={styles.attList}>
        {list.map((s) => {
          const isPresent = present[s.id] !== false;
          return (
            <button
              key={s.id}
              type="button"
              className={styles.attRow}
              onClick={() => setPresent((p) => ({ ...p, [s.id]: !isPresent }))}
            >
              <span
                className={styles.attCheck}
                style={{
                  background: isPresent ? 'var(--sf-success)' : 'transparent',
                  borderColor: isPresent ? 'var(--sf-success)' : 'var(--sf-border-strong)',
                }}
              >
                {isPresent && <Icon name="check" size={12} stroke={3} style={{ color: '#fffcf5' }} />}
              </span>
              <Avatar name={s.name} size={28} />
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13.5 }}>{s.name}</span>
              <span style={{ fontSize: 12, color: isPresent ? 'var(--sf-success)' : 'var(--sf-muted)' }}>
                {isPresent ? t('cohorts.present') : t('cohorts.absent')}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

const ROSTER_CAP = 6;

function StudentModal({ student, onClose }) {
  const { t } = useT();
  if (!student) return null;
  return (
    <Modal open={Boolean(student)} onClose={onClose} title={student.name}>
      <div className={styles.stuMeta}>
        <span className="sf-mono">{student.studentId}</span>
      </div>
      <div className={styles.stuStats}>
        <div className={styles.stuStat}>
          <div className="sf-mono" style={{ fontSize: 20, fontWeight: 700, color: attendanceTone(student.attendance) }}>
            {student.attendance}%
          </div>
          <div className={styles.stuStatL}>{t('common.attendance')}</div>
        </div>
        <div className={styles.stuStat}>
          <div className="sf-mono" style={{ fontSize: 20, fontWeight: 700, color: '#7a4f0e' }}>↑{student.up}</div>
          <div className={styles.stuStatL}>{t('common.upCard')}</div>
        </div>
        <div className={styles.stuStat}>
          <div className="sf-mono" style={{ fontSize: 20, fontWeight: 700, color: student.down > 0 ? 'var(--sf-danger)' : 'var(--sf-muted)' }}>
            ↓{student.down}
          </div>
          <div className={styles.stuStatL}>{t('common.downCard')}</div>
        </div>
      </div>
    </Modal>
  );
}

function Roster({ cohortId }) {
  const { data: roster } = useRoster(cohortId);
  const { t } = useT();
  const [sortBy, setSortBy] = useState('default'); // default | attendance | name
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);

  const sorted = [...(roster ?? [])];
  if (sortBy === 'attendance') sorted.sort((a, b) => b.attendance - a.attendance);
  else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  const visible = expanded ? sorted : sorted.slice(0, ROSTER_CAP);
  const sortLabel =
    sortBy === 'attendance' ? t('cohorts.sortAttendance') : sortBy === 'name' ? t('cohorts.sortName') : t('cohorts.sort');
  const cycleSort = () => setSortBy((s) => (s === 'default' ? 'attendance' : s === 'attendance' ? 'name' : 'default'));

  return (
    <Card
      title={t('cohorts.rosterTitle')}
      padded={false}
      action={
        <a className={styles.link} onClick={cycleSort}>
          {sortLabel}
        </a>
      }
    >
      {visible.map((s) => (
        <div key={s.id} className={styles.rosterRow}>
          <Avatar name={s.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s.name}</span>
              {s.flag === 'top' && <StarMark size={12} color="var(--sf-accent)" />}
              {s.flag === 'warn' && <span className={styles.warnDot} />}
            </div>
            <div className="sf-mono" style={{ fontSize: 10.5, color: 'var(--sf-muted)', marginTop: 1 }}>
              {s.studentId}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div className="sf-mono" style={{ fontSize: 13, fontWeight: 700, color: attendanceTone(s.attendance) }}>
                {s.attendance}%
              </div>
              <div className={styles.miniLabel}>{t('common.attendance')}</div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <div className={styles.cardMini} style={{ background: 'linear-gradient(135deg, #f6e0ac, #e9c272)', borderColor: '#c49a3a' }}>
                <StarMark size={10} color="#7a4f0e" />
                <span className="sf-mono">{s.up}</span>
              </div>
              {s.down > 0 && (
                <div className={styles.cardMini} style={{ background: 'linear-gradient(135deg, #f0c9be, #d88a75)', borderColor: '#a14026' }}>
                  <StarMark size={10} color="#5c1a0c" />
                  <span className="sf-mono">{s.down}</span>
                </div>
              )}
            </div>
            <button className={styles.iconBtn} onClick={() => setSelected(s)} aria-label={s.name}>
              <Icon name="chevR" size={14} />
            </button>
          </div>
        </div>
      ))}
      {sorted.length > ROSTER_CAP && (
        <div className={styles.rosterMore} onClick={() => setExpanded((e) => !e)}>
          {expanded ? t('cohorts.showLess') : `${t('cohorts.showMore')} · ${sorted.length - ROSTER_CAP}`}
        </div>
      )}
      <StudentModal student={selected} onClose={() => setSelected(null)} />
    </Card>
  );
}

export function CohortsPage() {
  const [selected, setSelected] = useState(0);
  const state = useCohorts();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useT();
  const [added, setAdded] = useState([]);
  const [levelFilter, setLevelFilter] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const createGroup = (draft) => {
    setAdded((list) => [
      { id: `g-${Date.now()}`, color: 'var(--sf-primary)', studentCount: 0, attendance: 100, up: 0, down: 0, next: '—', ...draft },
      ...list,
    ]);
    setSelected(0);
    toast(`+ ${draft.name}`, 'success');
  };

  return (
    <AsyncBoundary state={state}>
      {(loaded) => {
        const allCohorts = [...added, ...loaded];
        const levels = [...new Set(allCohorts.map((c) => c.level))];
        const cohorts = levelFilter ? allCohorts.filter((c) => c.level === levelFilter) : allCohorts;
        const cur = cohorts[selected] ?? cohorts[0];
        const cycleLevel = () => {
          const order = [null, ...levels];
          setLevelFilter((l) => order[(order.indexOf(l) + 1) % order.length]);
          setSelected(0);
        };
        return (
          <>
            <PageHeader
              title={t('cohorts.title')}
              subtitle={t('cohorts.subtitle')}
              right={
                <>
                  <Button variant="soft" icon="filter" onClick={cycleLevel}>
                    {levelFilter || t('common.filter')}
                  </Button>
                  <Button variant="primary" icon="plus" onClick={() => setNewOpen(true)}>
                    {t('common.newGroup')}
                  </Button>
                </>
              }
            />

            <div className={styles.layout}>
              <Card padded={false}>
                <div className={styles.tableHead}>
                  <div>{t('cohorts.tGroup')}</div>
                  <div>{t('cohorts.tSubject')}</div>
                  <div style={{ textAlign: 'right' }}>{t('cohorts.tStudents')}</div>
                  <div style={{ textAlign: 'right' }}>{t('cohorts.tAttendance')}</div>
                  <div style={{ textAlign: 'right' }}>{t('cohorts.tCards')}</div>
                  <div>{t('cohorts.tNext')}</div>
                </div>
                {cohorts.map((c, i) => (
                  <div
                    key={c.id}
                    className={`${styles.tableRow} ${selected === i ? styles.on : ''}`}
                    onClick={() => setSelected(i)}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className={styles.cohortMark} style={{ background: c.color }}>
                        <StarMark size={16} color="#fffcf5" />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name}</span>
                    </div>
                    <div style={{ color: 'var(--sf-muted)', fontSize: 12.5 }}>{c.level}</div>
                    <div className="sf-mono" style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                      {c.studentCount}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="sf-mono" style={{ fontSize: 13, fontWeight: 700, color: attendanceTone(c.attendance) }}>
                        {c.attendance}%
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <span className="sf-mono" style={{ color: '#7a4f0e', fontWeight: 700, fontSize: 12 }}>
                        ↑{c.up}
                      </span>
                      <span className="sf-mono" style={{ color: c.down > 0 ? 'var(--sf-danger)' : 'var(--sf-muted)', fontWeight: 700, fontSize: 12 }}>
                        ↓{c.down}
                      </span>
                    </div>
                    <div className="sf-mono" style={{ color: 'var(--sf-ink-2)', fontSize: 12 }}>{c.next}</div>
                  </div>
                ))}
              </Card>

              <div className={styles.detail}>
                <div
                  className={styles.hero}
                  style={{ background: `linear-gradient(135deg, ${cur.color} 0%, color-mix(in oklab, ${cur.color} 80%, black) 100%)` }}
                >
                  <StarMark size={140} color="#fffcf5" className={styles.heroStar} />
                  <div style={{ position: 'relative' }}>
                    <Chip tone="ink" style={{ background: 'rgba(255,252,245,0.2)', color: '#fffcf5' }}>
                      {cur.level}
                    </Chip>
                    <div className={styles.heroName}>
                      {cur.name.split(' ')[0]}{' '}
                      <span style={{ opacity: 0.7 }}>{cur.name.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div className={styles.heroSub}>
                      {cur.studentCount} {t('common.students')} · {t('cohorts.branch')} · {cur.room}
                    </div>
                    <div className={styles.heroStats}>
                      {[
                        { v: `${cur.attendance}%`, l: t('cohorts.tAttendance') },
                        { v: `↑${cur.up}`, l: t('common.upCard') },
                        { v: `↓${cur.down}`, l: t('common.downCard') },
                        { v: '12', l: t('common.task') },
                      ].map((s, i) => (
                        <div key={i} className={styles.heroStat}>
                          <div className={`sf-mono ${styles.heroStatV}`}>{s.v}</div>
                          <div className={styles.heroStatL}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Button variant="cream" icon="check" onClick={() => setAttendanceOpen(true)}>
                        {t('cohorts.takeAttendance')}
                      </Button>
                      <Button variant="cream-ghost" onClick={() => navigate('/cards')}>
                        {t('cohorts.giveCard')}
                      </Button>
                      <Button variant="cream-ghost" onClick={() => toast(`${cur.studentCount} ${t('common.students')}`)}>
                        {cur.studentCount} {t('common.students')}
                      </Button>
                    </div>
                  </div>
                </div>

                <Roster cohortId={cur.id} />

                <div className={styles.aiCard}>
                  <div className={styles.aiBg} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <AiBadge>{t('cohorts.aiReport')}</AiBadge>
                      <span style={{ fontSize: 11, color: 'var(--sf-muted)' }}>{t('cohorts.thisWeek')}</span>
                    </div>
                    <div className={styles.aiQuote}>{t('cohorts.aiQuote')}</div>
                  </div>
                </div>
              </div>
            </div>

            <NewGroupModal open={newOpen} onClose={() => setNewOpen(false)} onCreate={createGroup} />
            <AttendanceModal open={attendanceOpen} onClose={() => setAttendanceOpen(false)} cohort={cur} />
          </>
        );
      }}
    </AsyncBoundary>
  );
}
