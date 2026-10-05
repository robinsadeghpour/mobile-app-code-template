import { AuthScreen } from '@/components/auth/AuthScreen';
import { SignInForm } from '@/components/auth/SignInForm';
import { i18n } from '@/i18n';

export default function SignIn() {
  return (
    <AuthScreen
      title={i18n.t('auth.sign_in_title')}
      switchPrompt={i18n.t('auth.no_account_prompt')}
      switchLabel={i18n.t('auth.sign_up_link')}
      switchHref="/sign-up"
    >
      <SignInForm />
    </AuthScreen>
  );
}
