import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../src/theme/colors";

type BadgeTileProps = {
  label?: string;
  title?: string;
  icon?: any;
  locked?: boolean;
};

export default function BadgeTile({ label, title, icon, locked = false }: BadgeTileProps) {
  const text = label ?? title ?? "";
  const renderIcon = () => {
    if (!icon) return <Text style={styles.emoji}>🏅</Text>;
    if (typeof icon === "string") {
      return <Text style={styles.emoji}>{icon}</Text>;
    }
    if (typeof icon === "number") {
      return <Image source={icon} style={{ width: 28, height: 28 }} />;
    }
    return icon;
  };

  return (
    <View style={[styles.card, locked && styles.cardLocked]}>
      <View style={[styles.iconWrap, locked && styles.iconLocked]}>{renderIcon()}</View>
      <Text style={[styles.label, locked && styles.labelLocked]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "31%",
    minWidth: 108,
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardLocked: {
    opacity: 0.6,
    borderStyle: "dashed",
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(217,255,63,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLocked: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  labelLocked: {
    color: colors.textDim,
  },
});
