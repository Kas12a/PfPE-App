import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";
import { Type } from "../../src/theme/typography";

export default function NeonButton({
  title,
  onPress,
  style,
}: { title: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }, style]}>
      <Text style={[Type.title, { color: "#111" }]}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.neon,
    borderRadius: 22,
    paddingVertical: S.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
