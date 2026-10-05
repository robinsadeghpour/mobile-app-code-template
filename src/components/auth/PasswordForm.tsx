import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@/components/AppButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { FormInput } from '@/components/auth/FormInput';
import { passwordFormSchema, type PasswordFormValues } from '@/lib/schema/auth';
import { i18n } from '@/i18n';

type PasswordFormProps = {
  testIDPrefix: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  withCurrentPassword?: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (values: PasswordFormValues) => void;
};

export function PasswordForm({
  testIDPrefix,
  title,
  subtitle,
  submitLabel,
  withCurrentPassword = false,
  isSubmitting,
  onBack,
  onSubmit,
}: PasswordFormProps) {
  const { control, handleSubmit } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema(withCurrentPassword)),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const submit = handleSubmit(onSubmit);

  return (
    <View className="gap-6">
      <ScreenTitle title={title} subtitle={subtitle} onBack={onBack} backTestID={`${testIDPrefix}-back`} />

      <View className="gap-4">
        {withCurrentPassword ? (
          <FormInput
            control={control}
            name="currentPassword"
            type="current-password"
            testIDPrefix={`${testIDPrefix}-current`}
            label={i18n.t('auth.current_password_label')}
            placeholder={i18n.t('auth.current_password_placeholder')}
          />
        ) : null}
        <FormInput
          control={control}
          name="newPassword"
          type="new-password"
          testIDPrefix={`${testIDPrefix}-new`}
          label={i18n.t('auth.new_password_label')}
          placeholder={i18n.t('auth.new_password_placeholder')}
        />
        <FormInput
          control={control}
          name="confirmPassword"
          type="new-password"
          testIDPrefix={`${testIDPrefix}-confirm`}
          label={i18n.t('auth.confirm_new_password_label')}
          placeholder={i18n.t('auth.confirm_new_password_placeholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>

      <AppButton testID={`${testIDPrefix}-submit`} label={submitLabel} isLoading={isSubmitting} onPress={submit} />
    </View>
  );
}
