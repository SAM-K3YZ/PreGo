import {
  getPhoneError,
  isValidResourceId,
  normalizeEmail,
  toNationalNumber,
} from '@/utils/validation';

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Ada@Example.COM ')).toBe('ada@example.com');
  });
});

describe('toNationalNumber', () => {
  it.each([
    ['0801 234 5678', '8012345678'], // trunk 0 dropped
    ['801-234-5678', '8012345678'],
    ['(0)801 234 5678', '8012345678'],
    ['8012345678', '8012345678'],
  ])('%s -> %s', (input, expected) => {
    expect(toNationalNumber(input)).toBe(expected);
  });
});

describe('getPhoneError', () => {
  it('waits until something is typed', () => {
    expect(getPhoneError('')).toBeUndefined();
  });

  it('accepts a normal number and rejects too short or too long ones', () => {
    expect(getPhoneError('0801 234 5678')).toBeUndefined();
    expect(getPhoneError('12345')).toBe('Enter a valid phone number');
    expect(getPhoneError('1234567890123')).toBe('Enter a valid phone number');
  });
});

describe('isValidResourceId', () => {
  it('allows safe ids and rejects path tricks', () => {
    expect(isValidResourceId('doctor-1')).toBe(true);
    expect(isValidResourceId('../patients/me')).toBe(false);
    expect(isValidResourceId(undefined)).toBe(false);
  });
});
