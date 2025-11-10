import supabase from './supabase';

export type CompletionStatus = 'pending' | 'approved' | 'rejected';

export interface Quest {
  id: string;
  title: string;
  subtitle: string | null;
  instructions: string | null;
  impact: string | null;
  points: number;
  category: string | null;
  type: string | null;
  due: string | null;
  order: number | null;
  requires_evidence_label?: string | null;
  created_at: string;
}

export interface Completion {
  id: string;
  user_id: string;
  quest_id: string;
  submitted_at: string | null;
  proof_url: string | null;
  status: CompletionStatus | null;
  points: number | null;
  type: string | null;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  points: number;
  created_at: string;
  display_name?: string | null;
  leagues?: {
    name: string;
  } | null;
}

export interface UserProfile {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}

export interface AuthUser {
  id: string;
  email?: string | null;
}

async function getOptionalAuthUser(): Promise<AuthUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return (user as AuthUser | null) ?? null;
}

async function requireAuthUser(): Promise<AuthUser> {
  const user = await getOptionalAuthUser();
  if (!user) {
    throw new Error('User must be authenticated.');
  }
  return user;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return (data?.user as AuthUser | null) ?? null;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return (data?.user as AuthUser | null) ?? null;
}

export async function signInWithGoogleIdToken(idToken: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.signInWithIdToken({
    token: idToken,
    provider: 'google',
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data?.user as AuthUser | null) ?? null;
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return getOptionalAuthUser();
}

export async function fetchQuests(): Promise<Quest[]> {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false })
    .order('due', { ascending: true, nullsFirst: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchCompletions(): Promise<Completion[]> {
  const user = await requireAuthUser();
  const { data, error } = await supabase.from('completions').select('*').eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function uploadQuestProof(fileUri: string, _mimeType?: string): Promise<string> {
  // Placeholder stub: returning the local uri keeps parity with existing flows until Supabase Storage is wired up.
  return fileUri;
}

export async function submitCompletion({
  questId,
  proofUrl,
  points,
  type,
  status,
}: {
  questId: string;
  proofUrl?: string | null;
  points?: number;
  type?: string | null;
  status?: CompletionStatus;
}): Promise<void> {
  const user = await requireAuthUser();

  const { error } = await supabase.from('completions').insert({
    quest_id: questId,
    user_id: user.id,
    proof_url: proofUrl ?? null,
    submitted_at: new Date().toISOString(),
    status: status ?? null,
    points: points ?? null,
    type: type ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchLeagueLeaderboard(leagueId?: string): Promise<LeagueMember[]> {
  let query = supabase
    .from('league_members')
    .select('id, league_id, user_id, points, created_at, display_name, leagues(name)')
    .order('points', { ascending: false })
    .order('created_at', { ascending: true });

  if (leagueId) {
    query = query.eq('league_id', leagueId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function syncLeagueMembership({
  leagueId,
  displayName,
  points,
}: {
  leagueId: string;
  displayName?: string | null;
  points: number;
}): Promise<void> {
  const user = await requireAuthUser();
  const payload = {
    id: user.id,
    league_id: leagueId,
    user_id: user.id,
    display_name: displayName ?? 'Explorer',
    points,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('league_members')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile> {
  const user = await requireAuthUser();

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...updates,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}
