import { router } from "expo-router";
import React from "react";
import Card from "../../components/ui/Card";
import ListItem from "../../components/ui/ListItem";
import Pills from "../../components/ui/Pills";
import Screen from "../../components/ui/Screen";
import { S } from "../../src/theme/spacing";

const filters = ["All", "Nature", "Energy", "Movement", "Waste", "Community", "Mindful"];

const quests = [
  {
    id: "plant-tree",
    icon: "🌳",
    title: "Plant a tree",
    subtitle: "Help reforest your local area",
    badge: "Medium · 45 min",
    impact: "🌱 5 kg CO₂ offset/year",
    points: "+100",
  },
  {
    id: "unplug",
    icon: "🔌",
    title: "Unplug devices overnight",
    subtitle: "Save energy while you sleep",
    badge: "Easy · 5 min",
    impact: "🌱 0.5 kWh saved",
    points: "+20",
  },
  {
    id: "walk-bike",
    icon: "🚴‍♂️",
    title: "Walk or bike to work",
    subtitle: "Choose active transportation",
    badge: "Easy · 30 min",
    impact: "🌱 1.5 kg CO₂ saved",
    points: "+30",
  },
];

export default function QuestsScreen() {
  const [active, setActive] = React.useState("All");

  return (
    <Screen title="Quests" subtitle="Choose your next eco-adventure">
      <Pills items={filters} active={active} onChange={setActive} />

      {quests.map((q, i) => (
        <Card key={q.id} style={{ marginTop: i ? S.md : S.lg }}>
          <ListItem
            left={q.icon}
            title={q.title}
            subtitle={q.subtitle}
            rightLabel={`${q.points} pts`}
            footerLeft={`🟡 ${q.badge}`}
            footerRight={q.impact}
            chevron
            onPress={() => router.push(`/quest/${q.id}`)}
          />
        </Card>
      ))}
    </Screen>
  );
}
