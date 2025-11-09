import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";
import { Type } from "../../src/theme/typography";

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary";
};

export default function Button({ title, onPress, style, variant = "primary" }: Props) {
  const backgroundColor =
    variant === "primary" ? Colors.accent : Colors.surface;
  const textColor = variant === "primary" ? Colors.background : Colors.text;

  return (
    <Pressable
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: S.md,
    paddingVertical: S.md,
    paddingHorizontal: S.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...Type.button,
    fontWeight: "600",
  },
});
