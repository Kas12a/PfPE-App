import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, ListItem, Screen, SectionHeader } from "../components/ui";
import { colors } from "../src/theme/colors";
import { space } from "../src/theme/spacing";
import { useProfile } from "../src/hooks/useProfile";
import { getWeeklyStats, formatNumber } from "../src/store/stats";

export default function RankingDetailScreen() {
  const { profile } = useProfile();
  const pts = profile?.points ?? 2450;
  const rank = profile?.rank ?? 7;
  const w = getWeeklyStats(pts);
  return (
    <Screen>
      <SectionHeader title="Ranking" />
      <Card style={styles.banner}>
        <Text style={styles.rankNo}>#{rank} YOU</Text>
        <View style={styles.kpis}>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>{pts.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Points</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>{formatNumber(w.co2SavedKg)} kg</Text>
            <Text style={styles.kpiLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>{formatNumber(w.energySavedKwh)} kWh</Text>
            <Text style={styles.kpiLabel}>Energy Saved</Text>
          </View>
        </View>
      </Card>

      <View style={styles.quick}>
        <Card style={styles.quickBox}>
          <Text style={styles.quickValue}>24</Text>
          <Text style={styles.quickLabel}>Quests</Text>
        </Card>
        <Card style={styles.quickBox}>
          <Text style={styles.quickValue}>7</Text>
          <Text style={styles.quickLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.quickBox}>
          <Text style={styles.quickValue}>2</Text>
          <Text style={styles.quickLabel}>Rewards</Text>
        </Card>
      </View>

      <SectionHeader title="Recent Activities" />
      <ListItem title="Plant a tree" subtitle="Completed" />
      <ListItem title="Walk to work" subtitle="Completed" />
      <ListItem title="Beach cleanup" subtitle="Completed" />

      <Button
        title="Share My Rank"
        onPress={() => router.push("/share-rank")}
        style={{ marginHorizontal: space.lg, marginTop: space.xl }}
      />

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { marginHorizontal: space.lg, padding: space.lg },
  rankNo: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 12 },
  kpis: { flexDirection: "row", justifyContent: "space-between" },
  kpi: { alignItems: "center", flex: 1 },
  kpiValue: { color: colors.text, fontWeight: "900", fontSize: 20 },
  kpiLabel: { color: colors.textDim, marginTop: 4 },
  quick: { flexDirection: "row", paddingHorizontal: space.lg, marginTop: space.md },
  quickBox: { flex: 1, marginHorizontal: 6, paddingVertical: 16, alignItems: "center" },
  quickValue: { color: colors.text, fontWeight: "900", fontSize: 18 },
  quickLabel: { color: colors.textDim, marginTop: 4 },
});
