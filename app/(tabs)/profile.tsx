import React from "react";
import { Image, StyleSheet, Switch, View } from "react-native";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ListItem from "../../components/ui/ListItem";
import Screen from "../../components/ui/Screen";
import SectionHeader from "../../components/ui/SectionHeader";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

const BANNER =
  "https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200";

export default function ProfileScreen() {
  const [notif, setNotif] = React.useState(true);
  const [loc, setLoc] = React.useState(true);

  return (
    <Screen title="Profile">
      {/* header stat banner */}
      <Card style={styles.banner}>
        <Image source={{ uri: BANNER }} style={styles.bannerImg} />
        <View style={styles.overlay} />
        <View style={styles.bannerContent}>
          <View style={styles.avatar} />
          <SectionHeader title="Sara" subtitle="sarahsorabi@gmail.com" />
          <SectionHeader title="joined 2025" />
          <View style={styles.statsRow}>
            <HeaderMetric value="12 days" label="Current Streak" accent="green" />
            <HeaderMetric value="23 days" label="Longest Streak" accent="blue" />
            <HeaderMetric value="8 quests" label="Average per week" accent="yellow" />
          </View>
        </View>
      </Card>

      {/* quick counts */}
      <View style={styles.countsRow}>
        <CountCell label="Quests" value="38" />
        <CountCell label="Following" value="1" />
        <CountCell label="Follower" value="4" />
      </View>

      <Button variant="secondary" label="Add Friends" style={{ marginTop: S.md }} />

      {/* Preferences */}
      <SectionHeader title="Preferences" style={{ marginTop: S.xl }} />
      <Card style={{ marginTop: S.md }}>
        <ListItem
          left="🔔"
          title="Allow Notifications"
          right={<Switch value={notif} onValueChange={setNotif} />}
        />
        <ListItem
          left="📍"
          title="Allow Location Access"
          right={<Switch value={loc} onValueChange={setLoc} />}
        />
      </Card>

      {/* Play Mode */}
      <SectionHeader title="Play Mode" style={{ marginTop: S.xl }} />
      <View style={styles.modeRow}>
        <ModeCard title="Play as an\nIndividual" active />
        <ModeCard title="Join a\ngroup" />
      </View>

      {/* Account & Security */}
      <SectionHeader title="Account & Security" style={{ marginTop: S.xl }} />
      <Card style={{ marginTop: S.md }}>
        <ListItem left="🔒" title="Change Password" chevron />
        <ListItem left="🛡️" title="Privacy & Data" chevron />
        <ListItem left="↪️" title="Log Out" rightLabel="" rightTextColor="#ff5a5a" />
      </Card>

      {/* Help & Support */}
      <SectionHeader title="Help & Support" style={{ marginTop: S.xl }} />
      <Card style={{ marginTop: S.md }}>
        <ListItem left="❓" title="Help Center" chevron />
        <ListItem left="☎️" title="Contact Us" chevron />
        <ListItem left="ℹ️" title="About" chevron />
      </Card>

      <View style={{ height: S.xl }} />
    </Screen>
  );
}

function HeaderMetric({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: "green" | "blue" | "yellow";
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <SectionHeader title={value} subtitle={label} accent={accent} />
    </View>
  );
}

function CountCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.countCell}>
      <SectionHeader title={value} subtitle={label} />
    </View>
  );
}

function ModeCard({ title, active }: { title: string; active?: boolean }) {
  return (
    <Card
      style={[
        styles.modeCard,
        active && { borderWidth: 1.5, borderColor: Colors.neon },
      ]}
    >
      <SectionHeader title={title} />
    </Card>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 0, overflow: "hidden" },
  bannerImg: { width: "100%", height: 160 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  bannerContent: { ...StyleSheet.absoluteFillObject, padding: S.lg, justifyContent: "flex-end", gap: S.xs },
  avatar: {
    position: "absolute",
    top: S.lg,
    left: S.lg,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.neon,
    opacity: 0.9,
  },
  statsRow: {
    marginTop: S.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countsRow: {
    marginTop: S.md,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: S.md,
  },
  countCell: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: S.lg,
    alignItems: "center",
  },
  modeRow: {
    marginTop: S.md,
    flexDirection: "row",
    gap: S.md,
  },
  modeCard: {
    flex: 1,
    backgroundColor: "#2b3a37",
    paddingVertical: S.xl,
  },
});
