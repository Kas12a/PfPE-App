import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BadgeGrid,
  Button,
  Card,
  ListItem,
  ProgressBar,
  Screen,
  SectionHeader,
} from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { getBalance, type CreditAccount } from "../../src/lib/creditsService";
import { useToast } from "../../src/hooks/useToast";

export default function RewardsScreen() {
  const { profile } = useProfile();
  const { showToast } = useToast();
  const currentPoints = profile?.points ?? 2450;
  const nextMilestone = Math.ceil((currentPoints + 1) / 1000) * 1000; // next 1k block
  const toNext = Math.max(0, nextMilestone - currentPoints);
  const [creditsAccount, setCreditsAccount] = useState<CreditAccount | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const openCredits = () => router.push("/credits" as never);
  const openRedeemCredits = () => router.push("/credits/redeem" as never);

  useEffect(() => {
    let cancelled = false;
    if (!profile?.userId) {
      setCreditsAccount(null);
      return;
    }
    setCreditsLoading(true);
    (async () => {
      try {
        const acct = await getBalance();
        if (!cancelled) {
          setCreditsAccount(acct);
        }
      } catch (err) {
        if (!cancelled) showToast(err instanceof Error ? err.message : "Unable to load credits");
      } finally {
        if (!cancelled) setCreditsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile?.userId, showToast]);

  const badges = [
    { title: "Tree Guardian", icon: "🌳", locked: false },
    { title: "Plastic-Free Hero", icon: "♻️", locked: false },
    { title: "Energy Saver", icon: "⚡", locked: false },
    { title: "7-Day Streak", icon: "🔥", locked: false },
    { title: "Solar Hero", icon: "☀️", locked: true },
    { title: "Eco Warrior", icon: "🌎", locked: true },
  ];

  const rewards = [
    { id: "ecco", title: "Ecco Store", sub: "15% off entire purchase", cost: 500 },
    { id: "cafe", title: "Green Cafe", sub: "Free coffee with reusable cup", cost: 200 },
    { id: "bike", title: "Bike Share", sub: "1 week free membership", cost: 300 },
    { id: "plant", title: "Plant Box", sub: "Free starter herb garden", cost: 400 },
  ];

  return (
    <Screen>
      <SectionHeader title="Rewards" subtitle="Celebrate your impact" />

      <Card style={styles.creditsCard}>
        <View style={styles.creditsHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.creditsLabel}>Impact credits wallet</Text>
            <Text style={styles.creditsValue}>
              {creditsAccount ? creditsAccount.balance.toFixed(0) : creditsLoading ? "…" : "—"}
            </Text>
            <Text style={styles.creditsSubtitle}>Closed-loop credits – earn, redeem, donate</Text>
          </View>
          <View style={styles.creditsActions}>
            <Button
              title="View"
              size="sm"
              variant="secondary"
              onPress={openCredits}
              style={styles.creditsActionButton}
            />
            <Button
              title="Redeem"
              size="sm"
              onPress={openRedeemCredits}
            />
          </View>
        </View>
      </Card>

      {/* Milestone / points */}
      <Card style={styles.mileCard}>
        <View style={styles.mileHeader}>
          <Text style={styles.mileTitle}>Next Milestone</Text>
          <Text style={styles.mileToNext}>{toNext} pts to next reward</Text>
        </View>
        <View style={styles.mileRow}>
          <Text style={styles.milePoints}>{currentPoints.toLocaleString()}</Text>
          <Text style={styles.mileLabel}>current points</Text>
        </View>
        <ProgressBar progress={(currentPoints % 1000) / 1000} />
      </Card>

      {/* Badges */}
      <SectionHeader title="My Badges" subtitle="Keep completing quests to unlock more" />
      <Card style={styles.badgeCard}>
        <BadgeGrid items={badges} />
      </Card>

      {/* Available rewards */}
      <SectionHeader title="Available Rewards" />
      {rewards.map((r) => (
        <ListItem
          key={r.id}
          title={r.title}
          subtitle={r.sub}
          right={
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.costText}>{r.cost} pts</Text>
              <Button title="Redeem" size="sm" onPress={openRedeemCredits} />
            </View>
          }
        />
      ))}

      <SectionHeader title="Recent Points" />
      <ListItem title="Bike to Work" subtitle="Today" right={<Text style={styles.ptsPlus}>+50 pts</Text>} />
      <ListItem title="Zero Waste Lunch" subtitle="Today" right={<Text style={styles.ptsPlus}>+15 pts</Text>} />
      <ListItem title="Daily Quest Streak" subtitle="Yesterday" right={<Text style={styles.ptsPlus}>+70 pts</Text>} />

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  creditsCard: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  creditsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  creditsLabel: {
    color: colors.textDim,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 6,
  },
  creditsValue: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
  },
  creditsSubtitle: {
    color: colors.textDim,
    marginTop: 4,
  },
  creditsActions: {
    marginLeft: space.md,
    justifyContent: "center",
  },
  creditsActionButton: {
    marginBottom: space.sm,
  },
  mileCard: { marginHorizontal: space.lg, padding: space.lg },
  mileHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  mileTitle: { color: colors.text, fontWeight: "800" },
  mileToNext: { color: colors.textDim },
  mileRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 10 },
  milePoints: { color: colors.text, fontSize: 34, fontWeight: "900", marginRight: 10 },
  mileLabel: { color: colors.textDim },
  badgeCard: {
    marginHorizontal: space.lg,
    paddingVertical: space.md,
  },
  costText: { color: colors.textDim, marginBottom: 8 },
  ptsPlus: { color: colors.neon, fontWeight: "900" },
});
