type RuntimeEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseProofBucket: string;
};

const FALLBACK_ENV: RuntimeEnv = {
  supabaseUrl: 'https://zkzafoxcuxgopjjaygik.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpremFmb3hjdXhnb3BqamF5Z2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDIwNTIsImV4cCI6MjA3ODI3ODA1Mn0.Jvk7rtX7xGR7mXSPQ3OqIWm7ctYpKQoMB-a-RMq0utY',
  supabaseProofBucket: 'proofs',
};

function resolveEnvValue<K extends keyof RuntimeEnv>(key: K): RuntimeEnv[K] {
  const envKeyMap: Record<keyof RuntimeEnv, string> = {
    supabaseUrl: 'EXPO_PUBLIC_SUPABASE_URL',
    supabaseAnonKey: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    supabaseProofBucket: 'EXPO_PUBLIC_SUPABASE_PROOF_BUCKET',
  };

  const envValue = process.env[envKeyMap[key]];
  if (!envValue && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[env] Missing ${envKeyMap[key]} - falling back to default value baked into runtimeEnv.ts`
    );
  }

  return (envValue as RuntimeEnv[K]) ?? FALLBACK_ENV[key];
}

export const runtimeEnv: RuntimeEnv = {
  supabaseUrl: resolveEnvValue('supabaseUrl'),
  supabaseAnonKey: resolveEnvValue('supabaseAnonKey'),
  supabaseProofBucket: resolveEnvValue('supabaseProofBucket'),
};

