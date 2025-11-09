import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import GradientCard from "../../components/ui/GradientCard";
import ListItem from "../../components/ui/ListItem";
import Screen from "../../components/ui/Screen";
import SectionHeader from "../../components/ui/SectionHeader";
import { S } from "../../src/theme/spacing";

const data: Record<
  string,
  { title: string; category: string; about: string; impact: string; badge: string }
> = {
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
  const q = data[id ?? "plant-tree"];

  return (
    <Screen showBack title={q.title} subtitle={q.category}>
      {/* three stat chips row */}
      <View style={styles.chipsRow}>
        <Chip icon="🏅" label="+100 points" tint="green" />
        <Chip icon="⏱️" label={q.badge.split("·")[1].trim()} tint="blue" />
        <Chip icon="✨" label={q.badge.split("·")[0]} tint="yellow" />
      </View>

      <SectionHeader title="About This Quest" subtitle={q.about} style={{ marginTop: S.lg }} />

      <GradientCard
        title="Environment Impact"
        leftValue={q.impact}
        style={{ marginTop: S.md }}
      />

      <SectionHeader title="How to Complete" style={{ marginTop: S.lg }} />

      <Card style={{ marginTop: S.md }}>
        <ListItem left="1" title="Gather your supplies" />
        <ListItem left="2" title="Follow the quest instruction" />
        <ListItem left="3" title="Take a photo or check-in" />
        <ListItem left="4" title="Submit for verification" />
      </Card>

      <Card style={{ marginTop: S.lg, backgroundColor: "#74a6c433" }}>
        <SectionHeader title="Verification Method" subtitle="Upload a photo or check-in at the location to verify completion" />
      </Card>

      <Button label="Mark as Completed" style={{ marginTop: S.lg }} onPress={() => router.back()} />
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
