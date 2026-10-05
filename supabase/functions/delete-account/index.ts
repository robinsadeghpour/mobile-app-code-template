import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { authenticateUser, createAdminClient } from '../_utils/auth.ts';
import { json, RequestError, serve } from '../_utils/http.ts';

// Mirrors src/lib/storage/avatarConstants.ts: one object per user at `avatars/{userId}.<ext>`.
const AVATAR_BUCKET = 'avatars';
const AVATAR_FOLDER = 'avatars';

async function removeAvatars(admin: SupabaseClient, userId: string) {
  const bucket = admin.storage.from(AVATAR_BUCKET);

  const { data, error } = await bucket.list(AVATAR_FOLDER, { search: userId });
  if (error) throw error;

  const paths = data.filter(({ name }) => name.startsWith(`${userId}.`)).map(({ name }) => `${AVATAR_FOLDER}/${name}`);
  if (paths.length === 0) return;

  const { error: removeError } = await bucket.remove(paths);
  if (removeError) throw removeError;
}

serve('delete-account', async (req) => {
  const user = await authenticateUser(req);
  const admin = createAdminClient();

  // Storage first: a failed deleteUser leaves an account the user can delete again,
  // but objects outliving the account have no owner and no path back.
  await removeAvatars(admin, user.id).catch((cause: unknown) => {
    throw new RequestError('storage_cleanup_failed', 500, { cause });
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;

  return json({ deleted: true });
});
