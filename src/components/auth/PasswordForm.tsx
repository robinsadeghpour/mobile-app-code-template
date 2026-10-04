import { Pressable, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';
import { Button, Spinner, useThemeColor } from 'heroui-native';
import { ContentContainer, useIsTablet } from '@/components/ContentContainer';
import { FormInput } from '@/components/auth/FormInput';
import { passwordFormSchema, type PasswordFormValues } from '@/lib/schema/passwordForm';
import { i18n } from '@/i18n';

type PasswordFormProps = {
  testIDPrefix: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  withCurrentPassword?: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (values: PasswordFormValues) => Promise<void>;
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
  const foregroundColor = useThemeColor('foreground');
  const isTablet = useIsTablet();

  const submit = () => void handleSubmit(onSubmit)();

  return (
    <ContentContainer>
      <View className="gap-6">
        <Pressable
          testID={`${testIDPrefix}-back`}
          accessibilityLabel={i18n.t('auth.back_button')}
          onPress={onBack}
          hitSlop={8}
          className="self-start"
        >
          <ArrowLeft size={isTablet ? 26 : 22} color={foregroundColor} />
        </Pressable>

        <View className="gap-1">
          <Text className="font-sans-semibold text-foreground text-[22px]">{title}</Text>
          <Text className="tablet:text-[17px] text-muted text-[15px]">{subtitle}</Text>
        </View>

        <View className="gap-4">
          {withCurrentPassword ? (
            <FormInput
              control={control}
              name="currentPassword"
              testIDPrefix={`${testIDPrefix}-current`}
              label={i18n.t('auth.current_password_label')}
              placeholder={i18n.t('auth.current_password_placeholder')}
              secureTextEntry
            />
          ) : null}
          <FormInput
            control={control}
            name="newPassword"
            testIDPrefix={`${testIDPrefix}-new`}
            label={i18n.t('auth.new_password_label')}
            placeholder={i18n.t('auth.new_password_placeholder')}
            secureTextEntry
          />
          <FormInput
            control={control}
            name="confirmPassword"
            testIDPrefix={`${testIDPrefix}-confirm`}
            label={i18n.t('auth.confirm_new_password_label')}
            placeholder={i18n.t('auth.confirm_new_password_placeholder')}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </View>

        <Button
          testID={`${testIDPrefix}-submit`}
          variant="primary"
          size={isTablet ? 'lg' : 'md'}
          className="w-full rounded-full"
          onPress={handleSubmit(onSubmit)}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : <Button.Label>{submitLabel}</Button.Label>}
        </Button>
      </View>
    </ContentContainer>
  );
}
