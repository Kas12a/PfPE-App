import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    env: {
      EXPO_PUBLIC_SUPABASE_URL: "http://localhost",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      EXPO_PUBLIC_SUPABASE_PROOF_BUCKET: "proofs",
    },
  },
});
