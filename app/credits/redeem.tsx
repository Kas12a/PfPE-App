import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, Screen, SectionHeader } from "../../components/ui";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";
import {
  CreditAccount,
  donateCredits,
  generateClientRequestId,
  getBalance,
  redeemCredits,
} from "../../src/lib/creditsService";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";

const rewardItems = [
  {
    id: "eco-market",
    name: "Eco Market • 10% off",
    partner: "Eco Market",
    description: "Redeem credits for a reusable starter kit.",
    cost: 250,
  },
  {
    id: "bike-share-week",
    name: "Bike Share Pass",
    partner: "City Cycle Share",
    description: "7 day community bike share pass.",
    cost: 320,
  },
  {
    id: "community-garden",
    name: "Community Garden Pack",
    partner: "Greensward Labs",
    description: "Receive seedlings + soil nutrient kit.",
    cost: 180,
  },
] as const;

const donationProjects = [
  {
    id: "tree-trust",
    name: "Tree Trust Nairobi",
    region: "Kenya",
    amount: 120,
    impact: "Youth mangrove planting crews",
  },
  {
    id: "urban-air-watch",
    name: "Urban Air Watch",
    region: "Lisbon",
    amount: 90,
    impact: "Deploy low-cost sensors via schools",
  },
] as const;

export default function RedeemCreditsScreen() {
  const { profile } = useProfile();
  const { showToast } = useToast();
  const [account, setAccount] = useState<CreditAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingRedeemId, setPendingRedeemId] = useState<string | null>(null);
  const [pendingDonationId, setPendingDonationId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!profile?.userId) return;
      setLoading(true);
      try {
        const acct = await getBalance();
        if (!cancelled) {
          setAccount(acct);
        }
      } catch (err) {
        if (!cancelled) showToast(err instanceof Error ? err.message : "Unable to load credits wallet");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.userId, showToast]);

  const refreshBalance = async () => {
    if (!profile?.userId) return;
    try {
      const acct = await getBalance();
      setAccount(acct);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to load credits wallet");
    }
  };

  const handleRedeem = async (item: (typeof rewardItems)[number]) => {
    if (!profile?.userId) {
      showToast("Sign in to redeem credits");
      return;
    }
    if (account && account.balance < item.cost) {
      showToast("Not enough credits for this reward");
      return;
    }
    const reqId = generateClientRequestId(`redeem-${item.id}`);
    setPendingRedeemId(item.id);
    try {
      const tx = await redeemCredits({
        itemId: item.id,
        itemName: item.name,
        cost: item.cost,
        metadata: { partner: item.partner },
        clientRequestId: reqId,
      });
      setAccount((prev) => (prev ? { ...prev, balance: tx.balance_after, total_earned: prev.total_earned } : prev));
      showToast("Reward redeemed – check your inbox for partner details.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to redeem");
    } finally {
      setPendingRedeemId(null);
    }
  };

  const handleDonate = async (project: (typeof donationProjects)[number]) => {
    if (!profile?.userId) {
      showToast("Sign in to donate credits");
      return;
    }
    if (account && account.balance < project.amount) {
      showToast("Not enough credits for this donation");
      return;
    }
    const reqId = generateClientRequestId(`donate-${project.id}`);
    setPendingDonationId(project.id);
    try {
      const tx = await donateCredits({
        projectId: project.id,
        projectName: project.name,
        amount: project.amount,
        metadata: { region: project.region, focus: project.impact },
        clientRequestId: reqId,
      });
      setAccount((prev) => (prev ? { ...prev, balance: tx.balance_after, total_earned: prev.total_earned } : prev));
      showToast("Donation logged – project stewards receive anonymised impact data.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to donate");
    } finally {
      setPendingDonationId(null);
    }
  };

  if (!profile?.userId) {
    return (
      <Screen>
        <SectionHeader title="Redeem credits" right={<Button title="Close" size="sm" variant="secondary" onPress={() => router.back()} />} />
        <Card>
          <Text style={styles.emptyTitle}>Sign in to continue</Text>
          <Text style={styles.emptySubtitle}>Only authenticated explorers can redeem or donate credits.</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Redeem credits" right={<Button title="Back" size="sm" variant="secondary" onPress={() => router.back()} />} />

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available credits</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{(account?.balance ?? 0).toFixed(0)}</Text>
          <Text style={styles.balanceUnit}>credits</Text>
        </View>
        <Button title="Refresh balance" variant="secondary" size="sm" onPress={refreshBalance} disabled={loading} style={styles.balanceRefresh} />
      </Card>

      <SectionHeader title="Marketplace perks" subtitle="Redeem inside the PfPE network" />
      {rewardItems.map((item) => (
        <Card key={item.id} style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>{item.name}</Text>
          <Text style={styles.rewardPartner}>{item.partner}</Text>
          <Text style={styles.rewardDescription}>{item.description}</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardCost}>{item.cost} credits</Text>
            <Button
              title="Redeem"
              size="sm"
              onPress={() => handleRedeem(item)}
              disabled={pendingRedeemId === item.id}
            />
          </View>
        </Card>
      ))}

      <SectionHeader title="Donate credits" subtitle="Channel your impact into field projects" />
      {donationProjects.map((project) => (
        <Card key={project.id} style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>{project.name}</Text>
          <Text style={styles.rewardPartner}>{project.region}</Text>
          <Text style={styles.rewardDescription}>{project.impact}</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardCost}>{project.amount} credits</Text>
            <Button
              title="Donate"
              size="sm"
              variant="secondary"
              onPress={() => handleDonate(project)}
              disabled={pendingDonationId === project.id}
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  balanceLabel: {
    color: colors.textDim,
    fontWeight: "600",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: space.sm,
    marginBottom: space.sm,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: "900",
    color: colors.text,
  },
  balanceUnit: {
    color: colors.textDim,
    marginLeft: space.sm,
  },
  balanceRefresh: {
    alignSelf: "flex-start",
  },
  rewardCard: {
    marginHorizontal: space.lg,
    marginBottom: space.md,
  },
  rewardTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16,
  },
  rewardPartner: {
    color: colors.textDim,
    marginTop: 4,
    fontWeight: "600",
  },
  rewardDescription: {
    color: colors.textDim,
    marginTop: 6,
  },
  rewardRow: {
    marginTop: space.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardCost: {
    color: colors.neon,
    fontWeight: "800",
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
  },
  emptySubtitle: {
    color: colors.textDim,
    marginTop: 6,
  },
});
