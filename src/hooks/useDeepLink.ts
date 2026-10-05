import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { router, type Href } from 'expo-router';
import { useSetSession } from './auth/useSetSession';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { EMAIL_CONFIRMATION_PATH } from '@/lib/supabase';
import { logError } from '@/lib/logger';
import { i18n } from '@/i18n';

type AuthDeepLink =
  | { kind: 'session'; tokens: { access_token: string; refresh_token: string }; destination: Href }
  | { kind: 'error'; description: string | null }
  | { kind: 'other' };

const RECOVERY_PATH_SEGMENT = 'update-password';
// Linking.parse returns the path without its leading slash.
const CONFIRMATION_PATH_SEGMENT = EMAIL_CONFIRMATION_PATH.replace(/^\//, '');

const classifyAuthDeepLink = (rawUrl: string): AuthDeepLink => {
  // Supabase mails the session in the URL fragment, which Linking.parse drops.
  const { path, queryParams } = Linking.parse(rawUrl.replace('#', '?'));
  const { type, access_token, refresh_token, error, error_code, error_description } = queryParams ?? {};

  const isRecovery = type === 'recovery' || !!path?.includes(RECOVERY_PATH_SEGMENT);
  const isConfirmation = type === 'signup' || !!path?.includes(CONFIRMATION_PATH_SEGMENT);

  // Before the token guard: an expired link carries no tokens and would fall through as 'other'.
  if ((typeof type === 'string' || isRecovery || isConfirmation) && (error || error_code)) {
    return { kind: 'error', description: typeof error_description === 'string' ? error_description : null };
  }
  if (typeof access_token !== 'string' || typeof refresh_token !== 'string' || !(isRecovery || isConfirmation)) {
    return { kind: 'other' };
  }
  return {
    kind: 'session',
    tokens: { access_token, refresh_token },
    destination: isRecovery ? '/update-password' : '/',
  };
};

export const useDeepLink = () => {
  const { setSession } = useSetSession();
  const { showToast } = useSimpleToast();
  const launchUrlHandled = useRef(false);

  useEffect(() => {
    const handleUrl = (url: string) => {
      const link = classifyAuthDeepLink(url);

      if (link.kind === 'session') {
        void setSession(link.tokens, { onSuccess: () => router.replace(link.destination) });
      } else if (link.kind === 'error') {
        logError('Auth deep link error:', link.description);
        showToast('error', i18n.t('auth.email_link_invalid'));
        router.replace('/(public)/sign-in');
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    // getInitialURL returns the launch URL for the life of the process, so an effect re-run would handle it again.
    if (!launchUrlHandled.current) {
      launchUrlHandled.current = true;
      void Linking.getInitialURL().then((url) => {
        if (url) handleUrl(url);
      });
    }

    return () => subscription.remove();
  }, [setSession, showToast]);
};
