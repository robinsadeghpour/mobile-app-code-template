import { useState } from 'react';
import { Pressable, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FieldError, Input, Label, TextField, useThemeColor } from 'heroui-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useIsTablet } from '@/hooks/useIsTablet';
import { i18n } from '@/i18n';

const INPUT_PROPS = {
  email: { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'email' },
  'current-password': { autoComplete: 'current-password' },
  'new-password': { autoComplete: 'new-password' },
} satisfies Record<string, TextInputProps>;

type FormInputProps<T extends FieldValues> = Pick<TextInputProps, 'onSubmitEditing' | 'returnKeyType'> & {
  control: Control<T>;
  name: Path<T>;
  type: keyof typeof INPUT_PROPS;
  label: string;
  placeholder: string;
  testIDPrefix?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
  testIDPrefix = `auth-${name}`,
  ...inputProps
}: FormInputProps<T>) {
  const isPassword = type !== 'email';
  const [hidden, setHidden] = useState(isPassword);
  const mutedColor = useThemeColor('muted');
  const isTablet = useIsTablet();
  const VisibilityIcon = hidden ? EyeOff : Eye;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextField isInvalid={!!error}>
          <Label>
            <Label.Text className="tablet:text-[17px]">{label}</Label.Text>
          </Label>
          <View className="w-full flex-row items-center">
            <Input
              testID={`${testIDPrefix}-input`}
              placeholder={placeholder}
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={hidden}
              className={`tablet:min-h-14 tablet:px-4 tablet:text-[17px] flex-1 ${isPassword ? 'tablet:pr-14 pr-11' : ''}`}
              {...INPUT_PROPS[type]}
              {...inputProps}
            />
            {isPassword ? (
              <Pressable
                testID={`${testIDPrefix}-toggle-visibility`}
                accessibilityRole="button"
                accessibilityLabel={i18n.t(hidden ? 'auth.show_password' : 'auth.hide_password')}
                className="tablet:right-5 absolute right-4"
                onPress={() => setHidden((previous) => !previous)}
                hitSlop={8}
              >
                <VisibilityIcon size={isTablet ? 22 : 18} color={mutedColor} />
              </Pressable>
            ) : null}
          </View>
          {error ? <FieldError>{error.message}</FieldError> : null}
        </TextField>
      )}
    />
  );
}
