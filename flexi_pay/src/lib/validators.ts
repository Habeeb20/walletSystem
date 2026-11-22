// Each validator returns an error message, or null when the value is valid.
export type Validation = string | null;

const EMAIL_RE = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const Validators = {
  fullName(value?: string): Validation {
    if (!value) return 'Full name is required';
    if (value.length < 3) return 'Name must be at least 3 characters';
    return null;
  },

  email(value?: string): Validation {
    if (!value) return 'Email is required';
    if (!EMAIL_RE.test(value)) return 'Enter a valid email';
    return null;
  },

  phone(value?: string): Validation {
    if (!value) return 'Phone number is required';
    if (value.length < 10) return 'Enter a valid phone number';
    return null;
  },

  /** API requires: 8+ chars, uppercase, lowercase, number, special char. */
  password(value?: string): Validation {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain a special character';
    return null;
  },

  confirmPassword(value: string | undefined, password: string): Validation {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },

  username(value?: string): Validation {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed';
    return null;
  },

  verificationCode(value?: string): Validation {
    if (!value) return 'Verification code is required';
    if (value.length !== 4) return 'Code must be 4 digits';
    if (!/^[0-9]{4}$/.test(value)) return 'Code must contain only numbers';
    return null;
  },

  required(message: string) {
    return (value?: string): Validation => (!value || value.trim().length === 0 ? message : null);
  },

  /** At least 10 characters (phone, meter, smart card and account numbers). */
  minLength10(message: string) {
    return (value?: string): Validation => (!value || value.trim().length < 10 ? message : null);
  },
};

/** Runs a map of validators and returns only the failing fields. */
export function validate<K extends string>(checks: Record<K, Validation>): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  (Object.keys(checks) as K[]).forEach((key) => {
    const result = checks[key];
    if (result) errors[key] = result;
  });
  return errors;
}

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;
