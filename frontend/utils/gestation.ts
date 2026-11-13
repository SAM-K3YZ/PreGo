// Ported from the v1 Java HomePage.java logic (calculateDeliveryDate,
// determineAndDisplayTrimesterStage) using date-fns instead of ThreeTenABP.
// IMPORTANT: this client-side calculation is for display only. The backend
// recomputes the same values server-side (see backend/src/utils/trimesterCalc.ts)
// so nothing shown to a doctor is ever trusted from the client alone.

import { differenceInCalendarDays, addWeeks, isBefore } from 'date-fns';

export type Trimester = 'First' | 'Second' | 'Third';

export function calculateDeliveryDate(conceptionDate: string | Date): Date {
  return addWeeks(new Date(conceptionDate), 38);
}

export function getCountdown(estimatedDeliveryDate: Date): { days: number; passed: boolean } {
  const today = new Date();
  if (isBefore(today, estimatedDeliveryDate)) {
    const days = differenceInCalendarDays(estimatedDeliveryDate, today);
    return { days, passed: false };
  }
  return { days: 0, passed: true };
}

export function getTrimester(conceptionDate: string | Date): Trimester {
  const weeksSinceConception = Math.floor(
    differenceInCalendarDays(new Date(), new Date(conceptionDate)) / 7,
  );

  if (weeksSinceConception <= 12) return 'First';
  if (weeksSinceConception <= 27) return 'Second';
  return 'Third';
}
