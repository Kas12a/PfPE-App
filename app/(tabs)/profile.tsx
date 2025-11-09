import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import {
  Button,
  Card,
  ListItem,
  Screen,
  SectionHeader,
} from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

export default function ProfileScreen() {
  const [notify, setNotify] = useState(false);
  const [loc, setLoc] = useState(true);

  return (
    <Screen>
      {/* Stats banner */}
      <Card style={styles.banner}>
        <Text style={styles.name}>Sara</Text>
        <Text style={styles.email}>sarahsorabi@gmail.com • joined 2025</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12 days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>23 days</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8 quests</Text>
            <Text style={styles.statLabel}>Average / week</Text>
          </View>
        </View>
        <Button title="Add Friends" onPress={() => {}} style={{ marginTop: space.md }} />
      </Card>

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <Card style={styles.prefRow}>
        <Text style={styles.prefText}>Allow Notifications</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </Card>
      <Card style={styles.prefRow}>
        <Text style={styles.prefText}>Allow Location Access</Text>
        <Switch value={loc} onValueChange={setLoc} />
      </Card>

      {/* Play Mode */}
      <SectionHeader title="Play Mode" />
      <View style={styles.playMode}>
        <Card style={[styles.modeCard, styles.modeOn]}>
          <Text style={styles.modeTitle}>Play as an{"\n"}Individual</Text>
        </Card>
        <Card style={styles.modeCard}>
          <Text style={styles.modeTitle}>Join a{"\n"}group</Text>
        </Card>
      </View>

      {/* Account & Security */}
      <SectionHeader title="Account & Security" />
      <ListItem title="Change Password" />
      <ListItem title="Privacy & Data" />
      <ListItem title="Log Out" right={<Text style={{ color: "#F66" }}>→</Text>} />

      {/* Help & Support */}
      <SectionHeader title="Help & Support" />
      <ListItem title="Help Center" />
      <ListItem title="Contact Us" />
      <ListItem title="About" />

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { marginHorizontal: space.lg, padding: space.lg },
  name: { color: colors.text, fontSize: 22, fontWeight: "900" },
  email: { color: colors.textDim, marginTop: 6 },
  stats: { flexDirection: "row", marginTop: 12 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: colors.text, fontWeight: "900" },
  statLabel: { color: colors.textDim, marginTop: 4, textAlign: "center" },
  prefRow: {
    marginHorizontal: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.md,
  },
  prefText: { color: colors.text, fontWeight: "600" },
  playMode: { flexDirection: "row", paddingHorizontal: space.lg, marginBottom: space.lg },
  modeCard: { flex: 1, marginRight: 8, padding: space.lg },
  modeOn: { borderWidth: 2, borderColor: colors.neon },
  modeTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
});
