import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { space } from "../../theme/colors";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Text style={styles.text}>You are offline. Actions will sync when you reconnect.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#40281F",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#F5A524",
    paddingVertical: space.xs,
    paddingHorizontal: space.lg,
  },
  text: {
    color: "#FBD9A0",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default OfflineBanner;
