import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Screen } from "../components/ui";
import { colors } from "../src/theme/colors";
import { space } from "../src/theme/spacing";

export default function RedeemModal() {
  return (
    <Screen>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg }}>
        <Card style={styles.sheet}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
            <Text style={{ color: colors.textDim, fontWeight: "700" }}>✕</Text>
          </Pressable>
          <Text style={styles.app}>Play for Planet Earth</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🛍️</Text>
          </View>
          <Text style={styles.title}>Reward Redeemed! 🎉</Text>
          <Text style={styles.sub}>10% off ecco store</Text>

          <View style={styles.code}>
            <Text style={styles.codeText}>ECCO-8F4PBS</Text>
          </View>

          <Button title="Close" onPress={() => router.back()} style={{ marginTop: space.lg }} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: space.lg, alignItems: "center" },
  closeBtn: { position: "absolute", right: 14, top: 14 },
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
  title: { color: colors.text, fontWeight: "900", fontSize: 20, marginTop: 4 },
  sub: { color: colors.textDim, marginTop: 6 },
  code: {
    marginTop: 14,
    backgroundColor: colors.neon,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  codeText: { color: "#0B130F", fontWeight: "900", letterSpacing: 1 },
});
