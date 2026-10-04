import { z } from 'zod';
import { i18n } from '@/i18n';
import { passwordSchema } from '@/lib/schema/password';

export const passwordFormSchema = (withCurrentPassword: boolean) =>
  z
    .object({
      currentPassword: withCurrentPassword
        ? z.string().min(1, i18n.t('auth.validation_password_required'))
        : z.string(),
      newPassword: passwordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: i18n.t('auth.validation_passwords_mismatch'),
      path: ['confirmPassword'],
    })
    .refine((data) => !withCurrentPassword || data.newPassword !== data.currentPassword, {
      message: i18n.t('auth.change_password_same'),
      path: ['newPassword'],
    });

export type PasswordFormValues = z.infer<ReturnType<typeof passwordFormSchema>>;
