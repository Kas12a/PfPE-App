import supabase from './supabase';

export interface Quest {
  id: string;
  title: string;
  subtitle: string | null;
  points: number;
  category: string | null;
  type: string | null;
  instructions: string | null;
  due: string | null;
  order: number | null;
  created_at: string;
}

export interface Completion {
  id: string;
  user_id: string;
  quest_id: string;
  submitted_at: string;
  proof_url: string | null;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  points: number;
  created_at: string;
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

export async function submitCompletion(
  questId: string,
  proofUrl?: string | null
): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error('User must be authenticated to submit a completion.');
  }

  const { error } = await supabase.from('completions').insert({
    quest_id: questId,
    user_id: user.id,
    proof_url: proofUrl ?? null,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchLeagueLeaderboard(
  leagueId?: string
): Promise<LeagueMember[]> {
  let query = supabase
    .from('league_members')
    .select('id, league_id, user_id, points, created_at, leagues(name)')
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

export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error('User must be authenticated to update their profile.');
  }

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
