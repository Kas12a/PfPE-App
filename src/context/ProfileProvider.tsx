import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../lib/supabaseApi";

export type Profile = {
  userId?: string;
  email?: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  rank: number;
  streak: number;
  longestStreak: number;
  ageRange?: string;
  playMode: "individual" | "group";
  league: string | null;
  questsCompletedThisWeek: number;
  weeklyTarget: number;
  lastWeeklyReset: string;
  isSignedIn: boolean;
  hasOnboarded: boolean;
  hasSeenIntro: boolean;
  language: string;
  premiumTier: "free" | "plus";
  walletAddress?: string | null;
};

export type ProfileUpdate = Partial<Profile>;
export type ProfileSavePayload = ProfileUpdate | ((prev: Profile) => ProfileUpdate);

type ProfileCtx = {
  profile: Profile;
  save: (updates: ProfileSavePayload) => void;
  hydrated: boolean;
};

const ProfileContext = createContext<ProfileCtx | null>(null);
const STORAGE_KEY = "@pfpe/profile";
const DEFAULT_AVATAR = "🌿";

export function startOfWeekKey(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function deriveLevel(points: number) {
  const normalized = Math.max(0, Math.floor(points));
  return Math.max(1, Math.floor(normalized / 500) + 1);
}

export function applyProfileUpdates(base: Profile, updates: ProfileUpdate): Profile {
  const merged: Profile = { ...base, ...updates };
  const nextPoints = Math.max(0, Math.floor(updates.points ?? merged.points ?? 0));
  const nextStreak = Math.max(0, updates.streak ?? merged.streak ?? 0);
  const normalizedName = (updates.name ?? merged.name ?? "").trim() || "Explorer";
  const normalizedAvatar = updates.avatar === undefined
    ? merged.avatar || DEFAULT_AVATAR
    : String(updates.avatar || DEFAULT_AVATAR);
  const lastReset = merged.lastWeeklyReset || startOfWeekKey();
  const nextProfile: Profile = {
    ...merged,
    name: normalizedName,
    avatar: normalizedAvatar,
    points: nextPoints,
    streak: nextStreak,
    longestStreak: Math.max(merged.longestStreak ?? 0, nextStreak),
    level: updates.level ?? merged.level ?? deriveLevel(nextPoints),
    rank: updates.rank ?? merged.rank ?? 0,
    weeklyTarget: merged.weeklyTarget ?? 15,
    questsCompletedThisWeek: merged.questsCompletedThisWeek ?? 0,
    playMode: merged.playMode ?? "individual",
    league: merged.league ?? "sprout",
    language: merged.language ?? "en",
    premiumTier: merged.premiumTier ?? "free",
    lastWeeklyReset: lastReset,
    hasOnboarded: merged.hasOnboarded ?? false,
    hasSeenIntro: merged.hasSeenIntro ?? false,
    isSignedIn: merged.isSignedIn ?? false,
  };
  if (updates.points !== undefined && updates.level === undefined) {
    nextProfile.level = deriveLevel(nextPoints);
  }
  return nextProfile;
}

const DEFAULT_PROFILE: Profile = {
  name: "Explorer",
  avatar: DEFAULT_AVATAR,
  level: 1,
  points: 0,
  rank: 0,
  streak: 0,
  longestStreak: 0,
  ageRange: "",
  playMode: "individual",
  league: "sprout",
  questsCompletedThisWeek: 0,
  weeklyTarget: 15,
  lastWeeklyReset: startOfWeekKey(),
  isSignedIn: false,
  hasOnboarded: false,
  hasSeenIntro: false,
  language: "en",
  premiumTier: "free",
  walletAddress: null,
};

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as ProfileUpdate;
          setProfile((prev) => applyProfileUpdates(prev, data));
        } else {
          setProfile((prev) => applyProfileUpdates(prev, { lastWeeklyReset: startOfWeekKey() }));
        }
      } catch {}
      if (mounted) setHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const hydrateAuthState = async () => {
      try {
        const user = await getCurrentUser();
        if (cancelled) return;
        setProfile((prev) =>
          applyProfileUpdates(prev, {
            userId: user?.id ?? undefined,
            email: user?.email ?? prev.email,
            isSignedIn: Boolean(user),
          }),
        );
      } catch {
        if (!cancelled) {
          setProfile((prev) => applyProfileUpdates(prev, { userId: undefined, isSignedIn: false }));
        }
      }
    };
    hydrateAuthState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch {}
    })();
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const currentKey = startOfWeekKey();
    if (profile.lastWeeklyReset !== currentKey) {
      setProfile((prev) =>
        applyProfileUpdates(prev, {
          lastWeeklyReset: currentKey,
          questsCompletedThisWeek: 0,
        }),
      );
    }
  }, [profile.lastWeeklyReset, hydrated]);

  const save = useCallback((updates: ProfileSavePayload) => {
    setProfile((prev) => {
      const payload = typeof updates === "function" ? updates(prev) : updates;
      return applyProfileUpdates(prev, payload ?? {});
    });
  }, []);

  const value = useMemo<ProfileCtx>(
    () => ({ profile, save, hydrated }),
    [profile, save, hydrated],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
