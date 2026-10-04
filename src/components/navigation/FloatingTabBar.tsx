import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

// expo-router doesn't export `BottomTabBarProps`, and importing it means reaching into its vendored react-navigation subpath.
type TabBarRenderProp = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type BottomTabBarProps = Parameters<TabBarRenderProp>[0];

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-border bg-overlay tablet:left-[28%] tablet:right-[28%] absolute right-10 left-10 flex-row items-center justify-around rounded-full border py-3"
      style={{
        bottom: Math.max(insets.bottom, 8),
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            testID={`tab-${route.name}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={typeof options.title === 'string' ? options.title : route.name}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            className="px-5 py-1"
            hitSlop={8}
          >
            {options.tabBarIcon?.({ focused: isFocused, color: '', size: 24 })}
          </Pressable>
        );
      })}
    </View>
  );
}
