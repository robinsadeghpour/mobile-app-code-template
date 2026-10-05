import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { FormInput } from '@/components/auth/FormInput';
import { useSignInWithPassword } from '@/hooks/auth/useSignInWithPassword';
import { signInSchema, type SignInValues } from '@/lib/schema/auth';
import { i18n } from '@/i18n';

export function SignInForm() {
  const { control, handleSubmit, reset } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema()),
    defaultValues: { email: '', password: '' },
  });
  const { signInWithPassword, isLoading } = useSignInWithPassword();
  const submit = handleSubmit((values) => signInWithPassword(values, { onSuccess: () => reset() }));

  return (
    <View className="gap-4">
      <FormInput
        control={control}
        name="email"
        type="email"
        label={i18n.t('auth.email_label')}
        placeholder={i18n.t('auth.email_placeholder')}
        onSubmitEditing={submit}
      />
      <FormInput
        control={control}
        name="password"
        type="current-password"
        label={i18n.t('auth.password_label')}
        placeholder={i18n.t('auth.password_placeholder')}
        onSubmitEditing={submit}
      />
      <Link href="/forgot-password" className="self-end">
        <Text className="tablet:text-[17px] text-foreground text-[15px] underline">
          {i18n.t('auth.forgot_password_link')}
        </Text>
      </Link>
      <AppButton testID="auth-submit" label={i18n.t('auth.sign_in_button')} isLoading={isLoading} onPress={submit} />
    </View>
  );
}
