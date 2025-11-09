import React, { createContext, PropsWithChildren, useContext, useState } from "react";

type Profile = {
  name: string;
  points: number;
  rank: number;
  streak: number;
};
type Ctx = { profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>> };

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>({
    name: "Kas",
    points: 2450,
    rank: 7,
    streak: 7,
  });
  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
