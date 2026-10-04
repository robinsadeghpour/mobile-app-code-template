import { type PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

export function GuestLayout({ children }: PropsWithChildren) {
  return (
    <View className="bg-background pt-safe pb-safe flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
