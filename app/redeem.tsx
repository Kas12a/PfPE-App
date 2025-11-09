// app/redeem.tsx
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "../components/ui/Button";
import ModalSheet from "../components/ui/ModalSheet";
import SectionHeader from "../components/ui/SectionHeader";

const byId: Record<string, { title: string; code: string; sub: string }> = {
  ecco: { title: "Reward Redeemed! 🎉", code: "ECCO-8F4PBS", sub: "10% off ecco store" },
  cafe: { title: "Reward Redeemed! 🎉", code: "CAFE-2JK9Q", sub: "Free coffee with reusable cup" },
  bike: { title: "Reward Redeemed! 🎉", code: "BIKE-1WEEK", sub: "1 week bike share" },
  plant: { title: "Reward Redeemed! 🎉", code: "PLANT-HERB", sub: "Starter herb kit" },
};

export default function RedeemModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = byId[id ?? "ecco"];

  return (
    <ModalSheet icon="🛍️" title="Play for Planet Earth">
      <SectionHeader title={data.title} subtitle={data.sub} />
      <Button label={`Code\n${data.code}`} style={{ marginTop: 16 }} />
      <View style={{ height: 16 }} />
      <Button label="Close" variant="secondary" onPress={() => router.back()} />
    </ModalSheet>
  );
}
