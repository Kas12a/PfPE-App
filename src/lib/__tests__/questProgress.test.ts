import { questCompletionUpdate } from "../questProgress";
import type { Profile } from "../../context/ProfileProvider";

describe("questCompletionUpdate", () => {
  const profile = {
    name: "Explorer",
    avatar: "🌿",
    level: 1,
    points: 100,
    rank: 2,
    streak: 3,
    longestStreak: 5,
    playMode: "individual",
    league: "sprout",
    questsCompletedThisWeek: 4,
    weeklyTarget: 10,
    lastWeeklyReset: "2025-01-01",
    isSignedIn: true,
    hasOnboarded: true,
    hasSeenIntro: true,
    language: "en",
    premiumTier: "free",
    walletAddress: null,
  } as Profile;

  it("increments points and weekly completions", () => {
    const update = questCompletionUpdate(profile, 75);
    expect(update.points).toBe(175);
    expect(update.questsCompletedThisWeek).toBe(5);
  });

  it("handles missing counters", () => {
    const minimal = { ...profile, points: 0, questsCompletedThisWeek: 0 } as Profile;
    const update = questCompletionUpdate(minimal, 20);
    expect(update.points).toBe(20);
    expect(update.questsCompletedThisWeek).toBe(1);
  });
});
