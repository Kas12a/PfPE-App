import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Card,
  ListItem,
  ProgressBar,
  Screen,
  SectionHeader
} from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

const FILTERS = ["All", "Nature", "Energy", "Movement", "Waste"];

export default function QuestsScreen() {
  const [active, setActive] = useState("All");

  const quests = [
    { id: "walk", title: "Walk to work", sub: "1.2 kg CO₂ saved", pts: 30 },
    { id: "reusable-cup", title: "Use a reusable cup", sub: "0.3 kg waste avoided", pts: 15 },
    { id: "plant-based", title: "Plant-based lunch", sub: "2.5 kg CO₂ saved", pts: 25 },
    { id: "led-bulb", title: "Switch to LED bulb", sub: "Energy saver", pts: 20 },
  ];

  return (
    <Screen>
      <SectionHeader
        title="Quests"
        subtitle="Pick a quest and earn points"
        right={<Text style={styles.viewAll}>Help</Text>}
      />

      {/* Pills / filters */}
      <View style={styles.pills}>
        {FILTERS.map((f) => {
          const isOn = f === active;
          return (
            <Pressable key={f} onPress={() => setActive(f)} style={[styles.pill, isOn && styles.pillOn]}>
              <Text style={[styles.pillText, isOn && styles.pillTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Featured weekly meta */}
      <Card style={styles.weekCard}>
        <Text style={styles.weekTitle}>Weekly Goal</Text>
        <Text style={styles.weekSub}>Complete 15 quests • You’ve done 11</Text>
        <ProgressBar progress={11 / 15} />
      </Card>

      {/* Quest list */}
      <SectionHeader title="Available Today" />
      {quests.map((q) => (
        <ListItem
          key={q.id}
          title={q.title}
          subtitle={q.sub}
          right={
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.pointsRight}>+{q.pts} pts</Text>
              <Button
                title="Start"
                onPress={() => router.push(`/quest/${q.id}`)}
                style={styles.startBtn}
              />
            </View>
          }
        />
      ))}

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewAll: { color: colors.neon, fontWeight: "700" },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  pill: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  pillOn: {
    backgroundColor: "rgba(217,255,63,0.16)",
    borderColor: colors.neon,
  },
  pillText: { color: colors.text },
  pillTextOn: { color: colors.neon, fontWeight: "700" },
  weekCard: { marginHorizontal: space.lg, padding: space.lg },
  weekTitle: { color: colors.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
  weekSub: { color: colors.textDim, marginBottom: 10 },
  pointsRight: { color: colors.neon, fontWeight: "800", marginBottom: 8 },
  startBtn: { marginTop: 6, minWidth: 92 },
});
