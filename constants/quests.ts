// constants/quests.ts
export type QuestCategory = "all" | "nature" | "energy" | "movement";

export type Quest = {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  impact: string;
  category: Exclude<QuestCategory, "all">;
  categoryLabel: string;
  verification: string;
  steps: string[];
  icon: string; // using emoji for now
};

export const quests: Quest[] = [
  {
    id: "plant-tree",
    title: "Plant a tree",
    subtitle: "Help reforest your local area",
    points: 100,
    duration: "45 min",
    difficulty: "Medium",
    impact: "5 kg CO₂ offset/year",
    category: "nature",
    categoryLabel: "nature",
    verification: "Upload a photo or check-in at the location to verify completion",
    steps: ["Gather your supplies", "Follow the quest instruction", "Take a photo or check-in", "Submit for verification"],
    icon: "🌳",
  },
  {
    id: "unplug-overnight",
    title: "Unplug devices overnight",
    subtitle: "Save energy while you sleep",
    points: 20,
    duration: "5 min",
    difficulty: "Easy",
    impact: "0.5 kWh saved",
    category: "energy",
    categoryLabel: "energy",
    verification: "Tick off and add a quick photo as proof (optional).",
    steps: ["Identify idle devices", "Switch off power at the socket", "Set a nightly reminder", "Submit completion"],
    icon: "🔌",
  },
  {
    id: "active-commute",
    title: "Walk or bike to work",
    subtitle: "Choose active transportation",
    points: 30,
    duration: "30 min",
    difficulty: "Easy",
    impact: "1.2 kg CO₂ saved",
    category: "movement",
    categoryLabel: "movement",
    verification: "Check-in with GPS or upload a photo at the destination.",
    steps: ["Plan your route", "Choose walking or cycling", "Track your trip", "Submit for verification"],
    icon: "🚴‍♀️",
  },
];
