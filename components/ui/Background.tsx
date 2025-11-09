import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: "background" | "surface" | "card" | "cardElevated";
};

export default function Background({
  children,
  style,
  variant = "background",
}: Props) {
  const bg =
    variant === "surface"
      ? Colors.surface
      : variant === "card"
      ? Colors.card
      : variant === "cardElevated"
      ? Colors.cardElevated
      : Colors.background;

  return <View style={[styles.base, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
