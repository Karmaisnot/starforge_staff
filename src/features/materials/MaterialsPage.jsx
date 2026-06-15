import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Chip, Icon, Stat } from '@/ui';
import { useMaterialsPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import { plural } from '@/i18n/plural.js';
import styles from './materials.module.css';

const KIND_ICON = { pdf: 'pdf', video: 'video', doc: 'doc' };

const EXT_KIND = { pdf: 'pdf', mp4: 'video', mov: 'video', avi: 'video', doc: 'doc', docx: 'doc' };

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MaterialsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t, locale } = useT();
  const state = useMaterialsPage();
  const fileRef = useRef(null);
  const [uploaded, setUploaded] = useState([]);
  const [removed, setRemoved] = useState({});

  const removeFile = (file) => {
    setUploaded((list) => list.filter((f) => f.id !== file.id));
    setRemoved((r) => ({ ...r, [file.id]: true }));
    toast(`${t('materials.removed')} · ${file.title}`);
  };

  const onPick = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const now = new Date().toLocaleDateString();
    const items = files.map((f, i) => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      return {
        id: `up-${Date.now()}-${i}`,
        title: f.name,
        kind: EXT_KIND[ext] ?? 'doc',
        color: 'var(--sf-primary)',
        meta: `${(ext || 'file').toUpperCase()} · ${humanSize(f.size)}`,
        views: 0,
        date: now,
      };
    });
    setUploaded((list) => [...items, ...list]);
    toast(`+ ${files.length} ${plural(locale, 'files', files.length)}`, 'success');
    e.target.value = '';
  };

  // Real client-side download of the (placeholder) material payload.
  const download = (file) => {
    const blob = new Blob([`StarForge EDU · ${file.title}\n${file.meta ?? ''}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={t('materials.title')}
            subtitle={`${d.storage.fileCount} ${plural(locale, 'files', d.storage.fileCount)} · ${d.storage.used} / ${d.storage.total}`}
            right={
              <>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={onPick}
                />
                <Button variant="primary" icon="upload" onClick={() => fileRef.current?.click()}>
                  {t('materials.upload')}
                </Button>
              </>
            }
          />

          <div className={styles.statGrid}>
            {d.stats.map((s, i) => (
              <Stat key={i} value={s.value} label={s.label} color={s.color} />
            ))}
          </div>

          <Card title={t('materials.recent')} padded={false}>
            {[...uploaded, ...d.list].filter((f) => !removed[f.id]).map((f) => (
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
                    <span className="sf-mono">{f.meta}</span> · {f.views} {plural(locale, 'views', f.views)} · {f.date}
                  </div>
                </div>
                <button className={styles.iconBtn} onClick={() => download(f)} aria-label={t('materials.download')}>
                  <Icon name="download" size={16} />
                </button>
                <button className={styles.iconBtn} onClick={() => navigate('/print')} aria-label={t('print.title')}>
                  <Icon name="print" size={16} />
                </button>
                <button className={styles.iconBtn} onClick={() => removeFile(f)} aria-label={t('materials.removed')}>
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
          </Card>
        </>
      )}
    </AsyncBoundary>
  );
}
