import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
}>;

export default function Card({ children, style }: Props) {
  return <View style={[styles.card, Array.isArray(style) ? style : [style]]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: S.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.cardBorder,
  },
});
