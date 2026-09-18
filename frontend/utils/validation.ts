const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getEmailError = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return undefined;
};

export const getPasswordError = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (value.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Add an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Add a lowercase letter';
  if (!/[0-9]/.test(value)) return 'Add a number';
  return undefined;
};
