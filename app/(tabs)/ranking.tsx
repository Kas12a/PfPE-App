import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Card,
  ListItem,
  ProgressBar,
  Screen,
  SectionHeader,
} from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

const TABS = ["Global", "My Group", "Following"];

export default function RankingScreen() {
  const [tab, setTab] = useState("Global");

  const leaders = [
    { id: "eco", name: "EcoWarrior23", pts: 3450, rank: 1 },
    { id: "jason", name: "Jason Bao", pts: 3120, rank: 2 },
    { id: "nature", name: "Nature Lover", pts: 2890, rank: 3 },
    { id: "you", name: "Sara Leaf (YOU)", pts: 2450, rank: 7 },
  ];

  return (
    <Screen>
      <SectionHeader title="Ranking" subtitle="See how you rank among eco-warriors" />

      {/* Rank banner */}
      <Card style={styles.rankCard}>
        <View style={styles.rankRow}>
          <View>
            <Text style={styles.rankNo}>#7</Text>
            <Text style={styles.rankCaption}>Your ranking this week</Text>
          </View>
          <Text style={styles.trophy}>🏆</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <ProgressBar progress={0.65} />
          <Text style={styles.progressNote}>Progress to top 3 — 65%</Text>
        </View>
        <Button
          title="View Your Stats"
          onPress={() => router.push("/ranking-detail")}
          style={{ marginTop: 12 }}
        />
      </Card>

      {/* Segmented tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => {
          const on = t === tab;
          return (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, on && styles.tabOn]}>
              <Text style={[styles.tabTxt, on && styles.tabTxtOn]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Leader list */}
      {leaders.map((u) => (
        <ListItem
          key={u.id}
          title={u.name}
          subtitle={u.rank <= 3 ? `#${u.rank}` : `#${u.rank}`}
          right={
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.pointsRight}>{u.pts.toLocaleString()} pts</Text>
              {u.id !== "you" && (
                <Button title="View" onPress={() => router.push(`/ranking/${u.id}`)} />
              )}
            </View>
          }
        />
      ))}

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rankCard: { marginHorizontal: space.lg, padding: space.lg },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rankNo: { color: colors.text, fontSize: 28, fontWeight: "900" },
  rankCaption: { color: colors.textDim, marginTop: 4 },
  trophy: { fontSize: 36 },
  progressNote: { marginTop: 6, color: colors.textDim },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    marginTop: space.lg,
    marginBottom: space.md,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginRight: 8,
  },
  tabOn: {
    backgroundColor: "rgba(217,255,63,0.16)",
    borderColor: colors.neon,
  },
  tabTxt: { color: colors.text },
  tabTxtOn: { color: colors.neon, fontWeight: "800" },
  pointsRight: { color: colors.neon, fontWeight: "900" },
});
