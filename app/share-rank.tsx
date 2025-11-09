// app/share-rank.tsx
import { router } from "expo-router";
import React from "react";
import Button from "../components/ui/Button";
import ModalSheet from "../components/ui/ModalSheet";
import SectionHeader from "../components/ui/SectionHeader";

export default function ShareRankModal() {
  return (
    <ModalSheet icon="🌱" title="Play for Planet Earth">
      <SectionHeader title="#7" subtitle="In Global Rankings!" />
      <SectionHeader title="2,450" subtitle="Points" accent="blue" />
      <SectionHeader title="8.4 kg" subtitle="CO₂ Saved" accent="green" />
      <SectionHeader title="12 kWh" subtitle="Energy Saved" accent="yellow" />
      <Button label="Share" style={{ marginTop: 16 }} onPress={() => router.back()} />
    </ModalSheet>
  );
}
