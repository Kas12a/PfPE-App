import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Colors } from "../../src/theme/colors";

/**
 * Simple themed View with background variants.
 * Props:
 *  - bg: "background" | "surface" | "card" | "cardElevated"
 */
type Props = ViewProps & {
  bg?: "background" | "surface" | "card" | "cardElevated";
};

export default function ThemedView({
  bg = "background",
  style,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const backgroundColor =
    bg === "surface"
      ? Colors.surface
      : bg === "card"
      ? Colors.card
      : bg === "cardElevated"
      ? Colors.cardElevated
      : Colors.background;

  return (
    <View {...rest} style={[styles.base, { backgroundColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexShrink: 0 },
});
