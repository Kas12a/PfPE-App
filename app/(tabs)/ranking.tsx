// app/(tabs)/ranking.tsx
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LeaderboardRow from "../../components/ui/LeaderboardRow";
import Pills from "../../components/ui/Pills";
import ProgressBar from "../../components/ui/ProgressBar";
import Screen from "../../components/ui/Screen";
import Section from "../../components/ui/Section";
import SectionHeader from "../../components/ui/SectionHeader";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

const tabs = ["Global", "My Group", "Following"] as const;

const leaders = [
  {
    id: "eco1",
    rank: 1,
    name: "EcoWarrior23",
    points: 3450,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300",
  },
  {
    id: "eco2",
    rank: 2,
    name: "Jason Bao",
    points: 3120,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
  },
  {
    id: "eco3",
    rank: 3,
    name: "Nature Lover",
    points: 2890,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
  },
  {
    id: "you",
    rank: 7,
    you: true,
    name: "Sara Leaf (YOU)",
    points: 2450,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
  },
];

export default function RankingScreen() {
  const [active, setActive] = React.useState<(typeof tabs)[number]>("Global");

  return (
    <Screen title="Ranking" subtitle="See how you rank among eco-warriors">
      {/* Top card */}
      <Card style={styles.rankCard}>
        <View style={styles.rankHeaderRow}>
          <SectionHeader
            title="Your ranking this week"
            rightIcon="🏆"
            rightIconSize={28}
          />
        </View>

        <View style={{ height: S.xl }} />
        <SectionHeader title="#7" subtitle="Progress to top 3   65%" />
        <ProgressBar progress={0.65} style={{ marginTop: S.md }} />

        <Button
          label="View Your Stats"
          style={{ marginTop: S.lg }}
          onPress={() => router.push("/ranking/you")}
        />
      </Card>

      {/* tabs */}
      <View style={{ marginTop: S.lg }}>
        <Pills
          items={tabs as unknown as string[]}
          active={active}
          onChange={(v) => setActive(v as any)}
        />
      </View>

      {/* list */}
      <Section style={{ marginTop: S.md }}>
        {leaders.map((l) => (
          <LeaderboardRow
            key={l.id}
            rank={l.rank}
            title={l.name}
            points={l.points}
            avatarUri={l.avatar}
            highlight={!!l.you}
            onPress={() => router.push(`/ranking/${l.id}`)}
          />
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rankCard: {
    paddingTop: S.lg,
    paddingBottom: S.xl,
    backgroundColor: Colors.card,
  },
  rankHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
