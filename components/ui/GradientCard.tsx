import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";

type Props = React.PropsWithChildren<{
  colors?: string[];
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}>;

export default function GradientCard({
  children,
  colors = ["#2A3C46", "#1C2930"],
  radius = 20,
  padding = 20,
  style,
}: Props) {
  return (
    <LinearGradient colors={colors as any} style={[styles.g, { borderRadius: radius, padding }, style]}>
      <View style={{ gap: 8 }}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  g: { width: "100%" },
});
