import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

export type IconSymbolProps = {
  name: string;           // use Ionicons name on Android
  size?: number;
  weight?: "regular" | "semibold" | "bold"; // ignored for Ionicons
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function IconSymbol({
  name,
  size = 22,
  tintColor,
  style,
}: IconSymbolProps) {
  return <Ionicons name={name as any} size={size} color={tintColor} style={style} />;
}
