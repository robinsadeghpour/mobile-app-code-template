import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';
import { useIsTablet } from '@/hooks/useIsTablet';
import { i18n } from '@/i18n';

type ScreenTitleProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backTestID?: string;
};

export function ScreenTitle({ title, subtitle, onBack, backTestID }: ScreenTitleProps) {
  const foregroundColor = useThemeColor('foreground');
  const isTablet = useIsTablet();

  return (
    <View className="gap-6">
      {onBack ? (
        <Pressable
          testID={backTestID}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('auth.back_button')}
          onPress={onBack}
          hitSlop={8}
          className="self-start"
        >
          <ArrowLeft size={isTablet ? 26 : 22} color={foregroundColor} />
        </Pressable>
      ) : null}
      <View className="gap-1">
        <Text className="font-sans-semibold text-foreground text-[22px]">{title}</Text>
        {subtitle ? <Text className="tablet:text-[17px] text-muted text-[15px]">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
