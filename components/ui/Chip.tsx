import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { Type } from "../../src/theme/typography";

export default function Chip({ label, style }: { label: string; style?: ViewStyle }) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={[Type.caption, { color: Colors.text }]}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.chipBg,
    borderWidth: 1,
    borderColor: Colors.chipStroke,
  },
});
