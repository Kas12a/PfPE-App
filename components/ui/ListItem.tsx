import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { shadows } from "../../src/theme/shadows";
import { S } from "../../src/theme/spacing";

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;        // e.g. emoji or icon
  right?: React.ReactNode;       // e.g. “Completed”, points, chevron
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  rounded?: "lg" | "xl";         // visual tweak per Figma
};

function ListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  disabled,
  style,
  rounded = "xl",
}: Props) {
  const radius = rounded === "xl" ? 18 : 14;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.container,
        { borderRadius: radius, opacity: pressed ? 0.96 : 1 },
        style,
      ]}
    >
      {left ? <View style={[styles.left, { borderRadius: radius - 8 }]}>{left}</View> : null}

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    backgroundColor: Colors.card,        // fits our dark theme
    ...shadows.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.cardBorder,
  },
  left: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.cardMuted,
    marginRight: S.md,
  },
  center: { flex: 1 },
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    color: Colors.textMuted,
    fontSize: 14,
  },
  right: { marginLeft: S.md, alignItems: "flex-end", justifyContent: "center" },
});

export default ListItem;
