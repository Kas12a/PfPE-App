import { applyProfileUpdates, startOfWeekKey, type Profile } from "../ProfileProvider";
function defaultProfile(): Profile {
  return {
    userId: undefined,
    email: undefined,
    name: "Explorer",
    avatar: "🌿",
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
}

describe("applyProfileUpdates", () => {
  it("normalizes names and avatars", () => {
    const updated = applyProfileUpdates(defaultProfile(), { name: "   ", avatar: "" });
    expect(updated.name).toBe("Explorer");
    expect(updated.avatar).toBe("🌿");
  });

  it("derives level from points when not provided", () => {
    const updated = applyProfileUpdates(defaultProfile(), { points: 1200 });
    expect(updated.level).toBeGreaterThan(1);
    expect(updated.points).toBe(1200);
  });

  it("tracks longest streak", () => {
    const base = { ...defaultProfile(), longestStreak: 5 };
    const updated = applyProfileUpdates(base, { streak: 7 });
    expect(updated.longestStreak).toBe(7);
  });
});
