import { type PropsWithChildren, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

const CONTENT_COLUMN = 'tablet:max-w-[860px] w-full self-center';

export function ScreenLayout({ children, footer }: PropsWithChildren<{ footer?: ReactNode }>) {
  return (
    <View className="bg-background pt-safe pb-safe flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View className={`flex-1 justify-center ${CONTENT_COLUMN}`}>{children}</View>
        {footer ? <View className={`pb-4 ${CONTENT_COLUMN}`}>{footer}</View> : null}
      </ScrollView>
    </View>
  );
}
