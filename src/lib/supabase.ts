import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { secureStorageAdapter } from './secure-storage';
import { type Database } from './db/database.types';

const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

if (!SUPABASE_ANON_KEY) {
  throw new Error(`
    Missing Supabase anon key!

    Find more information about the project specifc setup here: 
    https://docs.native.express/setup/project
  `);
}

if (!SUPABASE_URL) {
  throw new Error(`
    Missing Supabase url!

    Find more information about the project specifc setup here: 
    https://docs.native.express/setup/project
  `);
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const EMAIL_CONFIRMATION_PATH = '/auth/confirmed';

export const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes('#')) {
    parsedUrl = url.replace('#', '?');
  }
  return parsedUrl;
};
