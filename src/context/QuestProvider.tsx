import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Haptics from "expo-haptics";
import { firestore, storage } from "../lib/firebase";
import { useProfile } from "../hooks/useProfile";
import { dailyQuests as fallbackDaily, evergreenQuests as fallbackEvergreen } from "../data/quests";
import { QuestDefinition, QuestEvidenceType } from "../data/quests";

type QuestCompletion = {
  questId: string;
  proofUrl?: string | null;
  status: "pending" | "approved";
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
  const uid = profile.firebaseUid;
  const [quests, setQuests] = useState<QuestDefinition[]>([]);
  const [completions, setCompletions] = useState<Record<string, QuestCompletion>>({});
  const [loading, setLoading] = useState(true);

  // Subscribe to quests collection; fallback to static data if empty.
  useEffect(() => {
    const questsRef = collection(firestore, "quests");
    const q = query(questsRef, orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          const merged = [...fallbackDaily, ...fallbackEvergreen];
          setQuests(merged);
          setLoading(false);
          return;
        }
        const docs: QuestDefinition[] = snapshot.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data(),
            } as QuestDefinition),
        );
        setQuests(docs);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  // Subscribe to quest completions for the user.
  useEffect(() => {
    if (!uid) {
      setCompletions({});
      return;
    }
    const completionsRef = collection(firestore, "users", uid, "completions");
    const unsub = onSnapshot(completionsRef, (snapshot) => {
      const map: Record<string, QuestCompletion> = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as any;
        map[data.questId] = {
          questId: data.questId,
          proofUrl: data.proofUrl,
          status: data.status,
          points: data.points,
          type: data.type,
          submittedAt: data.submittedAt?.toDate?.() ?? undefined,
        };
      });
      setCompletions(map);
    });
    return unsub;
  }, [uid]);

  // Ensure league membership document exists.
  useEffect(() => {
    if (!uid) return;
    const leagueId = profile.league ?? "sprout";
    const memberRef = doc(firestore, "leagues", leagueId, "members", uid);
    void setDoc(
      memberRef,
      {
        name: profile.name?.trim() || "Explorer",
        points: profile.points ?? 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }, [uid, profile.league]);

  const submitProof = async (quest: QuestDefinition, fileUri: string, mimeType: string) => {
    if (!uid) throw new Error("You must be signed in to upload proof.");
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `proofs/${uid}/${quest.id}-${Date.now()}`);
    await uploadBytes(storageRef, blob, { contentType: mimeType });
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const completeQuest = async (quest: QuestDefinition, proofUrl?: string | null) => {
    if (!uid) throw new Error("You must be signed in to complete quests.");
    if (quest.type !== "check" && !proofUrl) {
      throw new Error("Proof required for this quest.");
    }
    if (completions[quest.id]) {
      return;
    }

    const completionRef = doc(firestore, "users", uid, "completions", quest.id);
    await setDoc(completionRef, {
      questId: quest.id,
      points: quest.points,
      proofUrl: proofUrl ?? null,
      status: quest.type === "check" ? "approved" : "pending",
      submittedAt: serverTimestamp(),
      type: quest.type,
      title: quest.title,
    });

    // Update local profile points/stats.
    setProfile?.((prev) => ({
      ...prev,
      points: (prev.points ?? 0) + quest.points,
      questsCompletedThisWeek: (prev.questsCompletedThisWeek ?? 0) + 1,
    }));

    // Mirror points into league standing doc for leaderboards.
    const leagueId = profile.league ?? "sprout";
    const memberRef = doc(firestore, "leagues", leagueId, "members", uid);
    await setDoc(
      memberRef,
      {
        name: profile.name?.trim() || "Explorer",
        points: (profile.points ?? 0) + quest.points,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

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
