import { BABY_SIZES } from '@/constants/babySizes';
import type { Gestation } from '@/types';

export const FULL_TERM_WEEKS = 40;
const FULL_TERM_DAYS = FULL_TERM_WEEKS * 7;

/** How far through a 40-week pregnancy, 0–100 (capped at 100 after the due date). */
export function getProgressPercent({ weeks, days }: Gestation): number {
  const percent = Math.round(((weeks * 7 + days) / FULL_TERM_DAYS) * 100);
  return Math.min(100, Math.max(0, percent));
}

/** "126 days to go", "1 day to go", "Due today", "3 days past due date". */
export function getCountdownText({ status, daysToGo }: Gestation): string {
  if (status === 'due-today') return 'Due today';
  if (status === 'overdue') {
    const late = Math.abs(daysToGo);
    return `${late} ${late === 1 ? 'day' : 'days'} past due date`;
  }
  return `${daysToGo} ${daysToGo === 1 ? 'day' : 'days'} to go`;
}

/** Size comparison for the given week, e.g. "a mango". Null before week 4. */
export function getBabySize(weeks: number): string | null {
  let size: string | null = null;
  for (const entry of BABY_SIZES) {
    if (entry.fromWeek > weeks) break;
    size = entry.item;
  }
  return size;
}
