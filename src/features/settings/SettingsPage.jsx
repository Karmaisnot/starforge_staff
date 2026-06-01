import { useEffect, useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { ThemeControls } from '@/layout/ThemeSwitcher.jsx';
import { AiBadge, Avatar, Button, Card, Icon, Modal, ProgressBar } from '@/ui';
import { useTeacher } from '@/hooks/data.js';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './settings.module.css';

const LANG_LABELS = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
      onClick={onClick}
      aria-pressed={on}
    >
      <span className={styles.knob} />
    </button>
  );
}

export function SettingsPage() {
  const toast = useToast();
  const { t, locale, locales, setLocale } = useT();
  const { ai } = useServices();
  const { data: teacher } = useTeacher();
  const { data: usage } = useAsync(() => ai.getUsage(), []);

  // Editable profile overlay on top of the loaded teacher record.
  const [edits, setEdits] = useState(null);
  const profile = { ...teacher, ...edits };
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [devices, setDevices] = useState([
    { id: 'web', label: t('settings.deviceWeb') },
    { id: 'mobile', label: t('settings.deviceMobile') },
  ]);
  const [draft, setDraft] = useState({ name: '', username: '' });
  useEffect(() => {
    if (editOpen) setDraft({ name: profile.name ?? '', username: profile.username ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOpen]);

  const ejectDevice = (id) => {
    setDevices((list) => list.filter((d) => d.id !== id));
    toast(t('settings.sessionEnded'));
  };
  const saveProfile = (e) => {
    e.preventDefault();
    setEdits({ name: draft.name.trim() || profile.name, username: draft.username.trim() || profile.username });
    setEditOpen(false);
    toast(t('settings.profileSaved'), 'success');
  };
  const confirmLogout = () => {
    setLogoutOpen(false);
    setLoggedOut(true);
    toast(t('settings.loggedOut'));
  };

  const sections = [
    {
      title: t('settings.notifications'),
      items: [
        { key: 'notifPush', label: t('settings.notifPush'), default: true },
        { key: 'notifCards', label: t('settings.notifCards'), default: true },
        { key: 'notifMgmt', label: t('settings.notifMgmt'), default: true },
        { key: 'notifSurvey', label: t('settings.notifSurvey'), default: false },
      ],
    },
    {
      title: t('settings.privacy'),
      items: [
        { key: 'shareProfile', label: t('settings.shareProfile'), default: true },
        { key: 'anonSurvey', label: t('settings.anonSurvey'), default: true },
        { key: 'aiData', label: t('settings.aiData'), default: true },
      ],
    },
    {
      title: t('settings.beta'),
      items: [
        { key: 'betaCalendar', label: t('settings.betaCalendar'), default: false },
        { key: 'betaVoice', label: t('settings.betaVoice'), default: false },
      ],
    },
  ];

  // Toggle state is seeded once from the section defaults above — a single source
  // of truth, so a new switch never needs to be declared in two places.
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(
      sections.flatMap((s) => s.items.map((item) => [item.key, item.default])),
    ),
  );
  const flip = (key, label) => {
    setToggles((tg) => {
      const next = !tg[key];
      toast(`${label}: ${next ? t('settings.on') : t('settings.off')}`);
      return { ...tg, [key]: next };
    });
  };

  if (loggedOut) {
    return (
      <div className={styles.loggedOut}>
        <Avatar name={profile.name ?? 'A'} size={72} color="var(--sf-primary)" />
        <div style={{ fontSize: 20, fontWeight: 800 }}>{t('settings.loggedOut')}</div>
        <Button variant="primary" icon="logout" onClick={() => setLoggedOut(false)}>
          {t('settings.logBackIn')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        right={
          <Button variant="soft" icon="logout" onClick={() => setLogoutOpen(true)}>
            {t('settings.logout')}
          </Button>
        }
      />

      <div className={styles.grid}>
        <div className={styles.col}>
          <Card title={t('settings.profile')}>
            <div className={styles.profile}>
              <Avatar name={teacher?.name ?? 'A'} size={64} color="var(--sf-primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{profile?.name ?? '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--sf-muted)' }}>
                  {profile?.role} · {profile?.branch}
                </div>
                <div className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 4 }}>
                  @{profile?.username}
                </div>
              </div>
              <Button variant="soft" icon="edit" onClick={() => setEditOpen(true)}>
                {t('settings.editProfile')}
              </Button>
            </div>
            <div className={styles.subjects}>
              {(teacher?.subjects ?? []).map((s) => (
                <span key={s} className={styles.subjectChip}>
                  {s}
                </span>
              ))}
            </div>
          </Card>

          {sections.map((section) => (
            <Card key={section.title} title={section.title} padded={false}>
              {section.items.map((item) => (
                <div key={item.key} className={styles.row}>
                  <span>{item.label}</span>
                  <Toggle on={toggles[item.key]} onClick={() => flip(item.key, item.label)} />
                </div>
              ))}
            </Card>
          ))}
        </div>

        <div className={styles.col}>
          <Card title={t('settings.theme')}>
            <ThemeControls />
          </Card>

          <Card title={t('settings.language')}>
            <div className={styles.langRow}>
              <Icon name="globe" size={18} />
              <select
                className={styles.select}
                value={locale}
                onChange={(e) => {
                  setLocale(e.target.value);
                  toast(LANG_LABELS[e.target.value]);
                }}
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {LANG_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card title={t('settings.aiLimit')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <AiBadge compact>{t('ai.limit')}</AiBadge>
              <span className="sf-mono" style={{ fontSize: 12, color: 'var(--sf-muted)' }}>
                {usage?.used ?? 0} / {usage?.limit ?? 0}
              </span>
            </div>
            <ProgressBar value={usage?.percent ?? 0} color="var(--sf-ai)" />
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--sf-muted)' }}>
              {t('settings.limitManaged')} · {usage?.percent ?? 0}% {t('settings.used')}
            </div>
          </Card>

          <Card title={t('settings.devices')} padded={false}>
            {devices.map((dvc) => (
              <div key={dvc.id} className={styles.row}>
                <span>{dvc.label}</span>
                <Button variant="ghost" onClick={() => ejectDevice(dvc.id)}>
                  {t('settings.eject')}
                </Button>
              </div>
            ))}
            {devices.length === 0 && (
              <div className={styles.row} style={{ color: 'var(--sf-muted)' }}>
                {t('settings.noDevices')}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t('settings.editProfile')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" icon="check" onClick={saveProfile}>
              {t('settings.save')}
            </Button>
          </>
        }
      >
        <form onSubmit={saveProfile} className={styles.editForm}>
          <label className={styles.editField}>
            <span>{t('settings.fName')}</span>
            <input
              className={styles.editInput}
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              autoFocus
            />
          </label>
          <label className={styles.editField}>
            <span>{t('settings.fUsername')}</span>
            <input
              className={styles.editInput}
              value={draft.username}
              onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
            />
          </label>
        </form>
      </Modal>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title={t('settings.logout')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setLogoutOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" icon="logout" onClick={confirmLogout}>
              {t('settings.logout')}
            </Button>
          </>
        }
      >
        <div style={{ fontSize: 14, color: 'var(--sf-ink-2)' }}>{t('settings.logoutConfirm')}</div>
      </Modal>
    </>
  );
}
