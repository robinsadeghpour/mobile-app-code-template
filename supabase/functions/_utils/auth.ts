import { createClient } from 'jsr:@supabase/supabase-js@2';
import { RequestError } from './http.ts';

// An isolate holds no session, so refreshing or persisting one only leaves a timer running.
const createServerClient = (keyName: string) =>
  createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get(keyName) ?? '', {
    auth: { autoRefreshToken: false, persistSession: false },
  });

export const createAdminClient = () => createServerClient('SUPABASE_SERVICE_ROLE_KEY');

export const authenticateUser = async (req: Request) => {
  const token = req.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new RequestError('unauthorized', 401);

  const { data, error } = await createServerClient('SUPABASE_ANON_KEY').auth.getUser(token);
  if (error || !data.user) throw new RequestError('unauthorized', 401);

  return data.user;
};
