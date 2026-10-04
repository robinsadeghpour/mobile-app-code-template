import { type LucideIcon } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';

import { useIsTablet } from '@/components/ContentContainer';

export function TabBarIcon({ icon: Icon, focused }: { icon: LucideIcon; focused: boolean }) {
  const color = useThemeColor(focused ? 'foreground' : 'muted');
  const size = useIsTablet() ? 30 : 24;

  return <Icon size={size} color={color} />;
}
