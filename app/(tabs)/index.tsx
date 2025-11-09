import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Card,
  ListItem,
  ProgressBar,
  Screen,
  SectionHeader
} from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

const avatar = { uri: "https://placehold.co/100x100/1f2f27/ffffff?text=Leaf" };
const icShoe = { uri: "https://placehold.co/64x64/00aa55/ffffff?text=S" };
const icCup = { uri: "https://placehold.co/64x64/00aa55/ffffff?text=C" };
const icSalad = { uri: "https://placehold.co/64x64/00aa55/ffffff?text=Sa" };
const banner = { uri: "https://placehold.co/600x200/0b1d18/ffffff?text=Banner" };


export default function HomeScreen() {
  // demo data for UI rendering
  const quests = [
    {
      icon: icShoe,
      title: "Walk to work",
      subtitle: "1.2 kg CO₂ saved",
      right: <Text style={styles.pointsRight}>+30{"\n"}pts</Text>,
    },
    {
      icon: icCup,
      title: "Using reusable coffee cup",
      subtitle: "0.3 kg waste avoided",
      right: <Text style={styles.pointsRight}>+15{"\n"}pts</Text>,
    },
    {
      icon: icSalad,
      title: "Plant-based lunch",
      subtitle: "2.5 kg CO₂ saved",
      right: <Text style={styles.pointsRight}>+25{"\n"}pts</Text>,
    },
  ];

  return (
    <Screen>
      {/* Header Greeting */}
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hi}>Hi, Sara 👋</Text>
          <Text style={styles.caption}>Let’s make today count</Text>
        </View>
        {/* you can add a bell or profile here if needed */}
      </View>

      {/* Points + Streak banner */}
      <Card style={styles.pointsCard}>
        <Image source={banner} style={styles.bannerBG} />
        <View style={styles.pointsRow}>
          <View>
            <Text style={styles.pointsValue}>2,450</Text>
            <Text style={styles.pointsLabel}>This Week</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.streakPill}>🔥 7 Day Strike</Text>
            <Text style={styles.rankDelta}>+320 pts</Text>
            <Text style={styles.rankPill}>#7</Text>
          </View>
        </View>
      </Card>

      {/* Today's Quests */}
      <SectionHeader title="Today’s Quests" right={<Text style={styles.viewAll}>View All</Text>} />
      {quests.map((q, i) => (
        <ListItem
          key={i}
          icon={q.icon}
          title={q.title}
          subtitle={q.subtitle}
          right={q.right}
        />
      ))}

      {/* Weekly Challenge */}
      <SectionHeader title="Weekly Challenge" />
      <Card style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>Complete 15 quests this week</Text>
        <Text style={styles.challengeProgressText}>11 of 15 quests</Text>
        <ProgressBar progress={0.73} />
        <View style={styles.rewardPill}>
          <Text style={styles.rewardPillText}>🏅 Reward: Eco Hero Badge + 100 points</Text>
        </View>
      </Card>

      {/* Impact grid */}
      <SectionHeader title="Your Impact This Week" />
      <View style={styles.impactGrid}>
        <Card style={[styles.impactCell, { backgroundColor: colors.cardGreen }]}>
          <Text style={styles.impactValue}>8.4 kg</Text>
          <Text style={styles.impactLabel}>CO₂ Saved</Text>
        </Card>
        <Card style={[styles.impactCell, { backgroundColor: colors.cardBlue }]}>
          <Text style={styles.impactValue}>2.1 kg</Text>
          <Text style={styles.impactLabel}>Waste Avoided</Text>
        </Card>
        <Card style={[styles.impactCell, { backgroundColor: colors.cardYellow }]}>
          <Text style={styles.impactValue}>12 kWh</Text>
          <Text style={styles.impactLabel}>Energy Saved</Text>
        </Card>
        <Card style={[styles.impactCell, { backgroundColor: colors.cardPurple }]}>
          <Text style={styles.impactValue}>5.5 hrs</Text>
          <Text style={styles.impactLabel}>Active Hours</Text>
        </Card>
      </View>

      {/* Spacer at bottom so tab bar doesn’t cover content */}
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: space.md },
  hi: { fontSize: 24, fontWeight: "800", color: colors.text },
  caption: { fontSize: 13, color: colors.textDim, marginTop: 2 },

  pointsCard: {
    marginHorizontal: space.lg,
    overflow: "hidden",
  },
  bannerBG: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
    resizeMode: "cover",
    borderRadius: 16,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: space.lg,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
  },
  pointsLabel: { marginTop: 2, color: colors.textDim },
  streakPill: {
    backgroundColor: colors.card,
    color: colors.neon,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
    overflow: "hidden",
  },
  rankDelta: { marginTop: 8, color: colors.text, fontWeight: "700", textAlign: "right" },
  rankPill: {
    marginTop: 2,
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "700",
  },

  viewAll: { color: colors.neon, fontWeight: "700" },
  pointsRight: {
    textAlign: "right",
    color: colors.neon,
    fontWeight: "800",
  },

  challengeCard: {
    marginHorizontal: space.lg,
    padding: space.lg,
  },
  challengeTitle: { color: colors.text, fontWeight: "700", fontSize: 16, marginBottom: 6 },
  challengeProgressText: { color: colors.textDim, marginBottom: 10 },
  rewardPill: {
    marginTop: 12,
    backgroundColor: "rgba(217,255,63,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  rewardPillText: { color: colors.text, fontWeight: "600" },

  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: space.lg,
  },
  impactCell: {
    width: "50%",
    padding: space.lg,
    borderRadius: 16,
  },
  impactValue: { color: colors.text, fontSize: 22, fontWeight: "800" },
  impactLabel: { color: colors.textDim, marginTop: 4 },
});
