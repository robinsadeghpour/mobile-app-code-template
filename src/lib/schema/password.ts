import { z } from 'zod';
import { i18n } from '@/i18n';

// A factory, not a const: i18n.t() has to resolve after the startup locale is picked, or messages freeze in one.
export const passwordSchema = () =>
  z
    .string()
    .min(8, i18n.t('auth.validation_password_min'))
    .max(64, i18n.t('auth.validation_password_max'))
    .regex(/^(?=.*[a-z])/, i18n.t('auth.validation_password_lowercase'))
    .regex(/^(?=.*[A-Z])/, i18n.t('auth.validation_password_uppercase'))
    .regex(/^(?=.*[0-9])/, i18n.t('auth.validation_password_number'))
    .regex(/^(?=.*[!@#$%^&*])/, i18n.t('auth.validation_password_special'));
