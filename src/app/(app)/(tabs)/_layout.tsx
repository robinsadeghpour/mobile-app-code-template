import { Tabs } from 'expo-router';
import { House, User } from 'lucide-react-native';
import { FloatingTabBar } from '@/components/navigation/FloatingTabBar';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { i18n } from '@/i18n';

const TABS = [
  { name: 'index', titleKey: 'home.tab_label', icon: House },
  { name: 'profile', titleKey: 'profile.tab_label', icon: User },
];

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      {TABS.map(({ name, titleKey, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: i18n.t(titleKey),
            tabBarIcon: ({ focused }) => <TabBarIcon icon={icon} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}
