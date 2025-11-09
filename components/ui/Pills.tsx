// components/Pills.tsx
import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";

export function Pill({
  label,
  active = false,
  icon,
}: {
  label: string;
  active?: boolean;
  icon?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: active ? Colors.brand : Colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon ? <Text style={{ fontSize: 16 }}>{icon}</Text> : null}
      <Text
        style={{
          color: active ? "#0E1A0E" : Colors.text,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View
      style={{
        height: 8,
        backgroundColor: Colors.surface,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          height: "100%",
          backgroundColor: Colors.brand,
        }}
      />
    </View>
  );
}
