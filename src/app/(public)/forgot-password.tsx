import { Pressable, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';
import { Button, Spinner, useThemeColor } from 'heroui-native';
import { useRouter } from 'expo-router';
import { GuestLayout } from '@/components/GuestLayout';
import { ContentContainer, useIsTablet } from '@/components/ContentContainer';
import { FormInput } from '@/components/auth/FormInput';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/schema/forgotPassword';
import { i18n } from '@/i18n';

export default function ForgotPasswordScreen() {
  const { control, handleSubmit, reset } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema()),
    defaultValues: { email: '' },
  });
  const { resetPassword, isLoading } = useResetPassword();
  const router = useRouter();
  const foregroundColor = useThemeColor('foreground');
  const isTablet = useIsTablet();

  const onSubmit = async (data: ForgotPasswordValues) => {
    await resetPassword({ email: data.email, onSuccess: () => reset() });
  };

  return (
    <GuestLayout>
      <View className="flex-1 justify-center">
        <ContentContainer>
          <View className="gap-6">
            <Pressable
              testID="auth-forgot-password-back"
              accessibilityLabel={i18n.t('auth.back_button')}
              onPress={() => router.back()}
              hitSlop={8}
              className="self-start"
            >
              <ArrowLeft size={isTablet ? 26 : 22} color={foregroundColor} />
            </Pressable>
            <View className="gap-1">
              <Text className="font-sans-semibold text-foreground text-[22px]">
                {i18n.t('auth.forgot_password_title')}
              </Text>
              <Text className="tablet:text-[17px] text-muted text-[15px]">
                {i18n.t('auth.forgot_password_subtitle')}
              </Text>
            </View>

            <FormInput
              control={control}
              name="email"
              testIDPrefix="auth-forgot-password-email"
              label={i18n.t('auth.email_label')}
              placeholder={i18n.t('auth.email_placeholder')}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={() => void handleSubmit(onSubmit)()}
            />
            <Button
              testID="auth-forgot-password-submit"
              variant="primary"
              size={isTablet ? 'lg' : 'md'}
              className="w-full rounded-full"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner /> : <Button.Label>{i18n.t('auth.send_link_button')}</Button.Label>}
            </Button>
          </View>
        </ContentContainer>
      </View>
    </GuestLayout>
  );
}
