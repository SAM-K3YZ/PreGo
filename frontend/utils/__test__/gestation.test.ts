import { addDays } from 'date-fns';
import { getGestation, parseCalendarDate } from '@/utils/gestation';

const conception = '2026-01-01';
const at = (daysAfter: number) => addDays(parseCalendarDate(conception)!, daysAfter);

describe('getGestation', () => {
  it.each([
    [83, 'First'], [84, 'Second'],      // 13w6d -> 14w0d
    [181, 'Second'], [182, 'Third'],    // 27w6d -> 28w0d
  ])('day %i after conception is %s trimester', (d, expected) => {
    expect(getGestation(conception, at(d))!.trimester).toBe(expected);
  });

  it('reports weeks and days', () => {
    const g = getGestation(conception, at(0))!;
    expect([g.weeks, g.days]).toEqual([2, 0]);
  });

  it('handles due date states', () => {
    expect(getGestation(conception, at(265))!.status).toBe('ongoing');
    expect(getGestation(conception, at(266))!.status).toBe('due-today');
    expect(getGestation(conception, at(267))!.status).toBe('overdue');
  });

  it('flags post-term at 42w0d', () => {
    expect(getGestation(conception, at(279))!.postTerm).toBe(false);
    expect(getGestation(conception, at(280))!.postTerm).toBe(true);
  });

  it('rejects bad input instead of guessing', () => {
    expect(getGestation('garbage')).toBeNull();
    expect(getGestation('2026-02-31')).toBeNull();                 // impossible date
    expect(getGestation(conception, at(-1))).toBeNull();           // future conception
    expect(getGestation(conception, at(400))).toBeNull();          // implausibly old
  });

  it('is timezone-stable for ISO datetimes', () => {
    expect(getGestation('2026-01-01T00:00:00.000Z', at(84))!.trimester).toBe('Second');
  });
});