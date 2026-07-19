import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Avatar, Button, Chip, Icon } from '@/ui';
import { useAsync } from '@/hooks/useAsync.js';
import { useServices } from '@/hooks/useServices.js';
import { useT } from '@/hooks/useT.js';
import styles from './people.module.css';

export function PeoplePage() {
  const { people } = useServices();
  const { t, locale } = useT();
  const navigate = useNavigate();
  const state = useAsync(() => people.getDirectory(), [locale]);
  const [tab, setTab] = useState('staff');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState('');

  return (
    <AsyncBoundary state={state}>
      {(data) => {
        const tabs = [
          { key: 'staff', label: t('people.staff'), items: data.staff },
          { key: 'teachers', label: t('people.teachers'), items: data.teachers },
          { key: 'students', label: t('people.students'), items: data.students },
          { key: 'parents', label: t('people.parents'), items: data.parents },
        ].filter((item) => data.capabilities[item.key]);
        const activeTab = tabs.some((item) => item.key === tab) ? tab : tabs[0]?.key;
        const source = tabs.find((item) => item.key === activeTab)?.items ?? [];
        const normalized = query.trim().toLowerCase();
        const visible = source.filter((person) => {
          const searchable =
            `${person.name} ${person.role} ${person.department} ${person.branch} ${person.cohort} ${person.studentId}`.toLowerCase();
          return (
            (!normalized || searchable.includes(normalized)) &&
            (status === 'all' || (status === 'active' ? person.active : !person.active))
          );
        });
        const selected =
          visible.find((person) => person.id === selectedId) ??
          source.find((person) => person.id === selectedId) ??
          visible[0] ??
          null;
        const all = [...data.staff, ...data.teachers, ...data.students, ...data.parents];
        const active = all.filter((person) => person.active).length;
        const branches = new Set(all.map((person) => person.branch).filter(Boolean)).size;

        return (
          <>
            <PageHeader
              title={t('people.title')}
              subtitle={t('people.subtitle')}
              right={
                <Button variant="outline" icon="chat" onClick={() => navigate('/messages')}>
                  {t('people.openMessages')}
                </Button>
              }
            />

            <section className={styles.hero}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <i /> {t('people.branchDirectory')}
                </span>
                <h2>{t('people.heroTitle')}</h2>
                <p>{t('people.heroBody')}</p>
              </div>
              <div className={styles.heroPeople} aria-hidden="true">
                <div className={styles.avatarStack}>
                  {all.slice(0, 5).map((person) => (
                    <Avatar key={person.id} name={person.name} size={46} />
                  ))}
                </div>
                <strong className="sf-mono">{active}</strong>
                <span>{t('people.activeNow')}</span>
              </div>
            </section>

            <section className={styles.metrics} aria-label={t('people.overview')}>
              <DirectoryMetric icon="users" value={all.length} label={t('people.visiblePeople')} />
              <DirectoryMetric icon="check" value={active} label={t('people.activeProfiles')} />
              <DirectoryMetric icon="pin" value={branches} label={t('people.branches')} />
              <DirectoryMetric
                icon="shield"
                value={tabs.length}
                label={t('people.availableLists')}
              />
            </section>

            {!tabs.length ? (
              <section className={styles.noAccess}>
                <span>
                  <Icon name="shield" size={22} />
                </span>
                <h2>{t('people.noAccess')}</h2>
                <p>{t('people.noAccessBody')}</p>
              </section>
            ) : (
              <div className={styles.workspace}>
                <section className={styles.directory}>
                  <header className={styles.directoryHead}>
                    <div>
                      <span>{t('people.directory')}</span>
                      <h2>{t('people.findPerson')}</h2>
                    </div>
                    <label className={styles.search}>
                      <Icon name="search" size={15} />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t('people.search')}
                        aria-label={t('people.search')}
                      />
                    </label>
                  </header>

                  <div className={styles.tabs} role="tablist" aria-label={t('people.directory')}>
                    {tabs.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === item.key}
                        onClick={() => {
                          setTab(item.key);
                          setSelectedId('');
                        }}
                      >
                        {item.label} <b className="sf-mono">{item.items.length}</b>
                      </button>
                    ))}
                  </div>

                  <div className={styles.statusFilters}>
                    {['all', 'active', 'away'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        data-on={status === key ? '1' : '0'}
                        onClick={() => setStatus(key)}
                      >
                        {t(`people.filter.${key}`)}
                      </button>
                    ))}
                  </div>

                  <div className={styles.personList}>
                    {visible.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        className={styles.personRow}
                        data-selected={selected?.id === person.id ? '1' : '0'}
                        onClick={() => setSelectedId(person.id)}
                      >
                        <span className={styles.avatarWrap}>
                          <Avatar name={person.name} size={44} />
                          <i data-online={person.active ? '1' : '0'} />
                        </span>
                        <span className={styles.personIdentity}>
                          <strong>{person.name}</strong>
                          <small>{person.role}</small>
                        </span>
                        <span className={styles.personContext}>
                          <strong>
                            {person.cohort || person.department || person.branch || '—'}
                          </strong>
                          <small>{person.branch || t('people.branchUnknown')}</small>
                        </span>
                        <span className={styles.lastSeen}>
                          {relativeTime(person.lastSeen, locale, t)}
                        </span>
                        <Icon name="chevR" size={16} />
                      </button>
                    ))}
                    {!visible.length && (
                      <div className={styles.empty}>
                        <Icon name="search" size={21} />
                        <strong>{t('people.noResults')}</strong>
                        <span>{t('people.noResultsBody')}</span>
                      </div>
                    )}
                  </div>
                </section>

                <ProfilePanel
                  person={selected}
                  t={t}
                  locale={locale}
                  onMessage={() => navigate('/messages')}
                />
              </div>
            )}
          </>
        );
      }}
    </AsyncBoundary>
  );
}

function DirectoryMetric({ icon, value, label }) {
  return (
    <article className={styles.metric}>
      <span>
        <Icon name={icon} size={16} />
      </span>
      <strong className="sf-mono">{value}</strong>
      <small>{label}</small>
    </article>
  );
}

function ProfilePanel({ person, t, locale, onMessage }) {
  const details = useMemo(() => {
    if (!person) return [];
    return [
      [t('people.role'), person.role],
      [t('people.department'), person.department],
      [t('people.branch'), person.branch],
      [t('people.cohort'), person.cohort],
      [t('people.subjects'), person.subjects],
      [t('people.studentId'), person.studentId],
      [t('people.level'), person.level],
    ].filter(([, value]) => value);
  }, [person, t]);

  if (!person) return null;
  return (
    <aside className={styles.profile} aria-label={t('people.profile')}>
      <div className={styles.profileCover}>
        <span>
          {person.kind === 'student'
            ? t('people.learnerProfile')
            : person.kind === 'parent'
              ? t('people.familyProfile')
              : t('people.staffProfile')}
        </span>
        <i />
      </div>
      <div className={styles.profileIdentity}>
        <span className={styles.largeAvatar}>
          <Avatar name={person.name} size={76} />
        </span>
        <Chip tone={person.active ? 'success' : 'neutral'}>
          {person.active ? t('people.active') : t('people.away')}
        </Chip>
        <h2>{person.name}</h2>
        <p>
          {person.role}
          {person.department ? ` · ${person.department}` : ''}
        </p>
      </div>

      <div className={styles.contactGrid}>
        <Contact icon="chat" label={t('people.phone')} value={person.phone} />
        <Contact icon="send" label={t('people.email')} value={person.email} />
      </div>

      <div className={styles.profileDetails}>
        <span>{t('people.profileDetails')}</span>
        {details.map(([label, value]) => (
          <div key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </div>
        ))}
        <div>
          <small>{t('people.lastActive')}</small>
          <strong>{relativeTime(person.lastSeen, locale, t)}</strong>
        </div>
      </div>

      <div className={styles.profileAction}>
        <Button variant="primary" icon="chat" onClick={onMessage}>
          {t('people.openMessages')}
        </Button>
        <p>
          <Icon name="shield" size={13} /> {t('people.readOnly')}
        </p>
      </div>
    </aside>
  );
}

function Contact({ icon, label, value }) {
  return (
    <div>
      <span>
        <Icon name={icon} size={14} />
      </span>
      <small>{label}</small>
      <strong>{value || '—'}</strong>
    </div>
  );
}

function relativeTime(value, locale, t) {
  if (!value) return t('people.never');
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60000);
  if (Math.abs(minutes) < 10) return t('people.onlineNow');
  const code = locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US';
  const formatter = new Intl.RelativeTimeFormat(code, { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
}
