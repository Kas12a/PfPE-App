import React, { useMemo } from "react";
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, ProgressBar, Screen, SectionHeader } from "../../components/ui";
import { colors, space } from "../../src/theme/colors";
import { useProfile } from "../../src/hooks/useProfile";
import { getWeeklyStats } from "../../src/store/stats";
import { dailyQuests } from "../../src/data/quests";
import { router } from "expo-router";

const fallbackAvatar = { uri: "https://placehold.co/100x100/1f2f27/ffffff?text=Leaf" };
const heroImage = { uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80" };

export default function HomeScreen() {
  const { profile } = useProfile();
  const pts = profile?.points ?? 0;
  const weeklyDone = profile?.questsCompletedThisWeek ?? 0;
  const weeklyTarget = profile?.weeklyTarget ?? 15;
  const rank = profile?.rank ?? 0;
  const name = profile?.name?.trim() || "Explorer";
  const stats = getWeeklyStats(pts);
  const emptyState = pts === 0 && weeklyDone === 0;
  const featuredQuests = useMemo(() => dailyQuests.slice(0, 3), []);

  return (
    <Screen contentContainerStyle={{ padding: 0 }}>
      <ImageBackground source={heroImage} resizeMode="cover" style={styles.hero}>
        <LinearGradient colors={["rgba(5,26,35,0)", "rgba(5,26,35,0.88)"]} style={StyleSheet.absoluteFill} />
        <View style={styles.heroHeader}>
          <Image source={profile?.avatar ? { uri: profile.avatar } : fallbackAvatar} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>Hi, {name} 👋</Text>
            <Text style={styles.caption}>Let’s make today count</Text>
          </View>
          {emptyState ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New Player</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Your Eco Points</Text>
          <Text style={styles.heroPoints}>{pts.toLocaleString()}</Text>
          <Text style={styles.heroHint}>
            {emptyState ? "No points yet — pick a quest below to earn your first badge." : "Keep stacking quests to climb the league."}
          </Text>
          <Pressable style={styles.heroCta} onPress={() => router.push("/(tabs)/quests")}>
            <Text style={styles.heroCtaText}>{emptyState ? "Browse today’s quests" : "Jump into quests"}</Text>
          </Pressable>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today’s Quests</Text>
          <Text style={styles.viewAll} onPress={() => router.push("/(tabs)/quests")}>View All</Text>
        </View>
        {featuredQuests.map((quest) => (
          <View key={quest.id} style={styles.questCard}>
            <View style={styles.questIconWrap}>
              <Text style={styles.questTypeIcon}>
                {quest.type === "photo" ? "📷" : quest.type === "video" ? "🎥" : "✅"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questSubtitle}>{quest.subtitle}</Text>
              <Text style={styles.questImpact}>{quest.impact}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={styles.questTypePill}>
                <Text style={styles.questTypePillText}>{quest.type === "check" ? "Instant" : "Needs proof"}</Text>
              </View>
              <Text style={styles.questPoints}>+{quest.points}</Text>
            </View>
          </View>
        ))}

        <SectionHeader title="Weekly Challenge" subtitle="Complete 15 quests" />
        <Card style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>Complete {weeklyTarget} quests this week</Text>
          <Text style={styles.challengeProgressText}>
            {weeklyDone} of {weeklyTarget} quests
          </Text>
          <ProgressBar progress={weeklyTarget === 0 ? 0 : weeklyDone / weeklyTarget} />
          <View style={styles.rewardPill}>
            <Text style={styles.rewardPillText}>🏅 Reward: Eco Hero Badge + 100 points</Text>
          </View>
        </Card>

        <SectionHeader title="Your Impact This Week" />
        <View style={styles.impactGrid}>
          <Card style={[styles.impactCell, { backgroundColor: colors.cardGreen }]}>
            <Text style={styles.impactValue}>{stats.co2SavedKg} kg</Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
          </Card>
          <Card style={[styles.impactCell, { backgroundColor: colors.cardBlue }]}>
            <Text style={styles.impactValue}>{stats.wasteAvoidedKg} kg</Text>
            <Text style={styles.impactLabel}>Waste Avoided</Text>
          </Card>
          <Card style={[styles.impactCell, { backgroundColor: colors.cardYellow }]}>
            <Text style={styles.impactValue}>{stats.energySavedKwh} kWh</Text>
            <Text style={styles.impactLabel}>Energy Saved</Text>
          </Card>
          <Card style={[styles.impactCell, { backgroundColor: colors.cardPurple }]}>
            <Text style={styles.impactValue}>{rank ? `#${rank}` : "—"}</Text>
            <Text style={styles.impactLabel}>Leaderboard Rank</Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 380,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    paddingHorizontal: space.lg,
    paddingTop: 80,
    paddingBottom: space.lg,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    marginRight: space.md,
  },
  hi: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  caption: {
    color: "rgba(255,255,255,0.7)",
  },
  newBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  newBadgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  heroCard: {
    marginTop: space.xl,
    padding: space.lg,
    borderRadius: 24,
    backgroundColor: "rgba(5,26,35,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  heroLabel: { color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  heroPoints: { color: "#DBF262", fontSize: 48, fontWeight: "700" },
  heroHint: { color: "rgba(255,255,255,0.7)", marginTop: 4 },
  heroCta: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroCtaText: { color: "#FFFFFF", fontWeight: "600" },
  body: {
    backgroundColor: colors.background,
    padding: space.lg,
    gap: space.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  viewAll: {
    color: colors.neon,
    fontWeight: "600",
  },
  questCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: space.sm,
  },
  questIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  questTypeIcon: { fontSize: 24 },
  questTitle: { color: colors.text, fontWeight: "700" },
  questSubtitle: { color: colors.textDim },
  questImpact: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  questTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 8,
  },
  questTypePillText: { color: colors.textDim, fontSize: 12, fontWeight: "600" },
  questPoints: { color: colors.neon, fontWeight: "800", fontSize: 18 },
  challengeCard: {
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
    gap: space.md,
  },
  impactCell: {
    width: "48%",
    borderRadius: 16,
    padding: space.md,
  },
  impactValue: { color: colors.text, fontSize: 22, fontWeight: "800" },
  impactLabel: { color: colors.textDim, marginTop: 4 },
});
