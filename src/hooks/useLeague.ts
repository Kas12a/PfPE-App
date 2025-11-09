import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "../lib/firebase";
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
    if (!leagueId) {
      setMembers(generateLeagueStandings("sprout"));
      return;
    }
    setLoading(true);
    const ref = collection(firestore, "leagues", leagueId, "members");
    const q = query(ref, orderBy("points", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setMembers(generateLeagueStandings(leagueId));
          setLoading(false);
          return;
        }
        const rows = snapshot.docs.map((docSnap, index) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: data.name ?? "Player",
            points: data.points ?? 0,
            updatedAt: data.updatedAt?.toDate?.() ?? undefined,
            rank: index + 1,
          };
        });
        setMembers(rows);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [leagueId]);

  return { members, loading };
}
