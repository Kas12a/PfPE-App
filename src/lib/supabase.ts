import { createClient } from '@supabase/supabase-js';
import { runtimeEnv } from './runtimeEnv';

const supabase = createClient(runtimeEnv.supabaseUrl, runtimeEnv.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
