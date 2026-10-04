import { useState } from 'react';
import { Pressable, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FieldError, Input, Label, TextField, useThemeColor } from 'heroui-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { useIsTablet } from '@/components/ContentContainer';

interface FormInputProps<T extends FieldValues>
  extends Pick<TextInputProps, 'onSubmitEditing' | 'returnKeyType' | 'autoCapitalize'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  testIDPrefix?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  testIDPrefix,
  ...inputProps
}: FormInputProps<T>) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const mutedColor = useThemeColor('muted');
  const isTablet = useIsTablet();
  const eyeIconSize = isTablet ? 22 : 18;
  const idPrefix = testIDPrefix ?? `auth-${name}`;

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
              testID={`${idPrefix}-input`}
              placeholder={placeholder}
              value={value as string | undefined}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={secureTextEntry && hidden}
              className={
                secureTextEntry
                  ? 'tablet:min-h-14 tablet:px-4 tablet:pr-14 tablet:text-[17px] flex-1 pr-11'
                  : 'tablet:min-h-14 tablet:px-4 tablet:text-[17px] flex-1'
              }
              {...inputProps}
            />
            {secureTextEntry ? (
              <Pressable
                testID={`${idPrefix}-toggle-visibility`}
                className="tablet:right-5 absolute right-4"
                onPress={() => setHidden((prev) => !prev)}
                hitSlop={8}
              >
                {hidden ? (
                  <EyeOff size={eyeIconSize} color={mutedColor} />
                ) : (
                  <Eye size={eyeIconSize} color={mutedColor} />
                )}
              </Pressable>
            ) : null}
          </View>
          {error ? <FieldError>{error.message}</FieldError> : null}
        </TextField>
      )}
    />
  );
}
