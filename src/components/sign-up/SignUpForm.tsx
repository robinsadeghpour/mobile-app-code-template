import { Keyboard, View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Spinner } from 'heroui-native';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { FormInput } from '@/components/auth/FormInput';
import { useIsTablet } from '@/components/ContentContainer';
import { signUpSchema, type SignUpSchemaType } from '@/lib/schema/signUp';
import { i18n } from '@/i18n';

export function SignUpForm() {
  const isTablet = useIsTablet();
  const { control, handleSubmit, reset } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { signUp, isLoading } = useSignUp();

  const onSubmit = async (data: SignUpSchemaType) => {
    await signUp({
      email: data.email,
      password: data.password,
      onSuccess: ({ needsEmailConfirmation }) => {
        reset();
        if (needsEmailConfirmation) {
          router.replace({ pathname: '/(public)/check-email', params: { email: data.email } });
        }
      },
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <View className="gap-4">
      <View className="gap-4">
        <FormInput
          control={control}
          name="email"
          label={i18n.t('auth.email_label')}
          placeholder={i18n.t('auth.email_placeholder')}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormInput
          control={control}
          name="password"
          label={i18n.t('auth.password_label')}
          placeholder={i18n.t('auth.password_placeholder')}
          secureTextEntry
        />
        <FormInput
          control={control}
          name="confirmPassword"
          label={i18n.t('auth.confirm_password_label')}
          placeholder={i18n.t('auth.confirm_password_placeholder')}
          secureTextEntry
          onSubmitEditing={handleKeyPress}
        />
      </View>

      <Button
        testID="auth-submit"
        variant="primary"
        size={isTablet ? 'lg' : 'md'}
        className="w-full rounded-full"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner /> : <Button.Label>{i18n.t('auth.sign_up_button')}</Button.Label>}
      </Button>
    </View>
  );
}
