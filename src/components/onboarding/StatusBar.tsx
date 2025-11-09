import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export const OnboardingStatusBar = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.side}>
        <View style={styles.timePill}>
          <Text style={styles.time}>9:41</Text>
        </View>
      </View>
      <View style={styles.islandContainer}>
        <View style={styles.island}>
          <View style={styles.camera} />
          <View style={styles.dot} />
        </View>
      </View>
      <View style={[styles.side, styles.metrics]}>
        <View style={styles.signal} />
        <View style={styles.wifi} />
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 59,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 8,
    zIndex: 10,
  },
  side: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  timePill: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  time: {
    color: colors.text,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  islandContainer: {
    width: 140,
    alignItems: "center",
  },
  island: {
    width: 120,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.9)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 62,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#000",
    marginRight: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1F1F1F",
  },
  metrics: {
    justifyContent: "flex-end",
    gap: 8,
  },
  signal: {
    width: 18,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.text,
  },
  wifi: {
    width: 18,
    height: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.text,
  },
  battery: {
    width: 26,
    height: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  batteryFill: {
    height: 6,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
});
