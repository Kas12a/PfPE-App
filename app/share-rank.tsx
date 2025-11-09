import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, Screen } from "../components/ui";
import { colors } from "../src/theme/colors";
import { space } from "../src/theme/spacing";

export default function ShareRankModal() {
  return (
    <Screen>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg }}>
        <Card style={styles.sheet}>
          <Text style={styles.app}>Play for Planet Earth</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🌱</Text>
          </View>
          <Text style={styles.rank}>#7</Text>
          <Text style={styles.subtitle}>In Global Rankings!</Text>

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>2,450</Text>
              <Text style={styles.metricLabel}>Points</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>8.4 kg</Text>
              <Text style={styles.metricLabel}>CO₂ Saved</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>12 kWh</Text>
              <Text style={styles.metricLabel}>Energy Saved</Text>
            </View>
          </View>

          <Button title="Share" onPress={() => {}} style={{ marginTop: space.lg }} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: space.lg, alignItems: "center" },
  app: { color: colors.textDim, marginBottom: 8, fontWeight: "700" },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(217,255,63,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeEmoji: { fontSize: 34 },
  rank: { color: colors.neon, fontSize: 36, fontWeight: "900" },
  subtitle: { color: colors.text, marginTop: 6, marginBottom: 12, fontWeight: "700" },
  metrics: { flexDirection: "row", width: "100%", marginTop: 6 },
  metric: { flex: 1, alignItems: "center", paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.06)", marginHorizontal: 4, borderRadius: 12 },
  metricValue: { color: colors.text, fontWeight: "900", fontSize: 18 },
  metricLabel: { color: colors.textDim, marginTop: 4 },
});
