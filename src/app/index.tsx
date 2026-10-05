import { Redirect } from 'expo-router';
import { useSession } from '@/hooks/useSession';

export default function Index() {
  const { session } = useSession();

  // `/(app)` alone is not a route: that group's index lives inside `(tabs)`.
  return <Redirect href={session ? '/(app)/(tabs)' : '/(public)/welcome'} />;
}
