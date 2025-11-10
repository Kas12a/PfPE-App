const fs = require('fs');
const path = require('path');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
      const [key, ...valueParts] = line.split('=');
      if (!key) return;
      const value = valueParts.join('=');
      if (value && !process.env[key]) {
        process.env[key] = value;
      }
    });
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env');
  loadEnvFile(envPath);

  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials are missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
    process.exitCode = 1;
    return;
  }

  const { createClient } = require('../vendor/supabase-js/dist');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  console.log('Checking Supabase connectivity…');
  const { data, error } = await supabase.from('quests').select('*').limit(1);
  if (error) {
    console.error('Failed to fetch quests:', error.message);
    process.exitCode = 1;
    return;
  }

  if (!Array.isArray(data)) {
    console.error('Unexpected response when fetching quests.');
    process.exitCode = 1;
    return;
  }

  console.log(`Fetched ${data.length} quest(s). Supabase connection looks good.`);
}

main().catch((err) => {
  console.error('Unexpected Supabase test failure:', err);
  process.exitCode = 1;
});
