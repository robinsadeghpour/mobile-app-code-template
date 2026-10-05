import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { THEME_PREFERENCES } from '@/theme';
import { i18n } from '@/i18n';

export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();

  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sans-semibold text-foreground text-[15px]">{i18n.t('profile.appearance')}</Text>
      <View className="flex-row gap-2">
        {THEME_PREFERENCES.map((option) => {
          const isActive = option === preference;
          return (
            <Pressable
              key={option}
              testID={`profile-theme-${option}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              className={`rounded-full px-3 py-1.5 ${isActive ? 'bg-accent' : 'bg-surface-secondary'}`}
              onPress={() => setPreference(option)}
              hitSlop={4}
            >
              <Text
                className={`font-sans-medium text-[13px] ${isActive ? 'text-accent-foreground' : 'text-foreground'}`}
              >
                {i18n.t(`profile.theme_${option}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
