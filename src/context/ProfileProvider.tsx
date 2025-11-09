import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

type Profile = {
  name: string;
  points: number;
  rank: number;
  streak: number;
  email?: string;
  avatar?: string | null;
  level?: number;
  ageRange?: string;
  playMode?: string;
  league?: string | null;
  firebaseUid?: string;
  questsCompletedThisWeek?: number;
  weeklyTarget?: number;
  lastWeeklyReset?: string; // week key to know when to reset
  isSignedIn?: boolean;
  hasOnboarded?: boolean;
  hasSeenIntro?: boolean;
};
type Ctx = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  hydrated: boolean;
};

const ProfileContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "@pfpe/profile";

function startOfWeekKey(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay(); // 0..6 (Sun..Sat)
  // Make Monday the start of the week: compute diff from Monday (1)
  const diff = (day === 0 ? -6 : 1) - day; // if Sunday (0), go back 6 days
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10); // e.g., 2025-02-17
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    points: 0,
    rank: 0,
    streak: 0,
    email: "",
    avatar: null,
    level: 1,
    ageRange: "",
    playMode: "individual",
    league: null,
    questsCompletedThisWeek: 0,
    weeklyTarget: 15,
    lastWeeklyReset: startOfWeekKey(),
    isSignedIn: false,
    hasOnboarded: false,
    hasSeenIntro: false,
  });
  const [hydrated, setHydrated] = useState(false);

  // Load persisted profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as Profile;
          setProfile((prev) => {
            const merged = { ...prev, ...data } as Profile;
            const currentKey = startOfWeekKey();
            if (merged.lastWeeklyReset !== currentKey) {
              return {
                ...merged,
                questsCompletedThisWeek: 0,
                lastWeeklyReset: currentKey,
              };
            }
            return merged;
          });
        } else {
          setProfile((prev) => ({ ...prev, lastWeeklyReset: startOfWeekKey() }));
        }
      } catch {}
      if (mounted) setHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProfile((prev) => ({
        ...prev,
        firebaseUid: user?.uid ?? undefined,
        email: user?.email ?? prev.email,
        isSignedIn: Boolean(user),
      }));
    });
    return unsubscribe;
  }, []);

  // Persist on changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch {}
    })();
  }, [profile]);

  return <ProfileContext.Provider value={{ profile, setProfile, hydrated }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
