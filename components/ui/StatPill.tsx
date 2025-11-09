import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";
import { Type } from "../../src/theme/typography";

export default function StatPill({
  label,
  value,
  color = Colors.text,
}: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={[Type.caption, { color: Colors.textMuted }]}>{label}</Text>
      <Text style={[Type.h2, { color, marginTop: 2 }]}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 18,
    paddingVertical: S.md,
    paddingHorizontal: S.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
