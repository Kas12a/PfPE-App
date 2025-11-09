// components/ui/BadgeGrid.tsx
import React from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { shadows } from "../../src/theme/shadows";
import { S } from "../../src/theme/spacing";

export type BadgeItem = {
  id: string;
  title: string;
  icon?: any;           // require(...) or { uri: string }
  locked?: boolean;
};

type Props = {
  badges: BadgeItem[];
  onPressBadge?: (badge: BadgeItem) => void;
};

const ITEM_SIZE = 108;

function BadgeGrid({ badges, onPressBadge }: Props) {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={badges}
      keyExtractor={(b) => b.id}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPressBadge?.(item)}
          disabled={item.locked}
          style={({ pressed }) => [
            styles.item,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            item.locked && styles.locked,
          ]}
        >
          <View style={styles.iconWrap}>
            {item.icon ? (
              typeof item.icon === "number" ? (
                <Image source={item.icon} style={styles.icon} />
              ) : (
                <Image source={{ uri: item.icon }} style={styles.icon} />
              )
            ) : null}
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: S.lg,
    paddingTop: S.md,
    paddingBottom: S.xl,
    gap: S.md,
  },
  item: {
    width: "31.5%",              // responsive 3-column grid
    marginHorizontal: "1.0%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: S.md,
    ...shadows.card,
  },
  iconWrap: {
    width: ITEM_SIZE * 0.45,
    height: ITEM_SIZE * 0.45,
    borderRadius: 16,
    backgroundColor: Colors.cardElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: S.sm,
  },
  icon: { width: "70%", height: "70%", resizeMode: "contain" },
  title: { color: Colors.text, fontSize: 14, textAlign: "center", lineHeight: 18 },
  locked: { opacity: 0.45 },
});

export default BadgeGrid;
