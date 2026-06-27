import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, FilterChip, Icon } from '@/ui';
import { notificationToneStyle } from '@/domain/models/notification.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useServices } from '@/hooks/useServices.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './notifications.module.css';

export function NotificationsPage() {
  const { notifications } = useServices();
  const toast = useToast();
  const { t, locale } = useT();
  const [filter, setFilter] = useState('all');
  // Optimistic read-state scratch, keyed by the backend item id. The server is
  // the source of truth (`it.read`); a refetch after a successful write clears
  // the need for this overlay, but we keep entries until then so the dimming
  // never flickers off mid-reconcile.
  const [read, setRead] = useState({});
  // Bumping this re-runs the loaders so the server truth (unread counts +
  // per-row read flags) reconciles after a mark-read write.
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = () => setReloadKey((k) => k + 1);

  const state = useAsync(
    () =>
      Promise.all([notifications.getGroups(), notifications.getFilters()]).then(
        ([groups, filters]) => ({ groups, filters }),
      ),
    [locale, reloadKey],
  );

  // A row is dimmed if the server already flagged it read, or we optimistically
  // marked it so this session.
  const isRowRead = (item) => Boolean(item.read) || Boolean(read[item.id]);

  const markRead = (id) => {
    // (a) optimistic local update — instant visual dim.
    setRead((r) => ({ ...r, [id]: true }));
    toast(t('notifications.markedRead'));
    // (b) persist, (c) reconcile from server, (d) roll back + surface on failure.
    (async () => {
      try {
        await notifications.markRead(id);
        refetch();
      } catch {
        setRead((r) => {
          const next = { ...r };
          delete next[id];
          return next;
        });
        toast(t('common.error'), 'error');
      }
    })();
  };

  const markAllRead = (groups) => {
    // (a) optimistic: dim every currently-rendered row.
    const ids = groups.flatMap((g) => g.items.map((it) => it.id));
    setRead((r) => {
      const next = { ...r };
      for (const id of ids) next[id] = true;
      return next;
    });
    toast(t('notifications.allRead'));
    (async () => {
      try {
        await notifications.markAllRead();
        refetch();
      } catch {
        setRead((r) => {
          const next = { ...r };
          for (const id of ids) delete next[id];
          return next;
        });
        toast(t('common.error'), 'error');
      }
    })();
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
                      // Stable key from the backend item id — survives filter
                      // changes and is also the id we persist read-state under,
                      // so per-row and mark-all stay perfectly in sync.
                      const isRead = isRowRead(it);
                      return (
                        <button
                          key={it.id}
                          className={styles.row}
                          style={{ opacity: isRead ? 0.5 : 1 }}
                          onClick={() => markRead(it.id)}
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
