import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, FilterChip, Icon } from '@/ui';
import { notificationToneStyle } from '@/domain/models/notification.js';
import { useNotificationsPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './notifications.module.css';

export function NotificationsPage() {
  const toast = useToast();
  const { t } = useT();
  const [filter, setFilter] = useState('all');
  const [read, setRead] = useState({});
  const state = useNotificationsPage();

  // Single source of truth for a row's stable read-state key. Per-row dim and
  // mark-all MUST derive the key identically, so both go through this helper.
  const rowKey = (groupLabel, item) => `${groupLabel}-${item.title}-${item.time}`;

  const markRead = (key) => {
    setRead((r) => ({ ...r, [key]: true }));
    toast(t('notifications.markedRead'));
  };

  const markAllRead = (groups) => {
    setRead((r) => {
      const next = { ...r };
      for (const g of groups) {
        for (const it of g.items) next[rowKey(g.label, it)] = true;
      }
      return next;
    });
    toast(t('notifications.allRead'));
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={t('notifications.title')}
            subtitle={t('notifications.subtitle')}
            right={
              <>
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
                <Button variant="soft" icon="check" onClick={() => markAllRead(d.groups)}>
                  {t('notifications.markAll')}
                </Button>
              </>
            }
          />

          <div className={styles.list}>
            {d.groups.map((g) => (
              <div key={g.label}>
                <div className={styles.groupLabel}>{g.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {g.items
                    .filter((it) => filter === 'all' || matchesFilter(it, filter))
                    .map((it) => {
                      const c = notificationToneStyle(it.tone);
                      // Stable key from resolved content, not the post-filter
                      // index — otherwise read-state mislabels rows when the
                      // active filter changes the list order/length. Derived via
                      // rowKey so per-row and mark-all stay perfectly in sync.
                      const key = rowKey(g.label, it);
                      const isRead = read[key];
                      return (
                        <button
                          key={key}
                          className={styles.row}
                          style={{ opacity: isRead ? 0.5 : 1 }}
                          onClick={() => markRead(key)}
                        >
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
  switch (filter) {
    case 'ai':
      return item.tone === 'ai';
    case 'print':
      return item.icon === 'print';
    case 'msg':
      return item.icon === 'chat';
    case 'all':
      return true;
    default:
      // Unknown filter key: match nothing rather than silently showing everything.
      return false;
  }
}
