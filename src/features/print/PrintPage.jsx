import { useState } from 'react';
import { PageHeader } from '@/layout/PageHeader.jsx';
import { AsyncBoundary } from '@/layout/PageState.jsx';
import { Button, Card, Chip, Icon, ProgressBar, Segmented, Stepper, StarMark } from '@/ui';
import { printerStatusTone } from '@/domain/models/print.js';
import { usePrintPage } from '@/hooks/data.js';
import { useToast } from '@/hooks/useToast.js';
import { useT } from '@/hooks/useT.js';
import styles from './print.module.css';

const PAGES_PER_COPY = 8;

function QuickPrint({ library }) {
  const toast = useToast();
  const { t: tt } = useT();
  const [source, setSource] = useState('library');
  const [copies, setCopies] = useState(24);
  const [format, setFormat] = useState('A4');
  const [color, setColor] = useState('bw');
  const [side, setSide] = useState('2');

  const total = copies * PAGES_PER_COPY;

  return (
    <Card title={tt('print.quick')}>
      <div className={styles.quick}>
        <div className={styles.source}>
          <button
            className={`${styles.sourceBtn} ${source === 'library' ? styles.sourceOn : ''}`}
            onClick={() => setSource('library')}
          >
            <Icon name="folder" size={18} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{tt('print.fromLibrary')}</div>
              <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{library.fileCount} {tt('print.files')}</div>
            </div>
          </button>
          <button
            className={`${styles.sourceBtn} ${source === 'upload' ? styles.sourceOn : ''}`}
            onClick={() => {
              setSource('upload');
              toast(tt('print.upload'));
            }}
          >
            <Icon name="upload" size={18} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{tt('print.upload')}</div>
              <div style={{ fontSize: 10, color: 'var(--sf-muted)' }}>{tt('print.uploadHint')}</div>
            </div>
          </button>
        </div>

        <div className={styles.formRow}>
          <span className={styles.formL}>{tt('print.copies')}</span>
          <Stepper value={copies} min={1} onChange={setCopies} />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formL}>{tt('print.format')}</span>
          <Segmented
            value={format}
            onChange={setFormat}
            options={[
              { value: 'A4', label: 'A4' },
              { value: 'A5', label: 'A5' },
              { value: 'A3', label: 'A3' },
            ]}
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formL}>{tt('print.color')}</span>
          <Segmented
            value={color}
            onChange={setColor}
            options={[
              { value: 'bw', label: tt('print.bw') },
              { value: 'color', label: tt('print.colorful') },
            ]}
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formL}>{tt('print.side')}</span>
          <Segmented
            value={side}
            onChange={setSide}
            options={[
              { value: '1', label: '1 ↕' },
              { value: '2', label: '2 ↔' },
            ]}
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formL}>{tt('print.time')}</span>
          <span style={{ fontSize: 12, color: 'var(--sf-primary)', fontWeight: 600 }}>{tt('print.timeValue')}</span>
        </div>

        <div className={styles.sum}>
          <div className={styles.sumRow}>
            <span style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              {tt('print.final')}
            </span>
            <StarMark size={20} color="var(--sf-accent)" />
          </div>
          <div className="sf-mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            {copies} × {PAGES_PER_COPY} = {total} {tt('print.pages')}
          </div>
          <div style={{ marginTop: 2, fontSize: 11, opacity: 0.7 }}>
            {format} · {color === 'bw' ? tt('print.bw') : tt('print.colorful')} · {side} {tt('print.sided')} · HP LaserJet
          </div>
        </div>
        <Button
          variant="primary"
          block
          icon="arrowR"
          iconRight
          onClick={() => toast(`${total} ${tt('print.pages')} ${tt('print.queueToast')}`, 'success')}
        >
          {tt('print.addQueue')}
        </Button>
      </div>
    </Card>
  );
}

export function PrintPage() {
  const toast = useToast();
  const { t: tt } = useT();
  const state = usePrintPage();

  return (
    <AsyncBoundary state={state}>
      {(d) => (
        <>
          <PageHeader
            title={tt('print.title')}
            subtitle={tt('print.subtitle')}
            right={
              <Button variant="primary" icon="plus" onClick={() => toast(tt('print.newPrint'))}>
                {tt('print.newPrint')}
              </Button>
            }
          />

          <div className={styles.grid}>
            <div>
              <h3 className={styles.sectionH}>{tt('print.myQueue')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {d.jobs.map((j) => (
                  <Card key={j.id} padded={false}>
                    <div style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'center' }}>
                      <div className={styles.docThumb}>
                        <Icon name={j.icon ?? 'doc'} size={22} />
                        <div className={styles.docMult}>×{j.copies}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{j.doc}</div>
                          <Chip tone={j.state === 'now' ? 'primary' : 'accent'}>
                            {j.state === 'now' ? tt('print.printing') : tt('print.queued')}
                          </Chip>
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--sf-muted)' }}>
                          {j.size} · {j.printer}
                        </div>
                        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                          <ProgressBar
                            value={j.progress}
                            height={6}
                            color={j.state === 'now' ? 'var(--sf-primary)' : 'var(--sf-accent)'}
                          />
                          <span className="sf-mono" style={{ fontSize: 11, color: 'var(--sf-muted)', whiteSpace: 'nowrap' }}>
                            {j.state === 'now' ? `${j.progress}%` : j.eta.split(' · ')[1]}
                          </span>
                        </div>
                        <div className="sf-mono" style={{ marginTop: 4, fontSize: 10, color: 'var(--sf-muted)' }}>
                          {j.eta}
                        </div>
                      </div>
                      <button className={styles.iconBtn} onClick={() => toast(j.doc)}>
                        <Icon name="more" size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              <h3 className={styles.sectionH} style={{ marginTop: 28 }}>
                {tt('print.printers')}
              </h3>
              <div className={styles.printersGrid}>
                {d.printers.map((p) => (
                  <Card key={p.id} padded={false}>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={styles.printerIcon} style={{ color: p.accent }}>
                          <Icon name="print" size={26} />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 4,
                              right: 4,
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: p.accent,
                              border: '2px solid var(--sf-surface)',
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</span>
                            {p.color && <Chip tone="accent">{tt('print.colorful')}</Chip>}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--sf-muted)', marginTop: 1 }}>
                            {p.location} · {p.sizes}
                          </div>
                        </div>
                        <Chip tone={printerStatusTone(p.status)}>
                          {p.status === 'free' ? tt('print.free') : p.status === 'busy' ? `${p.queue} ${tt('print.queueWord')}` : tt('print.locked')}
                        </Chip>
                      </div>
                      <div className={styles.printerEta}>
                        <Icon name="clock" size={14} style={{ color: p.accent }} />
                        <span style={{ flex: 1 }}>{p.eta}</span>
                        {p.status !== 'locked' && (
                          <Button variant="soft" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toast(p.name, 'success')}>
                            {tt('print.send')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <QuickPrint library={d.library} />
          </div>
        </>
      )}
    </AsyncBoundary>
  );
}
