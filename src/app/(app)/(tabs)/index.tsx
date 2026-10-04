import { Text, View } from 'react-native';
import { ContentContainer } from '@/components/ContentContainer';
import { useSession } from '@/hooks/useSession';

/**
 * The first screen behind sign-in, and the one to replace first.
 *
 * It exists to prove the session reached the app rather than to be kept: the
 * address below comes from Supabase, so if you can read it, auth, the client
 * and the session provider are all working.
 */
export default function Home() {
  const { user } = useSession();

  return (
    <View className="flex-1 justify-center">
      <ContentContainer>
        <View className="gap-3">
          <Text className="text-foreground font-serif text-[32px]">You are signed in.</Text>
          <Text className="text-muted text-[15px]">
            {user?.email ?? 'No address on this session.'}
          </Text>
          <Text className="text-muted text-[15px]">
            This screen is a placeholder. Describe what you want here and let your agent build it.
          </Text>
        </View>
      </ContentContainer>
    </View>
  );
}
