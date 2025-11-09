// components/LeaderboardRow.tsx
import React from "react";
import { Image, Text, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import Card from "./Card";

export function LeaderboardRow({
  rank,
  name,
  pts,
  imageUri,
  highlight = false,
}: {
  rank: number;
  name: string;
  pts: number;
  imageUri?: string;
  highlight?: boolean;
}) {
  return (
    <Card
      style={{
        backgroundColor: highlight ? "#0F2B27" : undefined,
        borderColor: highlight ? Colors.brand : undefined,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text style={{ color: Colors.text, fontWeight: "800", fontSize: 18 }}>#{rank}</Text>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Colors.badge,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 36, height: 36 }} />
          ) : (
            <Text style={{ color: Colors.brand, fontWeight: "800" }}>🌿</Text>
          )}
        </View>
        <Text style={{ color: Colors.text, fontWeight: "700", flex: 1 }}>{name}</Text>
        <Text style={{ color: Colors.brand, fontWeight: "800" }}>{pts.toLocaleString()} pts</Text>
      </View>
    </Card>
  );
}
