import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import BadgeTile from "./BadgeTile";

type Props = {
  items?: any[];
};

export default function BadgeGrid({ items = [] }: Props) {
  if (!items.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Complete quests to earn your first badge.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {items.map((badge, i) => (
        <BadgeTile key={badge.id ?? badge.title ?? i} {...badge} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
    paddingHorizontal: space.lg,
    justifyContent: "space-between",
  },
  empty: {
    padding: space.lg,
    marginHorizontal: space.lg,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  emptyText: {
    color: colors.textDim,
    textAlign: "center",
  },
});
