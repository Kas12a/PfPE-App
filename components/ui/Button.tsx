import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";
import { Type } from "../../src/theme/typography";

type Props = {
  title?: string; // prefer title
  label?: string; // backward-compat alias used in some screens
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  disabled?: boolean;
};

export default function Button({ title, label, onPress, style, variant = "primary", size = "md", disabled = false }: Props) {
  const backgroundColor = variant === "primary" ? Colors.accent : Colors.surface;
  const textColor = variant === "primary" ? Colors.background : Colors.text;
  const text = title ?? label ?? "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        size === "sm" && styles.buttonSm,
        variant === "secondary" && styles.secondary,
        {
          backgroundColor,
          opacity: disabled ? 0.4 : pressed ? 0.92 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "sm" && styles.textSm,
          { color: textColor },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: S.lg,
    paddingHorizontal: S.xl,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonSm: {
    paddingVertical: S.sm,
    paddingHorizontal: S.md,
    minHeight: 34,
    borderRadius: 10,
  },
  secondary: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.cardBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    ...Type.button,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
