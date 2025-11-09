import React from "react";
import { StyleSheet, View } from "react-native";
import { space } from "../../src/theme/spacing";
import BadgeTile from "./BadgeTile";

/** Renders a 3-column grid of badges. Pass items like:
 * [{ icon: require("..."), title: "Tree Guardian", locked: false }, ...]
 */
export default function BadgeGrid({ items = [] as any[] }) {
  return (
    <View style={styles.grid}>
      {items.map((b, i) => (
        <View key={i} style={styles.item}>
          <BadgeTile {...b} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: space.lg,
  },
  item: {
    width: "33.333%",
    padding: space.sm,
  },
});
