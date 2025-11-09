// components/TabBarIcon.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "../../src/theme/colors";

export function TabBarIcon({
  name,
  focused,
  size = 22,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  focused: boolean;
  size?: number;
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={focused ? Colors.brand : "rgba(233,241,236,0.6)"}
    />
  );
}
