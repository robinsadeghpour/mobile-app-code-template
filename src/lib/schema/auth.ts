import { z } from 'zod';
import { i18n } from '@/i18n';

// Factories, not consts: a const would freeze each message in the locale active at import.
const emailSchema = () => z.email(i18n.t('auth.validation_email_invalid'));

const requiredPasswordSchema = () => z.string().min(1, i18n.t('auth.validation_password_required'));

const newPasswordSchema = () =>
  z
    .string()
    .min(8, i18n.t('auth.validation_password_min'))
    .max(64, i18n.t('auth.validation_password_max'))
    .regex(/[a-z]/, i18n.t('auth.validation_password_lowercase'))
    .regex(/[A-Z]/, i18n.t('auth.validation_password_uppercase'))
    .regex(/[0-9]/, i18n.t('auth.validation_password_number'))
    .regex(/[^A-Za-z0-9]/, i18n.t('auth.validation_password_special'));

const confirmationMismatch = () => ({
  message: i18n.t('auth.validation_passwords_mismatch'),
  path: ['confirmPassword'],
});

export const signInSchema = () =>
  z.object({
    email: emailSchema(),
    // Not newPasswordSchema: an account made before those rules must still sign in with the password it has.
    password: requiredPasswordSchema(),
  });

export const signUpSchema = () =>
  z
    .object({
      email: emailSchema(),
      password: newPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, confirmationMismatch());

export const forgotPasswordSchema = () => z.object({ email: emailSchema() });

export const passwordFormSchema = (withCurrentPassword: boolean) =>
  z
    .object({
      currentPassword: withCurrentPassword ? requiredPasswordSchema() : z.string(),
      newPassword: newPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, confirmationMismatch())
    .refine((data) => !withCurrentPassword || data.newPassword !== data.currentPassword, {
      message: i18n.t('auth.change_password_same'),
      path: ['newPassword'],
    });

export type SignInValues = z.infer<ReturnType<typeof signInSchema>>;
export type SignUpValues = z.infer<ReturnType<typeof signUpSchema>>;
export type ForgotPasswordValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;
export type PasswordFormValues = z.infer<ReturnType<typeof passwordFormSchema>>;
