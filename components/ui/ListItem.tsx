import React from "react";
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

type Props = {
  icon?: any;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

/** Simple row card used for quests & recent activities */
export default function ListItem({ icon, title, subtitle, right, style, onPress }: Props) {
  const Content = (
    <>
      {icon && <Image source={icon} style={styles.icon} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {right}
    </>
  );

  return onPress ? (
    <Pressable style={[styles.row, style]} onPress={onPress}>{Content}</Pressable>
  ) : (
    <View style={[styles.row, style]}>{Content}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: space.lg,
    marginBottom: space.md,
  },
  icon: { width: 36, height: 36, borderRadius: 8, marginRight: space.md },
  title: { color: colors.text, fontWeight: "600", fontSize: 16 },
  subtitle: { color: colors.textDim, marginTop: 4 },
});
