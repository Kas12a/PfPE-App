import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { Colors } from "../../src/theme/colors";
import { Type } from "../../src/theme/typography";

/**
 * Simple themed Text that uses PFPE tokens.
 * Props:
 *  - variant: "title" | "subtitle" | "body" | "caption" | "button"
 */
type Props = TextProps & {
  variant?: "title" | "subtitle" | "body" | "caption" | "button";
  muted?: boolean;
};

export default function ThemedText({
  variant = "body",
  muted,
  style,
  ...rest
}: Props) {
  const baseStyle =
    variant === "title"
      ? styles.title
      : variant === "subtitle"
      ? styles.subtitle
      : variant === "caption"
      ? styles.caption
      : variant === "button"
      ? styles.button
      : styles.body;

  return (
    <Text
      {...rest}
      style={[
        baseStyle,
        { color: muted ? Colors.textMuted : baseStyle.color ?? Colors.text },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  title: { ...Type.title, color: Colors.text },
  subtitle: { ...Type.subtitle, color: Colors.text },
  body: { ...Type.body, color: Colors.text },
  caption: { ...Type.caption, color: Colors.textMuted },
  button: { ...Type.button, color: Colors.text },
});
