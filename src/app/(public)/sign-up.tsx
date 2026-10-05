import { AuthScreen } from '@/components/auth/AuthScreen';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { i18n } from '@/i18n';

export default function SignUp() {
  return (
    <AuthScreen
      title={i18n.t('auth.sign_up_title')}
      switchPrompt={i18n.t('auth.have_account_prompt')}
      switchLabel={i18n.t('auth.sign_in_link')}
      switchHref="/sign-in"
    >
      <SignUpForm />
    </AuthScreen>
  );
}
