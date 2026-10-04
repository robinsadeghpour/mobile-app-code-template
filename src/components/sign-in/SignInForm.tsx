import { Keyboard, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as ExpoLink } from 'expo-router';
import { Button, Spinner } from 'heroui-native';
import { useSignInWithPassword } from '@/hooks/auth/useSignInWithPassword';
import { FormInput } from '@/components/auth/FormInput';
import { useIsTablet } from '@/components/ContentContainer';
import { signInSchema, type SignInSchemaType } from '@/lib/schema/signIn';
import { i18n } from '@/i18n';

export function SignInForm() {
  const isTablet = useIsTablet();
  const { control, handleSubmit, reset } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema()),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { signInWithPassword, isLoading } = useSignInWithPassword();

  const onSubmit = async (data: SignInSchemaType) => {
    await signInWithPassword({
      email: data.email,
      password: data.password,
      onSuccess: () => reset(),
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
          onSubmitEditing={handleKeyPress}
        />
        <FormInput
          control={control}
          name="password"
          label={i18n.t('auth.password_label')}
          placeholder={i18n.t('auth.password_placeholder')}
          secureTextEntry
          onSubmitEditing={handleKeyPress}
        />
      </View>
      <ExpoLink href="/forgot-password" className="self-end">
        <Text className="tablet:text-[17px] text-foreground text-[15px] underline">
          {i18n.t('auth.forgot_password_link')}
        </Text>
      </ExpoLink>
      <Button
        testID="auth-submit"
        variant="primary"
        size={isTablet ? 'lg' : 'md'}
        className="w-full rounded-full"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner /> : <Button.Label>{i18n.t('auth.sign_in_button')}</Button.Label>}
      </Button>
    </View>
  );
}
