import { z } from 'zod';
import { i18n } from '@/i18n';
import { passwordSchema } from '@/lib/schema/password';

export const signUpSchema = () =>
  z
    .object({
      email: z.email(i18n.t('auth.validation_email_invalid')),
      password: passwordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t('auth.validation_passwords_mismatch'),
      path: ['confirmPassword'],
    });

export type SignUpSchemaType = z.infer<ReturnType<typeof signUpSchema>>;
