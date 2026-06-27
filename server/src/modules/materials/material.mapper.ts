import type { Material } from '@prisma/client';
import { loc, type Localized } from '../../shared/locale';
import { MaterialKind } from '../../domain/enums';

/** Per-kind tile descriptor (label + colour) for the stats strip. */
interface KindMeta {
  kind: string;
  label: string | Localized;
  color: string;
}

/**
 * Stable stat-tile order matching materialStatsFixture: PDF, Video, Exercise
 * (Mashq → doc), Test. Counts are COMPUTED from rows; a kind with no rows shows 0.
 */
const STAT_KINDS: readonly KindMeta[] = [
  { kind: MaterialKind.PDF, label: 'PDF', color: 'var(--sf-danger)' },
  { kind: MaterialKind.VIDEO, label: loc('Video', 'Видео', 'Video'), color: 'var(--sf-primary)' },
  { kind: MaterialKind.DOC, label: loc('Mashq', 'Упражн.', 'Exercise'), color: 'var(--sf-accent)' },
  { kind: 'test', label: loc('Test', 'Тест', 'Test'), color: 'var(--sf-success)' },
];

/** Per-kind thumbnail colour, mirroring the fixture's `color` field. */
const KIND_COLOR: Record<string, string> = {
  [MaterialKind.PDF]: 'var(--sf-danger)',
  [MaterialKind.VIDEO]: 'var(--sf-primary)',
  [MaterialKind.DOC]: 'var(--sf-accent)',
};

/** Material DTO — matches materialsFixture entries (localized leaves passed through). */
export function mapMaterial(material: Material) {
  return {
    id: material.id,
    title: material.title, // mixed (localized or plain)
    meta: material.meta, // mixed (localized or plain) — e.g. "2.1 MB · 8 bet"
    kind: material.kind,
    color: KIND_COLOR[material.kind] ?? 'var(--sf-accent)',
    views: material.views,
    date: deriveDate(material.createdAt), // localized display, e.g. "14 May"
    aiSummary: material.aiSummary,
  };
}

/** Stats DTO — matches materialStatsFixture (computed per-kind counts). */
export function mapStats(countByKind: Map<string, number>) {
  return STAT_KINDS.map((k) => ({
    value: String(countByKind.get(k.kind) ?? 0),
    label: k.label,
    color: k.color,
  }));
}

/** Storage DTO — matches materialStorageFixture: { used, total, fileCount }. */
export function mapStorage(usedBytes: number, fileCount: number) {
  return {
    used: humanizeBytes(usedBytes),
    total: humanizeBytes(STORAGE_QUOTA_BYTES),
    fileCount,
  };
}

// --- helpers ----------------------------------------------------------------

/** Fixed per-teacher storage quota (12.5 GB) — the denominator the UI shows. */
const STORAGE_QUOTA_BYTES = Math.round(12.5 * 1024 * 1024 * 1024);

const MONTHS_UZ = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Build a localized day/month label like fixture's { uz:'14 May', ru:'14 мая', en:'14 May' }. */
function deriveDate(at: Date): Localized {
  const d = at.getUTCDate();
  const m = at.getUTCMonth();
  return loc(`${d} ${MONTHS_UZ[m]}`, `${d} ${MONTHS_RU[m]}`, `${d} ${MONTHS_EN[m]}`);
}

/** Humanize a byte count to the unit the fixture uses (KB/MB/GB), matching its precision. */
function humanizeBytes(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (bytes >= GB) return `${(bytes / GB).toFixed(1)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${Math.round(bytes / KB)} KB`;
  return `${bytes} B`;
}
