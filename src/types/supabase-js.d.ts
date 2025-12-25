import "vendor/supabase-js/dist";

declare module "@supabase/supabase-js" {
  interface PostgrestQueryBuilder<T = any> {
    range(from: number, to: number): PostgrestQueryBuilder<T>;
  }

  interface SupabaseClient {
    rpc<T = unknown>(fn: string, args?: Record<string, unknown>): Promise<SupabaseResponse<T>>;
  }
}
