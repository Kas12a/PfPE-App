import type { Profile } from "../context/ProfileProvider";

export function questCompletionUpdate(profile: Profile, questPoints: number) {
  return {
    points: (profile.points ?? 0) + questPoints,
    questsCompletedThisWeek: (profile.questsCompletedThisWeek ?? 0) + 1,
  };
}
