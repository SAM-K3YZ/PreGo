// Gestational age is counted from the LMP, ~14 days before conception (ACOG convention).

import { addDays, differenceInCalendarDays, isValid, parse, startOfDay } from 'date-fns';
import type { Gestation, Trimester } from '@/types';

const LMP_TO_CONCEPTION_DAYS = 14;
const CONCEPTION_TO_DUE_DAYS = 266;      // 38 weeks
const MAX_PLAUSIBLE_GESTATION_DAYS = 44 * 7;

/** Date-only strings ('YYYY-MM-DD' or an ISO datetime) are read as LOCAL calendar days. */
export function parseCalendarDate(input: string | Date): Date | null {
  if (input instanceof Date) return isValid(input) ? startOfDay(input) : null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(input);
  if (!match) return null;
  const parsed = parse(match[1], 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : null;
}

/** Returns null for missing, malformed, future or implausible dates. Never guesses. */
export function getGestation(conceptionDate: string | Date, now: Date = new Date()): Gestation | null {
  const conception = parseCalendarDate(conceptionDate);
  if (!conception) return null;

  const today = startOfDay(now);
  const daysSinceConception = differenceInCalendarDays(today, conception);
  const gestationalDays = daysSinceConception + LMP_TO_CONCEPTION_DAYS;
  if (daysSinceConception < 0 || gestationalDays > MAX_PLAUSIBLE_GESTATION_DAYS) return null;

  const weeks = Math.floor(gestationalDays / 7);
  const trimester: Trimester = weeks < 14 ? 'First' : weeks < 28 ? 'Second' : 'Third';

  const dueDate = addDays(conception, CONCEPTION_TO_DUE_DAYS);
  const daysToGo = differenceInCalendarDays(dueDate, today);

  return {
    weeks,
    days: gestationalDays % 7,
    trimester,
    dueDate,
    daysToGo,
    status: daysToGo > 0 ? 'ongoing' : daysToGo === 0 ? 'due-today' : 'overdue',
    postTerm: weeks >= 42,
  };
}