import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { ThemeControls } from '@/layout/ThemeSwitcher.jsx';
import { AiBadge, Avatar, Button, Card, Icon, ProgressBar } from '@/ui';
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

  const sections = [
    {
      title: t('settings.notifications'),
      items: [
        { key: 'notifPush', label: t('settings.notifPush'), on: true },
        { key: 'notifCards', label: t('settings.notifCards'), on: true },
        { key: 'notifMgmt', label: t('settings.notifMgmt'), on: true },
        { key: 'notifSurvey', label: t('settings.notifSurvey'), on: false },
      ],
    },
    {
      title: t('settings.privacy'),
      items: [
        { key: 'shareProfile', label: t('settings.shareProfile'), on: true },
        { key: 'anonSurvey', label: t('settings.anonSurvey'), on: true },
        { key: 'aiData', label: t('settings.aiData'), on: true },
      ],
    },
    {
      title: t('settings.beta'),
      items: [
        { key: 'betaCalendar', label: t('settings.betaCalendar'), on: false },
        { key: 'betaVoice', label: t('settings.betaVoice'), on: false },
      ],
    },
  ];

  const [toggles, setToggles] = useState(() => ({
    notifPush: true,
    notifCards: true,
    notifMgmt: true,
    notifSurvey: false,
    shareProfile: true,
    anonSurvey: true,
    aiData: true,
    betaCalendar: false,
    betaVoice: false,
  }));
  const flip = (key, label) => {
    setToggles((tg) => {
      const next = !tg[key];
      toast(`${label}: ${next ? t('settings.on') : t('settings.off')}`);
      return { ...tg, [key]: next };
    });
  };

  return (
    <>
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        right={
          <Button variant="soft" icon="logout" onClick={() => toast(t('settings.loggedOut'))}>
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
                <div style={{ fontSize: 18, fontWeight: 800 }}>{teacher?.name ?? '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--sf-muted)' }}>
                  {teacher?.role} · {teacher?.branch}
                </div>
                <div className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 4 }}>
                  @{teacher?.username}
                </div>
              </div>
              <Button variant="soft" icon="edit" onClick={() => toast(t('settings.editProfile'))}>
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
            {[t('settings.deviceWeb'), t('settings.deviceMobile')].map((dvc, i) => (
              <div key={i} className={styles.row}>
                <span>{dvc}</span>
                <Button variant="ghost" onClick={() => toast(t('settings.sessionEnded'))}>
                  {t('settings.eject')}
                </Button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
