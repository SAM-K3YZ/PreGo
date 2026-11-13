const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// What we send to the server: no stray spaces, one case (accounts are stored lowercase).
export const normalizeEmail = (value: string) => value.trim().toLowerCase();

// The national part of a phone number: digits only, without the trunk '0'
// (e.g. '0801 234 5678' -> '8012345678'), so it can follow a dial code like +234.
export const toNationalNumber = (value: string) => value.replace(/\D/g, '').replace(/^0+/, '');

export const getPhoneError = (value: string): string | undefined => {
  if (value.trim().length === 0) return undefined;
  const digits = toNationalNumber(value).length;
  if (digits < 7 || digits > 12) return 'Enter a valid phone number';
  return undefined;
};

export const getEmailError = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return undefined;
};

// Ids from route params or deep links. Letters, digits, '-' and '_' only, so an
// id can never add path segments (e.g. '../patients/me') to an API URL.
const RESOURCE_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

export const isValidResourceId = (value: unknown): value is string =>
  typeof value === 'string' && RESOURCE_ID_REGEX.test(value);

export const getPasswordError = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (value.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Add an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Add a lowercase letter';
  if (!/[0-9]/.test(value)) return 'Add a number';
  return undefined;
};
