import { View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@/components/AppButton';
import { FormInput } from '@/components/auth/FormInput';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { signUpSchema, type SignUpValues } from '@/lib/schema/auth';
import { i18n } from '@/i18n';

export function SignUpForm() {
  const { control, handleSubmit, reset } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema()),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const { signUp, isLoading } = useSignUp();

  const submit = handleSubmit(({ email, password }) =>
    signUp(
      { email, password },
      {
        onSuccess: ({ needsEmailConfirmation }) => {
          reset();
          if (needsEmailConfirmation) router.replace({ pathname: '/(public)/check-email', params: { email } });
        },
      },
    ),
  );

  return (
    <View className="gap-4">
      <FormInput
        control={control}
        name="email"
        type="email"
        label={i18n.t('auth.email_label')}
        placeholder={i18n.t('auth.email_placeholder')}
      />
      <FormInput
        control={control}
        name="password"
        type="new-password"
        label={i18n.t('auth.password_label')}
        placeholder={i18n.t('auth.password_placeholder')}
      />
      <FormInput
        control={control}
        name="confirmPassword"
        type="new-password"
        label={i18n.t('auth.confirm_password_label')}
        placeholder={i18n.t('auth.confirm_password_placeholder')}
        onSubmitEditing={submit}
      />
      <AppButton testID="auth-submit" label={i18n.t('auth.sign_up_button')} isLoading={isLoading} onPress={submit} />
    </View>
  );
}
