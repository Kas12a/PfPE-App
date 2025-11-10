import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { useProfile } from "../hooks/useProfile";
import {
  dailyQuests as fallbackDaily,
  evergreenQuests as fallbackEvergreen,
  QuestCategory,
  QuestDefinition,
  QuestEvidenceType,
} from "../data/quests";
import {
  fetchCompletions as fetchRemoteCompletions,
  fetchQuests as fetchRemoteQuests,
  submitCompletion as submitRemoteCompletion,
  syncLeagueMembership,
  uploadQuestProof,
} from "../lib/supabaseApi";
import type { Completion as CompletionRow, Quest as QuestRow } from "../lib/supabaseApi";

type QuestCompletion = {
  questId: string;
  proofUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  submittedAt?: Date;
  points: number;
  type: QuestEvidenceType;
};

type QuestCtx = {
  quests: QuestDefinition[];
  dailyQuests: QuestDefinition[];
  evergreenQuests: QuestDefinition[];
  completions: Record<string, QuestCompletion>;
  loading: boolean;
  submitProof: (quest: QuestDefinition, fileUri: string, mimeType: string) => Promise<string>;
  completeQuest: (quest: QuestDefinition, proofUrl?: string | null) => Promise<void>;
};

const QuestContext = createContext<QuestCtx | null>(null);

export function QuestProvider({ children }: PropsWithChildren) {
  const { profile, setProfile } = useProfile();
  const uid = profile.userId;
  const [quests, setQuests] = useState<QuestDefinition[]>([]);
  const [completions, setCompletions] = useState<Record<string, QuestCompletion>>({});
  const [loading, setLoading] = useState(true);

  // Fetch quests from Supabase; fallback to static data if empty.
  useEffect(() => {
    let cancelled = false;
    const loadQuests = async () => {
      setLoading(true);
      try {
        const remote = await fetchRemoteQuests();
        if (cancelled) return;
        if (!remote.length) {
          setQuests([...fallbackDaily, ...fallbackEvergreen]);
        } else {
          setQuests(remote.map(normalizeQuestRow));
        }
      } catch {
        if (!cancelled) {
          setQuests([...fallbackDaily, ...fallbackEvergreen]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadQuests();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch quest completions for the user.
  useEffect(() => {
    if (!uid) {
      setCompletions({});
      return;
    }
    let cancelled = false;
    const loadCompletions = async () => {
      try {
        const rows = await fetchRemoteCompletions();
        if (cancelled) return;
        const map: Record<string, QuestCompletion> = {};
        rows.forEach((row) => {
          map[row.quest_id] = mapCompletionRow(row);
        });
        setCompletions(map);
      } catch {
        if (!cancelled) {
          setCompletions({});
        }
      }
    };
    loadCompletions();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Ensure league membership exists/up-to-date when user info changes.
  useEffect(() => {
    if (!uid) return;
    const leagueId = profile.league ?? "sprout";
    void syncLeagueMembership({
      leagueId,
      displayName: profile.name,
      points: profile.points ?? 0,
    }).catch(() => undefined);
  }, [uid, profile.league, profile.name, profile.points]);

  const submitProof = async (_quest: QuestDefinition, fileUri: string, mimeType: string) => {
    if (!uid) throw new Error("You must be signed in to upload proof.");
    return uploadQuestProof(fileUri, mimeType);
  };

  const completeQuest = async (quest: QuestDefinition, proofUrl?: string | null) => {
    if (!uid) throw new Error("You must be signed in to complete quests.");
    if (quest.type !== "check" && !proofUrl) {
      throw new Error("Proof required for this quest.");
    }
    if (completions[quest.id]) {
      return;
    }

    const status: QuestCompletion["status"] = quest.type === "check" ? "approved" : "pending";

    await submitRemoteCompletion({
      questId: quest.id,
      proofUrl: proofUrl ?? null,
      points: quest.points,
      type: quest.type,
      status,
    });

    setProfile?.((prev) => ({
      ...prev,
      points: (prev.points ?? 0) + quest.points,
      questsCompletedThisWeek: (prev.questsCompletedThisWeek ?? 0) + 1,
    }));

    setCompletions((prev) => ({
      ...prev,
      [quest.id]: {
        questId: quest.id,
        proofUrl: proofUrl ?? null,
        status,
        points: quest.points,
        type: quest.type,
        submittedAt: new Date(),
      },
    }));

    const leagueId = profile.league ?? "sprout";
    await syncLeagueMembership({
      leagueId,
      displayName: profile.name,
      points: (profile.points ?? 0) + quest.points,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const daily = useMemo(() => quests.filter((q) => q.due === "Today" || q.due === "Tonight"), [quests]);
  const evergreen = useMemo(() => quests.filter((q) => !daily.includes(q)), [quests, daily]);

  return (
    <QuestContext.Provider
      value={{
        quests,
        dailyQuests: daily.length ? daily : fallbackDaily,
        evergreenQuests: evergreen.length ? evergreen : fallbackEvergreen,
        completions,
        loading,
        submitProof,
        completeQuest,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestsContext() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuestsContext must be used within QuestProvider");
  return ctx;
}

function normalizeQuestRow(row: QuestRow): QuestDefinition {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    instructions: row.instructions ?? "",
    points: row.points ?? 0,
    impact: row.impact ?? "Make an impact today.",
    category: (row.category as QuestCategory) ?? "Community",
    type: (row.type as QuestEvidenceType) ?? "check",
    due: row.due ?? undefined,
    requiresEvidenceLabel: row.requires_evidence_label ?? undefined,
  };
}

function mapCompletionRow(row: CompletionRow): QuestCompletion {
  return {
    questId: row.quest_id,
    proofUrl: row.proof_url ?? undefined,
    status: (row.status as QuestCompletion["status"]) ?? "pending",
    submittedAt: row.submitted_at ? new Date(row.submitted_at) : undefined,
    points: row.points ?? 0,
    type: (row.type as QuestEvidenceType) ?? "check",
  };
}
