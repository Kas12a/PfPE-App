// app/(tabs)/rewards.tsx
import { router } from "expo-router";
import { View } from "react-native";
// app/(tabs)/rewards.tsx
import BadgeGrid from "../../components/ui/BadgeGrid.tsx"; // <-- note .tsx and default
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import GradientCard from "../../components/ui/GradientCard";
import ListItem from "../../components/ui/ListItem";
import Screen from "../../components/ui/Screen";
import SectionHeader from "../../components/ui/SectionHeader";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

const badges = [
  { title: "Tree Guardian", icon: "🌳", earned: true },
  { title: "Plastic-Free Hero", icon: "♻️", earned: true },
  { title: "Energy Saver", icon: "⚡", earned: true },
  { title: "7-Day Streak", icon: "🔥", earned: true },
  { title: "Solar Hero", icon: "🔒", earned: false },
  { title: "Ecco Warrior", icon: "🔒", earned: false },
];

const offers = [
  { id: "ecco", title: "Ecco Store", subtitle: "15% off entire purchase", cost: 500 },
  { id: "cafe", title: "Green Cafe", subtitle: "Free coffee with reusable cups", cost: 200 },
  { id: "bike", title: "Bike Share", subtitle: "1 week free membership", cost: 300 },
  { id: "plant", title: "Plant Box", subtitle: "Free starter herb garden", cost: 400 },
];

const recent = [
  { title: "Bike to Work", day: "Today", pts: 50 },
  { title: "Zero Waste Lunch", day: "Today", pts: 15 },
  { title: "Daily Quest Streak", day: "Yesterday", pts: 70 },
];

export default function RewardsScreen() {
  return (
    <Screen title="Rewards" subtitle="Celebrate your impact">
      {/* Milestone gradient card */}
      <GradientCard
        title="Next Milestone"
        leftValue="2,450"
        leftLabel="current points"
        rightValue="550"
        rightLabel="pts to next reward"
        progress={0.82}
        style={{ marginTop: S.sm }}
      />

      {/* Badges */}
      <SectionHeader title="My Badges" style={{ marginTop: S.xl }} />
      <BadgeGrid items={badges} />

      {/* Available rewards */}
      <SectionHeader title="Available Rewards" style={{ marginTop: S.xl }} />

      {offers.map((o) => (
        <Card key={o.id} style={{ marginTop: S.md }}>
          <ListItem
            left="🛍️"
            title={o.title}
            subtitle={o.subtitle}
            right={
              <Button
                compact
                label="Redeem"
                onPress={() => router.push({ pathname: "/redeem", params: { id: o.id } })}
              />
            }
            footerLeft="🎁"
            footerRight={`${o.cost} pts`}
          />
        </Card>
      ))}

      {/* Recent points */}
      <SectionHeader title="Recent Points" style={{ marginTop: S.xl }} />
      {recent.map((r, i) => (
        <Card key={i} style={{ marginTop: S.md, backgroundColor: Colors.brandBlue }}>
          <ListItem title={r.title} subtitle={r.day} rightLabel={`+${r.pts} pts`} />
        </Card>
      ))}

      <View style={{ height: S.xl }} />
    </Screen>
  );
}
