import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useProfile } from "../hooks/useProfile";
import { questCompletionUpdate } from "../lib/questProgress";
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
const QUEST_REFRESH_MS = 60_000;
const COMPLETION_REFRESH_MS = 30_000;
const QUEST_CACHE_KEY = "@pfpe/quests";
const COMPLETION_CACHE_KEY = "@pfpe/completions";

export function QuestProvider({ children }: PropsWithChildren) {
  const { profile, save } = useProfile();
  const uid = profile.userId;
  const [quests, setQuests] = useState<QuestDefinition[]>([]);
  const [completions, setCompletions] = useState<Record<string, QuestCompletion>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(QUEST_CACHE_KEY);
        if (raw && !cancelled) {
          const cached = JSON.parse(raw) as QuestDefinition[];
          if (cached?.length) {
            setQuests(cached);
          }
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch quests from Supabase; fallback to static data if empty.
  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    const loadQuests = async (withSpinner = false) => {
      if (withSpinner) {
        setLoading(true);
      }
      try {
        const remote = await fetchRemoteQuests();
        if (cancelled) return;
        const normalized = remote.length ? remote.map(normalizeQuestRow) : [...fallbackDaily, ...fallbackEvergreen];
        if (!cancelled) {
          setQuests(normalized);
          await AsyncStorage.setItem(QUEST_CACHE_KEY, JSON.stringify(normalized));
        }
      } catch {
        if (!cancelled) {
          setQuests([...fallbackDaily, ...fallbackEvergreen]);
        }
      } finally {
        if (!cancelled && withSpinner) {
          setLoading(false);
        }
      }
    };
    loadQuests(true);
    interval = setInterval(() => loadQuests(false), QUEST_REFRESH_MS);
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, []);

  // Fetch quest completions for the user.
  useEffect(() => {
    if (!uid) {
      setCompletions({});
      return;
    }
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(`${COMPLETION_CACHE_KEY}:${uid}`);
        if (raw && !cancelled) {
          setCompletions(JSON.parse(raw));
        }
      } catch {}
    })();

    const loadCompletions = async () => {
      try {
        const rows = await fetchRemoteCompletions();
        if (cancelled) return;
        const map: Record<string, QuestCompletion> = {};
        rows.forEach((row) => {
          map[row.quest_id] = mapCompletionRow(row);
        });
        setCompletions(map);
        await AsyncStorage.setItem(`${COMPLETION_CACHE_KEY}:${uid}`, JSON.stringify(map));
      } catch {
        if (!cancelled) {
          setCompletions({});
        }
      }
    };
    loadCompletions();
    interval = setInterval(loadCompletions, COMPLETION_REFRESH_MS);
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
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

    save((prev) => questCompletionUpdate(prev, quest.points));

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
