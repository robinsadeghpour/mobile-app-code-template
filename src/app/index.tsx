import { Redirect } from 'expo-router';
import { useSession } from '@/hooks/useSession';

/**
 * The fork in the road, and the only job of this route.
 *
 * `SessionProvider` renders nothing until it knows whether someone is signed
 * in, so by the time this runs the answer is already settled and there is no
 * loading state to show.
 */
export default function Index() {
  const { session } = useSession();

  return <Redirect href={session ? '/(app)' : '/(public)/welcome'} />;
}
