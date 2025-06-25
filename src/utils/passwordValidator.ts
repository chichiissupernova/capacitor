
/**
 * Password validation utility to enforce strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  // Length check - minimum 8 characters
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Contains number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Contains special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats password validation errors as a single string
 */
export const getPasswordErrorMessage = (result: PasswordValidationResult): string => {
  if (result.isValid) return "";
  
  return result.errors.join(". ");
};
