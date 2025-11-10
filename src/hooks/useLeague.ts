import { useEffect, useState } from "react";
import { fetchLeagueLeaderboard } from "../lib/supabaseApi";
import { generateLeagueStandings } from "../data/leagues";

export type LeagueMember = {
  id: string;
  name: string;
  points: number;
  updatedAt?: Date;
  rank?: number;
  isYou?: boolean;
};

export function useLeagueStandings(leagueId?: string | null) {
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadStandings = async () => {
      if (!leagueId) {
        setMembers(generateLeagueStandings("sprout"));
        return;
      }
      setLoading(true);
      try {
        const rows = await fetchLeagueLeaderboard(leagueId);
        if (cancelled) return;
        if (!rows.length) {
          setMembers(generateLeagueStandings(leagueId));
          return;
        }
        const mapped = rows.map((row, index) => ({
          id: row.id ?? row.user_id ?? `${leagueId}-${index}`,
          name: row.display_name ?? row.user_id ?? "Player",
          points: row.points ?? 0,
          updatedAt: row.created_at ? new Date(row.created_at) : undefined,
          rank: index + 1,
        }));
        setMembers(mapped);
      } catch {
        if (!cancelled) {
          setMembers(generateLeagueStandings(leagueId ?? "sprout"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadStandings();
    return () => {
      cancelled = true;
    };
  }, [leagueId]);

  return { members, loading };
}
