import { Image, StyleSheet, View } from "react-native";
import { Button, Card, ListItem, ProgressBar, Screen, Section, SectionHeader } from "../../components/ui";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";


const LEAF =
  "https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200";

const todaysQuests = [
  { icon: "👟", title: "Walk to work", sub: "1.2 kg CO₂ saved", pts: "+30 pts" },
  {
    icon: "☕",
    title: "Using reusable coffee cup",
    sub: "0.3 kg waste avoided",
    pts: "+15 pts",
  },
  { icon: "🥗", title: "Plant-based lunch", sub: "2.5 kg CO₂ saved", pts: "+25 pts" },
];

export default function HomeScreen() {
  return (
    <Screen
      title="Hi, Sara 👋"
      subtitle="Let’s make today count"
    >
      {/* points card with leaf bg + strike badge */}
      <Card style={styles.pointsCard}>
        <Image source={{ uri: LEAF }} style={styles.pointsImg} resizeMode="cover" />
        <View style={styles.pointsOverlay} />
        <View style={styles.pointsContent}>
          <SectionHeader title="Your Eco Points" />
          <View style={{ height: S.sm }} />
          <SectionHeader title="2,450" subtitle="This Week" />
          <View style={{ height: S.xs }} />
          <SectionHeader title="+320 pts" subtitle="Rank" />
          <View style={{ flex: 1 }} />
          <Button compact label="🔥  7 Day Strike" />
        </View>
      </Card>

      <SectionHeader
        title="Today’s Quests"
        rightText="View All"
        style={{ marginTop: S.lg }}
      />

      <Section>
        {todaysQuests.map((q, i) => (
          <Card key={i} style={{ marginTop: i === 0 ? 0 : S.md }}>
            <ListItem
              left={q.icon}
              title={q.title}
              subtitle={q.sub}
              rightLabel={q.pts}
            />
          </Card>
        ))}
      </Section>

      {/* weekly challenge */}
      <Card style={{ marginTop: S.lg, backgroundColor: Colors.cardAlt }}>
        <SectionHeader title="⚡ Weekly Challenge" subtitle="Complete 15 quests this week" />
        <View style={{ height: S.md }} />
        <SectionHeader title="11 of 15 quests" subtitle="73%" />
        <ProgressBar progress={0.73} style={{ marginTop: S.sm }} />
        <View style={{ height: S.md }} />
        <Button compact variant="secondary" label="🏅  Reward: Eco Hero Badge • +100 points" />
      </Card>

      {/* Impact grid */}
      <Card style={{ marginTop: S.lg }}>
        <SectionHeader title="🕒 Your Impact This Week" />
        <View style={styles.impactGrid}>
          <ImpactBox value="8.4 kg" label="CO₂ Saved" tint="green" />
          <ImpactBox value="2.1 kg" label="Waste Avoided" tint="blue" />
          <ImpactBox value="12 kWh" label="Energy Saved" tint="yellow" />
          <ImpactBox value="5.5 hrs" label="Active Hours" tint="purple" />
        </View>
      </Card>

      <View style={{ height: S.xl }} />
    </Screen>
  );
}

function ImpactBox({
  value,
  label,
  tint,
}: {
  value: string;
  label: string;
  tint: "green" | "blue" | "yellow" | "purple";
}) {
  return (
    <View style={[styles.impactBox, styles[`tint_${tint}` as const]]}>
      <SectionHeader title={value} subtitle={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  pointsCard: { padding: 0, overflow: "hidden" },
  pointsImg: { width: "100%", height: 140 },
  pointsOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  pointsContent: {
    ...StyleSheet.absoluteFillObject,
    padding: S.lg,
    justifyContent: "space-between",
  },
  impactGrid: {
    marginTop: S.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: S.md,
    justifyContent: "space-between",
  },
  impactBox: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: S.lg,
    paddingHorizontal: S.md,
    backgroundColor: Colors.cardAlt,
  },
  tint_green: { borderColor: "#53d18a33", borderWidth: 1 },
  tint_blue: { borderColor: "#7cb7ff33", borderWidth: 1 },
  tint_yellow: { borderColor: "#ffd24d33", borderWidth: 1 },
  tint_purple: { borderColor: "#b08cff33", borderWidth: 1 },
});
