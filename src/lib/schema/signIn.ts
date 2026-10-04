import { z } from 'zod';
import { i18n } from '@/i18n';

export const signInSchema = () =>
  z.object({
    email: z.email(i18n.t('auth.validation_email_invalid')),
    // Deliberately not passwordSchema: an account made before those rules must still sign in with the password it has.
    password: z.string().min(1, i18n.t('auth.validation_password_required')),
  });

export type SignInSchemaType = z.infer<ReturnType<typeof signInSchema>>;
