import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Profile = {
  name: string;
  avatar: string | null;
  level: number;
  points: number;
  rank: number;
  streak: number;
};

export type ProfileUpdate = Partial<Profile>;

type ProfileContextValue = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  save: (updates: ProfileUpdate) => void;
};

const defaultProfile: Profile = {
  name: "Kas",
  avatar: "🌿",
  level: 7,
  points: 2450,
  rank: 7,
  streak: 7,
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const save = useCallback((updates: ProfileUpdate) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      save,
    }),
    [profile, save, setProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
