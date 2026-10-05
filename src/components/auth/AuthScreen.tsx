import { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { Link, type Href } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ScreenTitle } from '@/components/ScreenTitle';

type AuthScreenProps = PropsWithChildren<{
  title: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: Href;
}>;

export function AuthScreen({ title, switchPrompt, switchLabel, switchHref, children }: AuthScreenProps) {
  return (
    <ScreenLayout
      footer={
        <Text className="tablet:text-[17px] text-muted text-center text-[15px]">
          {switchPrompt}{' '}
          <Link href={switchHref}>
            <Text className="text-foreground underline">{switchLabel}</Text>
          </Link>
        </Text>
      }
    >
      <View className="gap-6">
        <ScreenTitle title={title} />
        {children}
      </View>
    </ScreenLayout>
  );
}
