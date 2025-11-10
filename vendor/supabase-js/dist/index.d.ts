export interface SupabaseError {
  message: string;
}

export interface SupabaseResponse<T> {
  data: T;
  error: SupabaseError | null;
}

export interface SupabaseAuthSession {
  access_token: string | null;
  refresh_token: string | null;
  user: any;
}

export interface SupabaseAuthApi {
  signInWithPassword(credentials: { email: string; password: string }): Promise<SupabaseResponse<{ session: SupabaseAuthSession | null; user: any }>>;
  signInWithIdToken(credentials: { token: string; provider?: string; nonce?: string }): Promise<SupabaseResponse<{ session: SupabaseAuthSession | null; user: any }>>;
  signUp(credentials: { email: string; password: string; options?: Record<string, unknown> }): Promise<SupabaseResponse<{ session: SupabaseAuthSession | null; user: any }>>;
  signOut(): Promise<{ error: SupabaseError | null }>;
  getUser(): Promise<SupabaseResponse<{ user: any }>>;
}

export interface SupabaseStorageUploadOptions {
  contentType?: string;
  upsert?: boolean;
}

export interface SupabaseStoragePublicUrl {
  publicUrl: string;
}

export interface SupabaseStorageBucket {
  upload(path: string, file: any, options?: SupabaseStorageUploadOptions): Promise<SupabaseResponse<{ path: string }>>;
  getPublicUrl(path: string): SupabaseResponse<SupabaseStoragePublicUrl>;
}

export interface SupabaseStorageApi {
  from(bucket: string): SupabaseStorageBucket;
}

export interface PostgrestSingleResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export interface PostgrestQueryBuilder<T = any> extends Promise<PostgrestSingleResponse<T>> {
  select(columns?: string): PostgrestQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }): PostgrestQueryBuilder<T>;
  limit(count: number): PostgrestQueryBuilder<T>;
  eq(column: string, value: any): PostgrestQueryBuilder<T>;
  upsert(values: any): PostgrestQueryBuilder<T>;
  insert(values: any): Promise<PostgrestSingleResponse<T>>;
  single(): Promise<PostgrestSingleResponse<T>>;
}

export interface SupabaseClient {
  auth: SupabaseAuthApi;
  from(table: string): PostgrestQueryBuilder<any>;
  storage: SupabaseStorageApi;
}

export function createClient(url: string, anonKey: string, options?: Record<string, unknown>): SupabaseClient;
