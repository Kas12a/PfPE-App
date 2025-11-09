import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

export type IconSymbolProps = {
  name: SymbolViewProps["name"];
  size?: number;
  weight?: SymbolWeight;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function IconSymbol({
  name,
  size = 22,
  weight = "regular",
  tintColor,
  style,
}: IconSymbolProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      weight={weight}
      tintColor={tintColor}
      style={style}
      resizeMode="scaleAspectFit"
    />
  );
}
