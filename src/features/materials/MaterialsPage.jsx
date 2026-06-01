import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Chip, Icon, Stat } from '@/ui';
import { useMaterialsPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './materials.module.css';

const KIND_ICON = { pdf: 'pdf', video: 'video', doc: 'doc' };

export function MaterialsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useT();
  const state = useMaterialsPage();

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={t('materials.title')}
            subtitle={`${d.storage.fileCount} ${t('materials.files')} · ${d.storage.used} / ${d.storage.total}`}
            right={
              <Button variant="primary" icon="upload" onClick={() => toast(t('materials.upload'))}>
                {t('materials.upload')}
              </Button>
            }
          />

          <div className={styles.statGrid}>
            {d.stats.map((s, i) => (
              <Stat key={i} value={s.value} label={s.label} color={s.color} />
            ))}
          </div>

          <Card title={t('materials.recent')} padded={false}>
            {d.list.map((f) => (
              <div key={f.id} className={styles.row}>
                <div className={styles.thumb} style={{ background: f.color }}>
                  <Icon name={KIND_ICON[f.kind] ?? 'doc'} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{f.title}</span>
                    {f.aiSummary && <Chip tone="ai">{t('materials.aiSummary')}</Chip>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 2 }}>
                    <span className="sf-mono">{f.meta}</span> · {f.views} {t('materials.viewed')} · {f.date}
                  </div>
                </div>
                <button className={styles.iconBtn} onClick={() => toast(f.title)}>
                  <Icon name="download" size={16} />
                </button>
                <button className={styles.iconBtn} onClick={() => navigate('/print')}>
                  <Icon name="print" size={16} />
                </button>
                <button className={styles.iconBtn} onClick={() => toast(f.title)}>
                  <Icon name="more" size={16} />
                </button>
              </div>
            ))}
          </Card>
        </>
      )}
    </AsyncBoundary>
  );
}
