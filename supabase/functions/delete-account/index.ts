import { authenticateUser, createAdminClient } from '../_utils/auth.ts';
import { json, RequestError, serve } from '../_utils/http.ts';
import { removeUserObjects } from '../_utils/storage.ts';

serve('delete-account', async (req) => {
  const { user } = await authenticateUser(req);
  const admin = createAdminClient();

  // Storage first: a failed deleteUser leaves an account the user can delete again,
  // but objects outliving the account have no owner and no path back.
  const cleanup = await removeUserObjects(admin, user.id).catch((cause: unknown) => {
    throw new RequestError('storage_cleanup_failed', 500, undefined, { cause });
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;

  return json({ message: 'User deleted successfully', removedObjects: cleanup.removed });
});
