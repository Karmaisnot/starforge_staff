import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { FilterChip, Icon } from '@/ui';
import { notificationToneStyle } from '@/domain/models/notification.js';
import { useNotificationsPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './notifications.module.css';

export function NotificationsPage() {
  const toast = useToast();
  const { t } = useT();
  const [filter, setFilter] = useState('all');
  const state = useNotificationsPage();

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={t('notifications.title')}
            subtitle={t('notifications.subtitle')}
            right={
              <div className={styles.filters}>
                {d.filters.map((f) => (
                  <FilterChip
                    key={f.key}
                    label={f.label}
                    count={f.count}
                    active={filter === f.key}
                    onClick={() => setFilter(f.key)}
                  />
                ))}
              </div>
            }
          />

          <div className={styles.list}>
            {d.groups.map((g) => (
              <div key={g.label}>
                <div className={styles.groupLabel}>{g.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {g.items
                    .filter((it) => filter === 'all' || matchesFilter(it, filter))
                    .map((it, i) => {
                      const c = notificationToneStyle(it.tone);
                      return (
                        <button key={i} className={styles.row} onClick={() => toast(it.title)}>
                          <div className={styles.icon} style={{ background: c.bg, color: c.fg, borderColor: c.border }}>
                            {it.icon === 'AI' ? (
                              <span className="sf-serif" style={{ fontWeight: 600, fontSize: 14 }}>
                                Ai
                              </span>
                            ) : (
                              <Icon name={it.icon} size={18} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</span>
                              <span className="sf-mono" style={{ fontSize: 10, color: 'var(--sf-muted)', whiteSpace: 'nowrap' }}>
                                {it.time}
                              </span>
                            </div>
                            <div style={{ marginTop: 3, fontSize: 13, color: 'var(--sf-muted)', lineHeight: 1.45 }}>
                              {it.body}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AsyncBoundary>
  );
}

function matchesFilter(item, filter) {
  if (filter === 'ai') return item.tone === 'ai';
  if (filter === 'print') return item.icon === 'print';
  if (filter === 'msg') return item.icon === 'chat';
  return true;
}
