import { router } from "expo-router";
import React from "react";
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

export default function RewardsScreen() {
  const currentPoints = 2450;
  const toNext = 550;

  const badges = [
    { title: "Tree Guardian", locked: false },
    { title: "Plastic-Free Hero", locked: false },
    { title: "Energy Saver", locked: false },
    { title: "7-Day Streak", locked: false },
    { title: "Solar Hero", locked: true },
    { title: "Eco Warrior", locked: true },
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
      <SectionHeader title="My Badges" />
      <BadgeGrid items={badges} />

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
              <Button title="Redeem" onPress={() => router.push("/redeem")} />
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
  mileCard: { marginHorizontal: space.lg, padding: space.lg },
  mileHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  mileTitle: { color: colors.text, fontWeight: "800" },
  mileToNext: { color: colors.textDim },
  mileRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 10 },
  milePoints: { color: colors.text, fontSize: 34, fontWeight: "900", marginRight: 10 },
  mileLabel: { color: colors.textDim },
  costText: { color: colors.textDim, marginBottom: 8 },
  ptsPlus: { color: colors.neon, fontWeight: "900" },
});
