import { type ComponentProps } from 'react';
import { Button, Spinner } from 'heroui-native';
import { useIsTablet } from '@/hooks/useIsTablet';

type AppButtonProps = Pick<ComponentProps<typeof Button>, 'variant' | 'onPress' | 'testID'> & {
  label: string;
  isLoading?: boolean;
};

export function AppButton({ label, isLoading = false, variant = 'primary', ...buttonProps }: AppButtonProps) {
  const isTablet = useIsTablet();

  return (
    <Button
      variant={variant}
      size={isTablet ? 'lg' : 'md'}
      className="w-full rounded-full"
      isDisabled={isLoading}
      {...buttonProps}
    >
      {isLoading ? <Spinner /> : <Button.Label>{label}</Button.Label>}
    </Button>
  );
}
