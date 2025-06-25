
import { z } from 'zod';
import { validatePassword } from '@/utils/passwordValidator';

// Shared validation schemas for authentication forms
export const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });

// Enhanced password validation using our custom validator
export const passwordSchema = z.string()
  .min(1, "Password is required")
  .refine(
    (password) => validatePassword(password).isValid,
    {
      message: "Password doesn't meet security requirements"
    }
  );

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Signup form schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
