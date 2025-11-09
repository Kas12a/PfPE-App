import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../src/theme/colors";

export default function ProgressBar({ value = 0 }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value * 100))}%` }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.neonDim,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.neon,
  },
});
