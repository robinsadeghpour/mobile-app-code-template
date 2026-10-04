import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useSetSession } from './auth/useSetSession';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { EMAIL_CONFIRMATION_PATH, parseSupabaseUrl } from '@/lib/supabase';
import { logError } from '@/lib/logger';
import { i18n } from '@/i18n';

type AuthDeepLink =
  | { kind: 'recovery'; access_token: string; refresh_token: string }
  | { kind: 'confirmation'; access_token: string; refresh_token: string }
  | { kind: 'error'; description: string | null }
  | { kind: 'other' };

// Linking.parse returns the path without its leading slash.
const CONFIRMATION_PATH_SEGMENT = EMAIL_CONFIRMATION_PATH.replace(/^\//, '');

const classifyAuthDeepLink = (rawUrl: string): AuthDeepLink => {
  // Supabase mails the session in the URL fragment, which Linking.parse alone drops.
  const { path, queryParams } = Linking.parse(parseSupabaseUrl(rawUrl));

  const type = queryParams?.type;
  const isAuthLink =
    typeof type === 'string' || path?.includes('update-password') || path?.includes(CONFIRMATION_PATH_SEGMENT);

  // Ordered before the token guard: an expired link carries no tokens and would fall through as 'other'.
  if (isAuthLink && (queryParams?.error || queryParams?.error_code)) {
    const description = queryParams.error_description;
    return { kind: 'error', description: typeof description === 'string' ? description : null };
  }

  const access_token = queryParams?.access_token;
  const refresh_token = queryParams?.refresh_token;
  if (typeof access_token !== 'string' || typeof refresh_token !== 'string') {
    return { kind: 'other' };
  }

  if (type === 'recovery' || path?.includes('update-password')) {
    return { kind: 'recovery', access_token, refresh_token };
  }
  if (type === 'signup' || path?.includes(CONFIRMATION_PATH_SEGMENT)) {
    return { kind: 'confirmation', access_token, refresh_token };
  }
  return { kind: 'other' };
};

export const useDeepLink = () => {
  const { setSession } = useSetSession();
  const { showToast } = useSimpleToast();
  const router = useRouter();
  const launchUrlHandled = useRef(false);

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const link = classifyAuthDeepLink(event.url);

      switch (link.kind) {
        case 'recovery':
          void setSession({
            access_token: link.access_token,
            refresh_token: link.refresh_token,
            onSuccess: () => router.replace('/update-password'),
          });
          break;
        case 'confirmation':
          void setSession({
            access_token: link.access_token,
            refresh_token: link.refresh_token,
            onSuccess: () => router.replace('/'),
          });
          break;
        case 'error':
          logError('Auth deep link error:', link.description);
          showToast('error', i18n.t('auth.email_link_invalid'));
          router.replace('/(public)/sign-in');
          break;
        case 'other':
          break;
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // getInitialURL returns the launch URL for the life of the process, so every effect re-run would re-handle it.
    if (!launchUrlHandled.current) {
      launchUrlHandled.current = true;
      void Linking.getInitialURL().then((url) => {
        if (url) {
          void handleDeepLink({ url } as Linking.EventType);
        }
      });
    }

    return () => {
      subscription.remove();
    };
  }, [setSession, router, showToast]);
};
