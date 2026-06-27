import type { Survey, SurveyResponse } from '@prisma/client';
import { loc, type Localized } from '../../shared/locale';

const pad = (n: number) => String(n).padStart(2, '0');

/** `DD.MM` — the compact date the history rows show. */
function dayMonth(d: Date): string {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
}

/** `DD.MM · HH:mm` — the deadline display string (plain, locale-agnostic). */
function deadlineLabel(d: Date): string {
  return `${dayMonth(d)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Localized "time remaining" leaf computed from now -> deadline. Mirrors the
 * fixture's `remaining` ({uz,ru,en}). Past deadlines collapse to a zero label.
 */
function remainingLabel(deadline: Date, now: Date): Localized {
  const ms = deadline.getTime() - now.getTime();
  if (ms <= 0) return loc('0 soat', '0 ч', '0 h');
  const totalHours = Math.floor(ms / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0 && hours > 0) {
    return loc(`${days} kun ${hours} soat`, `${days} дн ${hours} ч`, `${days} days ${hours} h`);
  }
  if (days > 0) {
    return loc(`${days} kun`, `${days} дн`, `${days} days`);
  }
  return loc(`${hours} soat`, `${hours} ч`, `${hours} h`);
}

/** Active-survey DTO — matches activeSurveysFixture field-for-field. */
export function mapActiveSurvey(survey: Survey, progress: number, now: Date) {
  const deadline = survey.deadlineAt;
  return {
    id: survey.id,
    title: survey.title, // localized
    issuer: survey.issuer, // localized
    deadline: deadline ? deadlineLabel(deadline) : '',
    remaining: deadline ? remainingLabel(deadline, now) : loc('—', '—', '—'),
    questions: survey.questions,
    estimate: survey.estimateLabel, // localized
    progress,
    urgent: survey.urgent,
  };
}

/** History-survey DTO — matches surveyHistoryFixture (+ real id/rating/comment the UI reads). */
export function mapHistorySurvey(survey: Survey, response: SurveyResponse) {
  const skipped = response.status === 'skipped';
  return {
    id: survey.id,
    title: survey.title, // localized
    issuer: survey.issuer, // localized
    status: skipped
      ? loc('O‘tkazib yuborilgan', 'Пропущено', 'Skipped')
      : loc('Topshirildi', 'Сдано', 'Submitted'),
    skipped,
    date: dayMonth(response.submittedAt),
    rating: response.rating, // number | null
    comment: response.comment, // string | null
  };
}
