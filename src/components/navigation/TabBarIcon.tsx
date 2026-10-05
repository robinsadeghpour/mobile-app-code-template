import { type LucideIcon } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';
import { useIsTablet } from '@/hooks/useIsTablet';

export function TabBarIcon({ icon: Icon, focused }: { icon: LucideIcon; focused: boolean }) {
  const color = useThemeColor(focused ? 'foreground' : 'muted');
  const isTablet = useIsTablet();

  return <Icon size={isTablet ? 30 : 24} color={color} />;
}
