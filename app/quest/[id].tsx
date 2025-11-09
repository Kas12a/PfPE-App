import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import GradientCard from "../../components/ui/GradientCard";
import ListItem from "../../components/ui/ListItem";
import Screen from "../../components/ui/Screen";
import SectionHeader from "../../components/ui/SectionHeader";
import { S } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";

const data: Record<
  string,
  { title: string; category: string; about: string; impact: string; badge: string }
> = {
  // IDs used by app/(tabs)/quests.tsx
  walk: {
    title: "Walk to work",
    category: "movement",
    about: "Choose active transportation for your commute",
    impact: "1.2 kg CO₂ saved",
    badge: "Easy · 30 min",
  },
  "reusable-cup": {
    title: "Use a reusable cup",
    category: "waste",
    about: "Avoid single-use cups by bringing your own",
    impact: "0.3 kg waste avoided",
    badge: "Easy · 2 min",
  },
  "plant-based": {
    title: "Plant-based lunch",
    category: "food",
    about: "Swap meat for a plant-based meal",
    impact: "2.5 kg CO₂ saved",
    badge: "Easy · 20 min",
  },
  "led-bulb": {
    title: "Switch to LED bulb",
    category: "energy",
    about: "Replace an incandescent bulb with an LED",
    impact: "Energy saver",
    badge: "Easy · 10 min",
  },
  // Extra examples kept for future use
  "plant-tree": {
    title: "Plant a tree",
    category: "nature",
    about: "Help reforest your local area",
    impact: "5 kg CO₂, offset/year",
    badge: "Medium · 45 min",
  },
  unplug: {
    title: "Unplug devices overnight",
    category: "energy",
    about: "Save energy while you sleep",
    impact: "0.5 kWh saved",
    badge: "Easy · 5 min",
  },
  "walk-bike": {
    title: "Walk or bike to work",
    category: "movement",
    about: "Choose active transportation",
    impact: "1.5 kg CO₂ saved",
    badge: "Easy · 30 min",
  },
};

export default function QuestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = data[id ?? "walk"] ?? data["walk"]; // safe fallback
  const { setProfile } = useProfile();
  const { showToast } = useToast();

  return (
    <Screen>
      <SectionHeader title={q.title} subtitle={q.category} />
      {/* three stat chips row */}
      <View style={styles.chipsRow}>
        <Chip icon="🏅" label="+100 points" tint="green" />
        <Chip icon="⏱️" label={q.badge.split("·")[1].trim()} tint="blue" />
        <Chip icon="✨" label={q.badge.split("·")[0]} tint="yellow" />
      </View>

      <SectionHeader title="About This Quest" subtitle={q.about} style={{ marginTop: S.lg }} />

      <GradientCard style={{ marginTop: S.md }}>
        <SectionHeader title="Environment Impact" subtitle={q.impact} />
      </GradientCard>

      <SectionHeader title="How to Complete" style={{ marginTop: S.lg }} />

      <Card style={{ marginTop: S.md }}>
        <ListItem title="Gather your supplies" />
        <ListItem title="Follow the quest instruction" />
        <ListItem title="Take a photo or check-in" />
        <ListItem title="Submit for verification" />
      </Card>

      <Card style={{ marginTop: S.lg, backgroundColor: "#74a6c433" }}>
        <SectionHeader title="Verification Method" subtitle="Upload a photo or check-in at the location to verify completion" />
      </Card>

      <Button
        label="Mark as Completed"
        style={{ marginTop: S.lg }}
        onPress={() => {
          const ptsById: Record<string, number> = {
            walk: 30,
            "reusable-cup": 15,
            "plant-based": 25,
            "led-bulb": 20,
          };
          const add = ptsById[id ?? "walk"] ?? 10;
          setProfile?.((prev) => ({
            ...prev,
            points: (prev.points ?? 0) + add,
            questsCompletedThisWeek: (prev.questsCompletedThisWeek ?? 0) + 1,
          }));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast(`+${add} pts! ${q.title}`);
          router.back();
        }}
      />
      <Button
        label="Share Quest"
        variant="secondary"
        style={{ marginTop: S.md, marginBottom: S.xl }}
        onPress={() => router.push("/share-rank")}
      />
    </Screen>
  );
}

function Chip({ icon, label, tint }: { icon: string; label: string; tint: "green" | "blue" | "yellow" }) {
  const bg =
    tint === "green"
      ? "#1c4030"
      : tint === "blue"
      ? "#203446"
      : "#3b3a1e";

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <SectionHeader title={`${icon} ${label}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: "row", gap: S.md, marginTop: S.sm },
  chip: { flex: 1, paddingVertical: S.md, borderRadius: 16, alignItems: "center" },
});
