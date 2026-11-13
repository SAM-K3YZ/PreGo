import { getBabySize, getCountdownText, getProgressPercent } from '@/utils/pregnancyProgress';
import type { Gestation } from '@/types';

const gestation = (overrides: Partial<Gestation>): Gestation => ({
  weeks: 22,
  days: 0,
  trimester: 'Second',
  dueDate: new Date(2026, 11, 14),
  daysToGo: 126,
  status: 'ongoing',
  postTerm: false,
  ...overrides,
});

describe('getProgressPercent', () => {
  it('measures against 40 weeks', () => {
    expect(getProgressPercent(gestation({ weeks: 22, days: 0 }))).toBe(55);
    expect(getProgressPercent(gestation({ weeks: 20, days: 0 }))).toBe(50);
  });

  it('caps at 100 after the due date', () => {
    expect(getProgressPercent(gestation({ weeks: 41, days: 3 }))).toBe(100);
  });
});

describe('getCountdownText', () => {
  it.each([
    [{ daysToGo: 126 }, '126 days to go'],
    [{ daysToGo: 1 }, '1 day to go'],
    [{ daysToGo: 0, status: 'due-today' as const }, 'Due today'],
    [{ daysToGo: -1, status: 'overdue' as const }, '1 day past due date'],
    [{ daysToGo: -5, status: 'overdue' as const }, '5 days past due date'],
  ])('%o -> %s', (overrides, expected) => {
    expect(getCountdownText(gestation(overrides))).toBe(expected);
  });
});

describe('getBabySize', () => {
  it('returns null before week 4', () => {
    expect(getBabySize(3)).toBeNull();
  });

  it('picks the entry for the week', () => {
    expect(getBabySize(4)).toBe('a poppy seed');
    expect(getBabySize(22)).toBe('a mango');
  });

  it('carries an entry forward until the next one starts', () => {
    expect(getBabySize(34)).toBe('a cantaloupe');
    expect(getBabySize(42)).toBe('a watermelon');
  });
});
