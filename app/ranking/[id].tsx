// app/ranking/[id].tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ListItem from "../../components/ui/ListItem";
import Screen from "../../components/ui/Screen";
import Section from "../../components/ui/Section";
import SectionHeader from "../../components/ui/SectionHeader";
import StatPill from "../../components/ui/StatPill";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

const BANNER =
  "https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200";

const YOU = {
  id: "you",
  title: "#7 YOU",
  points: 2450,
  co2: "8.4 kg",
  energy: "12 kWh",
  stats: [
    { icon: "✅", label: "Quests", value: "24" },
    { icon: "🔥", label: "Day Streak", value: "7" },
    { icon: "🎁", label: "Rewards", value: "2" },
  ],
  recent: [
    { icon: "🌳", title: "Plant a tree", status: "Completed" },
    { icon: "👟", title: "Walk to work", status: "Completed" },
    { icon: "🌊", title: "Beach cleanup", status: "Completed" },
  ],
};

const ECO1 = {
  id: "eco1",
  title: "#1 EcoWarrior",
  points: 3450,
  co2: "24.2 kg",
  energy: "32 kWh",
  stats: [
    { icon: "✅", label: "Quests", value: "38" },
    { icon: "🔥", label: "Day Streak", value: "12" },
    { icon: "🎁", label: "Rewards", value: "6" },
  ],
  recent: [
    { icon: "💡", title: "Switch to LED bulb", status: "Completed" },
    { icon: "🔌", title: "Unplug devices for a day", status: "Completed" },
    { icon: "☀️", title: "Use solar energy", status: "Completed" },
  ],
};

const byId: Record<string, any> = { you: YOU, eco1: ECO1, eco2: ECO1, eco3: ECO1 };

export default function RankingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useMemo(() => byId[id ?? "you"] ?? YOU, [id]);

  return (
    <Screen showBack title="Ranking">
      {/* Banner card */}
      <Card style={styles.banner}>
        <Image source={{ uri: BANNER }} style={styles.bannerImg} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          {/* avatar circle */}
          <View style={styles.avatar} />
          <SectionHeader title={data.title} />
          <View style={styles.bannerStatsRow}>
            <SectionHeader title={String(data.points)} subtitle="Points" accent="blue" />
            <View style={styles.divider} />
            <SectionHeader title={data.co2} subtitle="CO₂ Saved" accent="green" />
            <View style={styles.divider} />
            <SectionHeader title={data.energy} subtitle="Energy Saved" accent="yellow" />
          </View>
        </View>
      </Card>

      {/* stat pills */}
      <Section style={{ marginTop: S.lg, gap: S.lg, flexDirection: "row", justifyContent: "space-between" }}>
        {data.stats.map((s: any, i: number) => (
          <StatPill key={i} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </Section>

      <SectionHeader title="Recent Activities" style={{ marginTop: S.lg }} />
      <Section>
        {data.recent.map((r: any, i: number) => (
          <ListItem key={i} left={r.icon} title={r.title} rightLabel="Completed" />
        ))}
      </Section>

      <Button
        label={id === "you" ? "Share My Rank" : "Follow"}
        style={{ marginTop: S.lg, marginBottom: S.xl }}
        onPress={() => {
          if (id === "you") router.push("/share-rank");
          else router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 0, overflow: "hidden" },
  bannerImg: { width: "100%", height: 220 },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  bannerContent: {
    ...StyleSheet.absoluteFillObject,
    padding: S.lg,
    justifyContent: "flex-end",
    gap: S.md,
  },
  avatar: {
    position: "absolute",
    top: S.lg,
    left: S.lg,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.neon,
    opacity: 0.9,
  },
  bannerStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: S.md,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
