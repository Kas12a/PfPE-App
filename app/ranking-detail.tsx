import React from "react";
import { Text, View } from "react-native";

import Card from "../components/ui/Card";
import NeonButton from "../components/ui/NeonButton";
import Screen from "../components/ui/Screen";
import StatPill from "../components/ui/StatPill";

import { useProfile } from "../src/hooks/useProfile";
import { Colors } from "../src/theme/colors";
import { S } from "../src/theme/spacing";
import { Type } from "../src/theme/typography";


export default function RankingDetail() {
  const { profile } = useProfile();
  return (
    <Screen>
      <Text style={[Type.caption as any, { color: Colors.textMuted, marginTop: S.xl }]}>Back</Text>
      <Card elevated>
        <Text style={[Type.h2, { color: Colors.text }]}>#{profile.rank} YOU</Text>

        <View style={{ flexDirection: "row", gap: S.sm, marginTop: S.lg }}>
          <StatPill label="Points" value={profile.points.toLocaleString()} color={Colors.info} />
          <StatPill label="CO₂ Saved" value="8.4 kg" color={Colors.success} />
          <StatPill label="Energy Saved" value="12 kWh" color={Colors.warning} />
        </View>
      </Card>

      <Card>
        <Text style={[Type.title, { color: Colors.text, marginBottom: S.sm }]}>Recent Activities</Text>
        <Text style={[Type.body, { color: Colors.text }]}>Plant a tree — <Text style={{ color: Colors.neon }}>Completed</Text></Text>
        <Text style={[Type.body, { color: Colors.text, marginTop: 6 }]}>Walk to work — <Text style={{ color: Colors.neon }}>Completed</Text></Text>
      </Card>

      <NeonButton title="Share My Rank" onPress={() => { /* share logic */ }} />
    </Screen>
  );
}
