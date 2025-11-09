import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../src/theme/colors";

type Props = {
  value?: number;    // 0..1
  progress?: number; // alias, 0..1
};

export default function ProgressBar({ value, progress }: Props) {
  const v = typeof value === "number" ? value : typeof progress === "number" ? progress : 0;
  const pct = Math.min(100, Math.max(0, v * 100));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
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
