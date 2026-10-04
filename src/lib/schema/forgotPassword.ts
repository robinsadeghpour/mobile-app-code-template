import { z } from 'zod';
import { i18n } from '@/i18n';

export const forgotPasswordSchema = () =>
  z.object({
    email: z.email(i18n.t('auth.validation_email_invalid')),
  });

export type ForgotPasswordValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;
